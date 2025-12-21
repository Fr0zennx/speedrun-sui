import { 
  useCurrentAccount, 
  useSignAndExecuteTransaction,
  ConnectButton,
  useDisconnectWallet
} from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { useState, useEffect } from 'react';
import React from 'react';
import { VscHome, VscArchive, VscAccount, VscSettingsGear } from 'react-icons/vsc';
import ProjectTabs from './ProjectTabs';
import LightRays from './LightRays';
import Particles from './Particles';
import Dock from './Dock';
import './SpeedrunDashboard.css';

// Move module's package ID - Will be written here after deployment
const PACKAGE_ID = import.meta.env.VITE_PACKAGE_ID || 'YOUR_PACKAGE_ID_HERE';

// LocalStorage key
const AUTH_STORAGE_KEY = 'speedrun_sui_authenticated_users';

function SpeedrunDashboard() {
  const currentAccount = useCurrentAccount();
  const { mutate: disconnectWallet } = useDisconnectWallet();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const [transactionStatus, setTransactionStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [transactionDigest, setTransactionDigest] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const wrapRef = React.useRef<HTMLDivElement>(null);

  // Holographic tilt effect
  useEffect(() => {
    if (isAuthenticated || currentAccount) return;
    
    const card = wrapRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;
      
      const percentX = (x / rect.width) * 100;
      const percentY = (y / rect.height) * 100;
      
      card.style.setProperty('--pointer-x', `${percentX}%`);
      card.style.setProperty('--pointer-y', `${percentY}%`);
      card.style.setProperty('--rotate-x', `${rotateY}deg`);
      card.style.setProperty('--rotate-y', `${rotateX}deg`);
      card.style.setProperty('--background-y', `${percentY}%`);
    };

    const handleMouseLeave = () => {
      card.style.setProperty('--rotate-x', '0deg');
      card.style.setProperty('--rotate-y', '0deg');
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isAuthenticated, currentAccount]);

  // Check user authentication status (from localStorage)
  useEffect(() => {
    if (currentAccount?.address) {
      const authenticatedUsers = getAuthenticatedUsers();
      const isUserAuthenticated = authenticatedUsers.includes(currentAccount.address);
      setIsAuthenticated(isUserAuthenticated);
      
      if (isUserAuthenticated) {
        console.log('[AUTH] User was previously authenticated:', currentAccount.address);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, [currentAccount?.address]);

  // Get authenticated users from localStorage
  const getAuthenticatedUsers = (): string[] => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  // Save user as authenticated
  const saveAuthenticatedUser = (address: string) => {
    const users = getAuthenticatedUsers();
    if (!users.includes(address)) {
      users.push(address);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(users));
    }
  };

  // Call init_speedrun function and authenticate user
  const handleInitSpeedrun = async () => {
    if (!currentAccount) {
      alert('Please connect your wallet first!');
      return;
    }

    setTransactionStatus('loading');
    
    try {
      const tx = new Transaction();
      
      // Call Move function
      tx.moveCall({
        target: `${PACKAGE_ID}::initializer::init_speedrun`,
        arguments: [],
      });

      signAndExecuteTransaction(
        {
          transaction: tx,
        },
        {
          onSuccess: (result) => {
            console.log('[TRANSACTION] Successful:', result);
            console.log('[TRANSACTION] Digest:', result.digest);
            
            // Check transaction result
            // In the new API, result.effects is automatically parsed
            const isSuccess = result.effects?.status?.status === 'success';
            
            if (isSuccess) {
              console.log('[AUTH] User successfully authenticated');
              
              // Update UI state
              setTransactionStatus('success');
              setTransactionDigest(result.digest);
              setIsAuthenticated(true);
              
              // Save user to localStorage
              saveAuthenticatedUser(currentAccount.address);
              
              // Success notification
              alert('Congratulations! You have been successfully authenticated and sent your first transaction to the Sui blockchain.');
            } else {
              console.error('[TRANSACTION] Failed:', result.effects?.status);
              setTransactionStatus('error');
              alert('Transaction was rejected by the blockchain.');
            }
          },
          onError: (error) => {
            console.error('[TRANSACTION] Error:', error);
            setTransactionStatus('error');
            alert('Transaction failed: ' + error.message);
          },
        }
      );
    } catch (error) {
      console.error('[TRANSACTION] Creation error:', error);
      setTransactionStatus('error');
      alert('Error creating transaction: ' + (error as Error).message);
    }
  };

  // Clear authentication state when disconnecting wallet
  const handleDisconnect = () => {
    disconnectWallet();
    setIsAuthenticated(false);
    setTransactionStatus('idle');
    setTransactionDigest('');
  };

  const dockItems = [
    { icon: <VscHome size={18} />, label: 'Home', onClick: () => alert('Home!') },
    { icon: <VscArchive size={18} />, label: 'Archive', onClick: () => alert('Archive!') },
    { icon: <VscAccount size={18} />, label: 'Profile', onClick: () => alert('Profile!') },
    { icon: <VscSettingsGear size={18} />, label: 'Settings', onClick: () => alert('Settings!') },
  ];

  return (
    <div className="dashboard-container">
      {/* Top Banner */}
      <div className="top-banner">
        <div className="banner-content">
          {/* Sui Logo */}
          <div className="banner-logo">
            <div className="sui-logo-container">
              <div className="sui-logo-glow"></div>
              <div className="sui-logo-wrapper">
                <img 
                  src="https://cryptologos.cc/logos/sui-sui-logo.png"
                  alt="Sui Logo"
                  className="sui-logo"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src.includes('cryptologos')) {
                      target.src = 'https://s2.coinmarketcap.com/static/img/coins/200x200/20947.png';
                    } else if (target.src.includes('coinmarketcap')) {
                      target.src = 'https://avatars.githubusercontent.com/u/102524681?s=400';
                    } else {
                      target.src = '/sui-logo.svg';
                    }
                  }}
                />
              </div>
              <div className="sui-logo-ring"></div>
            </div>
          </div>

          <div className="banner-text">
            <h1 className="banner-title">Speedrun Sui</h1>
          </div>

          {/* Dock Navigation */}
          <div className="banner-dock">
            <Dock 
              items={dockItems}
              panelHeight={50}
              baseItemSize={40}
              magnification={55}
            />
          </div>

          {/* Connect/Disconnect Button */}
          <div className="banner-actions">
            {!currentAccount ? (
              <ConnectButton className="banner-connect-btn" />
            ) : (
              <button 
                className="banner-disconnect-btn"
                onClick={handleDisconnect}
                title="Click to disconnect"
              >
                {currentAccount.address.substring(0, 6)}...{currentAccount.address.substring(currentAccount.address.length - 4)}
              </button>
            )}
          </div>
        </div>
      </div>

      <Particles
        particleCount={150}
        particleSpread={12}
        speed={0.05}
        particleColors={['#00bfff', '#1e90ff', '#00d4ff', '#4da6ff']}
        moveParticlesOnHover={false}
        alphaParticles={true}
        particleBaseSize={80}
        sizeRandomness={0.6}
        cameraDistance={25}
        disableRotation={false}
        className="dashboard-particles"
      />
      
      <LightRays
        raysOrigin="top-center"
        raysColor="#00ffff"
        raysSpeed={1.5}
        lightSpread={0.8}
        rayLength={1.2}
        followMouse={true}
        mouseInfluence={0.1}
        noiseAmount={0.1}
        distortion={0.05}
        className="dashboard-background-rays"
      />
      
      <div className="dashboard-content">
        <div 
          className={`dashboard-card ${isAuthenticated ? 'expanded' : ''} ${!isAuthenticated && !currentAccount ? 'holographic-card' : ''}`}
          ref={!isAuthenticated && !currentAccount ? wrapRef : null}
        >
          {/* Holographic effects - only when not authenticated and no wallet */}
          {!isAuthenticated && !currentAccount && (
            <>
              <div className="holo-behind" />
              <div className="holo-shine" />
              <div className="holo-glare" />
            </>
          )}

          {/* Header - Always visible */}
          <div className="dashboard-header">
            <h1>Speedrun Sui</h1>
            <p className="subtitle">
              {isAuthenticated 
                ? 'Master Sui by completing each project challenge' 
                : 'Welcome to the Sui Blockchain'
              }
            </p>
          </div>

          {/* Connect Button - MOVED TO TOP RIGHT */}
          
          {!isAuthenticated && currentAccount && (
          <div className="wallet-section">
              <div className="wallet-connected">
                <h2>Wallet Connected</h2>
              <div className="account-info">
                <p className="account-label">Address:</p>
                <p className="account-address">{currentAccount.address}</p>
              </div>
              <button 
                className="disconnect-button"
                onClick={handleDisconnect}
              >
                Disconnect Wallet
              </button>
            </div>
          </div>
          )}

          {/* Compact Wallet Info - Show in top corner when authenticated */}
          {isAuthenticated && currentAccount && (
            <div className="compact-wallet-info">
              <div className="wallet-badge">
                <span className="wallet-address-short">
                  {currentAccount.address.substring(0, 6)}...{currentAccount.address.substring(currentAccount.address.length - 4)}
                </span>
              </div>
              <button 
                className="disconnect-button-compact"
                onClick={handleDisconnect}
                title="Disconnect Wallet"
              >
                ✕
              </button>
            </div>
          )}

          {/* Authentication Status - Success toast message */}
          {currentAccount && isAuthenticated && transactionDigest && transactionStatus === 'success' && (
            <div className="auth-success-toast">
              <span className="toast-icon">✓</span>
              <div className="toast-content">
                <strong>Success</strong>
                <span>Authentication completed</span>
              </div>
              <a 
                href={`https://suiscan.xyz/testnet/tx/${transactionDigest}`}
                target="_blank"
                rel="noopener noreferrer"
                className="toast-link"
                title="View transaction"
              >
                ↗
              </a>
            </div>
          )}

          {/* 8 Project Tabs - Show when authenticated */}
          {currentAccount && isAuthenticated && (
            <ProjectTabs />
          )}

          {/* Speedrun Initiation - Only for unauthenticated users */}
          {!isAuthenticated && currentAccount && (
            <div className="speedrun-section">
              <h2>Start Speedrun</h2>
              <p>
                By completing this transaction, you will prove that you have successfully 
                connected to the Sui network and that your wallet is active.
              </p>
              
              <button 
                className="speedrun-button"
                onClick={handleInitSpeedrun}
                disabled={transactionStatus === 'loading'}
              >
                {transactionStatus === 'loading' ? 'Sending Transaction...' : 'Start Speedrun'}
              </button>

              {/* Transaction Status */}
              {transactionStatus === 'success' && (
                <div className="status-message success">
                  <h3>Success!</h3>
                  <p>Speedrun successfully started</p>
                  {transactionDigest && (
                    <div className="transaction-link">
                      <p>Transaction ID:</p>
                      <a 
                        href={`https://suiscan.xyz/testnet/tx/${transactionDigest}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {transactionDigest.substring(0, 20)}...
                      </a>
                    </div>
                  )}
                </div>
              )}

              {transactionStatus === 'error' && (
                <div className="status-message error">
                  <h3>Error</h3>
                  <p>Transaction failed. Please try again.</p>
                </div>
              )}
            </div>
          )}

          {/* Information - Only show if not authenticated */}
          {!isAuthenticated && (
          <div className="info-section">
            <h3>How It Works</h3>
            <ol>
              <li>Connect your wallet (Sui Wallet recommended)</li>
              <li>Click the "Start Speedrun" button</li>
              <li>Approve the transaction from your wallet</li>
              <li>Success! You have sent your first transaction to the Sui blockchain</li>
            </ol>
          </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SpeedrunDashboard;

