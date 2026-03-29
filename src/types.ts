export interface FinancialProfile {
  name?: string;
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
  insights: { type: 'positive' | 'warning' | 'critical'; text: string }[];
  recommendations: string[];
  breakdown: {
    savings: number;
    debt: number;
    emergency: number;
    protection: number;
  };
  metrics: {
    savingsRate: number;
    expenseRatio: number;
    riskLevel: string;
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
  milestones: { age: number; corpus: number }[];
  inflationAssumed: number;
  returnsAssumed: number;
}

export interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  deadline: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
