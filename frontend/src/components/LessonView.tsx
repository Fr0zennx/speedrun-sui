import { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import type * as Monaco from 'monaco-editor';
import { chapters } from '../data/chapters';
import { ChapterData } from '../data/types';
import './LessonView.css';

interface LessonViewProps {
  onClose: () => void;
}

function LessonView({ onClose }: LessonViewProps) {
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [userCode, setUserCode] = useState('');
  const [validationResult, setValidationResult] = useState<{ isValid: boolean; errors: Array<{ line: number, message: string }> } | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);

  const currentChapter: ChapterData = chapters[currentChapterIndex];

  useEffect(() => {
    // Reset state when chapter changes
    setUserCode(currentChapter.initialCode);
    setValidationResult(null);
    setShowSuccess(false);
    if (editorRef.current) {
      editorRef.current.setValue(currentChapter.initialCode);
    }
  }, [currentChapterIndex, currentChapter]);

  const handleEditorDidMount = (editor: Monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
    editor.setValue(currentChapter.initialCode);
  };

  const handleValidate = () => {
    if (!currentChapter.validate) return;

    const result = currentChapter.validate(userCode);
    setValidationResult(result);

    if (result.isValid) {
      setShowSuccess(true);
    } else {
      setShowSuccess(false);
    }
  };

  const handleNext = () => {
    if (currentChapterIndex < chapters.length - 1) {
      setCurrentChapterIndex(prev => prev + 1);
    } else {
      setShowCompletionPopup(true);
    }
  };

  const handlePrev = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(prev => prev - 1);
    }
  };

  const handleShowAnswer = () => {
    setUserCode(currentChapter.expectedCode);
    if (editorRef.current) {
      editorRef.current.setValue(currentChapter.expectedCode);
    }
  };

  const handleTryAgain = () => {
    setUserCode(currentChapter.initialCode);
    setValidationResult(null);
    setShowSuccess(false);
    if (editorRef.current) {
      editorRef.current.setValue(currentChapter.initialCode);
    }
  };

  return (
    <div className="lesson-view-overlay">
      <div className="lesson-view-container">
        {/* Header */}
        <div className="lesson-header">
          <h1>{currentChapter.title}</h1>
          <button className="lesson-close-btn" onClick={onClose} title="Close Lesson">
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="lesson-content">
          {/* Left Panel: Instructions */}
          <div className="lesson-left-panel">
            <div 
              className="lesson-instructions"
              dangerouslySetInnerHTML={{ __html: currentChapter.description }}
            />

            {currentChapter.technicalSkills && currentChapter.technicalSkills.length > 0 && (
              <div className="technical-skills-section">
                <h3>Technical Skills Unlocked:</h3>
                {currentChapter.technicalSkills.map((skill, index) => (
                  <div key={index} className="skill-card">
                    <h4>{skill.label}</h4>
                    <p>{skill.description}</p>
                  </div>
                ))}
              </div>
            )}


          </div>

          {/* Right Panel: Editor */}
          <div className="lesson-right-panel">
            <div className="code-editor-header" style={{ padding: '1rem', background: '#1e1e1e', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#ccc' }}>main.move</span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={handleTryAgain}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '4px',
                    color: '#ccc',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  Try Again
                </button>
                <button 
                  onClick={handleShowAnswer}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '4px',
                    color: '#ccc',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  Show Answer
                </button>
                {!showSuccess ? (
                  <button 
                    className="check-answer-btn-small" 
                    onClick={handleValidate}
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#00ffff',
                      border: 'none',
                      borderRadius: '4px',
                      color: '#000',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  >
                    Check Answer
                  </button>
                ) : (
                  <button 
                    className="check-answer-btn-small" 
                    onClick={handleNext}
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#00ff00',
                      border: 'none',
                      borderRadius: '4px',
                      color: '#000',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  >
                    Next Chapter →
                  </button>
                )}
              </div>
            </div>
            
            <div style={{ flex: 1, position: 'relative' }}>
              <Editor
                height="100%"
                defaultLanguage="rust" // Move syntax is similar to Rust
                theme="vs-dark"
                value={userCode}
                onChange={(value) => setUserCode(value || '')}
                onMount={handleEditorDidMount}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                }}
              />
            </div>

            {/* Validation Output */}
            <div className="validation-output" style={{ 
              height: '150px', 
              background: '#0f1419', 
              borderTop: '1px solid #333', 
              padding: '1rem',
              overflowY: 'auto'
            }}>
              {validationResult && (
                <div>
                  {validationResult.isValid ? (
                    <div style={{ color: '#00ff00', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.2rem' }}>✅</span>
                      <strong>Success! Code compiles successfully.</strong>
                    </div>
                  ) : (
                    <div>
                      <div style={{ color: '#ff4444', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                        Compilation Errors:
                      </div>
                      {validationResult.errors.map((error, idx) => (
                        <div key={idx} style={{ color: '#ff6b6b', fontFamily: 'monospace', marginBottom: '0.25rem' }}>
                          Line {error.line}: {error.message}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {!validationResult && (
                <div style={{ color: '#666', fontStyle: 'italic' }}>
                  Click "Check Answer" above to validate your solution...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="lesson-footer">
          <button 
            className="footer-nav-btn prev" 
            onClick={handlePrev}
            disabled={currentChapterIndex === 0}
            style={{ opacity: currentChapterIndex === 0 ? 0.5 : 1, cursor: currentChapterIndex === 0 ? 'not-allowed' : 'pointer' }}
          >
            ← Previous
          </button>
        </div>
      </div>

      {/* Completion Popup */}
      {showCompletionPopup && (
        <div className="completion-popup-overlay" style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 4000
        }}>
          <div className="completion-popup" style={{
            background: '#1a2332',
            padding: '2rem',
            borderRadius: '12px',
            maxWidth: '600px',
            width: '90%',
            border: '2px solid #00ffff',
            boxShadow: '0 0 30px rgba(0, 255, 255, 0.3)'
          }}>
            <h2 style={{ color: '#00ffff', textAlign: 'center', marginBottom: '1.5rem' }}>Course Completed! 🏆</h2>
            <p style={{ color: '#fff', lineHeight: '1.6', marginBottom: '2rem' }}>
              Congratulations, Master! You have successfully navigated the high-speed curves of the Sui Move language. 
              From building your first chassis to mastering complex dynamic fields and programmable transactions, 
              you’ve proven you have what it takes to build the next generation of decentralized applications.
            </p>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <button 
                onClick={() => setShowCompletionPopup(false)}
                style={{
                  padding: '0.8rem 1.5rem',
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: '#fff',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
              <button 
                onClick={onClose}
                style={{
                  padding: '0.8rem 1.5rem',
                  background: 'linear-gradient(90deg, #00ffff 0%, #00ccff 100%)',
                  border: 'none',
                  color: '#000',
                  fontWeight: 'bold',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Return to Profile 👤
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LessonView;
