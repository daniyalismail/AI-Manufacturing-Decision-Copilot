# 05_LANGGRAPH_WORKFLOW.md

# AI Procurement Intelligence Copilot

## LangGraph Workflow Design

Version 1.0

---

# Purpose

This document defines the AI orchestration architecture using LangGraph.

The Procurement Intelligence Copilot is not powered by a single LLM prompt.

Instead, it is composed of multiple specialized AI agents coordinated through LangGraph.

Every agent performs one clearly defined responsibility.

The workflow is deterministic where possible and AI-assisted where necessary.

---

# Why LangGraph?

Traditional LLM applications follow:

User

↓

Single Prompt

↓

LLM

↓

Answer

This approach becomes difficult to maintain as complexity grows.

Instead we use a graph.

Benefits

✓ Modular

✓ Retry Support

✓ Parallel Execution

✓ Better Debugging

✓ Replaceable Agents

✓ Structured State

✓ Human Review Ready

---

# Overall Workflow

```

                Upload Documents

                        │

                        ▼

              Document Parser

                        │

                        ▼

          Document Classification Agent

                        │

        ┌───────────────┴───────────────┐

        ▼                               ▼

Requirement Agent              Supplier Agent

        │                               │

        └───────────────┬───────────────┘

                        ▼

          Procurement Knowledge Builder

                        │

                        ▼

             Chunk + Embedding Generator

                        │

                        ▼

             Vector Database (pgvector)

                        │

                        ▼

             Decision Engine (Rules)

                        │

                        ▼

             Evidence Retrieval Agent

                        │

                        ▼

          Explanation Generation Agent

                        │

                        ▼

                 Final Dashboard

```

---

# Why Multiple Agents?

Different AI tasks require different prompts.

One large prompt reduces accuracy.

Instead:

Classifier

↓

Extractor

↓

Validator

↓

Retriever

↓

Explainer

Each agent is optimized independently.

---

# LangGraph State

The graph shares a common state.

```python
GraphState

project_id

documents

parsed_documents

classified_documents

requirements

suppliers

chunks

embeddings

retrieved_context

decision_result

recommendation

citations

errors

metadata

```

Each node updates the shared state.

No node modifies unrelated fields.

---

# Node 1

Document Parser

Input

Uploaded files

Output

Structured text

Responsibilities

- Read PDF
- Read DOCX
- Read XLSX
- Extract pages
- Preserve formatting
- Preserve page numbers

No AI used.

---

# Node 2

Document Classification Agent

Purpose

Determine document type.

Possible Classes

Requirement

Supplier Quote

Supplier Profile

Certification

Commercial Terms

BOM

Output

```json
{
  "document_type":"Supplier Quote",
  "confidence":0.97
}
```

---

# Node 3

Requirement Extraction Agent

Reads only

Requirement documents.

Extracts

- MOQ
- Materials
- Lead Time
- Certifications
- Tolerances
- Constraints

Output

Structured JSON.

---

# Node 4

Supplier Extraction Agent

Reads

Supplier documents.

Extracts

Supplier

Country

Capabilities

Capacity

Price

MOQ

Lead Time

Currency

Incoterms

Payment Terms

Certifications

Output

Supplier Profile JSON.

---

# Parallel Execution

Requirement extraction

and

Supplier extraction

run simultaneously.

This reduces processing time.

```

Parser

↓

Classifier

↓

──────────────

│            │

▼            ▼

Requirements Supplier

│            │

──────────────

↓

Merge

```

---

# Node 5

Knowledge Builder

Combines

Requirements

+

Supplier Profiles

into one structured procurement model.

No LLM reasoning.

Only normalization.

---

# Node 6

Chunk Generator

Creates semantic chunks.

Each chunk contains

Text

↓

Metadata

↓

Page Number

↓

Supplier

↓

Document Type

↓

Section

---

# Node 7

Embedding Generator

Generates vector embeddings.

Stores

Embedding

+

Metadata

into pgvector.

---

# Node 8

Decision Engine

This is NOT an AI node.

It is deterministic.

Responsibilities

Constraint Validation

↓

Scoring

↓

Ranking

↓

Recommendation

↓

Confidence

Business logic lives here.

---

# Decision Example

Requirement

MOQ >=1000

Supplier

MOQ 500

Result

FAILED

No LLM involved.

---

# Node 9

Evidence Retrieval Agent

Purpose

Collect evidence supporting the recommendation.

Example

Requirement

↓

Requirement.pdf

↓

Page 3

↓

Paragraph 2

Supplier Price

↓

Quote.pdf

↓

Page 5

↓

Table

All citations are stored.

---

# Node 10

Explanation Agent

Input

Decision Engine Output

+

Evidence

Output

Natural language explanation.

Example

Supplier B is recommended because it satisfies all mandatory requirements while maintaining the best balance between cost and delivery time.

Every claim must reference retrieved evidence.

---

# Chat Workflow

```

User Question

↓

Embedding

↓

Similarity Search

↓

Retrieved Chunks

↓

Prompt Builder

↓

LLM

↓

Grounded Response

↓

Sources

```

The chat agent never answers without retrieved context.

---

# Graph Entry Point

Upload Documents

↓

Parser

↓

Classifier

↓

Extraction

---

# Graph Exit Point

Analysis Report

+

Recommendation

+

Evidence

+

Dashboard

---

# Conditional Routing

Example

If OCR Required

↓

OCR Node

Else

↓

Parser

Another Example

If Document Type Unknown

↓

Classification Retry

Else

↓

Continue

---

# Retry Strategy

Retry

Maximum

2 attempts

Applies to

Classification

Extraction

Explanation

Never retry

Decision Engine

---

# Failure Recovery

If Classification fails

↓

Manual "Unknown"

If Extraction fails

↓

Partial Analysis

If Embeddings fail

↓

Keyword Search

If LLM unavailable

↓

Decision Engine only

System should degrade gracefully.

---

# Human in the Loop

Future Extension

After Decision Engine

↓

Human Review

↓

Approve

↓

Generate Report

Not required for MVP.

---

# Memory

The graph uses short-lived execution state.

Persistent memory is stored in PostgreSQL.

The graph remains stateless.

---

# Prompt Isolation

Each node owns its own prompt.

Example

```
classifier.md

requirement_extractor.md

supplier_extractor.md

chat.md

explanation.md
```

Prompts are never shared.

---

# Structured Outputs

Every AI node returns JSON.

Example

```json
{
 "supplier":"ABC",
 "lead_time":18,
 "currency":"USD"
}
```

Never return raw paragraphs.

---

# Agent Responsibilities

| Agent | Responsibility |
|---------|----------------|
| Parser | Read Documents |
| Classifier | Identify Document Type |
| Requirement Agent | Extract Requirements |
| Supplier Agent | Extract Supplier Data |
| Knowledge Builder | Normalize Procurement Data |
| Chunk Generator | Create Chunks |
| Embedding Agent | Generate Vectors |
| Decision Engine | Rank Suppliers |
| Retrieval Agent | Collect Evidence |
| Explanation Agent | Explain Recommendation |
| Chat Agent | Procurement QA |

---

# Why This Architecture Wins

Traditional Hackathon Project

Upload

↓

LLM

↓

Summary

Our Architecture

Upload

↓

Parser

↓

Classifier

↓

Extraction

↓

Knowledge Graph

↓

Decision Engine

↓

Evidence Retrieval

↓

Explanation

↓

Chat

↓

Scenario Analysis

This architecture separates understanding, reasoning, retrieval, and explanation into independent stages, making the platform explainable, maintainable, and scalable.

---

# LangGraph Philosophy

LangGraph is used as an orchestration engine—not as a reasoning engine.

Reasoning is distributed across specialized agents.

Business decisions remain deterministic.

LLMs are responsible for understanding language and generating explanations, while procurement logic remains transparent, reproducible, and fully auditable.
