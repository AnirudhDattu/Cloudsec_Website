# Backend Integration Guide

This guide explains how to connect the frontend to your existing Python backend (`scanner/`, `db/dao.py`).

## Prerequisites

Ensure your existing Python environment has Flask installed:
```bash
pip install flask flask-cors
```

## 1. Update `scanner/run_scan.py`

Ensure your `run_scan.py` returns the findings list so the API can save them.

```python
# scanner/run_scan.py
from scanner.inventory import list_storage_accounts
from scanner.checks_azure import check_storage_public_blob_access
from scanner.check_storage_encryption import check_storage_encryption
from scanner.check_vms import list_vms_with_public_ip
from scanner.check_nsg import check_open_nsg_rules
from scanner.check_function_apps import check_unrestricted_function_apps
import json

def run():
    findings = []

    print("Scanning storage accounts...")
    accounts = list_storage_accounts()
    findings += check_storage_public_blob_access(accounts)
    print("Checking storage account encryption...")
    findings += check_storage_encryption(accounts)

    print("Scanning virtual machines for public IPs...")
    findings += list_vms_with_public_ip()

    print("Scanning NSGs for open rules...")
    findings += check_open_nsg_rules()

    print("Scanning Function Apps for anonymous access...")
    findings += check_unrestricted_function_apps()

    print(f"\nTotal findings: {len(findings)}")
    
    # ... existing print logic ...
    
    return findings  # <--- IMPORTANT: Return the findings list!

if __name__ == "__main__":
    run()
```

## 2. Update `server.py`

Create or update `server.py` in your project root. This script bridges the React frontend with your Python logic.

```python
# server.py
import json
import time
from flask import Flask, jsonify, request
from flask_cors import CORS
import db.dao as dao
from scanner import run_scan  # <--- Correct Import

app = Flask(__name__)
CORS(app)

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
    if run_id:
        findings_list = dao.get_findings_by_run(run_id)
    else:
        findings_list = dao.get_all_findings()
        
    mapped_results = []
    for f in findings_list:
        evidence = parse_json_field(f.get('evidence'), {})
        remediation = parse_json_field(f.get('remediation'), [])
        
        remediation_text = remediation
        if isinstance(remediation, list):
            remediation_text = "\n".join(remediation)
            
        mapped_results.append({
            "id": str(f.get('id')),
            "run_id": f.get('run_id'),
            "rule_id": f.get('rule_id'),
            "severity": f.get('severity'),
            "service": f.get('service'),
            "description": f.get('title'),
            "remediation_steps": remediation_text, 
            "resource_id": f.get('resource_id'),
            "evidence": evidence
        })
    return jsonify(mapped_results)

@app.route('/api/runs', methods=['GET'])
def get_runs():
    runs = dao.get_all_runs()
    return jsonify([{
        "run_id": str(r.get('id')),
        "timestamp": r.get('started_at').isoformat() if r.get('started_at') else None,
        "status": r.get('status'),
        "total_findings": 0 
    } for r in runs])

@app.route('/api/trend', methods=['GET'])
def get_trend():
    trend = dao.get_findings_trend()
    return jsonify(trend)

@app.route('/api/scan', methods=['POST'])
def trigger_scan():
    try:
        run_id = dao.start_run()
        
        # Execute the scan and get results
        findings = run_scan.run()  # <--- Capture returned findings
        
        if findings is None:
             findings = [] # Safety check
             
        dao.save_findings(run_id, findings)
        dao.finish_run(run_id)
        
        return jsonify({"message": "Scan completed", "runId": str(run_id)})
    except Exception as e:
        # Return error details to frontend
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
