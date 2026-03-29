import type { FinancialProfile, HealthScoreResult, FirePlanResult } from "../types";

const BASE_URL = "/api";

export const getHealthScore = async (profile: FinancialProfile): Promise<HealthScoreResult> => {
  const response = await fetch(`${BASE_URL}/health-score`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile),
  });
  if (!response.ok) throw new Error('Failed to fetch health score from backend');
  const data = await response.json();
  return data.result;
};

export const getFirePlan = async (profile: FinancialProfile, targetRetirementAge: number): Promise<FirePlanResult> => {
  const response = await fetch(`${BASE_URL}/fire-plan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profile, retirementAge: targetRetirementAge }),
  });
  if (!response.ok) throw new Error('Failed to fetch FIRE plan from backend');
  const data = await response.json();
  return data.result;
};

export const chatWithGuru = async (history: { role: 'user' | 'model', parts: { text: string }[] }[]) => {
  const lastMessage = history[history.length - 1].parts[0].text;
  const response = await fetch(`${BASE_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: lastMessage }),
  });
  if (!response.ok) throw new Error('Failed to get chat response from backend');
  const data = await response.json();
  return data.result;
};
