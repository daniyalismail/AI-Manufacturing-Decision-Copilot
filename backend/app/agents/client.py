import instructor
from openai import AsyncOpenAI
from app.config.settings import settings

# Create a singleton async OpenAI client patched with instructor
def get_ai_client() -> instructor.Instructor:
    client = AsyncOpenAI(
        api_key=settings.OPENAI_API_KEY,
        base_url=settings.OPENAI_BASE_URL
    )
    # Patch the client to add response_model support
    return instructor.from_openai(client, mode=instructor.Mode.JSON)

ai_client = get_ai_client()
