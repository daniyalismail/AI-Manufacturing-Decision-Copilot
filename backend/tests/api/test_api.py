import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest_asyncio.fixture
async def async_client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as client:
        yield client

def get_auth_headers():
    return {"Authorization": "Bearer test-token"}

@pytest.mark.asyncio
async def test_health_check(async_client):
    response = await async_client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"

@pytest.mark.asyncio
async def test_auth_required(async_client):
    # No auth header provided
    response = await async_client.get("/api/v1/projects")
    assert response.status_code == 403

@pytest.mark.asyncio
async def test_invalid_token(async_client):
    response = await async_client.get("/api/v1/projects", headers={"Authorization": "Bearer invalid"})
    assert response.status_code == 401
    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] == "AUTH_REQUIRED"

@pytest.mark.asyncio
async def test_create_project(async_client):
    response = await async_client.post(
        "/api/v1/projects", 
        json={"title": "Test Project", "description": "Test Desc"},
        headers=get_auth_headers()
    )
    assert response.status_code == 201
    data = response.json()
    assert data["success"] is True
    assert "project_id" in data["data"]

@pytest.mark.asyncio
async def test_upload_document_invalid_type(async_client):
    project_id = "test-uuid"
    files = {"file": ("test.txt", b"dummy content", "text/plain")}
    response = await async_client.post(
        f"/api/v1/projects/{project_id}/documents",
        files=files,
        headers=get_auth_headers()
    )
    assert response.status_code == 422
    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] == "VALIDATION_ERROR"
    assert "Unsupported file type" in data["error"]["message"]

@pytest.mark.asyncio
async def test_upload_document_success(async_client):
    project_id = "test-uuid"
    files = {"file": ("test.pdf", b"dummy pdf content", "application/pdf")}
    response = await async_client.post(
        f"/api/v1/projects/{project_id}/documents",
        files=files,
        headers=get_auth_headers()
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "document_id" in data["data"]

