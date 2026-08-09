# 10_FOLDER_STRUCTURE.md

# AI Procurement Intelligence Copilot

## Monorepo Folder Structure

Version: 1.0

---

# Purpose

This document defines the complete folder structure for the project.

Every folder has a single responsibility.

This architecture is optimized for:

- FastAPI
- Next.js 15
- LangGraph
- Supabase
- RAG
- Enterprise Maintainability

---

# Monorepo Structure

```

procurement-intelligence-copilot/

│

├── frontend/

├── backend/

├── docs/

├── scripts/

├── docker/

├── .github/

├── .env.example

├── docker-compose.yml

├── README.md

└── Makefile

```

---

# Frontend

```

frontend/

│

├── app/

├── components/

├── hooks/

├── services/

├── store/

├── providers/

├── lib/

├── types/

├── styles/

├── public/

├── middleware.ts

├── next.config.ts

├── tailwind.config.ts

├── tsconfig.json

└── package.json

```

---

# App Router

```

app/

layout.tsx

page.tsx

loading.tsx

error.tsx

not-found.tsx

```

---

# Routes

```

app/

dashboard/

projects/

[id]/

upload/

analysis/

comparison/

chat/

report/

settings/

```

---

# Components

```

components/

layout/

ui/

dashboard/

upload/

analysis/

comparison/

chat/

report/

shared/

charts/

forms/

```

---

# UI Components

```

ui/

button.tsx

card.tsx

badge.tsx

dialog.tsx

table.tsx

tooltip.tsx

alert.tsx

tabs.tsx

input.tsx

textarea.tsx

progress.tsx

skeleton.tsx

```

Use shadcn/ui.

Never reinvent components.

---

# Dashboard Components

```

dashboard/

overview-card.tsx

stats-grid.tsx

recent-projects.tsx

quick-actions.tsx

processing-status.tsx

```

---

# Upload Components

```

upload/

upload-zone.tsx

upload-progress.tsx

file-card.tsx

file-list.tsx

validation-card.tsx

```

---

# Analysis Components

```

analysis/

recommendation-card.tsx

supplier-table.tsx

constraint-table.tsx

score-breakdown.tsx

evidence-panel.tsx

```

---

# Chat Components

```

chat/

chat-window.tsx

chat-input.tsx

message.tsx

typing.tsx

source-card.tsx

```

---

# Report Components

```

report/

report-viewer.tsx

summary.tsx

ranking.tsx

download-button.tsx

```

---

# Hooks

```

hooks/

useProjects.ts

useUpload.ts

useAnalysis.ts

useChat.ts

useSuppliers.ts

useScenario.ts

```

---

# Services

Frontend API clients.

```

services/

project.service.ts

upload.service.ts

analysis.service.ts

chat.service.ts

supplier.service.ts

report.service.ts

```

No fetch() inside components.

---

# Zustand Store

```

store/

auth.store.ts

project.store.ts

upload.store.ts

chat.store.ts

theme.store.ts

analysis.store.ts

```

---

# Backend

```

backend/

app/

tests/

requirements.txt

alembic/

Dockerfile

```

---

# Backend App

```

app/

main.py

config/

core/

api/

database/

models/

schemas/

repositories/

services/

agents/

langgraph/

decision_engine/

retrieval/

parser/

ocr/

embeddings/

prompts/

middleware/

storage/

utils/

exceptions/

dependencies/

```

---

# API

```

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

```

---

# Database

```

database/

base.py

session.py

migrations/

seed.py

```

---

# Models

```

models/

project.py

document.py

chunk.py

requirement.py

supplier.py

quote.py

certification.py

score.py

analysis.py

chat.py

```

---

# Schemas

```

schemas/

project.py

upload.py

supplier.py

analysis.py

chat.py

report.py

```

---

# Repositories

```

repositories/

project_repository.py

supplier_repository.py

document_repository.py

analysis_repository.py

```

---

# Services

```

services/

project_service.py

upload_service.py

analysis_service.py

supplier_service.py

chat_service.py

report_service.py

scenario_service.py

```

Services orchestrate logic.

---

# Parser

```

parser/

pdf_parser.py

docx_parser.py

xlsx_parser.py

image_parser.py

cleaner.py

chunker.py

```

---

# OCR

```

ocr/

ocr_service.py

tesseract.py

fallback.py

```

OCR only used when necessary.

---

# Embeddings

```

embeddings/

embedding_service.py

vector_store.py

metadata.py

```

---

# Retrieval

```

retrieval/

retriever.py

reranker.py

context_builder.py

citation.py

```

---

# Decision Engine

```

decision_engine/

constraint_validator.py

cost_engine.py

risk_engine.py

score_engine.py

ranking_engine.py

recommendation_engine.py

scenario_engine.py

```

Pure Python.

No LLMs.

---

# Agents

```

agents/

classifier.py

requirement_agent.py

supplier_agent.py

explanation_agent.py

chat_agent.py

```

Each file

=

One AI responsibility.

---

# LangGraph

```

langgraph/

workflow.py

nodes.py

edges.py

state.py

router.py

```

---

# Prompt Library

```

prompts/

classifier.md

requirements.md

supplier.md

summary.md

chat.md

citations.md

explanation.md

```

No inline prompts.

---

# Storage

```

storage/

supabase.py

bucket.py

```

---

# Middleware

```

middleware/

auth.py

logging.py

request_id.py

```

---

# Utils

```

utils/

currency.py

dates.py

validators.py

formatters.py

constants.py

```

---

# Tests

```

tests/

api/

services/

decision_engine/

retrieval/

agents/

integration/

fixtures/

```

---

# Scripts

```

scripts/

seed_database.py

generate_embeddings.py

reset_project.py

cleanup_storage.py

```

---

# Docker

```

docker/

backend.Dockerfile

frontend.Dockerfile

```

---

# GitHub

```

.github/

workflows/

ci.yml

lint.yml

```

---

# Documentation

```

docs/

00_PROJECT_OVERVIEW.md

01_PROBLEM_STATEMENT.md

02_SYSTEM_ARCHITECTURE.md

03_DATABASE_SCHEMA.md

04_BACKEND_ARCHITECTURE.md

05_LANGGRAPH_WORKFLOW.md

06_API_SPECIFICATION.md

07_FRONTEND_ARCHITECTURE.md

08_RAG_PIPELINE.md

09_DECISION_ENGINE.md

10_FOLDER_STRUCTURE.md

11_PROMPT_LIBRARY.md

12_SUPABASE_SETUP.md

13_FASTAPI_IMPLEMENTATION.md

14_NEXTJS_IMPLEMENTATION.md

15_DEPLOYMENT.md

16_HACKATHON_EXECUTION_PLAN.md

```

---

# Naming Convention

Python

snake_case

Classes

PascalCase

React Components

PascalCase

Hooks

camelCase

Files

snake_case.py

TypeScript

kebab-case.ts

---

# Code Organization Rules

One class

↓

One responsibility

One file

↓

One feature

No circular imports

No duplicated logic

No business logic inside routes

No prompts inside services

---

# Import Direction

```

API

↓

Services

↓

Repositories

↓

Database

```

Never reverse.

---

# Module Dependency Rules

Frontend never imports backend.

Decision Engine never imports LangGraph.

Repositories never call AI.

Agents never call SQL.

LangGraph orchestrates.

Services coordinate.

Repositories persist.

---

# Environment Files

Frontend

```

.env.local

```

Backend

```

.env

```

Never commit secrets.

---

# Root Files

README.md

Project documentation

Makefile

Common commands

docker-compose.yml

Local development

.env.example

Required environment variables

---

# Folder Structure Philosophy

The folder structure follows clean architecture principles.

Each directory owns one responsibility.

AI orchestration, procurement logic, persistence, presentation and infrastructure remain isolated.

This separation makes the project easier to understand, faster to develop during the hackathon and significantly easier to extend after the event.
