import { GoogleGenAI } from "@google/genai";
import type { FinancialProfile, HealthScoreResult, FirePlanResult, ChatMessage, Goal } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getHealthScore(profile: FinancialProfile): Promise<HealthScoreResult> {
  console.log("getHealthScore CALLED with profile:", profile);
  try {
    const prompt = `You are a Senior Financial Advisor for Indian users. Analyze this profile and return a JSON object.
    Profile: ${JSON.stringify(profile)}
    
    Requirements:
    - score: number (0-100)
    - grade: string (Excellent, Good, Fair, Critical)
    - insights: array of 3 objects { type: "positive" | "warning" | "critical", text: string }
    - recommendations: array of 4 strings (specific Indian context like PPF, ELSS, NPS, 80C)
    - breakdown: object { savings: number, debt: number, emergency: number, protection: number } (each 0-25)
    - metrics: object { savingsRate: number (%), expenseRatio: number (%), riskLevel: string }
    
    Return ONLY the raw JSON object. No markdown, no explanations.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    console.log("GEMINI RESPONSE [Health Score]:", response);
    const text = response.text;
    console.log("AI TEXT [Health Score]:", text);
    
    const cleanJson = text.replace(/```json|```/g, "").trim();
    const parsedResult = JSON.parse(cleanJson);
    console.log("PARSED RESULT [Health Score]:", parsedResult);

    // Save to history
    fetch("/api/health-score/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile, result: parsedResult }),
    }).catch(err => console.error("Failed to save health score history:", err));

    return parsedResult;
  } catch (error) {
    console.error("getHealthScore error:", error);
    throw error;
  }
}

export async function getFirePlan(
  profile: FinancialProfile,
  retirementAge: number
): Promise<FirePlanResult> {
  console.log("getFirePlan CALLED with profile:", profile, "retirementAge:", retirementAge);
  try {
    const prompt = `Create a detailed FIRE (Financial Independence, Retire Early) plan for an Indian user.
    Profile: ${JSON.stringify(profile)}
    Target Retirement Age: ${retirementAge}
    
    Return a JSON object with:
    - targetCorpus: number (Total amount in INR)
    - monthlySipRequired: number (INR)
    - retirementAge: number (The target retirement age provided)
    - yearsToRetire: number (Target retirement age minus current age)
    - assetAllocation: { equity: number, debt: number, gold: number, cash: number } (percentages)
    - strategy: string (detailed 300-word strategy)
    - milestones: array of 3 objects { age: number, corpus: number }
    - inflationAssumed: number (percentage)
    - returnsAssumed: number (percentage)
    
    Return ONLY the raw JSON object. No markdown, no explanations.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    console.log("GEMINI RESPONSE [FIRE Plan]:", response);
    const text = response.text;
    console.log("AI TEXT [FIRE Plan]:", text);

    const cleanJson = text.replace(/```json|```/g, "").trim();
    const parsedResult = JSON.parse(cleanJson);
    console.log("PARSED RESULT [FIRE Plan]:", parsedResult);

    // Save to history
    fetch("/api/fire-plan/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile, result: parsedResult }),
    }).catch(err => console.error("Failed to save FIRE plan history:", err));

    return parsedResult;
  } catch (error) {
    console.error("getFirePlan error:", error);
    throw error;
  }
}

export async function chatWithGuru(message: string, history: ChatMessage[]): Promise<string> {
  console.log("chatWithGuru CALLED with message:", message, "history length:", history.length);
  try {
    const contents = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    // Add the current message
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents,
      config: {
        systemInstruction: "You are Rupee Guru, a world-class Indian personal finance mentor. You help users reach financial freedom. Use simple English, mention Indian schemes (PPF, NPS, SIP, ELSS), and provide actionable advice. Use ₹ symbol. If the user asks about stocks, remind them about diversification. Be encouraging but realistic."
      }
    });

    console.log("GEMINI RESPONSE [Chat]:", response);
    const text = response.text;
    console.log("AI TEXT [Chat]:", text);

    return text;
  } catch (error) {
    console.error("chatWithGuru error:", error);
    throw error;
  }
}

export async function getFinancialHistory(): Promise<any> {
  const response = await fetch("/api/history");
  if (!response.ok) throw new Error("Failed to fetch history");
  const data = await response.json();
  console.log("API RESPONSE [getFinancialHistory]:", data);
  return data;
}

export async function getGoals(): Promise<Goal[]> {
  const response = await fetch("/api/goals");
  if (!response.ok) throw new Error("Failed to fetch goals");
  const data = await response.json();
  console.log("API RESPONSE [getGoals]:", data);
  return data;
}
