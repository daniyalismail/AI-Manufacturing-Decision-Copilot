import requests
import os
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("OPENAI_API_KEY")

res = requests.get(
    f"https://generativelanguage.googleapis.com/v1beta/models?key={API_KEY}"
)
models = res.json().get("models", [])
for m in models:
    if "embed" in m["name"] or "Embed" in m["name"]:
        print(m["name"], m.get("supportedGenerationMethods"))
