import React, { useState, useRef } from 'react';
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
  Flame,
  Camera,
  Layers,
  Sparkle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ConsoleLogMessage } from '../types/lens';
import { haptics } from '../utils/audioHaptics';

interface ARSimulatorProps {
  logs: ConsoleLogMessage[];
  onTriggerEvent: (eventName: string, data?: any) => void;
  onClearLogs: () => void;
  attachedPropIndex: number;
}

const LENS_PRESETS = [
  { id: 0, emoji: '🕶️', name: 'Cyber Visor', color: '#00F0FF' },
  { id: 1, emoji: '🎩', name: 'Top Hat', color: '#A855F7' },
  { id: 2, emoji: '👑', name: 'Royal Crown', color: '#FFFC00' },
  { id: 3, emoji: '🎭', name: 'Carnival Mask', color: '#EC4899' }
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
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [lutFilterIndex, setLutFilterIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [handActive, setHandActive] = useState(false);
  const [score, setScore] = useState(0);
  const [isFlashing, setIsFlashing] = useState(false);

  // Apple Color Grading Filters
  const LUT_PRESETS = [
    'none',
    'sepia(0.5) hue-rotate(185deg) saturate(1.9)', // Cyber Cyan
    'saturate(2.2) contrast(1.2) hue-rotate(305deg)', // Neon Sunset
    'contrast(1.35) brightness(1.1) saturate(1.4) sepia(0.25)', // Cinematic Gold
  ];

  // Tap Event Trigger
  const handleViewportTap = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    haptics.pop();
    onTriggerEvent('TapEvent', { x, y });

    confetti({
      particleCount: 18,
      spread: 50,
      origin: { x: (rect.left + e.clientX) / (2 * window.innerWidth), y: (rect.top + e.clientY) / (2 * window.innerHeight) },
      colors: ['#FFFC00', '#00F0FF', '#FF007F']
    });
  };

  // Direct 1:1 Pointer Tracking for Face Avatar
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    setDragStart({ x: e.clientX - facePos.x, y: e.clientY - facePos.y });
    haptics.tap();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    // Calculate 1:1 offset with slight damping boundary
    const newX = Math.max(-80, Math.min(80, e.clientX - dragStart.x));
    const newY = Math.max(-60, Math.min(60, e.clientY - dragStart.y));
    setFacePos({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    setIsDragging(false);
    haptics.tap();
    // Smooth spring back to center
    setFacePos({ x: 0, y: 0 });
  };

  // Camera Shutter Snap
  const handleShutterSnap = (e: React.MouseEvent) => {
    e.stopPropagation();
    haptics.snap();
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 120);

    confetti({
      particleCount: 40,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFFC00', '#FFFFFF', '#00F0FF']
    });
    onTriggerEvent('CameraSnapshot');
  };

  // Mouth Open Trigger
  const handleMouthSlider = (val: number) => {
    setMouthOpenRatio(val);
    if (val > 0.5) {
      haptics.coin();
      onTriggerEvent('MouthOpenedEvent', { ratio: val });
      setScore(prev => prev + 10);
    } else if (val < 0.2) {
      onTriggerEvent('MouthClosedEvent', { ratio: val });
    }
  };

  // Blink Eyes Trigger
  const handleBlink = () => {
    haptics.tap();
    setIsBlinking(true);
    setLutFilterIndex((prev) => (prev + 1) % LUT_PRESETS.length);
    onTriggerEvent('EyeBlinkEvent');

    setTimeout(() => {
      setIsBlinking(false);
    }, 250);
  };

  // Audio Beat Toggle
  const toggleAudio = () => {
    haptics.tap();
    const nextState = !isPlayingAudio;
    setIsPlayingAudio(nextState);
    if (nextState) {
      onTriggerEvent('AudioBeatPulse', { bpm: 128 });
    }
  };

  // Hand tracking toggle
  const toggleHand = () => {
    haptics.tap();
    const next = !handActive;
    setHandActive(next);
    onTriggerEvent(next ? 'HandFoundEvent' : 'HandLostEvent');
  };

  // Reset simulator
  const handleReset = () => {
    haptics.tap();
    setScore(0);
    setFacePos({ x: 0, y: 0 });
    setMouthOpenRatio(0);
    setIsPlayingAudio(false);
    setHandActive(false);
    onClearLogs();
    onTriggerEvent('SimulatorReset');
  };

  return (
    <div className="flex flex-col h-full apple-glass squircle-lg overflow-hidden shadow-2xl">
      
      {/* Header bar */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-[#12162A]/60 border-b border-white/[0.08]">
        <div className="flex items-center gap-2.5">
          <Smartphone className="w-4 h-4 text-snap-yellow" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Snapchat Viewfinder
          </h3>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34D399]" />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-snap-yellow font-bold bg-snap-yellow/10 px-2.5 py-0.5 rounded-full border border-snap-yellow/20">
            60 FPS
          </span>
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all apple-press"
            title="Reset Simulator"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Simulator Body */}
      <div className="flex-1 flex flex-col p-4 items-center justify-center overflow-hidden relative">
        
        {/* Phone Frame Viewport */}
        <div 
          onClick={handleViewportTap}
          className="relative w-[280px] sm:w-[320px] aspect-[9/16] squircle-lg bg-[#07090E] border-4 border-slate-800 shadow-[0_0_50px_-10px_rgba(0,0,0,0.85)] overflow-hidden cursor-crosshair select-none ar-viewfinder transition-all group"
          style={{
            filter: LUT_PRESETS[lutFilterIndex]
          }}
        >
          {/* Camera Flash Screen effect */}
          {isFlashing && (
            <div className="absolute inset-0 bg-white z-50 animate-out fade-out duration-100 pointer-events-none" />
          )}

          {/* Top Notch / Camera indicator */}
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-4 bg-slate-900/90 rounded-full flex items-center justify-center gap-2 z-20 shadow-md">
            <div className="w-2 h-2 rounded-full bg-emerald-500/90 animate-pulse" />
            <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
          </div>

          {/* AR Overlay HUD (Score & Lens Title) */}
          <div className="absolute top-8 left-4 right-4 flex items-center justify-between text-xs z-20 pointer-events-none">
            <div className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white font-bold flex items-center gap-1.5 shadow-sm">
              <Flame className="w-3.5 h-3.5 text-snap-yellow" />
              <span>SCORE: {score}</span>
            </div>
            <div className="px-2.5 py-1 rounded-full bg-snap-yellow/90 text-black font-extrabold text-[10px] tracking-wider uppercase shadow-glow-yellow">
              Lens Preview
            </div>
          </div>

          {/* Direct 1:1 Manipulatable Face Avatar */}
          <div 
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className={`absolute inset-0 flex items-center justify-center transition-transform ${
              isDragging ? 'cursor-grabbing duration-0' : 'cursor-grab duration-300'
            }`}
            style={{
              transform: `translate(${facePos.x}px, ${facePos.y}px) rotate(${facePos.x * 0.15}deg) scale(${isPlayingAudio ? 1.08 : 1.0})`
            }}
          >
            {/* Face Mesh Wireframe */}
            <div className="relative w-44 h-56 rounded-[50%_50%_45%_45%] border border-cyan-400/35 bg-gradient-to-b from-cyan-950/20 to-slate-950/50 backdrop-blur-[3px] flex flex-col items-center justify-center shadow-[0_0_35px_rgba(0,240,255,0.18)]">
              
              {/* Attached 3D Prop Anchor */}
              <div className="absolute -top-7 transform transition-all duration-300">
                <div className="px-3.5 py-1.5 squircle-sm bg-black/85 border border-snap-yellow/60 text-snap-yellow text-xs font-bold shadow-glow-yellow flex items-center gap-1.5">
                  <Sparkle className="w-3 h-3 fill-snap-yellow" />
                  <span>{LENS_PRESETS[attachedPropIndex % LENS_PRESETS.length].name}</span>
                </div>
              </div>

              {/* Eyes Landmarks */}
              <div className="flex items-center gap-12 mt-4">
                <div className={`w-8 h-4 rounded-full border-2 border-cyan-300 bg-cyan-400/25 transition-all ${isBlinking ? 'h-0.5 border-snap-yellow' : ''}`} />
                <div className={`w-8 h-4 rounded-full border-2 border-cyan-300 bg-cyan-400/25 transition-all ${isBlinking ? 'h-0.5 border-snap-yellow' : ''}`} />
              </div>

              {/* Nose Wireframe */}
              <div className="w-3 h-8 border-r-2 border-b-2 border-cyan-400/40 my-3 rounded-br-sm" />

              {/* Mouth Blendshape (Responsive to slider) */}
              <div 
                className="w-16 rounded-full border-2 border-cyan-300 bg-cyan-950/70 transition-all duration-100 flex items-center justify-center overflow-hidden"
                style={{
                  height: `${Math.max(6, mouthOpenRatio * 38)}px`,
                  borderColor: mouthOpenRatio > 0.5 ? '#FFFC00' : '#00F0FF',
                  boxShadow: mouthOpenRatio > 0.5 ? '0 0 18px rgba(255,252,0,0.85)' : 'none'
                }}
              >
                {mouthOpenRatio > 0.5 && (
                  <div className="text-[10px] font-black text-snap-yellow animate-bounce">
                    🪙 BURST
                  </div>
                )}
              </div>

              {/* Face Tracking Dot Markers */}
              <div className="absolute inset-x-4 inset-y-6 pointer-events-none opacity-40">
                <div className="absolute top-2 left-6 w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                <div className="absolute top-2 right-6 w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                <div className="absolute bottom-4 left-10 w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                <div className="absolute bottom-4 right-10 w-1.5 h-1.5 bg-cyan-400 rounded-full" />
              </div>
            </div>

            {/* Hand tracking magic ribbon orb */}
            {handActive && (
              <div className="absolute bottom-10 right-4 w-12 h-12 rounded-full bg-gradient-to-r from-snap-yellow to-pink-500 shadow-glow-yellow animate-bounce flex items-center justify-center text-xs">
                🖐️ ✨
              </div>
            )}
          </div>

          {/* Snapchat Lens Carousel at Bottom */}
          <div className="absolute bottom-20 inset-x-0 flex items-center justify-center gap-3 z-20">
            {LENS_PRESETS.map((preset) => {
              const isSelected = (attachedPropIndex % LENS_PRESETS.length) === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    haptics.pop();
                    onTriggerEvent('TapEvent');
                  }}
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm transition-all apple-press ${
                    isSelected
                      ? 'border-2 border-snap-yellow scale-110 shadow-glow-yellow bg-black/80'
                      : 'border border-white/20 bg-black/40 hover:bg-black/60 opacity-70'
                  }`}
                  title={preset.name}
                >
                  {preset.emoji}
                </button>
              );
            })}
          </div>

          {/* Bottom Camera Shutter Button */}
          <div className="absolute bottom-4 inset-x-0 flex items-center justify-center z-20">
            <button
              onClick={handleShutterSnap}
              className="w-16 h-16 rounded-full border-4 border-white/85 p-1 flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all apple-press"
              title="Snapchat Camera Shutter"
            >
              <div className="w-full h-full rounded-full bg-snap-yellow shadow-glow-yellow flex items-center justify-center">
                <Camera className="w-5 h-5 text-black opacity-80" />
              </div>
            </button>
          </div>

        </div>

        {/* Apple Fluid Triggers Dock */}
        <div className="w-full max-w-[340px] mt-4 p-3.5 squircle-md bg-[#11162A]/70 border border-white/[0.08] space-y-2.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5 font-bold tracking-tight">
              <Sliders className="w-3.5 h-3.5 text-snap-yellow" />
              AR Simulation Controls
            </span>
            <span className="text-[10px] text-slate-400 font-mono">1:1 Physical</span>
          </div>

          {/* Quick Trigger Buttons */}
          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={handleBlink}
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] text-slate-200 text-xs font-medium border border-white/[0.06] transition-all apple-press"
            >
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              <span>Blink</span>
            </button>

            <button
              onClick={toggleAudio}
              className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-medium border transition-all apple-press ${
                isPlayingAudio 
                  ? 'bg-snap-yellow text-black border-snap-yellow font-bold shadow-glow-yellow' 
                  : 'bg-white/[0.05] hover:bg-white/[0.09] text-slate-200 border-white/[0.06]'
              }`}
            >
              <Music className="w-3.5 h-3.5" />
              <span>Beat</span>
            </button>

            <button
              onClick={toggleHand}
              className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-medium border transition-all apple-press ${
                handActive 
                  ? 'bg-pink-500 text-white border-pink-400 font-bold' 
                  : 'bg-white/[0.05] hover:bg-white/[0.09] text-slate-200 border-white/[0.06]'
              }`}
            >
              <Hand className="w-3.5 h-3.5" />
              <span>Hand</span>
            </button>
          </div>

          {/* Mouth Aperture Slider */}
          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-[11px] text-slate-400 font-medium">
              <span className="flex items-center gap-1">
                <Smile className="w-3.5 h-3.5 text-snap-yellow" />
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
      <div className="h-36 bg-[#080B14] border-t border-white/[0.08] flex flex-col font-mono text-[11px]">
        <div className="flex items-center justify-between px-3.5 py-2 bg-[#0E1220] border-b border-white/[0.05] text-slate-400 select-none">
          <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px]">
            <Terminal className="w-3.5 h-3.5 text-snap-yellow" />
            <span>Lens Studio Logger (`print()`)</span>
          </div>
          <button
            onClick={() => { haptics.tap(); onClearLogs(); }}
            className="hover:text-white text-[10px] transition-colors apple-press"
          >
            Clear
          </button>
        </div>

        <div className="flex-1 p-2.5 overflow-y-auto space-y-1">
          {logs.length === 0 ? (
            <div className="text-slate-500 italic">No console logs yet. Interact with the viewfinder above...</div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="flex items-start gap-2 leading-relaxed">
                <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
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
