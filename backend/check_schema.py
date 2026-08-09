import asyncio
import os
import sys

sys.path.append("/media/daniyalismail19/backup1/softica-hackathon/backend")

from app.database.session import AsyncSessionLocal
from sqlalchemy import text

async def check_schema():
    async with AsyncSessionLocal() as session:
        # For Postgres, query information_schema to see columns for vector_documents
        res = await session.execute(text("SELECT column_name, data_type, udt_name FROM information_schema.columns WHERE table_name = 'vector_documents';"))
        columns = res.fetchall()
        for col in columns:
            print(col)

if __name__ == "__main__":
    asyncio.run(check_schema())
