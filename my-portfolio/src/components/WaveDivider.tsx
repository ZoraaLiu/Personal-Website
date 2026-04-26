import React from "react";

interface WaveDividerProps {
  flip?: boolean;
}

const WaveDivider: React.FC<WaveDividerProps> = ({ flip = false }) => {
  return (
    <div
      style={{ width: "100%", overflow: "hidden", lineHeight: 0, marginTop: "-1px" }}
      aria-hidden
    >
      <svg
        viewBox="0 0 1440 54"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          display: "block",
          transform: flip ? "scaleY(-1)" : undefined,
        }}
      >
        <defs>
          <linearGradient id={`waveGrad${flip ? "B" : "A"}`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%"   style={{ stopColor: "var(--accent)",    stopOpacity: 0 }} />
            <stop offset="35%"  style={{ stopColor: "var(--accent)",    stopOpacity: 0.22 }} />
            <stop offset="65%"  style={{ stopColor: "var(--secondary)", stopOpacity: 0.18 }} />
            <stop offset="100%" style={{ stopColor: "var(--secondary)", stopOpacity: 0 }} />
          </linearGradient>
        </defs>
        <path
          d="M0,28 C200,54 400,4 720,24 C1040,44 1240,8 1440,28 L1440,54 L0,54 Z"
          fill={`url(#waveGrad${flip ? "B" : "A"})`}
        />
      </svg>
    </div>
  );
};

export default WaveDivider;
