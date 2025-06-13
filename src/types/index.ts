export interface ChannelGroup {
  id: number;
  name: string;
  channels: number[];
}


export interface LinkStatus {
  enabled: boolean;
  tempo: number;
  beats: number;
  currentBeat: number;
  beatsPerBar: number;
  currentBar: number;
}

export interface AppState {
  groups: ChannelGroup[];
  activeGroup: number;
  isAutoSwitching: boolean;
  switchInterval: number;
  linkStatus: LinkStatus;
}

export interface ArduinoConfig {
  port: string;
  baudRate: number;
}

export interface X32Config {
  host: string;
  port: number;
}
