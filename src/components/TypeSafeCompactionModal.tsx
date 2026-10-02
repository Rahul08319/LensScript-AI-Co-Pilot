import React, { useState } from 'react';
import { 
  X, 
  Brain, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  FileText, 
  Minimize2, 
  Cpu, 
  Zap,
  Info,
  ShieldCheck
} from 'lucide-react';
import { 
  classifyToolCall, 
  compactToolHistory, 
  ToolCallData, 
  TYPESAFE_COMPACTION_SPEC 
} from '../utils/typesafeCategorizer';
import { haptics } from '../utils/audioHaptics';

interface TypeSafeCompactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SAMPLE_MCP_CALLS: ToolCallData[] = [
  {
    id: 'tc-1',
    name: 'inspect_scene_graph',
    arguments: { depth: 3, includeComponents: true },
    outputPreview: '{"SceneObjects": [{"name": "FaceAttachment", "children": 8, "components": ["RenderMeshVisual", "Script"]}]}',
    timestamp: '00:01.24'
  },
  {
    id: 'tc-2',
    name: 'create_scene_object',
    arguments: { name: 'HolographicCrown', parent: 'FaceAttachment' },
    outputPreview: '{"status": "created", "id": "obj_9942", "transform": {"x": 0, "y": 12, "z": 0}}',
    timestamp: '00:01.89'
  },
  {
    id: 'tc-3',
    name: 'attach_script_component',
    arguments: { objectId: 'obj_9942', scriptPath: 'LensScript.ts' },
    outputPreview: '{"status": "attached", "componentId": "comp_102"}',
    timestamp: '00:02.15'
  },
  {
    id: 'tc-4',
    name: 'ping_mcp_server',
    arguments: {},
    outputPreview: '{"status": "pong", "latencyMs": 4, "server": "LensStudioMCP/5.4"}',
    timestamp: '00:02.40'
  },
  {
    id: 'tc-5',
    name: 'get_fps_metrics',
    arguments: { sampleWindowMs: 500 },
    outputPreview: '{"fps": 60.1, "frameTimeMs": 16.6, "drawCalls": 42}',
    timestamp: '00:02.80'
  },
  {
    id: 'tc-6',
    name: 'set_component_property',
    arguments: { componentId: 'comp_102', property: 'popDuration', value: 0.35 },
    outputPreview: '{"status": "updated", "property": "popDuration", "newValue": 0.35}',
    timestamp: '00:03.10'
  }
];

export const TypeSafeCompactionModal: React.FC<TypeSafeCompactionModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'evaluation' | 'spec'>('evaluation');
  const [isCompacted, setIsCompacted] = useState(false);

  if (!isOpen) return null;

  const compactionResults = compactToolHistory(SAMPLE_MCP_CALLS);

  const handleToggleCompact = () => {
    haptics.pop();
    setIsCompacted(!isCompacted);
  };

  const handleClose = () => {
    haptics.tap();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-2xl animate-in fade-in duration-250">
      <div className="relative w-full max-w-3xl apple-glass squircle-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4.5 bg-[#12162A]/60 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 squircle-sm bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-400/30 text-indigo-400 shadow-sm">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  TypeSafe Choice Primitive • Tool Compaction Engine
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  System One (Jev)
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Evaluating tool categorization accuracy and safe context reduction
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

        {/* Sub-nav Tabs */}
        <div className="px-6 py-2.5 bg-white/[0.02] border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => { haptics.tap(); setActiveTab('evaluation'); }}
              className={`px-3 py-1 rounded-xl text-xs font-semibold apple-press transition-all ${
                activeTab === 'evaluation'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Interactive Compaction Studio
            </button>
            <button
              onClick={() => { haptics.tap(); setActiveTab('spec'); }}
              className={`px-3 py-1 rounded-xl text-xs font-semibold apple-press transition-all ${
                activeTab === 'spec'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              TypeSafe Prompting Spec
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-500/30">
              {compactionResults.compressionRatio}
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {activeTab === 'evaluation' ? (
            <div className="space-y-4">
              
              {/* Summary Banner */}
              <div className="p-4 squircle-md bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900/40 border border-indigo-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    Context Compaction Accuracy
                  </h4>
                  <p className="text-xs text-slate-300 mt-1">
                    {compactionResults.summary}
                  </p>
                </div>

                <button
                  onClick={handleToggleCompact}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-500 text-white hover:bg-indigo-400 shadow-md transition-all apple-press shrink-0 flex items-center gap-1.5"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span>{isCompacted ? 'Show Raw History' : 'Apply TypeSafe Compaction'}</span>
                </button>
              </div>

              {/* Tool Calls List */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold uppercase tracking-wider px-1">
                  <span>Tool Execution Call</span>
                  <span>TypeSafe Choice Judgment</span>
                </div>

                {SAMPLE_MCP_CALLS.map((tool) => {
                  const judgment = classifyToolCall(tool);
                  const isPreserved = judgment.compactionAction === 'preserve_full';
                  const isCompactMode = isCompacted && !isPreserved;

                  return (
                    <div
                      key={tool.id}
                      className={`p-3.5 squircle-sm border transition-all ${
                        isCompactMode
                          ? 'bg-white/[0.02] border-white/[0.04] opacity-70'
                          : isPreserved
                          ? 'bg-amber-950/15 border-amber-500/30 shadow-sm'
                          : 'bg-white/[0.04] border-white/[0.06]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-white">
                              {tool.name}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">
                              [{tool.timestamp}]
                            </span>
                            {isPreserved && (
                              <span className="px-2 py-0.2 rounded-full text-[9px] font-extrabold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                State Mutation (Kept)
                              </span>
                            )}
                          </div>

                          {isCompactMode ? (
                            <p className="text-xs text-indigo-300 font-mono italic">
                              ↳ Compacted to Receipt: [{tool.name} completed successfully]
                            </p>
                          ) : (
                            <div className="text-[11px] font-mono text-slate-400 line-clamp-1">
                              args: {JSON.stringify(tool.arguments)}
                            </div>
                          )}
                        </div>

                        {/* Choice Probability Indicator */}
                        <div className="text-right shrink-0">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                            judgment.category === 'state_mutation'
                              ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                              : judgment.category === 'read_only_query'
                              ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                              : 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                          }`}>
                            {judgment.category} ({(judgment.confidence * 100).toFixed(0)}%)
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          ) : (
            /* TypeSafe Prompting Spec View */
            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <div className="p-4 squircle-md bg-white/[0.03] border border-white/[0.06] space-y-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  TypeSafe System One Prompting Rules for `src/core.ts`
                </h4>
                <p>
                  To maximize judgment accuracy and prevent model drift, instructions in `src/core.ts` must follow TypeSafe's official System One contract:
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 squircle-sm bg-white/[0.02] border border-white/[0.05] space-y-1.5">
                  <span className="font-bold text-white">1. Single Narrow Judgment in `instructions`:</span>
                  <div className="p-2 rounded-lg bg-[#070912] font-mono text-[11px] text-cyan-300">
                    instructions: "{TYPESAFE_COMPACTION_SPEC.instructions}"
                  </div>
                </div>

                <div className="p-3.5 squircle-sm bg-white/[0.02] border border-white/[0.05] space-y-1.5">
                  <span className="font-bold text-white">2. Mutually Exclusive Categories in `criteria`:</span>
                  <div className="space-y-1.5 pt-1">
                    {TYPESAFE_COMPACTION_SPEC.criteria.map((c) => (
                      <div key={c.id} className="p-2 rounded-lg bg-[#070912] font-mono text-[11px]">
                        <span className="text-snap-yellow font-bold">{c.id}</span>: <span className="text-slate-400">{c.description}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 squircle-sm bg-white/[0.02] border border-white/[0.05] space-y-1">
                  <span className="font-bold text-white">3. Zero Conversational Overhead:</span>
                  <p className="text-[11px] text-slate-400">
                    Jev does not produce preamble, chain-of-thought, or text justification. This eliminates ~200-500ms of token generation overhead on every tool invocation.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-[#111528]/60 border-t border-white/[0.08] flex items-center justify-between text-xs text-slate-400">
          <span className="text-[11px] font-medium text-slate-400">
            Evaluated with TypeSafe System One (Jev) Engine
          </span>

          <button
            onClick={handleClose}
            className="px-5 py-2 squircle-sm text-xs font-bold text-white bg-indigo-500 hover:bg-indigo-400 transition-all apple-press shadow-md"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
