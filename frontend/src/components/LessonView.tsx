import { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import type * as Monaco from 'monaco-editor';
import './LessonView.css';

interface LessonViewProps {
  onClose: () => void;
}

function LessonView({ onClose }: LessonViewProps) {
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof Monaco | null>(null);
  
  const [code, setCode] = useState(`// Start your engine here!
module sui_garage::car_factory {
    
    // Your code here

}`);

  const [feedback, setFeedback] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [errors, setErrors] = useState<Array<{line: number, message: string}>>([]);
  const [terminalOutput, setTerminalOutput] = useState<string>('');

  const expectedCode = `module sui_garage::car_factory {
    use std::string::{String};
}`;

  const handleEditorDidMount = (editor: Monaco.editor.IStandaloneCodeEditor, monaco: typeof Monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Configure editor options
    editor.updateOptions({
      minimap: { enabled: true },
      fontSize: 14,
      lineHeight: 22,
      fontFamily: "'Fira Code', 'Cascadia Code', 'Consolas', monospace",
      fontLigatures: true,
      cursorBlinking: 'smooth',
      cursorSmoothCaretAnimation: 'on',
      smoothScrolling: true,
      renderLineHighlight: 'all',
      scrollBeyondLastLine: false,
      padding: { top: 16, bottom: 16 },
      bracketPairColorization: { enabled: true },
      guides: {
        bracketPairs: true,
        indentation: true,
      },
      suggest: {
        preview: true,
        showKeywords: true,
        showSnippets: true,
      },
    });

    // Register custom language if needed
    if (!monaco.languages.getLanguages().some(({ id }) => id === 'move')) {
      monaco.languages.register({ id: 'move' });
      monaco.languages.setMonarchTokensProvider('move', {
        keywords: [
          'module', 'use', 'struct', 'fun', 'public', 'entry', 'has', 'key',
          'store', 'drop', 'copy', 'let', 'mut', 'return', 'if', 'else',
          'while', 'loop', 'break', 'continue', 'abort', 'const', 'as',
          'move', 'borrow', 'native', 'acquires', 'friend', 'script'
        ],
        typeKeywords: [
          'u8', 'u16', 'u32', 'u64', 'u128', 'u256', 'bool', 'address',
          'vector', 'String', 'Object', 'ID', 'UID'
        ],
        operators: [
          '=', '>', '<', '!', '~', '?', ':', '==', '<=', '>=', '!=',
          '&&', '||', '++', '--', '+', '-', '*', '/', '&', '|', '^', '%',
          '<<', '>>', '>>>', '+=', '-=', '*=', '/=', '&=', '|=', '^=',
          '%=', '<<=', '>>=', '>>>='
        ],
        symbols: /[=><!~?:&|+\-*\/\^%]+/,
        tokenizer: {
          root: [
            [/[a-z_$][\w$]*/, {
              cases: {
                '@typeKeywords': 'type',
                '@keywords': 'keyword',
                '@default': 'identifier'
              }
            }],
            [/[A-Z][\w\$]*/, 'type.identifier'],
            { include: '@whitespace' },
            [/[{}()\[\]]/, '@brackets'],
            [/[<>](?!@symbols)/, '@brackets'],
            [/@symbols/, {
              cases: {
                '@operators': 'operator',
                '@default': ''
              }
            }],
            [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
            [/0[xX][0-9a-fA-F]+/, 'number.hex'],
            [/\d+/, 'number'],
            [/[;,.]/, 'delimiter'],
            [/"([^"\\]|\\.)*$/, 'string.invalid'],
            [/"/, { token: 'string.quote', bracket: '@open', next: '@string' }],
          ],
          string: [
            [/[^\\"]+/, 'string'],
            [/\\./, 'string.escape.invalid'],
            [/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
          ],
          whitespace: [
            [/[ \t\r\n]+/, 'white'],
            [/\/\*/, 'comment', '@comment'],
            [/\/\/.*$/, 'comment'],
          ],
          comment: [
            [/[^\/*]+/, 'comment'],
            [/\*\//, 'comment', '@pop'],
            [/[\/*]/, 'comment']
          ],
        },
      });

      // Define theme colors for Move language
      monaco.editor.defineTheme('move-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: '', foreground: 'e6e6e6' },
          { token: 'keyword', foreground: '00D9FF', fontStyle: 'bold' },
          { token: 'type', foreground: '4EC9B0' },
          { token: 'type.identifier', foreground: '00FFFF' },
          { token: 'identifier', foreground: 'e6e6e6' },
          { token: 'string', foreground: '89DDFF' },
          { token: 'number', foreground: 'F78C6C' },
          { token: 'comment', foreground: '5C6773', fontStyle: 'italic' },
          { token: 'operator', foreground: '89DDFF' },
          { token: 'delimiter', foreground: '89DDFF' },
        ],
        colors: {
          'editor.background': '#0a0e14',
          'editor.foreground': '#e6e6e6',
          'editor.lineHighlightBackground': '#151a21',
          'editorLineNumber.foreground': '#3d5a80',
          'editorLineNumber.activeForeground': '#00ffff',
          'editor.selectionBackground': '#1a4f6f',
          'editor.inactiveSelectionBackground': '#1a2f3f',
          'editorIndentGuide.background': '#1a2332',
          'editorIndentGuide.activeBackground': '#00ffff40',
          'editorBracketMatch.background': '#00ffff20',
          'editorBracketMatch.border': '#00ffff',
          'editorWidget.background': '#0a0e14',
          'editorWidget.border': '#00ffff40',
          'editorSuggestWidget.background': '#0a0e14',
          'editorSuggestWidget.foreground': '#e6e6e6',
          'editorSuggestWidget.border': '#00ffff40',
          'editorHoverWidget.background': '#0a0e14',
          'editorHoverWidget.foreground': '#e6e6e6',
          'editorHoverWidget.border': '#00ffff40',
          'editorGutter.background': '#0a0e14',
          'editorOverviewRuler.background': '#0a0e14',
          'editorOverviewRuler.border': '#00ffff20',
          'scrollbar.shadow': '#0a0e14',
          'scrollbarSlider.background': '#1a2332',
          'scrollbarSlider.hoverBackground': '#2a3342',
          'scrollbarSlider.activeBackground': '#3a4352',
          'minimap.background': '#0a0e14',
          'minimapSlider.background': '#1a233220',
          'minimapSlider.hoverBackground': '#1a233240',
          'minimapSlider.activeBackground': '#1a233260',
        },
      });
      
      // Apply the theme immediately
      monaco.editor.setTheme('move-dark');
    }
  };

  const updateErrorDecorations = () => {
    if (!editorRef.current || !monacoRef.current) return;

    const monaco = monacoRef.current;
    const editor = editorRef.current;

    // Clear previous decorations and markers
    monaco.editor.setModelMarkers(editor.getModel()!, 'moveErrors', []);

    if (errors.length > 0) {
      const markers = errors.map(error => ({
        severity: monaco.MarkerSeverity.Error,
        startLineNumber: error.line,
        startColumn: 1,
        endLineNumber: error.line,
        endColumn: 1000,
        message: error.message,
      }));
      monaco.editor.setModelMarkers(editor.getModel()!, 'moveErrors', markers);
    }
  };

  const checkAnswer = () => {
    setErrors([]);
    setFeedback('');
    setTerminalOutput('');
    
    const lines = code.split('\n');
    const newErrors: Array<{line: number, message: string}> = [];
    
    // Check if module declaration exists
    const hasModule = code.includes('module sui_garage::car_factory');
    if (!hasModule) {
      const moduleLine = lines.findIndex(l => l.trim().startsWith('module'));
      newErrors.push({
        line: moduleLine !== -1 ? moduleLine + 1 : 2,
        message: 'module name should be "sui_garage::car_factory"'
      });
    }
    
    // Check if use statement exists
    const hasUse = code.includes('use std::string::{String}');
    if (!hasUse) {
      const useLine = lines.findIndex(l => l.includes('use') || l.includes('// Your code here'));
      const lineNum = useLine !== -1 ? useLine + 1 : 4;
      newErrors.push({
        line: lineNum,
        message: 'missing import statement "use std::string::{String};"'
      });
    }
    
    // Normalize whitespace for comparison
    const normalizeCode = (str: string) => 
      str.replace(/\/\/.*$/gm, '') // Remove comments
         .replace(/\s+/g, ' ') // Normalize whitespace
         .trim();

    const userCode = normalizeCode(code);
    const expected = normalizeCode(expectedCode);

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setFeedback('Build Failed');
      setIsCorrect(false);
      setTerminalOutput('return rand % dnaModulus');
    } else if (userCode === expected) {
      setFeedback('Build Successful');
      setIsCorrect(true);
      setErrors([]);
      setTerminalOutput('✓ Build completed successfully!\n\nmodule sui_garage::car_factory compiled.');
    } else {
      setErrors([{
        line: 1,
        message: 'syntax error: check your code structure'
      }]);
      setFeedback('Build Failed');
      setIsCorrect(false);
      setTerminalOutput('✗ Compilation failed. Check your code structure.');
    }
    
    // Update error decorations after state change
    setTimeout(updateErrorDecorations, 0);
  };

  const showAnswer = () => {
    setCode(expectedCode);
    setErrors([]);
    setFeedback('Build Successful');
    setIsCorrect(true);
    setTerminalOutput('✓ Answer loaded!\n\nmodule sui_garage::car_factory compiled.');
  };

  const tryAgain = () => {
    setCode(`// Start your engine here!\nmodule sui_garage::car_factory {\n    \n    // Your code here\n\n}`);
    setErrors([]);
    setFeedback('');
    setIsCorrect(false);
    setTerminalOutput('');
    if (editorRef.current && monacoRef.current) {
      monacoRef.current.editor.setModelMarkers(editorRef.current.getModel()!, 'moveErrors', []);
    }
  };

  return (
    <div className="lesson-view-overlay">
      <div className="lesson-view-container">
        {/* Header */}
        <div className="lesson-header">
          <h1>Sui Garage</h1>
          <button className="lesson-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Main Content */}
        <div className="lesson-content">
          {/* Left Panel - Instructions */}
          <div className="lesson-left-panel">
            <div className="lesson-instructions">
              <h2>Chapter 1: Building the Chassis (Modules & Move Basics)</h2>
              <p>
                Welcome, Mechanic! You are about to embark on a journey to build the most advanced automotive empire on the Sui blockchain. In this garage, we don't just build cars; we create digital assets that you truly own.
              </p>
              
              <p>
                Before we add the engine or the nitro, we need a place to work. In the Move language, code is organized into <strong>Modules</strong>. Think of a module as your specialized workshop. It's a container that holds your data structures (cars, parts) and the functions (tuning, painting) that interact with them.
              </p>

              <p>
                Unlike other blockchains, Sui is <strong>object-centric</strong>. This means everything you build here—from a rusty old sedan to a supersonic race car—is an "Object" that lives in a user's wallet, not just a line in a ledger.
              </p>

              <h3>Key Concepts for this Chapter:</h3>
              <ul>
                <li><strong>The Module:</strong> Defined using the <code>module</code> keyword followed by <code>address::name</code>.</li>
                <li><strong>The Package:</strong> A collection of modules. The module name must match your package name in your Move.toml file.</li>
                <li><strong>Imports (use):</strong> Just like bringing tools into your workshop, we use the <code>use</code> keyword to bring in standard libraries (like <code>string</code> for our car names).</li>
              </ul>

              <h3>Put it to the test:</h3>
              <p>Let's set up our first workshop.</p>
              <ol>
                <li>Create a module named <code>car_factory</code> inside the address <code>sui_garage</code>.</li>
                <li>Inside the module, import the String library from the standard Move library so we can name our cars later. Use: <code>use std::string::&#123;String&#125;;</code></li>
              </ol>
            </div>
          </div>

          {/* Right Panel - Code Editor */}
          <div className="lesson-right-panel">
            <div className="code-editor-header">
              <div className="editor-tab">
                <span className="editor-tab-icon">📄</span>
                <span>car_factory.move</span>
              </div>
            </div>
            <div className="monaco-editor-wrapper">
              <Editor
                height="100%"
                language="move"
                value={code}
                onChange={(value) => setCode(value || '')}
                onMount={handleEditorDidMount}
                theme="move-dark"
                options={{
                  automaticLayout: true,
                  formatOnPaste: true,
                  formatOnType: true,
                  autoIndent: 'full',
                  tabSize: 4,
                  insertSpaces: true,
                  wordWrap: 'off',
                  lineNumbers: 'on',
                  renderWhitespace: 'selection',
                  folding: true,
                  foldingHighlight: true,
                  showFoldingControls: 'mouseover',
                  matchBrackets: 'always',
                  renderLineHighlight: 'all',
                }}
              />
            </div>
            
            {/* Terminal Output */}
            <div className="terminal-output">
              <div className="terminal-header">
                <span className="terminal-title">Terminal</span>
              </div>
              <div className="terminal-content">
                {terminalOutput ? (
                  <pre className="terminal-text">{terminalOutput}</pre>
                ) : (
                  <span className="terminal-placeholder">Run your code to see output...</span>
                )}
              </div>
            </div>
            
            <div className="code-editor-footer">
              <div className="footer-left">
                <button className="btn-show-answer" onClick={showAnswer}>
                  <span className="btn-icon">💡</span>
                  Show me the answer
                </button>
                <button className="btn-try-again" onClick={tryAgain}>
                  <span className="btn-icon">🔄</span>
                  Try Again
                </button>
              </div>
              <div className="footer-right">
                <button className="btn-next-chapter" disabled={!isCorrect}>Next Chapter →</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LessonView;
