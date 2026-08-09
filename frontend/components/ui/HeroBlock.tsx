import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface HeroBlockProps {
  headline: string;
  subheadline: string;
  ctaText?: string;
  ctaHref?: string;
}

export function HeroBlock({ headline, subheadline, ctaText, ctaHref }: HeroBlockProps) {
  return (
    <section className="w-full pt-[60px] pb-[136px] flex flex-col items-center text-center">
      <h1 
        className="text-[81px] md:text-[140px] font-medium text-ink-black tracking-[-4.86px] md:tracking-[-8.4px] leading-[1.2] md:leading-[0.95] max-w-4xl mb-5"
      >
        {headline}
      </h1>
      
      <p className="text-[20px] text-ink-black max-w-2xl mb-[60px] leading-[1.25]">
        {subheadline}
      </p>

      {ctaText && ctaHref && (
        <Link 
          href={ctaHref}
          className="flex items-center gap-3 bg-pure-white hover:bg-sandstone text-ink-black rounded-full px-6 py-3 text-[18px] font-medium transition-colors shadow-sm"
        >
          {ctaText}
          <div className="w-6 h-6 rounded-full bg-fresh-grass flex items-center justify-center text-ink-black">
            <ArrowRight size={16} strokeWidth={3} />
          </div>
        </Link>
      )}
    </section>
  );
}
