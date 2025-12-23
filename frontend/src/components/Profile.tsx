import { useCurrentAccount } from '@mysten/dapp-kit';
import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import StarBorder from './StarBorder';
import LessonView from './LessonView';
import './Profile.css';

interface ProfileProps {
  onClose: () => void;
}

function Profile({ onClose }: ProfileProps) {
  const currentAccount = useCurrentAccount();
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [showLesson, setShowLesson] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const orderRef = useRef<number[]>([0, 1, 2, 3, 4, 5, 6, 7]);
  const previousIndexRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const currentTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const scrollTimeoutRef = useRef<number | null>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollPercentage = container.scrollTop / (container.scrollHeight - container.clientHeight);
    
    // Calculate index: 0 to 7 (8 total cards)
    let newIndex;
    if (scrollPercentage <= 0.01) {
      newIndex = 0; // Force to first card when near top
    } else if (scrollPercentage >= 0.99) {
      newIndex = 7; // Force to last card when near bottom
    } else {
      newIndex = Math.round(scrollPercentage * 7); // 0-7 range
    }
    
    if (newIndex !== activeCardIndex) {
      // Cancel any pending scroll timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // If animating, kill current animation and jump to target
      if (isAnimatingRef.current && currentTimelineRef.current) {
        currentTimelineRef.current.kill();
        isAnimatingRef.current = false;
      }

      const direction = newIndex > previousIndexRef.current ? 'forward' : 'backward';
      previousIndexRef.current = newIndex;
      setActiveCardIndex(newIndex);
      
      // Debounce rapid scrolls
      scrollTimeoutRef.current = window.setTimeout(() => {
        performCardSwap(newIndex, direction);
      }, 50);
    }
  };

  const performCardSwap = (targetIndex: number, direction: 'forward' | 'backward') => {
    const currentOrder = [...orderRef.current];
    const currentFrontIndex = currentOrder[0];
    
    if (targetIndex === currentFrontIndex) return;
    
    const posInOrder = currentOrder.indexOf(targetIndex);
    if (posInOrder === -1) return;

    // Kill any existing animation
    if (currentTimelineRef.current) {
      currentTimelineRef.current.kill();
    }

    isAnimatingRef.current = true;
    const masterTimeline = gsap.timeline({
      onComplete: () => {
        isAnimatingRef.current = false;
        currentTimelineRef.current = null;
      }
    });
    currentTimelineRef.current = masterTimeline;

    if (direction === 'forward') {
      // Forward: Current front card drops, others promote forward
      const rotations = posInOrder;
      
      for (let i = 0; i < rotations; i++) {
        const [front, ...rest] = currentOrder;
        const frontEl = cardRefs.current[front];
        
        if (!frontEl) continue;
        
        // Drop front card down
        masterTimeline.to(frontEl, {
          y: '+=500',
          duration: 0.6,
          ease: 'power2.inOut'
        }, i > 0 ? '<0.1' : 0);
        
        // Promote other cards forward
        masterTimeline.addLabel(`promote${i}`, '-=0.35');
        rest.forEach((idx, j) => {
          const el = cardRefs.current[idx];
          if (!el) return;
          const slot = makeSlot(j, 60, 70, 8);
          masterTimeline.set(el, { zIndex: slot.zIndex }, `promote${i}`);
          masterTimeline.to(el, {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            duration: 0.6,
            ease: 'power2.inOut'
          }, `promote${i}+=${j * 0.1}`);
        });
        
        // Return front card to back
        const backSlot = makeSlot(7, 60, 70, 8);
        masterTimeline.addLabel(`return${i}`, `promote${i}+=0.15`);
        masterTimeline.call(() => {
          gsap.set(frontEl, { zIndex: backSlot.zIndex });
        }, undefined, `return${i}`);
        masterTimeline.to(frontEl, {
          x: backSlot.x,
          y: backSlot.y,
          z: backSlot.z,
          duration: 0.6,
          ease: 'power2.inOut'
        }, `return${i}`);
        
        currentOrder.splice(0, 1);
        currentOrder.push(front);
      }
    } else {
      // Backward: Need to bring target to front from the back
      // Calculate how many backward rotations needed
      const stepsNeeded = 8 - posInOrder;
      
      for (let i = 0; i < stepsNeeded; i++) {
        const backIndex = currentOrder[currentOrder.length - 1];
        const backEl = cardRefs.current[backIndex];
        
        if (!backEl) continue;
        
        const frontSlot = makeSlot(0, 60, 70, 8);
        const startPosition = i === 0 ? 0 : '<0.1';
        
        // Push all current cards back first
        masterTimeline.addLabel(`pushback${i}`, startPosition);
        currentOrder.slice(0, -1).forEach((idx, j) => {
          const el = cardRefs.current[idx];
          if (!el) return;
          const slot = makeSlot(j + 1, 60, 70, 8);
          masterTimeline.set(el, { zIndex: slot.zIndex }, `pushback${i}`);
          masterTimeline.to(el, {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            duration: 0.6,
            ease: 'power2.inOut'
          }, `pushback${i}+=${j * 0.08}`);
        });
        
        // Set back card below screen and bring to front
        masterTimeline.addLabel(`rise${i}`, `pushback${i}+=0.2`);
        masterTimeline.set(backEl, { 
          y: frontSlot.y + 500,
          x: frontSlot.x,
          z: frontSlot.z,
          zIndex: 999
        }, `rise${i}`);
        
        // Animate back card rising to front
        masterTimeline.to(backEl, {
          y: frontSlot.y,
          duration: 0.6,
          ease: 'power2.inOut'
        }, `rise${i}`);
        
        // Final z-index fix
        masterTimeline.call(() => {
          gsap.set(backEl, { zIndex: frontSlot.zIndex });
        }, undefined, `rise${i}+=0.6`);
        
        currentOrder.pop();
        currentOrder.unshift(backIndex);
      }
    }
    
    orderRef.current = currentOrder;
  };

  const makeSlot = (i: number, distX: number, distY: number, total: number) => ({
    x: i * distX,
    y: -i * distY,
    z: -i * distX * 1.5,
    zIndex: total - i
  });

  useEffect(() => {
    // Initial card positioning
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const slot = makeSlot(i, 60, 70, 8);
      gsap.set(card, {
        x: slot.x,
        y: slot.y,
        z: slot.z,
        xPercent: -50,
        yPercent: -50,
        transformOrigin: 'center center',
        zIndex: slot.zIndex,
        force3D: true
      });
    });

    // Cleanup on unmount
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      if (currentTimelineRef.current) {
        currentTimelineRef.current.kill();
      }
    };
  }, []);

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

  const cards = [
    {
      icon: '',
      label: 'Hello Move',
      value: '',
      desc: 'Currently connected to Sui\'s testing environment',
      number: '0'
    },
    {
      icon: '',
      label: 'Status',
      value: 'Active',
      desc: 'Your wallet connection is live and secure',
      isStatus: true,
      number: '2'
    },
    {
      icon: '',
      label: 'Wallet Type',
      value: 'Sui Wallet',
      desc: 'Official Sui browser extension wallet',
      number: '3'
    },
    {
      icon: '',
      label: 'Balance',
      value: '-- SUI',
      desc: 'Total balance in your wallet',
      number: '4'
    },
    {
      icon: '',
      label: 'Transactions',
      value: '0',
      desc: 'Number of transactions performed',
      number: '5'
    },
    {
      icon: '',
      label: 'NFTs Owned',
      value: '0',
      desc: 'Digital collectibles in your wallet',
      number: '6'
    },
    {
      icon: '',
      label: 'Connected Since',
      value: new Date().toLocaleDateString(),
      desc: 'Your wallet connection start date',
      number: '7'
    },
    {
      icon: '',
      label: 'Last Activity',
      value: 'Just now',
      desc: 'Most recent wallet interaction',
      number: '8'
    }
  ];

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
            <div 
              className="profile-photo"
              style={{ background: getGradientFromAddress(currentAccount.address) }}
            >
              <div className="profile-photo-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                </svg>
              </div>
            </div>
            <div className="profile-photo-glow" style={{ background: getGradientFromAddress(currentAccount.address) }}></div>
          </div>
          
          <div className="profile-wallet-info">
            <h3>Wallet Address</h3>
            <p className="profile-address">{currentAccount.address}</p>
          </div>
        </div>

        {/* Right side - CardSwap */}
        <div className="profile-right">
          <h2>Profile</h2>
          <div className="profile-scroll-wrapper" ref={scrollContainerRef} onScroll={handleScroll}>
            <div className="profile-cards-wrapper">
              {/* Center Start Button */}
              <div className="profile-center-button">
                <StarBorder
                  key={activeCardIndex}
                  as="button"
                  className="profile-start-button"
                  color="cyan"
                  speed="5s"
                  onClick={() => {
                    if (activeCardIndex === 0) {
                      setShowLesson(true);
                    } else {
                      console.log(`Started ${cards[activeCardIndex].label}`);
                    }
                  }}
                >
                  Start
                </StarBorder>
              </div>

              {/* Right side - Manual Card Stack */}
              <div className="manual-card-swap-container">
                {cards.map((card, index) => (
                  <div 
                    key={index}
                    ref={(el) => (cardRefs.current[index] = el)}
                    className="manual-card"
                  >
                    <div className="card-number">{card.number}</div>
                    <div className="card-header">
                      <div className={`card-icon ${card.isStatus ? 'status-icon' : ''}`}>
                        {card.icon}
                      </div>
                      <div className="card-title">
                        <label>{card.label}</label>
                        <span className={card.isStatus ? 'status-active' : ''}>{card.value}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Spacer for scrolling */}
            <div style={{ height: '300vh' }} />
          </div>
        </div>
      </div>

      {/* Lesson View */}
      {showLesson && <LessonView onClose={() => setShowLesson(false)} />}
    </div>
  );
}

export default Profile;