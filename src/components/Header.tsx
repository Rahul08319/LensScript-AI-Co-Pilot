import React from 'react';
import { 
  Sparkles, 
  Terminal, 
  BookOpen, 
  Layers, 
  ExternalLink, 
  Download, 
  CheckCircle2, 
  Cpu,
  Github
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'studio' | 'templates';
  setActiveTab: (tab: 'studio' | 'templates') => void;
  onOpenMcpModal: () => void;
  onOpenApiModal: () => void;
  onDownloadScript: () => void;
  scriptLanguage: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenMcpModal,
  onOpenApiModal,
  onDownloadScript,
  scriptLanguage
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#080A0F]/85 backdrop-blur-xl transition-all">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-snap-yellow to-amber-500 p-[1.5px] shadow-glow-yellow transition-transform duration-300 group-hover:scale-105">
              <div className="w-full h-full bg-[#0B0E17] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-snap-yellow animate-pulse" />
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#0B0E17]" title="AI Co-Pilot Active" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                LensScript
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-snap-yellow/15 text-snap-yellow border border-snap-yellow/30 rounded-full">
                AI Co-Pilot
              </span>
            </div>
            <p className="text-[11px] text-slate-400 flex items-center gap-1.5 font-medium">
              Snapchat AR Studio Assistant <span className="inline-block w-1 h-1 rounded-full bg-slate-600" /> Lens Studio 5.x Ready
            </p>
          </div>
        </div>

        {/* Center Navigation Tabs */}
        <div className="hidden md:flex items-center bg-[#101422] p-1 rounded-xl border border-white/[0.06]">
          <button
            onClick={() => setActiveTab('studio')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'studio'
                ? 'bg-snap-yellow text-black shadow-glow-yellow'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            Studio Workspace
          </button>
          
          <button
            onClick={() => setActiveTab('templates')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'templates'
                ? 'bg-snap-yellow text-black shadow-glow-yellow'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            AR Templates
            <span className="ml-1 px-1.5 py-0.2 text-[9px] rounded-full bg-white/20 text-current">
              8+
            </span>
          </button>
        </div>

        {/* Action Controls & External Tools */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* MCP Bridge Trigger */}
          <button
            onClick={onOpenMcpModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-surface-card hover:bg-surface-cardHover border border-white/[0.08] hover:border-snap-yellow/40 transition-all"
            title="Configure Lens Studio MCP Server"
          >
            <Terminal className="w-3.5 h-3.5 text-snap-yellow" />
            <span className="hidden sm:inline">MCP Bridge</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping opacity-75" />
          </button>

          {/* API Cheatsheet Trigger */}
          <button
            onClick={onOpenApiModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-surface-card hover:bg-surface-cardHover border border-white/[0.08] hover:border-snap-yellow/40 transition-all"
            title="Snapchat Lens Studio API Reference"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">API Docs</span>
          </button>

          {/* Download Script */}
          <button
            onClick={onDownloadScript}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-black bg-gradient-to-r from-snap-yellow to-amber-400 hover:from-yellow-300 hover:to-amber-300 transition-all shadow-glow-yellow active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export .{scriptLanguage === 'typescript' ? 'ts' : 'js'}</span>
          </button>

          {/* GitHub Repo */}
          <a
            href="https://github.com/Rahul08319/LensScript-AI-Co-Pilot"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-lg text-slate-400 hover:text-white bg-surface-card hover:bg-surface-cardHover border border-white/[0.08] transition-all"
            title="View on GitHub"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>

      </div>
    </header>
  );
};
