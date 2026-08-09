export type ProjectStatus = 'Draft' | 'Processing' | 'Analyzed';
export type SupplierQualification = 'QUALIFIED' | 'CONDITIONALLY_QUALIFIED' | 'REJECTED';
export type ConstraintStatus = 'PASS' | 'FAIL' | 'WARNING' | 'UNKNOWN';

export interface Requirement {
  id: string;
  category: string;
  name: string;
  expected: string;
  unit?: string;
  priority: 'MANDATORY' | 'PREFERRED';
  description?: string;
}

export interface SupplierScore {
  cost: number;
  quality: number;
  leadTime: number;
  risk: number;
  sustainability: number;
  overall?: number;
}

export interface Evidence {
  id: string;
  supplierId: string;
  supplierName: string;
  docName: string;
  pageNumber: number;
  sectionTitle: string;
  extractedText: string;
  confidenceScore: number;
  evidenceType: 'Commercial' | 'Technical' | 'Compliance' | 'Quality';
}

export interface Supplier {
  id: string;
  name: string;
  location: string;
  status: SupplierQualification;
  rawCost: number;
  rawMoq: number;
  rawTime: number;
  isoCertified: boolean;
  scores: SupplierScore;
  strengths: string[];
  weaknesses: string[];
  primaryEvidence: Evidence;
  riskDetails: string;
  contactEmail?: string;
}

export interface ConstraintResult {
  requirementId: string;
  requirementName: string;
  expected: string;
  supplierResults: Record<string, {
    status: ConstraintStatus;
    actualValue: string;
    notes?: string;
  }>;
}

export interface ProjectDocument {
  id: string;
  name: string;
  size: string;
  type: 'PDF' | 'DOCX' | 'XLSX' | 'PNG';
  uploadedAt: string;
  status: 'Ready' | 'Processing' | 'Error';
  pagesCount?: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  category: string;
  status: ProjectStatus;
  date: string;
  targetBudget?: number;
  documents: ProjectDocument[];
  suppliers: Supplier[];
  requirements: Requirement[];
  constraints: ConstraintResult[];
}

export interface ScenarioWeights {
  cost: number;
  quality: number;
  leadTime: number;
  risk: number;
  sustainability: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  citations?: Evidence[];
  suggestedQuestions?: string[];
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  company: string;
  avatarUrl?: string;
}
