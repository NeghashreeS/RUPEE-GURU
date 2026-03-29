import { GoogleGenAI, Type } from "@google/genai";
import type { FinancialProfile, HealthScoreResult, FirePlanResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const getHealthScore = async (profile: FinancialProfile): Promise<HealthScoreResult> => {
  const prompt = `You are a financial advisor for Indian users. Analyze the following financial data and provide a detailed health score.
  
  Data:
  - Age: ${profile.age}
  - Monthly Income: ₹${profile.monthlyIncome}
  - Monthly Expenses: ₹${profile.monthlyExpenses}
  - Monthly Savings: ₹${profile.monthlySavings}
  - Total Investments: ₹${profile.totalInvestments}
  - Total Debt: ₹${profile.totalDebt}
  - Emergency Fund: ${profile.emergencyFundMonths} months of expenses
  - Has Insurance: ${profile.hasInsurance ? 'Yes' : 'No'}

  Return a JSON response with the following structure:
  {
    "score": number (0-100),
    "grade": "Excellent" | "Good" | "Fair" | "Critical",
    "insights": string[],
    "recommendations": string[],
    "breakdown": {
      "savings": number (0-25),
      "debt": number (0-25),
      "emergency": number (0-25),
      "protection": number (0-25)
    }
  }`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    },
  });

  return JSON.parse(response.text);
};

export const getFirePlan = async (profile: FinancialProfile, targetRetirementAge: number): Promise<FirePlanResult> => {
  const prompt = `Create a FIRE (Financial Independence, Retire Early) plan for an Indian user.
  
  Current Data:
  - Current Age: ${profile.age}
  - Target Retirement Age: ${targetRetirementAge}
  - Monthly Income: ₹${profile.monthlyIncome}
  - Monthly Expenses: ₹${profile.monthlyExpenses}
  - Monthly Savings: ₹${profile.monthlySavings}
  - Current Investments: ₹${profile.totalInvestments}

  Return a JSON response with the following structure:
  {
    "targetCorpus": number (in ₹),
    "monthlySipRequired": number (in ₹),
    "retirementAge": number,
    "yearsToRetire": number,
    "assetAllocation": {
      "equity": number (percentage),
      "debt": number (percentage),
      "gold": number (percentage),
      "cash": number (percentage)
    },
    "strategy": string
  }`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    },
  });

  return JSON.parse(response.text);
};

export const chatWithGuru = async (history: { role: 'user' | 'model', parts: { text: string }[] }[]) => {
  const chat = ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: "You are Rupee Guru, a friendly and professional Indian financial advisor. Give simple, practical, and actionable advice. Focus on Indian financial instruments like PPF, ELSS, SIP, NPS, FD, 80C, 80D. Use ₹ symbol for currency.",
    },
  });

  // We only send the last message for simplicity in this helper, 
  // but the full chat history can be passed to ai.chats.create
  const lastMessage = history[history.length - 1].parts[0].text;
  const response = await chat.sendMessage({ message: lastMessage });
  return response.text;
};
