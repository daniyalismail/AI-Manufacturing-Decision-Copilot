# 03_DATABASE_SCHEMA.md

# AI Procurement Intelligence Copilot

## Database Design

Version: 1.0

---

# Purpose

This document defines the complete relational database architecture for the Procurement Intelligence Copilot.

The database is designed to:

- Store procurement projects
- Store uploaded documents
- Store extracted procurement entities
- Store supplier information
- Store AI analysis
- Store recommendations
- Store chat history
- Store evidence references

The schema is normalized while remaining simple enough for a 36-hour hackathon.

---

# Database Technology

Database

Supabase PostgreSQL

Extensions

- pgvector
- uuid-ossp

Authentication

Supabase Auth

Storage

Supabase Storage Buckets

---

# Database Overview

```

User

│

├── Projects

│

├── Documents

│ │

│ ├── Chunks

│ ├── Embeddings

│ └── Extracted Entities

│

├── Suppliers

│ │

│ ├── Quotes

│ ├── Certifications

│ └── Scores

│

├── Requirements

│

├── Analysis

│

└── Chat Sessions

```

---

# Table 1

users

Managed by Supabase Auth.

Additional profile data may be stored separately if required.

Fields

id UUID

email

name

created_at

---

# Table 2

projects

Represents one procurement project.

Example

Project

"Motor Housing Procurement"

Fields

id UUID

user_id UUID

title

description

status

created_at

updated_at

Relationships

One User

↓

Many Projects

---

# Table 3

documents

Stores uploaded procurement documents.

Fields

id UUID

project_id UUID

file_name

document_type

storage_path

mime_type

file_size

page_count

processing_status

created_at

Document Types

Requirement

BOM

Supplier Quote

Supplier Profile

Certification

Commercial Terms

Unknown

---

# Table 4

document_chunks

Stores semantic chunks for RAG.

Fields

id UUID

document_id UUID

page_number

chunk_index

chunk_text

token_count

embedding VECTOR

metadata JSONB

Each chunk represents one searchable document section.

---

# Table 5

requirements

Stores extracted procurement requirements.

Example

Material

Aluminum

MOQ

1000

Lead Time

20 Days

Fields

id UUID

project_id UUID

requirement_name

requirement_value

requirement_type

mandatory BOOLEAN

confidence

source_chunk_id

---

# Table 6

suppliers

Stores supplier information.

Fields

id UUID

project_id UUID

supplier_name

country

website

currency

overall_score

recommendation_rank

status

Status

Qualified

Rejected

Pending

---

# Table 7

supplier_quotes

Stores quotation details.

Fields

id UUID

supplier_id UUID

currency

unit_price

minimum_order_quantity

lead_time_days

payment_terms

incoterms

tooling_cost

shipping_cost

quote_date

source_chunk_id

---

# Table 8

supplier_certifications

Fields

id UUID

supplier_id UUID

certification_name

certification_number

valid_until

verified

source_chunk_id

Example

ISO9001

ISO14001

CE

RoHS

---

# Table 9

supplier_capabilities

Stores manufacturing capabilities.

Fields

id UUID

supplier_id UUID

capability

value

confidence

source_chunk_id

Examples

Material

Tolerance

Machine Type

Production Capacity

Surface Finish

---

# Table 10

supplier_scores

Stores calculated scores.

Fields

id UUID

supplier_id UUID

cost_score

quality_score

lead_time_score

risk_score

sustainability_score

overall_score

ranking

calculated_at

These scores are produced by the Decision Engine.

Never manually edited.

---

# Table 11

constraint_validation

Stores requirement validation results.

Fields

id UUID

supplier_id UUID

requirement_id UUID

status

expected_value

actual_value

reason

source_chunk_id

Status

Passed

Failed

Missing

This table powers the Explainability Engine.

---

# Table 12

analysis_reports

Stores complete AI analysis.

Fields

id UUID

project_id UUID

summary

recommended_supplier

confidence

generated_at

analysis_json JSONB

The JSON contains the full reasoning output.

---

# Table 13

chat_sessions

Stores procurement chat sessions.

Fields

id UUID

project_id UUID

title

created_at

---

# Table 14

chat_messages

Fields

id UUID

session_id UUID

role

message

sources JSONB

created_at

Role

User

Assistant

---

# Relationships

```

User

↓

Projects

↓

Documents

↓

Chunks

↓

Requirements

↓

Suppliers

↓

Quotes

↓

Scores

↓

Analysis

↓

Chat

```

---

# Storage Bucket

documents

Stores

PDF

DOCX

Images

Excel

Storage Path

```

projects/

project_id/

filename.pdf

```

---

# Embedding Strategy

Only document_chunks contain embeddings.

Why?

Searching entire documents is inefficient.

Chunks improve retrieval accuracy.

Each chunk stores

Text

↓

Embedding

↓

Metadata

↓

Page Number

↓

Document ID

---

# Metadata Example

```

{

"page":4,

"section":"Commercial Terms",

"supplier":"ABC Industries",

"document_type":"Supplier Quote"

}

```

Metadata enables filtered retrieval.

---

# Soft Deletes

Instead of deleting records,

use

deleted_at

Future feature.

Not required for MVP.

---

# Indexes

Projects

user_id

Documents

project_id

Chunks

document_id

Requirements

project_id

Suppliers

project_id

Quotes

supplier_id

Scores

supplier_id

Chat

project_id

Vector

HNSW Index

for embeddings.

---

# Row Level Security

Supabase RLS

Every user can only access

their own

Projects

Documents

Analysis

Chats

Suppliers

---

# JSON Usage

Only use JSONB where structure varies.

Examples

analysis_json

metadata

sources

Everything else should remain relational.

---

# Why Relational Database?

Procurement data has many relationships.

Supplier

↓

Quote

↓

Certification

↓

Score

↓

Validation

↓

Recommendation

SQL is ideal for these joins.

---

# Scalability

Future additions

contracts

purchase_orders

risk_assessments

erp_integrations

supplier_history

audit_logs

notifications

No redesign required.

---

# MVP Tables

Only these are required for the hackathon.

✓ projects

✓ documents

✓ document_chunks

✓ requirements

✓ suppliers

✓ supplier_quotes

✓ supplier_scores

✓ constraint_validation

✓ analysis_reports

✓ chat_sessions

✓ chat_messages

Everything else is optional.

---

# Database Philosophy

The database stores structured procurement knowledge.

LLMs generate insights.

The database remains the source of truth.

Business logic never depends solely on LLM outputs.

Every recommendation must be reproducible from stored procurement data.
