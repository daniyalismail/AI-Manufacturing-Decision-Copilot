from fastapi import APIRouter
from app.api.v1 import health
from app.api.v1 import projects, documents, analysis, suppliers, decisions, evidence, chat, scenarios, reports, jobs

api_router = APIRouter()

api_router.include_router(health.router, tags=["health"])
api_router.include_router(projects.router, prefix="/projects", tags=["projects"])
api_router.include_router(documents.router, prefix="/projects", tags=["documents"])
api_router.include_router(analysis.router, prefix="/projects", tags=["analysis"])
api_router.include_router(analysis.router, prefix="/analysis", tags=["analysis"])
api_router.include_router(suppliers.router, tags=["suppliers"])
api_router.include_router(decisions.router, prefix="/projects", tags=["decisions"])
api_router.include_router(evidence.router, prefix="/projects", tags=["evidence"])
api_router.include_router(chat.router, prefix="/chat", tags=["chat"])
api_router.include_router(scenarios.router, prefix="/projects", tags=["scenarios"])
api_router.include_router(reports.router, prefix="/projects", tags=["reports"])
api_router.include_router(jobs.router, prefix="/jobs", tags=["jobs"])
