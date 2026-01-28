import React from "react";

type InputNodeIconProps = {
  className?: string;
};
export const BaseNodeIcon: React.FC<InputNodeIconProps> = ({
  className = "w-6 h-6 text-neutral-200",
}) => {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Node body */}
      <rect
        x="6"
        y="6"
        width="52"
        height="36"
        rx="6"
        className="fill-neutral-900 stroke-neutral-600"
        strokeWidth="2"
      />

    </svg>
  );
};

export const SingleInputNodeIcon: React.FC<InputNodeIconProps> = ({
  className = "w-6 h-6 text-neutral-200",
}) => {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Node body */}
      <rect
        x="6"
        y="6"
        width="52"
        height="36"
        rx="6"
        className="fill-neutral-900 stroke-neutral-600"
        strokeWidth="2"
      />

      {/* Bottom handle */}
      <circle
        cx="32"
        cy="42"
        r="4"
        className="fill-neutral-300 stroke-neutral-800"
        strokeWidth="1.5"
      />
    </svg>
  );
};

export const DoubleHandleNodeIcon: React.FC<InputNodeIconProps> = ({
  className = "w-6 h-6 text-neutral-200",
}) => {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Node body */}
      <rect
        x="6"
        y="6"
        width="52"
        height="36"
        rx="6"
        // opacity="0.15"
        className="fill-neutral-900 stroke-neutral-600"
        strokeWidth="2"
      />

      {/* down handle */}
      <circle
        cx="32"
        cy="42"
        r="4"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.5"
      />

      {/* up handle */}
      <circle
        cx="32"
        cy="7"
        r="4"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
};

export const FourHandleNodeIcon: React.FC<InputNodeIconProps> = ({
  className = "w-6 h-6 text-neutral-200",
}) => {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Node body */}
      <rect
        x="6"
        y="6"
        width="52"
        height="36"
        rx="6"
        // fill="currentColor"
        // opacity="0.15"
        // stroke="currentColor"
        className="fill-neutral-900 stroke-neutral-600"
        strokeWidth="2"
      />

      {/* Top */}
      <circle cx="32" cy="6" r="4" fill="currentColor" />

      {/* Bottom */}
      <circle cx="32" cy="42" r="4" fill="currentColor" />

      {/* Left */}
      <circle cx="6" cy="24" r="4" fill="currentColor" />

      {/* Right */}
      <circle cx="58" cy="24" r="4" fill="currentColor" />
    </svg>
  );
};
export const SingleHandleNodeRIcon: React.FC<InputNodeIconProps> = ({
  className = "w-6 h-6 text-neutral-200",
}) => {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Node body */}
      <rect
        x="6"
        y="6"
        width="52"
        height="36"
        rx="6"
        // fill="currentColor"
        // opacity="0.15"
        // stroke="currentColor"
        className="fill-neutral-900 stroke-neutral-600"
        strokeWidth="2"
      />

      {/* Right */}
      <circle cx="58" cy="24" r="4" fill="currentColor" />
    </svg>
  );
};
export const DoubleHandleNodeRLIcon: React.FC<InputNodeIconProps> = ({
  className = "w-6 h-6 text-neutral-200",
}) => {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Node body */}
      <rect
        x="6"
        y="6"
        width="52"
        height="36"
        rx="6"
        // fill="currentColor"
        // opacity="0.15"
        // stroke="currentColor"
        className="fill-neutral-900 stroke-neutral-600"
        strokeWidth="2"
      />
      {/* Left */}
      <circle cx="6" cy="24" r="4" fill="currentColor" />

      {/* Right */}
      <circle cx="58" cy="24" r="4" fill="currentColor" />
    </svg>
  );
};