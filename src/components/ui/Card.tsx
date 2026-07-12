import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'emerald' | 'rose' | 'simple';
  className?: string;
}

export function Card({ children, variant = 'default', className = '', ...props }: CardProps) {
  let variantClass = 'glass-panel';
  
  if (variant === 'emerald') {
    variantClass = 'glass-panel glass-panel-emerald';
  } else if (variant === 'rose') {
    variantClass = 'glass-panel glass-panel-rose';
  } else if (variant === 'simple') {
    variantClass = 'glass-card p-6';
  }

  return (
    <div 
      className={`${variantClass} rounded-2xl p-6 transition-all duration-300 ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`mb-4 flex items-center justify-between ${className}`} {...props}>{children}</div>;
}

export function CardTitle({ children, className = '', ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={`text-lg font-semibold tracking-wide text-slate-100 ${className}`} {...props}>{children}</h3>;
}

export function CardDescription({ children, className = '', ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={`text-sm text-slate-400 leading-relaxed ${className}`} {...props}>{children}</p>;
}

export function CardContent({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`${className}`} {...props}>{children}</div>;
}

export function CardFooter({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`mt-6 flex items-center justify-between border-t border-slate-800/40 pt-4 ${className}`} {...props}>{children}</div>;
}
