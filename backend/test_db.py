import asyncio
import os
import sys

sys.path.append("/media/daniyalismail19/backup1/softica-hackathon/backend")

from app.database.session import AsyncSessionLocal
from sqlalchemy import text

async def check_db():
    async with AsyncSessionLocal() as session:
        res = await session.execute(text("SELECT count(*) FROM projects;"))
        print(f"Total projects: {res.scalar()}")
        
        res = await session.execute(text("SELECT count(*) FROM documents;"))
        print(f"Total documents: {res.scalar()}")

if __name__ == "__main__":
    asyncio.run(check_db())
