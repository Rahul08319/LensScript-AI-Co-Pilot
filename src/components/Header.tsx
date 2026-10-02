import React from 'react';
import { 
  Sparkles, 
  Terminal, 
  BookOpen, 
  Layers, 
  Download, 
  Cpu, 
  Github, 
  Volume2, 
  VolumeX, 
  Brain
} from 'lucide-react';
import { haptics } from '../utils/audioHaptics';

interface HeaderProps {
  activeTab: 'studio' | 'templates';
  setActiveTab: (tab: 'studio' | 'templates') => void;
  onOpenMcpModal: () => void;
  onOpenApiModal: () => void;
  onOpenTypeSafeModal: () => void;
  onDownloadScript: () => void;
  scriptLanguage: string;
  isSoundEnabled: boolean;
  setIsSoundEnabled: (v: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenMcpModal,
  onOpenApiModal,
  onOpenTypeSafeModal,
  onDownloadScript,
  scriptLanguage,
  isSoundEnabled,
  setIsSoundEnabled
}) => {
  const toggleSound = () => {
    const next = !isSoundEnabled;
    setIsSoundEnabled(next);
    haptics.enabled = next;
    if (next) haptics.pop();
  };

  const handleTabClick = (tab: 'studio' | 'templates') => {
    haptics.tap();
    setActiveTab(tab);
  };

  return (
    <header className="sticky top-0 z-40 w-full apple-glass border-b border-white/[0.08] transition-all">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Apple Squircle Monogram */}
        <div className="flex items-center gap-3.5">
          <div className="relative group cursor-pointer apple-press" onClick={() => haptics.pop()}>
            <div className="w-10 h-10 squircle-sm bg-gradient-to-br from-snap-yellow via-amber-400 to-amber-600 p-[1.5px] shadow-glow-yellow">
              <div className="w-full h-full bg-[#0B0D16] squircle-sm flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                <Sparkles className="w-5 h-5 text-snap-yellow group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#0B0D16] shadow-sm" title="AI Engine Ready" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-[17px] tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                LensScript
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-snap-yellow/15 text-snap-yellow border border-snap-yellow/30 rounded-full shadow-sm">
                Studio
              </span>
            </div>
            <p className="text-[11px] text-slate-400 flex items-center gap-1.5 font-medium tracking-tight">
              Snapchat AR Co-Pilot <span className="inline-block w-1 h-1 rounded-full bg-slate-600" /> Engine 5.x Ready
            </p>
          </div>
        </div>

        {/* Apple-Style Segmented Navigation Dock */}
        <div className="hidden md:flex items-center bg-[#0C101C]/80 p-1 squircle-md border border-white/[0.08] shadow-inner relative">
          <button
            onClick={() => handleTabClick('studio')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-semibold apple-press transition-all duration-300 ${
              activeTab === 'studio'
                ? 'bg-snap-yellow text-black font-bold shadow-glow-yellow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            Studio Workspace
          </button>
          
          <button
            onClick={() => handleTabClick('templates')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-semibold apple-press transition-all duration-300 ${
              activeTab === 'templates'
                ? 'bg-snap-yellow text-black font-bold shadow-glow-yellow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            AR Templates
            <span className={`ml-1 px-1.5 py-0.2 text-[9px] rounded-full font-mono ${
              activeTab === 'templates' ? 'bg-black/20 text-black' : 'bg-white/10 text-slate-300'
            }`}>
              8+
            </span>
          </button>
        </div>

        {/* Action Controls & External Tools */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Audio Haptics Toggle */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-xl border transition-all apple-press ${
              isSoundEnabled 
                ? 'bg-snap-yellow/15 border-snap-yellow/40 text-snap-yellow shadow-glow-yellow' 
                : 'bg-white/[0.04] border-white/[0.08] text-slate-400 hover:text-white'
            }`}
            title={isSoundEnabled ? 'Audio Feedback Enabled' : 'Audio Muted'}
          >
            {isSoundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* TypeSafe Compaction Trigger */}
          <button
            onClick={() => { haptics.tap(); onOpenTypeSafeModal(); }}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-indigo-200 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 transition-all apple-press shadow-sm"
            title="TypeSafe Choice Primitive & Compaction"
          >
            <Brain className="w-3.5 h-3.5 text-indigo-400" />
            <span>TypeSafe AI</span>
          </button>

          {/* MCP Bridge Trigger */}
          <button
            onClick={() => { haptics.tap(); onOpenMcpModal(); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-200 bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] hover:border-snap-yellow/40 transition-all apple-press"
            title="Configure Lens Studio MCP Server"
          >
            <Terminal className="w-3.5 h-3.5 text-snap-yellow" />
            <span className="hidden sm:inline">MCP Bridge</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>

          {/* API Cheatsheet Trigger */}
          <button
            onClick={() => { haptics.tap(); onOpenApiModal(); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-200 bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] hover:border-cyan-400/40 transition-all apple-press"
            title="Snapchat Lens Studio API Reference"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">API Docs</span>
          </button>

          {/* Download Script */}
          <button
            onClick={() => { haptics.snap(); onDownloadScript(); }}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold text-black bg-gradient-to-r from-snap-yellow to-amber-400 hover:from-yellow-300 hover:to-amber-300 transition-all shadow-glow-yellow apple-press"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export .{scriptLanguage === 'typescript' ? 'ts' : 'js'}</span>
          </button>

          {/* GitHub Repo */}
          <a
            href="https://github.com/Rahul08319/LensScript-AI-Co-Pilot"
            target="_blank"
            rel="noreferrer"
            onClick={() => haptics.tap()}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] transition-all apple-press"
            title="View on GitHub"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>

      </div>
    </header>
  );
};
