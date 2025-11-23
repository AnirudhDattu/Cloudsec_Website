// services/mockData.ts

import { Finding, Run, Severity, TrendPoint } from "../types";

export const MOCK_RUNS: Run[] = [
  {
    run_id: "run-20231025-001",
    timestamp: "2023-10-25T08:00:00Z",
    status: "completed",
    total_findings: 12,
  },
  {
    run_id: "run-20231026-001",
    timestamp: "2023-10-26T08:00:00Z",
    status: "completed",
    total_findings: 15,
  },
  {
    run_id: "run-20231027-001",
    timestamp: "2023-10-27T08:00:00Z",
    status: "completed",
    total_findings: 8,
  },
  {
    run_id: "run-20231028-001",
    timestamp: "2023-10-28T08:00:00Z",
    status: "completed",
    total_findings: 20,
  },
  {
    run_id: "run-20231029-001",
    timestamp: "2023-10-29T08:00:00Z",
    status: "running",
    total_findings: 0,
  },
];

export const MOCK_FINDINGS: Finding[] = [
  {
    id: "f-101",
    run_id: "run-20231028-001",
    rule_id: "AZ-STORAGE-001",
    severity: Severity.High,
    service: "Storage Accounts",
    description: "Storage account allows public access.",
    remediation_steps:
      'Set "Allow Blob Public Access" to Disabled in Configuration.',
    resource_id:
      "/subscriptions/sub-1/resourceGroups/rg-prod/providers/Microsoft.Storage/storageAccounts/proddata",
    evidence: { publicAccess: true, encryption: "Microsoft.Storage" },
  },
  {
    id: "f-102",
    run_id: "run-20231028-001",
    rule_id: "AZ-SQL-004",
    severity: Severity.High,
    service: "SQL Database",
    description: "SQL Server Firewall allows 0.0.0.0-255.255.255.255",
    remediation_steps: "Remove the firewall rule allowing all IPs.",
    resource_id: "sql-prod-db-01",
    evidence: {
      firewallRules: [
        { name: "AllowAll", startIp: "0.0.0.0", endIp: "255.255.255.255" },
      ],
    },
  },
  {
    id: "f-103",
    run_id: "run-20231028-001",
    rule_id: "AZ-VM-002",
    severity: Severity.Medium,
    service: "Virtual Machines",
    description: "Disk encryption not enabled on data disks.",
    remediation_steps: "Enable Azure Disk Encryption (ADE) for the VM.",
    resource_id: "vm-frontend-01",
    evidence: { osDisk: "Encrypted", dataDisks: ["Unencrypted"] },
  },
  {
    id: "f-104",
    run_id: "run-20231028-001",
    rule_id: "AZ-IAM-010",
    severity: Severity.Low,
    service: "IAM",
    description: "Too many owners assigned to subscription.",
    remediation_steps:
      "Reduce the number of Owner role assignments to less than 3.",
    resource_id: "/subscriptions/sub-1",
    evidence: {
      ownerCount: 5,
      owners: [
        "alice@corp.com",
        "bob@corp.com",
        "charlie@corp.com",
        "dave@corp.com",
        "eve@corp.com",
      ],
    },
  },
  {
    id: "f-105",
    run_id: "run-20231028-001",
    rule_id: "AZ-NET-005",
    severity: Severity.Medium,
    service: "Network",
    description: "RDP (3389) open to internet.",
    remediation_steps:
      "Restrict RDP access to specific IP ranges or use Bastion.",
    resource_id: "nsg-frontend",
    evidence: { rule: "AllowRDP", port: 3389, source: "*" },
  },
  // Duplicate data for other runs to populate charts
  {
    id: "f-001",
    run_id: "run-20231025-001",
    rule_id: "AZ-STORAGE-001",
    severity: Severity.High,
    service: "Storage Accounts",
    description: "Storage account allows public access.",
    remediation_steps:
      'Set "Allow Blob Public Access" to Disabled in Configuration.',
    resource_id: "st-legacy",
    evidence: { publicAccess: true },
  },
];

export const MOCK_TREND: TrendPoint[] = [
  { date: "10/25", high: 2, medium: 5, low: 5 },
  { date: "10/26", high: 3, medium: 8, low: 4 },
  { date: "10/27", high: 1, medium: 4, low: 3 },
  { date: "10/28", high: 4, medium: 10, low: 6 },
];
