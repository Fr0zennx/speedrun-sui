export interface ProfileStaticData {
  id: string;
  label: string;
  description: string;
  icon: string;
  image?: string;
  color: string;
  action?: string;
}

export const profileStaticData: ProfileStaticData[] = [
  {
    id: 'garage',
    label: 'Level 1: Sui Garage Development',
    description: 'Your learning hub for Sui development',
    icon: '🏗️',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=3432&auto=format&fit=crop',
    color: '#FF6B9D',
    action: 'lesson'
  },
  {
    id: 'status',
    label: 'Level 2: Character Card',
    description: 'Create your first NFT smart contract',
    icon: '⚡',
    image: '/character-card-id.png',
    color: '#4ECDC4',
    action: 'lesson'
  },
  {
    id: 'wallet',
    label: 'Level 3: NFT & Visual Ownership',
    description: 'Learn about NFT creation and visual assets',
    icon: '🎨',
    image: '/nft-phoenix.png',
    color: '#1E90FF',
    action: 'lesson'
  },
  {
    id: 'balance',
    label: 'Level 4: Battle & Level Up',
    description: 'Your Sui token balance',
    icon: '💰',
    image: '/battle-level-up.png',
    color: '#FFD700',
    action: 'lesson'
  },
  {
    id: 'transactions',
    label: 'Level 5: Sui Car',
    description: 'Your on-chain activities',
    icon: '📊',
    image: '/sui-car.png',
    color: '#00FF88',
    action: 'lesson'
  },
  {
    id: 'nfts',
    label: 'Level 6: Sui Gallery',
    description: 'Your digital collectibles',
    icon: '🎨',
    image: '/sui-gallery.png',
    color: '#FF8C00',
    action: 'lesson'
  }
];
