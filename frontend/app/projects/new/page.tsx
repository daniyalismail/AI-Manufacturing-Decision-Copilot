"use client";

import { ContentCard } from "@/components/ui/ContentCard";
import { useCreateProject } from "@/hooks/useProjects";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";

export default function CreateProjectPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { mutate: createProject, isPending, error } = useCreateProject();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createProject(
      { title, description },
      {
        onSuccess: (data) => {
          // Navigate to upload screen for the newly created project
          router.push(`/projects/${data.project_id}/upload`);
        },
      }
    );
  };

  return (
    <div className="flex flex-col items-center pt-12 max-w-2xl mx-auto w-full">
      <h1 className="text-[53px] font-medium text-ink-black tracking-[-2.12px] leading-[1.15] mb-[60px] text-center">
        Start a new analysis
      </h1>

      <ContentCard className="w-full">
        <form onSubmit={handleSubmit} className="flex flex-col gap-[var(--spacing-20)]">
          
          <div className="flex flex-col gap-2">
            <label htmlFor="title" className="text-[15px] font-medium text-ink-black px-4">
              Project Name
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Motor Housing Procurement"
              disabled={isPending}
              required
              className="w-full bg-cream-paper border border-hairline-mist rounded-full px-6 py-4 text-[18px] text-ink-black placeholder:text-stone-gray focus:outline-none focus:border-[var(--color-fresh-grass)] transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="description" className="text-[15px] font-medium text-ink-black px-4">
              Description (Optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What are you sourcing?"
              disabled={isPending}
              rows={3}
              className="w-full bg-cream-paper border border-hairline-mist rounded-[30px] px-6 py-4 text-[18px] text-ink-black placeholder:text-stone-gray focus:outline-none focus:border-[var(--color-fresh-grass)] transition-colors resize-none"
            />
          </div>

          {error && (
            <div className="bg-cream-paper border border-coral-pop text-coral-pop rounded-full px-6 py-3 text-sm">
              Failed to create project: {error.message}
            </div>
          )}

          <div className="flex justify-end pt-4 mt-2">
            <button
              type="submit"
              disabled={isPending || !title.trim()}
              className="flex items-center gap-3 bg-fresh-grass hover:brightness-110 disabled:opacity-50 disabled:hover:brightness-100 text-ink-black rounded-full px-8 py-4 text-[18px] font-medium transition-all shadow-sm active:scale-95"
            >
              {isPending ? "Creating..." : "Create Project"}
              {isPending ? (
                <Loader2 size={20} strokeWidth={3} className="animate-spin" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-pure-white flex items-center justify-center text-ink-black">
                  <ArrowRight size={18} strokeWidth={3} />
                </div>
              )}
            </button>
          </div>
        </form>
      </ContentCard>
    </div>
  );
}
