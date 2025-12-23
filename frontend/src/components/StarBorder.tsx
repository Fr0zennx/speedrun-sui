import React from 'react';
import './StarBorder.css';

interface StarBorderProps {
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  color?: string;
  speed?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

function StarBorder({ 
  as: Component = 'button', 
  className = '', 
  color = 'cyan', 
  speed = '5s',
  children,
  onClick
}: StarBorderProps) {
  return (
    <Component className={`star-border-container ${className}`} onClick={onClick}>
      <div 
        className="border-gradient-bottom" 
        style={{ 
          background: color,
          animationDuration: speed 
        }}
      />
      <div 
        className="border-gradient-top" 
        style={{ 
          background: color,
          animationDuration: speed 
        }}
      />
      <div className="inner-content">
        {children}
      </div>
    </Component>
  );
}

export default StarBorder;
