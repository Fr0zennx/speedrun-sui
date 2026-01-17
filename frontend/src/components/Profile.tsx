import { useCurrentAccount } from '@mysten/dapp-kit';
import ChromaGrid, { ChromaGridItem } from './ChromaGrid';
import { profileStaticData } from '../data/profileData';
import ElectricBorder from './ui/ElectricBorder';
import FloatingLines from './ui/FloatingLines';
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
      </div>
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
              speed={0.8}
              chaos={0.2}
              thickness={1}
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

          {/* Neon NFT Object ID Input Box */}
          <div className="w-full flex justify-center mt-6">
            <div className="relative w-72 rounded-xl p-6 bg-gradient-to-br from-[#0f172a] to-[#1e293b] border-2 border-cyan-400 shadow-[0_0_24px_4px_rgba(0,255,255,0.25)] flex flex-col items-center">
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-cyan-400 blur-sm animate-pulse" />
              <div className="w-16 h-16 mb-2 flex items-center justify-center rounded-full bg-[#101828] border border-cyan-400 shadow-[0_0_12px_2px_rgba(0,255,255,0.15)]">
                <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Enter NFT Object ID"
                className="w-full px-4 py-2 mb-3 rounded-lg bg-[#0f172a] border border-cyan-400 text-cyan-200 placeholder-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 neon-input"
              />
              <button
                className="w-full py-2 rounded-lg bg-cyan-500 text-[#0f172a] font-bold text-lg mt-1 shadow-[0_0_8px_2px_rgba(0,255,255,0.15)] hover:bg-cyan-400 transition"
              >
                Set as Profile
              </button>
            </div>
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
