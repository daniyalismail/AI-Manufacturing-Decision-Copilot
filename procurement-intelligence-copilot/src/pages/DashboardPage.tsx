import React from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useAppStore } from '../store/useAppStore';
import {
  ArrowRight,
  Sparkles,
  FileText,
  Clock,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Plus,
  Zap,
} from 'lucide-react';

interface DashboardPageProps {
  onNavigate: (path: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { projects, userProfile } = useAppStore();

  const topProject = projects[0];

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="text-[13px] font-bold text-stone-gray uppercase tracking-wider mb-1">
            Welcome back, {userProfile.name}
          </div>
          <h1 className="text-[40px] sm:text-[52px] font-bold tracking-tight text-ink-black leading-tight">
            Procurement Overview
          </h1>
          <p className="text-[16px] text-stone-gray font-medium mt-1">
            Real-time status of active sourcing evaluations, constraints, and recommendations.
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="action" onClick={() => onNavigate('/projects/new')} className="gap-2">
            <Plus className="w-4 h-4" />
            New Sourcing Project
          </Button>
        </div>
      </div>

      {/* Hero Stats Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Active Projects', val: projects.length.toString(), sub: '2 awaiting analysis', icon: FileText, color: 'text-sky-pop' },
          { label: 'Suppliers Evaluated', val: '12', sub: 'across 4 categories', icon: ShieldCheck, color: 'text-fresh-grass' },
          { label: 'Avg Lead Time Saved', val: '10 days', sub: 'vs manual review', icon: Clock, color: 'text-coral-pop' },
          { label: 'Estimated Savings', val: '$14,200', sub: 'commercial optimization', icon: TrendingUp, color: 'text-pure-ink' },
        ].map((stat, idx) => (
          <Card key={idx} className="flex flex-col justify-between space-y-4 hover:scale-[1.01] transition-transform">
            <div className="flex justify-between items-center">
              <span className="text-[13px] font-bold text-stone-gray uppercase tracking-wider">{stat.label}</span>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <div className="text-[40px] font-extrabold text-ink-black tracking-tight leading-none mb-1">
                {stat.val}
              </div>
              <div className="text-[12px] text-stone-gray font-medium">{stat.sub}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Featured AI Recommendation Highlight */}
      {topProject && (
        <Card className="bg-ink-black text-pure-white p-8 md:p-10 relative overflow-hidden card-shadow">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-fresh-grass text-ink-black text-[12px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 fill-ink-black" />
                  Latest AI Recommendation
                </span>
                <span className="text-[13px] text-sandstone/80 font-medium">
                  {topProject.name}
                </span>
              </div>

              <h2 className="text-[32px] font-bold tracking-tight text-pure-white leading-tight">
                Recommended Winner: Vertex Manufacturing (Score 91/100)
              </h2>

              <p className="text-[15px] text-pure-white/80 leading-relaxed font-normal">
                Satisfies 100% of mandatory constraints (ISO9001 certified, MOQ &lt;= 1,000 units) with guaranteed 15-day delivery window.
              </p>
            </div>

            <Button
              variant="action"
              size="lg"
              onClick={() => onNavigate(`/projects/${topProject.id}`)}
              className="gap-2 shrink-0 text-[15px] font-bold shadow-lg"
            >
              <span>Open Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* Recent Projects Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-[28px] font-bold text-ink-black tracking-tight">
              Recent Sourcing Projects
            </h2>
            <p className="text-[14px] text-stone-gray font-medium">
              Select a project to inspect uploaded quotes, constraint matrices, and AI chat.
            </p>
          </div>
          <Button variant="ghost" onClick={() => onNavigate('/projects')} className="gap-1 text-[14px]">
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((proj) => (
            <Card key={proj.id} className="flex flex-col justify-between space-y-6 hover:border-ink-black/40 transition-colors">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Badge status={proj.status}>{proj.status}</Badge>
                  <span className="text-[13px] text-stone-gray font-medium">{proj.date}</span>
                </div>

                <h3 className="text-[24px] font-bold text-ink-black leading-tight">
                  {proj.name}
                </h3>

                <p className="text-[14px] text-stone-gray line-clamp-2 leading-relaxed font-normal">
                  {proj.description}
                </p>
              </div>

              <div className="pt-4 border-t border-hairline-mist flex justify-between items-center text-[13px] text-stone-gray font-medium">
                <div className="flex items-center gap-3">
                  <span>{proj.documents.length} Files</span>
                  <span>•</span>
                  <span>{proj.suppliers.length} Vendors</span>
                </div>

                <Button
                  variant="default"
                  size="sm"
                  onClick={() => onNavigate(`/projects/${proj.id}`)}
                  className="gap-1 text-[13px] font-bold"
                >
                  <span>Open</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
