import React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'action' | 'navToggle' | 'ghost' | 'dark' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', children, disabled, ...props }, ref) => {
    const variants = {
      default: 'bg-pure-white text-ink-black hover:bg-sandstone border border-hairline-mist card-shadow',
      action: 'bg-coral-pop text-pure-white hover:bg-coral-pop/90 font-medium',
      navToggle: 'bg-fresh-grass text-ink-black hover:bg-fresh-grass/90 font-medium',
      ghost: 'bg-transparent text-ink-black hover:bg-sandstone/60',
      dark: 'bg-ink-black text-pure-white hover:bg-pure-ink',
      outline: 'bg-transparent border border-ink-black text-ink-black hover:bg-ink-black/5',
    };

    const sizes = {
      sm: 'h-9 px-4 text-[13px]',
      md: 'h-11 px-6 text-[15px]',
      lg: 'h-13 px-8 text-[16px]',
      icon: 'h-10 w-10 p-0 flex items-center justify-center',
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ink-black/20 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
