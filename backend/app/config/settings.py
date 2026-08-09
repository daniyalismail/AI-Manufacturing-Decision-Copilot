from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Procurement Intelligence Copilot"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Database
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/procurement_db"
    
    from pydantic import field_validator
    
    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def fix_postgres_url(cls, v: str) -> str:
        if v and v.startswith("postgresql://"):
            return v.replace("postgresql://", "postgresql+asyncpg://", 1)
        return v
    
    # Authentication
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""
    JWT_SECRET: str = ""
    
    # AI Models
    OPENAI_API_KEY: str = ""
    OPENAI_BASE_URL: str = "https://api.openai.com/v1"
    EMBEDDING_MODEL: str = "gemini-embedding-2"
    CHAT_MODEL: str = "gpt-4o"
    
    # OCR
    OCR_PROVIDER: str = "tesseract"

    # Supabase Settings
    SUPABASE_URL: str = "http://localhost:54321" # Default local URL
    SUPABASE_SERVICE_KEY: str = "your-service-key-here"
    SUPABASE_SERVICE_ROLE_KEY: str = ""
    SUPABASE_STORAGE_BUCKET: str = "documents"

    # AI Agents
    OPENAI_API_KEY: str = "sk-placeholder"

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True, extra="ignore")

settings = Settings()
