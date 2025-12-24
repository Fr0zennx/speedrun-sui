export interface ProfileStaticData {
  id: string;
  label: string;
  description: string;
  icon?: string; // URL to the image/icon
  color?: string; // Hex color for glow effects
  action?: 'lesson' | 'none';
}

export const profileStaticData: ProfileStaticData[] = [
  {
    id: 'garage',
    label: 'Sui Garage',
    description: 'Currently connected to Sui\'s testing environment',
    icon: '', // Add your icon URL here
    color: '#4facfe',
    action: 'lesson'
  },
  {
    id: 'status',
    label: 'Character Card',
    description: 'Your wallet connection is live and secure',
    icon: '',
    color: '#00f260',
    action: 'lesson'
  },
  {
    id: 'wallet',
    label: 'Wallet Type',
    description: 'Official Sui browser extension wallet',
    icon: '',
    color: '#f093fb'
  },
  {
    id: 'balance',
    label: 'Balance',
    description: 'Total balance available in your wallet',
    icon: '',
    color: '#f5576c'
  },
  {
    id: 'transactions',
    label: 'Transactions',
    description: 'Total number of transactions performed',
    icon: '',
    color: '#43e97b'
  },
  {
    id: 'nfts',
    label: 'NFTs Owned',
    description: 'Digital collectibles held in your wallet',
    icon: '',
    color: '#fa709a'
  },
  {
    id: 'connected',
    label: 'Connected Since',
    description: 'Date when you first connected this wallet',
    icon: '',
    color: '#a18cd1'
  },
  {
    id: 'activity',
    label: 'Last Activity',
    description: 'Most recent interaction with the dApp',
    icon: '',
    color: '#fbc2eb'
  }
];
