import React from 'react';

/**
 * Simple loading skeleton used throughout the app.
 * Accessible via role="status" and aria-label.
 */
export const LoadingSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    role="status"
    aria-label="Loading"
    className={`animate-pulse bg-slate-700/30 rounded ${className}`}
  />
);
