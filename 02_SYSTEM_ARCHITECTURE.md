# 02_SYSTEM_ARCHITECTURE.md

# AI Procurement Intelligence Copilot

## System Architecture

Version: 1.0

---

# Purpose

This document defines the complete software architecture of the AI Procurement Intelligence Copilot.

It describes:

- Overall system architecture
- Backend services
- Frontend modules
- AI pipeline
- Document processing pipeline
- Database interactions
- LangGraph workflow
- External integrations
- Service responsibilities

This document serves as the implementation blueprint for the engineering team.

---

# High-Level Architecture

```

                    ┌──────────────────────────┐
                    │       Next.js App        │
                    │                          │
                    │ Dashboard               │
                    │ Upload                 │
                    │ Comparison             │
                    │ Chat                   │
                    │ What-if Analysis       │
                    └────────────┬────────────┘
                                 │
                                 │ REST API
                                 │
                ┌────────────────▼────────────────┐
                │          FastAPI Backend         │
                │                                 │
                │ Authentication                  │
                │ Upload Service                  │
                │ AI Pipeline                     │
                │ Decision Engine                 │
                │ Chat Service                    │
                │ Report Service                  │
                └────────────┬────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
Document Pipeline     Decision Engine      LangGraph Agents

        │                    │                    │
        └──────────────┬─────┴──────────────┬─────┘
                       ▼                    ▼
              Supabase Database     Vector Database

                       │
                       ▼
                 OpenAI / Gemini

```

---

# System Philosophy

The system is NOT built around a chatbot.

Instead, the chatbot is one feature inside a larger procurement platform.

Core workflow

Documents

↓

Knowledge Extraction

↓

Business Validation

↓

Decision Engine

↓

Evidence

↓

AI Explanation

---

# Layered Architecture

The platform consists of six logical layers.

```

Presentation Layer

↓

Application Layer

↓

AI Orchestration Layer

↓

Business Logic Layer

↓

Data Layer

↓

Infrastructure Layer

```

Each layer has a single responsibility.

---

# Presentation Layer

Technology

- Next.js
- TypeScript
- TailwindCSS
- shadcn/ui

Responsibilities

- Authentication
- Dashboard
- Upload Interface
- Supplier Comparison
- Procurement Chat
- Scenario Analysis
- Report Viewer

Presentation layer never performs business logic.

---

# Application Layer

Technology

FastAPI

Responsibilities

- API Routing
- Authentication
- Request Validation
- Upload Management
- Job Scheduling
- Response Formatting

Business rules do not belong here.

---

# AI Orchestration Layer

Technology

LangGraph

Responsibilities

- Coordinate AI modules
- Execute workflow
- Handle retries
- Route failures
- Manage memory
- Execute parallel tasks

This layer coordinates AI.

It does not implement business rules.

---

# Business Logic Layer

Responsible for deterministic procurement decisions.

Contains

- Constraint Validator
- Supplier Ranking
- Cost Calculator
- Rule Engine
- Scenario Engine

This layer produces consistent decisions.

LLMs never replace deterministic calculations.

---

# Data Layer

Technology

Supabase PostgreSQL

Contains

- Documents
- Suppliers
- Requirements
- Scores
- Users
- Sessions

Also includes

pgvector

for semantic search.

---

# Infrastructure Layer

External Services

OpenAI

Embedding Model

OCR Engine

Supabase

Storage

Authentication

Logging

---

# Backend Modules

The backend is divided into independent services.

```

backend/

app/

├── api/

├── auth/

├── upload/

├── parser/

├── classifier/

├── extractor/

├── embeddings/

├── retrieval/

├── decision/

├── chat/

├── reports/

├── langgraph/

├── database/

├── models/

├── utils/

└── config/

```

Each folder owns one responsibility.

---

# Frontend Modules

```

frontend/

app/

components/

pages/

hooks/

services/

types/

lib/

providers/

store/

styles/

```

Major Screens

Dashboard

Upload

Suppliers

Analysis

Reports

Chat

Settings

---

# Complete Request Lifecycle

Step 1

User uploads procurement documents.

↓

Step 2

Upload Service stores documents.

↓

Step 3

Parser extracts text.

↓

Step 4

Document Classifier identifies document type.

↓

Step 5

Entity Extractor extracts procurement entities.

↓

Step 6

Requirement Extractor builds requirement model.

↓

Step 7

Supplier Extractor builds supplier profiles.

↓

Step 8

Embeddings generated.

↓

Step 9

Vector database updated.

↓

Step 10

Decision Engine validates suppliers.

↓

Step 11

Supplier scores generated.

↓

Step 12

Evidence linked.

↓

Step 13

Frontend displays recommendation.

---

# AI Pipeline

The AI pipeline consists of independent modules.

Document

↓

OCR

↓

Classification

↓

Extraction

↓

Normalization

↓

Embedding

↓

Retrieval

↓

Explanation

Each module can be replaced independently.

---

# Procurement Pipeline

Requirement Document

↓

Requirement Extraction

↓

Supplier Quotes

↓

Supplier Extraction

↓

Supplier Profiles

↓

Certification Extraction

↓

Decision Engine

↓

Supplier Ranking

↓

Evidence Generator

↓

Dashboard

---

# Data Flow

```

User

↓

Upload

↓

Supabase Storage

↓

Parser

↓

Structured JSON

↓

Database

↓

Embeddings

↓

Vector Search

↓

Decision Engine

↓

LLM

↓

Frontend

```

---

# Why Structured Extraction First?

Many RAG systems retrieve raw text.

Our platform first creates structured procurement knowledge.

Example

Instead of

"The supplier can manufacture approximately one thousand units."

Store

```

MOQ:1000

```

Instead of

"Delivery usually takes about 18 days."

Store

```

LeadTime:18

```

Structured data enables deterministic validation.

---

# Decision Flow

Requirement

↓

Constraint Validation

↓

Supplier Qualification

↓

Cost Calculation

↓

Scoring

↓

Ranking

↓

Evidence Collection

↓

Explanation

---

# Chat Flow

Question

↓

Embedding

↓

Vector Search

↓

Relevant Procurement Evidence

↓

LLM

↓

Grounded Answer

---

# Evidence Flow

Every extracted field contains

Document

↓

Page

↓

Chunk

↓

Confidence

↓

Extracted Value

Every recommendation references these fields.

---

# Failure Handling

If OCR fails

↓

Fallback Parser

If Extraction fails

↓

Manual Review Queue

If LLM unavailable

↓

Rule Engine Still Works

If Vector Search fails

↓

Structured Database Search

System should degrade gracefully.

---

# Scalability

Future horizontal scaling

Upload Service

↓

Parser Workers

↓

AI Workers

↓

Decision Workers

↓

Report Workers

All services remain stateless.

---

# Security Principles

Never expose API keys.

Never trust uploaded files.

Validate every upload.

Log every AI decision.

Store source provenance.

Encrypt sensitive configuration.

---

# Performance Goals

Upload

<5 sec

Extraction

<20 sec

Ranking

<2 sec

Chat

<5 sec

Scenario Update

<2 sec

---

# Architectural Principles

1.

Single Responsibility

Every service owns one task.

---

2.

Loose Coupling

Modules communicate through interfaces.

---

3.

Replaceable AI

Every LLM can be swapped.

---

4.

Deterministic Business Logic

Business rules should not depend on prompts.

---

5.

Evidence First

Every recommendation must be traceable.

---

6.

Human Control

AI recommends.

Humans approve.

---

# Summary

The Procurement Intelligence Copilot is a modular AI system built around structured procurement knowledge rather than raw document summarization.

The architecture separates document understanding, procurement reasoning, business validation, semantic retrieval, and explanation into independent modules, producing a system that is explainable, scalable, auditable, and suitable for enterprise procurement workflows.
