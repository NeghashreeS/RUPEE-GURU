import React, { useState } from 'react';
import { motion } from 'motion/react';
import { HeartPulse, CheckCircle2, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { FinancialProfile, HealthScoreResult } from '../types';
import { getHealthScore } from '../services/aiService';
import { cn } from '../lib/utils';

export default function HealthScore() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<HealthScoreResult | null>(null);
  const [profile, setProfile] = useState<FinancialProfile>({
    age: 28,
    monthlyIncome: 80000,
    monthlyExpenses: 35000,
    monthlySavings: 25000,
    totalInvestments: 500000,
    totalDebt: 0,
    emergencyFundMonths: 3,
    hasInsurance: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await getHealthScore(profile);
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Failed to get health score. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-black text-gray-900 tracking-tight">Money Health Score</h2>
        <p className="text-gray-500">Get a professional audit of your finances powered by AI.</p>
      </div>

      {!result ? (
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Your Age</label>
                <input 
                  type="number" 
                  value={profile.age}
                  onChange={(e) => setProfile({...profile, age: Number(e.target.value)})}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-lg font-bold focus:ring-2 focus:ring-green-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Monthly Income (₹)</label>
                <input 
                  type="number" 
                  value={profile.monthlyIncome}
                  onChange={(e) => setProfile({...profile, monthlyIncome: Number(e.target.value)})}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-lg font-bold focus:ring-2 focus:ring-green-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Monthly Expenses (₹)</label>
                <input 
                  type="number" 
                  value={profile.monthlyExpenses}
                  onChange={(e) => setProfile({...profile, monthlyExpenses: Number(e.target.value)})}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-lg font-bold focus:ring-2 focus:ring-green-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Debt (₹)</label>
                <input 
                  type="number" 
                  value={profile.totalDebt}
                  onChange={(e) => setProfile({...profile, totalDebt: Number(e.target.value)})}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-lg font-bold focus:ring-2 focus:ring-green-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Emergency Fund (Months)</label>
                <input 
                  type="number" 
                  value={profile.emergencyFundMonths}
                  onChange={(e) => setProfile({...profile, emergencyFundMonths: Number(e.target.value)})}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-lg font-bold focus:ring-2 focus:ring-green-500 outline-none transition-all"
                />
              </div>
              <div className="flex items-center gap-4 pt-8">
                <button 
                  type="button"
                  onClick={() => setProfile({...profile, hasInsurance: !profile.hasInsurance})}
                  className={cn(
                    "flex-1 py-4 rounded-2xl font-bold transition-all",
                    profile.hasInsurance ? "bg-green-600 text-white" : "bg-gray-100 text-gray-500"
                  )}
                >
                  {profile.hasInsurance ? 'Insurance: Yes' : 'Insurance: No'}
                </button>
              </div>
            </div>

            <div className="md:col-span-2 pt-4">
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-6 rounded-[2rem] text-xl font-black shadow-2xl shadow-green-200 hover:bg-green-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" /> : <HeartPulse />}
                {loading ? 'Analyzing Your Finances...' : 'Generate My Health Score'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-8 animate-in zoom-in-95 duration-500">
          <div className="bg-white p-12 rounded-[3rem] border border-gray-100 shadow-2xl text-center relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-sm font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Your Financial Health Score</p>
              <div className="inline-flex items-center justify-center w-48 h-48 rounded-full border-[12px] border-green-50 mb-6 relative">
                <span className="text-7xl font-black text-green-600">{result.score}</span>
                <div className="absolute -bottom-2 bg-green-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                  {result.grade}
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-8">
                {Object.entries(result.breakdown).map(([key, val]) => (
                  <div key={key} className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{key}</p>
                    <p className="text-xl font-black text-gray-800">{val}/25</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute top-0 left-0 w-full h-2 bg-green-600" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <CheckCircle2 className="text-green-600" /> Key Insights
              </h3>
              <ul className="space-y-4">
                {result.insights.map((insight, i) => (
                  <li key={i} className="flex gap-3 text-gray-600">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm font-medium">{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <AlertCircle className="text-amber-500" /> Recommendations
              </h3>
              <ul className="space-y-4">
                {result.recommendations.map((rec, i) => (
                  <li key={i} className="flex gap-3 text-gray-600">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm font-medium">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <button 
            onClick={() => setResult(null)}
            className="w-full py-4 text-gray-400 font-bold hover:text-gray-600 transition-colors"
          >
            Start New Analysis
          </button>
        </div>
      )}
    </div>
  );
}
