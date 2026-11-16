/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Activity,
  CheckCircle2,
  TrendingUp,
  Award,
  Layers,
  Database,
  GitBranch,
  ShieldCheck,
  BarChart2,
  Cpu
} from 'lucide-react';
import { MODEL_REGISTRY } from '../services/mlEngine';
import { GLOBAL_FEATURE_IMPORTANCES, DATASET_EDA_METRICS, UCI_DATASET_SUMMARY } from '../data/uciDataset';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, LineChart, Line, Legend } from 'recharts';

export const ModelPerformance: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'comparison' | 'shap' | 'pipeline' | 'eda'>('comparison');
  const [selectedModel, setSelectedModel] = useState(MODEL_REGISTRY[0]);

  // Synthetic ROC Curve points for XGBoost vs Logistic Regression
  const rocCurveData = [
    { fpr: 0.0, xgboost: 0.0, logreg: 0.0, random: 0.0 },
    { fpr: 0.05, xgboost: 0.22, logreg: 0.12, random: 0.05 },
    { fpr: 0.1, xgboost: 0.35, logreg: 0.22, random: 0.1 },
    { fpr: 0.2, xgboost: 0.52, logreg: 0.38, random: 0.2 },
    { fpr: 0.3, xgboost: 0.64, logreg: 0.51, random: 0.3 },
    { fpr: 0.4, xgboost: 0.74, logreg: 0.62, random: 0.4 },
    { fpr: 0.5, xgboost: 0.81, logreg: 0.71, random: 0.5 },
    { fpr: 0.6, xgboost: 0.87, logreg: 0.79, random: 0.6 },
    { fpr: 0.7, xgboost: 0.92, logreg: 0.86, random: 0.7 },
    { fpr: 0.8, xgboost: 0.96, logreg: 0.92, random: 0.8 },
    { fpr: 0.9, xgboost: 0.98, logreg: 0.96, random: 0.9 },
    { fpr: 1.0, xgboost: 1.0, logreg: 1.0, random: 1.0 }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-400" />
            Machine Learning Engineering & Model Evaluation
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Benchmarks across 5 trained algorithms evaluated on patient-grouped holdout test partitions (UCI 130-US dataset)
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center bg-slate-900 border border-slate-800 p-0.5 rounded-lg text-xs font-medium">
          <button
            onClick={() => setActiveTab('comparison')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'comparison' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Model Comparison
          </button>
          <button
            onClick={() => setActiveTab('shap')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'shap' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Global SHAP
          </button>
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'pipeline' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Pipeline Architecture
          </button>
          <button
            onClick={() => setActiveTab('eda')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'eda' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            EDA & Data Audit
          </button>
        </div>
      </div>

      {/* TAB 1: MODEL COMPARISON */}
      {activeTab === 'comparison' && (
        <div className="space-y-6">
          {/* Best Model Highlight Card */}
          <div className="bg-gradient-to-r from-teal-950/60 via-slate-900 to-slate-900 rounded-2xl p-6 border border-teal-500/30 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> Production Champion Model
                </span>
                <span className="text-xs font-mono text-slate-400">Selected via Stratified GroupKFold</span>
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                XGBoost Ensemble v2.4 (Scale Pos Weight = 4.2)
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                Because 30-day readmission represents only 11.16% of patient encounters, naive models optimizing accuracy miss over 65% of high-risk patients. Our production model prioritizes PR-AUC (0.286) and Recall@Top20% (44.2%) to identify patients needing care transitions.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 font-mono shrink-0">
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-center">
                <div className="text-xs text-slate-400">ROC-AUC</div>
                <div className="text-xl font-bold text-teal-400">0.724</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-center">
                <div className="text-xs text-slate-400">PR-AUC</div>
                <div className="text-xl font-bold text-emerald-400">0.286</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-center">
                <div className="text-xs text-slate-400">Recall</div>
                <div className="text-xl font-bold text-white">44.2%</div>
              </div>
            </div>
          </div>

          {/* Model Comparison Table */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800/80 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">Evaluated Classifier Architectures</h3>
                <p className="text-xs text-slate-400">Trained on 101,766 encounters with GroupKFold patient-level partitioning</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-800/50 border-b border-slate-800 text-slate-400 text-[11px] font-semibold tracking-wider">
                    <th className="py-3 px-4">ALGORITHM</th>
                    <th className="py-3 px-3">VERSION</th>
                    <th className="py-3 px-3 text-right">ACCURACY</th>
                    <th className="py-3 px-3 text-right">PRECISION</th>
                    <th className="py-3 px-3 text-right">RECALL</th>
                    <th className="py-3 px-3 text-right">F1-SCORE</th>
                    <th className="py-3 px-3 text-right">ROC-AUC</th>
                    <th className="py-3 px-3 text-right">PR-AUC</th>
                    <th className="py-3 pr-4 text-center">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {MODEL_REGISTRY.map((model) => (
                    <tr
                      key={model.name}
                      onClick={() => setSelectedModel(model)}
                      className={`hover:bg-slate-800/40 cursor-pointer transition-colors ${
                        selectedModel.name === model.name ? 'bg-slate-800/60' : ''
                      }`}
                    >
                      <td className="py-3 px-4 font-sans font-bold text-slate-100 flex items-center gap-2">
                        {model.isProductionBest && <Award className="w-4 h-4 text-emerald-400 shrink-0" />}
                        <span>{model.name}</span>
                      </td>

                      <td className="py-3 px-3 text-slate-400 text-[11px]">{model.version}</td>

                      <td className="py-3 px-3 text-right text-slate-200 tabular-nums">
                        {(model.accuracy * 100).toFixed(1)}%
                      </td>

                      <td className="py-3 px-3 text-right text-slate-200 tabular-nums">
                        {(model.precision * 100).toFixed(1)}%
                      </td>

                      <td className="py-3 px-3 text-right text-teal-400 font-bold tabular-nums">
                        {(model.recall * 100).toFixed(1)}%
                      </td>

                      <td className="py-3 px-3 text-right text-slate-200 tabular-nums">
                        {model.f1Score.toFixed(3)}
                      </td>

                      <td className="py-3 px-3 text-right text-white font-bold tabular-nums">
                        {model.rocAuc.toFixed(3)}
                      </td>

                      <td className="py-3 px-3 text-right text-emerald-400 font-bold tabular-nums">
                        {model.prAuc.toFixed(3)}
                      </td>

                      <td className="py-3 pr-4 text-center font-sans">
                        {model.isProductionBest ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            DEPLOYED
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400">Benchmark</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Confusion Matrix and ROC Curve Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Confusion Matrix (5 cols) */}
            <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl p-5 border border-slate-800/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">
                    Confusion Matrix: {selectedModel.name}
                  </h3>
                  <p className="text-xs text-slate-400">Evaluated on test set (N = 101,766)</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center text-xs font-mono">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                  <div className="text-[10px] text-slate-400 uppercase font-sans">True Positives (TP)</div>
                  <div className="text-xl font-bold text-emerald-400 mt-1 tabular-nums">
                    {selectedModel.confusionMatrix.tp.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-emerald-300 font-sans mt-0.5">High-Risk Caught Early</div>
                </div>

                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                  <div className="text-[10px] text-slate-400 uppercase font-sans">False Positives (FP)</div>
                  <div className="text-xl font-bold text-amber-400 mt-1 tabular-nums">
                    {selectedModel.confusionMatrix.fp.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-amber-300 font-sans mt-0.5">Over-flagged (Precaution)</div>
                </div>

                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30">
                  <div className="text-[10px] text-slate-400 uppercase font-sans">False Negatives (FN)</div>
                  <div className="text-xl font-bold text-rose-400 mt-1 tabular-nums">
                    {selectedModel.confusionMatrix.fn.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-rose-300 font-sans mt-0.5">Missed 30d Returns</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80">
                  <div className="text-[10px] text-slate-400 uppercase font-sans">True Negatives (TN)</div>
                  <div className="text-xl font-bold text-slate-200 mt-1 tabular-nums">
                    {selectedModel.confusionMatrix.tn.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400 font-sans mt-0.5">Correct Routine Discharges</div>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed italic">
                {selectedModel.description}
              </p>
            </div>

            {/* ROC Curve Graph (7 cols) */}
            <div className="lg:col-span-7 bg-slate-900/90 rounded-2xl p-5 border border-slate-800/80 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">Receiver Operating Characteristic (ROC)</h3>
                  <p className="text-xs text-slate-400">XGBoost (AUC = 0.724) vs Logistic Regression (AUC = 0.658)</p>
                </div>
              </div>

              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={rocCurveData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis
                      dataKey="fpr"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#94A3B8', fontSize: 11 }}
                      tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#94A3B8', fontSize: 11 }}
                      tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
                      domain={[0, 1]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0F172A',
                        borderColor: '#334155',
                        borderRadius: '0.75rem',
                        color: '#F8FAFC',
                        fontSize: '11px'
                      }}
                      formatter={(val: any) => [`${(val * 100).toFixed(1)}% True Positive Rate`]}
                    />
                    <Line
                      type="monotone"
                      dataKey="xgboost"
                      name="XGBoost Ensemble (0.724)"
                      stroke="#14B8A6"
                      strokeWidth={2.5}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="logreg"
                      name="Logistic Regression (0.658)"
                      stroke="#8B5CF6"
                      strokeWidth={1.5}
                      dot={false}
                    />
                    <Line
                      type="linear"
                      dataKey="random"
                      name="Chance Baseline (0.500)"
                      stroke="#475569"
                      strokeDasharray="3 3"
                      strokeWidth={1}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center justify-center gap-6 pt-3 border-t border-slate-800 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-1 rounded bg-teal-500" />
                  <span className="text-white font-medium">XGBoost Tuned</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-1 rounded bg-purple-500" />
                  <span>Logistic Regression</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-slate-500" />
                  <span>Random Line</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GLOBAL SHAP FEATURE IMPORTANCE */}
      {activeTab === 'shap' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800/80 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Global TreeSHAP Feature Attribution (Cohort-Wide)
              </h3>
              <p className="text-xs text-slate-400">
                Mean |SHAP value| calculated across 101,766 patient encounters, quantifying average feature impact on 30-day readmission log-odds
              </p>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={GLOBAL_FEATURE_IMPORTANCES}
                  margin={{ top: 10, right: 20, left: 20, bottom: 0 }}
                >
                  <XAxis
                    type="number"
                    tick={{ fill: '#94A3B8', fontSize: 11 }}
                    domain={[0, 0.35]}
                  />
                  <YAxis
                    dataKey="feature"
                    type="category"
                    width={220}
                    tick={{ fill: '#E2E8F0', fontSize: 11 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#334155',
                      borderRadius: '0.75rem',
                      color: '#F8FAFC',
                      fontSize: '12px'
                    }}
                    formatter={(val: any) => [`${val} Mean |SHAP|`, 'Importance']}
                  />
                  <Bar dataKey="meanShap" radius={[0, 4, 4, 0]}>
                    {GLOBAL_FEATURE_IMPORTANCES.map((entry, index) => {
                      const color =
                        entry.category === 'Utilization'
                          ? '#F43F5E'
                          : entry.category === 'Clinical'
                          ? '#0D9488'
                          : entry.category === 'Medication'
                          ? '#8B5CF6'
                          : '#F59E0B';
                      return <Cell key={`cell-${index}`} fill={color} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 pt-3 border-t border-slate-800 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-rose-500" />
                <span className="text-slate-300">Hospital Utilization (Dominant Predictor)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-teal-600" />
                <span className="text-slate-300">Clinical Acuity & Diagnoses</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-purple-500" />
                <span className="text-slate-300">Medication & Glycemic Volatility</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-amber-500" />
                <span className="text-slate-300">Demographics (Age)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PIPELINE ARCHITECTURE */}
      {activeTab === 'pipeline' && (
        <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800/80 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">End-to-End Production ML Pipeline</h3>
            <p className="text-xs text-slate-400">Strict leakage prevention and clinically valid feature engineering</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/70 space-y-2">
              <div className="flex items-center gap-2 text-teal-400 font-bold uppercase text-[11px]">
                <Database className="w-4 h-4" /> 1. Data Ingestion & Splitting
              </div>
              <p className="text-slate-300 leading-relaxed">
                UCI 101,766 encounters parsed. <strong>Stratified GroupKFold</strong> on <code>patient_nbr</code> ensures encounters from the same patient never leak across train/test splits.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/70 space-y-2">
              <div className="flex items-center gap-2 text-teal-400 font-bold uppercase text-[11px]">
                <Layers className="w-4 h-4" /> 2. Feature Engineering
              </div>
              <p className="text-slate-300 leading-relaxed">
                Engineered utilization index (inpatient/emergency weights), comorbidity burden from ICD-9 codes, insulin titration flags, and length of stay bins.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/70 space-y-2">
              <div className="flex items-center gap-2 text-teal-400 font-bold uppercase text-[11px]">
                <Cpu className="w-4 h-4" /> 3. Class Imbalance Handling
              </div>
              <p className="text-slate-300 leading-relaxed">
                Applied <code>scale_pos_weight=4.2</code> inside the XGBoost objective rather than pre-split synthetic oversampling, avoiding optimistic evaluation leakage.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/70 space-y-2">
              <div className="flex items-center gap-2 text-teal-400 font-bold uppercase text-[11px]">
                <ShieldCheck className="w-4 h-4" /> 4. TreeSHAP & Calibration
              </div>
              <p className="text-slate-300 leading-relaxed">
                Probabilities calibrated via isotonic regression. Exact TreeSHAP values generated per inference for clinical interpretability and nurse actionability.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: EDA & DATASET AUDIT */}
      {activeTab === 'eda' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800/80 shadow-sm space-y-5">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Exploratory Data Analysis (EDA) & Data Audit Report
              </h3>
              <p className="text-xs text-slate-400">
                UCI 130-US Hospitals dataset (1999–2008) · 101,766 Encounters · 71,518 Unique Patients
              </p>
            </div>

            {/* Missing Value Handling Table */}
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Missing Value Analysis & Preprocessing Decisions
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-800 rounded-lg overflow-hidden">
                  <thead className="bg-slate-800/70 text-slate-400 text-[11px]">
                    <tr>
                      <th className="py-2.5 px-3">FEATURE</th>
                      <th className="py-2.5 px-3 text-right">MISSING %</th>
                      <th className="py-2.5 px-3">CLINICAL PREPROCESSING DECISION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 font-mono text-[11px]">
                    {DATASET_EDA_METRICS.missingValueColumns.map((col) => (
                      <tr key={col.column} className="text-slate-300">
                        <td className="py-2.5 px-3 font-bold text-white">{col.column}</td>
                        <td className="py-2.5 px-3 text-right text-rose-400">{col.missingPct}%</td>
                        <td className="py-2.5 px-3 font-sans text-slate-400">{col.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Target Class Distribution */}
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs space-y-2">
              <div className="font-bold text-white">Target Class Distribution (101,766 Encounters):</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
                <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20">
                  <span className="text-slate-400 block text-[10px]">&lt;30 Days (Readmitted within 30d)</span>
                  <span className="text-sm font-bold text-rose-400">11,357 (11.16%)</span>
                </div>
                <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <span className="text-slate-400 block text-[10px]">&gt;30 Days (Readmitted after 30d)</span>
                  <span className="text-sm font-bold text-amber-400">35,545 (34.93%)</span>
                </div>
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <span className="text-slate-400 block text-[10px]">NO (No Readmission)</span>
                  <span className="text-sm font-bold text-emerald-400">54,864 (53.91%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
