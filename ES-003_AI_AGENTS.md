# ES-003

# AI Agents Engineering Specification

Project

AI Procurement Intelligence Copilot

Version

1.0

Status

READY FOR IMPLEMENTATION

---

# Objective

Implement the complete AI layer responsible for procurement document understanding.

The AI layer is responsible ONLY for:

- Understanding language
- Extracting structured procurement data
- Retrieving evidence
- Generating explanations
- Answering procurement questions

The AI layer NEVER performs procurement decisions.

Business logic belongs exclusively to the Decision Engine.

---

# Technology Stack

OpenAI SDK

GPT-5.5

OpenAI Embeddings

PydanticAI

Instructor

Pydantic V2

LangGraph

PyMuPDF

Docling

---

# AI Principles

Every AI component must satisfy:

✓ Structured Output

✓ Deterministic

✓ Explainable

✓ Retry Safe

✓ Stateless

✓ Independent

---

# Architecture

```

User

↓

LangGraph

↓

AI Agent

↓

Structured Output

↓

Validation

↓

Knowledge Builder

↓

Decision Engine

```

Every agent performs ONE responsibility.

---

# Agent Base Class

Create

BaseAgent

Responsibilities

Load Prompt

Call LLM

Validate Output

Retry

Return Typed Model

All agents inherit BaseAgent.

---

# Agent Interface

Every agent exposes

```python

class BaseAgent:

    async def run(

        self,

        input_data

    ):

        ...

```

No custom APIs.

---

# Required Agents

DocumentClassifierAgent

RequirementExtractionAgent

SupplierExtractionAgent

CertificationExtractionAgent

CommercialTermsAgent

MetadataAgent

EvidenceAgent

ExplanationAgent

ChatAgent

ScenarioExplanationAgent

ReportAgent

RiskAgent

---

# DocumentClassifierAgent

Input

ParsedDocument

Output

```python

DocumentClassification

document_type

confidence

reason

```

Never use filename only.

Read content.

---

# RequirementExtractionAgent

Input

Requirement document

Output

RequirementCollection

Contains

Requirements

Confidence

Evidence

Unknown

↓

None

---

# SupplierExtractionAgent

Input

Supplier documents

Output

SupplierModel

Fields

Supplier Name

Country

MOQ

Lead Time

Currency

Website

Payment Terms

Incoterms

Capabilities

Confidence

---

# CertificationExtractionAgent

Output

CertificationCollection

Fields

ISO

RoHS

REACH

CE

FDA

UL

Expiry

Verification

---

# CommercialTermsAgent

Extract

Currency

Unit Price

MOQ

Packaging

Shipping

Tooling

Payment Terms

Incoterms

No calculations.

---

# MetadataAgent

Generate

Keywords

Supplier

Section

Document Type

Tags

Page Mapping

Used by Retrieval Engine.

---

# EvidenceAgent

Input

Decision Result

Retrieved Chunks

Output

EvidenceCollection

Each evidence

Document

Page

Chunk

Reason

Confidence

---

# ExplanationAgent

Input

Decision JSON

Evidence

Output

RecommendationSummary

Strengths

Weaknesses

Recommendation

Confidence

Must never modify scores.

---

# ChatAgent

Workflow

Question

↓

Retriever

↓

Prompt Builder

↓

OpenAI

↓

Grounded Response

↓

Sources

Must refuse unsupported questions.

---

# ScenarioExplanationAgent

Input

Weight Changes

Ranking Changes

Output

Human explanation

No calculations.

---

# ReportAgent

Produces

Executive Summary

Supplier Ranking

Strengths

Risks

Recommendation

Business language only.

---

# RiskAgent

Summarizes

Commercial

Operational

Compliance

Data Quality

Missing Information

No predictions.

---

# Prompt Loading

Prompts stored

backend/app/prompts/

Never inline prompts.

Agent loads prompt at runtime.

---

# Prompt Variables

Example

```

{{supplier}}

{{requirements}}

{{retrieved_context}}

{{decision}}

```

Never concatenate strings manually.

---

# Structured Outputs

Every response

↓

Pydantic Model

Never

Raw JSON

Never

Markdown

Never

Natural language

Except ExplanationAgent

---

# Validation

Validate

Schema

Required Fields

Enum Values

Ranges

Evidence

Confidence

If invalid

↓

Retry

Maximum

2

---

# Retry Policy

Retry only

Transient LLM failures

Malformed JSON

Validation Failure

Never retry

Successful responses.

---

# Temperature

Classifier

0.0

Extraction

0.1

Metadata

0.0

Evidence

0.0

Explanation

0.3

Chat

0.2

Report

0.4

---

# Context Limits

Only retrieve

Top 4

Relevant chunks

Never send entire documents.

---

# Hallucination Prevention

Never guess

Never infer

Never estimate

Never create suppliers

Never create certifications

Never invent page numbers

Return None

when uncertain.

---

# Error Handling

Exceptions

AgentValidationError

LLMTimeout

MalformedResponse

MissingEvidence

PromptNotFound

RetryExhausted

---

# Logging

Every call logs

Agent Name

Duration

Tokens

Cost

Retry Count

Model

Project ID

---

# Metrics

Track

Average Latency

Average Tokens

Cost

Retry Rate

Validation Failures

Success Rate

---

# Testing

Mock OpenAI

Snapshot Testing

Schema Validation

Prompt Regression

Golden Dataset

Coverage

80%

---

# Acceptance Criteria

✓ Every agent returns typed objects

✓ No raw JSON parsing in services

✓ Validation before persistence

✓ Retry policy implemented

✓ Prompt loading externalized

✓ Hallucination minimized

✓ Evidence included

✓ Structured logging enabled

---

# Engineering Principles

LLMs understand procurement language.

They do not implement procurement logic.

Every AI response must be validated before entering the Procurement Knowledge Model.

Agents remain small, deterministic, testable, and replaceable.

END OF SPEC
