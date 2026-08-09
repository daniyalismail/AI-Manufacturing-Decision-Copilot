# 06_API_SPECIFICATION.md

# AI Procurement Intelligence Copilot

## REST API Specification

Version: 1.0

---

# Purpose

This document defines every REST endpoint required for the Procurement Intelligence Copilot.

The API follows REST principles.

Rules

- Stateless
- JWT Authentication
- JSON Responses
- Async Processing
- Consistent Error Format
- Versioned APIs

Base URL

/api/v1

---

# Authentication

Authentication is handled using Supabase JWT.

Every protected request includes

Authorization: Bearer <JWT>

Public Endpoints

- Health Check

Protected Endpoints

Everything else.

---

# Standard Response Format

Success

```json
{
  "success": true,
  "data": {},
  "message": "Operation completed."
}
```

---

Error

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid file type."
  }
}
```

---

# Health

GET

/health

Purpose

Service status.

Response

```json
{
  "status":"ok",
  "version":"1.0.0"
}
```

---

# Projects

## Create Project

POST

/projects

Request

```json
{
  "title":"Motor Housing Procurement",
  "description":"Supplier evaluation project"
}
```

Response

```json
{
  "project_id":"uuid"
}
```

---

## Get Projects

GET

/projects

Returns

All user projects.

---

## Get Project

GET

/projects/{project_id}

Returns

Project details.

---

## Delete Project

DELETE

/projects/{project_id}

Soft delete.

---

# Document Upload

POST

/projects/{project_id}/documents

Multipart Form

Fields

file

Supported

PDF

DOCX

XLSX

PNG

JPEG

Response

```json
{
  "document_id":"uuid",
  "status":"uploaded"
}
```

Upload only stores the file.

Processing happens asynchronously.

---

# Start Analysis

POST

/projects/{project_id}/analyze

Purpose

Starts AI pipeline.

Response

```json
{
  "analysis_id":"uuid",
  "status":"processing"
}
```

---

# Analysis Status

GET

/analysis/{analysis_id}

Returns

```json
{
  "status":"processing",
  "progress":65
}
```

Possible Status

Queued

Parsing

Extracting

Embedding

Scoring

Completed

Failed

---

# Analysis Result

GET

/analysis/{analysis_id}/result

Returns

```json
{
  "recommended_supplier":"ABC Industries",
  "confidence":0.94,
  "ranking":[]
}
```

---

# Supplier List

GET

/projects/{project_id}/suppliers

Returns

All suppliers.

---

# Supplier Details

GET

/suppliers/{supplier_id}

Returns

Supplier profile.

Includes

- Quote
- Certifications
- Capabilities
- Scores

---

# Supplier Comparison

POST

/projects/{project_id}/compare

Request

```json
{
  "supplier_ids":[
    "uuid1",
    "uuid2"
  ]
}
```

Response

```json
{
  "comparison":{}
}
```

---

# Requirements

GET

/projects/{project_id}/requirements

Returns

Extracted procurement requirements.

---

# Constraint Validation

GET

/projects/{project_id}/constraints

Returns

Passed

Failed

Missing

for every supplier.

---

# Recommendation

GET

/projects/{project_id}/recommendation

Response

```json
{
  "supplier":"ABC Industries",
  "score":94,
  "confidence":0.91,
  "summary":"..."
}
```

---

# Evidence

GET

/projects/{project_id}/evidence

Returns

```json
[
 {
   "document":"Quote.pdf",
   "page":5,
   "text":"..."
 }
]
```

---

# Procurement Chat

POST

/chat

Request

```json
{
  "project_id":"uuid",
  "message":"Why was Supplier B selected?"
}
```

Response

```json
{
  "answer":"...",
  "sources":[]
}
```

Sources contain

Document

Page

Chunk

Confidence

---

# Chat History

GET

/chat/{session_id}

Returns

Conversation.

---

# Scenario Analysis

POST

/projects/{project_id}/scenario

Request

```json
{
 "weights":{
   "cost":50,
   "quality":30,
   "lead_time":20
 }
}
```

Response

```json
{
 "ranking":[]
}
```

Decision Engine recalculates rankings.

No LLM required.

---

# Reports

GET

/projects/{project_id}/report

Returns

Complete procurement report.

Sections

Executive Summary

Supplier Ranking

Constraints

Evidence

Recommendations

---

# Download Report

GET

/projects/{project_id}/report/download

Returns

PDF.

---

# Dashboard

GET

/dashboard

Returns

Recent Projects

Completed Analysis

Pending Jobs

---

# Processing Jobs

GET

/jobs/{job_id}

Returns

```json
{
 "status":"processing",
 "progress":72
}
```

---

# Retry Processing

POST

/jobs/{job_id}/retry

Only failed jobs.

---

# Upload Validation

Allowed

PDF

DOCX

XLSX

PNG

JPEG

Maximum

25 MB

Reject

Executable

ZIP

Scripts

Unknown MIME types

---

# Status Codes

200

Success

201

Created

202

Accepted

400

Bad Request

401

Unauthorized

403

Forbidden

404

Not Found

409

Conflict

422

Validation Error

429

Rate Limit

500

Internal Error

---

# Pagination

Standard

?page=1&limit=20

Response

```json
{
 "items":[],
 "total":100,
 "page":1,
 "pages":5
}
```

---

# Filtering

Example

/projects/{id}/suppliers

Parameters

country

status

score

certification

Example

?country=China

---

# Sorting

Example

?sort=overall_score

?order=desc

---

# Security Rules

Every endpoint

- validates JWT
- checks project ownership
- validates UUID
- sanitizes input
- logs request

---

# Async Endpoints

Heavy operations

- OCR
- Embeddings
- AI Analysis
- Report Generation

Return immediately

Processing happens in background.

---

# Error Codes

```text
AUTH_REQUIRED

PROJECT_NOT_FOUND

DOCUMENT_NOT_FOUND

INVALID_FILE

OCR_FAILED

PARSING_FAILED

EMBEDDING_FAILED

LLM_ERROR

ANALYSIS_FAILED

SUPPLIER_NOT_FOUND

VALIDATION_ERROR

RATE_LIMIT
```

---

# API Versioning

Version

v1

Future

/api/v2

No breaking changes inside v1.

---

# OpenAPI

FastAPI automatically generates

/docs

and

/openapi.json

No manual documentation required.

---

# API Philosophy

The REST API is intentionally thin.

Endpoints orchestrate services.

Business logic lives inside the Service Layer.

AI orchestration lives inside LangGraph.

Procurement rules live inside the Decision Engine.

The API simply exposes a clean interface for the frontend while keeping the internal architecture modular, scalable, and easy to test.
