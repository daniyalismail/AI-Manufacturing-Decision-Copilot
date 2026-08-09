# ES-004

# Procurement Decision Engine Engineering Specification

Project

AI Procurement Intelligence Copilot

Version

1.0

Status

READY FOR IMPLEMENTATION

Priority

CRITICAL

---

# Objective

Implement a deterministic Procurement Decision Engine responsible for transforming structured procurement knowledge into explainable supplier recommendations.

This component is the core intelligence of the platform.

LLMs NEVER participate in supplier scoring.

LLMs NEVER calculate rankings.

LLMs NEVER validate constraints.

The Decision Engine is entirely deterministic.

---

# Responsibilities

The Decision Engine must

✓ Validate procurement requirements

✓ Evaluate supplier eligibility

✓ Calculate procurement scores

✓ Rank suppliers

✓ Generate recommendations

✓ Produce explainable decision artifacts

✓ Support scenario analysis

✓ Support future optimization engines

---

# Architecture

```

PKM

↓

Constraint Validator

↓

Qualification Engine

↓

Scoring Engine

↓

Ranking Engine

↓

Recommendation Engine

↓

Evidence Binder

↓

Explanation Agent

```

Every engine has one responsibility.

---

# Folder Structure

backend/

app/

decision_engine/

```
base.py

engine.py

models.py

config.py

interfaces.py

constraint_validator.py

qualification_engine.py

cost_engine.py

quality_engine.py

lead_time_engine.py

risk_engine.py

sustainability_engine.py

score_engine.py

ranking_engine.py

recommendation_engine.py

scenario_engine.py

confidence_engine.py

evidence_binder.py

```

---

# Engine Pipeline

Step 1

Load Procurement Knowledge Model

↓

Step 2

Validate Requirements

↓

Step 3

Determine Qualification

↓

Step 4

Calculate Category Scores

↓

Step 5

Calculate Overall Score

↓

Step 6

Rank Suppliers

↓

Step 7

Generate Recommendation

↓

Step 8

Bind Evidence

↓

Step 9

Return Decision Object

---

# Input

ProcurementProject

Contains

Requirements

Suppliers

Relationships

Evidence

Metadata

---

# Output

DecisionResult

```python

DecisionResult

recommended_supplier

supplier_rankings

confidence

decision_summary

evidence

score_breakdown

```

---

# Constraint Validator

Purpose

Validate every supplier against every requirement.

Algorithm

For each supplier

↓

For each requirement

↓

Evaluate

↓

Generate ValidationResult

Return

```python

ValidationResult

supplier_id

requirement_id

status

expected

actual

reason

evidence

```

---

# Constraint Status

Enum

PASS

FAIL

WARNING

UNKNOWN

---

# Mandatory Rule

Mandatory requirement failed

↓

Supplier becomes

NOT QUALIFIED

No score bonus can override this.

---

# Qualification Engine

Possible Status

QUALIFIED

CONDITIONALLY_QUALIFIED

REJECTED

Reason stored for every decision.

---

# Cost Engine

Inputs

Unit Price

Shipping

Tooling

Currency

Outputs

Normalized Cost Score

Range

0-100

Lower cost

Higher score

---

# Lead Time Engine

Inputs

Lead Time

Expected Lead Time

Outputs

Normalized Lead Time Score

Range

0-100

---

# Quality Engine

Inputs

Certifications

Capabilities

Production Capacity

Material Match

Tolerance

Outputs

Quality Score

---

# Sustainability Engine

Factors

ISO14001

Green Manufacturing

ESG

Carbon Reporting

RoHS

REACH

Weighted independently.

---

# Risk Engine

Risk Categories

Commercial

Operational

Compliance

Information Completeness

Country Risk

Output

Risk Score

Lower risk

Higher score

---

# Score Engine

Combines

Cost

Lead Time

Quality

Risk

Sustainability

Default Weights

```python

Cost = 0.30

Quality = 0.25

LeadTime = 0.20

Risk = 0.15

Sustainability = 0.10

```

Formula

```python

overall =

cost*0.30 +

quality*0.25 +

lead_time*0.20 +

risk*0.15 +

sustainability*0.10

```

---

# Ranking Engine

Sort

Overall Score DESC

Tie Breakers

1

Constraint Pass %

2

Quality Score

3

Risk Score

4

Lead Time

5

Lowest Cost

---

# Confidence Engine

Recommendation confidence depends on

Constraint Coverage

Evidence Coverage

Missing Values

Relationship Completeness

Retrieval Confidence

Formula

```python

confidence =

0.30 * evidence

+

0.30 * completeness

+

0.20 * validation

+

0.20 * consistency

```

Range

0-100

---

# Recommendation Engine

Rules

Highest Ranked

AND

Qualified

↓

Recommended Supplier

If none qualify

↓

Return

NO_RECOMMENDATION

With explanation.

---

# Evidence Binder

Purpose

Attach supporting evidence to every decision.

Example

Lead Time

↓

Relationship

↓

Evidence

↓

Chunk

↓

Document

↓

Page

The DecisionResult always contains evidence references.

---

# Scenario Engine

Input

New Weights

Process

Recalculate Overall Score

Do NOT

Re-parse documents

Re-run AI extraction

Re-build PKM

Only recalculate scores.

---

# Decision Models

Create

SupplierScore

ValidationResult

QualificationResult

DecisionResult

Recommendation

ScoreBreakdown

ScenarioResult

---

# Configuration

Decision weights stored in

decision_engine/config.py

No hardcoded values in engine logic.

---

# Explainability Contract

Every recommendation must answer

Why was Supplier A selected?

Why was Supplier B rejected?

Which constraints failed?

Which evidence supports this?

How confident is the recommendation?

---

# Logging

Log

Project

Supplier

Score

Qualification

Ranking

Execution Time

Decision Version

---

# Testing

Unit Tests

Constraint Validator

Scoring

Ranking

Scenario

Confidence

Golden Dataset

Acceptance

100 deterministic runs

↓

100 identical results

---

# Performance Target

Constraint Validation

<100ms

Scoring

<100ms

Ranking

<50ms

Scenario Update

<50ms

Complete Decision

<500ms

---

# Acceptance Criteria

✓ Every supplier validated

✓ Every score reproducible

✓ Every recommendation explainable

✓ Every recommendation linked to evidence

✓ Scenario analysis instant

✓ No LLM dependency

---

# Engineering Principles

The Decision Engine is the single source of procurement reasoning.

AI extracts facts.

The PKM organizes facts.

The Decision Engine evaluates facts.

The Explanation Agent communicates facts.

Business logic must always remain deterministic, reproducible, transparent, and independently testable.

END OF SPEC
