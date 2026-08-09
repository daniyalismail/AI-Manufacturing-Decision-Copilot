import asyncio
from openai import AsyncOpenAI
import instructor
from pydantic import BaseModel

class Result(BaseModel):
    message: str

async def main():
    client = AsyncOpenAI(
        api_key="AQ.Ab8RN6IDw3qmMoHA_z5IO_dB7WFOuoexTrD_s_LWV6F6CGB6FA",
        base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
    )
    patched = instructor.from_openai(client, mode=instructor.Mode.JSON)
    
    resp = await patched.chat.completions.create(
        model="gemini-2.5-flash",
        response_model=Result,
        messages=[{"role": "user", "content": "Say hello!"}]
    )
    print(resp.message)

asyncio.run(main())
