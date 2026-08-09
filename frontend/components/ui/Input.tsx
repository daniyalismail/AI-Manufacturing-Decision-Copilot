"use client";
import React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, type = 'text', ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-[14px] font-medium text-ink-black/90">
            {label}
          </label>
        )}
        <input
          type={type}
          ref={ref}
          className={cn(
            'w-full h-11 px-4 rounded-[12px] border border-hairline-mist bg-pure-white text-[15px] text-ink-black placeholder:text-stone-gray/70 focus:outline-none focus:ring-2 focus:ring-ink-black/20 focus:border-ink-black transition-all duration-150',
            error && 'border-coral-pop focus:ring-coral-pop/20 focus:border-coral-pop',
            className
          )}
          {...props}
        />
        {error && <p className="text-[13px] text-coral-pop font-medium">{error}</p>}
        {helperText && !error && <p className="text-[13px] text-stone-gray">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, rows = 4, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-[14px] font-medium text-ink-black/90">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          rows={rows}
          className={cn(
            'w-full p-4 rounded-[12px] border border-hairline-mist bg-pure-white text-[15px] text-ink-black placeholder:text-stone-gray/70 focus:outline-none focus:ring-2 focus:ring-ink-black/20 focus:border-ink-black transition-all duration-150 resize-none',
            error && 'border-coral-pop focus:ring-coral-pop/20 focus:border-coral-pop',
            className
          )}
          {...props}
        />
        {error && <p className="text-[13px] text-coral-pop font-medium">{error}</p>}
        {helperText && !error && <p className="text-[13px] text-stone-gray">{helperText}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
