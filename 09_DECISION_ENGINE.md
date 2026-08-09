# 09_DECISION_ENGINE.md

# AI Procurement Intelligence Copilot

## Procurement Decision Engine

Version: 1.0

---

# Purpose

The Decision Engine is the core business intelligence component of the Procurement Intelligence Copilot.

Its responsibility is to transform extracted procurement information into transparent, reproducible, evidence-backed supplier recommendations.

Unlike Large Language Models, the Decision Engine is deterministic.

Every recommendation must be reproducible.

Every score must be explainable.

Every deduction must be traceable.

---

# Why a Decision Engine?

Traditional RAG systems answer questions.

Procurement requires decisions.

Those are fundamentally different.

Question

"What is Supplier A's MOQ?"

↓

RAG

Decision

"Which supplier should we choose?"

↓

Decision Engine

This platform separates retrieval from decision making.

---

# Decision Pipeline

```

Requirements

↓

Supplier Data

↓

Normalization

↓

Constraint Validation

↓

Qualification

↓

Weighted Scoring

↓

Risk Analysis

↓

Ranking

↓

Recommendation

↓

Evidence Linking

↓

Natural Language Explanation

```

---

# Procurement Decision Flow

```

Requirement Document

↓

Extract Constraints

↓

Supplier Quotes

↓

Supplier Profiles

↓

Normalize Data

↓

Validate Constraints

↓

Calculate Scores

↓

Rank Suppliers

↓

Generate Recommendation

↓

Retrieve Evidence

↓

Generate Explanation

```

---

# Step 1

Requirement Extraction

The platform extracts all mandatory and optional requirements.

Example

```json
{
 "material":"Aluminum",
 "MOQ":1000,
 "LeadTime":20,
 "ISO9001":true,
 "Country":["Malaysia","Vietnam"]
}
```

Requirements become structured business rules.

---

# Step 2

Supplier Normalization

Different suppliers describe similar information differently.

Example

Supplier A

Delivery Time

Supplier B

Lead Time

Supplier C

Production Duration

↓

Normalize

LeadTime

Every supplier is converted into the same schema.

---

# Step 3

Constraint Validation

Mandatory constraints are validated first.

Example

Requirement

MOQ >=1000

Supplier

MOQ =800

↓

FAILED

Supplier automatically becomes

Not Qualified

No scoring is performed until mandatory validation completes.

---

# Constraint Categories

Mandatory

Failure immediately disqualifies supplier.

Preferred

Failure reduces score.

Optional

Used only for reporting.

---

# Constraint Status

Passed

Failed

Missing

Unknown

Every status is stored.

---

# Validation Example

Requirement

ISO9001 Required

Supplier

ISO9001 Present

↓

PASS

Requirement

Lead Time <=20

Supplier

Lead Time =24

↓

FAIL

---

# Step 4

Qualification

Suppliers are divided into

Qualified

Conditionally Qualified

Rejected

Rejected suppliers remain visible.

Transparency is important.

---

# Step 5

Weighted Scoring

Only qualified suppliers receive scores.

Default Weights

Cost

30%

Quality

25%

Lead Time

20%

Risk

15%

Sustainability

10%

Total

100%

Weights are configurable.

---

# Cost Score

Lowest cost

↓

100

Highest cost

↓

Lowest score

Normalization formula

```

score =
(maxPrice-price)

/
(maxPrice-minPrice)

```

Scaled to

0-100

---

# Lead Time Score

Shortest lead time

↓

Highest score

Long deliveries

↓

Penalty

---

# Quality Score

Factors

Certifications

Manufacturing Capability

Historical Quality

Tolerance Support

Capacity

---

# Sustainability Score

Factors

ISO14001

ESG

Recycled Materials

Green Manufacturing

Carbon Reporting

---

# Risk Score

Factors

Country Risk

Supplier Completeness

Missing Information

Commercial Uncertainty

Limited Certifications

Higher risk

↓

Lower score

---

# Overall Score

```

Overall

=

Cost × Weight

+

Lead Time × Weight

+

Quality × Weight

+

Risk × Weight

+

Sustainability × Weight

```

Score

0-100

---

# Confidence Score

Recommendation confidence is NOT the LLM confidence.

Confidence depends on

Constraint Completeness

+

Evidence Coverage

+

Missing Data

+

Retrieval Quality

+

Supplier Consistency

Example

Complete Evidence

↓

95%

Missing Certifications

↓

72%

Several Unknown Fields

↓

54%

---

# Ranking

Sort

Overall Score DESC

Tie Breakers

1

Constraint Pass Count

↓

2

Quality Score

↓

3

Risk Score

↓

4

Lead Time

↓

5

Lowest Cost

---

# Recommendation Logic

Rule

Highest Score

AND

No Mandatory Violations

↓

Recommended Supplier

If no supplier qualifies

↓

No Recommendation

System explains why.

---

# Scenario Analysis

Users can modify weights.

Example

Current

Cost

30

Quality

25

Lead Time

20

Risk

15

Sustainability

10

↓

Scenario

Cost

10

Quality

40

Lead Time

35

Risk

10

Sustainability

5

↓

Recalculate

No AI required.

---

# Procurement Rules

Examples

IF

MOQ < Required

↓

Reject

IF

Certification Missing

↓

Penalty

IF

Lead Time > Required

↓

Penalty

IF

Country Not Allowed

↓

Reject

IF

Material Mismatch

↓

Reject

IF

Missing Payment Terms

↓

Minor Penalty

Every rule is deterministic.

---

# Explainability

Every deduction stores

Rule

↓

Expected Value

↓

Actual Value

↓

Reason

↓

Evidence

Example

Rule

Lead Time

Expected

20

Actual

24

Status

Failed

Evidence

Quote.pdf

Page 4

---

# Recommendation Explanation

The LLM receives

Decision JSON

+

Evidence

↓

Natural Language

The LLM never performs scoring.

Only explanation.

---

# Recommendation Example

Supplier B is recommended because:

✓ Meets every mandatory requirement

✓ Lowest overall procurement risk

✓ ISO9001 Certified

✓ Lowest adjusted landed cost

✓ Lead Time within target

Evidence

Quote.pdf

Page 2

SupplierProfile.pdf

Page 5

---

# Missing Information

Unknown values never become assumptions.

Example

Certification Missing

↓

Unknown

NOT

"No Certification"

Transparency over optimism.

---

# Procurement Scorecard

Each supplier receives

Overall Score

Cost Score

Lead Time Score

Quality Score

Risk Score

Sustainability Score

Constraint Pass Rate

Confidence

Recommendation Status

---

# Human Override

Users can override recommendations.

System records

Original Recommendation

↓

Human Decision

↓

Reason

Future analytics.

Not required for MVP.

---

# Future Extensions

Landed Cost Engine

Currency Conversion

Supplier Diversity Score

Tariff Calculator

Logistics Optimizer

Demand Forecast Integration

ERP Integration

---

# Decision Engine Principles

1.

Deterministic

Same inputs

↓

Same outputs

---

2.

Explainable

Every score has a reason.

---

3.

Evidence Based

No unsupported recommendations.

---

4.

Human Controlled

AI recommends.

Humans approve.

---

5.

Modular

Scoring rules are independent.

New rules can be added without changing the architecture.

---

# Decision Engine Philosophy

The Procurement Decision Engine is the heart of the Procurement Intelligence Copilot.

Large Language Models understand procurement language.

The Decision Engine understands procurement logic.

Separating reasoning from business rules produces recommendations that are transparent, reproducible, auditable, and suitable for real procurement workflows.

The system is not designed to replace procurement professionals.

It is designed to make procurement decisions faster, more consistent, and easier to justify.
