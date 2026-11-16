/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  Calendar,
  Building,
  ShieldAlert,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { PatientEncounter } from '../types';
import { UCI_DATASET_SUMMARY } from '../data/uciDataset';
import { useAuth } from '../context/AuthContext';

export const ReportsView: React.FC<{ patients: PatientEncounter[] }> = ({ patients }) => {
  const { currentUser } = useAuth();
  const [reportType, setReportType] = useState<'executive' | 'high_risk' | 'clinical' | 'model'>('executive');
  const [reportDate, setReportDate] = useState('2026-03-17');

  const highRiskPatients = patients.filter((p) => p.riskCategory === 'High');

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = [
      'Patient ID',
      'Encounter ID',
      'Patient Name',
      'Age Bracket',
      'Gender',
      'Specialty',
      '30-Day Readmission Risk (%)',
      'Risk Category',
      'Priority Score',
      'Primary Diagnosis',
      'Discharge Plan',
      'Suggested Follow-Up Action'
    ];

    const rows = (reportType === 'high_risk' ? highRiskPatients : patients).map((p) => [
      p.patientId,
      p.encounterId,
      p.patientName,
      p.ageGroup,
      p.gender,
      p.medicalSpecialty,
      (p.readmission30dProb * 100).toFixed(1) + '%',
      p.riskCategory,
      p.priorityScore,
      `"${p.primaryDiagnosis}"`,
      `"${p.dischargeDisposition}"`,
      `"${p.suggestedActions[0] || 'Nurse Telehealth Follow-Up'}"`
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `HealthPredict_${reportType}_report_${reportDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Controls (Hidden when printing) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-400" />
            Clinical Reports & Executive Analytics
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Generate printable executive summaries, high-risk cohort audits, and model governance reports
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-teal-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Report Type Selector (Hidden when printing) */}
      <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800/80 shadow-sm flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Report Template:</span>
          {(
            [
              { id: 'executive', label: 'Executive Readmission Summary' },
              { id: 'high_risk', label: 'High-Risk Priority Cohort' },
              { id: 'clinical', label: 'Clinical & Medication Impact' },
              { id: 'model', label: 'ML Performance & Governance' }
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setReportType(t.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                reportType === t.id
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Reporting Period:</span>
          <input
            type="date"
            value={reportDate}
            onChange={(e) => setReportDate(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 text-xs focus:outline-none"
          />
        </div>
      </div>

      {/* THE PRINTABLE REPORT CONTAINER (Styled for on-screen & print media) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl print:bg-white print:text-black print:border-none print:p-0 print:shadow-none space-y-6">
        {/* Hospital Letterhead Header */}
        <div className="border-b border-slate-800 print:border-neutral-300 pb-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Building className="w-6 h-6 text-teal-400 print:text-teal-700" />
              <h1 className="text-xl font-black tracking-tight text-white print:text-slate-900">
                METRO HEALTH SYSTEM · CLINICAL QUALITY DIVISION
              </h1>
            </div>
            <div className="text-xs text-slate-400 print:text-slate-600 mt-1 font-medium">
              HealthPredict AI Inpatient Readmission Surveillance Report · Ward 4B Cardiology & Acute Medicine
            </div>
          </div>

          <div className="text-right text-xs text-slate-400 print:text-slate-600 font-mono">
            <div>Date Generated: {reportDate}</div>
            <div>Prepared By: {currentUser.name} ({currentUser.roleTitle})</div>
            <div>Model Version: XGBoost v2.4-tuned</div>
          </div>
        </div>

        {/* Executive Highlights Section */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-teal-400 print:text-teal-700 border-b border-slate-800 print:border-neutral-200 pb-1">
            {reportType === 'executive'
              ? 'Executive Hospital Readmission Highlights'
              : reportType === 'high_risk'
              ? 'High-Risk Priority Patient Cohort Audit'
              : reportType === 'clinical'
              ? 'Clinical Comorbidity & Polypharmacy Assessment'
              : 'Machine Learning Model Performance & Calibration Audit'}
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-3.5 rounded-xl bg-slate-800/60 print:bg-slate-100 border border-slate-700/60 print:border-slate-300">
              <div className="text-slate-400 print:text-slate-600 text-[11px] font-sans">Active Inpatient Cohort</div>
              <div className="text-xl font-bold text-white print:text-slate-900 mt-0.5">1,284</div>
              <div className="text-[10px] text-slate-400 print:text-slate-500 font-sans mt-0.5">Monitored Ward Patients</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/60 print:bg-slate-100 border border-slate-700/60 print:border-slate-300">
              <div className="text-slate-400 print:text-slate-600 text-[11px] font-sans">High-Risk Patients (30d)</div>
              <div className="text-xl font-bold text-rose-400 print:text-rose-700 mt-0.5">{highRiskPatients.length}</div>
              <div className="text-[10px] text-rose-400 print:text-rose-600 font-sans mt-0.5">Priority Care Flag</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/60 print:bg-slate-100 border border-slate-700/60 print:border-slate-300">
              <div className="text-slate-400 print:text-slate-600 text-[11px] font-sans">Empirical Readmission Rate</div>
              <div className="text-xl font-bold text-teal-400 print:text-teal-700 mt-0.5">11.16%</div>
              <div className="text-[10px] text-slate-400 print:text-slate-500 font-sans mt-0.5">UCI 130-US Baseline</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/60 print:bg-slate-100 border border-slate-700/60 print:border-slate-300">
              <div className="text-slate-400 print:text-slate-600 text-[11px] font-sans">Model Discrimination (ROC)</div>
              <div className="text-xl font-bold text-white print:text-slate-900 mt-0.5">0.724 AUC</div>
              <div className="text-[10px] text-emerald-400 print:text-emerald-700 font-sans mt-0.5">Calibrated PR-AUC: 0.286</div>
            </div>
          </div>
        </div>

        {/* Report Content Table */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-300 print:text-slate-800 uppercase tracking-wider">
            Patient Encounter Risk Breakdown & Care Transition Protocols
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-800 print:border-slate-300">
              <thead className="bg-slate-800/80 print:bg-slate-200 text-slate-300 print:text-slate-800 font-semibold text-[11px]">
                <tr>
                  <th className="py-2.5 px-3">PATIENT ID</th>
                  <th className="py-2.5 px-3">NAME & AGE</th>
                  <th className="py-2.5 px-3">PRIMARY DIAGNOSIS</th>
                  <th className="py-2.5 px-3">DISCHARGE PLAN</th>
                  <th className="py-2.5 px-3 text-right">30D RISK</th>
                  <th className="py-2.5 px-3">PRIORITY ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 print:divide-slate-200 font-mono text-[11px]">
                {(reportType === 'high_risk' ? highRiskPatients : patients.slice(0, 8)).map((p) => (
                  <tr key={p.id} className="text-slate-200 print:text-slate-800">
                    <td className="py-2 px-3 font-bold text-teal-400 print:text-teal-700">{p.patientId}</td>
                    <td className="py-2 px-3 font-sans">
                      <div className="font-semibold">{p.patientName}</div>
                      <div className="text-[10px] text-slate-400 print:text-slate-500">{p.ageGroup} · {p.gender}</div>
                    </td>
                    <td className="py-2 px-3 font-sans truncate max-w-[160px]">{p.primaryDiagnosis}</td>
                    <td className="py-2 px-3 font-sans truncate max-w-[150px]">{p.dischargeDisposition}</td>
                    <td className="py-2 px-3 text-right font-bold text-rose-400 print:text-rose-700">
                      {(p.readmission30dProb * 100).toFixed(1)}%
                    </td>
                    <td className="py-2 px-3 font-sans text-slate-300 print:text-slate-700 truncate max-w-[200px]">
                      {p.suggestedActions[0] || 'Nurse Follow-Up'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Formal Clinical & Academic Disclaimer */}
        <div className="p-4 rounded-xl bg-slate-800/40 print:bg-slate-100 border border-slate-700/60 print:border-slate-300 text-xs space-y-1.5 text-slate-400 print:text-slate-700 leading-relaxed">
          <div className="font-bold text-slate-200 print:text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400 print:text-amber-600" />
            <span>Responsible AI & Decision-Support Notice</span>
          </div>
          <p>
            This application is an academic machine learning decision-support prototype. Its predictions are based on historical data (UCI Diabetes 130-US Hospitals, 1999–2008) and are not a clinical diagnosis or a substitute for professional medical judgment. It has not been clinically validated for real-world patient care.
          </p>
          <div className="text-[10px] text-slate-400 print:text-slate-600 pt-1 font-mono">
            Document ID: HP-RPT-{Date.now().toString(36).toUpperCase()} · Confidential Health Analytics Document
          </div>
        </div>
      </div>
    </div>
  );
};
