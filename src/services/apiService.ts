import type { FinancialProfile, HealthScoreResult, FirePlanResult } from "../types";

const BASE_URL = "/api";

export const saveHealthScore = async (profile: FinancialProfile, result: HealthScoreResult) => {
  const response = await fetch(`${BASE_URL}/health-score/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profile, result }),
  });
  if (!response.ok) throw new Error('Failed to save health score to backend');
  return response.json();
};

export const saveFirePlan = async (profile: FinancialProfile, result: FirePlanResult) => {
  const response = await fetch(`${BASE_URL}/fire-plan/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profile, result }),
  });
  if (!response.ok) throw new Error('Failed to save FIRE plan to backend');
  return response.json();
};

export const getFinancialHistory = async () => {
  const response = await fetch(`${BASE_URL}/history`);
  if (!response.ok) throw new Error('Failed to fetch history');
  return response.json();
};
