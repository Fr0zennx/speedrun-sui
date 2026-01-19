import Carousel from './ui/carousel';
import { SparklesCore } from './ui/sparkles';
import './GettingStarted.css';

interface GettingStartedProps {
  onClose: () => void;
  onStartSuiGarage?: () => void;
  onStartCharacterCard?: () => void;
  onStartNFTOwnership?: () => void;
  onStartBalance?: () => void;
  onStartSuiCar?: () => void;
  onStartSuiGallery?: () => void;
}

function GettingStarted({
  onClose,
  onStartSuiGarage,
  onStartCharacterCard,
  onStartNFTOwnership,
  onStartBalance,
  onStartSuiCar,
  onStartSuiGallery
}: GettingStartedProps) {
  const slideData = [
    {
      title: 'Level 1: Sui Garage',
      button: 'Start ',
      src: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=3432&auto=format&fit=crop',
      onClick: () => {
        onClose();
        onStartSuiGarage?.();
      },
    },
    {
      title: 'Level 2: Character Card',
      button: 'Start',
      src: '/character-card-id.png',
      onClick: () => {
        onClose();
        onStartCharacterCard?.();
      },
    },
    {
      title: 'Level 3: NFT & Visual Ownership',
      button: 'Start',
      src: '/nft-phoenix.png',
      onClick: () => {
        onClose();
        onStartNFTOwnership?.();
      },
    },
    {
      title: 'Level 4: Battle & Level Up',
      button: 'Start',
      src: '/battle-level-up.png',
      onClick: () => {
        onClose();
        onStartBalance?.();
      },
    },
    {
      title: 'Level 5: Sui Car',
      button: 'Start',
      src: '/sui-car.png',
      onClick: () => {
        onClose();
        onStartSuiCar?.();
      },
    },
    {
      title: 'Level 6: Sui Gallery',
      button: 'Start',
      src: '/sui-gallery.png',
      onClick: () => {
        onClose();
        onStartSuiGallery?.();
      },
    },
  ];

  return (
    <div className="getting-started-overlay">
      <div className="getting-started-container">
        {/* Sparkles Background */}
        <div className="getting-started-sparkles">
          <SparklesCore
            id="getting-started-sparkles"
            background="transparent"
            minSize={0.6}
            maxSize={1.4}
            particleDensity={100}
            speed={1}
            particleColor="#FFFFFF"
          />
        </div>

        {/* Close button */}
        <button className="getting-started-close-btn" onClick={onClose}>
          ✕
        </button>

        {/* Carousel */}
        <div className="getting-started-content">
          <Carousel slides={slideData} />
        </div>
      </div>
    </div>
  );
}

export default GettingStarted;
