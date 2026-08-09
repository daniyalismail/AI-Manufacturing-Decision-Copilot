# PRD.md

# AI Procurement Intelligence Copilot

Version: 1.0
Status: MVP / Hackathon
Target Build Time: 36 Hours
Team Size: 2

---

# 1. Product Overview

## Product Name

AI Procurement Intelligence Copilot

## One-Line Description

An AI-powered procurement decision-support platform for manufacturing companies that reads procurement documents, extracts requirements and supplier information, compares suppliers, validates procurement constraints, ranks suppliers, provides evidence-backed recommendations, and allows users to explore what-if scenarios.

## Product Positioning

This is NOT a generic AI chatbot.

It is a procurement intelligence workspace where:

- AI reads documents.
- AI extracts structured procurement information.
- The Procurement Knowledge Model connects the information.
- The deterministic Decision Engine evaluates suppliers.
- RAG retrieves supporting evidence.
- AI explains the decision.
- The procurement professional remains in control.

---

# 2. Problem

Manufacturing procurement teams often receive information across multiple documents:

- Requirement documents
- Supplier quotations
- Supplier profiles
- Certifications
- Commercial terms
- Excel sheets
- PDFs
- Scanned documents

A procurement professional must manually compare:

- Price
- MOQ
- Lead time
- Quality
- Certifications
- Country
- Payment terms
- Risk
- Sustainability
- Other requirements

This process is slow and error-prone.

The system solves this by turning unstructured procurement documents into structured, explainable supplier intelligence.

---

# 3. Target User

Primary user:

Procurement Manager

Secondary users:

- Sourcing Manager
- Purchasing Manager
- Supply Chain Manager
- Procurement Analyst

---

# 4. Primary User Goal

The user should be able to answer:

> "Which supplier should we choose, and why?"

The system must provide both:

1. The recommendation.
2. The evidence and reasoning behind the recommendation.

---

# 5. Core Value Proposition

The product reduces the time required to evaluate suppliers by automatically:

1. Reading procurement documents.
2. Extracting relevant information.
3. Understanding requirements.
4. Comparing suppliers.
5. Validating constraints.
6. Scoring suppliers.
7. Ranking suppliers.
8. Recommending the best qualified supplier.
9. Showing supporting evidence.
10. Explaining the recommendation.
11. Allowing what-if analysis.

---

# 6. Product Philosophy

The product follows this principle:

AI reads.

Knowledge Model connects.

Rules decide.

RAG proves.

AI explains.

Human decides.

---

# 7. MVP Scope

The MVP MUST include:

- Project creation
- Document upload
- Document parsing
- OCR fallback
- Document classification
- Requirement extraction
- Supplier extraction
- Certification extraction
- Procurement Knowledge Model
- Constraint validation
- Supplier qualification
- Supplier scoring
- Supplier ranking
- Recommendation
- Confidence score
- Evidence/citations
- Supplier comparison
- Scenario analysis
- Procurement chat
- Report generation
- Dashboard

---

# 8. Out of Scope

The MVP does NOT require:

- ERP integration
- SAP integration
- Oracle integration
- Real supplier negotiation
- Automatic purchasing
- Purchase order creation
- Real-time supplier communication
- Financial forecasting
- Market prediction
- Supplier reputation prediction
- Autonomous procurement decisions

The system is decision support.

It does not replace human approval.

---

# 9. Main User Journey

Complete journey:

Login
  ↓
Dashboard
  ↓
Create Project
  ↓
Upload Documents
  ↓
Processing
  ↓
AI Extraction
  ↓
Knowledge Model
  ↓
Validation
  ↓
Decision Engine
  ↓
Recommendation
  ↓
Supplier Comparison
  ↓
Evidence
  ↓
Scenario Analysis
  ↓
Procurement Chat
  ↓
Report

---

# 10. Authentication

The user should be able to:

- Sign in
- Sign out
- Access their projects
- Access only their own documents and reports

Authentication is handled through Supabase Auth.

---

# 11. Dashboard

## Purpose

Provide an overview of procurement activity.

## Dashboard should show

### Statistics

- Total Projects
- Documents Uploaded
- Suppliers Analyzed
- Completed Analyses

### Recent Projects

Each project displays:

- Project name
- Status
- Created date
- Number of documents
- Number of suppliers

### Recent Activity

Examples:

- Analysis completed
- New document uploaded
- Recommendation generated
- Report generated

### Quick Actions

- Create Project
- Upload Documents
- View Projects

---

# 12. Project Creation

User selects:

Create Project

Form:

- Project Name
- Description

Example:

Project Name:
Motor Housing Procurement

Description:
Procurement of 5,000 aluminum motor housings.

After creation:

Redirect to project workspace.

---

# 13. Project Workspace

The project workspace is the main working environment.

It contains:

- Project overview
- Documents
- Processing status
- Supplier analysis
- Recommendation
- Comparison
- Evidence
- Scenario analysis
- Chat
- Report

---

# 14. Document Upload

## Supported Files

- PDF
- DOCX
- XLSX
- PNG
- JPEG

## Upload Features

- Drag and drop
- Browse files
- Multiple file upload
- Upload progress
- File validation
- Remove file
- Retry failed upload

## File Size

Default maximum:

25 MB per file.

---

# 15. Document Processing

After upload:

Uploaded
   ↓
Parsing
   ↓
Classification
   ↓
Extraction
   ↓
Knowledge Building
   ↓
Validation
   ↓
Analysis
   ↓
Ready

The frontend must display processing status.

Possible states:

- Uploaded
- Parsing
- Extracting
- Building Knowledge
- Validating
- Analyzing
- Ready
- Failed

---

# 16. Document Parsing

The backend must extract:

- Text
- Tables
- Page numbers
- Sections
- Metadata

For scanned documents:

Document
  ↓
OCR
  ↓
Text

Page references must be preserved.

---

# 17. Document Classification

The system classifies uploaded documents.

Supported types:

- Requirement Document
- Bill of Materials
- Supplier Quote
- Supplier Profile
- Certification
- Commercial Terms
- Sustainability Report
- Unknown

The classification result must include confidence.

---

# 18. Requirement Extraction

The system extracts procurement requirements.

Possible requirements:

- Material
- MOQ
- Lead Time
- Certifications
- Country Restrictions
- Payment Terms
- Quality Requirements
- Surface Finish
- Tolerance
- Capacity
- Other procurement constraints

Each requirement should contain:

- Name
- Expected value
- Operator
- Unit
- Mandatory status
- Confidence
- Evidence reference

---

# 19. Supplier Extraction

The system extracts:

- Supplier name
- Country
- Currency
- Unit price
- MOQ
- Lead time
- Payment terms
- Incoterms
- Certifications
- Capabilities
- Other relevant supplier information

Unknown information must remain unknown.

The system must NOT invent missing values.

---

# 20. Procurement Knowledge Model

The Procurement Knowledge Model is the central structured representation of the project.

It connects:

Project
 ├── Requirements
 ├── Suppliers
 ├── Quotes
 ├── Certifications
 ├── Documents
 ├── Evidence
 ├── Relationships
 ├── Scores
 └── Recommendation

Example relationship:

Supplier A
   ↓
MOQ = 1200
   ↓
Requirement: MOQ >= 1000
   ↓
PASS
   ↓
Evidence: Supplier_A.pdf Page 4

The PKM is used by:

- Decision Engine
- Scenario Engine
- Chat
- Reports
- Explanation system

---

# 21. Constraint Validation

The system validates suppliers against procurement requirements.

Statuses:

- PASS
- FAIL
- WARNING
- UNKNOWN

Example:

Requirement:
MOQ >= 1000

Supplier:
MOQ = 1200

Result:
PASS

If:

MOQ = 500

Result:
FAIL

If information is unavailable:

UNKNOWN

Unknown must NOT automatically be treated as failure unless the specific business rule says so.

---

# 22. Supplier Qualification

Suppliers are classified as:

- QUALIFIED
- CONDITIONALLY_QUALIFIED
- REJECTED

A mandatory requirement failure can disqualify a supplier.

A supplier that fails mandatory constraints must not become the final recommendation simply because it has a high weighted score.

---

# 23. Decision Engine

The Decision Engine is deterministic.

The LLM must NOT calculate supplier rankings.

Default scoring weights:

Cost             30%
Quality          25%
Lead Time        20%
Risk             15%
Sustainability   10%

Total:

100%

---

# 24. Supplier Scoring

Every qualified supplier receives:

- Cost Score
- Quality Score
- Lead Time Score
- Risk Score
- Sustainability Score
- Overall Score

Scores range from:

0 - 100

---

# 25. Ranking

Suppliers are ranked by:

Overall Score DESC

Tie breakers:

1. Constraint pass percentage
2. Quality score
3. Risk score
4. Lead time
5. Cost

---

# 26. Recommendation

The system recommends:

Highest-ranked qualified supplier

The recommendation must contain:

- Supplier
- Overall score
- Confidence
- Strengths
- Weaknesses
- Failed/important constraints
- Supporting evidence
- Explanation

If no supplier qualifies:

NO_RECOMMENDATION

The system must explain why.

---

# 27. Confidence

Confidence is not the same as LLM confidence.

Confidence is based on factors such as:

- Evidence coverage
- Data completeness
- Constraint validation coverage
- Relationship consistency
- Retrieval quality

The UI should clearly distinguish:

Recommendation Score

from:

Confidence

---

# 28. Recommendation Card

The main recommendation card should show:

Recommended Supplier

Supplier B

Overall Score
90 / 100

Confidence
94%

✓ Mandatory requirements satisfied
✓ Required certification
✓ Lead time within target
✓ Competitive cost

There should be a way to view evidence.

---

# 29. Supplier Comparison

The user can compare suppliers.

Columns:

- Supplier
- Cost
- MOQ
- Lead Time
- Quality
- Risk
- Sustainability
- Overall Score
- Qualification
- Recommendation

The table must support:

- Sorting
- Filtering
- Responsive display

---

# 30. Constraint Matrix

Display requirements against suppliers.

Example:

                    Supplier A   Supplier B   Supplier C

MOQ                 PASS         PASS         FAIL

Lead Time           PASS         PASS         FAIL

ISO9001             PASS         PASS         UNKNOWN

Material            PASS         PASS         PASS

This should make supplier differences immediately understandable.

---

# 31. Evidence System

Every important procurement fact should be traceable to its source.

Evidence contains:

- Document
- Page
- Section
- Chunk
- Extracted text
- Confidence

Example:

Supplier_B_Quote.pdf
Page 4
Commercial Terms

"Minimum Order Quantity: 1,500 units"

The user should be able to open evidence from recommendation and analysis screens.

---

# 32. RAG

RAG is used for evidence retrieval and grounded answers.

Pipeline:

Question
  ↓
Query Processing
  ↓
Metadata Filtering
  ↓
Vector Search
  ↓
Keyword Search
  ↓
Re-ranking
  ↓
Context
  ↓
Answer

The system should use Supabase pgvector.

---

# 33. Procurement Copilot Chat

The user can ask procurement questions.

Examples:

Why was Supplier B selected?

Which supplier has the lowest MOQ?

Which suppliers satisfy ISO9001?

Why was Supplier C rejected?

Compare Supplier A and Supplier B.

What evidence supports Supplier B's lead time?

---

# 34. Chat Rules

The assistant must:

- Use retrieved evidence.
- Provide sources.
- Avoid unsupported claims.
- Avoid inventing values.
- Clearly state when evidence is insufficient.

If evidence is insufficient:

"I don't have enough evidence to answer that."

The chat must not become a generic ChatGPT assistant.

It is a procurement-specific assistant.

---

# 35. Scenario / What-If Analysis

The user can change scoring weights.

Example:

Current:

Cost             30%
Quality          25%
Lead Time        20%
Risk             15%
Sustainability   10%

User changes:

Cost             60%
Quality          15%
Lead Time        10%
Risk             10%
Sustainability    5%

The system recalculates the ranking.

It must NOT:

- Re-parse documents
- Re-run extraction
- Rebuild the PKM
- Re-index documents

Only the deterministic Decision Engine should recalculate scores.

---

# 36. Scenario Result

Show:

- Previous ranking
- New ranking
- Changed scores
- Weight changes
- Explanation of major ranking changes

Example:

Supplier A

Rank:
2 → 1

Reason:

Higher cost weighting improved Supplier A's relative position because Supplier A has the lowest normalized cost.

---

# 37. Reports

The user can generate a procurement report.

Report sections:

1. Executive Summary
2. Project Overview
3. Requirements
4. Supplier Ranking
5. Constraint Validation
6. Score Breakdown
7. Risks
8. Recommendation
9. Evidence
10. Conclusion

Report can be exported as PDF.

---

# 38. Frontend Design Requirement

IMPORTANT:

`design.md` is the absolute source of truth for visual design.

The implementation MUST follow `design.md` for:

- Layout
- Typography
- Colors
- Spacing
- Navigation
- Cards
- Tables
- Buttons
- Forms
- Components
- Animations
- Responsive behavior
- Visual hierarchy
- Overall look and feel

Do NOT redesign the interface.

Do NOT replace the design with a generic dashboard.

Do NOT invent a different design system.

If this PRD describes functionality and `design.md` describes visual implementation, use:

PRD
↓
What the product does

design.md
↓
How the product looks and behaves visually

---

# 39. Frontend Screens

The MVP should contain:

Login
Dashboard
Projects
Create Project
Project Workspace
Document Upload
Processing Status
Analysis
Supplier Comparison
Evidence Viewer
Scenario Analysis
Procurement Chat
Reports
Settings

---

# 40. Dashboard Requirements

Dashboard must provide:

- Project overview
- Recent projects
- Processing status
- Recent recommendations
- Quick actions
- Key statistics

Visual implementation must follow `design.md`.

---

# 41. Project Screen Requirements

Show:

- Project information
- Documents
- Processing status
- Suppliers
- Analysis status
- Recommendation

---

# 42. Upload Screen Requirements

Show:

- Upload area
- Selected files
- Validation
- Progress
- Success
- Failure
- Retry
- Start Analysis

---

# 43. Analysis Screen Requirements

Show:

- Recommended supplier
- Score
- Confidence
- Supplier ranking
- Constraint matrix
- Score breakdown
- Evidence
- Explanation

---

# 44. Comparison Screen Requirements

Show:

- Supplier comparison
- Scores
- Requirements
- Qualification status
- Recommendation
- Evidence access

---

# 45. Scenario Screen Requirements

Show:

- Weight controls
- Current weights
- Updated weights
- Ranking changes
- Score changes
- Explanation

---

# 46. Chat Screen Requirements

Show:

- Conversation
- User messages
- Assistant messages
- Suggested questions
- Sources
- Loading state
- Error state
- Input

---

# 47. Report Screen Requirements

Show:

- Report preview
- Summary
- Recommendation
- Ranking
- Evidence
- Download/export

---

# 48. Loading States

Every asynchronous operation must have a clear loading state.

Examples:

- Uploading
- Parsing
- Extracting
- Analyzing
- Loading suppliers
- Loading evidence
- Generating report
- Chat response

Never show an unexplained blank screen.

---

# 49. Empty States

Required empty states:

- No projects
- No documents
- No suppliers
- No analysis
- No reports
- No chat history
- No evidence

Each empty state should explain what the user can do next.

Visual style must follow `design.md`.

---

# 50. Error States

Required errors:

- Upload failed
- Unsupported file
- Parsing failed
- AI extraction failed
- Analysis failed
- Retrieval failed
- Chat failed
- Report generation failed
- Network error

Errors must provide recovery where possible.

Examples:

Retry
Upload Again
Go Back
Try Again

---

# 51. Backend / Frontend Separation

Frontend is responsible for:

- UI
- User interaction
- API calls
- State
- Visualization

Backend is responsible for:

- Authentication validation
- File processing
- AI
- PKM
- Decision Engine
- RAG
- Reports
- Business logic

The frontend must NOT implement procurement scoring logic.

---

# 52. API Rule

Frontend must consume the documented API.

Do not invent endpoint contracts.

Do not duplicate backend business logic.

Do not hardcode supplier recommendations.

---

# 53. Security

The application must:

- Protect private documents.
- Validate authenticated users.
- Prevent cross-project access.
- Never expose API keys.
- Never expose service-role credentials to frontend.
- Use signed URLs for private files where required.

---

# 54. Performance

Target:

Dashboard initial load:

< 2 seconds where practical.

Decision Engine:

< 500ms.

Scenario recalculation:

< 1 second end-to-end.

Chat:

Begin streaming as soon as response is available.

Frontend should use:

- Loading states
- Caching
- Server state management
- Lazy loading where appropriate

---

# 55. AI Safety / Reliability

The system must never:

- Invent supplier data.
- Invent certifications.
- Invent prices.
- Invent evidence.
- Invent page numbers.
- Pretend unknown data is known.

Unknown information should remain:

UNKNOWN

or:

null

depending on the layer.

---

# 56. Core Architecture

                    FRONTEND
                       │
                       ▼
                    FASTAPI
                       │
            ┌──────────┴──────────┐
            ▼                     ▼
       PROJECT/API            PIPELINE
                                  │
                                  ▼
                               PARSER
                                  │
                                  ▼
                           AI EXTRACTION
                                  │
                                  ▼
                        PROCUREMENT KNOWLEDGE
                              MODEL
                                  │
                                  ▼
                         DECISION ENGINE
                          │           │
                          ▼           ▼
                     RANKING      SCENARIOS
                          │
                          ▼
                     RECOMMENDATION
                          │
                          ▼
                     EVIDENCE / RAG
                          │
                          ▼
                       AI EXPLANATION
                          │
                          ▼
                       FRONTEND

---

# 57. Technology

Frontend:

- Next.js
- TypeScript
- TailwindCSS
- shadcn/ui
- Zustand
- TanStack Query

Backend:

- Python
- FastAPI
- Pydantic
- SQLAlchemy

AI:

- OpenAI SDK
- PydanticAI
- Instructor where required
- LangGraph

Database:

- Supabase
- PostgreSQL
- pgvector

Document Processing:

- PyMuPDF
- Docling
- OCR fallback

---

# 58. Demo Dataset

The MVP should include a realistic procurement dataset.

Recommended example:

Project:

Motor Housing Procurement

Requirements:

Material: Aluminum

MOQ: >= 1000

Lead Time: <= 20 days

ISO9001: Required

Country:
Malaysia / Vietnam

Suppliers:

Supplier A
Supplier B
Supplier C

The dataset should intentionally contain:

- One clearly strong supplier
- One competitive supplier
- One supplier with constraint failures

This makes the recommendation and comparison visually obvious during the hackathon demo.

---

# 59. Demo Story

The intended demo flow:

1. Open Dashboard
2. Create Procurement Project
3. Upload requirement + supplier documents
4. Show processing
5. Show extracted information
6. Show recommendation
7. Open supplier comparison
8. Show constraint failures
9. Open evidence
10. Ask:
   "Why was Supplier B selected?"
11. Show grounded answer
12. Change Cost Weight to 60%
13. Show ranking change
14. Generate report

---

# 60. Key Product Differentiator

The product is NOT:

Upload PDF → Ask ChatGPT

The product is:

Documents
↓
Structured Procurement Knowledge
↓
Deterministic Decision Engine
↓
Evidence-backed Recommendation
↓
Explainable AI
↓
What-if Decision Support

---

# 61. Definition of Done

The MVP is considered complete when a user can:

1. Create a project.
2. Upload procurement documents.
3. Successfully process the documents.
4. Extract requirements.
5. Extract supplier information.
6. Build the Procurement Knowledge Model.
7. Validate supplier constraints.
8. Calculate supplier scores.
9. Rank suppliers.
10. Receive a recommendation.
11. See recommendation confidence.
12. Open supporting evidence.
13. Compare suppliers.
14. Ask procurement questions through chat.
15. Receive grounded answers with citations.
16. Change decision weights.
17. See ranking changes.
18. Generate a procurement report.

---

# 62. Acceptance Test

Given:

1 requirement document
3 supplier documents
1 certification document

When the user starts analysis:

The system must produce:

Requirements
+
Supplier Data
+
Constraint Results
+
Supplier Scores
+
Supplier Ranking
+
Recommendation
+
Confidence
+
Evidence

The user must be able to trace the recommendation back to source documents.

---

# 63. Critical Product Rule

The system must never hide uncertainty.

If information is missing:

Missing

If evidence is insufficient:

Insufficient Evidence

If no supplier qualifies:

No Qualified Supplier

The system should prefer transparency over a confident but unsupported answer.

---

# 64. Implementation Instructions

Before implementing:

1. Read this PRD completely.
2. Read `design.md` completely.
3. Read the relevant architecture documents.
4. Read the relevant Engineering Specification.
5. Inspect the existing repository.
6. Do not overwrite existing working functionality without reason.
7. Do not invent API contracts.
8. Do not invent visual design.
9. Do not duplicate business logic.
10. Follow existing architecture.

For frontend:

design.md = visual source of truth

For functionality:

PRD + API Specification = product behavior

For technical implementation:

Engineering Specifications = implementation contract

If a conflict exists:

Visual conflict:
design.md wins.

Product behavior conflict:
PRD wins.

API conflict:
API specification wins.

Technical implementation conflict:
Engineering Specification wins.

Security requirement:
Security requirement always wins.

---

# 65. Final Product Statement

AI Procurement Intelligence Copilot is an AI-powered procurement decision-support platform designed for manufacturing environments.

It transforms scattered procurement documents into structured procurement intelligence, evaluates suppliers against business requirements, calculates transparent supplier scores, provides evidence-backed recommendations, enables what-if analysis, and gives procurement professionals a grounded conversational interface for understanding the decision.

The system does not replace human procurement professionals.

It makes their decisions faster, more consistent, explainable, and evidence-backed.

END OF PRD
