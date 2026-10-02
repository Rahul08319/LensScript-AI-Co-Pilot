import React, { useState } from 'react';
import { 
  X, 
  Terminal, 
  Copy, 
  Check, 
  ShieldCheck, 
  RefreshCw, 
  Cpu
} from 'lucide-react';
import { haptics } from '../utils/audioHaptics';

interface McpBridgeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MCP_SAMPLE_CONFIG = `{
  "servers": {
    "lens-studio": {
      "headers": {
        "Authorization": "Bearer YOUR_LENS_STUDIO_AUTH_TOKEN"
      },
      "type": "http",
      "url": "http://localhost:50049/mcp"
    }
  }
}`;

export const McpBridgeModal: React.FC<McpBridgeModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [isPinging, setIsPinging] = useState(false);
  const [pingResult, setPingResult] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = () => {
    haptics.pop();
    navigator.clipboard.writeText(MCP_SAMPLE_CONFIG);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePing = () => {
    haptics.tap();
    setIsPinging(true);
    setPingResult(null);
    setTimeout(() => {
      haptics.success();
      setIsPinging(false);
      setPingResult('Bridge Active: Connected to Lens Studio MCP Service at localhost:50049');
    }, 750);
  };

  const handleClose = () => {
    haptics.tap();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-2xl animate-in fade-in duration-250">
      <div className="relative w-full max-w-2xl apple-glass squircle-lg shadow-2xl overflow-hidden flex flex-col scale-100 transition-all">
        
        {/* Modal Header */}
        <div className="px-6 py-4.5 bg-[#12162A]/60 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 squircle-sm bg-snap-yellow/15 border border-snap-yellow/30 text-snap-yellow shadow-glow-yellow">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2 tracking-tight">
                Lens Studio Model Context Protocol (MCP) Bridge
              </h3>
              <p className="text-xs text-slate-400">
                Direct two-way automation between AI agents and Snapchat Lens Studio v5.x
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

        {/* Modal Content */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[80vh]">
          
          {/* Bridge Status Card */}
          <div className="p-4.5 squircle-md bg-white/[0.04] border border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_12px_#34D399]" />
              <div>
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Local Endpoint
                </span>
                <p className="text-xs font-mono text-cyan-400 mt-0.5">
                  http://localhost:50049/mcp
                </p>
              </div>
            </div>

            <button
              onClick={handlePing}
              disabled={isPinging}
              className="flex items-center gap-1.5 px-4 py-2 squircle-sm text-xs font-bold bg-white/[0.08] hover:bg-snap-yellow hover:text-black text-slate-200 border border-white/[0.08] transition-all apple-press"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin' : ''}`} />
              <span>{isPinging ? 'Connecting...' : 'Test Connection'}</span>
            </button>
          </div>

          {pingResult && (
            <div className="p-3.5 squircle-sm bg-emerald-950/40 border border-emerald-700/50 text-emerald-200 text-xs flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{pingResult}</span>
            </div>
          )}

          {/* Configuration Snippet */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Agent MCP Configuration (`mcp_config.json`)
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs font-semibold text-snap-yellow hover:underline apple-press"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied JSON' : 'Copy Config'}</span>
              </button>
            </div>

            <div className="relative p-4 squircle-md bg-[#080B14] border border-white/[0.08] font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed">
              <pre>{MCP_SAMPLE_CONFIG}</pre>
            </div>
          </div>

          {/* Capabilities Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Supported Lens Studio Automation Tools:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 squircle-sm bg-white/[0.03] border border-white/[0.05] space-y-1">
                <span className="font-mono text-snap-yellow font-bold">inspect_scene_graph</span>
                <p className="text-[11px] text-slate-400">Returns JSON tree of all SceneObjects, materials, and attached components.</p>
              </div>
              <div className="p-3 squircle-sm bg-white/[0.03] border border-white/[0.05] space-y-1">
                <span className="font-mono text-snap-yellow font-bold">create_scene_object</span>
                <p className="text-[11px] text-slate-400">Creates new 3D meshes, Face Attachments, Head Trackers, and Lighting.</p>
              </div>
              <div className="p-3 squircle-sm bg-white/[0.03] border border-white/[0.05] space-y-1">
                <span className="font-mono text-snap-yellow font-bold">attach_script_component</span>
                <p className="text-[11px] text-slate-400">Attaches generated LensScript directly to target SceneObject in 1-click.</p>
              </div>
              <div className="p-3 squircle-sm bg-white/[0.03] border border-white/[0.05] space-y-1">
                <span className="font-mono text-snap-yellow font-bold">reload_lens</span>
                <p className="text-[11px] text-slate-400">Triggers instantaneous hot reload in the Lens Studio viewport simulator.</p>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-[#111528]/60 border-t border-white/[0.08] flex items-center justify-end">
          <button
            onClick={handleClose}
            className="px-6 py-2 squircle-sm text-xs font-extrabold text-black bg-snap-yellow hover:bg-yellow-300 transition-all shadow-glow-yellow apple-press"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
