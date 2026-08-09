# 04_BACKEND_ARCHITECTURE.md

# AI Procurement Intelligence Copilot

## Backend Architecture

Version 1.0

---

# Purpose

This document defines the backend architecture of the Procurement Intelligence Copilot.

The backend is responsible for:

- Authentication
- File Upload
- Document Processing
- AI Orchestration
- Procurement Intelligence
- Supplier Ranking
- RAG
- Chat
- Report Generation

The backend follows a modular service-oriented architecture.

Business logic is isolated from HTTP routes.

AI logic is isolated from business logic.

---

# Technology Stack

Language

Python 3.12+

Framework

FastAPI

ORM

SQLAlchemy 2.0

Validation

Pydantic V2

Database

Supabase PostgreSQL

Vector Search

pgvector

Authentication

Supabase Auth JWT

AI

LangGraph

LangChain

OpenAI

Background Tasks

FastAPI BackgroundTasks

Storage

Supabase Storage

Logging

Structlog

---

# Folder Structure

backend/

app/

```
api/
core/
config/
database/
models/
schemas/
repositories/
services/
agents/
langgraph/
prompts/
decision_engine/
retrieval/
embeddings/
ocr/
parser/
utils/
middleware/
dependencies/
exceptions/
storage/
tests/
main.py
```

---

# Folder Responsibilities

---

## api/

Contains HTTP routes.

No business logic.

Only

- Request validation
- Dependency Injection
- Calling services
- Returning responses

---

## models/

SQLAlchemy models.

One file per table.

Example

```
project.py

document.py

supplier.py

quote.py
```

---

## schemas/

Pydantic schemas.

Separate

Create

Update

Read

Response

Never expose ORM models directly.

---

## repositories/

Database layer.

Responsible only for SQL.

No AI.

No business logic.

Example

```
ProjectRepository

SupplierRepository

QuoteRepository
```

---

## services/

Application services.

Contains business logic.

Example

```
UploadService

SupplierService

ProjectService

AnalysisService
```

Routes call services.

Services call repositories.

---

## parser/

Responsible for document parsing.

Supported

PDF

DOCX

XLSX

TXT

Returns

Clean text

Metadata

Page mapping

---

## ocr/

Only used if parser cannot extract text.

Workflow

Image PDF

↓

OCR

↓

Text

---

## embeddings/

Creates embeddings.

Responsibilities

Chunk text

Generate vectors

Store vectors

No retrieval here.

---

## retrieval/

Semantic search.

Responsibilities

Similarity search

Metadata filtering

Evidence retrieval

Citation generation

---

## decision_engine/

Most important module.

Contains deterministic procurement logic.

Modules

Constraint Validator

Supplier Scorer

Ranking Engine

Scenario Engine

Recommendation Engine

This module NEVER calls the LLM.

---

## prompts/

Stores all prompts.

Never hardcode prompts.

Example

```
supplier_extraction.md

requirement_extraction.md

chat.md

summary.md

explanation.md
```

---

## agents/

Contains specialized AI agents.

Document Classifier

Requirement Extractor

Supplier Extractor

Evidence Generator

Explanation Generator

Chat Agent

Each agent has one responsibility.

---

## langgraph/

Contains workflow orchestration.

No business logic.

Only

Workflow

State

Routing

Retries

Parallel execution

---

## middleware/

Authentication

Logging

Request ID

Rate limiting

---

## utils/

Shared utilities

Date parsing

Currency parsing

Validators

Formatting

---

# Request Lifecycle

Upload Request

↓

Authentication

↓

Validation

↓

Storage

↓

Parser

↓

Extraction

↓

Embeddings

↓

Database

↓

Decision Engine

↓

Analysis

↓

Response

---

# API Layer

Routes remain thin.

Example

```
POST /upload

↓

UploadService.process()
```

Never

```
POST

↓

Database

↓

LLM

↓

Business Logic

```

inside routes.

---

# Service Layer

Example

```
UploadService

↓

DocumentParser

↓

EntityExtractor

↓

ChunkGenerator

↓

EmbeddingService

↓

Database

```

Every service performs one task.

---

# Repository Layer

Repositories hide SQL.

Instead of

```
session.query(...)
```

inside services

Use

```
SupplierRepository.get_quotes()

```

Cleaner architecture.

---

# Dependency Injection

FastAPI Depends()

Inject

Database

Current User

Repositories

Configuration

Never create dependencies manually.

---

# Configuration

Environment Variables

```
OPENAI_API_KEY

SUPABASE_URL

SUPABASE_KEY

DATABASE_URL

JWT_SECRET

EMBEDDING_MODEL

CHAT_MODEL

OCR_PROVIDER

```

Loaded once.

Never use os.getenv throughout the project.

---

# Error Handling

Global Exception Handler

Categories

Validation Error

Authentication Error

AI Error

OCR Error

Database Error

Unexpected Error

Return consistent JSON.

---

# Logging

Every request receives

Request ID

Log

User

Endpoint

Execution Time

Errors

AI Calls

Decision Score

Never print().

---

# File Upload Pipeline

User Upload

↓

Virus Check

↓

Validation

↓

Storage

↓

Database Record

↓

Background Processing

↓

Extraction

↓

Analysis

↓

Ready

---

# AI Pipeline

Document

↓

Parser

↓

Classifier

↓

Requirement Extractor

↓

Supplier Extractor

↓

Chunking

↓

Embeddings

↓

Database

↓

Decision Engine

↓

Explanation

---

# Decision Engine Pipeline

Requirements

↓

Supplier Data

↓

Constraint Validation

↓

Score Calculation

↓

Ranking

↓

Recommendation

↓

Evidence

↓

Explanation

The LLM never calculates scores.

Only explains them.

---

# Chat Pipeline

Question

↓

Embedding

↓

Vector Search

↓

Relevant Chunks

↓

Prompt Builder

↓

LLM

↓

Grounded Response

↓

Return Sources

---

# Background Jobs

Long-running tasks execute asynchronously.

Examples

OCR

Embeddings

Chunking

Large Document Parsing

Report Generation

Users should never wait for heavy processing.

---

# Security

Validate every upload.

Reject unsupported file types.

Limit upload size.

Sanitize filenames.

Verify JWT.

Enforce RLS.

Mask secrets.

---

# Performance Goals

Upload

<3 seconds

Parsing

<10 seconds

Embeddings

<15 seconds

Ranking

<1 second

Chat

<4 seconds

---

# Coding Principles

One responsibility per class.

One responsibility per function.

Maximum reuse.

No duplicate business logic.

No AI inside routes.

No SQL inside routes.

No prompts inside services.

No business logic inside LangGraph.

---

# Backend Philosophy

The backend is responsible for building a reliable procurement intelligence platform.

It separates deterministic procurement logic from probabilistic AI reasoning.

Business decisions are always reproducible.

LLMs enhance explanations—not authority.

The backend remains modular, testable, and production-ready while staying simple enough to implement during a 36-hour hackathon.
