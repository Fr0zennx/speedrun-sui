import Carousel from './ui/carousel';
import './GettingStarted.css';

interface GettingStartedProps {
  onClose: () => void;
  onStartSuiGarage?: () => void;
}

function GettingStarted({ onClose, onStartSuiGarage }: GettingStartedProps) {
  const slideData = [
    {
      title: 'Level 1: Sui Garage',
      button: 'Start ',
      src: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=3432&auto=format&fit=crop',
      onClick: onStartSuiGarage,
    },
    {
      title: 'Level 2: Character Card',
      button: 'Start',
      src: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=3472&auto=format&fit=crop',
      onClick: onStartSuiGarage,
    },
    {
      title: 'Level 3: NFT & Visual Ownership',
      button: 'Start',
      src: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=3540&auto=format&fit=crop',
      onClick: onStartSuiGarage,
    },
    {
      title: 'Level 4: Battle & Level Up',
      button: 'Start',
      src: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=3540&auto=format&fit=crop',
      onClick: onStartSuiGarage,
    },
    {
      title: 'Level 5: Sui Car',
      button: 'Start',
      src: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=3534&auto=format&fit=crop',
      onClick: onStartSuiGarage,
    },
    {
      title: 'Level 6: Sui Gallery',
      button: 'Start',
      src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=3540&auto=format&fit=crop',
      onClick: onStartSuiGarage,
    },
  ];

  return (
    <div className="getting-started-overlay">
      <div className="getting-started-container">
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
