import { useCurrentAccount } from '@mysten/dapp-kit';
import ChromaGrid, { ChromaGridItem } from './ChromaGrid';
import { profileStaticData } from '../data/profileData';
import './Profile.css';

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

  // Generate a gradient based on wallet address
  const getGradientFromAddress = (address: string) => {
    const hash = address.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hue1 = hash % 360;
    const hue2 = (hash + 180) % 360;
    return `linear-gradient(135deg, hsl(${hue1}, 70%, 50%) 0%, hsl(${hue2}, 70%, 50%) 100%)`;
  };

  const getDynamicValue = (id: string) => {
    switch (id) {
      case 'balance':
        return '-- SUI';
      case 'transactions':
        return userStatus?.total_completed.toString() || '0';
      case 'nfts':
        return userStatus?.total_pending.toString() || '0';
      case 'wallet':
        return 'Sui Wallet';
      case 'status':
        if (isLoadingStatus) return 'Senkronize ediliyor...';
        if (userStatus) {
          return `${userStatus.total_completed}/15 Tamamlandı`;
        }
        return '';
      case 'garage':
        return 'Testnet Environment';
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
    if (chapterId && userStatus) {
      if (userStatus.completed_chapters.includes(chapterId)) {
        statusBadge = 'Completed';
      }
    }

    return {
      id: item.id,
      label: item.label + (statusBadge ? ` ${statusBadge}` : ''),
      value: getDynamicValue(item.id),
      description: item.description,
      icon: item.icon,
      color: item.color,
      buttonLabel: item.action === 'lesson' ? 'Start' : undefined,
      onClick: handleClick,
    };
  });

  return (
    <div className="profile-overlay">
      <div className="profile-container">
        {/* Close button */}
        <button className="profile-close-btn" onClick={onClose}>
          ✕
        </button>

        {/* Left side - Profile photo */}
        <div className="profile-left">
          <div className="profile-photo-container">
            <div
              className="profile-photo"
              style={{ background: getGradientFromAddress(currentAccount.address) }}
            >
              <div className="profile-photo-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                </svg>
              </div>
            </div>
            <div className="profile-photo-glow" style={{ background: getGradientFromAddress(currentAccount.address) }}></div>
          </div>

          <div className="profile-wallet-info">
            <h3>Wallet Address</h3>
            <p className="profile-address">{currentAccount.address}</p>
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
