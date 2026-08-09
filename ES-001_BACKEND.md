# ES-001

# FastAPI Backend Engineering Specification

Project

AI Procurement Intelligence Copilot

Version

1.0

Status

READY FOR IMPLEMENTATION

---

# Objective

Implement the complete backend for the Procurement Intelligence Copilot using FastAPI.

The backend must provide:

- Authentication
- File Upload
- Procurement Knowledge Model
- AI Pipeline
- Decision Engine
- RAG
- Chat
- Reporting

The implementation must follow Clean Architecture.

No business logic inside API routes.

No SQL inside routes.

No prompts inside services.

No AI inside repositories.

---

# Technology Stack

Python 3.12

FastAPI

SQLAlchemy Async

Pydantic V2

Supabase

OpenAI SDK

LangGraph

Instructor

PyMuPDF

Docling

Structlog

Alembic

---

# Folder Structure

Implement exactly.

backend/

```
app/

api/

v1/

auth.py

projects.py

upload.py

analysis.py

suppliers.py

chat.py

reports.py

scenario.py

health.py

core/

database/

models/

schemas/

repositories/

services/

knowledge/

agents/

langgraph/

decision_engine/

retrieval/

embeddings/

parser/

ocr/

storage/

middleware/

dependencies/

utils/

tests/

```

---

# API Layer

Responsibilities

Request validation

Dependency Injection

Response serialization

Authentication

Nothing else.

Each endpoint should call exactly one service.

Example

POST /projects

↓

ProjectService.create()

---

# Database Layer

Implement SQLAlchemy models.

One model

↓

One file

Use UUID primary keys.

Use created_at

updated_at

timestamps.

Soft delete support.

---

# Repository Layer

Repositories own database operations.

Never call OpenAI.

Never call LangGraph.

Never contain business logic.

Required repositories

ProjectRepository

DocumentRepository

SupplierRepository

RequirementRepository

RelationshipRepository

AnalysisRepository

ChatRepository

---

# Knowledge Layer

Implement Procurement Knowledge Model.

Classes

ProcurementProject

Requirement

Supplier

Quote

Capability

Certification

Evidence

Relationship

Recommendation

SupplierScore

KnowledgeBuilder

KnowledgeSerializer

KnowledgeValidator

KnowledgeQuery

---

# Service Layer

Implement

ProjectService

UploadService

AnalysisService

KnowledgeService

SupplierService

ScenarioService

ChatService

ReportService

Services coordinate workflows.

Services never perform SQL directly.

---

# Upload Service

Responsibilities

Validate upload

Store file

Create database record

Schedule processing

Return upload status

No parsing inside UploadService.

---

# Parser Layer

Implement

PDFParser

DOCXParser

ExcelParser

ImageParser

ParserFactory

TextCleaner

ChunkGenerator

Parser output

ParsedDocument

page_number

text

metadata

---

# OCR Layer

Implement

OCRService

TesseractAdapter

FallbackOCR

OCR only when parser cannot extract text.

---

# AI Agent Layer

Implement

DocumentClassifierAgent

RequirementExtractionAgent

SupplierExtractionAgent

CertificationExtractionAgent

EvidenceAgent

ExplanationAgent

ChatAgent

All agents return Pydantic models.

No raw JSON strings.

---

# LangGraph Layer

Implement

GraphState

Workflow

Nodes

Router

RetryPolicy

Node Types

ParseNode

ClassificationNode

RequirementNode

SupplierNode

KnowledgeBuilderNode

DecisionNode

RetrievalNode

ExplanationNode

---

# Procurement Knowledge Model

Workflow

Extraction

↓

Knowledge Builder

↓

ProcurementProject

↓

Decision Engine

↓

Recommendation

Every business service reads PKM.

---

# Decision Engine

Implement

ConstraintValidator

CostEngine

QualityEngine

RiskEngine

LeadTimeEngine

ScoreEngine

RankingEngine

RecommendationEngine

ScenarioEngine

Every engine returns immutable objects.

---

# Retrieval Layer

Implement

EmbeddingService

Retriever

MetadataFilter

ReRanker

PromptBuilder

CitationBuilder

ContextBuilder

RetrievalResult

---

# Chat Layer

Workflow

Question

↓

Embedding

↓

Retriever

↓

Prompt Builder

↓

OpenAI

↓

Structured Response

↓

Sources

Never answer without retrieved evidence.

---

# Report Layer

Implement

Executive Summary

Supplier Ranking

Constraint Report

Evidence Report

Recommendation

Export PDF

---

# Storage Layer

Implement

SupabaseStorage

Upload

Delete

Download URL

Signed URL

---

# Middleware

Authentication

Request Logging

Correlation ID

Error Handler

Execution Timer

---

# Dependencies

Provide

CurrentUser

DatabaseSession

Settings

OpenAIClient

SupabaseClient

Logger

---

# Configuration

Centralize configuration.

config/settings.py

No os.getenv outside configuration.

---

# Error Handling

Global exception hierarchy.

Base

ApplicationError

Derived

ValidationError

UploadError

ParsingError

RetrievalError

DecisionError

LLMError

KnowledgeError

DatabaseError

---

# Logging

Use Structlog.

Every request logs

Request ID

User ID

Endpoint

Duration

Errors

LLM Calls

Decision Result

---

# Testing

Implement

Unit Tests

Repository Tests

Service Tests

Decision Engine Tests

Knowledge Builder Tests

API Tests

Integration Tests

Coverage Goal

80%

---

# Coding Rules

Maximum function length

40 lines

Maximum class responsibility

One concern

No circular imports

Type hints required

Docstrings required

Pydantic everywhere

No Any unless unavoidable

---

# Performance Targets

Upload

<3 sec

Parsing

<10 sec

Knowledge Build

<2 sec

Decision Engine

<500 ms

Retrieval

<300 ms

Chat

<5 sec

---

# Acceptance Criteria

✓ Upload multiple procurement documents

✓ Parse all supported formats

✓ Build Procurement Knowledge Model

✓ Store structured procurement data

✓ Rank suppliers deterministically

✓ Retrieve procurement evidence

✓ Explain recommendation

✓ Generate procurement report

✓ Answer procurement questions

✓ Support scenario analysis

---

# Deliverables

The implementation must include

Complete FastAPI application

Database models

Alembic migrations

REST API

Knowledge Model

LangGraph workflow

Decision Engine

RAG pipeline

Tests

OpenAPI documentation

Dockerfile

README

---

# Engineering Principles

Business logic must never depend on LLM outputs.

LLMs perform language understanding.

The Procurement Knowledge Model represents structured intelligence.

The Decision Engine performs deterministic procurement reasoning.

The Retrieval Engine provides evidence.

The Explanation Agent converts structured decisions into natural language.

Every recommendation must be reproducible, explainable, and supported by evidence.

END OF SPEC