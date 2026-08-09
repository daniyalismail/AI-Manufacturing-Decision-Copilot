"use client";

import { useProjects } from "@/hooks/useProjects";
import { ActionCard, ContentCard } from "@/components/ui/ContentCard";
import { FileText, Clock, AlertCircle, ArrowRight, Plus } from "lucide-react";
import Link from "next/link";

export default function ProjectsPage() {
  const { data: projects, isLoading, isError, error } = useProjects();

  return (
    <div className="flex flex-col pt-12">
      <div className="flex items-center justify-between mb-[60px]">
        <h1 className="text-[30px] md:text-[53px] font-medium text-ink-black tracking-[-2.12px] leading-[1.15]">
          All Projects
        </h1>
        <Link 
          href="/projects/new"
          className="flex items-center gap-3 bg-pure-white hover:bg-sandstone text-ink-black rounded-full px-6 py-3 text-[18px] font-medium transition-colors shadow-sm"
        >
          New Project
          <div className="w-6 h-6 rounded-full bg-sky-pop flex items-center justify-center text-pure-white">
            <Plus size={16} strokeWidth={3} />
          </div>
        </Link>
      </div>

      <div className="w-full">
        {isLoading ? (
          <ContentCard>
            <div className="flex flex-col gap-4">
              {[1, 2, 3, 4, 5].map((i) => (
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
        ) : isError ? (
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
        ) : !projects || projects.length === 0 ? (
          <ContentCard className="text-center py-24">
            <div className="w-24 h-24 bg-cream-paper rounded-full flex items-center justify-center mx-auto mb-8">
              <FileText className="text-stone-gray" size={40} />
            </div>
            <h2 className="text-[30px] font-medium text-ink-black mb-4 leading-[1.2]">
              No projects found
            </h2>
            <p className="text-[18px] text-stone-gray max-w-md mx-auto mb-8">
              Start by creating a new procurement intelligence project to process documents.
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
        ) : (
          <ContentCard>
            <div className="flex flex-col gap-4">
              {projects.map((project: any) => (
                <Link key={project.id || project.project_id} href={`/projects/${project.id || project.project_id}`}>
                  <ActionCard className="flex items-center justify-between p-5 group">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-cream-paper group-hover:bg-sky-pop group-hover:text-white transition-colors rounded-full flex items-center justify-center text-ink-black">
                        <FileText size={24} />
                      </div>
                      <div>
                        <h3 className="text-[30px] font-medium text-ink-black tracking-tight leading-tight mb-1">
                          {project.title || "Untitled Project"}
                        </h3>
                        {project.description && (
                          <p className="text-[15px] text-stone-gray line-clamp-1 mb-2">
                            {project.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-[15px] text-stone-gray font-medium">
                          <Clock size={14} />
                          <span>{project.created_at ? new Date(project.created_at).toLocaleDateString() : "Just now"}</span>
                          <span className="mx-2 opacity-50">•</span>
                          <span className="px-3 py-1 bg-cream-paper rounded-full text-ink-black">
                            {project.status || "Setup"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-full border border-hairline-mist flex items-center justify-center group-hover:border-sky-pop transition-colors text-stone-gray group-hover:text-sky-pop bg-pure-white">
                      <ArrowRight size={20} strokeWidth={2} />
                    </div>
                  </ActionCard>
                </Link>
              ))}
            </div>
          </ContentCard>
        )}
      </div>
    </div>
  );
}
