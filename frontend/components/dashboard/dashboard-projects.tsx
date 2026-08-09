"use client";

import { useProjects } from "@/hooks/useProjects";
import { ActionCard, ContentCard } from "@/components/ui/ContentCard";
import { FileText, Clock, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export function DashboardProjects() {
  const { data: projects, isLoading, isError, error } = useProjects();

  if (isLoading) {
    return (
      <ContentCard>
        <h2 className="text-[30px] font-medium text-ink-black mb-6 leading-[1.2]">
          Recent Projects
        </h2>
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex items-center justify-between p-4 border border-hairline-mist rounded-[10px]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-sandstone rounded-full"></div>
                <div className="space-y-2">
                  <div className="w-48 h-5 bg-sandstone rounded"></div>
                  <div className="w-24 h-4 bg-cream-paper rounded"></div>
                </div>
              </div>
              <div className="w-10 h-10 bg-sandstone rounded-full"></div>
            </div>
          ))}
        </div>
      </ContentCard>
    );
  }

  if (isError) {
    return (
      <ContentCard className="border-l-4 border-coral-pop">
        <div className="flex items-start gap-4">
          <AlertCircle className="text-coral-pop mt-1" size={24} />
          <div>
            <h2 className="text-[30px] font-medium text-ink-black mb-2 leading-[1.2]">
              Failed to load projects
            </h2>
            <p className="text-[18px] text-stone-gray">
              {error instanceof Error ? error.message : "Could not connect to the API."}
            </p>
          </div>
        </div>
      </ContentCard>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <ContentCard className="text-center py-16">
        <div className="w-20 h-20 bg-cream-paper rounded-full flex items-center justify-center mx-auto mb-6">
          <FileText className="text-stone-gray" size={32} />
        </div>
        <h2 className="text-[30px] font-medium text-ink-black mb-4 leading-[1.2]">
          No projects yet
        </h2>
        <p className="text-[18px] text-stone-gray max-w-md mx-auto mb-8">
          Create a new project to start analyzing suppliers, extracting constraints, and making deterministic recommendations.
        </p>
        <Link 
          href="/projects/new"
          className="inline-flex items-center gap-3 bg-pure-white border border-hairline-mist hover:border-sky-pop text-ink-black rounded-full px-6 py-3 text-[15px] font-medium transition-colors shadow-sm"
        >
          Create Project
          <div className="w-6 h-6 rounded-full bg-sky-pop flex items-center justify-center text-pure-white">
            <ArrowRight size={14} strokeWidth={3} />
          </div>
        </Link>
      </ContentCard>
    );
  }

  return (
    <ContentCard>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[30px] font-medium text-ink-black leading-[1.2]">
          Recent Projects
        </h2>
        <span className="text-[15px] text-stone-gray bg-cream-paper px-3 py-1 rounded-full">
          {projects.length} Total
        </span>
      </div>
      
      <div className="flex flex-col gap-4">
        {projects.map((project) => (
          <Link key={project.id} href={`/projects/${project.id}`}>
            <ActionCard className="flex items-center justify-between p-4 group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-cream-paper group-hover:bg-sky-pop group-hover:text-white transition-colors rounded-full flex items-center justify-center text-ink-black">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="text-[20px] font-medium text-ink-black tracking-tight">
                    {project.title || "Untitled Project"}
                  </h3>
                  <div className="flex items-center gap-2 text-[15px] text-stone-gray mt-1">
                    <Clock size={14} />
                    <span>{project.created_at ? new Date(project.created_at).toLocaleDateString() : "Just now"}</span>
                  </div>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full border border-hairline-mist flex items-center justify-center group-hover:border-sky-pop transition-colors text-stone-gray group-hover:text-sky-pop">
                <ArrowRight size={16} />
              </div>
            </ActionCard>
          </Link>
        ))}
      </div>
    </ContentCard>
  );
}
