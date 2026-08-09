import asyncio
import os
import sys

# Add backend to path
sys.path.append("/media/daniyalismail19/backup1/softica-hackathon/backend")

from app.database.session import AsyncSessionLocal
from sqlalchemy import text

async def check_vectors():
    async with AsyncSessionLocal() as session:
        res = await session.execute(text("SELECT count(*) FROM vector_documents;"))
        count = res.scalar()
        print(f"Total vector documents in DB: {count}")
        
        if count > 0:
            res = await session.execute(text("SELECT metadata FROM vector_documents LIMIT 1;"))
            meta = res.scalar()
            print(f"Sample metadata: {meta}")

if __name__ == "__main__":
    asyncio.run(check_vectors())
