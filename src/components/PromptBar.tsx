import React, { useState } from 'react';
import { Sparkles, Wand2, RefreshCw, Zap, ArrowRight } from 'lucide-react';
import { ScriptLanguage, EngineVersion } from '../types/lens';
import { haptics } from '../utils/audioHaptics';

interface PromptBarProps {
  onGenerate: (prompt: string, language: ScriptLanguage, engine: EngineVersion) => void;
  isGenerating: boolean;
  selectedLanguage: ScriptLanguage;
  setSelectedLanguage: (lang: ScriptLanguage) => void;
  engineVersion: EngineVersion;
  setEngineVersion: (v: EngineVersion) => void;
}

const PROMPT_SUGGESTIONS = [
  { label: '🕶️ Tap to Cycle 3D Glasses', prompt: 'Create a script that cycles 3D glasses on a face mesh attachment on screen tap with elastic scale bounce' },
  { label: '👄 Mouth-Open Particle Cannon', prompt: 'Detect mouth opening facial blendshape and fire 3D coin particle bursts while updating points score' },
  { label: '🎵 Audio-Reactive Pulse', prompt: 'Analyze live microphone audio spectrum frequencies and scale a 3D model with smooth liquid lerping' },
  { label: '👁️ Double Blink Color LUT', prompt: 'Swap cinematic color grading LUT materials on double eye blink with chromatic glitch transition' },
  { label: '🖐️ Hand Tracking Ribbon Trail', prompt: 'Track index finger 3D coordinates and generate a glowing particle ribbon trail in camera view' },
  { label: '🎮 AR Tap Arcade Game', prompt: 'Build an interactive 60-second floating target tap arcade game with 3D text score count and timer' }
];

export const PromptBar: React.FC<PromptBarProps> = ({
  onGenerate,
  isGenerating,
  selectedLanguage,
  setSelectedLanguage,
  engineVersion,
  setEngineVersion
}) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;
    haptics.snap();
    onGenerate(prompt, selectedLanguage, engineVersion);
  };

  const handleChipClick = (suggestionPrompt: string) => {
    haptics.pop();
    setPrompt(suggestionPrompt);
    onGenerate(suggestionPrompt, selectedLanguage, engineVersion);
  };

  return (
    <div className="w-full apple-glass-subtle border-b border-white/[0.08] p-4 sm:p-5 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-32 bg-snap-yellow/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-96 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1720px] mx-auto space-y-3.5 relative z-10">
        
        {/* Main Prompt Input Box */}
        <form onSubmit={handleSubmit} className="relative flex flex-col md:flex-row items-stretch gap-2.5">
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Wand2 className="w-5 h-5 text-snap-yellow transition-transform group-focus-within:scale-110" />
            </div>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your Snapchat AR Lens logic (e.g., 'Tap screen to swap 3D masks with spring physics and coin sound')..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#0F1424]/90 border border-white/[0.1] text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:border-snap-yellow focus:ring-2 focus:ring-snap-yellow/20 shadow-inner transition-all duration-300"
            />
          </div>

          {/* Engine & Language Selectors */}
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <div className="flex items-center p-1 bg-[#0F1424]/90 rounded-2xl border border-white/[0.08] text-xs font-semibold shadow-inner">
              <button
                type="button"
                onClick={() => { haptics.tap(); setSelectedLanguage('typescript'); }}
                className={`px-3.5 py-2 rounded-xl transition-all duration-200 apple-press ${
                  selectedLanguage === 'typescript'
                    ? 'bg-snap-yellow text-black font-extrabold shadow-glow-yellow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                TS
              </button>
              <button
                type="button"
                onClick={() => { haptics.tap(); setSelectedLanguage('javascript'); }}
                className={`px-3.5 py-2 rounded-xl transition-all duration-200 apple-press ${
                  selectedLanguage === 'javascript'
                    ? 'bg-snap-yellow text-black font-extrabold shadow-glow-yellow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                JS
              </button>
            </div>

            {/* Engine Selector */}
            <select
              value={engineVersion}
              onChange={(e) => { haptics.tap(); setEngineVersion(e.target.value as EngineVersion); }}
              className="px-4 py-3 rounded-2xl bg-[#0F1424]/90 border border-white/[0.08] text-slate-200 text-xs font-semibold focus:outline-none focus:border-snap-yellow cursor-pointer shadow-inner"
            >
              <option value="Lens Studio 5.x">Lens Studio 5.x (Modern)</option>
              <option value="Lens Studio 4.x">Lens Studio 4.x (Legacy)</option>
            </select>

            {/* Generate Button */}
            <button
              type="submit"
              disabled={isGenerating || !prompt.trim()}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-extrabold text-xs uppercase tracking-wider text-black bg-gradient-to-r from-snap-yellow via-yellow-300 to-amber-400 hover:from-yellow-200 hover:to-amber-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-glow-yellow transition-all apple-press"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-black" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-black fill-black" />
                  <span>Generate Script</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Suggestion Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 shrink-0">
            <Zap className="w-3.5 h-3.5 text-snap-yellow" />
            Quick Presets:
          </span>
          {PROMPT_SUGGESTIONS.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleChipClick(item.prompt)}
              className="shrink-0 px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-snap-yellow border border-white/[0.06] hover:border-snap-yellow/30 text-xs font-medium transition-all apple-press shadow-sm"
            >
              {item.label}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};
