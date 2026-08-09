# ProcureIQ - AI Procurement Intelligence Copilot

**ProcureIQ** is an AI-powered procurement decision engine that transforms how companies evaluate supplier RFPs. Instead of manually reading through dozens of PDFs, comparing prices, checking certifications, and calculating lead times, ProcureIQ automates the entire evaluation process using advanced document parsing and deterministic constraint reasoning.

This project was built as a hackathon submission to solve the slow, error-prone, and biased process of traditional vendor selection.

---

## 🎬 Prototype Demo

https://drive.google.com/file/d/1c3zJI4rnzmK3fE9pM7BDfgP5thJxVQqb/view?usp=sharing
---

## 🚀 Key Features

- **Automated RFP Parsing**: Upload supplier proposal PDFs and let the AI extract critical data points (Quotes, Lead Times, MOQ, ISO Certifications).
- **Deterministic Constraint Engine**: Define hard constraints (e.g., "MOQ must be <= 1000", "Must have active ISO9001"). The engine automatically disqualifies or flags suppliers who breach these rules.
- **Supplier Scoring & Comparison**: Automatically ranks all qualified suppliers based on extracted data, calculating an overall confidence score.
- **AI Procurement Copilot**: A context-aware chat assistant that lets you ask specific questions about the submitted documents (e.g., "What was Vertex Manufacturing's delivery timeline?").
- **Audit-Ready Executive Reports**: Generates a perfectly formatted, A4-sized PDF recommendation report directly in the browser that explains exactly *why* a supplier was chosen (or disqualified), ready for Director sign-off.

## 🛠️ Tech Stack

- **Frontend**: Next.js 16.3 (App Router), React 19, Tailwind CSS v4, Lucide React, Zustand, html-to-image & jsPDF (for client-side PDF generation).
- **Backend**: FastAPI (Python), Uvicorn, Supabase (PostgreSQL & Auth).
- **AI Engine**: Google Gemini API (for intelligent document extraction and copilot chat context).

---

## 💻 How to Run the Project Locally

Since this project is not deployed, please follow these step-by-step instructions to run it on your local machine.

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- `pnpm` package manager (Install via `npm install -g pnpm`)

### 1. Backend Setup (FastAPI)

1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use: venv\Scripts\activate
   ```
3. Install the dependencies:
   ```bash
   pip install fastapi uvicorn supabase google-genai python-dotenv pydantic
   ```
4. Create a `.env` file inside the `backend` folder and add the following exactly as provided (these are read-only/hackathon keys, so it's safe to use them):
   ```env
   OPENAI_API_KEY="AQ.Ab8RN6JN1TRpaT-CQ2kdGkupquRaLF9WN2k5gbKr-es-2XVBUA"
   <!-- this api key will expire in 1 hour so input your api key i am using gemini api key so kindly use that because enviornment is made according to that  -->
   OPENAI_BASE_URL="https://generativelanguage.googleapis.com/v1beta/openai/"
   CHAT_MODEL="gemini-3.5-flash-lite"
   SUPABASE_URL="https://vwerlsnmvarlkqbroizt.supabase.co"
   SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3ZXJsc25tdmFybGtxYnJvaXp0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjI2NzI4MCwiZXhwIjoyMTAxODQzMjgwfQ.7EhYNkUni4Cuhw35NULzOHfzBzE4NB9vi1qQp5wKVbA"
   DATABASE_URL="postgresql://postgres.vwerlsnmvarlkqbroizt:safwandaniyal123@aws-0-ap-south-1.pooler.supabase.com:5432/postgres"
   ```
5. Start the backend server:
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

### 2. Frontend Setup (Next.js)

1. Open a **new** terminal window and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install all frontend dependencies using pnpm:
   ```bash
   pnpm install
   ```
3. Create a `.env.local` file inside the `frontend` folder and add the following keys:
   ```env
   NEXT_PUBLIC_SUPABASE_URL="https://vwerlsnmvarlkqbroizt.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3ZXJsc25tdmFybGtxYnJvaXp0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjI2NzI4MCwiZXhwIjoyMTAxODQzMjgwfQ.7EhYNkUni4Cuhw35NULzOHfzBzE4NB9vi1qQp5wKVbA"
   ```
4. Start the Next.js development server:
   ```bash
   pnpm run dev
   ```

### 3. Usage

1. Open your browser and go to `http://localhost:3000`.
2. Login or Sign Up using the provided UI (Data is securely stored in Supabase).
3. Create a new "Procurement Project".
4. Enter the Workspace, and upload your PDF RFPs into the Document Zone.
5. Click **"Run Analysis Pipeline"** to trigger the AI extraction and constraint matrix calculation.
6. Review the AI Copilot Chat, Constraint Matrix, and finally go to the **Executive Report** tab.
7. Click **"Download PDF"** to generate the final audit-ready report!

---

## 💡 Future Improvements
If we had more time to work on this, we would focus on:
1. **Complex Table Extraction**: Improving multi-page PDF parsing to handle highly complex, nested pricing tables natively.
2. **Natural Language Constraint Builder**: Allowing non-technical managers to type "Supplier must deliver within 2 weeks" and have the system automatically convert it into a hard system constraint.
3. **Historical Vendor Profiles**: Saving vendor performance scores across multiple projects so the engine learns which suppliers consistently over-promise and under-deliver.
