import { ReactNode } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ContentCardProps {
  children: ReactNode;
  className?: string;
}

export function ContentCard({ children, className }: ContentCardProps) {
  return (
    <div className={cn(
      "bg-pure-white rounded-[50px] p-[var(--spacing-20)]",
      className
    )}>
      {children}
    </div>
  );
}

export function ActionCard({ children, className }: ContentCardProps) {
  return (
    <div className={cn(
      "bg-pure-white rounded-[50px] p-[var(--spacing-20)] border border-hairline-mist hover:border-sky-pop transition-colors cursor-pointer",
      className
    )}>
      {children}
    </div>
  );
}
