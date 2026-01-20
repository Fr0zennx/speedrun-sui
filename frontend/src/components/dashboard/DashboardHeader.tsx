import { ConnectButton } from '@mysten/dapp-kit';
import { VscAccount } from 'react-icons/vsc';
import type { WalletAccount } from '@mysten/wallet-standard';

interface DashboardHeaderProps {
    currentAccount: WalletAccount | null;
    onDisconnect: () => void;
    onOpenProfile: () => void;
}

export function DashboardHeader({ currentAccount, onDisconnect, onOpenProfile }: DashboardHeaderProps) {
    return (
        <header className="dashboard-header">
            <div className="header-content">
                <div className="logo-section">
                    <img
                        src="https://cryptologos.cc/logos/sui-sui-logo.png"
                        alt="Sui Logo"
                        className="sui-logo"
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            if (target.src.includes('cryptologos')) {
                                target.src = 'https://s2.coinmarketcap.com/static/img/coins/200x200/20947.png';
                            }
                        }}
                    />
                    <h1 className="logo-text">Sui Garage</h1>
                </div>

                <div className="header-actions">
                    {!currentAccount ? (
                        <div className="header-btn connect-btn">
                            <ConnectButton />
                        </div>
                    ) : (
                        <div className="wallet-info">
                            <button className="header-btn profile-btn" onClick={onOpenProfile}>
                                <VscAccount size={16} />
                                <span>Profile</span>
                            </button>
                            <div className="wallet-badge">
                                <VscAccount size={16} />
                                <span className="wallet-address">
                                    {currentAccount.address.substring(0, 6)}...{currentAccount.address.substring(currentAccount.address.length - 4)}
                                </span>
                            </div>
                            <button className="header-btn disconnect-btn" onClick={onDisconnect}>
                                <span>Disconnect</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
