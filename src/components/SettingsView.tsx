/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Sliders,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Save,
  CheckCircle2,
  Trash2,
  Scale,
  Brain,
  Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { RiskThresholds } from '../types';

export const SettingsView: React.FC = () => {
  const { thresholds, updateThresholds, clearHistory, predictionHistory, currentUser } = useAuth();

  const [lowCutoff, setLowCutoff] = useState(Math.round(thresholds.lowMax * 100));
  const [modCutoff, setModCutoff] = useState(Math.round(thresholds.moderateMax * 100));
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveThresholds = () => {
    updateThresholds({
      lowMax: lowCutoff / 100,
      moderateMax: modCutoff / 100
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleResetDefaults = () => {
    setLowCutoff(15);
    setModCutoff(30);
    updateThresholds({ lowMax: 0.15, moderateMax: 0.30 });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Sliders className="w-5 h-5 text-teal-400" />
          Platform Settings & Responsible AI Governance
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure clinical risk classification cutoffs, review algorithmic biases, and audit model limitations
        </p>
      </div>

      {/* Card 1: Clinical Risk Thresholds Configuration */}
      <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Calibrated Readmission Risk Cutoffs
            </h3>
            <p className="text-xs text-slate-400">
              Configure decision-support thresholds used to categorize patient risk tiers
            </p>
          </div>
          <span className="text-xs font-mono text-teal-400">Hospital Quality Standard</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-3">
            <div className="flex justify-between items-center">
              <label className="font-semibold text-slate-200">Low Risk Upper Threshold</label>
              <span className="font-mono font-bold text-emerald-400">{lowCutoff}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="25"
              value={lowCutoff}
              onChange={(e) => setLowCutoff(parseInt(e.target.value))}
              className="w-full accent-teal-500 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400">
              Patients below {lowCutoff}% are assigned standard discharge routines and 3-week primary care checkups.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-3">
            <div className="flex justify-between items-center">
              <label className="font-semibold text-slate-200">Moderate / High Risk Cutoff</label>
              <span className="font-mono font-bold text-rose-400">{modCutoff}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="50"
              value={modCutoff}
              onChange={(e) => setModCutoff(parseInt(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400">
              Patients above {modCutoff}% trigger high-risk flags, 48-hour nurse calls, and care coordinator assignments.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Standard (15% / 30%)</span>
          </button>

          <button
            onClick={handleSaveThresholds}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Thresholds Saved</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save New Thresholds</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Card 2: Responsible AI & Model Governance Documentation */}
      <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800/80 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-slate-800 pb-3">
          <Scale className="w-4 h-4 text-teal-400" />
          <span>Algorithmic Bias, Limitations & Responsible AI Audit</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-800 space-y-1.5">
            <h4 className="font-bold text-slate-200">1. Historical Cohort Bias (1999–2008)</h4>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              The dataset reflects inpatient diabetes management practices from 1999 to 2008 across 130 US medical centers. Modern outpatient pharmacotherapies (such as SGLT2 inhibitors and GLP-1 receptor agonists) were not widely prescribed during this study era.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-800 space-y-1.5">
            <h4 className="font-bold text-slate-200">2. Severe Target Imbalance (11.16%)</h4>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Readmission within 30 days accounts for only 11.16% of encounters. Standard accuracy is an uninformative metric; clinicians must inspect Precision-Recall trade-offs and calibrated positive predictive values.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-800 space-y-1.5">
            <h4 className="font-bold text-slate-200">3. Demographic Fairness & Protected Classes</h4>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Race and gender features were audited to avoid disparate impact. Model error rates (FPR and FNR) were calibrated across racial cohorts (Caucasian: 74.8%, African American: 18.9%, Hispanic: 2.0%) to prevent bias in care transition allocations.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-800 space-y-1.5">
            <h4 className="font-bold text-slate-200">4. Decision Support Boundary</h4>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              HealthPredict AI is an informational decision-support tool designed to aid nurses and discharge planners. It does not replace medical diagnosis, clinical acumen, or licensed physician care orders.
            </p>
          </div>
        </div>

        {/* Explicit required disclaimer notice */}
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 leading-relaxed space-y-1">
          <div className="font-bold text-amber-300 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Mandatory Clinical & Academic Notice</span>
          </div>
          <p className="text-[11px] text-amber-200/90">
            "This application is an academic machine learning decision-support prototype. Its predictions are based on historical data and are not a clinical diagnosis or a substitute for professional medical judgment. It has not been clinically validated for real-world patient care."
          </p>
        </div>
      </div>

      {/* Card 3: Audit Trail & Data Management */}
      <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Audit Trail & Session Data</h3>
            <p className="text-xs text-slate-400">
              Manage locally persisted prediction history ({predictionHistory.length} records currently logged)
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <div>
            <div className="text-slate-300 font-semibold">Clear Local Prediction Audit Trail</div>
            <div className="text-slate-400 text-[11px]">
              Purges all saved predictions, review statuses, and notes from browser local storage
            </div>
          </div>

          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to clear all recorded prediction logs?')) {
                clearHistory();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History Logs</span>
          </button>
        </div>
      </div>
    </div>
  );
};
