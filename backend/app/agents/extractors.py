from app.agents.base import BaseAgent
from app.agents.models import (
    RequirementCollection, 
    SupplierModel, 
    CertificationCollection, 
    CommercialTerms
)

class RequirementExtractionAgent(BaseAgent):
    def __init__(self):
        super().__init__(temperature=0.1)
        self.system_prompt = self.load_prompt("global_system.txt") + "\n\n" + self.load_prompt("requirement.txt")

    async def run(self, text: str) -> RequirementCollection:
        return await self._call_llm(
            system_prompt=self.system_prompt,
            user_content=f"Extract requirements from this text:\n\n{text}",
            response_model=RequirementCollection
        )

class SupplierExtractionAgent(BaseAgent):
    def __init__(self):
        super().__init__(temperature=0.1)
        self.system_prompt = self.load_prompt("global_system.txt") + "\n\n" + self.load_prompt("supplier.txt")

    async def run(self, text: str) -> SupplierModel:
        return await self._call_llm(
            system_prompt=self.system_prompt,
            user_content=f"Extract supplier details from this text:\n\n{text}",
            response_model=SupplierModel
        )

class CertificationExtractionAgent(BaseAgent):
    def __init__(self):
        super().__init__(temperature=0.1)
        self.system_prompt = self.load_prompt("global_system.txt") + "\n\n" + self.load_prompt("certification.txt")

    async def run(self, text: str) -> CertificationCollection:
        return await self._call_llm(
            system_prompt=self.system_prompt,
            user_content=f"Extract certifications from this text:\n\n{text}",
            response_model=CertificationCollection
        )

class CommercialTermsAgent(BaseAgent):
    def __init__(self):
        super().__init__(temperature=0.1)
        self.system_prompt = self.load_prompt("global_system.txt") + "\n\n" + self.load_prompt("commercial_terms.txt")

    async def run(self, text: str) -> CommercialTerms:
        return await self._call_llm(
            system_prompt=self.system_prompt,
            user_content=f"Extract commercial terms from this text:\n\n{text}",
            response_model=CommercialTerms
        )
