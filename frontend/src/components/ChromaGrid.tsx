import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import './ChromaGrid.css';

export interface ChromaGridItem {
  id: string | number;
  label: string;
  value?: string;
  icon?: string;
  description?: string;
  color?: string;
  buttonLabel?: string;
  onClick?: () => void;
}

interface ChromaGridProps {
  items?: ChromaGridItem[];
  className?: string;
  radius?: number;
  columns?: number;
  rows?: number;
  damping?: number;
  fadeOut?: number;
  ease?: string;
}

const ChromaGrid: React.FC<ChromaGridProps> = ({
  items,
  className = '',
  radius = 300,
  columns = 3,
  rows = 2,
  damping = 0.45,
  fadeOut = 0.6,
  ease = 'power3.out'
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const setX = useRef<((value: number) => void) | null>(null);
  const setY = useRef<((value: number) => void) | null>(null);
  const pos = useRef({ x: 0, y: 0 });

  const data = items || [];

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    setX.current = gsap.quickSetter(el, '--x', 'px');
    setY.current = gsap.quickSetter(el, '--y', 'px');
    const { width, height } = el.getBoundingClientRect();
    pos.current = { x: width / 2, y: height / 2 };
    if (setX.current) setX.current(pos.current.x);
    if (setY.current) setY.current(pos.current.y);
  }, []);

  const moveTo = (x: number, y: number) => {
    gsap.to(pos.current, {
      x,
      y,
      duration: damping,
      ease,
      onUpdate: () => {
        setX.current?.(pos.current.x);
        setY.current?.(pos.current.y);
      },
      overwrite: true
    });
  };

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!rootRef.current) return;
    const r = rootRef.current.getBoundingClientRect();
    moveTo(e.clientX - r.left, e.clientY - r.top);
  };

  const handleCardClick = (item: ChromaGridItem) => {
    if (item.onClick) {
      item.onClick();
    }
  };

  const handleCardMove = (e: React.MouseEvent<HTMLElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div
      ref={rootRef}
      className={`chroma-grid ${className}`}
      style={{
        '--r': `${radius}px`,
        '--cols': columns,
        '--rows': rows
      } as React.CSSProperties}
      onPointerMove={handleMove}
    >
      {data.map((c, i) => (
        <article
          key={i}
          className="chroma-card"
          onMouseMove={handleCardMove}
          onClick={() => handleCardClick(c)}
          style={{
            '--card-border': c.color || 'transparent',
            cursor: c.onClick ? 'pointer' : 'default'
          } as React.CSSProperties}
        >
          <div className="chroma-card-content">
            <div className="chroma-card-header">
              {c.icon && <img src={c.icon} alt="" className="chroma-card-icon" />}
              <span className="chroma-card-label">{c.label}</span>
            </div>
            <div className="chroma-card-footer">
              <span className={`chroma-card-value ${c.buttonLabel ? 'has-button' : ''}`}>{c.value}</span>
              {c.buttonLabel && (
                <button className="chroma-card-button">{c.buttonLabel}</button>
              )}
            </div>
          </div>
        </article>
      ))}
      <div className="chroma-overlay" />
    </div>
  );
};

export default ChromaGrid;
