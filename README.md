# X32 Channel Group Switcher

A web-based tool to control 4 channel groups on a Behringer X32 mixing console via OSC, synchronized to Ableton Link. Configure which channels belong to each group, and the tool will automatically mute all but one group, switching to the next group in sync with the Ableton Link clock.

## Features
- Configure 4 channel groups (user-selectable channels per group)
- Only one group is unmuted at a time; others are muted
- Switches to the next group in sync with Ableton Link (e.g., every bar/beat)
- Web UI for configuration and manual override
- OSC communication with X32 mixer

## Architecture

```
+-------------------+        WebSocket/REST        +-------------------+
|                   | <--------------------------> |                   |
|   Lit/Webvis UI   |                              |   Node.js Server  |
|  (Frontend)       |               -------------> |                   |
+-------------------+               |              +-------------------+
                                    |                   |      ^
+-------------------+ <--------------                   |      |
|                   |                                   v      |
| pi zero           |                           +-------------------+
| hardware buttons  |                           |   Ableton Link    |
+-------------------+                           |   OSC to X32      |
                                                +-------------------+
```

- **Frontend:** Lit + Webvis for a modern, reactive UI. Lets users configure groups and monitor/switch active group.
- **Backend:** Node.js server handles OSC (to X32) and Ableton Link clock. Exposes API for frontend.
- **OSC:** Backend sends mute/unmute commands to X32.
- **Ableton Link:** Backend listens to clock and triggers group switching.
**Pi Zero:** Has 2 buttons connected to the network, which send simple requests to the server

## Technology Stack
- **Frontend:** Lit, Vite, TypeScript
- **Backend:** Node.js, `osc`, `abletonlink`, Express, WebSocket
- **Communication:** REST + WebSocket between frontend and backend

## Quick Setup

1. **Run the setup script:**
   ```bash
   ./setup.sh
   ```

2. **Start the application:**
   ```bash
   pnpm run dev:all
   ```

3. **Open your browser:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

## Manual Setup

1. **Install frontend dependencies:**
   ```bash
   pnpm install
   ```

2. **Install backend dependencies:**
   ```bash
   cd backend
   pnpm install
   cd ..
   ```

3. **Build native addons:**
   ```bash
   pnpm run build:native
   ```

4. **Start backend server:**
   ```bash
   pnpm run dev:backend
   ```

4. **Start frontend (in another terminal):**
   ```bash
   pnpm run dev
   ```

## Prerequisites

The backend uses native Node.js addons, so you'll need build tools:

**Linux:**
```bash
sudo apt update && sudo apt install -y build-essential python3-dev
```

<details>
<summary>Other platforms (click to expand)</summary>

- **macOS:** `xcode-select --install`
- **Windows:** `pnpm install --global windows-build-tools`
- **All platforms:** Python 3.x (Python 2.7 also supported)

</details>

## Configuration

1. **X32 Setup:**
   - Enable OSC on your X32 (Setup → Network → OSC)
   - Note the X32's IP address
   - Configure the IP in the web interface

2. **Ableton Link:**
   - Start Ableton Live
   - Enable Link in Live's preferences
   - The backend will automatically connect to Link

3. **Channel Groups:**
   - Use the web interface to configure which channels belong to each group
   - Enter channel numbers as comma-separated values (e.g., "1, 2, 3, 4")

## Usage

1. **Configure Groups:** Set up your 4 channel groups with the desired channels
2. **Manual Switching:** Click the "SWITCH" button on any group to activate it immediately
3. **Auto Switching:** Enable auto-switching to cycle through groups in sync with Ableton Link
4. **Monitor Status:** Watch the connection status and Link tempo in the header

## Project Structure

```
x32-switcher/
├── backend/           # Node.js backend server
│   ├── package.json   # Backend dependencies
│   └── server.js      # Main server file
├── src/               # Frontend source
│   ├── x32-controller.ts  # Main Lit component
│   └── index.css      # Styles
├── package.json       # Frontend dependencies & scripts
├── setup.sh          # Setup script
└── README.md         # This file
```

## Troubleshooting

### "Could not locate the bindings file" Error

If you get an error about missing `abletonlink.node` bindings:

1. **Make sure build tools are installed** (see Prerequisites above)
2. **Rebuild the native addon:**
   ```bash
   pnpm run build:native
   ```
3. **Or manually rebuild:**
   ```bash
   cd backend
   npm_config_python=python3 pnpm rebuild abletonlink
   ```

### OSC Connection Issues

- Verify X32 IP address in the web interface
- Ensure X32 has OSC enabled: Setup → Network → OSC
- Check that both devices are on the same network

### Ableton Link Not Working

- Start Ableton Live and enable Link in preferences
- Make sure no firewall is blocking UDP traffic
- Check that other Link-enabled apps can see each other

## Future Ideas
- Preset saving/loading for group configurations
- More than 4 groups
- Advanced switching logic (e.g., skip empty groups)
- Integration with other DAWs or MIDI triggers
- Visual feedback of current Ableton Link phase/beat

---

*This project uses a Node.js backend to bridge between the web UI, Ableton Link, and the X32 mixing console via OSC.*



build ableton link libs:

npm_config_python=python3 node-gyp rebuild --verbose
