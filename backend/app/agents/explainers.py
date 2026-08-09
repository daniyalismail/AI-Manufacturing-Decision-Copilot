from app.agents.base import BaseAgent
from app.agents.models import (
    EvidenceCollection,
    RecommendationSummary,
    ChatResponse,
    ScenarioExplanation,
    ReportSummary,
    RiskSummary
)

class EvidenceAgent(BaseAgent):
    def __init__(self):
        super().__init__(temperature=0.0)
        self.system_prompt = self.load_prompt("global_system.txt") + "\n\n" + self.load_prompt("evidence.txt")

    async def run(self, decision_result: str, retrieved_chunks: str) -> EvidenceCollection:
        return await self._call_llm(
            system_prompt=self.system_prompt,
            user_content=f"Decision Result:\n{decision_result}\n\nRetrieved Chunks:\n{retrieved_chunks}",
            response_model=EvidenceCollection
        )

class ExplanationAgent(BaseAgent):
    def __init__(self):
        super().__init__(temperature=0.3)
        self.system_prompt = self.load_prompt("global_system.txt") + "\n\n" + self.load_prompt("explanation.txt")

    async def run(self, decision_json: str, evidence: str) -> RecommendationSummary:
        return await self._call_llm(
            system_prompt=self.system_prompt,
            user_content=f"Decision JSON:\n{decision_json}\n\nEvidence:\n{evidence}",
            response_model=RecommendationSummary
        )

class ChatAgent(BaseAgent):
    def __init__(self):
        super().__init__(temperature=0.2)
        self.system_prompt = self.load_prompt("global_system.txt") + "\n\n" + self.load_prompt("chat.txt")

    async def run(self, question: str, retrieved_context: str) -> ChatResponse:
        return await self._call_llm(
            system_prompt=self.system_prompt,
            user_content=f"Context:\n{retrieved_context}\n\nQuestion:\n{question}",
            response_model=ChatResponse
        )

class ScenarioExplanationAgent(BaseAgent):
    def __init__(self):
        super().__init__(temperature=0.3)
        self.system_prompt = self.load_prompt("global_system.txt") + "\n\n" + self.load_prompt("scenario_explanation.txt")

    async def run(self, old_ranking: str, new_ranking: str, weight_changes: str) -> ScenarioExplanation:
        return await self._call_llm(
            system_prompt=self.system_prompt,
            user_content=f"Old Ranking:\n{old_ranking}\n\nNew Ranking:\n{new_ranking}\n\nWeight Changes:\n{weight_changes}",
            response_model=ScenarioExplanation
        )

class ReportAgent(BaseAgent):
    def __init__(self):
        super().__init__(temperature=0.4)
        self.system_prompt = self.load_prompt("global_system.txt") + "\n\n" + self.load_prompt("report.txt")

    async def run(self, all_data: str) -> ReportSummary:
        return await self._call_llm(
            system_prompt=self.system_prompt,
            user_content=f"Generate report based on this data:\n\n{all_data}",
            response_model=ReportSummary
        )

class RiskAgent(BaseAgent):
    def __init__(self):
        super().__init__(temperature=0.3)
        self.system_prompt = self.load_prompt("global_system.txt") + "\n\n" + self.load_prompt("risk.txt")

    async def run(self, supplier_data: str) -> RiskSummary:
        return await self._call_llm(
            system_prompt=self.system_prompt,
            user_content=f"Summarize risks for this supplier data:\n\n{supplier_data}",
            response_model=RiskSummary
        )
