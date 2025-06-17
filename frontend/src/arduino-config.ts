import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { ArduinoConfig } from './types/index.js';
import { ApiService } from '../services/api.js';

@customElement('arduino-config')
export class ArduinoConfigComponent extends LitElement {
  @property({ type: Object })
  config: ArduinoConfig = { port: '/dev/ttyUSB0', baudRate: 115200 };

  @state()
  private localConfig: ArduinoConfig = { ...this.config };

  @state()
  private arduinoFound: boolean | null = null;

  firstUpdated() {
    this.checkArduinoStatus();
  }

  updated(changed: Map<string, any>) {
    if (changed.has('config')) {
      this.localConfig = { ...this.config };
    }
  }

  private async checkArduinoStatus() {
    this.arduinoFound = await ApiService.getArduinoStatus();
  }

  private async handleUpdateConfig() {
    await ApiService.updateArduinoConfig(this.localConfig);
    await this.checkArduinoStatus();
  }

  private handlePortChange(port: string) {
    this.localConfig = { ...this.localConfig, port };
  }

  private handleBaudRateChange(baudRate: number) {
    this.localConfig = { ...this.localConfig, baudRate };
  }

  render() {
    const statusDot = this.arduinoFound === null
      ? html`<span class="status-dot unknown"></span> <span>Checking...</span>`
      : this.arduinoFound
        ? html`<span class="status-dot found"></span> <span>Arduino Found</span>`
        : html`<span class="status-dot not-found"></span> <span>Not Found</span>`;

    return html`
      <div class="arduino-config-compact">
        <div class="compact-inputs">
          <div class="compact-input-group">
            <label>Port:</label>
            <input
              type="text"
              .value=${this.localConfig.port}
              @input=${(e: Event) => this.handlePortChange((e.target as HTMLInputElement).value)}
              placeholder="/dev/ttyUSB0"
            />
          </div>
          <div class="compact-input-group">
            <label>Baud:</label>
            <input
              type="number"
              .value=${this.localConfig.baudRate.toString()}
              @input=${(e: Event) => this.handleBaudRateChange(parseInt((e.target as HTMLInputElement).value))}
              placeholder="115200"
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

  static styles = css`
    .arduino-config-compact {
      display: flex;
      align-items: center;
    }
    /* reuse existing X32 styles or customize as needed */
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'arduino-config': ArduinoConfigComponent;
  }
}
