export type ScriptLanguage = 'typescript' | 'javascript';
export type EngineVersion = 'Lens Studio 5.x' | 'Lens Studio 4.x';
export type ScriptCategory = 'face' | 'interaction' | 'physics' | 'audio' | 'world' | 'hand' | 'vfx';

export interface ScriptInputParam {
  name: string;
  type: string;
  defaultValue?: string | number | boolean;
  currentValue?: any;
  description?: string;
}

export interface LensTemplate {
  id: string;
  title: string;
  description: string;
  category: ScriptCategory;
  engine: EngineVersion;
  language: ScriptLanguage;
  badge: string;
  code: string;
  inputs: ScriptInputParam[];
  triggerTip: string;
}

export interface DiagnosticItem {
  id: string;
  type: 'error' | 'warning' | 'info';
  line: number;
  message: string;
  suggestion?: string;
}

export interface ConsoleLogMessage {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'print';
  text: string;
}

export interface SimulatorState {
  isTracking: boolean;
  faceX: number; // -1 to 1
  faceY: number; // -1 to 1
  faceScale: number; // 0.8 to 1.4
  mouthOpen: number; // 0 to 1
  eyeBlink: boolean;
  handDetected: boolean;
  handX: number;
  handY: number;
  isAudioBeating: boolean;
  tapCount: number;
  activeColorShift: string;
  attachedProp: string;
  particleActive: boolean;
  score: number;
}

export interface ApiDocSection {
  id: string;
  title: string;
  category: 'events' | 'math' | 'components' | 'assets' | 'tween';
  description: string;
  signature: string;
  snippet: string;
}
