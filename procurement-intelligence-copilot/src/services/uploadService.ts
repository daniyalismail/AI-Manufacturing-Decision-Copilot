export interface ProcessingStep {
  id: number;
  label: string;
  detail: string;
}

export const PROCESSING_STEPS: ProcessingStep[] = [
  { id: 1, label: 'Uploading Documents', detail: 'Ingesting RFP specification and supplier proposal files...' },
  { id: 2, label: 'Parsing & OCR Processing', detail: 'Extracting text tables and structural schemas from PDF files...' },
  { id: 3, label: 'Classifying Document Types', detail: 'Identifying commercial terms, technical specs, and certificates...' },
  { id: 4, label: 'Extracting Requirements', detail: 'Isolating mandatory MOQ, lead time, and ISO compliance clauses...' },
  { id: 5, label: 'Extracting Supplier Quotes', detail: 'Mapping pricing tiers, MOQ limits, and lead times per vendor...' },
  { id: 6, label: 'Building Procurement Knowledge Model', detail: 'Creating graph connections between constraints and quotes...' },
  { id: 7, label: 'Validating Constraints Matrix', detail: 'Checking PASS/FAIL/WARNING statuses against business rules...' },
  { id: 8, label: 'Evaluating Risk & Quality Scores', detail: 'Running multi-criteria scoring algorithm on vendor history...' },
  { id: 9, label: 'Generating Recommendation Report', detail: 'Formulating decision rationale and citation evidence references...' },
  { id: 10, label: 'Analysis Complete', detail: 'Procurement Intelligence Workspace is ready for review.' },
];
