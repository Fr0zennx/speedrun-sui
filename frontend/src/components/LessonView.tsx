import { useState } from 'react';
import './LessonView.css';

interface LessonViewProps {
  onClose: () => void;
}

function LessonView({ onClose }: LessonViewProps) {
  const [code, setCode] = useState(`// Start your engine here!
module sui_garage::car_factory {
    
    // Your code here

}`);

  const [feedback, setFeedback] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [errors, setErrors] = useState<Array<{line: number, message: string}>>([]);

  const expectedCode = `module sui_garage::car_factory {
    use std::string::{String};
}`;

  const checkAnswer = () => {
    setErrors([]);
    setFeedback('');
    
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
    } else if (userCode === expected) {
      setFeedback('Build Successful');
      setIsCorrect(true);
    } else {
      setErrors([{
        line: 1,
        message: 'syntax error: check your code structure'
      }]);
      setFeedback('Build Failed');
      setIsCorrect(false);
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
              <span>car_factory.move</span>
            </div>
            <textarea
              className="code-editor"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
            />
            
            {/* Error Console */}
            {errors.length > 0 && (
              <div className="error-console">
                <div className="error-console-header">
                  <span className="error-icon">⚠</span>
                  <span>BUILD ERRORS</span>
                </div>
                <div className="error-console-content">
                  {errors.map((error, index) => (
                    <div key={index} className="error-item">
                      <span className="error-location">Line {error.line}:</span>
                      <span className="error-prefix">error:</span>
                      <span className="error-message">{error.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {feedback && (
              <div className={`feedback-message ${isCorrect ? 'correct' : 'incorrect'}`}>
                <span className="feedback-icon">{isCorrect ? '✓' : '✗'}</span>
                {feedback}
              </div>
            )}
            <div className="code-editor-footer">
              <button className="btn-check-answer" onClick={checkAnswer}>Check Answer</button>
              <button className="btn-next-chapter" disabled={!isCorrect}>Next Chapter →</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LessonView;
