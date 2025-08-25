from fastapi import FastAPI
from pydantic import BaseModel
from typing import Dict

app = FastAPI()

class Columns(BaseModel):
    fixed: list[str]
    optional: Dict[str, bool]

@app.get("/api/health")
def health_check():
    return {"status": "ok"}

@app.post("/api/generate-excel")
def generate_excel(columns: Columns):
    # For now, just return the columns that were received
    # In the future, this will generate an Excel file
    
    print("Received data:", columns)
    
    selected_optionals = [key for key, value in columns.optional.items() if value]
    
    return {
        "message": "Successfully received column data.",
        "fixed_columns": columns.fixed,
        "selected_optional_columns": selected_optionals
    }
