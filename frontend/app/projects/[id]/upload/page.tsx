"use client";

import { use, useState } from "react";
import { DocumentUploader } from "@/components/upload/DocumentUploader";
import { ContentCard } from "@/components/ui/ContentCard";
import { ArrowRight, Loader2, Play } from "lucide-react";
import { useStartAnalysis } from "@/hooks/useUpload";
import { useRouter } from "next/navigation";

export default function UploadPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.id;
  const router = useRouter();
  
  const [hasUploadedFiles, setHasUploadedFiles] = useState(false);
  const { mutate: startAnalysis, isPending: isAnalyzing, error: analyzeError } = useStartAnalysis(projectId);

  const handleStartAnalysis = () => {
    startAnalysis(undefined, {
      onSuccess: () => {
        router.push(`/projects/${projectId}/analysis`);
      }
    });
  };

  return (
    <div className="flex flex-col items-center pt-12 max-w-4xl mx-auto w-full">
      <div className="w-full text-center mb-[60px]">
        <h1 className="text-[53px] font-medium text-ink-black tracking-tight leading-tight mb-4">
          Upload Documents
        </h1>
        <p className="text-[18px] text-stone-gray max-w-2xl mx-auto">
          Feed the AI. Upload supplier specifications, requirements, pricing sheets, and historical contracts for project {projectId}.
        </p>
      </div>

      <div className="w-full mb-8">
        <DocumentUploader 
          projectId={projectId} 
          onAllComplete={() => setHasUploadedFiles(true)} 
        />
      </div>

      {hasUploadedFiles && (
        <ContentCard className="w-full flex items-center justify-between border-2 border-[var(--color-fresh-grass)] bg-fresh-grass/5">
          <div>
            <h3 className="text-[20px] font-medium text-ink-black mb-1">
              Ready for Analysis
            </h3>
            <p className="text-[15px] text-stone-gray">
              All documents successfully uploaded. Begin extracting constraints.
            </p>
            {analyzeError && (
              <p className="text-sm text-coral-pop mt-2">
                {analyzeError.message}
              </p>
            )}
          </div>
          
          <button
            onClick={handleStartAnalysis}
            disabled={isAnalyzing}
            className="flex items-center gap-3 bg-fresh-grass hover:brightness-110 disabled:opacity-50 text-ink-black rounded-full px-8 py-4 text-[18px] font-medium transition-all shadow-sm active:scale-95"
          >
            {isAnalyzing ? "Starting Engine..." : "Start AI Analysis"}
            {isAnalyzing ? (
              <Loader2 size={20} strokeWidth={3} className="animate-spin" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-pure-white flex items-center justify-center text-ink-black">
                <Play size={18} strokeWidth={3} className="ml-1" />
              </div>
            )}
          </button>
        </ContentCard>
      )}
    </div>
  );
}
