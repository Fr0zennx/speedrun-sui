import { SuiClientProvider, WalletProvider, useCurrentAccount, useDisconnectWallet } from '@mysten/dapp-kit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { lazy, Suspense, useState, useEffect } from 'react';
import '@mysten/dapp-kit/dist/index.css';
import './App.css';

// ⭐ CRITICAL: Import LCP components DIRECTLY (not lazy)
import { DashboardHeader } from './components/dashboard/DashboardHeader';
import { WelcomeHero } from './components/dashboard/WelcomeHero';
import { DashboardContent } from './components/dashboard/DashboardContent';
import './components/SpeedrunDashboard.css';

// 🔄 LAZY: Heavy components loaded in background
// const PixelBlast = lazy(() => import('./components/ui/PixelBlast')); // DISABLED for performance
const Profile = lazy(() => import('./components/Profile'));
const LessonView = lazy(() => import('./components/LessonView'));
const CharacterCardView = lazy(() => import('./components/CharacterCardView'));
const NFTVisualOwnershipView = lazy(() => import('./components/NFTVisualOwnershipView'));
const BalanceView = lazy(() => import('./components/BalanceView'));
const SuiCarView = lazy(() => import('./components/SuiCarView'));
const SuiGalleryView = lazy(() => import('./components/SuiGalleryView'));
const GettingStarted = lazy(() => import('./components/GettingStarted'));

// QueryClient oluştur - React Query için gerekli
const queryClient = new QueryClient();

// Sui network ayarları - hardcoded URLs to avoid @mysten/sui import issues
const networks = {
  testnet: { url: 'https://fullnode.testnet.sui.io:443' },
  mainnet: { url: 'https://fullnode.mainnet.sui.io:443' },
  devnet: { url: 'https://fullnode.devnet.sui.io:443' },
};

// User status interface
interface UserStatus {
  wallet_address: string;
  completed_chapters: number[];
  pending_chapters: number[];
  rejected_chapters: number[];
  next_chapter: number;
  total_completed: number;
  total_pending: number;
  submissions: Record<number, {
    status: string;
    submitted_at: string;
    reviewed_at: string | null;
  }>;
  progress: unknown;
}

function AppContent() {
  const currentAccount = useCurrentAccount();
  const { mutate: disconnectWallet } = useDisconnectWallet();
  const [showProfile, setShowProfile] = useState(false);
  const [showGettingStarted, setShowGettingStarted] = useState(false);
  const [showLesson, setShowLesson] = useState(false);
  const [showCharacterCard, setShowCharacterCard] = useState(false);
  const [showNFTOwnership, setShowNFTOwnership] = useState(false);
  const [showBalance, setShowBalance] = useState(false);
  const [showSuiCar, setShowSuiCar] = useState(false);
  const [showSuiGallery, setShowSuiGallery] = useState(false);

  // User progress state
  const [userStatus, setUserStatus] = useState<UserStatus | null>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);

  // Staged Loading State - UI Ready Check
  const [uiReady, setUiReady] = useState(false);

  // Stage 1: Critical UI Rendered -> Trigger Stage 2 (Heavy UI)
  useEffect(() => {
    const timer = setTimeout(() => {
      setUiReady(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Fetch user status when wallet connects
  useEffect(() => {
    if (!uiReady || !currentAccount?.address) {
      setUserStatus(null);
      return;
    }

    const fetchUserStatus = async () => {
      setIsLoadingStatus(true);
      try {
        const response = await fetch(`/api/user-status?address=${currentAccount.address}`);
        if (!response.ok) throw new Error(`Failed: ${response.status}`);
        const text = await response.text();
        if (!text) throw new Error('Empty response');
        const result = JSON.parse(text);
        setUserStatus(result.data);
      } catch (error) {
        console.error('Error fetching user status:', error);
      } finally {
        setIsLoadingStatus(false);
      }
    };
    fetchUserStatus();
  }, [currentAccount?.address, uiReady]);

  const handleDisconnect = () => {
    disconnectWallet();
    setUserStatus(null);
  };

  return (
    <div className="dashboard-container">
      {/* PixelBlast Background - DISABLED for Performance */}
      {/* Note: PixelBlast was causing severe lag at 20x CPU throttling */}
      <div className="pixel-blast-background" />
      {/* Original PixelBlast code preserved but disabled:
      {uiReady && (
        <Suspense fallback={null}>
          <PixelBlast ... />
        </Suspense>
      )}
      */}

      {/* ⭐ LCP CRITICAL - Header renders IMMEDIATELY */}
      <DashboardHeader
        currentAccount={currentAccount}
        onDisconnect={handleDisconnect}
        onOpenProfile={() => setShowProfile(true)}
      />

      {/* ⭐ LCP CRITICAL - Main Content renders IMMEDIATELY */}
      <main className="main-content">
        <WelcomeHero
          uiReady={uiReady}
          onGetStarted={() => setShowGettingStarted(true)}
        />
        <DashboardContent uiReady={uiReady} />
      </main>

      {/* 🔄 LAZY MODALS - Load in background when needed */}
      {showProfile && currentAccount && (
        <Suspense fallback={<div className="loading-placeholder">Loading Profile...</div>}>
          <Profile
            onClose={() => setShowProfile(false)}
            onOpenLesson={() => setShowLesson(true)}
            onOpenCharacterCard={() => setShowCharacterCard(true)}
            onOpenNFTOwnership={() => setShowNFTOwnership(true)}
            onOpenBalance={() => setShowBalance(true)}
            onOpenSuiCar={() => setShowSuiCar(true)}
            onOpenSuiGallery={() => setShowSuiGallery(true)}
            userStatus={userStatus}
            isLoadingStatus={isLoadingStatus}
          />
        </Suspense>
      )}

      {showGettingStarted && (
        <Suspense fallback={<div className="loading-placeholder">Loading...</div>}>
          <GettingStarted
            onClose={() => setShowGettingStarted(false)}
            onStartSuiGarage={() => { setShowGettingStarted(false); setShowLesson(true); }}
            onStartCharacterCard={() => { setShowGettingStarted(false); setShowCharacterCard(true); }}
            onStartNFTOwnership={() => { setShowGettingStarted(false); setShowNFTOwnership(true); }}
            onStartBalance={() => { setShowGettingStarted(false); setShowBalance(true); }}
            onStartSuiCar={() => { setShowGettingStarted(false); setShowSuiCar(true); }}
            onStartSuiGallery={() => { setShowGettingStarted(false); setShowSuiGallery(true); }}
          />
        </Suspense>
      )}

      {showLesson && (
        <Suspense fallback={<div className="loading-placeholder">Loading Lesson...</div>}>
          <LessonView onClose={() => setShowLesson(false)} />
        </Suspense>
      )}
      {showCharacterCard && (
        <Suspense fallback={<div className="loading-placeholder">Loading Character Card...</div>}>
          <CharacterCardView onClose={() => setShowCharacterCard(false)} />
        </Suspense>
      )}
      {showNFTOwnership && (
        <Suspense fallback={<div className="loading-placeholder">Loading NFT Ownership...</div>}>
          <NFTVisualOwnershipView onClose={() => setShowNFTOwnership(false)} />
        </Suspense>
      )}
      {showBalance && (
        <Suspense fallback={<div className="loading-placeholder">Loading Balance...</div>}>
          <BalanceView onClose={() => setShowBalance(false)} />
        </Suspense>
      )}
      {showSuiCar && (
        <Suspense fallback={<div className="loading-placeholder">Loading Sui Car...</div>}>
          <SuiCarView onClose={() => setShowSuiCar(false)} />
        </Suspense>
      )}
      {showSuiGallery && (
        <Suspense fallback={<div className="loading-placeholder">Loading Sui Gallery...</div>}>
          <SuiGalleryView onClose={() => setShowSuiGallery(false)} />
        </Suspense>
      )}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networks} defaultNetwork="testnet">
        <WalletProvider autoConnect>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1a1a2e',
                color: '#fff',
                border: '1px solid #00bcd4',
                borderRadius: '8px',
              },
              success: {
                iconTheme: {
                  primary: '#4caf50',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#f44336',
                  secondary: '#fff',
                },
              },
            }}
          />
          {/* ⭐ NO SUSPENSE HERE - LCP components render immediately */}
          <AppContent />
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}

export default App;


