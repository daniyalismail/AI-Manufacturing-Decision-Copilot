import asyncio
import os
import sys

sys.path.append("/media/daniyalismail19/backup1/softica-hackathon/backend")
from app.api.schemas import ChatRequest
from app.api.v1.chat import post_chat

async def mock_chat():
    req = ChatRequest(
        project_id="602dacb5-c130-4a80-b631-7ed803b0dcb3",
        message="what is the moq",
        history=[]
    )
    # mock current_user
    res = await post_chat(req, current_user=None)
    print(res)

if __name__ == "__main__":
    asyncio.run(mock_chat())
