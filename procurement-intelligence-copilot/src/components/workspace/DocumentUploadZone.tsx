import React, { useState } from 'react';
import { UploadCloud, FileText, Trash2, CheckCircle2, AlertCircle, FilePlus, Sparkles } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ProjectDocument } from '../../types';

interface DocumentUploadZoneProps {
  documents: ProjectDocument[];
  onUploadCompleted: (newDocs: ProjectDocument[]) => void;
  onStartAnalysis: () => void;
}

export const DocumentUploadZone: React.FC<DocumentUploadZoneProps> = ({
  documents,
  onUploadCompleted,
  onStartAnalysis,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [localDocs, setLocalDocs] = useState<ProjectDocument[]>(documents);
  const [isSimulatingUpload, setIsSimulatingUpload] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const simulateFileUpload = (fileNames: string[]) => {
    setIsSimulatingUpload(true);
    setUploadProgress(15);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSimulatingUpload(false);
          const newDocs: ProjectDocument[] = fileNames.map((name, i) => ({
            id: `doc-${Date.now()}-${i}`,
            name,
            size: `${(Math.random() * 2 + 1).toFixed(1)} MB`,
            type: name.endsWith('.xlsx') ? 'XLSX' : 'PDF',
            uploadedAt: new Date().toISOString().split('T')[0],
            status: 'Ready',
            pagesCount: Math.floor(Math.random() * 15 + 5),
          }));
          const updated = [...localDocs, ...newDocs];
          setLocalDocs(updated);
          onUploadCompleted(updated);
          return 100;
        }
        return prev + 25;
      });
    }, 300);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const names = Array.from(e.dataTransfer.files).map((f: File) => f.name);
      simulateFileUpload(names);
    }
  };

  const handleBrowse = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const names = Array.from(e.target.files).map((f: File) => f.name);
      simulateFileUpload(names);
    }
  };

  const handleRemove = (id: string) => {
    const updated = localDocs.filter((d) => d.id !== id);
    setLocalDocs(updated);
  };

  return (
    <div className="space-y-8">
      {/* Drag & Drop Area */}
      <Card
        className={`relative flex flex-col items-center justify-center p-8 md:p-14 text-center border-2 border-dashed transition-all duration-200 ${
          dragActive
            ? 'border-sky-pop bg-sky-pop/5'
            : 'border-hairline-mist hover:border-ink-black/40 bg-pure-white'
        }`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload-input"
          multiple
          accept=".pdf,.docx,.xlsx,.png,.jpg,.jpeg"
          className="hidden"
          onChange={handleBrowse}
        />

        <div className="w-16 h-16 rounded-full bg-sky-pop/15 flex items-center justify-center mb-5 text-sky-pop">
          <UploadCloud className="w-8 h-8" />
        </div>

        <h3 className="text-[24px] font-bold text-ink-black tracking-tight mb-2">
          Upload Procurement Documents
        </h3>
        <p className="text-[15px] text-stone-gray max-w-lg mb-6 leading-relaxed">
          Drag and drop RFP specification files, supplier quotes, commercial terms, or ISO quality certificates (PDF, DOCX, XLSX).
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <label htmlFor="file-upload-input">
            <Button variant="default" className="cursor-pointer gap-2">
              <FilePlus className="w-4 h-4" />
              Browse Files
            </Button>
          </label>
          <Button
            variant="ghost"
            onClick={() =>
              simulateFileUpload([
                'Motor_Housing_RFP_Specification.pdf',
                'Vertex_Manufacturing_Commercial_Quote_v2.pdf',
                'Apex_Industrial_Terms_2026.pdf',
                'Nova_Components_Company_Profile.pdf',
              ])
            }
            className="text-[13px] text-stone-gray hover:text-ink-black underline"
          >
            Load Sample RFP Packet
          </Button>
        </div>

        {/* Upload Progress Bar */}
        {isSimulatingUpload && (
          <div className="w-full max-w-md mt-6 space-y-2">
            <div className="flex justify-between text-[13px] font-medium text-ink-black">
              <span>Ingesting & Validating Files...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full h-2.5 bg-sandstone rounded-full overflow-hidden">
              <div
                className="h-full bg-sky-pop rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
      </Card>

      {/* Uploaded Files Listing */}
      {localDocs.length > 0 && (
        <Card className="space-y-6">
          <div className="flex justify-between items-center border-b border-hairline-mist pb-4">
            <div>
              <h4 className="text-[20px] font-bold text-ink-black">
                Uploaded Documents ({localDocs.length})
              </h4>
              <p className="text-[13px] text-stone-gray font-medium">
                Ready for AI constraint extraction and knowledge graph modeling.
              </p>
            </div>
            <Badge status="PASS">{localDocs.length} Ready</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {localDocs.map((doc) => (
              <div
                key={doc.id}
                className="p-4 rounded-[16px] bg-sandstone/30 border border-sandstone flex items-center justify-between gap-4 group hover:bg-sandstone/50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-[10px] bg-pure-white flex items-center justify-center shrink-0 border border-hairline-mist text-ink-black">
                    <FileText className="w-5 h-5 text-sky-pop" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[15px] font-bold text-ink-black truncate">
                      {doc.name}
                    </div>
                    <div className="text-[12px] text-stone-gray font-medium flex items-center gap-2">
                      <span>{doc.size}</span>
                      <span>•</span>
                      <span>{doc.pagesCount || 10} pages</span>
                      <span>•</span>
                      <span className="text-fresh-grass font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Ready
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleRemove(doc.id)}
                  className="p-2 rounded-full text-stone-gray hover:text-coral-pop hover:bg-pure-white transition-colors cursor-pointer"
                  title="Remove Document"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Primary Action Button */}
          <div className="pt-4 flex justify-end">
            <Button
              variant="action"
              size="lg"
              onClick={onStartAnalysis}
              className="gap-2 shadow-lg"
            >
              <Sparkles className="w-5 h-5" />
              Start AI Sourcing Analysis
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
