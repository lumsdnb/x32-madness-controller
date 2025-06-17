import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { ChannelGroup } from '../types/index.js';
import { ApiService } from '../services/api.js';
import { sharedStyles, buttonStyles, inputStyles, layoutStyles } from '../styles/shared.js';

@customElement('channel-group')
export class ChannelGroupComponent extends LitElement {
  @property({ type: Object })
  group!: ChannelGroup;

  @property({ type: Number })
  index!: number;

  @property({ type: Boolean, reflect: true })
  isActive = false;

  // Override property change detection to ensure re-renders
  protected updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);
    if (changedProperties.has('isActive')) {
      console.log(`Group ${this.group?.name} (index: ${this.index}) active state changed to:`, this.isActive);
    }
  }

  private async handleChannelInput(value: string) {
    const channels = value.split(',')
      .map(ch => parseInt(ch.trim()))
      .filter(ch => !isNaN(ch) && ch >= 1 && ch <= 32);

    await ApiService.updateGroup(this.group.id, { channels });
  }

  private async handleGroupNameChange(name: string) {
    await ApiService.updateGroup(this.group.id, { name });
  }

  private async handleSwitchClick() {
    await ApiService.switchGroup(this.index);
  }

  render() {
    return html`
      <div class="group-card ${this.isActive ? 'active' : ''}">
        <div class="flex justify-between items-center mb-md">
          <input
            type="text"
            .value=${this.group.name}
            @input=${(e: Event) => this.handleGroupNameChange((e.target as HTMLInputElement).value)}
            class="input font-semibold"
          />
          <button
            @click=${this.handleSwitchClick}
            class="btn ${this.isActive ? 'btn-success' : 'btn-primary'}"
          >
            ${this.isActive ? 'ACTIVE' : 'SWITCH'}
          </button>
        </div>
        <div class="mb-sm">
          <label class="text-secondary text-base mb-xs">Channels (comma-separated):</label>
          <input
            type="text"
            .value=${this.group.channels.join(', ')}
            @input=${(e: Event) => this.handleChannelInput((e.target as HTMLInputElement).value)}
            placeholder="e.g., 1, 2, 3, 4"
            class="input"
            style="width: 100%"
          />
        </div>
        <div class="text-muted text-base">
          ${this.group.channels.length} channels configured
        </div>
      </div>
    `;
  }

  static styles = [
    sharedStyles,
    buttonStyles,
    inputStyles,
    layoutStyles,
    css`
      .group-card {
        padding: var(--spacing-md);
        background: var(--color-bg-tertiary);
        border-radius: var(--radius-md);
        border: 2px solid var(--color-border);
        transition: all var(--transition-base);
        position: relative;
        overflow: hidden;
      }

      .group-card.active {
        border-color: var(--color-primary);
        background: var(--color-bg-secondary);
        box-shadow: var(--shadow-cyber);
        animation: active-pulse 2s ease-in-out infinite alternate;
        transform: scale(1.02);
      }

      .group-card.active::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: var(--gradient-cyber);
        animation: gradient-shift 3s ease infinite;
      }

      @keyframes active-pulse {
        from {
          box-shadow: var(--shadow-cyber);
        }
        to {
          box-shadow: 0 0 30px #00ffff, 0 0 60px #00ffff40, 0 0 90px #00ffff20;
        }
      }

      @keyframes gradient-shift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }

      @keyframes neon-flicker {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.8; }
        75% { opacity: 1; }
        85% { opacity: 0.9; }
      }

      label {
        display: block;
      }
    `
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'channel-group': ChannelGroupComponent;
  }
}
