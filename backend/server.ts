import express from 'express';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import osc from 'osc';
import abletonlink from 'abletonlink';
import cors from 'cors';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

// Configuration
const config = {
  x32: {
    host: '192.168.178.69', // Default X32 IP - should be configurable
    port: 10023
  },
  server: {
    port: 3001
  }
};

// State
let channelGroups = [
  { id: 1, name: 'Group 1', channels: [] },
  { id: 2, name: 'Group 2', channels: [] },
  { id: 3, name: 'Group 3', channels: [] },
  { id: 4, name: 'Group 4', channels: [] }
];
let activeGroup = 0;
let isAutoSwitching = false;
let switchInterval = 4; // bars

// OSC Client for X32
const oscClient = new osc.UDPPort({
  localAddress: '0.0.0.0',
  localPort: 57121,
  remoteAddress: config.x32.host,
  remotePort: config.x32.port,
  metadata: true
});

// Ableton Link
const link = new abletonlink();
link.enable()

// Express middleware
app.use(cors());
app.use(express.json());

// REST API endpoints
app.get('/api/groups', (req, res) => {
  res.json(channelGroups);
});

app.get('/api/x32/channels', async (req, res) => {
  // Query each channel's mute state via OSC: send "/ch/XX/mix/on" and await a response.
  const timeoutMs = 500;
  const states: Record<number, number|null> = {};
  const pending: Promise<void>[] = [];

  for (let ch = 1; ch <= 32; ch++) {
    const idx = ch;
    pending.push(new Promise(resolve => {
      const address = `/ch/${String(idx).padStart(2, '0')}/mix/on`;
      let done = false;
      function onMessage(msg: any) {
        if (msg.address === address && Array.isArray(msg.args) && msg.args.length > 0) {
          const val = msg.args[0].value;
          states[idx] = (typeof val === 'number' ? val : null);
          oscClient.removeListener('message', onMessage);
          done = true;
          resolve();
        }
      }
      oscClient.on('message', onMessage);
      // send query; X32 will reply with the same address plus int argument
      try {
        oscClient.send({ address, args: [] });
      } catch (_) {
        // ignore send errors
      }
      // after timeout, if no response, set null
      setTimeout(() => {
        if (!done) {
          oscClient.removeListener('message', onMessage);
          states[idx] = null;
          resolve();
        }
      }, timeoutMs);
    }));
  }
  // Await all queries
  await Promise.all(pending);
  res.json(states);
});


app.put('/api/groups/:id', (req, res) => {
  const groupId = parseInt(req.params.id);
  const group = channelGroups.find(g => g.id === groupId);
  if (group) {
    Object.assign(group, req.body);
    broadcastState();
    res.json(group);
  } else {
    res.status(404).json({ error: 'Group not found' });
  }
});

app.get('/api/status', (req, res) => {
  res.json({
    activeGroup,
    isAutoSwitching,
    switchInterval,
    linkEnabled: link.getLinkEnable(),
    linkTempo: link.bpm,
    linkBeats: link.beat
  });
});

app.post('/api/switch/:groupId?', (req, res) => {
  const raw = req.params.groupId;
  const parsed = raw !== undefined ? parseInt(raw, 10) : NaN;
  console.log(`Manual switch request, raw param: ${raw}`);
  let target:number;
  if (raw === undefined || isNaN(parsed)) {
    // no index or not a number: switch to next
    target = (activeGroup + 1) % channelGroups.length;
  } else {
    target = parsed;
  }
  if (target >= 0 && target < channelGroups.length) {
    switchGroup(target);
    res.json({ success: true, activeGroup });
  } else {
    res.status(400).json({ error: 'Invalid group ID' });
  }
});


app.post('/api/auto-switch', (req, res) => {
  const { enabled, interval } = req.body;
  isAutoSwitching = enabled;
  if (interval) switchInterval = interval;
  broadcastState();
  res.json({ success: true, isAutoSwitching, switchInterval });
});

app.post('/api/config/x32', (req, res) => {
  const { host, port } = req.body;
  if (host) config.x32.host = host;
  if (port) config.x32.port = port;

  // Reconnect OSC client
  oscClient.close();
  oscClient.options.remoteAddress = config.x32.host;
  oscClient.options.remotePort = config.x32.port;
  oscClient.open();

  res.json({ success: true, config: config.x32 });
});

app.post('/api/link/tempo', (req, res) => {
  const { tempo } = req.body;
  if (tempo && tempo >= 60 && tempo <= 200) {
    link.bpm = tempo;
    broadcastState();
    res.json({ success: true, tempo: link.bpm });
  } else {
    res.status(400).json({ error: 'Invalid tempo. Must be between 60 and 200 BPM.' });
  }
});


// Test endpoint to manually trigger next group switch
app.post('/api/test/next-group', (req, res) => {
  console.log('Test: switching to next group');
  const nextGroup = (activeGroup + 1) % channelGroups.length;
  switchGroup(nextGroup);
  res.json({ success: true, activeGroup, nextGroup });
});

// X32 status check endpoint
app.get('/api/x32/status', async (req, res) => {
  let responded = false;
  const timeout = setTimeout(() => {
    if (!responded) {
      oscClient.removeListener('message', onMessage);
      res.json({ found: false });
    }
  }, 1000);

  function onMessage(msg) {
    // Accept any message as a sign the X32 is alive
    responded = true;
    clearTimeout(timeout);
    oscClient.removeListener('message', onMessage);
    res.json({ found: true });
  }

  oscClient.on('message', onMessage);
  try {
    oscClient.send({ address: '/xinfo', args: [] });
  } catch (e) {
    clearTimeout(timeout);
    oscClient.removeListener('message', onMessage);
    res.json({ found: false });
  }
});

// WebSocket handling
wss.on('connection', (ws) => {
  console.log('Client connected');

  // Send initial state
  ws.send(JSON.stringify({
    type: 'state',
    data: {
      groups: channelGroups,
      activeGroup,
      isAutoSwitching,
      switchInterval,
      linkStatus: {
        enabled: link.getLinkEnable(),
        tempo: link.bpm,
        beats: link.beat,
        currentBeat: currentBeat,
        beatsPerBar: beatsPerBar,
        currentBar: currentBar
      }
    }
  }));

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// OSC Functions
  function switchGroup(groupIndex:number|undefined) {
    if (groupIndex === undefined) {
      // no index provided: next group
      groupIndex = (activeGroup + 1) % channelGroups.length;
    }
    if (typeof groupIndex !== 'number' || groupIndex < 0 || groupIndex >= channelGroups.length) return;
    const previousGroup = activeGroup;
    activeGroup = groupIndex;


  // Mute all channels first
  channelGroups.forEach((group, index) => {
    group.channels.forEach(channel => {
      sendMuteCommand(channel, true);
    });
  });

  // Unmute active group channels
  channelGroups[activeGroup].channels.forEach(channel => {
    sendMuteCommand(channel, false);
  });

  console.log(`Switched from group ${previousGroup + 1} to group ${activeGroup + 1}`);

  // Force immediate state broadcast to ensure frontend updates
  setTimeout(() => {
    broadcastState();
  }, 50); // Small delay to ensure OSC commands are processed
}

function sendMuteCommand(channel, mute) {
  if (!channel || channel < 1 || channel > 32) return;

  const address = `/ch/${channel.toString().padStart(2, '0')}/mix/on`;
  const value = mute ? 0 : 1; // X32: 0 = muted, 1 = unmuted

  oscClient.send({
    address,
    args: [{ type: 'i', value }]
  });

  console.log(`Channel ${channel}: ${mute ? 'MUTED' : 'UNMUTED'}`);
}

function broadcastState() {
  const state = {
    type: 'state',
    data: {
      groups: channelGroups,
      activeGroup,
      isAutoSwitching,
      switchInterval,
      linkStatus: {
        enabled: link.isLinkEnable,
        tempo: link.bpm,
        beats: link.beat,
        currentBeat: currentBeat,
        beatsPerBar: beatsPerBar,
        currentBar: currentBar
      }
    }
  };

  console.log(`Broadcasting state - activeGroup: ${activeGroup}, clients: ${wss.clients.size}`);

  wss.clients.forEach(client => {
    if (client.readyState === 1) { // WebSocket.OPEN
      client.send(JSON.stringify(state));
    }
  });
}

// Ableton Link integration
let lastBeat = 0;
let currentBeat = 0;
let currentBar = 0;
const beatsPerBar = 4;

// Initialize
oscClient.on('ready', () => {
  console.log('OSC Client ready, connected to X32');
});

oscClient.on('error', (error) => {
  console.error('OSC Error:', error);
});

oscClient.open();

// Start Ableton Link monitoring
link.startUpdate(10, (beat, phase, bpm, playState) => {
  // This callback is called every 10ms with updated Link data
  const newBeat = Math.floor(beat);

  if (newBeat !== lastBeat) {
    lastBeat = newBeat;
    currentBeat = newBeat % beatsPerBar;
    currentBar = Math.floor(newBeat / beatsPerBar);

    // Broadcast state update for beat visualization
    broadcastState();

    if (isAutoSwitching) {
      console.log(`Auto-switching enabled. Beat: ${newBeat}, Bar: ${currentBar}, PlayState: ${playState}`);

      // Check if we should switch based on bar boundaries
      const barsPerSwitch = switchInterval;
      const currentBarInLoop = currentBar % barsPerSwitch;

      // Switch at the start of each interval (when currentBarInLoop === 0 and we're on beat 0)
      // Temporarily allow switching even when playState is false for testing
      if (currentBarInLoop === 0 && currentBeat === 0) {
        console.log(`Switching to next group at bar ${currentBar} (playState: ${playState})`);
        const nextGroup = (activeGroup + 1) % channelGroups.length;
        switchGroup(nextGroup);
      }
    }
  }
});

// Start server
server.listen(config.server.port, () => {
  console.log(`X32 Switcher backend running on port ${config.server.port}`);
  console.log(`Configured for X32 at ${config.x32.host}:${config.x32.port}`);
  console.log(`Ableton Link enabled: ${link.isLinkEnable}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down...');
  oscClient.close();
  link.stopUpdate();
  link.isLinkEnable = false;
  server.close();
  process.exit(0);
});
