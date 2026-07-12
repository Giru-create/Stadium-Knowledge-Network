import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral' | 'info';
  className?: string;
}

export function Badge({ children, variant = 'neutral', className = '' }: BadgeProps) {
  let badgeStyle = '';
  
  switch (variant) {
    case 'primary':
      badgeStyle = 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20';
      break;
    case 'success':
      badgeStyle = 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20';
      break;
    case 'warning':
      badgeStyle = 'bg-amber-500/10 text-amber-300 border border-amber-500/20';
      break;
    case 'danger':
      badgeStyle = 'bg-rose-500/10 text-rose-300 border border-rose-500/20';
      break;
    case 'info':
      badgeStyle = 'bg-sky-500/10 text-sky-300 border border-sky-500/20';
      break;
    case 'neutral':
      badgeStyle = 'bg-slate-800 text-slate-300 border border-slate-700/60';
      break;
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold tracking-wide border ${badgeStyle} ${className}`}>
      {children}
    </span>
  );
}
