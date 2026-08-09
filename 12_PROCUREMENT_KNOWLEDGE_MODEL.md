# 12_PROCUREMENT_KNOWLEDGE_MODEL.md

# AI Procurement Intelligence Copilot

## Procurement Knowledge Model (PKM)

Version: 1.0

---

# Purpose

The Procurement Knowledge Model (PKM) is the canonical in-memory representation of a procurement project.

It acts as the single source of truth for procurement reasoning.

Instead of allowing downstream services to repeatedly query raw documents or database tables, every AI extraction is converted into a structured Procurement Knowledge Model.

All business logic operates on this model.

The database stores facts.

The PKM connects those facts.

---

# Why PKM?

Without PKM

```

PDF

↓

SQL

↓

LLM

↓

SQL

↓

Rules

↓

SQL

↓

Report

```

Every component repeatedly queries the database.

Logic becomes duplicated.

Relationships become hidden.

---

With PKM

```

PDF

↓

Extraction

↓

Procurement Knowledge Model

↓

Constraint Engine

↓

Decision Engine

↓

Scenario Engine

↓

Explanation

↓

Report

```

Everything uses one shared model.

---

# Core Principles

The PKM must be

- Deterministic
- Serializable
- Explainable
- Immutable during scoring
- Independent from LLMs
- Independent from database schema

---

# Root Object

```

ProcurementProject

├── Documents

├── Requirements

├── Suppliers

├── Relationships

├── Evidence

├── Scores

└── Recommendation

```

Every object belongs to one project.

---

# ProcurementProject

```python

class ProcurementProject:

    id

    title

    documents

    requirements

    suppliers

    relationships

    evidence

    recommendation

    metadata

```

This is the root object passed into every engine.

---

# Requirement Model

```python

Requirement

id

name

operator

expected_value

unit

mandatory

priority

category

confidence

evidence_ids

```

Example

```

MOQ

>=1000

mandatory=True

```

---

# Supplier Model

```python

Supplier

id

name

country

currency

quotes

certifications

capabilities

scores

metadata

```

The supplier object owns supplier-specific data only.

---

# Quote Model

```python

Quote

unit_price

currency

MOQ

lead_time

payment_terms

incoterms

tooling

shipping

```

---

# Certification Model

```python

Certification

name

number

expiry

issuer

verified

confidence

```

---

# Capability Model

```python

Capability

name

value

unit

confidence

```

Example

Material

Tolerance

Surface Finish

Machine Type

Production Capacity

---

# Evidence Model

Evidence is a first-class object.

```python

Evidence

id

document_id

page

chunk

text

confidence

metadata

```

Everything references evidence.

Nothing references raw text.

---

# Relationship Model

The most important object.

```python

Relationship

supplier_id

requirement_id

status

reason

evidence_ids

confidence

```

Example

```

Supplier A

↓

Requirement MOQ

↓

PASS

```

Another

```

Supplier B

↓

Lead Time

↓

FAIL

```

This enables instant explainability.

---

# Score Model

```python

SupplierScore

cost

quality

risk

lead_time

sustainability

overall

confidence

```

No text.

Numbers only.

---

# Recommendation Model

```python

Recommendation

supplier_id

rank

summary

confidence

strengths

weaknesses

```

Generated after scoring.

---

# Metadata Model

Stores

Version

Model

Extraction Date

Project Metadata

Nothing business-critical.

---

# PKM Lifecycle

```

Documents

↓

Parser

↓

Extraction

↓

Knowledge Builder

↓

PKM

↓

Decision Engine

↓

Recommendation

```

---

# Knowledge Builder

Responsible for constructing PKM.

Input

Extraction JSON

Output

ProcurementProject

Responsibilities

Normalize

Deduplicate

Validate

Link Evidence

Build Relationships

No scoring.

---

# Relationship Builder

Creates semantic links.

Examples

Supplier

↓

Quote

Requirement

↓

Evidence

Supplier

↓

Certification

Supplier

↓

Requirement

Supplier

↓

Score

Every relation becomes explicit.

---

# Validation Stage

Before scoring

PKM Validation

Checks

Duplicate Suppliers

Duplicate Requirements

Missing Evidence

Invalid Currency

Broken References

Incomplete Objects

Scoring starts only after validation.

---

# Query API

Every service queries PKM.

Examples

```

get_supplier()

get_requirements()

get_relationships()

get_failed_constraints()

get_recommendation()

```

Never expose internal collections.

---

# Constraint Queries

Examples

```

All Failed Constraints

↓

Supplier

↓

Evidence

```

```

All Missing Certifications

↓

Supplier

↓

Reason

```

No SQL joins required.

---

# Scenario Queries

Example

```

Recalculate

↓

Weights

↓

Supplier Scores

```

Relationships remain unchanged.

Only scores update.

---

# Explainability

Every recommendation is produced from

Recommendation

↓

Relationships

↓

Evidence

↓

Chunks

↓

Documents

Traceability becomes automatic.

---

# Serialization

PKM can be serialized as

JSON

or

Pydantic

Example

```

ProcurementProject

↓

JSON

↓

Cache

↓

Restore

```

Useful for background jobs.

---

# Persistence

Database

↓

Load

↓

PKM

↓

Business Logic

↓

Updated Scores

↓

Database

Database is storage.

PKM is intelligence.

---

# Integration

Decision Engine

↓

Reads PKM

Scenario Engine

↓

Reads PKM

Chat

↓

Reads PKM

Reports

↓

Reads PKM

Explanation

↓

Reads PKM

One model.

Many consumers.

---

# Benefits

Instead of

Documents

↓

Tables

↓

SQL

↓

Business Logic

We have

Documents

↓

Knowledge Model

↓

Business Logic

Advantages

- Cleaner code
- Better testing
- Better explainability
- Easier debugging
- Easier scenario analysis
- Simpler API responses

---

# Future Extensions

Future versions may include

Supplier History

Contract Intelligence

Purchase Orders

Risk Signals

ERP Synchronization

Knowledge Graph Export

Neo4j Adapter

The PKM remains unchanged.

Only adapters evolve.

---

# Design Philosophy

The Procurement Knowledge Model is the central intelligence layer of the Procurement Intelligence Copilot.

It separates language understanding from procurement reasoning.

LLMs transform documents into structured knowledge.

The PKM transforms structured knowledge into connected procurement intelligence.

Business engines operate on the PKM.

Explanations reference the PKM.

Reports summarize the PKM.

The PKM is the foundation that makes the entire platform deterministic, explainable, auditable, and scalable.
