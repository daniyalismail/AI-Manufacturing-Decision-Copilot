# 01_PROBLEM_STATEMENT.md

# AI Procurement Intelligence Copilot

## Problem Statement & Product Definition

---

# Executive Summary

Procurement decisions are among the most information-intensive tasks in manufacturing.

A single sourcing decision often requires procurement teams to review multiple independent documents including:

- Product Requirement Specifications
- Bill of Materials (BOM)
- Supplier Profiles
- Commercial Quotations
- Certifications
- Manufacturing Capabilities
- Sustainability Reports
- Payment Terms
- Logistics Information

These documents are distributed across different formats, contain inconsistent structures, and often require manual cross-referencing.

The objective of this project is to build an AI-powered Procurement Intelligence Copilot that assists procurement professionals by automatically understanding procurement documents, extracting structured information, validating supplier constraints, comparing suppliers, and producing transparent, evidence-backed recommendations.

The platform supports decision making.

It does not replace procurement professionals.

---

# Background

Procurement teams spend significant time answering questions such as:

- Which supplier satisfies all mandatory requirements?
- Which quotation offers the best overall value?
- Which supplier introduces the lowest business risk?
- Which supplier can manufacture within our deadline?
- Which quotation violates procurement constraints?
- Why should Supplier A be preferred over Supplier B?

Today these questions require reading hundreds of pages of procurement documentation.

This process is repetitive, slow and difficult to audit.

---

# Existing Workflow

Current procurement process

Receive Documents

↓

Read Requirements

↓

Read Supplier Profiles

↓

Read Quotations

↓

Compare Values

↓

Calculate Costs

↓

Check Constraints

↓

Discuss Options

↓

Select Supplier

↓

Prepare Decision Report

Most of this work is manual.

---

# Problems with Current Workflow

## 1. Information Fragmentation

Information is distributed across many documents.

Example

MOQ

→ Supplier Quote

Lead Time

→ Commercial Terms

ISO Certification

→ Supplier Profile

Material Compatibility

→ Requirement Specification

A procurement manager constantly switches between documents.

---

## 2. Manual Comparison

Every supplier must be compared manually.

This becomes increasingly difficult as supplier count grows.

---

## 3. Hidden Constraint Violations

Many procurement failures occur because mandatory requirements are overlooked.

Examples

Supplier offers low price

BUT

MOQ not satisfied.

Supplier offers fast delivery

BUT

Missing certification.

Supplier has lowest cost

BUT

Wrong Incoterm.

---

## 4. Limited Explainability

Traditional spreadsheets produce rankings.

They rarely explain WHY.

Decision justification becomes difficult.

---

## 5. Repetitive Analysis

Most procurement decisions repeat the same reasoning process.

Teams repeatedly verify:

- Certifications
- Lead Time
- MOQ
- Country
- Commercial Terms

This work is ideal for AI-assisted automation.

---

# Why AI is Necessary

Simple rule-based automation cannot solve this problem.

Reasons

Documents contain

- Tables
- Paragraphs
- Images
- Mixed formatting
- Different supplier templates
- Different wording

Example

Supplier A

Delivery Time

Supplier B

Production Lead Time

Supplier C

Manufacturing Duration

Humans understand these refer to similar concepts.

Rule-based software struggles.

Modern LLMs can normalize these variations.

---

# Why a Chatbot is NOT Enough

Many hackathon solutions simply upload documents into a vector database and ask an LLM questions.

This approach has several limitations.

Problems

- No structured supplier comparison
- No procurement reasoning
- No business rules
- No mandatory constraint validation
- No supplier scoring
- No transparent ranking

Users receive text answers instead of procurement decisions.

---

# Our Approach

Instead of building another chatbot, we build a Procurement Intelligence Platform.

Workflow

Documents

↓

AI Extraction

↓

Structured Procurement Data

↓

Constraint Validation

↓

Decision Engine

↓

Supplier Ranking

↓

Evidence Retrieval

↓

LLM Explanation

↓

Interactive Procurement Copilot

AI becomes one component inside a larger decision workflow.

---

# Why RAG Alone is Insufficient

Retrieval-Augmented Generation (RAG) is useful for answering procurement questions.

However, procurement decisions require additional reasoning.

Example

Supplier A

Price = Lowest

Supplier B

Price = Higher

Lead Time = Better

ISO Certified

MOQ Valid

A traditional RAG system might answer:

"Supplier A has the lowest price."

But procurement decisions require evaluating multiple constraints simultaneously.

Therefore we combine:

- Structured Extraction
- Rule-Based Validation
- Decision Scoring
- RAG
- LLM Reasoning

---

# Hybrid AI Architecture

The platform combines deterministic business logic with LLM reasoning.

Business Rules

↓

Constraint Validation

↓

Supplier Scoring

↓

Evidence Retrieval

↓

LLM Explanation

This architecture produces recommendations that are:

- Explainable
- Reproducible
- Auditable

---

# Intended User

Primary User

Procurement Manager

Responsibilities

- Compare suppliers
- Verify compliance
- Evaluate quotations
- Prepare sourcing recommendations

The system is designed to reduce repetitive work while preserving human decision authority.

---

# Primary User Journey

Step 1

Upload Procurement Package

↓

Step 2

AI reads documents

↓

Step 3

AI extracts procurement entities

↓

Step 4

System validates constraints

↓

Step 5

System compares suppliers

↓

Step 6

Decision Engine generates ranking

↓

Step 7

User reviews evidence

↓

Step 8

User asks follow-up questions

↓

Step 9

Human makes final decision

---

# Key Design Goals

The platform should

✓ Reduce procurement analysis time

✓ Improve transparency

✓ Increase consistency

✓ Reduce manual comparison

✓ Provide explainable AI recommendations

✓ Keep humans in control

---

# Product Scope

Included

- Document Understanding
- Procurement Entity Extraction
- Supplier Comparison
- Requirement Validation
- Decision Support
- Procurement Chat
- Evidence Retrieval
- Scenario Analysis

Excluded

- Supplier Communication
- RFQ Generation
- Purchase Orders
- ERP Transactions
- Automated Procurement
- Vendor Approval

---

# Success Criteria

The project succeeds if users can:

- Upload procurement documents
- Compare suppliers automatically
- Understand recommendation reasoning
- Trace every recommendation to evidence
- Explore alternative procurement scenarios
- Complete supplier evaluation significantly faster than manual review

---

# Mapping to Hackathon Objectives

The proposed solution directly addresses the Manufacturing Decision Copilot challenge.

Challenge Requirement

→ Our Solution

Supplier comparison

→ AI Decision Engine

Evidence-backed recommendation

→ RAG + Evidence Retrieval

Decision support

→ Procurement Copilot Dashboard

Transparency

→ Source Citations

Human Approval

→ Recommendation Only

Quantitative Comparison

→ Supplier Scorecard

Scenario Planning

→ Interactive What-if Analysis

---

# Product Vision

We believe procurement professionals should spend their time making decisions—not searching documents.

Our Procurement Intelligence Copilot transforms scattered procurement information into structured intelligence while ensuring that every recommendation remains transparent, explainable, and fully supported by evidence.

AI assists.

Humans decide.
