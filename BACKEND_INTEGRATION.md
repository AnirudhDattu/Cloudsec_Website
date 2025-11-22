# Backend Integration Guide

This guide explains how to connect the frontend to your existing Python backend (`scanner/`, `db/dao.py`).

## Prerequisites

Ensure your existing Python environment has Flask installed:
```bash
pip install flask flask-cors
```

## Create `server.py`

Create a file named `server.py` in your project root (the same directory as `run_scan.py` and `app.py`). 
This script acts as a bridge, using your existing `db.dao` to fetch data and serving it to the React app.

```python
# server.py
import json
import time
from flask import Flask, jsonify, request
from flask_cors import CORS
import db.dao as dao  # Imports your existing DAO functions
from scanner.run_scan import run_scan # Imports your existing scan logic if available

app = Flask(__name__)
CORS(app)  # Enables the React frontend to communicate with this server

# Helper to safely parse the JSON strings stored in your DB
def parse_json_field(field_value, default_value):
    if not field_value:
        return default_value
    if isinstance(field_value, str):
        try:
            return json.loads(field_value)
        except:
            return default_value
    return field_value

@app.route('/api/findings', methods=['GET'])
def get_findings():
    run_id = request.args.get('run_id')
    
    # Use your existing DAO functions
    if run_id:
        findings_list = dao.get_findings_by_run(run_id)
    else:
        findings_list = dao.get_all_findings()
        
    # Map the DAO dictionaries to the Frontend API contract
    mapped_results = []
    for f in findings_list:
        # Parse 'evidence' and 'remediation' from JSON strings to objects/lists
        evidence = parse_json_field(f.get('evidence'), {})
        remediation = parse_json_field(f.get('remediation'), [])
        
        # If remediation is a list, join it into a string for the frontend table
        remediation_text = remediation
        if isinstance(remediation, list):
            remediation_text = "\n".join(remediation)
            
        mapped_results.append({
            "id": str(f.get('id')),
            "run_id": f.get('run_id'),
            "rule_id": f.get('rule_id'),
            "severity": f.get('severity'), # Must be 'High', 'Medium', 'Low', or 'Informational'
            "service": f.get('service'),
            "description": f.get('title'), # Frontend expects 'description', DB has 'title'
            "remediation_steps": remediation_text, 
            "resource_id": f.get('resource_id'),
            "evidence": evidence
        })
        
    return jsonify(mapped_results)

@app.route('/api/runs', methods=['GET'])
def get_runs():
    # Use existing DAO
    runs = dao.get_all_runs()
    
    # Map to frontend contract
    return jsonify([{
        "run_id": str(r.id), # Or r.run_id if that's your column
        "timestamp": r.started_at.isoformat() if r.started_at else None,
        "status": r.status,
        "total_findings": 0 # You might need a separate count query or field here
    } for r in runs])

@app.route('/api/trend', methods=['GET'])
def get_trend():
    # Use existing DAO
    trend = dao.get_findings_trend()
    return jsonify(trend)

@app.route('/api/scan', methods=['POST'])
def trigger_scan():
    # Trigger your existing scan logic
    try:
        # Example flow matching your 'app.py' logic:
        run_id = dao.start_run()
        
        # NOTE: In a real deployment, run this in a background thread!
        # For now, we run it synchronously to keep it simple.
        findings = run_scan() 
        dao.save_findings(run_id, findings)
        dao.finish_run(run_id)
        
        return jsonify({"message": "Scan completed", "runId": str(run_id)})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("Starting Sentinel Scout API Bridge on port 5000...")
    app.run(debug=True, port=5000)
```

## Running the App

1.  **Start the Backend**:
    ```bash
    python server.py
    ```
2.  **Configure Frontend**:
    *   Open the Web App.
    *   Go to **Settings**.
    *   Switch Mode to **REAL BACKEND**.
    *   Ensure API URL is `http://localhost:5000/api`.
    *   Click **Test Connection**.
