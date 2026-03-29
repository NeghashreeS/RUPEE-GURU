export interface FinancialProfile {
  age: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlySavings: number;
  totalInvestments: number;
  totalDebt: number;
  emergencyFundMonths: number;
  hasInsurance: boolean;
}

export interface HealthScoreResult {
  score: number;
  grade: string;
  insights: string[];
  recommendations: string[];
  breakdown: {
    savings: number;
    debt: number;
    emergency: number;
    protection: number;
  };
}

export interface FirePlanResult {
  targetCorpus: number;
  monthlySipRequired: number;
  retirementAge: number;
  yearsToRetire: number;
  assetAllocation: {
    equity: number;
    debt: number;
    gold: number;
    cash: number;
  };
  strategy: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
