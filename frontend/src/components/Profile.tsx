import { useCurrentAccount } from '@mysten/dapp-kit';
import ChromaGrid, { ChromaGridItem } from './ChromaGrid';
import { profileStaticData } from '../data/profileData';
import ElectricBorder from './ui/ElectricBorder';
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
      color: isCompleted ? '#4caf50' : item.color,
      buttonLabel: item.action === 'lesson' ? (isCompleted ? 'Review' : 'Start') : undefined,
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
            <ElectricBorder
              color="#7df9ff"
              speed={1}
              chaos={0.5}
              thickness={2}
              borderRadius={16}
              style={{ borderRadius: 16 }}
            >
              <div className="profile-photo-card">
                <div className="profile-photo-placeholder">
                  <svg className="photo-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                  </svg>
                  <p className="photo-text">Profile Photo</p>
                </div>
              </div>
            </ElectricBorder>
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
