import React, { useState, useEffect } from 'react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useAppStore } from '../store/useAppStore';
import { projectService } from '../services/projectService';
import { Project, ProjectStatus } from '../types';

import { DocumentUploadZone } from '../components/workspace/DocumentUploadZone';
import { ProcessingPipeline } from '../components/workspace/ProcessingPipeline';
import { RecommendationCard } from '../components/workspace/RecommendationCard';
import { ConstraintMatrix } from '../components/workspace/ConstraintMatrix';
import { SupplierComparisonTable } from '../components/workspace/SupplierComparisonTable';
import { ScenarioAnalysis } from '../components/workspace/ScenarioAnalysis';
import { CopilotChat } from '../components/workspace/CopilotChat';
import { ProcurementReport } from '../components/workspace/ProcurementReport';

import {
  ArrowLeft,
  FileText,
  Sparkles,
  SlidersHorizontal,
  Bot,
  FileDown,
  CheckCircle2,
  BarChart3,
  Layout,
} from 'lucide-react';

const TABS = [
  { id: 'workspace', label: 'Workspace & Documents' },
  { id: 'analysis', label: 'AI Recommendation' },
  { id: 'comparison', label: 'Supplier Comparison' },
  { id: 'scenario', label: 'Scenario What-If' },
  { id: 'chat', label: 'Copilot Chat' },
  { id: 'report', label: 'Executive Report' },
] as const;

type WorkspaceTabId = typeof TABS[number]['id'];

interface ProjectWorkspacePageProps {
  projectId: string;
  onNavigate: (path: string) => void;
}

export const ProjectWorkspacePage: React.FC<ProjectWorkspacePageProps> = ({ projectId, onNavigate }) => {
  const { activeProject, setActiveProject, projects, setProjects } = useAppStore();
  const [activeTab, setActiveTab] = useState<WorkspaceTabId>('workspace');
  const [projectState, setProjectState] = useState<ProjectStatus>('Draft');

  useEffect(() => {
    projectService.getProjectById(projectId).then((found) => {
      if (found) {
        setActiveProject(found);
        setProjectState(found.status);
        if (found.status === 'Analyzed') {
          setActiveTab('analysis');
        }
      }
    });
  }, [projectId, setActiveProject]);

  if (!activeProject) {
    return (
      <div className="py-24 text-center space-y-4">
        <div className="text-[20px] font-bold text-ink-black">Loading project workspace...</div>
      </div>
    );
  }

  const handleStartAnalysis = async () => {
    setProjectState('Processing');
  };

  const handleProcessingComplete = async () => {
    const updated = await projectService.updateProjectStatus(activeProject.id, 'Analyzed');
    if (updated) {
      setActiveProject(updated);
      setProjectState('Analyzed');
      const updatedList = projects.map((p) => (p.id === updated.id ? updated : p));
      setProjects(updatedList);
    }
    setActiveTab('analysis');
  };

  const isAnalyzed = projectState === 'Analyzed';
  const topSupplier = activeProject.suppliers[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Top Breadcrumb & Title Row */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('/projects')}
            className="gap-1.5 text-[13px] text-stone-gray hover:text-ink-black"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Projects</span>
          </Button>
          <span className="text-stone-gray font-bold">/</span>
          <span className="text-[13px] font-bold text-ink-black truncate">{activeProject.name}</span>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Badge status={projectState}>{projectState}</Badge>
              <span className="text-[13px] font-bold text-stone-gray uppercase tracking-wider">
                {activeProject.category}
              </span>
            </div>
            <h1 className="text-[36px] sm:text-[48px] font-bold tracking-tight text-ink-black leading-none">
              {activeProject.name}
            </h1>
            <p className="text-[15px] text-stone-gray font-medium max-w-3xl">
              {activeProject.description}
            </p>
          </div>

          {/* <div className="flex gap-2 shrink-0">
            {isAnalyzed && (
              <Button
                variant="default"
                size="sm"
                onClick={() => setActiveTab('report')}
                className="gap-1.5 text-[13px]"
              >
                <FileDown className="w-4 h-4 text-sky-pop" />
                <span>Export Report</span>
              </Button>
            )}
          </div> */}
        </div>
      </div>

      {/* Floating Pill Navigation Tabs */}
      <div className="bg-pure-white/90 backdrop-blur-sm p-1.5 rounded-full border border-hairline-mist card-shadow flex items-center gap-1 overflow-x-auto hide-scrollbar">
        {TABS.map((tab) => {
          const isDisabled = !isAnalyzed && tab.id !== 'workspace';
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              disabled={isDisabled}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-full text-[14px] font-bold transition-all whitespace-nowrap cursor-pointer select-none ${
                isDisabled
                  ? 'opacity-40 cursor-not-allowed text-stone-gray'
                  : isActive
                  ? 'bg-ink-black text-pure-white shadow-sm'
                  : 'text-stone-gray hover:text-ink-black hover:bg-sandstone/40'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Tab View Content */}
      <div className="space-y-8">
        {/* TAB 1: WORKSPACE & DOCUMENTS */}
        {activeTab === 'workspace' && (
          <>
            {projectState === 'Processing' ? (
              <ProcessingPipeline onComplete={handleProcessingComplete} />
            ) : (
              <DocumentUploadZone
                documents={activeProject.documents}
                onUploadCompleted={(docs) => {
                  setActiveProject({ ...activeProject, documents: docs });
                }}
                onStartAnalysis={handleStartAnalysis}
              />
            )}
          </>
        )}

        {/* TAB 2: AI RECOMMENDATION */}
        {activeTab === 'analysis' && (
          <div className="space-y-8">
            {topSupplier && <RecommendationCard recommendedSupplier={topSupplier} />}
            <ConstraintMatrix
              constraints={activeProject.constraints}
              suppliers={activeProject.suppliers}
            />
          </div>
        )}

        {/* TAB 3: SUPPLIER COMPARISON TABLE */}
        {activeTab === 'comparison' && (
          <SupplierComparisonTable suppliers={activeProject.suppliers} />
        )}

        {/* TAB 4: SCENARIO WHAT-IF SIMULATION */}
        {activeTab === 'scenario' && (
          <ScenarioAnalysis suppliers={activeProject.suppliers} />
        )}

        {/* TAB 5: PROCUREMENT COPILOT CHAT */}
        {activeTab === 'chat' && <CopilotChat />}

        {/* TAB 6: EXECUTIVE PROCUREMENT REPORT */}
        {activeTab === 'report' && <ProcurementReport project={activeProject} />}
      </div>
    </div>
  );
};
