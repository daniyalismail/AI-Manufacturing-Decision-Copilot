# 13_SUPABASE_SETUP.md

# AI Procurement Intelligence Copilot

## Supabase Setup Guide

Version 1.0

---

# Purpose

This document defines the complete Supabase architecture used by the Procurement Intelligence Copilot.

Supabase provides

- Authentication
- PostgreSQL Database
- pgvector
- Object Storage
- Row Level Security
- Realtime (optional)

Supabase is treated as infrastructure only.

Business logic never belongs inside Supabase.

---

# Project Structure

Supabase Project

│

├── PostgreSQL

├── Storage

├── Auth

├── pgvector

├── RLS

└── Edge Functions (Future)

---

# Required Extensions

Enable

pgvector

uuid-ossp

pgcrypto

---

# Authentication

Provider

Email Password

Optional

Google OAuth

GitHub OAuth

Anonymous authentication

Disabled

---

# Storage Buckets

documents/

Stores

PDF

DOCX

Images

Excel

Private Bucket

Only owner can access files.

---

reports/

Stores

Generated PDF Reports

Private

---

exports/

Stores

CSV

JSON

Temporary downloads

---

# Folder Structure

documents/

project_uuid/

requirement.pdf

supplier_quote.pdf

supplier_profile.pdf

---

# PostgreSQL

Tables

projects

documents

document_chunks

requirements

suppliers

supplier_quotes

supplier_scores

relationships

analysis_reports

chat_sessions

chat_messages

---

# Vector Storage

Table

document_chunks

Contains

chunk_text

embedding

metadata

Use pgvector

Vector Dimension

3072

(OpenAI text-embedding-3-large)

---

# Recommended Index

HNSW

Reason

Fast semantic search

Large datasets

---

# Row Level Security

Enabled

For every table.

Policy

User owns Project

↓

User owns Documents

↓

User owns Analysis

↓

User owns Reports

↓

User owns Chat

No cross-user access.

---

# Object Storage Policy

User

↓

Project Folder

↓

Own Documents Only

Uploads verified by JWT.

---

# JWT

Frontend

↓

Supabase Auth

↓

JWT

↓

FastAPI

↓

Verify Token

↓

Current User

Never trust frontend IDs.

---

# Database Migrations

Use

Alembic

Never modify production schema manually.

---

# Seed Data

scripts/

seed_database.py

Creates

Demo Project

Demo Supplier

Demo Requirements

Useful during development.

---

# Connection

Backend

↓

SQLAlchemy Async

↓

Supabase PostgreSQL

No direct SQL inside routes.

---

# Environment Variables

DATABASE_URL

SUPABASE_URL

SUPABASE_ANON_KEY

SUPABASE_SERVICE_KEY

SUPABASE_STORAGE_BUCKET

OPENAI_API_KEY

---

# Storage Flow

Upload

↓

Supabase Storage

↓

Document Record

↓

Parser

↓

Extraction

↓

PKM

---

# Security

Maximum Upload

25MB

Allowed

PDF

DOCX

XLSX

PNG

JPEG

Reject

ZIP

EXE

JS

BAT

SH

---

# Backups

Daily

Automatic

Future

Point In Time Recovery

---

# Local Development

Supabase CLI

Docker

Migration Support

Seed Support

---

# Philosophy

Supabase is the infrastructure layer.

It stores facts.

It authenticates users.

It serves files.

It never contains procurement intelligence.

Business intelligence belongs to the Procurement Knowledge Model.
