import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { LinkStatus } from '../types/index.js';
import { ApiService } from '../services/api.js';
import { sharedStyles, buttonStyles, inputStyles, badgeStyles, layoutStyles } from '../styles/shared.js';

@customElement('link-indicator')
export class LinkIndicator extends LitElement {
  @property({ type: Object })
  linkStatus!: LinkStatus;

  @property({ type: Number })
  switchInterval = 4;

  private async handleTempoChange(tempo: number) {
    if (!isNaN(tempo) && tempo >= 60 && tempo <= 200) {
      await ApiService.updateTempo(tempo);
    }
  }

  renderBeatVisuals() {
    const currentBeatInBar = (this.linkStatus.currentBeat !== undefined && this.linkStatus.beatsPerBar) ? 
      (this.linkStatus.currentBeat + 1) : 1;
    const totalBars = Math.ceil(this.switchInterval);
    const currentBarInLoop = this.linkStatus.currentBar !== undefined ? 
      ((this.linkStatus.currentBar % totalBars) + 1) : 1;
    if (!this.linkStatus.enabled) return null;
    return html`
      <div class="flex items-center gap-md">
        <div class="flex gap-xs">
          ${Array.from({ length: this.linkStatus.beatsPerBar }, (_, i) => html`
            <div class="beat-dot ${i + 1 === currentBeatInBar ? 'active' : ''}"></div>
          `)}
        </div>
        <div class="bar-progress">
          <div class="bar-progress-fill" style="width: ${(currentBarInLoop / totalBars) * 100}%"></div>
        </div>
      </div>
    `;
  }

  renderBeatSection() {
    // Handle the case where currentBeat might be 0-based from backend
    const currentBeatInBar = (this.linkStatus.currentBeat !== undefined && this.linkStatus.beatsPerBar) ? 
      (this.linkStatus.currentBeat + 1) : 1;
    const totalBars = Math.ceil(this.switchInterval);
    const currentBarInLoop = this.linkStatus.currentBar !== undefined ? 
      ((this.linkStatus.currentBar % totalBars) + 1) : 1;
    if (!this.linkStatus.enabled) return null;
    return html`
      <div class="beat-section">
        <div class="text-center mb-sm">
          <span class="text-base font-semibold text-primary">Bar ${currentBarInLoop}/${totalBars} • Beat ${currentBeatInBar}/${this.linkStatus.beatsPerBar}</span>
        </div>
      </div>
    `;
  }

  render() {
    // Handle the case where currentBeat might be 0-based from backend
    const currentBeatInBar = (this.linkStatus.currentBeat !== undefined && this.linkStatus.beatsPerBar) ? 
      (this.linkStatus.currentBeat + 1) : 1;
    const totalBars = Math.ceil(this.switchInterval);
    const currentBarInLoop = this.linkStatus.currentBar !== undefined ? 
      ((this.linkStatus.currentBar % totalBars) + 1) : 1;

    return html`
      <div class="card card-compact">
        <div class="flex justify-between items-center mb-lg">
          <div class="flex items-center gap-lg text-lg font-semibold">
            <span class="text-xl">${this.linkStatus.enabled ? '🎵' : '⏸️'}</span>
            <span>Ableton Link</span>
            <div class="badge ${this.linkStatus.enabled ? 'badge-success' : 'badge-danger'}">
              ${this.linkStatus.enabled ? 'CONNECTED' : 'DISABLED'}
            </div>
          </div>
        ${this.renderBeatSection()}
          <div class="flex items-center gap-sm">
            <input 
              type="number" 
              min="60" 
              max="200" 
              step="0.1"
              .value=${this.linkStatus.tempo.toFixed(1)}
              @input=${(e: Event) => {
                const tempo = parseFloat((e.target as HTMLInputElement).value);
                this.handleTempoChange(tempo);
              }}
              class="input input-sm font-semibold"
            />
            <span class="text-muted text-sm font-semibold">BPM</span>
          </div>
        </div>
        
        ${this.renderBeatVisuals()}
        </div>
    `;
  }

  static styles = [
    sharedStyles,
    buttonStyles,
    inputStyles,
    badgeStyles,
    layoutStyles,
    css`
      .beat-section {
        border-top: 1px solid var(--color-border);
        padding-top: var(--spacing-lg);
      }

      .beat-dot {
        width: 12px;
        height: 12px;
        border-radius: var(--radius-full);
        background: var(--color-bg-input);
        border: 1px solid var(--color-border-input);
        transition: all var(--transition-base);
      }

      .beat-dot.active {
        background: var(--color-primary);
        border-color: var(--color-primary);
        transform: scale(1.2);
        box-shadow: var(--shadow-glow) var(--color-primary)60;
      }

      .bar-progress {
        flex: 1;
        background: var(--color-bg-input);
        border-radius: var(--radius-md);
        height: 8px;
        overflow: hidden;
      }

      .bar-progress-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--color-primary), var(--color-primary-hover));
        transition: width var(--transition-fast);
        border-radius: var(--radius-md);
      }
    `
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'link-indicator': LinkIndicator;
  }
} 