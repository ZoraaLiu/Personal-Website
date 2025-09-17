import React from "react";

interface WaveDividerProps {
  flip?: boolean;
}

const WaveDivider: React.FC<WaveDividerProps> = ({ flip = false }) => {
  return (
    <div style={{ width: "100%", overflow: "hidden", lineHeight: 0 }} aria-hidden>
      <svg
        viewBox="0 0 1440 120"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block", transform: flip ? "scaleY(-1)" : undefined }}
      >
        <defs>
          <linearGradient id="waveGrad" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="rgba(236,72,153,0.0)" />
            <stop offset="50%" stopColor="rgba(236,72,153,0.35)" />
            <stop offset="100%" stopColor="rgba(236,72,153,0.0)" />
          </linearGradient>
        </defs>
        <path
          d="M0,64 C240,96 480,32 720,56 C960,80 1200,128 1440,80 L1440,120 L0,120 Z"
          fill="url(#waveGrad)"
        />
      </svg>
    </div>
  );
};

export default WaveDivider;


