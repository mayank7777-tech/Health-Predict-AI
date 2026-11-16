/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Activity,
  Heart,
  Thermometer,
  Pill,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Brain,
  TrendingUp,
  TrendingDown,
  Calendar,
  User,
  ShieldAlert,
  FileCheck
} from 'lucide-react';
import { PatientEncounter } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ReferenceLine } from 'recharts';
import { useAuth } from '../context/AuthContext';

interface PatientDetailModalProps {
  patient: PatientEncounter | null;
  onClose: () => void;
  onLogHistory?: (patient: PatientEncounter) => void;
}

export const PatientDetailModal: React.FC<PatientDetailModalProps> = ({
  patient,
  onClose,
  onLogHistory
}) => {
  const { currentUser, addPredictionHistory } = useAuth();
  const [reviewNote, setReviewNote] = useState('');
  const [reviewSaved, setReviewSaved] = useState(false);

  if (!patient) return null;

  const isHigh = patient.riskCategory === 'High';
  const isMod = patient.riskCategory === 'Moderate';

  const waterfallData = patient.shapValues.slice(0, 6).map((s) => ({
    name: s.displayName.length > 20 ? s.displayName.substring(0, 18) + '...' : s.displayName,
    impact: Number((s.value * 100).toFixed(1)),
    raw: s.displayName
  }));

  const handleRecordReview = () => {
    addPredictionHistory({
      patientId: patient.patientId,
      encounterId: patient.encounterId,
      patientName: patient.patientName,
      ageGroup: patient.ageGroup,
      gender: patient.gender,
      primaryDiagnosis: patient.primaryDiagnosis,
      predictedClass: patient.predictedReadmission,
      prob30d: patient.readmission30dProb,
      probOver30d: patient.readmissionOver30dProb,
      probNo: patient.noReadmissionProb,
      riskCategory: patient.riskCategory,
      riskScore: patient.riskScore,
      modelVersion: 'XGBoost v2.4-tuned',
      reviewStatus: 'Reviewed & Actioned',
      clinicalNotes: reviewNote || 'Clinical discharge review completed. Priority post-acute coordination verified.',
      topFactors: patient.shapValues.filter((s) => s.value > 0).slice(0, 3).map((s) => `${s.displayName} (+${(s.value * 100).toFixed(1)}%)`)
    });
    setReviewSaved(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-start justify-between bg-slate-900/60 sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-teal-400 font-bold text-lg">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-tight">{patient.patientName}</h3>
                <span
                  className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider border ${
                    isHigh
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      : isMod
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  }`}
                >
                  {patient.riskCategory} Risk ({patient.riskScore}%)
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                  Priority Rank #{patient.priorityRank || 1}
                </span>
              </div>
              <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-3">
                <span className="font-mono">{patient.patientId}</span>
                <span>·</span>
                <span className="font-mono">{patient.encounterId}</span>
                <span>·</span>
                <span>{patient.ward}</span>
                <span>·</span>
                <span>Attending: {patient.attendingPhysician}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Clinical Encounter Highlights Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-800">
              <div className="text-[11px] text-slate-400">Primary Diagnosis</div>
              <div className="text-sm font-semibold text-white mt-0.5 truncate">{patient.primaryDiagnosis}</div>
              <div className="text-[10px] font-mono text-slate-400">ICD-9: {patient.icd9Code}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-800">
              <div className="text-[11px] text-slate-400">Length of Stay</div>
              <div className="text-sm font-semibold text-white mt-0.5 font-mono tabular-nums">
                {patient.timeInHospital} Days
              </div>
              <div className="text-[10px] text-slate-400">Admit: {patient.admissionDate}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-800">
              <div className="text-[11px] text-slate-400">Hospital Utilization (12m)</div>
              <div className="text-sm font-semibold text-amber-400 mt-0.5 font-mono tabular-nums">
                {patient.numberInpatient} Inpatient / {patient.numberEmergency} ER
              </div>
              <div className="text-[10px] text-slate-400">{patient.numberOutpatient} Outpatient Clinic</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-800">
              <div className="text-[11px] text-slate-400">Discharge Plan</div>
              <div className="text-sm font-semibold text-slate-200 mt-0.5 truncate" title={patient.dischargeDisposition}>
                {patient.dischargeDisposition}
              </div>
              <div className="text-[10px] text-teal-400/90">{patient.admissionType} presentation</div>
            </div>
          </div>

          {/* Clinical Vitals & Lab Strip */}
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 space-y-3">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>Current Monitored Vitals & Diabetes Panel</span>
              <span className="text-[11px] font-normal text-slate-400 font-mono">Last updated 15m ago</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-800/80">
                <span className="text-slate-400 block text-[11px]">Heart Rate</span>
                <span className="text-sm font-mono font-bold text-emerald-400 tabular-nums">
                  {patient.vitals.heartRate} bpm
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-800/80">
                <span className="text-slate-400 block text-[11px]">Blood Pressure</span>
                <span className="text-sm font-mono font-bold text-purple-400 tabular-nums">
                  {patient.vitals.bpSystolic} / {patient.vitals.bpDiastolic}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-800/80">
                <span className="text-slate-400 block text-[11px]">SpO2 Saturation</span>
                <span className="text-sm font-mono font-bold text-teal-400 tabular-nums">
                  {patient.vitals.spO2}%
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-800/80">
                <span className="text-slate-400 block text-[11px]">Serum Glucose</span>
                <span className="text-sm font-mono font-bold text-orange-400 tabular-nums">
                  {patient.vitals.bloodGlucose} mg/dL
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-800/80">
                <span className="text-slate-400 block text-[11px]">HbA1c & Insulin</span>
                <span className="text-sm font-mono font-bold text-white tabular-nums">
                  {patient.a1cResult} · {patient.insulin}
                </span>
              </div>
            </div>
          </div>

          {/* Outcome Comparison & SHAP Waterfall Section */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left: Probabilities & Ground Truth (5 cols) */}
            <div className="md:col-span-5 space-y-4">
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-white uppercase tracking-wider">
                  Readmission Probabilities
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>30-Day Readmission (&lt;30)</span>
                      <span className="font-mono font-bold text-rose-400">
                        {(patient.readmission30dProb * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-rose-500 rounded-full"
                        style={{ width: `${patient.readmission30dProb * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Late Readmission (&gt;30)</span>
                      <span className="font-mono font-bold text-amber-400">
                        {(patient.readmissionOver30dProb * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${patient.readmissionOver30dProb * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>No Readmission (NO)</span>
                      <span className="font-mono font-bold text-emerald-400">
                        {(patient.noReadmissionProb * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${patient.noReadmissionProb * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Actual Dataset Target:</span>
                  <span className="font-mono font-bold text-white px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                    {patient.actualReadmission === '<30'
                      ? 'Readmitted <30 Days'
                      : patient.actualReadmission === '>30'
                      ? 'Readmitted >30 Days'
                      : 'Not Readmitted'}
                  </span>
                </div>
              </div>

              {/* Clinical Care Protocols */}
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4" />
                  <span>Recommended Post-Discharge Plan</span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-300">
                  {patient.suggestedActions.map((act, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: SHAP Feature Attribution (7 cols) */}
            <div className="md:col-span-7 p-4 rounded-xl bg-slate-800/60 border border-slate-800 space-y-3">
              <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between">
                <span>Individual TreeSHAP Attribution Waterfall</span>
                <span className="text-[11px] text-slate-400 font-mono">E[f(x)] = 11.2%</span>
              </div>

              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={waterfallData}
                    margin={{ top: 5, right: 15, left: 10, bottom: 5 }}
                  >
                    <XAxis
                      type="number"
                      tick={{ fill: '#94A3B8', fontSize: 10 }}
                      tickFormatter={(v) => `${v > 0 ? '+' : ''}${v}%`}
                    />
                    <YAxis
                      dataKey="name"
                      type="category"
                      width={110}
                      tick={{ fill: '#CBD5E1', fontSize: 10 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0F172A',
                        borderColor: '#334155',
                        borderRadius: '0.75rem',
                        color: '#F8FAFC',
                        fontSize: '11px'
                      }}
                      formatter={(val: any) => [`${val > 0 ? '+' : ''}${val}% Risk Shift`, 'SHAP Attribution']}
                    />
                    <ReferenceLine x={0} stroke="#475569" strokeDasharray="3 3" />
                    <Bar dataKey="impact" radius={[0, 4, 4, 0]}>
                      {waterfallData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.impact > 0 ? '#F43F5E' : '#10B981'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-700/60">
                <div className="text-xs font-semibold text-slate-300">Top Influential Factors:</div>
                <ul className="text-xs text-slate-400 space-y-1">
                  {patient.shapValues.slice(0, 3).map((s, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className={s.value > 0 ? 'text-rose-400' : 'text-emerald-400'}>
                        {s.value > 0 ? '▲' : '▼'}
                      </span>
                      <span>
                        <strong className="text-slate-200">{s.displayName}:</strong> {s.explanation}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Clinician Review & Audit Section */}
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 space-y-3">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>Authorized Clinician Action & Review Log</span>
              <span className="text-[11px] text-teal-400 font-mono">Logged as {currentUser.name}</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
                placeholder="Enter clinical review notes (e.g., 'Care plan confirmed; nurse outreach assigned')..."
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-teal-500"
              />
              <button
                onClick={handleRecordReview}
                disabled={reviewSaved}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                  reviewSaved
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-teal-600 hover:bg-teal-500 text-white'
                }`}
              >
                {reviewSaved ? 'Review Logged ✓' : 'Confirm & Log Review'}
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="text-[11px] text-slate-400">
            Decision support prototype · Model: XGBoost v2.4 (Grounded in UCI Diabetes 130-US Hospitals)
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors cursor-pointer"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
