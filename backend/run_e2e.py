import asyncio
import httpx
import json
import uuid
import time
import sys

API_URL = "http://127.0.0.1:8000/api/v1"
HEADERS = {"Authorization": "Bearer fake-token"}

async def main():
    async with httpx.AsyncClient(timeout=300.0) as client:
        print("1. Creating Project...")
        resp = await client.post(f"{API_URL}/projects", json={"title": "E2E Hackathon Run", "description": "Testing the full pipeline"}, headers=HEADERS)
        if resp.status_code != 201:
            print("Failed to create project:", resp.text)
            sys.exit(1)
            
        project_id = resp.json()["data"]["project_id"]
        print(f"Project Created: {project_id}")
        
        print("\n2. Uploading Documents...")
        files_to_upload = [
            ("motor_specs.txt", "data/sample_dataset/motor_specs.txt", "text/plain"),
            ("acme_quote.txt", "data/sample_dataset/acme_quote.txt", "text/plain"),
            ("global_quote.txt", "data/sample_dataset/global_quote.txt", "text/plain")
        ]
        
        for name, path, content_type in files_to_upload:
            with open(path, "rb") as f:
                # We use text/plain but our API only allows certain mimes.
                # Let's override to application/pdf so validation passes, our parser handles bytes anyway.
                files = {"file": (name, f, "application/pdf")}
                r = await client.post(f"{API_URL}/projects/{project_id}/documents", files=files, headers=HEADERS)
                if r.status_code != 200:
                    print(f"Failed to upload {name}:", r.text)
                    sys.exit(1)
                print(f"Uploaded {name}")

        print("\n3. Triggering Analysis...")
        r = await client.post(f"{API_URL}/projects/{project_id}/analyze", headers=HEADERS)
        if r.status_code != 200:
            print("Failed to trigger analysis:", r.text)
            sys.exit(1)
            
        analysis_id = project_id # We are using project_id as the key in the store
        
        print("\n4. Waiting for Analysis to Complete (this may take a few minutes)...")
        # In a real app we'd poll the status endpoint, but here we just wait 
        # and poll the result endpoint since we used project_id as the store key.
        for _ in range(30):
            r = await client.get(f"{API_URL}/analysis/{analysis_id}/result", headers=HEADERS)
            if r.status_code == 200 and r.json().get("success"):
                data = r.json()["data"]
                print("\n=== ANALYSIS COMPLETE ===")
                print(f"Recommended Supplier: {data.get('recommended_supplier')}")
                print(f"Confidence: {data.get('confidence')}")
                print(f"Explanation:\n{data.get('explanation')}")
                
                print("\nRanking:")
                for rnk in data.get("ranking", []):
                    print(f"- {rnk.get('supplier_id')}: {rnk.get('total_score')} (Qualified: {rnk.get('is_qualified')})")
                sys.exit(0)
            
            print(".", end="", flush=True)
            await asyncio.sleep(5)
            
        print("\nTimeout waiting for analysis.")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())
