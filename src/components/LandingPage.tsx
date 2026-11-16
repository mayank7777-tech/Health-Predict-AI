/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Activity,
  ArrowRight,
  ShieldCheck,
  Brain,
  Database,
  BarChart3,
  HeartPulse,
  Layers,
  FileText,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { UCI_DATASET_SUMMARY } from '../data/uciDataset';

interface LandingPageProps {
  onEnterApp: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500/20 selection:text-teal-300">
      {/* 3-Zone Top Bar Contract */}
      <header className="h-18 px-6 lg:px-12 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-lg shadow-teal-900/30">
            <Activity className="w-5 h-5" />
          </div>
          <span className="text-base font-bold text-white tracking-tight">
            HealthPredict <span className="text-xs px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 font-semibold uppercase">AI</span>
          </span>
        </div>

        {/* Zone 2: Single-line Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-400">
          <a href="#overview" className="hover:text-white transition-colors whitespace-nowrap">Platform Overview</a>
          <a href="#objective" className="hover:text-white transition-colors whitespace-nowrap">Clinical Objective</a>
          <a href="#pipeline" className="hover:text-white transition-colors whitespace-nowrap">ML Pipeline</a>
          <a href="#explainability" className="hover:text-white transition-colors whitespace-nowrap">Explainable AI</a>
          <a href="#governance" className="hover:text-white transition-colors whitespace-nowrap">Responsible AI</a>
        </nav>

        {/* Zone 3: 1 Primary CTA */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onEnterApp}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer whitespace-nowrap"
          >
            <span>Launch Clinical Portal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section id="overview" className="pt-16 pb-20 px-6 lg:px-12 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-medium text-teal-400 font-mono">
              <span>UCI Diabetes 130-US Hospitals Dataset (1999–2008)</span>
              <span>·</span>
              <span>101,766 Encounters</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight text-balance">
              Predicting 30-Day Hospital Readmissions with Explainable Clinical ML
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              HealthPredict AI is an enterprise healthcare analytics platform designed to identify high-risk diabetic patient encounters post-discharge, isolate underlying clinical driving factors via TreeSHAP explainability, and prioritize transitional care interventions.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onEnterApp}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold shadow-lg shadow-teal-900/30 transition-all cursor-pointer"
              >
                <span>Open Doctor & Analyst Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#pipeline"
                className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-sm font-medium border border-slate-800 transition-colors cursor-pointer"
              >
                Inspect ML Architecture
              </a>
            </div>

            {/* Quick stats strip */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-6 font-mono">
              <div>
                <div className="text-2xl font-black text-white tabular-nums">101,766</div>
                <div className="text-xs text-slate-400 font-sans mt-0.5">Historical Encounters</div>
              </div>
              <div>
                <div className="text-2xl font-black text-teal-400 tabular-nums">0.724</div>
                <div className="text-xs text-slate-400 font-sans mt-0.5">XGBoost ROC-AUC</div>
              </div>
              <div>
                <div className="text-2xl font-black text-emerald-400 tabular-nums">11.16%</div>
                <div className="text-xs text-slate-400 font-sans mt-0.5">30-Day Readmission Baseline</div>
              </div>
            </div>
          </div>

          {/* Right Visual Card - Sleek Live Card Preview */}
          <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl p-6 border border-slate-800/80 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Live Clinical Inference
                </span>
              </div>
              <span className="text-[11px] font-mono text-teal-400">#P-00412 · Ward 4B</span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-xs text-slate-400">Patient Encounter Profile</div>
                <div className="text-base font-bold text-white mt-0.5">Marcus Vance, 74y Male</div>
                <div className="text-xs text-slate-300">Dx: Atrial Fibrillation & Type 2 Diabetes</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-slate-300">Predicted 30-Day Risk:</span>
                  <span className="text-xl font-bold font-mono text-rose-400 tabular-nums">84.0%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full w-[84%]" />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>Category: High Risk</span>
                  <span>Priority Rank: #1</span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="text-[11px] text-slate-400 font-semibold uppercase">SHAP Attribution:</div>
                <div className="flex items-center justify-between text-[11px]">
                  <span>3 Prior Inpatient Admissions</span>
                  <span className="font-mono text-rose-400 font-bold">+42.0%</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span>Discharge to Skilled Nursing (SNF)</span>
                  <span className="font-mono text-rose-400 font-bold">+7.8%</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span>HbA1c &gt;8% with Insulin Titration</span>
                  <span className="font-mono text-rose-400 font-bold">+4.8%</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-teal-500/10 border border-teal-500/20 text-xs text-teal-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Action: 48-Hour Nurse Telehealth Outreach</span>
              </div>
            </div>

            <button
              onClick={onEnterApp}
              className="w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Explore Interactive Dashboard</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 2: PRIMARY CLINICAL OBJECTIVE & DATASET SPEC */}
      <section id="objective" className="py-16 px-6 lg:px-12 bg-slate-900/40 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto space-y-10">
          <div>
            <span className="text-xs font-bold text-teal-400 uppercase tracking-wider font-mono">
              Research Objective
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              The UCI 130-US Hospitals Diabetes Benchmark
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl mt-2 leading-relaxed">
              Hospital readmissions within 30 days of discharge represent a major quality and financial indicator under the Hospital Readmissions Reduction Program (HRRP). HealthPredict AI rigorously distinguishes 30-day readmissions from late readmissions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            {/* Box 1 */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 font-bold text-base">
                &lt;30
              </div>
              <h3 className="text-sm font-bold text-white">Primary Objective: Readmitted &lt;30 Days</h3>
              <p className="text-slate-400 leading-relaxed">
                Represents 11,357 encounters (11.16%). Indicates unplanned early returns, acute post-discharge decompensation, or inadequate transitional care.
              </p>
              <div className="text-rose-400 font-mono font-bold">11.16% of Cohort</div>
            </div>

            {/* Box 2 */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-base">
                &gt;30
              </div>
              <h3 className="text-sm font-bold text-white">Secondary Target: Readmitted &gt;30 Days</h3>
              <p className="text-slate-400 leading-relaxed">
                Represents 35,545 encounters (34.93%). Reflects long-term chronic disease burden rather than acute discharge failure. Never falsely lumped with &lt;30.
              </p>
              <div className="text-amber-400 font-mono font-bold">34.93% of Cohort</div>
            </div>

            {/* Box 3 */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-base">
                NO
              </div>
              <h3 className="text-sm font-bold text-white">Not Readmitted</h3>
              <p className="text-slate-400 leading-relaxed">
                Represents 54,864 encounters (53.91%). Patient had no recorded readmission encounter in the database during the observation window.
              </p>
              <div className="text-emerald-400 font-mono font-bold">53.91% of Cohort</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: THE 5-STAGE ML PIPELINE */}
      <section id="pipeline" className="py-16 px-6 lg:px-12 max-w-7xl mx-auto w-full space-y-10">
        <div>
          <span className="text-xs font-bold text-teal-400 uppercase tracking-wider font-mono">
            Engineering Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Reproducible End-to-End ML Pipeline
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="text-teal-400 font-mono font-bold">01. Ingestion</div>
            <h4 className="font-bold text-white text-sm">UCI Acquisition</h4>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              101,766 hospital encounters from 130 hospitals. Standardized clinical ICD-9 codes and demographic attributes.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="text-teal-400 font-mono font-bold">02. Splitting</div>
            <h4 className="font-bold text-white text-sm">Grouped Patient K-Fold</h4>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Stratified grouping by <code>patient_nbr</code>. Zero data leakage: repeat encounters from the same patient never appear in both train and test.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="text-teal-400 font-mono font-bold">03. Engineering</div>
            <h4 className="font-bold text-white text-sm">Clinical Feature Extraction</h4>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Prior inpatient admissions, emergency department frequency, comorbidity count, polypharmacy count, and insulin titration markers.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="text-teal-400 font-mono font-bold">04. Modeling</div>
            <h4 className="font-bold text-white text-sm">XGBoost & Ensembles</h4>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Trained 5 algorithms: XGBoost, Random Forest, HistGradientBoosting, Logistic Regression, and Decision Tree with <code>scale_pos_weight=4.2</code>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="text-teal-400 font-mono font-bold">05. Explainability</div>
            <h4 className="font-bold text-white text-sm">TreeSHAP Attribution</h4>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Exact feature contributions calculated for every prediction, producing actionable clinical explanations and priority scores.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 4: RESPONSIBLE AI NOTICE FOOTER */}
      <footer id="governance" className="mt-auto border-t border-slate-800 bg-slate-950 py-10 px-6 lg:px-12 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-teal-400" />
              <span className="font-bold text-white">HealthPredict AI Platform</span>
              <span>·</span>
              <span>Hospital Readmission Decision Support System</span>
            </div>

            <button
              onClick={onEnterApp}
              className="text-teal-400 hover:text-teal-300 font-semibold cursor-pointer"
            >
              Launch Platform Portal →
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80 text-[11px] text-slate-400 leading-relaxed">
            <strong className="text-slate-300">Responsible AI Notice:</strong> "This application is an academic machine learning decision-support prototype. Its predictions are based on historical data and are not a clinical diagnosis or a substitute for professional medical judgment. It has not been clinically validated for real-world patient care."
          </div>

          <div className="text-center text-[11px] text-slate-400 pt-2">
            HealthPredict AI © 2026 · Based on the UCI Machine Learning Repository Diabetes 130-US Hospitals Dataset (1999–2008)
          </div>
        </div>
      </footer>
    </div>
  );
};
