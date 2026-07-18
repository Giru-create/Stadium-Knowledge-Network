import React, { forwardRef } from 'react';

/**
 * Accessible and memoized button component.
 * Supports forwardRef for integration with forms and ARIA attributes for accessibility.
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'emerald' | 'rose' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  className?: string;
}

const _Button = (
  {
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    className = '',
    disabled,
    ...props
  }: ButtonProps,
  ref: React.Ref<HTMLButtonElement>
) => {
  const baseStyle =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] cursor-pointer';

  let variantStyle = '';
  switch (variant) {
    case 'primary':
      variantStyle =
        'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/20 border border-indigo-400/20';
      break;
    case 'secondary':
      variantStyle = 'bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200';
      break;
    case 'emerald':
      variantStyle = 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/10 border border-emerald-400/20';
      break;
    case 'rose':
      variantStyle = 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-500/10 border border-rose-400/20';
      break;
    case 'ghost':
      variantStyle = 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40';
      break;
  }

  let sizeStyle = '';
  switch (size) {
    case 'sm':
      sizeStyle = 'px-3 py-1.5 text-xs';
      break;
    case 'md':
      sizeStyle = 'px-4 py-2 text-sm';
      break;
    case 'lg':
      sizeStyle = 'px-6 py-3 text-base';
      break;
  }

  return (
    <button
      ref={ref}
      className={`${baseStyle} ${variantStyle} ${sizeStyle} ${className}`}
      disabled={loading || disabled}
      aria-disabled={loading || disabled}
      {...props}
    >
      {loading && (
        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-transparent" aria-hidden="true" />
      )}
      {children}
    </button>
  );
};

/**
 * Exported memoized component for performance.
 */
export const Button = React.memo(forwardRef(_Button));
