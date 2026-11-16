/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  HeartPulse,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  PhoneCall,
  Calendar,
  Pill,
  Hospital,
  ChevronRight,
  Filter,
  ShieldAlert
} from 'lucide-react';
import { PatientEncounter } from '../types';

interface HighRiskPrioritizationProps {
  patients: PatientEncounter[];
  onSelectPatient: (patient: PatientEncounter) => void;
  onNewAssessment: () => void;
}

export const HighRiskPrioritization: React.FC<HighRiskPrioritizationProps> = ({
  patients,
  onSelectPatient,
  onNewAssessment
}) => {
  const [filterTier, setFilterTier] = useState<'All' | 'Critical' | 'Monitoring'>('All');

  // Filter high & moderate risk patients sorted by Priority Score
  const highRiskQueue = patients
    .filter((p) => p.riskCategory === 'High' || p.priorityScore >= 60)
    .filter((p) => {
      if (filterTier === 'All') return true;
      return p.status === filterTier;
    })
    .sort((a, b) => b.priorityScore - a.priorityScore);

  return (
    <div className="space-y-6 pb-12">
      {/* Header and Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-rose-400" />
            High-Risk Patient Prioritization & Care Transitions
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Ranked by composite clinical priority score: 30-day readmission risk + chronic utilization + comorbidity index
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-900 border border-slate-800 p-0.5 rounded-lg text-xs">
            {(['All', 'Critical', 'Monitoring'] as const).map((tier) => (
              <button
                key={tier}
                onClick={() => setFilterTier(tier)}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                  filterTier === tier
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tier}
              </button>
            ))}
          </div>

          <button
            onClick={onNewAssessment}
            className="px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          >
            + Run Risk Prediction
          </button>
        </div>
      </div>

      {/* Prioritization Formula & Rules Banner */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>Care Transition Prioritization Algorithm</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
            Priority Score = (30d ML Risk × 0.60) + (Inpatient/ER Utilization × 0.25) + (Comorbidities × 0.15). Patients scoring $\ge 70$ are flagged for mandatory multi-disciplinary discharge transition protocols.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono shrink-0">
          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-center">
            <div className="text-lg font-bold text-rose-400">{highRiskQueue.length}</div>
            <div className="text-[10px] text-slate-400 uppercase">In Priority Queue</div>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
            <div className="text-lg font-bold text-amber-400">48 hrs</div>
            <div className="text-[10px] text-slate-400 uppercase">Target Outreach</div>
          </div>
        </div>
      </div>

      {/* High-Risk Patient Cards Grid */}
      <div className="space-y-4">
        {highRiskQueue.map((patient, index) => {
          const isCritical = patient.status === 'Critical';

          return (
            <div
              key={patient.id}
              onClick={() => onSelectPatient(patient)}
              className="bg-slate-900/90 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl p-5 shadow-sm transition-all duration-150 cursor-pointer group"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                {/* Col 1: Priority Rank & Patient Demographics (4 cols) */}
                <div className="lg:col-span-4 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 font-bold font-mono text-sm shrink-0">
                    #{index + 1}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white group-hover:text-teal-400 transition-colors truncate">
                        {patient.patientName}
                      </h3>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                          isCritical
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {patient.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                      <span className="font-mono">{patient.patientId}</span>
                      <span>·</span>
                      <span>{patient.ageGroup}</span>
                      <span>·</span>
                      <span>{patient.gender}</span>
                    </div>

                    <div className="text-xs font-semibold text-slate-300 mt-2 truncate">
                      Dx: {patient.primaryDiagnosis}
                    </div>

                    <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                      {patient.ward} · Attending: {patient.attendingPhysician}
                    </div>
                  </div>
                </div>

                {/* Col 2: Utilization & Clinical Acuity Metrics (3 cols) */}
                <div className="lg:col-span-3 space-y-2 border-t lg:border-t-0 lg:border-l border-slate-800 lg:pl-4 pt-3 lg:pt-0">
                  <div className="text-[11px] text-slate-400 font-medium">12-Month Utilization:</div>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2 rounded-lg bg-slate-800/80">
                      <span className="text-slate-400 block text-[10px]">Inpatient</span>
                      <span className="font-bold text-amber-400">{patient.numberInpatient} admissions</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-800/80">
                      <span className="text-slate-400 block text-[10px]">Emergency</span>
                      <span className="font-bold text-rose-400">{patient.numberEmergency} visits</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                    <span>Discharge: {patient.dischargeDisposition}</span>
                  </div>
                </div>

                {/* Col 3: Key Driving Factors (SHAP) (3 cols) */}
                <div className="lg:col-span-3 space-y-1.5 border-t lg:border-t-0 lg:border-l border-slate-800 lg:pl-4 pt-3 lg:pt-0">
                  <div className="text-[11px] text-slate-400 font-medium">Top Positive Risk Drivers:</div>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {patient.shapValues
                      .filter((s) => s.value > 0)
                      .slice(0, 2)
                      .map((factor, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[11px] text-slate-300">
                          <span className="text-rose-400 font-bold shrink-0">▲</span>
                          <span className="truncate">{factor.displayName}</span>
                        </li>
                      ))}
                  </ul>

                  <div className="text-[10px] text-teal-400 font-medium pt-1">
                    Suggested: {patient.suggestedActions[0] || 'Nurse Telehealth Call'}
                  </div>
                </div>

                {/* Col 4: Risk Meter & Priority Score (2 cols) */}
                <div className="lg:col-span-2 text-right border-t lg:border-t-0 lg:border-l border-slate-800 lg:pl-4 pt-3 lg:pt-0 flex flex-col items-end justify-between h-full">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Priority Score</div>
                    <div className="text-2xl font-extrabold text-white font-mono tabular-nums">
                      {patient.priorityScore}
                      <span className="text-xs text-slate-400 font-normal">/100</span>
                    </div>
                  </div>

                  <div className="mt-2 text-right">
                    <div className="text-xs font-mono font-bold text-rose-400 tabular-nums">
                      {(patient.readmission30dProb * 100).toFixed(1)}% 30d Risk
                    </div>
                    <div className="w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1 ml-auto">
                      <div
                        className="h-full bg-rose-500 rounded-full"
                        style={{ width: `${patient.riskScore}%` }}
                      />
                    </div>
                  </div>

                  <span className="mt-3 text-xs text-teal-400 group-hover:text-teal-300 font-medium flex items-center gap-1 transition-colors">
                    Review Care Plan <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
