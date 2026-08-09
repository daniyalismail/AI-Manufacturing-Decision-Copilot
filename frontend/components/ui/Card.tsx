"use client";
import React from 'react';
import { cn } from '../../lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'white' | 'dark' | 'sandstone' | 'grass';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'white', children, ...props }, ref) => {
    const variants = {
      white: 'bg-pure-white text-ink-black border border-hairline-mist card-shadow',
      dark: 'bg-ink-black text-pure-white border border-ink-black',
      sandstone: 'bg-sandstone/40 text-ink-black border border-sandstone',
      grass: 'bg-fresh-grass/15 text-ink-black border border-fresh-grass/30',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-[28px] p-6 md:p-8 transition-all duration-200',
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
