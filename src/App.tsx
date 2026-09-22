import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PromptBar } from './components/PromptBar';
import { CodeEditor } from './components/CodeEditor';
import { ParameterInspector } from './components/ParameterInspector';
import { ARSimulator } from './components/ARSimulator';
import { TemplateGallery } from './components/TemplateGallery';
import { McpBridgeModal } from './components/McpBridgeModal';
import { ApiReferenceModal } from './components/ApiReferenceModal';
import { LENS_TEMPLATES } from './data/templates';
import { lintLensScript, parseScriptInputs } from './utils/linter';
import { generateLensScript } from './utils/scriptGenerator';
import { 
  ScriptLanguage, 
  EngineVersion, 
  DiagnosticItem, 
  ScriptInputParam, 
  ConsoleLogMessage, 
  LensTemplate 
} from './types/lens';

export function App() {
  const [activeTab, setActiveTab] = useState<'studio' | 'templates'>('studio');
  const [activeTemplateId, setActiveTemplateId] = useState<string>('tap-to-swap-props');
  const [selectedLanguage, setSelectedLanguage] = useState<ScriptLanguage>('typescript');
  const [engineVersion, setEngineVersion] = useState<EngineVersion>('Lens Studio 5.x');
  
  // Script Code state
  const [code, setCode] = useState<string>(LENS_TEMPLATES[0].code);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Dynamic parsing
  const [diagnostics, setDiagnostics] = useState<DiagnosticItem[]>([]);
  const [inputs, setInputs] = useState<ScriptInputParam[]>([]);
  
  // AR Simulator states
  const [logs, setLogs] = useState<ConsoleLogMessage[]>([
    { id: '1', timestamp: '00:00.01', level: 'print', text: '[LensScript] Studio Initialized with Lens Studio 5.x Engine' },
    { id: '2', timestamp: '00:00.02', level: 'print', text: '[LensScript] Tap-to-Cycle 3D Face Props Script loaded' }
  ]);
  const [attachedPropIndex, setAttachedPropIndex] = useState(0);

  // Modals
  const [isMcpModalOpen, setIsMcpModalOpen] = useState(false);
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);

  // Parse diagnostics and inputs whenever code changes
  useEffect(() => {
    const diag = lintLensScript(code);
    setDiagnostics(diag);

    const parsed = parseScriptInputs(code);
    setInputs(parsed);
  }, [code]);

  // Handle Event from Simulator
  const handleTriggerEvent = (eventName: string, data?: any) => {
    const now = new Date();
    const timeStr = `${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(Math.floor(now.getMilliseconds() / 10)).padStart(2, '0')}`;

    if (eventName === 'TapEvent') {
      const nextIndex = (attachedPropIndex + 1) % 4;
      setAttachedPropIndex(nextIndex);
      addLog(timeStr, 'print', `[LensScript] Screen Tapped! Swapped to Prop Index: ${nextIndex}`);
    } else if (eventName === 'MouthOpenedEvent') {
      addLog(timeStr, 'print', `[LensScript] Mouth Opened (${(data.ratio * 100).toFixed(0)}%)! Fired Coin Particle Burst`);
    } else if (eventName === 'MouthClosedEvent') {
      addLog(timeStr, 'print', `[LensScript] Mouth Closed. Particle Emitter Reset`);
    } else if (eventName === 'EyeBlinkEvent') {
      addLog(timeStr, 'print', `[LensScript] Eye Blink Detected! Switched PostEffect LUT Palette`);
    } else if (eventName === 'AudioBeatPulse') {
      addLog(timeStr, 'print', `[LensScript] Audio Spectrum Beat Triggered! Intensity: 1.8x`);
    } else if (eventName === 'HandFoundEvent') {
      addLog(timeStr, 'print', `[LensScript] Hand Landmarks Detected! Magic Ribbon Emitting`);
    } else if (eventName === 'HandLostEvent') {
      addLog(timeStr, 'print', `[LensScript] Hand Tracking Lost`);
    } else if (eventName === 'SimulatorReset') {
      setAttachedPropIndex(0);
      addLog(timeStr, 'info', `[LensScript] Simulator State Reset`);
    }
  };

  const addLog = (timestamp: string, level: 'info' | 'warn' | 'error' | 'print', text: string) => {
    setLogs((prev) => [
      ...prev.slice(-40),
      { id: Math.random().toString(36).substr(2, 9), timestamp, level, text }
    ]);
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  // Generate Script with AI
  const handleGenerateScript = (prompt: string, language: ScriptLanguage, engine: EngineVersion) => {
    setIsGenerating(true);
    const now = new Date();
    const timeStr = `${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(Math.floor(now.getMilliseconds() / 10)).padStart(2, '0')}`;
    addLog(timeStr, 'info', `[LensScript AI] Generating Lens Studio ${language} for prompt: "${prompt}"...`);

    setTimeout(() => {
      const generated = generateLensScript({ prompt, language, engine });
      setCode(generated);
      setSelectedLanguage(language);
      setEngineVersion(engine);
      setIsGenerating(false);
      setActiveTab('studio');
      addLog(timeStr, 'print', `[LensScript AI] Script Synthesized Successfully! Ready to test.`);
    }, 700);
  };

  // Select Template
  const handleSelectTemplate = (template: LensTemplate) => {
    setCode(template.code);
    setSelectedLanguage(template.language);
    setEngineVersion(template.engine);
    setActiveTemplateId(template.id);
    setActiveTab('studio');

    const now = new Date();
    const timeStr = `${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(Math.floor(now.getMilliseconds() / 10)).padStart(2, '0')}`;
    addLog(timeStr, 'print', `[LensScript] Loaded Template: "${template.title}"`);
  };

  // Download Script
  const handleDownloadScript = () => {
    const ext = selectedLanguage === 'typescript' ? 'ts' : 'js';
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `LensScript.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Dynamic Inspector change
  const handleInputChange = (name: string, value: any) => {
    setInputs((prev) =>
      prev.map((inp) => (inp.name === name ? { ...inp, currentValue: value } : inp))
    );
    const now = new Date();
    const timeStr = `${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(Math.floor(now.getMilliseconds() / 10)).padStart(2, '0')}`;
    addLog(timeStr, 'print', `[LensScript Inspector] Updated @${name} = ${value}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080A0F] text-slate-100">
      
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenMcpModal={() => setIsMcpModalOpen(true)}
        onOpenApiModal={() => setIsApiModalOpen(true)}
        onDownloadScript={handleDownloadScript}
        scriptLanguage={selectedLanguage}
      />

      {/* Main Container */}
      <main className="flex-1 flex flex-col">
        {activeTab === 'studio' ? (
          <div className="flex-1 flex flex-col">
            {/* Prompt Bar */}
            <PromptBar
              onGenerate={handleGenerateScript}
              isGenerating={isGenerating}
              selectedLanguage={selectedLanguage}
              setSelectedLanguage={setSelectedLanguage}
              engineVersion={engineVersion}
              setEngineVersion={setEngineVersion}
            />

            {/* Studio Workspace Layout */}
            <div className="flex-1 max-w-[1720px] w-full mx-auto p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
              
              {/* Left Column: Code Studio & Parameter Inspector (7 cols) */}
              <div className="lg:col-span-7 flex flex-col gap-5 min-h-[600px]">
                <div className="flex-1 min-h-[480px]">
                  <CodeEditor
                    code={code}
                    setCode={setCode}
                    language={selectedLanguage}
                    diagnostics={diagnostics}
                    onDownload={handleDownloadScript}
                  />
                </div>
                <div>
                  <ParameterInspector
                    inputs={inputs}
                    onInputChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Right Column: AR Viewfinder Simulator & Console (5 cols) */}
              <div className="lg:col-span-5 flex flex-col min-h-[600px]">
                <ARSimulator
                  logs={logs}
                  onTriggerEvent={handleTriggerEvent}
                  onClearLogs={handleClearLogs}
                  attachedPropIndex={attachedPropIndex}
                />
              </div>

            </div>
          </div>
        ) : (
          /* Templates Gallery View */
          <TemplateGallery
            onSelectTemplate={handleSelectTemplate}
            activeTemplateId={activeTemplateId}
          />
        )}
      </main>

      {/* Modals */}
      <McpBridgeModal
        isOpen={isMcpModalOpen}
        onClose={() => setIsMcpModalOpen(false)}
      />

      <ApiReferenceModal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-white/[0.08] bg-[#0A0D17] py-4 px-6 text-center text-xs text-slate-400">
        <div className="max-w-[1720px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            LensScript AI Co-Pilot • Built for Snapchat AR Creators & Lens Studio 5.x / 4.x
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <a
              href="https://github.com/Rahul08319/LensScript-AI-Co-Pilot"
              target="_blank"
              rel="noreferrer"
              className="text-snap-yellow hover:underline"
            >
              GitHub Repository
            </a>
            <span className="text-slate-600">•</span>
            <button
              onClick={() => setIsMcpModalOpen(true)}
              className="hover:text-white transition-colors"
            >
              MCP Bridge (localhost:50049)
            </button>
            <span className="text-slate-600">•</span>
            <button
              onClick={() => setIsApiModalOpen(true)}
              className="hover:text-white transition-colors"
            >
              Snapchat AR APIs
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
