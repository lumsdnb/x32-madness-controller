import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { X32Config } from '../types/index.js';
import { ApiService } from '../services/api.js';

@customElement('x32-config')
export class X32ConfigComponent extends LitElement {
  @property({ type: Object })
  config: X32Config = { host: '192.168.178.20', port: 10023 };

  @property({ type: Boolean })
  compact: boolean = false;

  @state()
  private localConfig: X32Config = { ...this.config };

  @state()
  private x32Found: boolean | null = null;

  firstUpdated() {
    this.checkX32Status();
  }

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('config')) {
      this.localConfig = { ...this.config };
    }
  }

  private async checkX32Status() {
    this.x32Found = await ApiService.getX32Status();
  }

  private async handleUpdateConfig() {
    await ApiService.updateX32Config(this.localConfig);
    await this.checkX32Status();
  }

  private handleHostChange(host: string) {
    this.localConfig = { ...this.localConfig, host };
  }

  private handlePortChange(port: number) {
    this.localConfig = { ...this.localConfig, port };
  }

  render() {
    const statusDot = this.x32Found === null
      ? html`<span class="status-dot unknown"></span> <span>Checking...</span>`
      : this.x32Found
        ? html`<span class="status-dot found"></span> <span>X32 Found</span>`
        : html`<span class="status-dot not-found"></span> <span>Not Found</span>`;

    if (this.compact) {
      return html`
        <div class="x32-config-compact">
          <div class="compact-inputs">
            <div class="compact-input-group">
              <label>IP:</label>
              <input
                type="text"
                .value=${this.localConfig.host}
                @input=${(e: Event) => this.handleHostChange((e.target as HTMLInputElement).value)}
                placeholder="192.168.178.20"
              />
            </div>
            <div class="compact-input-group">
              <label>Port:</label>
              <input
                type="number"
                .value=${this.localConfig.port.toString()}
                @input=${(e: Event) => this.handlePortChange(parseInt((e.target as HTMLInputElement).value))}
                placeholder="10023"
              />
            </div>
            <button @click=${this.handleUpdateConfig} class="compact-update-btn">
              Update
            </button>
            <div class="compact-status">${statusDot}</div>
          </div>
        </div>
      `;
    }

    return html`
      <section class="x32-config">
        <h2>X32 Configuration</h2>
        <div class="status-row">${statusDot}</div>
        <div class="config-inputs">
          <div class="input-group">
            <label>X32 IP Address:</label>
            <input
              type="text"
              .value=${this.localConfig.host}
              @input=${(e: Event) => this.handleHostChange((e.target as HTMLInputElement).value)}
            />
          </div>
          <div class="input-group">
            <label>X32 Port:</label>
            <input
              type="number"
              .value=${this.localConfig.port.toString()}
              @input=${(e: Event) => this.handlePortChange(parseInt((e.target as HTMLInputElement).value))}
            />
          </div>
          <button @click=${this.handleUpdateConfig} class="update-config-btn">
            Update X32 Config
          </button>
        </div>
      </section>
    `;
  }

  static styles = css`
    .x32-config {
      margin-bottom: 2rem;
      padding: 1.5rem;
      background: #2a2a2a;
      border-radius: 8px;
    }

    .x32-config-compact {
      display: flex;
      align-items: center;
    }

    .compact-inputs {
      display: flex;
      gap: 0.75rem;
      align-items: center;
    }

    .compact-input-group {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .compact-input-group label {
      color: var(--color-text-secondary);
      font-size: 0.8rem;
      min-width: fit-content;
      white-space: nowrap;
    }

    .compact-input-group input {
      background: var(--color-bg-tertiary);
      border: 1px solid var(--color-primary);
      color: var(--color-text-primary);
      padding: 0.25rem 0.5rem;
      border-radius: var(--radius-sm);
      width: 100px;
      font-size: 0.8rem;
    }

    .compact-input-group input:focus {
      outline: none;
      border-color: var(--color-secondary);
      box-shadow: 0 0 5px var(--color-secondary)40;
    }

    .compact-update-btn {
      padding: 0.25rem 0.75rem;
      background: var(--color-primary);
      border: 1px solid var(--color-primary);
      border-radius: var(--radius-sm);
      color: var(--color-bg-primary);
      cursor: pointer;
      font-size: 0.8rem;
      font-weight: 500;
      transition: all var(--transition-base);
    }

    .compact-update-btn:hover {
      background: var(--color-secondary);
      border-color: var(--color-secondary);
    }

    h2 {
      margin-top: 0;
      color: #ffffff;
    }

    .config-inputs {
      display: flex;
      gap: 1rem;
      align-items: end;
      flex-wrap: wrap;
    }

    .input-group {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .input-group label {
      color: #ccc;
      font-size: 0.9rem;
    }

    .input-group input {
      background: #444;
      border: 1px solid #555;
      color: white;
      padding: 0.5rem;
      border-radius: 4px;
      min-width: 150px;
    }

    .update-config-btn {
      padding: 0.5rem 1rem;
      background: #646cff;
      border: none;
      border-radius: 4px;
      color: white;
      cursor: pointer;
      font-weight: 500;
    }

    .update-config-btn:hover {
      background: #535bf2;
    }

    input:focus {
      outline: none;
      border-color: #646cff;
    }

    .status-row, .compact-status {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }
    .status-dot {
      display: inline-block;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #888;
      border: 1px solid #333;
    }
    .status-dot.found {
      background: #22c55e;
      box-shadow: 0 0 6px #22c55e88;
    }
    .status-dot.not-found {
      background: #ef4444;
      box-shadow: 0 0 6px #ef444488;
    }
    .status-dot.unknown {
      background: #888;
      box-shadow: none;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'x32-config': X32ConfigComponent;
  }
}
