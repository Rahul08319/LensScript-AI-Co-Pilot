import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  RotateCcw, 
  Sliders, 
  Eye, 
  Smile, 
  Hand, 
  Music, 
  Sparkles, 
  Terminal, 
  Smartphone,
  MousePointer,
  Flame,
  Volume2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ConsoleLogMessage, SimulatorState } from '../types/lens';

interface ARSimulatorProps {
  logs: ConsoleLogMessage[];
  onTriggerEvent: (eventName: string, data?: any) => void;
  onClearLogs: () => void;
  attachedPropIndex: number;
}

const PROP_NAMES = [
  '🕶️ Cyberpunk Neon Visor',
  '🎩 Holographic Top Hat',
  '👑 Golden Crown of Light',
  '🎭 Venetian Carnival Mask'
];

export const ARSimulator: React.FC<ARSimulatorProps> = ({
  logs,
  onTriggerEvent,
  onClearLogs,
  attachedPropIndex
}) => {
  const [mouthOpenRatio, setMouthOpenRatio] = useState(0);
  const [isBlinking, setIsBlinking] = useState(false);
  const [facePos, setFacePos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lutFilterIndex, setLutFilterIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [handActive, setHandActive] = useState(false);
  const [score, setScore] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Color LUT filters simulation
  const LUT_PRESETS = [
    'none',
    'sepia(0.6) hue-rotate(180deg) saturate(1.8)', // Cyber Cyan
    'saturate(2.2) contrast(1.2) hue-rotate(300deg)', // Vaporwave Pink
    'contrast(1.4) brightness(1.1) saturate(1.5)', // Cinematic Gold
  ];

  // Tap Event Trigger
  const handleViewportTap = (e: React.MouseEvent<HTMLDivElement>) => {
    // Fire confetti particle burst
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    onTriggerEvent('TapEvent', { x, y });

    // Little confetti pop
    confetti({
      particleCount: 15,
      spread: 45,
      origin: { x: (rect.left + e.clientX) / (2 * window.innerWidth), y: (rect.top + e.clientY) / (2 * window.innerHeight) },
      colors: ['#FFFC00', '#00F0FF', '#FF007F']
    });
  };

  // Mouth Open Trigger
  const handleMouthSlider = (val: number) => {
    setMouthOpenRatio(val);
    if (val > 0.5) {
      onTriggerEvent('MouthOpenedEvent', { ratio: val });
      setScore(prev => prev + 10);
    } else if (val < 0.2) {
      onTriggerEvent('MouthClosedEvent', { ratio: val });
    }
  };

  // Blink Eyes Trigger
  const handleBlink = () => {
    setIsBlinking(true);
    setLutFilterIndex((prev) => (prev + 1) % LUT_PRESETS.length);
    onTriggerEvent('EyeBlinkEvent');

    setTimeout(() => {
      setIsBlinking(false);
    }, 280);
  };

  // Audio Beat Toggle
  const toggleAudio = () => {
    const nextState = !isPlayingAudio;
    setIsPlayingAudio(nextState);
    if (nextState) {
      onTriggerEvent('AudioBeatPulse', { bpm: 128 });
    }
  };

  // Hand tracking toggle
  const toggleHand = () => {
    const next = !handActive;
    setHandActive(next);
    onTriggerEvent(next ? 'HandFoundEvent' : 'HandLostEvent');
  };

  // Reset simulator
  const handleReset = () => {
    setScore(0);
    setFacePos({ x: 0, y: 0 });
    setMouthOpenRatio(0);
    setIsPlayingAudio(false);
    setHandActive(false);
    onClearLogs();
    onTriggerEvent('SimulatorReset');
  };

  return (
    <div className="flex flex-col h-full bg-[#0E121E] rounded-2xl border border-white/[0.08] overflow-hidden shadow-2xl">
      
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#131828] border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-snap-yellow" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Snapchat AR Viewfinder
          </h3>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-snap-yellow font-bold bg-snap-yellow/10 px-2 py-0.5 rounded border border-snap-yellow/20">
            FPS: 60
          </span>
          <button
            onClick={handleReset}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all"
            title="Reset Simulator"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Simulator Body */}
      <div className="flex-1 flex flex-col p-4 items-center justify-center overflow-hidden">
        
        {/* Phone Frame Viewport */}
        <div 
          onClick={handleViewportTap}
          className="relative w-[280px] sm:w-[320px] aspect-[9/16] rounded-[36px] bg-[#07090E] border-4 border-slate-800 shadow-[0_0_50px_-10px_rgba(0,0,0,0.8)] overflow-hidden cursor-crosshair select-none ar-viewfinder transition-all group"
          style={{
            filter: LUT_PRESETS[lutFilterIndex]
          }}
        >
          {/* Snapchat Top Notch / Camera indicator */}
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-4 bg-slate-900/90 rounded-full flex items-center justify-center gap-2 z-20">
            <div className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
            <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
          </div>

          {/* AR Overlay HUD (Score & Lens Title) */}
          <div className="absolute top-8 left-4 right-4 flex items-center justify-between text-xs z-20 pointer-events-none">
            <div className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white font-bold flex items-center gap-1.5 shadow-sm">
              <Flame className="w-3.5 h-3.5 text-snap-yellow" />
              <span>SCORE: {score}</span>
            </div>
            <div className="px-2.5 py-1 rounded-full bg-snap-yellow/90 text-black font-extrabold text-[10px] tracking-wider uppercase shadow-glow-yellow">
              Lens Preview
            </div>
          </div>

          {/* Simulated 3D Face Avatar & AR Mesh */}
          <div 
            className="absolute inset-0 flex items-center justify-center transition-transform duration-75 pointer-events-none"
            style={{
              transform: `translate(${facePos.x}px, ${facePos.y}px) scale(${isPlayingAudio ? 1.08 : 1.0})`
            }}
          >
            {/* Face Mesh Wireframe */}
            <div className="relative w-44 h-56 rounded-[50%_50%_45%_45%] border border-cyan-400/30 bg-gradient-to-b from-cyan-950/20 to-slate-950/40 backdrop-blur-[2px] flex flex-col items-center justify-center shadow-[0_0_30px_rgba(0,240,255,0.15)]">
              
              {/* Attached 3D Prop Anchor */}
              <div className="absolute -top-6 transform transition-all duration-300">
                <div className="px-3 py-1.5 rounded-xl bg-black/80 border border-snap-yellow/50 text-snap-yellow text-xs font-bold shadow-glow-yellow flex items-center gap-1">
                  <span>{PROP_NAMES[attachedPropIndex % PROP_NAMES.length]}</span>
                </div>
              </div>

              {/* Eyes Landmarks */}
              <div className="flex items-center gap-12 mt-4">
                <div className={`w-8 h-4 rounded-full border-2 border-cyan-300 bg-cyan-400/20 transition-all ${isBlinking ? 'h-0.5 border-snap-yellow' : ''}`} />
                <div className={`w-8 h-4 rounded-full border-2 border-cyan-300 bg-cyan-400/20 transition-all ${isBlinking ? 'h-0.5 border-snap-yellow' : ''}`} />
              </div>

              {/* Nose Wireframe */}
              <div className="w-3 h-8 border-r-2 border-b-2 border-cyan-400/40 my-3 rounded-br-sm" />

              {/* Mouth Blendshape (Responsive to mouth slider) */}
              <div 
                className="w-16 rounded-full border-2 border-cyan-300 bg-cyan-950/60 transition-all duration-100 flex items-center justify-center overflow-hidden"
                style={{
                  height: `${Math.max(6, mouthOpenRatio * 38)}px`,
                  borderColor: mouthOpenRatio > 0.5 ? '#FFFC00' : '#00F0FF',
                  boxShadow: mouthOpenRatio > 0.5 ? '0 0 15px rgba(255,252,0,0.8)' : 'none'
                }}
              >
                {mouthOpenRatio > 0.5 && (
                  <div className="text-[10px] font-black text-snap-yellow animate-bounce">
                    💥 BURST
                  </div>
                )}
              </div>

              {/* Face Tracking Dot Markers */}
              <div className="absolute inset-x-4 inset-y-6 pointer-events-none opacity-40">
                <div className="absolute top-2 left-6 w-1 h-1 bg-cyan-400 rounded-full" />
                <div className="absolute top-2 right-6 w-1 h-1 bg-cyan-400 rounded-full" />
                <div className="absolute bottom-4 left-10 w-1 h-1 bg-cyan-400 rounded-full" />
                <div className="absolute bottom-4 right-10 w-1 h-1 bg-cyan-400 rounded-full" />
              </div>
            </div>

            {/* Hand tracking magic orb */}
            {handActive && (
              <div className="absolute bottom-12 right-6 w-12 h-12 rounded-full bg-gradient-to-r from-snap-yellow to-pink-500 shadow-glow-yellow animate-bounce flex items-center justify-center text-xs">
                🖐️ ✨
              </div>
            )}
          </div>

          {/* Bottom Snapchat Camera Button */}
          <div className="absolute bottom-5 inset-x-0 flex items-center justify-center gap-6 z-20 pointer-events-none">
            <div className="w-16 h-16 rounded-full border-4 border-white/80 p-1 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-full bg-snap-yellow shadow-glow-yellow" />
            </div>
          </div>

          {/* Hint Overlay */}
          <div className="absolute bottom-24 inset-x-0 text-center pointer-events-none">
            <span className="px-3 py-1 rounded-full bg-black/60 text-slate-300 text-[10px] font-medium border border-white/10 backdrop-blur-sm">
              👆 Tap screen to trigger script events
            </span>
          </div>
        </div>

        {/* Interactive Triggers Dock */}
        <div className="w-full max-w-[340px] mt-4 p-3 rounded-xl bg-[#131828] border border-white/[0.08] space-y-2.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-snap-yellow" />
              AR Simulation Controls
            </span>
            <span className="text-[10px] text-slate-400">Live Triggers</span>
          </div>

          {/* Quick Trigger Buttons */}
          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={handleBlink}
              className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-[#1B2238] hover:bg-[#242C48] text-slate-200 text-xs font-medium border border-white/[0.05] transition-all"
            >
              <Eye className="w-3 h-3 text-cyan-400" />
              <span>Blink</span>
            </button>

            <button
              onClick={toggleAudio}
              className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-xs font-medium border transition-all ${
                isPlayingAudio 
                  ? 'bg-snap-yellow text-black border-snap-yellow font-bold shadow-glow-yellow' 
                  : 'bg-[#1B2238] hover:bg-[#242C48] text-slate-200 border-white/[0.05]'
              }`}
            >
              <Music className="w-3 h-3" />
              <span>Beat</span>
            </button>

            <button
              onClick={toggleHand}
              className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-xs font-medium border transition-all ${
                handActive 
                  ? 'bg-pink-500 text-white border-pink-400 font-bold' 
                  : 'bg-[#1B2238] hover:bg-[#242C48] text-slate-200 border-white/[0.05]'
              }`}
            >
              <Hand className="w-3 h-3" />
              <span>Hand</span>
            </button>
          </div>

          {/* Mouth Aperture Slider */}
          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-[11px] text-slate-400 font-medium">
              <span className="flex items-center gap-1">
                <Smile className="w-3 h-3 text-snap-yellow" />
                Mouth Aperture
              </span>
              <span className="font-mono text-snap-yellow font-bold">{(mouthOpenRatio * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={mouthOpenRatio}
              onChange={(e) => handleMouthSlider(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-snap-yellow"
            />
          </div>
        </div>

      </div>

      {/* Live Console Output Feed (Bottom) */}
      <div className="h-36 bg-[#0B0E17] border-t border-white/[0.08] flex flex-col font-mono text-[11px]">
        <div className="flex items-center justify-between px-3 py-1.5 bg-[#101422] border-b border-white/[0.05] text-slate-400 select-none">
          <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px]">
            <Terminal className="w-3.5 h-3.5 text-snap-yellow" />
            <span>Lens Studio Logger (`print()`)</span>
          </div>
          <button
            onClick={onClearLogs}
            className="hover:text-white text-[10px] transition-colors"
          >
            Clear
          </button>
        </div>

        <div className="flex-1 p-2.5 overflow-y-auto space-y-1">
          {logs.length === 0 ? (
            <div className="text-slate-400 italic">No console logs yet. Interact with the simulator above...</div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="flex items-start gap-2 leading-relaxed">
                <span className="text-slate-400 shrink-0">[{log.timestamp}]</span>
                <span className={
                  log.level === 'error' ? 'text-rose-400 font-bold' :
                  log.level === 'warn' ? 'text-amber-400' :
                  log.text.includes('Burst') || log.text.includes('Score') ? 'text-snap-yellow font-bold' :
                  'text-slate-300'
                }>
                  {log.text}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
