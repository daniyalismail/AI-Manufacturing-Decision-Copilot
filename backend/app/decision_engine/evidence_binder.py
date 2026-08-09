from typing import Dict
import uuid
from app.knowledge.models import ProcurementProject, Evidence

class EvidenceBinder:
    """
    Collects all evidence IDs from the project and maps them for the frontend/explainers.
    """
    @staticmethod
    def bind(project: ProcurementProject) -> Dict[uuid.UUID, Evidence]:
        evidence_map = {}
        for ev in project.evidence:
            evidence_map[ev.id] = ev
        return evidence_map
