import { useState } from "react";
import { getHealthScore } from "../services/apiService";
import { exportHealthScorePDF, exportHealthScoreCSV } from "../lib/exportUtils";
import { Download, FileText, Table } from "lucide-react";
import type { FinancialProfile, HealthScoreResult } from "../types";

export default function HealthScore() {
  const [profile, setProfile] = useState<FinancialProfile>({
    age: 28,
    monthlyIncome: 75000,
    monthlyExpenses: 40000,
    monthlySavings: 25000,
    totalInvestments: 200000,
    totalDebt: 0,
    emergencyFundMonths: 0,
    hasInsurance: false,
  });

  const [result, setResult] = useState<HealthScoreResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof FinancialProfile, value: string | boolean) => {
    setProfile((prev) => ({
      ...prev,
      [field]: typeof value === "boolean" ? value : Number(value) || value,
    }));
  };

  const handleSubmit = async () => {
    console.log("BUTTON CLICKED: Health Score Submit");
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      console.log("SENDING PROFILE TO API:", profile);
      const data = await getHealthScore(profile);
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

  const gradeColor: Record<string, string> = {
    Excellent: "#16a34a",
    Good: "#2563eb",
    Fair: "#d97706",
    Critical: "#dc2626",
  };

  const insightBg: Record<string, string> = {
    positive: "#f0fdf4",
    warning: "#fffbeb",
    critical: "#fef2f2",
  };

  const insightBorder: Record<string, string> = {
    positive: "#86efac",
    warning: "#fcd34d",
    critical: "#fca5a5",
  };

  const insightIcon: Record<string, string> = {
    positive: "✅",
    warning: "⚠️",
    critical: "🚨",
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "24px" }}>
      <h1 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "8px" }}>
        🏥 Financial Health Score
      </h1>
      <p style={{ color: "#6b7280", marginBottom: "32px" }}>
        Fill in your financial details to get an AI-powered health analysis.
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
            { label: "Age", field: "age", placeholder: "28" },
            { label: "Monthly Income (₹)", field: "monthlyIncome", placeholder: "75000" },
            { label: "Monthly Expenses (₹)", field: "monthlyExpenses", placeholder: "40000" },
            { label: "Monthly Savings (₹)", field: "monthlySavings", placeholder: "25000" },
            { label: "Total Investments (₹)", field: "totalInvestments", placeholder: "200000" },
            { label: "Total Debt / Loans (₹)", field: "totalDebt", placeholder: "0" },
            { label: "Emergency Fund (Months)", field: "emergencyFundMonths", placeholder: "0" },
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
        </div>

        <div
          style={{
            display: "flex",
            gap: "24px",
            marginTop: "16px",
            flexWrap: "wrap",
          }}
        >
          {[
            { label: "Have Insurance?", field: "hasInsurance" },
          ].map(({ label, field }) => (
            <label
              key={field}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "14px",
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              <input
                type="checkbox"
                checked={profile[field as keyof FinancialProfile] as boolean}
                onChange={(e) => handleChange(field as keyof FinancialProfile, e.target.checked)}
                style={{ width: "16px", height: "16px", cursor: "pointer" }}
              />
              {label}
            </label>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            marginTop: "24px",
            width: "100%",
            padding: "14px",
            background: loading ? "#9ca3af" : "#16a34a",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            fontSize: "16px",
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "⏳ Analysing your finances..." : "🔍 Get My Health Score"}
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
          {/* Score Card */}
          <div
            style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "16px",
              padding: "28px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "72px",
                fontWeight: 800,
                color: gradeColor[result.grade] ?? "#111",
                lineHeight: 1,
              }}
            >
              {result.score ?? "N/A"}
            </div>
            <div
              style={{
                fontSize: "22px",
                fontWeight: 700,
                color: gradeColor[result.grade] ?? "#111",
                marginTop: "8px",
              }}
            >
              {result.grade || "Unknown"}
            </div>
            <p style={{ color: "#6b7280", marginTop: "6px" }}>
              Financial Health Score out of 100
            </p>

            {/* Export Buttons */}
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "20px" }}>
              <button
                onClick={() => exportHealthScorePDF(profile, result)}
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
                onClick={() => exportHealthScoreCSV(profile, result)}
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

            {/* Breakdown */}
            {result.breakdown && typeof result.breakdown === 'object' && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "12px",
                  marginTop: "24px",
                }}
              >
                {Object.entries(result.breakdown).map(([key, val]) => (
                  <div
                    key={key}
                    style={{
                      background: "#f9fafb",
                      border: "1px solid #e5e7eb",
                      borderRadius: "10px",
                      padding: "12px",
                    }}
                  >
                    <div
                      style={{ fontSize: "22px", fontWeight: 700, color: "#111" }}
                    >
                      {val ?? 0}
                      <span style={{ fontSize: "13px", color: "#6b7280" }}>
                        /25
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#6b7280",
                        textTransform: "capitalize",
                        marginTop: "4px",
                      }}
                    >
                      {key}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Metrics */}
          {result.metrics && (
            <div
              style={{
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "16px",
                padding: "24px",
              }}
            >
              <h3 style={{ fontWeight: 600, marginBottom: "16px" }}>
                📊 Key Metrics
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "12px",
                }}
              >
                {[
                  ["Savings Rate", `${result.metrics.savingsRate}%`],
                  ["Expense Ratio", `${result.metrics.expenseRatio}%`],
                  ["Risk Level", result.metrics.riskLevel],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    style={{
                      background: "#f9fafb",
                      border: "1px solid #e5e7eb",
                      borderRadius: "10px",
                      padding: "14px",
                    }}
                  >
                    <div style={{ fontSize: "13px", color: "#6b7280" }}>
                      {label}
                    </div>
                    <div
                      style={{
                        fontSize: "20px",
                        fontWeight: 700,
                        marginTop: "4px",
                      }}
                    >
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Insights */}
          {result.insights && result.insights.length > 0 && (
            <div
              style={{
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "16px",
                padding: "24px",
              }}
            >
              <h3 style={{ fontWeight: 600, marginBottom: "16px" }}>
                💡 Insights
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {result.insights.map((insight, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "12px 16px",
                      background: insightBg[insight.type],
                      border: `1px solid ${insightBorder[insight.type]}`,
                      borderRadius: "8px",
                      fontSize: "14px",
                    }}
                  >
                    {insightIcon[insight.type]} {insight.text}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {result.recommendations && result.recommendations.length > 0 && (
            <div
              style={{
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "16px",
                padding: "24px",
              }}
            >
              <h3 style={{ fontWeight: 600, marginBottom: "16px" }}>
                🎯 Recommendations
              </h3>
              <ol style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
                {result.recommendations.map((rec, i) => (
                  <li key={i} style={{ fontSize: "14px", lineHeight: 1.6 }}>
                    {rec}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  );
}