"use client";
import React from 'react';
import { cn } from '../../lib/utils';
import { ConstraintStatus, SupplierQualification } from '../../types';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status?: ConstraintStatus | SupplierQualification | 'Draft' | 'Processing' | 'Analyzed' | 'default';
}

export const Badge: React.FC<BadgeProps> = ({ className, children, status = 'default', ...props }) => {
  const statusStyles: Record<string, string> = {
    PASS: 'bg-fresh-grass/25 text-pure-ink border border-fresh-grass/40',
    QUALIFIED: 'bg-fresh-grass/25 text-pure-ink border border-fresh-grass/40',
    FAIL: 'bg-coral-pop/25 text-pure-ink border border-coral-pop/40',
    REJECTED: 'bg-coral-pop/25 text-pure-ink border border-coral-pop/40',
    WARNING: 'bg-sunshine-pop/50 text-pure-ink border border-sunshine-pop/60',
    CONDITIONALLY_QUALIFIED: 'bg-sunshine-pop/50 text-pure-ink border border-sunshine-pop/60',
    UNKNOWN: 'bg-stone-gray/20 text-ink-black border border-stone-gray/30',
    Draft: 'bg-sandstone text-ink-black border border-hairline-mist',
    Processing: 'bg-sky-pop/20 text-pure-ink border border-sky-pop/40 animate-pulse',
    Analyzed: 'bg-fresh-grass/25 text-pure-ink border border-fresh-grass/40',
    default: 'bg-sandstone/70 text-ink-black border border-hairline-mist',
  };

  return (
    <span
      className={cn(
        'px-3 py-1 rounded-[10px] text-[13px] font-semibold tracking-wide inline-flex items-center gap-1.5 select-none',
        statusStyles[status] || statusStyles.default,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
