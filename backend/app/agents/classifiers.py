from app.agents.base import BaseAgent
from app.agents.models import DocumentClassification, ChunkMetadata

class DocumentClassifierAgent(BaseAgent):
    def __init__(self):
        super().__init__(temperature=0.0)
        self.system_prompt = self.load_prompt("global_system.txt") + "\n\n" + self.load_prompt("classifier.txt")

    async def run(self, document_text: str) -> DocumentClassification:
        return await self._call_llm(
            system_prompt=self.system_prompt,
            user_content=f"Classify this document based on the following text:\n\n{document_text}",
            response_model=DocumentClassification
        )

class MetadataAgent(BaseAgent):
    def __init__(self):
        super().__init__(temperature=0.0)
        self.system_prompt = self.load_prompt("global_system.txt") + "\n\n" + self.load_prompt("metadata.txt")

    async def run(self, chunk_text: str) -> ChunkMetadata:
        return await self._call_llm(
            system_prompt=self.system_prompt,
            user_content=f"Generate metadata for this document chunk:\n\n{chunk_text}",
            response_model=ChunkMetadata
        )
