export enum Severity {
  High = 'High',
  Medium = 'Medium',
  Low = 'Low',
  Informational = 'Informational'
}

export interface Run {
  run_id: string;
  timestamp: string; // ISO date
  status: 'completed' | 'failed' | 'running';
  total_findings: number;
}

export interface Finding {
  id: string;
  run_id: string;
  rule_id: string;
  severity: Severity;
  service: string;
  description: string;
  remediation_steps: string;
  evidence: Record<string, any>; // Flexible JSON payload
  resource_id: string;
}

export interface TrendPoint {
  date: string;
  high: number;
  medium: number;
  low: number;
}

export interface DashboardStats {
  total: number;
  high: number;
  medium: number;
  low: number;
  byService: Record<string, number>;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
  attachments?: string[]; // Mock filenames
}