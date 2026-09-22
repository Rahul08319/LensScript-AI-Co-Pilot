import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  ArrowRight, 
  Code2, 
  Check, 
  Eye, 
  Smile, 
  Hand, 
  Globe, 
  Music, 
  Flame,
  Sliders
} from 'lucide-react';
import { LensTemplate, ScriptCategory } from '../types/lens';
import { LENS_TEMPLATES } from '../data/templates';

interface TemplateGalleryProps {
  onSelectTemplate: (template: LensTemplate) => void;
  activeTemplateId?: string;
}

const CATEGORIES: { id: ScriptCategory | 'all'; label: string; icon: any }[] = [
  { id: 'all', label: 'All Templates', icon: Sparkles },
  { id: 'face', label: 'Face Tracking', icon: Smile },
  { id: 'interaction', label: 'Tap & Gestures', icon: Sliders },
  { id: 'audio', label: 'Audio Reactive', icon: Music },
  { id: 'hand', label: 'Hand Tracking', icon: Hand },
  { id: 'world', label: 'World Tracking', icon: Globe },
];

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  onSelectTemplate,
  activeTemplateId
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ScriptCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = LENS_TEMPLATES.filter((tpl) => {
    const matchesCat = selectedCategory === 'all' || tpl.category === selectedCategory;
    const matchesQuery = tpl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tpl.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="w-full max-w-[1720px] mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Gallery Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-snap-yellow/10 border border-snap-yellow/30 text-snap-yellow">
              <Code2 className="w-5 h-5" />
            </span>
            Battle-Tested AR Lens Studio Templates
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Production-grade, typed Snapchat Lens Studio scripts ready to attach to SceneObjects or customize.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates, inputs, events..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-[#131828] border border-white/[0.08] text-slate-200 placeholder-slate-400 focus:outline-none focus:border-snap-yellow"
          />
        </div>
      </div>

      {/* Categories Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-snap-yellow text-black font-bold shadow-glow-yellow'
                  : 'bg-[#131828] text-slate-300 hover:text-white hover:bg-[#1A2238] border border-white/[0.06]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((tpl) => {
          const isSelected = activeTemplateId === tpl.id;
          return (
            <div
              key={tpl.id}
              className={`group flex flex-col justify-between p-5 rounded-2xl bg-[#0F1424] border transition-all duration-300 ${
                isSelected
                  ? 'border-snap-yellow/60 shadow-glow-yellow bg-[#12192E]'
                  : 'border-white/[0.07] hover:border-white/[0.18] hover:bg-[#131A30]'
              }`}
            >
              <div className="space-y-3">
                {/* Header row with badges */}
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-snap-yellow/15 text-snap-yellow border border-snap-yellow/30">
                    {tpl.badge}
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                    <span className="px-2 py-0.5 rounded bg-white/[0.05]">
                      {tpl.language.toUpperCase()}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-white/[0.05]">
                      {tpl.engine}
                    </span>
                  </div>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-snap-yellow transition-colors">
                    {tpl.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    {tpl.description}
                  </p>
                </div>

                {/* Defined Inputs pill list */}
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Declared Properties:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {tpl.inputs.map((inp) => (
                      <span key={inp.name} className="px-2 py-0.5 rounded-md bg-[#1B233D] text-[10px] font-mono text-slate-300 border border-white/[0.05]">
                        @{inp.name} <span className="text-slate-400">({inp.type})</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-[11px] text-slate-400 italic">
                  {tpl.triggerTip}
                </span>
                
                <button
                  onClick={() => onSelectTemplate(tpl)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-emerald-500 text-black'
                      : 'bg-white/[0.08] hover:bg-snap-yellow hover:text-black text-white group-hover:shadow-glow-yellow'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Loaded</span>
                    </>
                  ) : (
                    <>
                      <span>Open in Studio</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
