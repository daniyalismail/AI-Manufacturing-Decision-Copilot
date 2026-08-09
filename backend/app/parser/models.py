from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class ParsedPage(BaseModel):
    page_number: int
    text: str
    metadata: Dict[str, Any] = Field(default_factory=dict)

class ParsedDocument(BaseModel):
    pages: List[ParsedPage] = Field(default_factory=list)
    metadata: Dict[str, Any] = Field(default_factory=dict)

    @property
    def full_text(self) -> str:
        return "\n\n".join(page.text for page in self.pages)
