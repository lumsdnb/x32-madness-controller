import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ApiService } from '../services/api.js';

@customElement('auto-switch-controls')
export class AutoSwitchControls extends LitElement {
  @property({ type: Boolean })
  isAutoSwitching = false;

  @property({ type: Number })
  switchInterval = 4;

  private async handleToggleAutoSwitch() {
    await ApiService.toggleAutoSwitch(!this.isAutoSwitching, this.switchInterval);
  }

  private async handleIntervalChange(interval: number) {
    await ApiService.updateSwitchInterval(this.isAutoSwitching, interval);
  }

  render() {
    return html`
      <div class="auto-switch-compact">
        <button 
          @click=${this.handleToggleAutoSwitch}
          class="auto-switch-icon ${this.isAutoSwitching ? 'active' : ''}"
          title="${this.isAutoSwitching ? 'Stop Auto Switch' : 'Start Auto Switch'}"
        >
          ${this.isAutoSwitching ? '⏸' : '▶'}
        </button>
        <select 
          .value=${this.switchInterval.toString()}
          @change=${(e: Event) => this.handleIntervalChange(parseInt((e.target as HTMLSelectElement).value))}
          class="interval-select"
          title="Switch interval"
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="4">4</option>
          <option value="8">8</option>
          <option value="16">16</option>
        </select>
      </div>
    `;
  }

  static styles = css`
    .auto-switch-compact {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .auto-switch-icon {
      width: 32px;
      height: 32px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #444;
      color: white;
    }

    .auto-switch-icon:hover {
      background: #555;
    }

    .auto-switch-icon.active {
      background: #ef4444;
      animation: pulse 2s infinite;
    }

    .interval-select {
      background: #444;
      border: 1px solid #555;
      color: white;
      padding: 0.25rem;
      border-radius: 4px;
      font-size: 12px;
      width: 40px;
    }

    .interval-select:focus {
      outline: none;
      border-color: #646cff;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'auto-switch-controls': AutoSwitchControls;
  }
} 