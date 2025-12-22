import InfiniteMenu from './InfiniteMenu';
import GridScan from './GridScan';
import './GettingStarted.css';

interface GettingStartedProps {
  onClose: () => void;
}

function GettingStarted({ onClose }: GettingStartedProps) {
  const menuItems = [
    {
      image: '',
      link: '#network',
      title: 'Network',
      description: 'Currently connected to Sui\'s testing environment'
    },
    {
      image: '',
      link: '#status',
      title: 'Status',
      description: 'Your wallet connection is live and secure'
    },
    {
      image: '',
      link: '#wallet-type',
      title: 'Wallet Type',
      description: 'Official Sui browser extension wallet'
    },
    {
      image: '',
      link: '#balance',
      title: 'Balance',
      description: 'Total balance in your wallet'
    },
    {
      image: '',
      link: '#transactions',
      title: 'Transactions',
      description: 'Number of transactions performed'
    },
    {
      image: '',
      link: '#nfts',
      title: 'NFTs Owned',
      description: 'Digital collectibles in your wallet'
    },
    {
      image: '',
      link: '#connected',
      title: 'Connected Since',
      description: 'Your wallet connection start date'
    },
    {
      image: '',
      link: '#activity',
      title: 'Last Activity',
      description: 'Most recent wallet interaction'
    }
  ];

  return (
    <div className="getting-started-overlay">
      <div className="getting-started-container">
        {/* GridScan Background */}
        <GridScan
          sensitivity={0.55}
          lineThickness={1}
          linesColor="#1a2845"
          gridScale={0.1}
          scanColor="#1e90ff"
          scanOpacity={0.5}
          enablePost
          bloomIntensity={0.4}
          chromaticAberration={0.001}
          noiseIntensity={0.005}
          scanDirection="pingpong"
          scanDuration={3.0}
          scanDelay={1.0}
        />

        {/* Close button */}
        <button className="getting-started-close-btn" onClick={onClose}>
          ✕
        </button>

        {/* Infinite Menu */}
        <div className="getting-started-content">
          <InfiniteMenu items={menuItems} scale={1.0} />
        </div>
      </div>
    </div>
  );
}

export default GettingStarted;
