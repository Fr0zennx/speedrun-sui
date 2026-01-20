import { useCurrentAccount } from '@mysten/dapp-kit';
import { lazy, Suspense } from 'react';
import toast from 'react-hot-toast';
import ChromaGrid, { ChromaGridItem } from './ChromaGrid';
import { profileStaticData } from '../data/profileData';
import NFTProfilePhoto from './NFTProfilePhoto';
import './Profile.css';

const FloatingLines = lazy(() => import('./ui/FloatingLines'));

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

interface ProfileProps {
  onClose: () => void;
  onOpenLesson?: () => void;
  onOpenCharacterCard?: () => void;
  onOpenNFTOwnership?: () => void;
  onOpenBalance?: () => void;
  onOpenSuiCar?: () => void;
  onOpenSuiGallery?: () => void;
  userStatus?: UserStatus | null;
  isLoadingStatus?: boolean;
}

function Profile({
  onClose,
  onOpenLesson,
  onOpenCharacterCard,
  onOpenNFTOwnership,
  onOpenBalance,
  onOpenSuiCar,
  onOpenSuiGallery,
  userStatus,
  isLoadingStatus
}: ProfileProps) {
  const currentAccount = useCurrentAccount();

  if (!currentAccount) {
    return null;
  }

  const getDynamicValue = (id: string) => {
    switch (id) {
      case 'balance':
        return ' ';
      case 'transactions':
        return userStatus?.total_completed.toString() || '0';
      case 'nfts':
        return userStatus?.total_pending.toString() || '0';
      case 'wallet':
        return '';
      case 'status':
        if (isLoadingStatus) return 'Senkronize ediliyor...';
        if (userStatus) {
          return `${userStatus.total_completed}/15 Tamamlandı`;
        }
        return '';
      case 'garage':
        return '';
      default:
        return '';
    }
  };

  const gridItems: ChromaGridItem[] = profileStaticData.map((item) => {
    let handleClick: (() => void) | undefined;

    if (item.action === 'lesson') {
      if (item.id === 'garage') {
        handleClick = () => {
          onClose();
          onOpenLesson?.();
        };
      } else if (item.id === 'status') {
        handleClick = () => {
          onClose();
          onOpenCharacterCard?.();
        };
      } else if (item.id === 'wallet') {
        handleClick = () => {
          onClose();
          onOpenNFTOwnership?.();
        };
      } else if (item.id === 'balance') {
        handleClick = () => {
          onClose();
          onOpenBalance?.();
        };
      } else if (item.id === 'transactions') {
        handleClick = () => {
          onClose();
          onOpenSuiCar?.();
        };
      } else if (item.id === 'nfts') {
        handleClick = () => {
          onClose();
          onOpenSuiGallery?.();
        };
      }
    }

    // Determine chapter completion status
    let chapterId: number | null = null;
    if (item.id === 'garage') chapterId = 1;
    else if (item.id === 'status') chapterId = 2;
    else if (item.id === 'wallet') chapterId = 3;
    else if (item.id === 'balance') chapterId = 4;
    else if (item.id === 'transactions') chapterId = 5;
    else if (item.id === 'nfts') chapterId = 6;

    let statusBadge = '';
    let isCompleted = false;
    if (chapterId && userStatus) {
      if (userStatus.completed_chapters.includes(chapterId)) {
        statusBadge = ' ✓';
        isCompleted = true;
      }
    }

    return {
      id: item.id,
      label: item.label + statusBadge,
      value: getDynamicValue(item.id),
      description: item.description,
      icon: item.icon,
      image: item.image,
      color: isCompleted ? '#4caf50' : item.color,
      buttonLabel: item.action === 'lesson' ? (isCompleted ? 'Review' : 'Start') : undefined,
      onClick: handleClick,
    };
  });

  return (
    <div className="profile-overlay">
      {/* FloatingLines Background */}
      <div className="profile-floating-bg">
        <Suspense fallback={<div className="floating-lines-placeholder" />}>
          <FloatingLines
            enabledWaves={['top', 'middle', 'bottom']}
            lineCount={[10, 15, 20]}
            lineDistance={[8, 6, 4]}
            bendRadius={5.0}
            bendStrength={-0.5}
            interactive={true}
            parallax={true}
            linesGradient={['#4facfe', '#00f2fe', '#667eea', '#764ba2']}
          />
        </Suspense>
      </div>
      <div className="profile-container">
        {/* Close button */}
        <button className="profile-close-btn" onClick={onClose}>
          ✕
        </button>

        {/* Left side - Profile photo */}
        <div className="profile-left">
          {/* NFT Profile Photo Component */}
          <NFTProfilePhoto walletAddress={currentAccount.address} />

          <div className="profile-wallet-section">
            <h5>Wallet Address</h5>
            <div className="wallet-btn-wrapper">
              <button
                className="wallet-address-btn"
                onClick={() => {
                  if (currentAccount?.address) {
                    navigator.clipboard.writeText(currentAccount.address);
                    toast.success('Address copied!');
                  }
                }}
                title="Click to copy"
              >
                <div className="wallet-info-group">
                  <div className="wallet-icon-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 12V8H6a2 2 0 0 1-2-2 2 2 0 0 1 2-2h12v4" />
                      <path d="M4 6v12a2 2 0 0 0 2 2h14v-4" />
                      <path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z" />
                    </svg>
                  </div>
                  <span className="wallet-text">
                    {currentAccount?.address ? `${currentAccount.address.slice(0, 6)}...${currentAccount.address.slice(-4)}` : 'No Wallet'}
                  </span>
                </div>
                <div className="wallet-copy-action">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                </div>
              </button>
            </div>
          </div>


        </div>

        {/* Right side - ChromaGrid */}
        <div className="profile-right">
          <h2>Profile</h2>
          <div className="profile-grid-wrapper">
            <ChromaGrid items={gridItems} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
