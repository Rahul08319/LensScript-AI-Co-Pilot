import React from 'react';
import { Sliders, Layers, Info } from 'lucide-react';
import { ScriptInputParam } from '../types/lens';
import { haptics } from '../utils/audioHaptics';

interface ParameterInspectorProps {
  inputs: ScriptInputParam[];
  onInputChange: (name: string, value: any) => void;
}

export const ParameterInspector: React.FC<ParameterInspectorProps> = ({
  inputs,
  onInputChange
}) => {
  return (
    <div className="apple-glass squircle-lg overflow-hidden shadow-xl flex flex-col">
      {/* Header */}
      <div className="px-5 py-3.5 bg-[#12162A]/60 border-b border-white/[0.08] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-snap-yellow" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Inspector Properties (<span className="text-snap-yellow font-mono">@input</span>)
          </h3>
        </div>
        <span className="text-[10px] text-slate-400 font-mono px-2 py-0.5 rounded-full bg-white/[0.06]">
          {inputs.length} Defined
        </span>
      </div>

      {/* Input List */}
      <div className="p-4 space-y-3 overflow-y-auto max-h-[300px]">
        {inputs.length === 0 ? (
          <div className="text-center py-6 px-4">
            <Layers className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
            <p className="text-xs text-slate-400 font-medium">No <code className="text-snap-yellow font-mono">// @input</code> variables declared in this script.</p>
            <p className="text-[11px] text-slate-400 mt-1">Add <code className="font-mono text-slate-300">// @input float speed = 2.0</code> to expose Inspector controls.</p>
          </div>
        ) : (
          inputs.map((param) => {
            const isBool = param.type.includes('bool');
            const isFloat = param.type.includes('float') || param.type.includes('int') || param.type.includes('number');

            return (
              <div 
                key={param.name}
                className="p-3 rounded-2xl bg-white/[0.04] border border-white/[0.06] hover:border-white/[0.12] transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-200">
                    {param.name}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.08] text-slate-300 font-mono">
                    {param.type}
                  </span>
                </div>

                {/* Input Controller */}
                {isBool ? (
                  <label className="flex items-center gap-2.5 cursor-pointer pt-1 select-none">
                    <input
                      type="checkbox"
                      checked={!!param.currentValue}
                      onChange={(e) => {
                        haptics.pop();
                        onInputChange(param.name, e.target.checked);
                      }}
                      className="w-4 h-4 rounded-md border-slate-700 bg-slate-900 text-snap-yellow focus:ring-snap-yellow"
                    />
                    <span className="text-xs text-slate-300 font-medium">
                      {param.currentValue ? 'Enabled (True)' : 'Disabled (False)'}
                    </span>
                  </label>
                ) : isFloat ? (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-[11px] font-mono text-slate-400">
                      <span>Value</span>
                      <span className="text-snap-yellow font-bold">{param.currentValue ?? param.defaultValue}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max={param.name.toLowerCase().includes('duration') ? '5' : '100'}
                      step={param.name.toLowerCase().includes('duration') ? '0.05' : '1'}
                      value={param.currentValue ?? param.defaultValue ?? 1}
                      onChange={(e) => {
                        onInputChange(param.name, parseFloat(e.target.value));
                      }}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-snap-yellow"
                    />
                  </div>
                ) : (
                  <input
                    type="text"
                    value={param.currentValue ?? param.defaultValue ?? ''}
                    onChange={(e) => onInputChange(param.name, e.target.value)}
                    placeholder="Reference in Lens Studio..."
                    className="w-full px-3 py-1.5 text-xs rounded-xl bg-[#090C16] border border-white/[0.08] text-slate-200 focus:outline-none focus:border-snap-yellow"
                  />
                )}

                {param.description && (
                  <p className="text-[10px] text-slate-400 italic">
                    {param.description}
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="px-5 py-3 bg-[#101426]/60 border-t border-white/[0.06] text-[11px] text-slate-400 flex items-center gap-2">
        <Info className="w-3.5 h-3.5 text-snap-yellow shrink-0" />
        <span>Modifications in this panel reflect directly in the Inspector GUI inside Lens Studio.</span>
      </div>
    </div>
  );
};
