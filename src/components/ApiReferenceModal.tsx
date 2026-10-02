import React, { useState } from 'react';
import { X, BookOpen, Search, Copy, Check, ExternalLink } from 'lucide-react';
import { LENS_API_DOCS } from '../data/apiDocs';
import { haptics } from '../utils/audioHaptics';

interface ApiReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiReferenceModal: React.FC<ApiReferenceModalProps> = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filtered = LENS_API_DOCS.filter((doc) =>
    doc.title.toLowerCase().includes(search.toLowerCase()) ||
    doc.description.toLowerCase().includes(search.toLowerCase()) ||
    doc.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleCopy = (id: string, text: string) => {
    haptics.pop();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClose = () => {
    haptics.tap();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-2xl animate-in fade-in duration-250">
      <div className="relative w-full max-w-3xl apple-glass squircle-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh] scale-100 transition-all">
        
        {/* Header */}
        <div className="px-6 py-4.5 bg-[#12162A]/60 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 squircle-sm bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 shadow-sm">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Snapchat Lens Studio API Cheatsheet
              </h3>
              <p className="text-xs text-slate-400">
                Core lifecycle events, vector math, transform APIs, and VFX properties
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all apple-press"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 bg-white/[0.02] border-b border-white/[0.06]">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search APIs, events, math (vec3, quat, TapEvent, VFX)..."
              className="w-full pl-11 pr-4 py-2.5 text-xs squircle-md bg-[#080B14] border border-white/[0.08] text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-400 shadow-inner"
            />
          </div>
        </div>

        {/* API List */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {filtered.map((doc) => (
            <div
              key={doc.id}
              className="p-5 squircle-md bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.14] transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <h4 className="text-sm font-bold text-white tracking-tight">
                    {doc.title}
                  </h4>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-cyan-950/60 text-cyan-300 border border-cyan-700/50">
                    {doc.category}
                  </span>
                </div>

                <button
                  onClick={() => handleCopy(doc.id, doc.snippet)}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-300 transition-colors apple-press"
                >
                  {copiedId === doc.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Snippet</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {doc.description}
              </p>

              <div className="p-3 squircle-sm bg-[#060810] border border-white/[0.05] font-mono text-[11px] text-cyan-300">
                {doc.signature}
              </div>

              <div className="relative p-3.5 squircle-sm bg-[#05060C] border border-white/[0.04] font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed">
                <pre>{doc.snippet}</pre>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#111528]/60 border-t border-white/[0.08] flex items-center justify-between text-xs text-slate-400">
          <a
            href="https://developers.snap.com/lens-studio/api"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-snap-yellow hover:underline apple-press"
          >
            <span>Snapchat Lens Studio Official Documentation</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={handleClose}
            className="px-5 py-2 squircle-sm text-xs font-bold text-black bg-cyan-400 hover:bg-cyan-300 transition-all apple-press shadow-md"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
