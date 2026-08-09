import os
import structlog
from typing import TypeVar, Type, Any, Optional
from pydantic import BaseModel
from app.agents.client import ai_client
from app.api.exceptions import APIException
from app.config.settings import settings

logger = structlog.get_logger()

class AgentError(APIException):
    def __init__(self, message: str, status_code: int = 500):
        super().__init__(code="AGENT_ERROR", message=message, status_code=status_code)

T = TypeVar('T', bound=BaseModel)

class BaseAgent:
    """
    Base class for all AI Agents.
    Enforces strict structured outputs via Instructor.
    """
    def __init__(self, model_name: str = None, temperature: float = 0.0):
        self.model_name = model_name or settings.CHAT_MODEL
        self.temperature = temperature

    def load_prompt(self, prompt_filename: str) -> str:
        """Loads prompt text from the app/prompts directory."""
        prompt_path = os.path.join(os.path.dirname(__file__), "..", "prompts", prompt_filename)
        try:
            with open(prompt_path, 'r', encoding='utf-8') as f:
                return f.read().strip()
        except FileNotFoundError:
            raise AgentError(f"Prompt file {prompt_filename} not found.")

    async def _call_llm(self, system_prompt: str, user_content: str, response_model: Type[T], max_retries: int = 2) -> T:
        """
        Calls the LLM using Instructor for guaranteed structured outputs.
        Instructor handles validation and retries automatically.
        """
        try:
            logger.info("Calling LLM", agent=self.__class__.__name__, model=self.model_name)
            response = await ai_client.chat.completions.create(
                model=self.model_name,
                response_model=response_model,
                max_retries=max_retries,
                temperature=self.temperature,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_content}
                ]
            )
            return response
        except Exception as e:
            logger.error("LLM Call failed", agent=self.__class__.__name__, error=str(e))
            raise AgentError(f"Agent {self.__class__.__name__} failed: {str(e)}")

    async def run(self, *args, **kwargs) -> Any:
        """
        Main interface to be implemented by child agents.
        Must return a Pydantic model.
        """
        raise NotImplementedError("Agents must implement the run method")
