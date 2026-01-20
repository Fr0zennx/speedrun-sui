import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import ElectricBorder from './ui/ElectricBorder';
import './NFTProfilePhoto.css';

interface NFTMetadata {
    id: string;
    name: string;
    description: string;
    image: string;
    collection?: string;
    attributes?: Array<{ trait_type: string; value: string }>;
}

interface NFTProfilePhotoProps {
    walletAddress?: string;
    onPhotoChange?: (nftId: string | null, imageUrl: string | null) => void;
}

// Mock NFT data for testing (simulates various NFT collections on Sui)
const mockNFTDatabase: Record<string, NFTMetadata> = {
    '0x1234567890abcdef': {
        id: '0x1234567890abcdef',
        name: 'Sui Punk #1337',
        description: 'A rare cyberpunk NFT on Sui network',
        image: 'https://picsum.photos/seed/punk1337/400/400',
        collection: 'Sui Punks',
        attributes: [
            { trait_type: 'Background', value: 'Neon Blue' },
            { trait_type: 'Rarity', value: 'Legendary' }
        ]
    },
    '0xfedcba0987654321': {
        id: '0xfedcba0987654321',
        name: 'Sui Monkey #42',
        description: 'Exclusive monkey from the Sui jungle',
        image: 'https://picsum.photos/seed/monkey42/400/400',
        collection: 'Sui Monkeys',
        attributes: [
            { trait_type: 'Hat', value: 'Crown' },
            { trait_type: 'Eyes', value: 'Laser' }
        ]
    },
    '0xabcdef1234567890': {
        id: '0xabcdef1234567890',
        name: 'Sui Dragon #999',
        description: 'Mythical dragon NFT',
        image: 'https://picsum.photos/seed/dragon999/400/400',
        collection: 'Sui Dragons',
        attributes: [
            { trait_type: 'Element', value: 'Fire' },
            { trait_type: 'Wings', value: 'Golden' }
        ]
    }
};

// Simulate API call to fetch NFT metadata
const fetchNFTMetadata = async (nftId: string): Promise<NFTMetadata> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Check mock database first
    if (mockNFTDatabase[nftId]) {
        return mockNFTDatabase[nftId];
    }

    // For any other ID, generate random NFT data
    if (nftId.startsWith('0x') && nftId.length >= 10) {
        const randomNum = parseInt(nftId.slice(2, 6), 16) % 10000;
        return {
            id: nftId,
            name: `Sui NFT #${randomNum}`,
            description: 'A unique NFT from the Sui blockchain',
            image: `https://picsum.photos/seed/${nftId}/400/400`,
            collection: 'Sui Collection',
            attributes: [
                { trait_type: 'ID', value: nftId.slice(0, 10) + '...' }
            ]
        };
    }

    throw new Error('Invalid NFT Object ID. Please enter a valid Sui Object ID (starting with 0x)');
};

const STORAGE_KEY = 'sui_nft_profile';

function NFTProfilePhoto({ walletAddress, onPhotoChange }: NFTProfilePhotoProps) {
    const [nftId, setNftId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [previewNFT, setPreviewNFT] = useState<NFTMetadata | null>(null);
    const [savedNFT, setSavedNFT] = useState<NFTMetadata | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [showHelper, setShowHelper] = useState(false);

    // Load saved NFT from localStorage on mount
    useEffect(() => {
        const loadSavedNFT = () => {
            try {
                const storageKey = walletAddress ? `${STORAGE_KEY}_${walletAddress}` : STORAGE_KEY;
                const saved = localStorage.getItem(storageKey);
                if (saved) {
                    const parsedNFT = JSON.parse(saved) as NFTMetadata;
                    setSavedNFT(parsedNFT);
                    onPhotoChange?.(parsedNFT.id, parsedNFT.image);
                }
            } catch (error) {
                console.error('Failed to load saved NFT:', error);
            }
        };
        loadSavedNFT();
    }, [walletAddress, onPhotoChange]);

    // Fetch NFT metadata
    const handleFetchNFT = useCallback(async () => {
        if (!nftId.trim()) {
            toast.error('Please enter an NFT Object ID');
            return;
        }

        setIsLoading(true);
        setImageError(false);

        try {
            const metadata = await fetchNFTMetadata(nftId.trim());
            setPreviewNFT(metadata);
            setShowPreview(true);
            toast.success(`Found: ${metadata.name}`);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to fetch NFT';
            toast.error(message);
            setPreviewNFT(null);
            setShowPreview(false);
        } finally {
            setIsLoading(false);
        }
    }, [nftId]);

    // Confirm and save NFT as profile photo
    const handleConfirm = useCallback(() => {
        if (!previewNFT) return;

        try {
            const storageKey = walletAddress ? `${STORAGE_KEY}_${walletAddress}` : STORAGE_KEY;
            localStorage.setItem(storageKey, JSON.stringify(previewNFT));
            setSavedNFT(previewNFT);
            setShowPreview(false);
            setPreviewNFT(null);
            setNftId('');
            onPhotoChange?.(previewNFT.id, previewNFT.image);
            toast.success('Profile photo updated!');
        } catch (error) {
            toast.error('Failed to save profile photo');
        }
    }, [previewNFT, walletAddress, onPhotoChange]);

    // Cancel preview
    const handleCancel = useCallback(() => {
        setShowPreview(false);
        setPreviewNFT(null);
        setImageError(false);
    }, []);

    // Remove saved photo
    const handleRemovePhoto = useCallback(() => {
        try {
            const storageKey = walletAddress ? `${STORAGE_KEY}_${walletAddress}` : STORAGE_KEY;
            localStorage.removeItem(storageKey);
            setSavedNFT(null);
            onPhotoChange?.(null, null);
            toast.success('Profile photo removed');
        } catch (error) {
            toast.error('Failed to remove profile photo');
        }
    }, [walletAddress, onPhotoChange]);

    // Current display NFT (preview takes priority over saved)
    const displayNFT = showPreview ? previewNFT : savedNFT;

    return (
        <div className="nft-profile-container">
            {/* Profile Photo Display */}
            <div className="nft-photo-wrapper">
                <ElectricBorder
                    color="#7df9ff"
                    speed={0.8}
                    chaos={0.2}
                    thickness={1}
                    borderRadius={16}
                    style={{ borderRadius: 16 }}
                >
                    <motion.div
                        className="nft-photo-card"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                        <AnimatePresence mode="wait">
                            {displayNFT && !imageError ? (
                                <motion.div
                                    key="nft-image"
                                    className="nft-image-container"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <img
                                        src={displayNFT.image}
                                        alt={displayNFT.name}
                                        className="nft-profile-image"
                                        loading="lazy"
                                        decoding="async"
                                        onError={() => setImageError(true)}
                                    />
                                    {/* NFT Info Overlay */}
                                    <div className="nft-info-overlay">
                                        <span className="nft-collection">{displayNFT.collection}</span>
                                        <span className="nft-name">{displayNFT.name}</span>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="placeholder"
                                    className="nft-placeholder"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {isLoading ? (
                                        <div className="nft-loading">
                                            <div className="nft-spinner" />
                                            <span>Loading NFT...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <svg className="nft-placeholder-icon" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                                            </svg>
                                            <p className="nft-placeholder-text">Profile Photo</p>
                                        </>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </ElectricBorder>
            </div>

            {/* NFT Attributes Display */}
            <AnimatePresence>
                {displayNFT && displayNFT.attributes && displayNFT.attributes.length > 0 && (
                    <motion.div
                        className="nft-attributes"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                    >
                        {displayNFT.attributes.slice(0, 3).map((attr, index) => (
                            <div key={index} className="nft-attribute">
                                <span className="attr-type">{attr.trait_type}</span>
                                <span className="attr-value">{attr.value}</span>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Input Section */}
            <div className="nft-input-section">
                <div className="nft-input-container">
                    {/* Glow effect */}
                    <div className="nft-input-glow" />

                    {/* Plus icon */}
                    <motion.div
                        className="nft-add-icon"
                        animate={isLoading ? { rotate: 360 } : { rotate: 0 }}
                        transition={isLoading ? { duration: 1, repeat: Infinity, ease: 'linear' } : {}}
                    >
                        {isLoading ? (
                            <svg className="w-8 h-8 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" opacity="0.3" />
                                <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                            </svg>
                        ) : (
                            <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                        )}
                    </motion.div>

                    {/* Input Group */}
                    <div className="nft-input-group">
                        <input
                            type="text"
                            value={nftId}
                            onChange={(e) => setNftId(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleFetchNFT()}
                            placeholder="Example: 0x1a2b3c4d5e..."
                            className="nft-id-input"
                            disabled={isLoading}
                        />
                        <div className="nft-input-info">
                            <svg className="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M12 16v-4" />
                                <path d="M12 8h.01" />
                            </svg>
                            <div className="nft-input-tooltip">
                                <p>Enter the unique Object ID of your NFT from the Sui Network.</p>
                                <p className="tooltip-sub">Example: 0x89b...23a</p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <AnimatePresence mode="wait">
                        {showPreview ? (
                            <motion.div
                                key="preview-buttons"
                                className="nft-button-group"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.2 }}
                            >
                                <button
                                    onClick={handleConfirm}
                                    className="nft-btn nft-btn-confirm"
                                    disabled={isLoading}
                                >
                                    <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    Confirm
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="nft-btn nft-btn-cancel"
                                    disabled={isLoading}
                                >
                                    <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                    Cancel
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="main-buttons"
                                className="nft-button-group"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.2 }}
                            >
                                <button
                                    onClick={handleFetchNFT}
                                    className="nft-btn nft-btn-primary"
                                    disabled={isLoading || !nftId.trim()}
                                >
                                    {isLoading ? 'Loading...' : 'Set as Profile'}
                                </button>
                                {savedNFT && (
                                    <button
                                        onClick={handleRemovePhoto}
                                        className="nft-btn nft-btn-secondary"
                                        disabled={isLoading}
                                    >
                                        Change Photo
                                    </button>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Collapsible User Guide */}
            <div className="nft-guide-section">
                <button
                    className="nft-guide-toggle"
                    onClick={() => setShowHelper(!showHelper)}
                >
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <circle cx="12" cy="12" r="10" strokeWidth="2" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 17h.01" />
                        </svg>
                        <span>Need help?</span>
                    </div>
                    <svg
                        className={`guide-arrow ${showHelper ? 'open' : ''}`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                <AnimatePresence>
                    {showHelper && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="nft-guide-content"
                        >
                            <div className="guide-card">
                                <h4>How to Add Your NFT Profile Picture</h4>

                                <div className="guide-steps">
                                    <div className="guide-step">
                                        <div className="guide-icon">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <circle cx="11" cy="11" r="8" />
                                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                            </svg>
                                        </div>
                                        <div className="guide-text">
                                            <span className="step-title">1. Visit SuiScan and find your NFT</span>
                                            <span className="step-desc">Go to suiscan.xyz and navigate to your NFT details page.</span>
                                        </div>
                                    </div>

                                    <div className="guide-step">
                                        <div className="guide-icon">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                            </svg>
                                        </div>
                                        <div className="guide-text">
                                            <span className="step-title">2. Copy the NFT Object ID</span>
                                            <span className="step-desc">Find the Object ID in the URL or details section:</span>
                                            <code className="guide-code">suiscan.xyz/object/<span className="code-highlight">[OBJECT_ID]</span></code>
                                        </div>
                                    </div>

                                    <div className="guide-step">
                                        <div className="guide-icon">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                                                <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                                            </svg>
                                        </div>
                                        <div className="guide-text">
                                            <span className="step-title">3. Paste the Object ID above</span>
                                            <span className="step-desc">Enter the ID into the input field above.</span>
                                        </div>
                                    </div>

                                    <div className="guide-step">
                                        <div className="guide-icon">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                                <polyline points="22 4 12 14.01 9 11.01" />
                                            </svg>
                                        </div>
                                        <div className="guide-text">
                                            <span className="step-title">4. Click 'Set as Profile'</span>
                                            <span className="step-desc">Your NFT will appear as your profile picture!</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="guide-footer">
                                    <div className="network-badge">
                                        <span className="dot" />
                                        Supported Network: <strong>Sui Network</strong>
                                    </div>

                                    <div className="common-issues">
                                        <h5>Common Issues</h5>
                                        <p>• Make sure the Object ID is valid (starts with 0x)</p>
                                        <p>• Ensure the NFT has a valid image URL</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Quick Start Section */}
            <div className="nft-quick-start">
                <h5>Quick Start with Example NFTs</h5>
                <div className="quick-start-grid">
                    {Object.keys(mockNFTDatabase).map((id) => (
                        <button
                            key={id}
                            onClick={() => {
                                setNftId(id);
                                navigator.clipboard.writeText(id);
                                toast.success('ID copied & pasted!');
                            }}
                            className="quick-start-btn"
                            title="Click to copy & use"
                        >
                            <span className="quick-id">{id.slice(0, 6)}...{id.slice(-4)}</span>
                            <div className="quick-copy-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                </svg>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default NFTProfilePhoto;
