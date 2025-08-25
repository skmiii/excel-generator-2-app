from fastapi import FastAPI
from pydantic import BaseModel
from typing import Dict

# Vercel will run this file, and the file path /api/index.py maps to the /api route.
# The paths for endpoints defined here will be relative to /api.
app = FastAPI()

class Columns(BaseModel):
    fixed: list[str]
    optional: Dict[str, bool]

@app.get("/health")
def health_check():
    # This function will be available at /api/health
    return {"status": "ok"}

@app.post("/generate-excel")
def generate_excel(columns: Columns):
    # This function will be available at /api/generate-excel
    selected_optionals = [key for key, value in columns.optional.items() if value]
    return {
        "message": "Successfully received column data from /api/generate-excel.",
        "fixed_columns": columns.fixed,
        "selected_optional_columns": selected_optionals
    }
