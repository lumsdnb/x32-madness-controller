import { LitElement, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type { AppState, X32Config } from './types/index.js';
import { WebSocketService } from './services/websocket.js';

// Import all components
import './components/link-indicator.js';
import './components/channel-group.js';
import './components/auto-switch-controls.js';
import './components/x32-config.js';

@customElement('x32-controller')
export class X32Controller extends LitElement {
  @state()
  private state: AppState = {
    groups: [],
    activeGroup: 0,
    isAutoSwitching: false,
    switchInterval: 4,
    linkStatus: {
      enabled: false,
      tempo: 120,
      beats: 0,
      currentBeat: 0,
      beatsPerBar: 4,
      currentBar: 0
    }
  };

  @state()
  private connected = false;

  @state()
  private x32Config: X32Config = { host: '192.168.178.20', port: 10023 };

  @state()

  @state()
  private showSettings = false;

  private wsService: WebSocketService;
  private linkIndicatorRef: any;

  constructor() {
    super();
    this.wsService = new WebSocketService();
    this.wsService.setStateUpdateHandler((state) => {
      console.log('Controller received state update, activeGroup:', state.activeGroup);
      this.state = { ...state }; // Force a new object reference to trigger reactivity
      this.requestUpdate(); // Explicitly request an update
    });
    this.wsService.setConnectionChangeHandler((connected) => {
      this.connected = connected;
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.wsService.disconnect();
  }

  private toggleSettings() {
    this.showSettings = !this.showSettings;
  }

  render() {
    return html`
      <div class="container">
        <header>
          <h1>Jam Controller</h1>
          <div class="header-controls">
            <button @click=${this.toggleSettings} class="btn btn-secondary">
              <span class="settings-icon">⚙️</span>
              Settings
            </button>
          </div>
        </header>

        <!-- Collapsible Settings Panel -->
        ${this.showSettings ? html`
          <section class="settings-panel">
            <div class="settings-content">
              <h3>X32 Configuration</h3>
              <x32-config .config=${this.x32Config} compact></x32-config>
              <h3>Pi Zero</h3>
              todo
              <!-- <pi- .config=${this.x32Config} compact></x32-config> -->

            </div>
          </section>
        ` : ''}

        <!-- Enhanced Link Indicator (status only, no beat section) -->
        <section class="link-section">
          <link-indicator
            .linkStatus=${this.state.linkStatus}
            .switchInterval=${this.state.switchInterval}
            hideBeatSection>
          </link-indicator>
        </section>

        <main>
          <!-- Group Configuration -->
          <section class="groups-config">
            <div class="section-header">
              <h2>Channels</h2>
              <auto-switch-controls
                .isAutoSwitching=${this.state.isAutoSwitching}
                .switchInterval=${this.state.switchInterval}>
              </auto-switch-controls>
            </div>
            <!-- Progress bar/beat section below selector (visuals only, no text) -->
            ${window.customElements.get('link-indicator')?.prototype.renderBeatVisuals.call({
              linkStatus: this.state.linkStatus,
              switchInterval: this.state.switchInterval
            })}
            <div class="groups-grid">
              ${this.state.groups.map((group, index) => html`
                <channel-group
                  .group=${group}
                  .index=${index}
                  .isActive=${index === this.state.activeGroup}
                  data-group-id=${group.id}
                  data-active=${index === this.state.activeGroup}>
                </channel-group>
              `)}
            </div>
          </section>
        </main>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
      font-family: 'Courier New', 'Lucida Console', monospace;
      background: var(--color-bg-primary);
      background-image:
        radial-gradient(circle at 25% 25%, #00ffff10 0%, transparent 50%),
        radial-gradient(circle at 75% 75%, #ff00ff10 0%, transparent 50%),
        linear-gradient(45deg, transparent 40%, #00ffff05 50%, transparent 60%);
      color: var(--color-text-primary);
      min-height: 100vh;
      position: relative;
    }

    :host::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background:
        repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(0,255,255,0.03) 2px,
          rgba(0,255,255,0.03) 4px
        );
      pointer-events: none;
      z-index: 1;
    }

    .container {
      width: 100%;
      max-width: 90vw;
      margin: 0 auto;
      padding: 2rem;
      box-sizing: border-box;
      position: relative;
      z-index: 2;
    }

    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding: 1rem 2rem;
      background: var(--color-bg-secondary);
      border: 2px solid var(--color-primary);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-cyber);
      position: relative;
      overflow: hidden;
    }

    .header-controls {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .settings-icon {
      margin-right: 0.5rem;
    }

    .btn {
      padding: 0.5rem 1rem;
      border: 1px solid var(--color-primary);
      background: var(--color-bg-tertiary);
      color: var(--color-text-primary);
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .btn:hover {
      background: var(--color-primary);
      color: var(--color-bg-primary);
    }

    .btn-secondary {
      border-color: var(--color-secondary);
    }

    .btn-secondary:hover {
      background: var(--color-secondary);
    }

    header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: var(--gradient-cyber);
      animation: gradient-shift 3s ease infinite;
    }

    h1 {
      margin: 0;
      color: var(--color-primary);
      font-family: var(--font-family-cyber);
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      text-transform: uppercase;
      letter-spacing: 2px;
      text-shadow: 0 0 10px var(--color-primary), 0 0 20px var(--color-primary)40;
      animation: neon-pulse 2s ease-in-out infinite alternate;
    }

    @keyframes neon-pulse {
      from {
        text-shadow: 0 0 10px var(--color-primary), 0 0 20px var(--color-primary)40;
      }
      to {
        text-shadow: 0 0 15px var(--color-primary), 0 0 30px var(--color-primary)60, 0 0 40px var(--color-primary)20;
      }
    }

    .status {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .connection {
      padding: 0.5rem 1rem;
      border-radius: 4px;
      font-weight: 500;
    }

    .connection.connected {
      background: #22c55e20;
      color: #22c55e;
    }

    .connection.disconnected {
      background: #ef444420;
      color: #ef4444;
    }

    .settings-panel {
      margin-bottom: 2rem;
      padding: 1.5rem;
      background: var(--color-bg-secondary);
      border: 1px solid var(--color-primary);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-cyber);
      animation: slideDown 0.3s ease-out;
    }

    .settings-content {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .settings-content h3 {
      margin: 0;
      color: var(--color-primary);
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .link-section {
      margin-bottom: 2rem;
    }

    section {
      margin-bottom: 2rem;
      padding: 1.5rem;
      background: #2a2a2a;
      border-radius: 8px;
    }

    h2 {
      margin-top: 0;
      color: #ffffff;
    }

    .groups-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1rem;
    }

    @media (min-width: 768px) {
      .groups-grid {
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 1.5rem;
      }
    }

    @media (min-width: 1200px) {
      .groups-grid {
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: 2rem;
      }
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .section-header h2 {
      margin: 0;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'x32-controller': X32Controller;
  }
}
