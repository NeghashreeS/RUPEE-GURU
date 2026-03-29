import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import type { HealthScoreResult, FirePlanResult, FinancialProfile } from '../types';

// Extend jsPDF with autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

/**
 * Export Health Score to CSV
 */
export const exportHealthScoreCSV = (profile: FinancialProfile, result: HealthScoreResult) => {
  const headers = ['Metric', 'Value'];
  const data = [
    ['User Name', (profile as any).name || 'User'],
    ['Age', profile.age],
    ['Monthly Income', `₹${profile.monthlyIncome}`],
    ['Monthly Expenses', `₹${profile.monthlyExpenses}`],
    ['Monthly Savings', `₹${profile.monthlySavings}`],
    ['Total Investments', `₹${profile.totalInvestments}`],
    ['Total Debt', `₹${profile.totalDebt}`],
    ['Health Score', `${result.score}/100`],
    ['Grade', result.grade],
    ['Savings Rate', `${result.metrics.savingsRate}%`],
    ['Expense Ratio', `${result.metrics.expenseRatio}%`],
    ['Risk Level', result.metrics.riskLevel],
    ['Emergency Fund Score', `${result.breakdown.emergency}/25`],
    ['Protection Score', `${result.breakdown.protection}/25`],
    ['Debt Score', `${result.breakdown.debt}/25`],
    ['Savings Score', `${result.breakdown.savings}/25`],
  ];

  const csvContent = [
    headers.join(','),
    ...data.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `RupeeGuru_HealthScore_${((profile as any).name || 'User').replace(/\s+/g, '_')}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Export Health Score to PDF
 */
export const exportHealthScorePDF = (profile: FinancialProfile, result: HealthScoreResult) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(22);
  doc.setTextColor(34, 197, 94); // Green-500
  doc.text('Rupee Guru - Financial Health Audit', 14, 20);
  
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
  
  // User Profile
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('User Profile', 14, 45);
  
  doc.autoTable({
    startY: 50,
    head: [['Field', 'Value']],
    body: [
      ['Name', (profile as any).name || 'User'],
      ['Age', profile.age],
      ['Monthly Income', `INR ${profile.monthlyIncome.toLocaleString('en-IN')}`],
      ['Monthly Expenses', `INR ${profile.monthlyExpenses.toLocaleString('en-IN')}`],
      ['Total Investments', `INR ${profile.totalInvestments.toLocaleString('en-IN')}`],
      ['Total Debt', `INR ${profile.totalDebt.toLocaleString('en-IN')}`],
    ],
    theme: 'striped',
    headStyles: { fillColor: [34, 197, 94] },
  });
  
  // Audit Results
  const finalY = (doc as any).lastAutoTable.finalY || 100;
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Audit Results', 14, finalY + 15);
  
  doc.autoTable({
    startY: finalY + 20,
    head: [['Metric', 'Result']],
    body: [
      ['Health Score', `${result.score}/100`],
      ['Grade', result.grade],
      ['Savings Rate', `${result.metrics.savingsRate}%`],
      ['Expense Ratio', `${result.metrics.expenseRatio}%`],
      ['Risk Level', result.metrics.riskLevel],
    ],
    theme: 'grid',
    headStyles: { fillColor: [34, 197, 94] },
  });

  // Insights
  const insightsY = (doc as any).lastAutoTable.finalY || 180;
  doc.setFontSize(16);
  doc.text('Key Insights', 14, insightsY + 15);
  
  let currentY = insightsY + 25;
  result.insights.forEach((insight, index) => {
    doc.setFontSize(11);
    const color = insight.type === 'critical' ? [220, 38, 38] : insight.type === 'warning' ? [217, 119, 6] : [22, 163, 74];
    doc.setTextColor(color[0], color[1], color[2]);
    doc.text(`${index + 1}. ${insight.text}`, 14, currentY);
    currentY += 8;
  });

  // Recommendations
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Recommendations', 14, currentY + 10);
  
  currentY += 20;
  result.recommendations.forEach((rec, index) => {
    doc.setFontSize(11);
    doc.text(`• ${rec}`, 14, currentY);
    currentY += 8;
  });

  doc.save(`RupeeGuru_HealthScore_${((profile as any).name || 'User').replace(/\s+/g, '_')}.pdf`);
};

/**
 * Export FIRE Plan to CSV
 */
export const exportFirePlanCSV = (profile: FinancialProfile, result: FirePlanResult) => {
  const headers = ['Metric', 'Value'];
  const data = [
    ['User Name', (profile as any).name || 'User'],
    ['Current Age', profile.age],
    ['Target Retirement Age', result.retirementAge],
    ['Years to Retire', result.yearsToRetire],
    ['Target Corpus', `₹${result.targetCorpus}`],
    ['Monthly SIP Required', `₹${result.monthlySipRequired}`],
    ['Inflation Assumed', `${result.inflationAssumed}%`],
    ['Returns Assumed', `${result.returnsAssumed}%`],
    ['Equity Allocation', `${result.assetAllocation.equity}%`],
    ['Debt Allocation', `${result.assetAllocation.debt}%`],
    ['Gold Allocation', `${result.assetAllocation.gold}%`],
    ['Cash Allocation', `${result.assetAllocation.cash}%`],
  ];

  const csvContent = [
    headers.join(','),
    ...data.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `RupeeGuru_FIRE_Plan_${((profile as any).name || 'User').replace(/\s+/g, '_')}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Export FIRE Plan to PDF
 */
export const exportFirePlanPDF = (profile: FinancialProfile, result: FirePlanResult) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(22);
  doc.setTextColor(249, 115, 22); // Orange-500
  doc.text('Rupee Guru - FIRE Plan', 14, 20);
  
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
  
  // Summary
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Retirement Summary', 14, 45);
  
  doc.autoTable({
    startY: 50,
    head: [['Metric', 'Value']],
    body: [
      ['Target Retirement Age', result.retirementAge],
      ['Years to Retire', result.yearsToRetire],
      ['Target Corpus', `INR ${result.targetCorpus.toLocaleString('en-IN')}`],
      ['Monthly SIP Required', `INR ${result.monthlySipRequired.toLocaleString('en-IN')}`],
      ['Assumed Inflation', `${result.inflationAssumed}%`],
      ['Assumed Returns', `${result.returnsAssumed}%`],
    ],
    theme: 'striped',
    headStyles: { fillColor: [249, 115, 22] },
  });
  
  // Asset Allocation
  const finalY = (doc as any).lastAutoTable.finalY || 100;
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Asset Allocation', 14, finalY + 15);
  
  doc.autoTable({
    startY: finalY + 20,
    head: [['Asset Class', 'Percentage']],
    body: [
      ['Equity', `${result.assetAllocation.equity}%`],
      ['Debt', `${result.assetAllocation.debt}%`],
      ['Gold', `${result.assetAllocation.gold}%`],
      ['Cash', `${result.assetAllocation.cash}%`],
    ],
    theme: 'grid',
    headStyles: { fillColor: [249, 115, 22] },
  });

  // Strategy
  const strategyY = (doc as any).lastAutoTable.finalY || 180;
  doc.setFontSize(16);
  doc.text('Strategic Roadmap', 14, strategyY + 15);
  
  doc.setFontSize(10);
  const splitStrategy = doc.splitTextToSize(result.strategy, 180);
  doc.text(splitStrategy, 14, strategyY + 25);

  // Milestones
  const milestonesY = strategyY + 25 + (splitStrategy.length * 5);
  if (milestonesY < 270) {
    doc.setFontSize(16);
    doc.text('Key Milestones', 14, milestonesY + 10);
    
    doc.autoTable({
      startY: milestonesY + 15,
      head: [['Age', 'Target Corpus']],
      body: result.milestones.map(m => [m.age, `INR ${m.corpus.toLocaleString('en-IN')}`]),
      theme: 'striped',
      headStyles: { fillColor: [249, 115, 22] },
    });
  }

  doc.save(`RupeeGuru_FIRE_Plan_${((profile as any).name || 'User').replace(/\s+/g, '_')}.pdf`);
};
