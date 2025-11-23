// services/api.ts
import { Finding, Run, TrendPoint } from "../types";
import { MOCK_FINDINGS, MOCK_RUNS, MOCK_TREND } from "./mockData";

// --- CONFIGURATION MANAGEMENT ---

const STORAGE_KEY = "sentinel_scout_config";

interface AppConfig {
  useMock: boolean;
  apiUrl: string;
}

const DEFAULT_CONFIG: AppConfig = {
  useMock: true,
  apiUrl: "http://localhost:5000/api",
};

export const getConfig = (): AppConfig => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse config", e);
    }
  }
  return DEFAULT_CONFIG;
};

export const saveConfig = (config: AppConfig) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
};

const SIMULATE_DELAY = 600;

// --- API HELPER ---

const handleResponse = async (res: Response, defaultMsg: string) => {
  if (!res.ok) {
    let errorDetails = `${res.status} ${res.statusText}`;
    try {
      const errorJson = await res.json();
      if (errorJson.error) {
        errorDetails = errorJson.error;
      } else if (errorJson.message) {
        errorDetails = errorJson.message;
      }
    } catch (e) {
      // Ignore JSON parse error, use status text
    }
    throw new Error(`${defaultMsg}: ${errorDetails}`);
  }
  return await res.json();
};

// --- API CLIENT ---

export const getRuns = async (): Promise<Run[]> => {
  const config = getConfig();

  if (!config.useMock) {
    try {
      const res = await fetch(`${config.apiUrl}/runs`);
      return await handleResponse(res, "Failed to fetch runs");
    } catch (error) {
      console.error("API Error:", error);
      throw error; // Propagate to caller
    }
  }

  // Mock Fallback
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_RUNS), SIMULATE_DELAY);
  });
};

export const getFindings = async (runId?: string): Promise<Finding[]> => {
  const config = getConfig();

  if (!config.useMock) {
    try {
      const url = runId
        ? `${config.apiUrl}/findings?run_id=${runId}`
        : `${config.apiUrl}/findings`;
      const res = await fetch(url);
      return await handleResponse(res, "Failed to fetch findings");
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  // Mock Fallback
  return new Promise((resolve) => {
    setTimeout(() => {
      if (runId) {
        resolve(MOCK_FINDINGS.filter((f) => f.run_id === runId));
      } else {
        resolve(MOCK_FINDINGS);
      }
    }, SIMULATE_DELAY);
  });
};

export const getTrend = async (): Promise<TrendPoint[]> => {
  const config = getConfig();

  if (!config.useMock) {
    try {
      const res = await fetch(`${config.apiUrl}/trend`);
      return await handleResponse(res, "Failed to fetch trend");
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  // Mock Fallback
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_TREND), SIMULATE_DELAY);
  });
};

export const triggerScan = async (): Promise<{
  message: string;
  runId: string;
}> => {
  const config = getConfig();

  if (!config.useMock) {
    try {
      const res = await fetch(`${config.apiUrl}/scan`, { method: "POST" });
      return await handleResponse(res, "Failed to initiate scan");
    } catch (error) {
      console.error("Scan API Error:", error);
      throw error;
    }
  }

  // Mock Fallback
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        message: "Scan initiated successfully",
        runId: `run-${Date.now()}`,
      });
    }, SIMULATE_DELAY * 2);
  });
};

export const generateReport = async (
  runId: string
): Promise<{ url: string }> => {
  const config = getConfig();

  if (!config.useMock) {
    try {
      const res = await fetch(`${config.apiUrl}/report?run_id=${runId}`);
      return await handleResponse(res, "Failed to generate report");
    } catch (error) {
      console.error("Report API Error:", error);
      throw error;
    }
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ url: "#" });
    }, 1500);
  });
};
