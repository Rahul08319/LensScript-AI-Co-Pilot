import { DiagnosticItem, ScriptInputParam } from '../types/lens';

export function lintLensScript(code: string): DiagnosticItem[] {
  const diagnostics: DiagnosticItem[] = [];
  const lines = code.split('\n');

  lines.forEach((line, index) => {
    const lineNum = index + 1;
    const trimmed = line.trim();

    // 1. Check for standard browser DOM APIs that will crash Lens Studio engine
    if (/(document\.|window\.|localStorage\.|sessionStorage\.)/.test(line)) {
      diagnostics.push({
        id: `dom-${lineNum}`,
        type: 'error',
        line: lineNum,
        message: 'DOM/Browser API detected (window, document, localStorage). Lens Studio runs in an isolated JS/QuickJS sandbox without browser DOM.',
        suggestion: 'Use Lens Studio native APIs (e.g., PersistentStorageSystem, script.getSceneObject()).'
      });
    }

    // 2. Check for fetch() without RemoteServiceModule
    if (/\bfetch\(/.test(line) && !line.includes('RemoteServiceModule')) {
      diagnostics.push({
        id: `fetch-${lineNum}`,
        type: 'warning',
        line: lineNum,
        message: 'Standard fetch() is not available directly in Lens Studio.',
        suggestion: 'Use RemoteServiceModule or Internet Access module for HTTP requests.'
      });
    }

    // 3. Deprecated TouchSystem usage
    if (/global\.touchSystem\./.test(line)) {
      diagnostics.push({
        id: `touch-${lineNum}`,
        type: 'warning',
        line: lineNum,
        message: 'global.touchSystem is deprecated in modern Lens Studio 5.x.',
        suggestion: 'Use script.createEvent("TapEvent") or "TouchStartEvent" instead.'
      });
    }

    // 4. Memory allocation inside Update loop check
    if (line.includes('new vec3(') || line.includes('new vec4(') || line.includes('new quat(')) {
      // Check if inside onUpdate or updateEvent
      diagnostics.push({
        id: `mem-${lineNum}`,
        type: 'info',
        line: lineNum,
        message: 'Instantiating new vectors or quaternions dynamically.',
        suggestion: 'If this is executed inside an UpdateEvent loop, allocate vectors outside the loop to prevent mobile garbage collector stutters.'
      });
    }

    // 5. Using console.log instead of print
    if (/\bconsole\.log\(/.test(line)) {
      diagnostics.push({
        id: `print-${lineNum}`,
        type: 'info',
        line: lineNum,
        message: 'Lens Studio logger prefers print() over console.log().',
        suggestion: 'Replace console.log(...) with print(...) for native Lens Studio logger output.'
      });
    }
  });

  return diagnostics;
}

export function parseScriptInputs(code: string): ScriptInputParam[] {
  const inputs: ScriptInputParam[] = [];
  const lines = code.split('\n');

  const inputRegex = /^\/\/\s*@input\s+([A-Za-z0-9_.[\]]+)\s+([A-Za-z0-9_]+)(?:\s*=\s*(.+))?/;

  lines.forEach((line) => {
    const match = line.trim().match(inputRegex);
    if (match) {
      const type = match[1];
      const name = match[2];
      const rawDefault = match[3]?.trim();

      let defaultValue: any = rawDefault;
      if (rawDefault === 'true') defaultValue = true;
      else if (rawDefault === 'false') defaultValue = false;
      else if (!isNaN(Number(rawDefault))) defaultValue = Number(rawDefault);

      inputs.push({
        name,
        type,
        defaultValue,
        currentValue: defaultValue ?? (type.includes('bool') ? false : type.includes('float') ? 1.0 : 'Assigned in Studio'),
        description: `Lens Studio @input declaration for ${name}`
      });
    }
  });

  return inputs;
}
