import { useState } from "react";
import { getFirePlan } from "../services/apiService";
import { exportFirePlanPDF, exportFirePlanCSV } from "../lib/exportUtils";
import { FileText, Table } from "lucide-react";
import type { FinancialProfile, FirePlanResult } from "../types";

export default function FirePlanner() {
  const [profile, setProfile] = useState<FinancialProfile>({
    age: 28,
    monthlyIncome: 75000,
    monthlyExpenses: 40000,
    monthlySavings: 25000,
    totalInvestments: 200000,
    totalDebt: 0,
    emergencyFundMonths: 6,
    hasInsurance: true,
  });

  const [retirementAge, setRetirementAge] = useState(45);
  const [result, setResult] = useState<FirePlanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof FinancialProfile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: Number(value) }));
  };

  const handleSubmit = async () => {
    console.log("BUTTON CLICKED: FIRE Plan Submit");
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      console.log("SENDING PROFILE TO API:", profile, "retirementAge:", retirementAge);
      const data = await getFirePlan(profile, retirementAge);
      console.log("API DATA RECEIVED:", data);
      
      if (!data || typeof data !== 'object') {
        throw new Error("Invalid response format from AI");
      }
      
      setResult(data);
    } catch (err: unknown) {
      console.error("SUBMIT ERROR:", err);
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const fmt = (n?: number) =>
    n != null ? `₹${n.toLocaleString("en-IN")}` : "N/A";

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "24px" }}>
      <h1 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "8px" }}>
        🔥 FIRE Planner
      </h1>
      <p style={{ color: "#6b7280", marginBottom: "32px" }}>
        Financial Independence, Retire Early — plan your path to freedom.
      </p>

      {/* ── Form ── */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: "16px",
          padding: "28px",
          marginBottom: "28px",
        }}
      >
        <h2 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "20px" }}>
          Your Financial Profile
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          {[
            { label: "Current Age", field: "age", placeholder: "28" },
            { label: "Monthly Income (₹)", field: "monthlyIncome", placeholder: "75000" },
            { label: "Monthly Expenses (₹)", field: "monthlyExpenses", placeholder: "40000" },
            { label: "Monthly Savings (₹)", field: "monthlySavings", placeholder: "25000" },
            { label: "Total Investments (₹)", field: "totalInvestments", placeholder: "200000" },
            { label: "Total Debt / Loans (₹)", field: "totalDebt", placeholder: "0" },
          ].map(({ label, field, placeholder }) => (
            <div key={field}>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                {label}
              </label>
              <input
                type="number"
                value={profile[field as keyof FinancialProfile] as number}
                placeholder={placeholder}
                onChange={(e) => handleChange(field as keyof FinancialProfile, e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "15px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          ))}

          <div>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: 500,
                color: "#374151",
                marginBottom: "6px",
              }}
            >
              Target Retirement Age
            </label>
            <input
              type="number"
              value={retirementAge}
              min={25}
              max={70}
              onChange={(e) => setRetirementAge(Number(e.target.value))}
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #6c47d5",
                borderRadius: "8px",
                fontSize: "15px",
                outline: "none",
                boxSizing: "border-box",
                fontWeight: 600,
              }}
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            marginTop: "24px",
            width: "100%",
            padding: "14px",
            background: loading ? "#9ca3af" : "#6c47d5",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            fontSize: "16px",
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "⏳ Calculating your FIRE plan..." : "🚀 Calculate My FIRE Plan"}
        </button>
      </div>

      {/* ── Error ── */}
      {error && (
        <div
          style={{
            padding: "14px 18px",
            background: "#fef2f2",
            border: "1px solid #fca5a5",
            borderRadius: "10px",
            color: "#dc2626",
            marginBottom: "24px",
          }}
        >
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* ── Result ── */}
      {result && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Main Numbers */}
          <div
            style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "16px",
              padding: "28px",
            }}
          >
            <h3 style={{ fontWeight: 700, fontSize: "20px", marginBottom: "20px" }}>
              🎯 Your FIRE Numbers
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              {[
                ["FIRE Corpus Needed", fmt(result.targetCorpus), "#6c47d5"],
                ["Monthly SIP Required", fmt(result.monthlySipRequired), "#16a34a"],
                ["Years to Retire", `${result.yearsToRetire || 0} years`, "#2563eb"],
                ["Target Age", `${result.retirementAge || 0} years`, "#d97706"],
                ["Returns Assumed", `${result.returnsAssumed || 0}% p.a.`, "#0891b2"],
                ["Inflation Assumed", `${result.inflationAssumed || 0}% p.a.`, "#dc2626"],
              ].map(([label, value, color]) => (
                <div
                  key={String(label)}
                  style={{
                    background: "#f9fafb",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    padding: "16px",
                  }}
                >
                  <div style={{ fontSize: "13px", color: "#6b7280" }}>{label}</div>
                  <div
                    style={{
                      fontSize: "22px",
                      fontWeight: 700,
                      color: color as string,
                      marginTop: "6px",
                    }}
                  >
                    {value}
                  </div>
                </div>
              ))}
            </div>

            {/* Export Buttons */}
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "20px" }}>
              <button
                onClick={() => exportFirePlanPDF(profile, result)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 16px",
                  background: "#f3f4f6",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  color: "#374151"
                }}
              >
                <FileText size={16} /> Export PDF
              </button>
              <button
                onClick={() => exportFirePlanCSV(profile, result)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 16px",
                  background: "#f3f4f6",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  color: "#374151"
                }}
              >
                <Table size={16} /> Export CSV
              </button>
            </div>
          </div>

          {/* Asset Allocation */}
          {result.assetAllocation && typeof result.assetAllocation === 'object' && (
            <div
              style={{
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "16px",
                padding: "24px",
              }}
            >
              <h3 style={{ fontWeight: 600, marginBottom: "16px" }}>
                📊 Recommended Asset Allocation
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "12px",
                }}
              >
                {Object.entries(result.assetAllocation).map(([key, val]) => {
                  const colors: Record<string, string> = {
                    equity: "#6c47d5",
                    debt: "#2563eb",
                    gold: "#d97706",
                    cash: "#16a34a",
                  };
                  return (
                    <div
                      key={key}
                      style={{
                        textAlign: "center",
                        background: "#f9fafb",
                        border: "1px solid #e5e7eb",
                        borderRadius: "12px",
                        padding: "16px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "28px",
                          fontWeight: 800,
                          color: colors[key] ?? "#111",
                        }}
                      >
                        {val ?? 0}%
                      </div>
                      <div
                        style={{
                          fontSize: "13px",
                          color: "#6b7280",
                          textTransform: "capitalize",
                          marginTop: "4px",
                        }}
                      >
                        {key}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Milestones */}
          {result.milestones && result.milestones.length > 0 && (
            <div
              style={{
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "16px",
                padding: "24px",
              }}
            >
              <h3 style={{ fontWeight: 600, marginBottom: "16px" }}>
                🏁 Milestones
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {result.milestones.map((m, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "14px 18px",
                      background: "#f5f0ff",
                      border: "1px solid #c9b8f0",
                      borderRadius: "10px",
                    }}
                  >
                    <div style={{ fontWeight: 600 }}>Age {m.age}</div>
                    <div style={{ fontSize: "18px", fontWeight: 700, color: "#6c47d5" }}>
                      {fmt(m.corpus)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Strategy */}
          {result.strategy && (
            <div
              style={{
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "16px",
                padding: "24px",
              }}
            >
              <h3 style={{ fontWeight: 600, marginBottom: "12px" }}>
                📋 Your Personalised Strategy
              </h3>
              <p
                style={{
                  fontSize: "14px",
                  lineHeight: 1.8,
                  color: "#374151",
                  whiteSpace: "pre-line",
                }}
              >
                {result.strategy}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}