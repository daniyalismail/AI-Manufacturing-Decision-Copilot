import { HeroBlock } from "@/components/ui/HeroBlock";
import { ContentCard } from "@/components/ui/ContentCard";
import { DashboardProjects } from "@/components/dashboard/dashboard-projects";
import { Activity, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* Green Hero Section */}
      <section className="w-full bg-fresh-grass pt-8 pb-32 flex flex-col items-center text-center relative overflow-hidden -mt-[88px] pt-[120px]">
        <h1 className="text-fluid-hero font-medium text-ink-black max-w-5xl mb-6 relative z-10 px-4">
          Procurement, <br/>
          meet clarity.
        </h1>
        
        <p className="text-[20px] md:text-[24px] text-ink-black max-w-2xl mb-10 leading-[1.25] relative z-10 font-medium px-4">
          Your intelligent copilot for analyzing suppliers, validating constraints, and making data-backed decisions instantly.
        </p>

        <Link 
          href="/login"
          className="relative z-10 flex items-center gap-3 bg-pure-white border border-transparent hover:border-ink-black text-ink-black rounded-full pl-6 pr-2 py-2 text-[18px] font-medium transition-all shadow-sm group mb-20"
        >
          Start Analysis
          <div className="w-10 h-10 rounded-full bg-sky-pop flex items-center justify-center text-white group-hover:scale-105 transition-transform">
            <ArrowRight size={20} strokeWidth={2.5} />
          </div>
        </Link>
        
        {/* Illustration overlapping the sections */}
        <div className="absolute bottom-[-100px] left-1/2 transform -translate-x-1/2 w-full max-w-[800px] z-20 pointer-events-none">
          <Image 
            src="/hero-illustration.png" 
            alt="Team pointing forward" 
            width={800} 
            height={400} 
            className="w-full h-auto object-contain drop-shadow-xl"
            priority
          />
        </div>
      </section>

      {/* Cream Canvas Section */}
      <section className="w-full bg-cream-paper pt-40 pb-24 flex flex-col items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 w-full max-w-[1200px] px-4">
          <DashboardProjects />

          <div className="flex flex-col gap-5">
            <ContentCard className="bg-sunshine-pop border-none shadow-sm">
              <h2 className="text-[30px] font-medium text-ink-black mb-2 leading-[1.2]">
                System Active
              </h2>
              <p className="text-[18px] text-ink-black opacity-80 leading-[1.5]">
                The AI Procurement Engine is online and ready to process new quotes.
              </p>
            </ContentCard>

            <ContentCard className="flex-1 flex flex-col shadow-sm">
              <h2 className="text-[30px] font-medium text-ink-black mb-6 leading-[1.2]">
                Active Processing
              </h2>
              <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 bg-cream-paper rounded-[20px] flex items-center justify-center mb-4">
                  <Activity className="text-stone-gray" size={32} strokeWidth={1.5} />
                </div>
                <p className="text-[18px] text-stone-gray max-w-[250px] leading-[1.5]">
                  No active analysis jobs running right now.
                </p>
              </div>
            </ContentCard>
          </div>
        </div>
      </section>
    </div>
  );
}
