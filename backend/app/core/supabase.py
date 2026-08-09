from supabase import create_client, Client
from app.config.settings import settings

def get_supabase_client() -> Client:
    url = settings.SUPABASE_URL
    key = getattr(settings, "SUPABASE_SERVICE_ROLE_KEY", getattr(settings, "SUPABASE_SERVICE_KEY", ""))
    
    if not url or not key or key == "dummy-key" or key == "your-service-key-here":
        print("WARNING: Supabase variables are not set properly. Client initialized with dummy values to prevent crash.")
        url = "https://dummy.supabase.co"
        # Must be a somewhat valid looking JWT to pass supabase-py validation
        key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSJ9.dummy"
        
    return create_client(url, key)

import threading

class SupabaseProxy:
    def __init__(self):
        self.local = threading.local()
    
    @property
    def client(self) -> Client:
        if not hasattr(self.local, "client"):
            self.local.client = get_supabase_client()
        return self.local.client
        
    def __getattr__(self, name):
        return getattr(self.client, name)

supabase = SupabaseProxy()
