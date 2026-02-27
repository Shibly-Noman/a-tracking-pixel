import * as React from "react";

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

export function Logo({ size = 24, className, ...props }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      width="40"
      height="40"
    >
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect width="200" height="200" fill="#333030" />

      <line
        x1="100"
        y1="40"
        x2="100"
        y2="88"
        stroke="#e8e8e8"
        strokeWidth="3"
        opacity="0.25"
      />
      <line
        x1="100"
        y1="112"
        x2="100"
        y2="160"
        stroke="#e8e8e8"
        strokeWidth="3"
        opacity="0.25"
      />
      <line
        x1="40"
        y1="100"
        x2="88"
        y2="100"
        stroke="#e8e8e8"
        strokeWidth="3"
        opacity="0.25"
      />
      <line
        x1="112"
        y1="100"
        x2="160"
        y2="100"
        stroke="#e8e8e8"
        strokeWidth="3"
        opacity="0.25"
      />

      <rect
        x="94"
        y="94"
        width="12"
        height="12"
        fill="#ffffff"
        filter="url(#glow)"
      />
    </svg>
  );
}
