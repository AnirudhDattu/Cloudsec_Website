# API Contract Specification

This document defines the HTTP API endpoints and JSON structures required by the Azure Sentinel Scout frontend. 
You can provide this file to an AI (like ChatGPT/Claude) with the prompt: 
*"Create a Python Flask/FastAPI backend that implements these endpoints matching the exact JSON structure."*

## Base Configuration
- **Default Base URL**: `http://localhost:5000/api`
- **CORS**: Must be enabled for the frontend origin (e.g., `http://localhost:5173`).

---

## Endpoints

### 1. Get All Runs
**GET** `/api/runs`

Returns a list of historical scans.

**Response JSON:**
```json
[
  {
    "run_id": "run-20231028-001",
    "timestamp": "2023-10-28T08:00:00Z",
    "status": "completed",
    "total_findings": 20
  },
  {
    "run_id": "run-20231029-001",
    "timestamp": "2023-10-29T08:00:00Z",
    "status": "running",
    "total_findings": 0
  }
]
```

### 2. Get Findings
**GET** `/api/findings`
**Query Params:** `?run_id=<string>` (Optional. If omitted, return all findings or latest run).

Returns the detailed security issues.

**Response JSON:**
```json
[
  {
    "id": "f-101",
    "run_id": "run-20231028-001",
    "rule_id": "AZ-STORAGE-001",
    "severity": "High", 
    "service": "Storage Accounts",
    "description": "Storage account allows public access.",
    "remediation_steps": "Set 'Allow Blob Public Access' to Disabled.",
    "resource_id": "/subscriptions/sub-1/.../storageAccounts/proddata",
    "evidence": {
      "publicAccess": true,
      "encryption": "Microsoft.Storage"
    }
  }
]
```
*Note: `severity` must be exactly "High", "Medium", "Low", or "Informational".*
*Note: `evidence` can be any valid JSON object.*

### 3. Get Trend Data
**GET** `/api/trend`

Returns data for the historical trend line chart.

**Response JSON:**
```json
[
  { "date": "10/25", "high": 2, "medium": 5, "low": 5 },
  { "date": "10/26", "high": 3, "medium": 8, "low": 4 },
  { "date": "10/27", "high": 1, "medium": 4, "low": 3 }
]
```

### 4. Trigger Scan
**POST** `/api/scan`

Initiates a new scan.

**Response JSON:**
```json
{
  "message": "Scan initiated successfully",
  "runId": "run-1700000000"
}
```

### 5. Generate Report
**GET** `/api/report`
**Query Params:** `?run_id=<string>`

Returns a link to download the report.

**Response JSON:**
```json
{
  "url": "https://path-to-report/report.pdf"
}
```
