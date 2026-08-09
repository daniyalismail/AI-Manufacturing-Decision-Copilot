import asyncio
from app.api.v1.analysis import run_analysis_pipeline

async def main():
    await run_analysis_pipeline("5bd632d6-83f8-46de-9921-209e40c4b068")

asyncio.run(main())
