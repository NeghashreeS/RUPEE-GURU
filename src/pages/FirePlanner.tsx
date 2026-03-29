import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Flame, Target, TrendingUp, ArrowRight, Loader2, PieChart } from 'lucide-react';
import type { FinancialProfile, FirePlanResult } from '../types';
import { getFirePlan } from '../services/aiService';
import { saveFirePlan } from '../services/apiService';
import { cn } from '../lib/utils';

export default function FirePlanner() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<FirePlanResult | null>(null);
  const [retirementAge, setRetirementAge] = useState(45);
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
      const data = await getFirePlan(profile, retirementAge);
      setResult(data);

      // End-to-End: Save to backend
      setSaving(true);
      await saveFirePlan(profile, data);
    } catch (error) {
      console.error(error);
      alert("Failed to generate FIRE plan. Please try again.");
    } finally {
      setLoading(false);
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-black text-gray-900 tracking-tight">FIRE Planner</h2>
        <p className="text-gray-500">Plan your early retirement with AI-optimized strategies.</p>
      </div>

      {!result ? (
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Current Age</label>
                <input 
                  type="number" 
                  value={profile.age}
                  onChange={(e) => setProfile({...profile, age: Number(e.target.value)})}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-lg font-bold focus:ring-2 focus:ring-green-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Target Retirement Age</label>
                <input 
                  type="number" 
                  value={retirementAge}
                  onChange={(e) => setRetirementAge(Number(e.target.value))}
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
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Monthly Expenses (₹)</label>
                <input 
                  type="number" 
                  value={profile.monthlyExpenses}
                  onChange={(e) => setProfile({...profile, monthlyExpenses: Number(e.target.value)})}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-lg font-bold focus:ring-2 focus:ring-green-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Current Investments (₹)</label>
                <input 
                  type="number" 
                  value={profile.totalInvestments}
                  onChange={(e) => setProfile({...profile, totalInvestments: Number(e.target.value)})}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-lg font-bold focus:ring-2 focus:ring-green-500 outline-none transition-all"
                />
              </div>
              <div className="pt-8">
                <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
                  <p className="text-xs font-bold text-green-700 uppercase tracking-widest mb-1">Current Savings Rate</p>
                  <p className="text-2xl font-black text-green-800">
                    {((profile.monthlySavings / profile.monthlyIncome) * 100).toFixed(0)}%
                  </p>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 pt-4">
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-6 rounded-[2rem] text-xl font-black shadow-2xl shadow-green-200 hover:bg-green-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Flame />}
                {loading ? 'Calculating Your Future...' : 'Generate My FIRE Plan'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-8 animate-in zoom-in-95 duration-500">
          <div className="bg-green-600 p-12 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-green-100 uppercase tracking-[0.3em]">Target Corpus</p>
                <p className="text-4xl font-black">₹{(result.targetCorpus / 10000000).toFixed(2)} Cr</p>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-green-100 uppercase tracking-[0.3em]">Monthly SIP</p>
                <p className="text-4xl font-black">₹{result.monthlySipRequired.toLocaleString()}</p>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-green-100 uppercase tracking-[0.3em]">Retirement Age</p>
                <p className="text-4xl font-black">{result.retirementAge}</p>
              </div>
            </div>
            <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <PieChart className="text-green-600" /> Asset Allocation
              </h3>
              <div className="space-y-4">
                {Object.entries(result.assetAllocation).map(([key, val]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-400">
                      <span>{key}</span>
                      <span>{val}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${val}%` }}
                        className={cn(
                          "h-full rounded-full",
                          key === 'equity' ? 'bg-green-600' : key === 'debt' ? 'bg-blue-600' : 'bg-amber-500'
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <Target className="text-green-600" /> AI Strategy
              </h3>
              <p className="text-sm font-medium text-gray-600 leading-relaxed">
                {result.strategy}
              </p>
            </div>
          </div>

          <button 
            onClick={() => setResult(null)}
            className="w-full py-4 text-gray-400 font-bold hover:text-gray-600 transition-colors"
          >
            Adjust Plan Parameters
          </button>
        </div>
      )}
    </div>
  );
}
