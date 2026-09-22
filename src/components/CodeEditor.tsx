import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  Download, 
  FileCode, 
  AlertTriangle, 
  Info, 
  AlertCircle, 
  CheckCircle2,
  Terminal,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { DiagnosticItem, ScriptLanguage } from '../types/lens';

interface CodeEditorProps {
  code: string;
  setCode: (code: string) => void;
  language: ScriptLanguage;
  diagnostics: DiagnosticItem[];
  onDownload: () => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  setCode,
  language,
  diagnostics,
  onDownload
}) => {
  const [copied, setCopied] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(true);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split('\n');
  const errorCount = diagnostics.filter(d => d.type === 'error').length;
  const warningCount = diagnostics.filter(d => d.type === 'warning').length;

  return (
    <div className="flex flex-col h-full bg-[#0E121E] rounded-2xl border border-white/[0.08] overflow-hidden shadow-2xl">
      
      {/* Editor Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#131828] border-b border-white/[0.08] select-none">
        
        {/* File info & badge */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#1B2136] border border-white/[0.06] text-xs font-mono text-slate-200">
            <FileCode className="w-3.5 h-3.5 text-snap-yellow" />
            <span>LensScript.{language === 'typescript' ? 'ts' : 'js'}</span>
          </div>
          
          <span className="hidden sm:inline-block text-[11px] text-slate-400 font-medium">
            {lines.length} lines • {(new Blob([code]).size / 1024).toFixed(1)} KB
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Linter / Diagnostics indicator badge */}
          <button
            onClick={() => setShowDiagnostics(!showDiagnostics)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              errorCount > 0
                ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                : warningCount > 0
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            }`}
            title="Toggle Diagnostics Panel"
          >
            {errorCount > 0 ? (
              <AlertCircle className="w-3.5 h-3.5" />
            ) : warningCount > 0 ? (
              <AlertTriangle className="w-3.5 h-3.5" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5" />
            )}
            <span>{errorCount + warningCount} Linter Notes</span>
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#1D243D] hover:bg-[#252E4D] text-slate-200 text-xs font-semibold border border-white/[0.08] transition-all"
            title="Copy script to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-300" />
                <span>Copy</span>
              </>
            )}
          </button>

          {/* Download Button */}
          <button
            onClick={onDownload}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#1D243D] hover:bg-snap-yellow hover:text-black text-slate-200 text-xs font-semibold border border-white/[0.08] transition-all"
            title="Save script file"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Save</span>
          </button>
        </div>
      </div>

      {/* Editor Main Code Area */}
      <div className="relative flex-1 flex overflow-hidden font-mono text-xs sm:text-[13px] leading-relaxed">
        {/* Line Numbers */}
        <div className="w-12 py-4 select-none bg-[#0B0E19] text-slate-400 text-right pr-3 shrink-0 border-r border-white/[0.05] font-mono">
          {lines.map((_, i) => (
            <div key={i} className="h-6">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Textarea code container */}
        <div className="relative flex-1 h-full overflow-auto">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className="w-full h-full p-4 bg-transparent text-slate-200 focus:outline-none resize-none font-mono selection:bg-snap-yellow/30 selection:text-white"
            style={{ lineHeight: '1.5rem', tabSize: 2 }}
          />
        </div>
      </div>

      {/* Diagnostics Drawer (Bottom) */}
      {showDiagnostics && diagnostics.length > 0 && (
        <div className="border-t border-white/[0.08] bg-[#0B0E18] p-3 max-h-48 overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-snap-yellow" />
              Lens Studio Compatibility & Engine Diagnostics ({diagnostics.length})
            </span>
            <button
              onClick={() => setShowDiagnostics(false)}
              className="text-[11px] text-slate-400 hover:text-white"
            >
              Dismiss
            </button>
          </div>

          <div className="space-y-1.5">
            {diagnostics.map((diag) => (
              <div
                key={diag.id}
                className={`p-2 rounded-lg text-xs flex items-start gap-2.5 ${
                  diag.type === 'error'
                    ? 'bg-rose-950/40 border border-rose-800/40 text-rose-200'
                    : diag.type === 'warning'
                    ? 'bg-amber-950/40 border border-amber-800/40 text-amber-200'
                    : 'bg-blue-950/40 border border-blue-800/40 text-blue-200'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {diag.type === 'error' ? (
                    <AlertCircle className="w-4 h-4 text-rose-400" />
                  ) : diag.type === 'warning' ? (
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Info className="w-4 h-4 text-blue-400" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Line {diag.line}:</span>
                    <span>{diag.message}</span>
                  </div>
                  {diag.suggestion && (
                    <div className="mt-1 text-[11px] opacity-80 italic">
                      💡 Tip: {diag.suggestion}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
