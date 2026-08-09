# 07_FRONTEND_ARCHITECTURE.md

# AI Procurement Intelligence Copilot

## Frontend Architecture

Version: 1.0

---

# Purpose

This document defines the frontend architecture of the Procurement Intelligence Copilot.

The frontend is responsible for presenting procurement intelligence in a clean, explainable and enterprise-grade interface.

Users should never see raw AI outputs.

Instead, they should interact with structured procurement insights.

---

# Tech Stack

Framework

Next.js 15 (App Router)

Language

TypeScript

UI Library

shadcn/ui

Styling

TailwindCSS

Icons

Lucide React

State Management

Zustand

Data Fetching

TanStack Query

Forms

React Hook Form

Validation

Zod

Charts

Recharts

Animations

Framer Motion

Tables

TanStack Table

Theme

next-themes

---

# Design Philosophy

The interface should resemble professional SaaS products such as:

- Linear
- Vercel Dashboard
- Stripe Dashboard
- Retool
- Notion

Avoid chatbot-first layouts.

The dashboard should prioritize procurement decisions.

---

# Application Layout

```
Sidebar
│
├── Dashboard
├── Projects
├── Suppliers
├── Reports
├── Chat
└── Settings

──────────────────────────────

Top Navigation

──────────────────────────────

Main Content

```

---

# Pages

```
/

Dashboard

/projects

Project List

/projects/new

Create Project

/projects/[id]

Project Dashboard

/projects/[id]/upload

Document Upload

/projects/[id]/analysis

AI Analysis

/projects/[id]/comparison

Supplier Comparison

/projects/[id]/chat

Procurement Copilot

/projects/[id]/report

Final Report

/settings

User Settings
```

---

# Component Structure

```
components/

layout/

sidebar.tsx

navbar.tsx

page-header.tsx

upload/

upload-zone.tsx

file-card.tsx

upload-progress.tsx

analysis/

analysis-summary.tsx

supplier-card.tsx

constraint-table.tsx

recommendation-card.tsx

comparison/

comparison-table.tsx

score-chart.tsx

chat/

chat-window.tsx

chat-input.tsx

chat-message.tsx

report/

report-viewer.tsx

report-download.tsx

shared/

button.tsx

modal.tsx

badge.tsx

loading.tsx

empty-state.tsx

error-state.tsx

```

---

# Main Dashboard

Displays

Recent Projects

Processing Status

Recommended Suppliers

Pending Analysis

Recent Reports

Quick Actions

Dashboard Widgets

- Total Projects
- Documents Uploaded
- Suppliers Compared
- Average Analysis Time

---

# Project Dashboard

Contains

Project Summary

↓

Uploaded Documents

↓

Supplier Ranking

↓

Recommendation

↓

Evidence

↓

Chat

↓

Scenario Analysis

Everything is visible on one screen.

---

# Upload Page

Components

Upload Zone

↓

File List

↓

Validation

↓

Upload Progress

↓

Analyze Button

Supported

PDF

DOCX

XLSX

Images

---

# Upload UX

Drag & Drop

Browse Files

Multiple Upload

Progress Bar

Upload Status

Validation Errors

Success Animation

---

# Analysis Page

Top Section

Recommended Supplier

Confidence Score

Overall Score

Processing Time

Middle Section

Supplier Ranking Table

Bottom Section

Evidence Timeline

Constraint Validation

AI Summary

---

# Supplier Comparison Page

Displays

Comparison Table

Cost

MOQ

Lead Time

Certifications

Country

Payment Terms

Incoterms

Quality Score

Risk Score

Recommendation Rank

Rows highlighted

Green

Pass

Red

Fail

Yellow

Missing

---

# Recommendation Card

Contains

Recommended Supplier

Overall Score

Confidence

Strengths

Weaknesses

Reason Summary

Evidence Button

Export Button

---

# Constraint Validation Table

Columns

Requirement

Expected

Actual

Status

Evidence

Status Badges

Passed

Failed

Missing

---

# Evidence Panel

Each recommendation opens

Evidence Drawer

Displays

Document Name

Page Number

Extracted Text

Confidence

Highlighted Chunk

Users can trace every decision.

---

# Procurement Chat

Layout

```
Chat History

──────────────

Assistant

User

Assistant

──────────────

Input Box

```

Capabilities

Ask Questions

View Sources

Suggested Questions

Streaming Responses

---

# Suggested Questions

Why was Supplier B selected?

Which supplier has the lowest cost?

Which supplier satisfies all constraints?

Show suppliers with ISO9001.

Compare Supplier A and B.

What happens if MOQ becomes 500?

---

# Scenario Analysis

Interactive Sliders

Cost Weight

Lead Time Weight

Quality Weight

Risk Weight

Sustainability Weight

Updating sliders

↓

API Call

↓

Decision Engine

↓

Updated Ranking

No page refresh.

---

# Report Page

Displays

Executive Summary

Supplier Ranking

Constraint Validation

Evidence

AI Recommendation

Charts

Download PDF

---

# Loading States

Every page has

Skeleton Loading

Spinner

Progress Bar

Optimistic UI

Never show blank screens.

---

# Empty States

No Projects

No Documents

No Analysis

No Chat

No Reports

Every empty state includes

Illustration

Description

Primary Action

---

# Error States

Examples

Upload Failed

AI Processing Failed

Network Error

Retry Available

Always provide recovery actions.

---

# Toast Notifications

Upload Complete

Analysis Started

Analysis Finished

Report Ready

Chat Error

Success

Warning

Error

Info

---

# Charts

Supplier Score Comparison

Radar Chart

Overall Score

Bar Chart

Lead Time

Cost

Quality

Risk

Pie Chart

Constraint Pass Rate

---

# Theme

Light

Dark

System

---

# Responsive Design

Desktop

Primary Experience

Tablet

Fully Supported

Mobile

Read Only

Chat

Reports

Dashboard

Comparison tables become cards.

---

# Accessibility

Keyboard Navigation

Screen Reader Labels

Focus States

High Contrast

Semantic HTML

---

# State Management

Zustand Stores

Auth Store

Project Store

Upload Store

Analysis Store

Chat Store

Theme Store

UI Store

Server State

TanStack Query

---

# API Integration

Hooks

useProjects()

useUpload()

useAnalysis()

useSuppliers()

useComparison()

useChat()

useReport()

No direct fetch calls inside components.

---

# Folder Structure

```
app/

components/

hooks/

services/

store/

types/

lib/

providers/

styles/

```

---

# Performance Goals

Initial Load

<2 seconds

Dashboard

<1 second

Chat Response

Streaming

Comparison Update

<500ms

Scenario Update

<1 second

---

# UI Principles

Information First

Every screen answers a procurement question.

Explainability

Every recommendation links to evidence.

Consistency

Same colors, badges and layouts across the app.

Minimalism

Avoid unnecessary UI elements.

Trust

Users should understand why the system made a recommendation.

---

# Frontend Philosophy

The frontend is not a chatbot interface.

It is an enterprise procurement workspace where AI supports structured decision making.

Every screen should reinforce transparency, explainability and human control.

The interface should help procurement professionals make faster, more confident sourcing decisions without hiding the underlying evidence.
