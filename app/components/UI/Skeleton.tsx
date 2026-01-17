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
  const baseStyles = 'bg-dashboard-card-border/40';

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
    <div className={`space-y-4 p-4 rounded-xl border border-dashboard-card-border bg-dashboard-card ${className}`}>
      <div className="flex items-center gap-3">
        <Skeleton height={40} width={40} variant="circular" />
        <div className="flex-1 space-y-2">
          <Skeleton height={14} width="40%" />
          <Skeleton height={10} width="20%" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton height={12} width="100%" />
        <Skeleton height={12} width="90%" />
        <Skeleton height={12} width="75%" />
      </div>
      <div className="flex gap-2 pt-2">
        <Skeleton height={32} width={80} variant="rectangular" />
        <Skeleton height={32} width={100} variant="rectangular" />
      </div>
    </div>
  );
}
