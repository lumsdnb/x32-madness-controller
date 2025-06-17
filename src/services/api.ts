import type { ArduinoConfig, ChannelGroup, X32Config } from '../types/index.js';

const API_BASE = 'http://localhost:3001/api';

export class ApiService {
  static async switchGroup(groupIndex?: number): Promise<void> {
    try {
      await fetch(`${API_BASE}/switch/${groupIndex}`, {
        method: 'POST'
      });
    } catch (error) {
      console.error('Failed to switch group:', error);
      throw error;
    }
  }

  static async toggleAutoSwitch(enabled: boolean, interval: number): Promise<void> {
    try {
      await fetch(`${API_BASE}/auto-switch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled, interval })
      });
    } catch (error) {
      console.error('Failed to toggle auto switch:', error);
      throw error;
    }
  }

  static async updateSwitchInterval(enabled: boolean, interval: number): Promise<void> {
    try {
      await fetch(`${API_BASE}/auto-switch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled, interval })
      });
    } catch (error) {
      console.error('Failed to update switch interval:', error);
      throw error;
    }
  }

  static async updateGroup(groupId: number, updates: Partial<ChannelGroup>): Promise<void> {
    try {
      await fetch(`${API_BASE}/groups/${groupId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
    } catch (error) {
      console.error('Failed to update group:', error);
      throw error;
    }
  }

  static async updateX32Config(config: X32Config): Promise<void> {
    try {
      await fetch(`${API_BASE}/config/x32`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
    } catch (error) {
      console.error('Failed to update X32 config:', error);
      throw error;
    }
  }

  static async updateTempo(tempo: number): Promise<void> {
    try {
      await fetch(`${API_BASE}/link/tempo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tempo })
      });
    } catch (error) {
      console.error('Failed to update tempo:', error);
      throw error;
    }
  }

  static async getX32Status(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/x32/status`);
      const data = await res.json();
      return !!data.found;
    } catch (error) {
      console.error('Failed to get X32 status:', error);
      return false;
    }
  }
}
