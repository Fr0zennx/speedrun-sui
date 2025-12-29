import { useState } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import toast from 'react-hot-toast';
import './SubmitChallenge.css';

interface SubmitChallengeProps {
  chapterTitle: string;
  chapterId: number;
  onClose: () => void;
  onSubmit: (data: { vercelUrl: string; suiscanUrl: string }) => void;
}

function SubmitChallenge({ chapterTitle, chapterId, onClose, onSubmit }: SubmitChallengeProps) {
  const currentAccount = useCurrentAccount();
  const [vercelUrl, setVercelUrl] = useState('');
  const [suiscanUrl, setSuiscanUrl] = useState('');
  const [errors, setErrors] = useState({ vercel: '', suiscan: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // URL validation regex patterns
  const vercelUrlPattern = /^https:\/\/[a-zA-Z0-9-]+\.vercel\.app(\/.*)?$/;
  const suiscanUrlPattern = /^https:\/\/(suivision\.xyz|suiscan\.xyz|suiexplorer\.com)\/(testnet|mainnet)\/(tx|object|account)\/0x[a-fA-F0-9]+$/;

  const validateVercelUrl = (url: string): boolean => {
    if (!url) return false;
    const isValid = vercelUrlPattern.test(url);
    setErrors(prev => ({
      ...prev,
      vercel: !isValid && url ? 'Please enter a valid Vercel URL (e.g., https://your-app.vercel.app)' : ''
    }));
    return isValid;
  };

  const validateSuiscanUrl = (url: string): boolean => {
    if (!url) return false;
    const isValid = suiscanUrlPattern.test(url);
    setErrors(prev => ({
      ...prev,
      suiscan: !isValid && url ? 'Please enter a valid Sui explorer URL (Suiscan, SuiVision, or SuiExplorer)' : ''
    }));
    return isValid;
  };

  const handleVercelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setVercelUrl(value);
    if (value) validateVercelUrl(value);
    else setErrors(prev => ({ ...prev, vercel: '' }));
  };

  const handleSuiscanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSuiscanUrl(value);
    if (value) validateSuiscanUrl(value);
    else setErrors(prev => ({ ...prev, suiscan: '' }));
  };

  const isFormValid = () => {
    return (
      vercelUrl.trim() !== '' &&
      suiscanUrl.trim() !== '' &&
      validateVercelUrl(vercelUrl) &&
      validateSuiscanUrl(suiscanUrl)
    );
  };

  const handleSubmit = async () => {
    if (!isFormValid() || !currentAccount) return;

    setIsSubmitting(true);
    setSubmitError('');

    const loadingToast = toast.loading('Gönderiliyor...');

    try {
      const response = await fetch('/api/submit-challenge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wallet_address: currentAccount.address,
          chapter_id: chapterId,
          vercel_url: vercelUrl,
          suiscan_url: suiscanUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Submission failed');
      }

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      // Show success toast
      toast.success('Başarıyla kaydedildi, kontrol ediliyor!', {
        duration: 5000,
      });

      // Call parent callback
      onSubmit({ vercelUrl, suiscanUrl });

      // Reset form
      setVercelUrl('');
      setSuiscanUrl('');
      setErrors({ vercel: '', suiscan: '' });
      
      // Close modal after short delay
      setTimeout(() => {
        onClose();
      }, 1000);

    } catch (error) {
      console.error('Submission error:', error);
      
      // Dismiss loading toast
      toast.dismiss(loadingToast);
      
      // Show error toast
      toast.error('Bir hata oluştu, lütfen linkleri kontrol edin', {
        duration: 5000,
      });
      
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="submit-challenge-overlay" onClick={onClose}>
      <div className="submit-challenge-modal" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button className="submit-challenge-close-btn" onClick={onClose}>
          ✕
        </button>

        {/* Header */}
        <div className="submit-challenge-header">
          <div className="submit-challenge-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <h2 className="submit-challenge-title">Submit Challenge</h2>
          <p className="submit-challenge-subtitle">{chapterTitle}</p>
        </div>

        {/* Global Error Message */}
        {submitError && (
          <div className="submit-challenge-global-error">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {submitError}
          </div>
        )}

        {/* Form */}
        <div className="submit-challenge-form">
          {/* Vercel URL Input */}
          <div className="submit-challenge-field">
            <label className="submit-challenge-label">
              <span className="label-text">Deployed URL</span>
              <span className="label-required">*</span>
            </label>
            <div className="submit-challenge-input-wrapper">
              <div className="input-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 13C10.4295 13.5741 10.9774 14.0491 11.6066 14.3929C12.2357 14.7367 12.9315 14.9411 13.6467 14.9923C14.3618 15.0435 15.0796 14.9403 15.7513 14.6897C16.4231 14.4392 17.0331 14.047 17.54 13.54L20.54 10.54C21.4508 9.59695 21.9548 8.33394 21.9434 7.02296C21.932 5.71198 21.4061 4.45791 20.4791 3.53087C19.5521 2.60383 18.298 2.07799 16.987 2.0666C15.676 2.0552 14.413 2.55918 13.47 3.46997L11.75 5.17997" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 11C13.5705 10.4259 13.0226 9.95083 12.3934 9.60704C11.7642 9.26324 11.0685 9.05886 10.3533 9.00765C9.63816 8.95643 8.92037 9.05965 8.24861 9.31018C7.57685 9.5607 6.96684 9.95294 6.45996 10.46L3.45996 13.46C2.54917 14.403 2.04519 15.666 2.05659 16.977C2.06798 18.288 2.59382 19.542 3.52086 20.4691C4.4479 21.3961 5.70197 21.9219 7.01295 21.9333C8.32393 21.9447 9.58694 21.4407 10.53 20.53L12.24 18.82" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <input
                type="text"
                className={`submit-challenge-input ${errors.vercel ? 'error' : ''}`}
                placeholder="https://your-project.vercel.app"
                value={vercelUrl}
                onChange={handleVercelChange}
              />
            </div>
            {errors.vercel && (
              <p className="submit-challenge-error">{errors.vercel}</p>
            )}
            <p className="submit-challenge-hint">Enter your deployed Vercel application URL</p>
          </div>

          {/* Suiscan URL Input */}
          <div className="submit-challenge-field">
            <label className="submit-challenge-label">
              <span className="label-text">Testnet Contract URL</span>
              <span className="label-required">*</span>
            </label>
            <div className="submit-challenge-input-wrapper">
              <div className="input-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.663 17H4C3.73478 17 3.48043 16.8946 3.29289 16.7071C3.10536 16.5196 3 16.2652 3 16V8C3 7.73478 3.10536 7.48043 3.29289 7.29289C3.48043 7.10536 3.73478 7 4 7H9.663C9.92822 7 10.1826 7.10536 10.3701 7.29289L12.076 9H20C20.2652 9 20.5196 9.10536 20.7071 9.29289C20.8946 9.48043 21 9.73478 21 10V16C21 16.2652 20.8946 16.5196 20.7071 16.7071C20.5196 16.8946 20.2652 17 20 17H14.337C14.0718 17 13.8174 16.8946 13.6299 16.7071L11.924 15H9.663Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <input
                type="text"
                className={`submit-challenge-input ${errors.suiscan ? 'error' : ''}`}
                placeholder="https://suiscan.xyz/testnet/tx/0x..."
                value={suiscanUrl}
                onChange={handleSuiscanChange}
              />
            </div>
            {errors.suiscan && (
              <p className="submit-challenge-error">{errors.suiscan}</p>
            )}
            <p className="submit-challenge-hint">Enter your Sui testnet transaction or object URL</p>
          </div>
        </div>

        {/* Footer */}
        <div className="submit-challenge-footer">
          <button className="submit-challenge-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className="submit-challenge-submit"
            onClick={handleSubmit}
            disabled={!isFormValid() || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="button-spinner"></span>
                Submitting...
              </>
            ) : (
              <>
                <span className="button-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                Submit Challenge
              </>
            )}
          </button>
        </div>

        {/* Background decoration */}
        <div className="submit-challenge-decoration">
          <div className="decoration-circle decoration-circle-1"></div>
          <div className="decoration-circle decoration-circle-2"></div>
          <div className="decoration-circle decoration-circle-3"></div>
        </div>
      </div>
    </div>
  );
}

export default SubmitChallenge;
