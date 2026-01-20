import React from "react";

interface TracingBeamProps {
  children: React.ReactNode;
  className?: string;
}

// Performance-optimized version: Static gradient line instead of animated
// This removes all scroll event listeners and Framer Motion calculations
export const TracingBeam: React.FC<TracingBeamProps> = ({ children, className }) => {
  return (
    <div
      className={className}
      style={{
        position: "relative",
      }}
    >
      {/* Static gradient line - no scroll animation overhead */}
      <div
        style={{
          position: "absolute",
          top: "0",
          left: "20px",
          height: "100%",
          width: "2px",
          background: "linear-gradient(to bottom, transparent, #667eea 10%, #764ba2 50%, #667eea 90%, transparent)",
          opacity: 0.6,
          pointerEvents: "none",
        }}
      />
      <div style={{ marginLeft: "60px" }}>
        {children}
      </div>
    </div>
  );
};
