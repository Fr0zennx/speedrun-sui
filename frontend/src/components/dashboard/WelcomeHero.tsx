import { lazy, Suspense } from 'react';

const RotatingText = lazy(() => import('../ui/RotatingText'));
const SlideArrowButton = lazy(() => import('../SlideArrowButton'));

interface WelcomeHeroProps {
    uiReady: boolean;
    onGetStarted: () => void;
}

export function WelcomeHero({ uiReady, onGetStarted }: WelcomeHeroProps) {
    return (
        <div className="get-started-section">
            <h2 className="welcome-title">Welcome to Sui Garage</h2>
            <div className="rotating-text-container">
                <span className="learn-text">Learn</span>
                {uiReady ? (
                    <Suspense fallback={<div className="loading-placeholder text-placeholder"></div>}>
                        <RotatingText
                            texts={['Sui Apps', 'Smart Contracts', 'Coding']}
                            mainClassName="rotating-text-box"
                            staggerFrom="last"
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "-120%" }}
                            staggerDuration={0.025}
                            splitLevelClassName="overflow-hidden"
                            transition={{ type: "spring", damping: 30, stiffness: 400 }}
                            rotationInterval={2000}
                        />
                    </Suspense>
                ) : (
                    <span className="rotating-text-box static-text">Sui Speedrun</span>
                )}
            </div>
            {uiReady ? (
                <Suspense fallback={<div className="btn-placeholder"></div>}>
                    <SlideArrowButton
                        text="Get Started"
                        primaryColor="#00bcd4"
                        onClick={onGetStarted}
                    />
                </Suspense>
            ) : (
                <button className="get-started-btn-static" onClick={onGetStarted}>Get Started</button>
            )}
        </div>
    );
}
