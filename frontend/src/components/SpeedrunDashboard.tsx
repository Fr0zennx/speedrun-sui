import {
  useCurrentAccount,
  useDisconnectWallet
} from '@mysten/dapp-kit';
import { useState, useEffect, lazy, Suspense } from 'react';
import './SpeedrunDashboard.css';

// Components
import { DashboardHeader } from './dashboard/DashboardHeader';
import { WelcomeHero } from './dashboard/WelcomeHero';
import { DashboardContent } from './dashboard/DashboardContent';

// Lazy load heavy components
const PixelBlast = lazy(() => import('./ui/PixelBlast'));
const Profile = lazy(() => import('./Profile'));
const LessonView = lazy(() => import('./LessonView'));
const CharacterCardView = lazy(() => import('./CharacterCardView'));
const NFTVisualOwnershipView = lazy(() => import('./NFTVisualOwnershipView'));
const BalanceView = lazy(() => import('./BalanceView'));
const SuiCarView = lazy(() => import('./SuiCarView'));
const SuiGalleryView = lazy(() => import('./SuiGalleryView'));
const GettingStarted = lazy(() => import('./GettingStarted'));

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
  progress: any;
}

function SpeedrunDashboard() {
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
  // Stage 2: Core Logic State (Wallet, Data Fetching)
  const [coreReady, setCoreReady] = useState(false);
  // Stage 3: Heavy Load State (Assets, Preloads, Background Tasks)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [heavyReady, setHeavyReady] = useState(false);

  // Stage 1: Critical UI Rendered -> Trigger Stage 2 (Heavy UI)
  useEffect(() => {
    // Give the browser time to paint the Critical UI (Layout, Header, Static BG)
    const timer = setTimeout(() => {
      setUiReady(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Stage 2: Heavy UI Ready -> Trigger Stage 3 (Core Logic)
  useEffect(() => {
    if (!uiReady) return;

    const timer = setTimeout(() => {
      setCoreReady(true);
    }, 500); // 500ms delay after UI transition
    return () => clearTimeout(timer);
  }, [uiReady]);

  // Stage 3: Core Logic Ready -> Trigger Stage 4 (Heavy Background Tasks)
  useEffect(() => {
    if (!coreReady) return;

    const runHeavyTasks = () => {
      setHeavyReady(true);

      // Preload heavy generic components / code chunks when browser is idle
      const preloadComponents = async () => {
        try {
          const componentsToPreload = [
            import('./Profile'),
            import('./SuiGalleryView'),
            import('./SuiCarView'),
            import('./NFTVisualOwnershipView')
          ];
          await Promise.all(componentsToPreload);
          console.log('Heavy components preloaded');
        } catch (e) {
          console.error('Failed to preload components', e);
        }
      };
      preloadComponents();
    };

    if ('requestIdleCallback' in window) {
      // @ts-ignore - TS might not know about requestIdleCallback depending on config
      const idleId = window.requestIdleCallback(runHeavyTasks, { timeout: 2000 });
      // @ts-ignore
      return () => window.cancelIdleCallback(idleId);
    } else {
      // Fallback for browsers without requestIdleCallback
      const timer = setTimeout(runHeavyTasks, 1000);
      return () => clearTimeout(timer);
    }
  }, [coreReady]);

  // Fetch user status when wallet connects or changes - ONLY after Core Logic is ready
  useEffect(() => {
    if (!coreReady || !currentAccount?.address) {
      setUserStatus(null);
      return;
    }

    const fetchUserStatus = async () => {
      setIsLoadingStatus(true); // Moved here to avoid UI flicker during critical render

      try {
        const response = await fetch(`/api/user-status?address=${currentAccount.address}`);

        // Check if response is ok before parsing JSON
        if (!response.ok) {
          const errorText = await response.text();
          console.error('API Error:', response.status, errorText);
          throw new Error(`Failed to fetch user status: ${response.status}`);
        }

        // Check if response has content before parsing
        const text = await response.text();
        if (!text) {
          console.error('Empty response from API');
          throw new Error('Empty response from server');
        }

        const result = JSON.parse(text);
        setUserStatus(result.data);
      } catch (error) {
        console.error('Error fetching user status:', error);
      } finally {
        setIsLoadingStatus(false);
      }
    };

    fetchUserStatus();
  }, [currentAccount?.address, coreReady]);

  const handleDisconnect = () => {
    disconnectWallet();
    setUserStatus(null);
  };

  return (
    <div className="dashboard-container">
      {/* PixelBlast Background - Deferred */}
      <div className="pixel-blast-background">
        {uiReady && (
          <Suspense fallback={null}>
            <PixelBlast
              variant="circle"
              pixelSize={6}
              color="#4facfe"
              patternScale={3}
              patternDensity={1.2}
              pixelSizeJitter={0.5}
              enableRipples
              rippleSpeed={0.4}
              rippleThickness={0.12}
              rippleIntensityScale={1.5}
              liquid
              liquidStrength={0.12}
              liquidRadius={1.2}
              liquidWobbleSpeed={5}
              speed={0.6}
              edgeFade={0.25}
              transparent
            />
          </Suspense>
        )}
      </div>

      <DashboardHeader
        currentAccount={currentAccount}
        onDisconnect={handleDisconnect}
        onOpenProfile={() => setShowProfile(true)}
      />

      {/* Main Content */}
      <main className="main-content">
        <WelcomeHero
          uiReady={uiReady}
          onGetStarted={() => setShowGettingStarted(true)}
        />

        <DashboardContent uiReady={uiReady} />
      </main>

      {/* Profile Modal */}
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

      {/* Getting Started Modal */}
      {showGettingStarted && (
        <Suspense fallback={<div className="loading-placeholder">Loading...</div>}>
          <GettingStarted
            onClose={() => setShowGettingStarted(false)}
            onStartSuiGarage={() => {
              setShowGettingStarted(false);
              setShowLesson(true);
            }}
            onStartCharacterCard={() => {
              setShowGettingStarted(false);
              setShowCharacterCard(true);
            }}
            onStartNFTOwnership={() => {
              setShowGettingStarted(false);
              setShowNFTOwnership(true);
            }}
            onStartBalance={() => {
              setShowGettingStarted(false);
              setShowBalance(true);
            }}
            onStartSuiCar={() => {
              setShowGettingStarted(false);
              setShowSuiCar(true);
            }}
            onStartSuiGallery={() => {
              setShowGettingStarted(false);
              setShowSuiGallery(true);
            }}
          />
        </Suspense>
      )}

      {/* Lesson Views */}
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

export default SpeedrunDashboard;
