import json
from app.knowledge.models import ProcurementProject

class KnowledgeSerializer:
    """
    Wrappers for Pydantic's JSON serialization to handle caching and persistence boundary serialization.
    """

    @staticmethod
    def to_json(project: ProcurementProject) -> str:
        return project.model_dump_json()

    @staticmethod
    def from_json(json_str: str) -> ProcurementProject:
        return ProcurementProject.model_validate_json(json_str)

    @staticmethod
    def to_dict(project: ProcurementProject) -> dict:
        return project.model_dump(mode="json")
