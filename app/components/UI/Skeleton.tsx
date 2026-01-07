import React from "react";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  height?: number | string;
  width?: number | string;
  variant?: 'text' | 'rectangular' | 'circular';
  animation?: 'pulse' | 'wave' | 'none';
  className?: string;
}

export function Skeleton({
  height = 20,
  width = "100%",
  variant = 'rectangular',
  animation = 'pulse',
  className = "",
  ...props
}: SkeletonProps) {
  const baseStyles = 'bg-gradient-to-r from-decom-bg-light to-decom-bg-light/50';

  const variantStyles = {
    text: 'rounded-sm',
    rectangular: 'rounded-md',
    circular: 'rounded-full'
  };

  const animationStyles = {
    pulse: 'animate-pulse',
    wave: 'animate-pulse-slow',
    none: ''
  };

  const heightClass = typeof height === "number" ? `h-${height}` : `h-[${height}]`;
  const widthClass = typeof width === "number" ? `w-${width}` : `w-[${width}]`;

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${animationStyles[animation]} ${className}`}
      style={{
        height: typeof height === "number" ? `${height}px` : height,
        width: typeof width === "number" ? `${width}px` : width,
      }}
      {...props}
    />
  );
}

// Skeleton components for common use cases
export function SkeletonText({ lines = 1, className = "" }: { lines?: number; className?: string }) {
  if (lines === 1) {
    return <Skeleton height={16} width="100%" variant="text" className={className} />;
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton
          key={i}
          height={16}
          width={i === lines - 1 ? "75%" : "100%"}
          variant="text"
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={`space-y-3 ${className}`}>
      <Skeleton height={20} width="75%" variant="text" />
      <Skeleton height={16} width="100%" variant="text" />
      <div className="flex gap-2">
        <Skeleton height={24} width={80} />
        <Skeleton height={24} width={100} />
      </div>
    </div>
  );
}
