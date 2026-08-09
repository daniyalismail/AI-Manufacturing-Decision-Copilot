import asyncio
import os
from dotenv import load_dotenv

load_dotenv()

from app.agents.extractors import SupplierExtractionAgent
from app.agents.client import get_ai_client

async def test():
    print("Testing SupplierExtractionAgent with model:", os.getenv("CHAT_MODEL"))
    agent = SupplierExtractionAgent()
    try:
        res = await agent.run(text="Supplier Name: TechForge Industries, Location: Berlin, MOQ: 1000")
        print("Success:", res)
    except Exception as e:
        print("Failed:", e)

if __name__ == "__main__":
    asyncio.run(test())
