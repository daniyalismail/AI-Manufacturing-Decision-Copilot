"use client";

import { useState, useCallback, useRef } from "react";
import { useUploadDocument } from "@/hooks/useUpload";
import { UploadCloud, FileText, CheckCircle, XCircle, AlertCircle, Loader2, X } from "lucide-react";
import { clsx } from "clsx";

export interface FileState {
  id: string;
  file: File;
  status: "pending" | "uploading" | "success" | "error";
  progress: number;
  error?: string;
}

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
const ALLOWED_EXTENSIONS = ["pdf", "doc", "docx", "xls", "xlsx", "txt", "png", "jpg", "jpeg"];

export function DocumentUploader({ projectId, onAllComplete }: { projectId: string, onAllComplete?: () => void }) {
  const [files, setFiles] = useState<FileState[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const uploadMutation = useUploadDocument(projectId);

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) return "File exceeds 25MB limit";
    const ext = file.name.split('.').pop()?.toLowerCase() || "";
    if (!ALLOWED_EXTENSIONS.includes(ext)) return `Unsupported file type (.${ext})`;
    return null;
  };

  const handleFilesAdded = useCallback((newFiles: File[]) => {
    const fileStates = newFiles.map(file => {
      const error = validateFile(file);
      return {
        id: Math.random().toString(36).substring(7),
        file,
        status: error ? "error" : "pending",
        progress: 0,
        error: error || undefined,
      } as FileState;
    });

    setFiles(prev => [...prev, ...fileStates]);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesAdded(Array.from(e.dataTransfer.files));
    }
  }, [handleFilesAdded]);

  const handleUploadAll = async () => {
    const pendingFiles = files.filter(f => f.status === "pending" || f.status === "error");
    if (pendingFiles.length === 0) return;

    let successCount = 0;
    const totalToUpload = pendingFiles.length;

    for (const f of pendingFiles) {
      if (f.error && f.status === "error") continue; // Skip permanently errored validation files

      setFiles(prev => prev.map(p => p.id === f.id ? { ...p, status: "uploading", progress: 50 } : p));
      
      try {
        await uploadMutation.mutateAsync(f.file);
        setFiles(prev => prev.map(p => p.id === f.id ? { ...p, status: "success", progress: 100 } : p));
        successCount++;
      } catch (err: any) {
        setFiles(prev => prev.map(p => p.id === f.id ? { ...p, status: "error", error: err.message || "Upload failed" } : p));
      }
    }

    if (successCount > 0 && onAllComplete) {
      onAllComplete();
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div className="w-full flex flex-col gap-[var(--spacing-20)]">
      {/* Drop Zone */}
      <div 
        className={clsx(
          "relative w-full rounded-[50px] border-2 border-dashed p-12 flex flex-col items-center justify-center text-center transition-colors cursor-pointer",
          isDragging 
            ? "border-sky-pop bg-sky-pop/5" 
            : "border-hairline-mist bg-pure-white hover:border-[var(--color-stone-gray)]"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          multiple 
          ref={fileInputRef} 
          className="hidden" 
          onChange={(e) => {
            if (e.target.files) {
              handleFilesAdded(Array.from(e.target.files));
              e.target.value = ''; // Reset
            }
          }}
        />
        <div className="w-20 h-20 bg-cream-paper rounded-full flex items-center justify-center mb-6">
          <UploadCloud className="text-ink-black" size={32} />
        </div>
        <h3 className="text-[30px] font-medium text-ink-black mb-2 leading-[1.2]">
          Drop supplier documents here
        </h3>
        <p className="text-[18px] text-stone-gray max-w-md">
          Supports PDFs, Word docs, Excel sheets, and images up to 25MB.
        </p>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="bg-pure-white rounded-[50px] p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-[20px] font-medium text-ink-black">
              Ready to process ({files.length})
            </h4>
          </div>
          
          <div className="flex flex-col gap-3">
            {files.map(f => (
              <div key={f.id} className="flex items-center justify-between p-4 bg-cream-paper rounded-[10px] border border-hairline-mist">
                <div className="flex items-center gap-4 flex-1 overflow-hidden">
                  <div className="w-10 h-10 bg-pure-white rounded-full flex items-center justify-center shrink-0">
                    <FileText className="text-ink-black" size={18} />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-[15px] font-medium text-ink-black truncate">
                      {f.file.name}
                    </span>
                    <span className="text-xs text-stone-gray">
                      {(f.file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 pl-4">
                  {f.status === "uploading" && (
                    <div className="flex items-center gap-2 text-sky-pop text-sm font-medium">
                      <Loader2 size={16} className="animate-spin" /> Uploading...
                    </div>
                  )}
                  {f.status === "success" && (
                    <div className="flex items-center gap-2 text-[var(--color-fresh-grass)] text-sm font-medium">
                      <CheckCircle size={16} /> Success
                    </div>
                  )}
                  {f.status === "error" && (
                    <div className="flex items-center gap-2 text-coral-pop text-sm font-medium truncate max-w-[150px]">
                      <AlertCircle size={16} className="shrink-0" /> 
                      <span className="truncate">{f.error}</span>
                    </div>
                  )}

                  {f.status !== "uploading" && f.status !== "success" && (
                    <button 
                      onClick={() => removeFile(f.id)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-stone-gray hover:bg-[var(--color-hairline-mist)] hover:text-ink-black transition-colors"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4 mt-2 border-t border-hairline-mist">
            <button
              onClick={handleUploadAll}
              disabled={files.every(f => f.status === "success") || files.some(f => f.status === "uploading")}
              className="flex items-center gap-3 bg-ink-black disabled:bg-[var(--color-hairline-mist)] disabled:text-stone-gray text-white rounded-full px-6 py-3 text-sm font-medium transition-all shadow-sm active:scale-95"
            >
              Upload {files.filter(f => f.status !== "success").length} Documents
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
