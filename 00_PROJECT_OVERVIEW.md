# 00_PROJECT_OVERVIEW.md

# AI Procurement Intelligence Copilot

> An AI-powered procurement decision support platform that transforms scattered procurement documents into evidence-backed supplier recommendations.

---

# 1. Vision

Modern procurement teams spend hours reading requirement documents, supplier profiles, quotations, certifications, and commercial terms before making a sourcing decision.

Our vision is to reduce this process from hours to minutes by building an AI-powered Procurement Intelligence Copilot that understands procurement documents, extracts structured information, compares suppliers objectively, and generates transparent recommendations supported by evidence.

This system is designed as a Decision Support Platform.

It never replaces the procurement manager.

It augments decision making with AI.

---

# 2. Problem Statement

Manufacturing sourcing decisions require information from multiple disconnected documents.

Typical procurement packages include:

- Product Requirement Documents
- Bill of Materials (BOM)
- Supplier Profiles
- Supplier Quotations
- Certifications
- Commercial Terms
- Sustainability Reports

A procurement manager must manually:

- Read every document
- Extract important information
- Compare suppliers
- Verify constraints
- Calculate costs
- Explain why one supplier is better than another

This process is slow, repetitive and prone to human error.

---

# 3. Proposed Solution

The AI Procurement Intelligence Copilot automates procurement analysis.

Instead of manually reviewing documents, users upload an entire procurement package.

The platform automatically:

1. Classifies documents
2. Extracts procurement entities
3. Understands requirements
4. Builds supplier profiles
5. Compares suppliers
6. Scores suppliers
7. Explains trade-offs
8. Provides evidence-backed recommendations

Every recommendation is linked back to the original source document.

No recommendation is generated without supporting evidence.

---

# 4. Target Users

Primary Users

- Procurement Managers
- Manufacturing Teams
- Sourcing Specialists
- Vendor Evaluation Teams
- Supply Chain Analysts

Secondary Users

- Business Managers
- Purchasing Teams
- Operations Managers

---

# 5. Core Design Principles

## Evidence First

Every AI output must reference source documents.

No hallucinated facts.

---

## Human in Control

AI never approves suppliers.

AI recommends.

Human decides.

---

## Transparent Reasoning

Users should understand WHY a supplier is recommended.

The reasoning process must be visible.

---

## Explainability

Every score must be explainable.

Every deduction must be traceable.

---

## Modular AI

Instead of one giant prompt, the platform uses multiple specialized AI components.

Each component performs one responsibility.

---

# 6. Core Features

## Feature 1

Document Upload

Upload multiple procurement documents.

Supported:

- PDF
- DOCX
- XLSX
- Images

---

## Feature 2

Automatic Document Classification

AI identifies:

- Requirement Document
- Supplier Quote
- Supplier Profile
- Certification
- BOM
- Commercial Terms

without user input.

---

## Feature 3

Entity Extraction

Extract:

- MOQ
- Unit Price
- Lead Time
- Currency
- Certifications
- Country
- Payment Terms
- Incoterms
- Capacity
- Material
- Sustainability Information

---

## Feature 4

Supplier Knowledge Base

Every supplier receives its own structured profile.

Example:

Supplier A

- ISO9001
- MOQ 500
- Lead Time 18 Days
- Price $2.15

---

## Feature 5

Requirement Extraction

Extract mandatory requirements.

Example

Product

Requires

ISO9001

MOQ >1000

Delivery <20 Days

Material = Aluminum

---

## Feature 6

Constraint Validation

Automatically detect:

✓ Requirement satisfied

✗ Requirement violated

⚠ Missing Information

---

## Feature 7

Decision Engine

Generate supplier rankings.

Ranking considers:

- Mandatory Constraints
- Cost
- Lead Time
- Certifications
- Sustainability
- Commercial Risk

---

## Feature 8

Evidence Retrieval

Every recommendation links back to:

Document

↓

Page

↓

Paragraph

↓

Extracted Value

---

## Feature 9

Procurement Chat

Users can ask:

"Why was Supplier B selected?"

"Show suppliers below $3."

"Which supplier has the fastest lead time?"

"What changes if MOQ becomes 500?"

---

## Feature 10

Scenario Analysis

Interactive sliders allow users to change priorities.

Example

Cost Weight

70%

↓

Lead Time

20%

↓

Quality

10%

Supplier rankings update instantly.

---

# 7. What Makes This Product Different

Most hackathon projects stop after:

Upload PDF

↓

LLM Summary

Our platform goes much further.

Upload Documents

↓

OCR

↓

Document Classification

↓

Requirement Extraction

↓

Supplier Extraction

↓

Constraint Validation

↓

Supplier Scoring

↓

Evidence Retrieval

↓

Decision Engine

↓

Interactive Procurement Copilot

The AI is part of the workflow.

Not the entire workflow.

---

# 8. AI Components

The platform contains multiple AI modules.

Instead of using one large prompt, responsibilities are separated.

Modules:

- OCR
- Document Classifier
- Procurement Entity Extractor
- Requirement Extractor
- Supplier Extractor
- Embedding Generator
- Retrieval Engine
- Decision Engine
- Explanation Generator
- Procurement Chat Agent

Each module has one clearly defined responsibility.

---

# 9. Technology Stack

Frontend

- Next.js
- TypeScript
- TailwindCSS
- shadcn/ui

Backend

- FastAPI
- Python

Database

- Supabase PostgreSQL

Vector Store

- pgvector (Supabase)

AI

- OpenAI GPT-5.5 (or Gemini)
- LangGraph
- LangChain

Document Processing

- PyMuPDF
- Docling
- Unstructured
- OCR (only if needed)

Deployment

Frontend

- Vercel

Backend

- Railway / Render

Database

- Supabase

---

# 10. Success Metrics

The project is successful if users can:

✓ Upload procurement documents

✓ Compare multiple suppliers

✓ Receive transparent recommendations

✓ See supporting evidence

✓ Ask procurement questions

✓ Explore "What-if" scenarios

within a few minutes.

---

# 11. Non Goals

This platform will NOT:

- Contact suppliers
- Generate RFQs
- Place orders
- Approve suppliers
- Negotiate pricing
- Send emails automatically
- Replace procurement managers

This is a Decision Support Platform.

---

# 12. Future Scope

Potential future capabilities:

- ERP Integration
- SAP Integration
- Oracle Procurement
- Live Supplier APIs
- Multi-language Procurement
- Contract Intelligence
- Invoice Intelligence
- Purchase Order Generation
- Risk Monitoring
- Supplier Performance Analytics

These are outside the hackathon scope.

---

# 13. MVP Scope (Hackathon)

The MVP must demonstrate the complete procurement workflow.

Minimum Deliverables

✓ Upload Procurement Documents

✓ Extract Information

✓ Compare Suppliers

✓ Rank Suppliers

✓ Evidence-backed Recommendation

✓ Procurement Chat

✓ What-if Analysis

Everything else is optional.

---

# 14. Project Philosophy

We are not building another chatbot.

We are building an AI Procurement Intelligence Platform.

AI should assist procurement professionals by reducing repetitive work while ensuring every recommendation remains transparent, explainable, and backed by evidence.

Human judgment always remains the final authority.