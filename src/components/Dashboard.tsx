/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Users,
  AlertTriangle,
  Activity,
  Brain,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ChevronRight,
  Filter,
  CheckCircle2
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { PatientEncounter } from '../types';
import {
  WEEKLY_ADMISSIONS_DATA,
  DIAGNOSIS_MIX_DATA,
  CLINICAL_VITALS_TREND,
  UCI_DATASET_SUMMARY
} from '../data/uciDataset';

interface DashboardProps {
  patients: PatientEncounter[];
  onSelectPatient: (patient: PatientEncounter) => void;
  onNavigateToPrioritization: () => void;
  onNavigateToPatients: () => void;
  onNavigateToAssessment: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  patients,
  onSelectPatient,
  onNavigateToPrioritization,
  onNavigateToPatients,
  onNavigateToAssessment
}) => {
  const [vitalsTimeframe, setVitalsTimeframe] = useState<'7D' | '30D' | '90D'>('30D');
  const [priorityFilter, setPriorityFilter] = useState<'All' | 'Critical' | 'Monitoring' | 'Improving'>('All');

  // Filter queue
  const filteredQueue = patients.filter((p) => {
    if (priorityFilter === 'All') return true;
    return p.status === priorityFilter;
  });

  const highPriorityCount = patients.filter((p) => p.riskCategory === 'High').length;
  const criticalCount = patients.filter((p) => p.status === 'Critical').length;

  return (
    <div className="space-y-6 pb-12">
      {/* TOP KPI CARDS - Matches Reference Image exactly */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Patients */}
        <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            {/* Spark bars */}
            <div className="flex items-end gap-1 h-5">
              <span className="w-1 bg-emerald-500/40 rounded-full h-2" />
              <span className="w-1 bg-emerald-500/60 rounded-full h-3" />
              <span className="w-1 bg-emerald-500/80 rounded-full h-4" />
              <span className="w-1 bg-emerald-400 rounded-full h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xs font-medium text-slate-400">Active Patients</div>
            <div className="text-2xl font-extrabold text-white tracking-tight mt-0.5 tabular-nums">
              1,284
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>▲ 3.2% vs last week</span>
            <span className="text-slate-400 text-[11px] ml-auto">Active Ward</span>
          </div>
        </div>

        {/* Card 2: Critical Alerts */}
        <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex items-end gap-1 h-5">
              <span className="w-1 bg-amber-500/40 rounded-full h-4" />
              <span className="w-1 bg-amber-500/60 rounded-full h-2" />
              <span className="w-1 bg-amber-500/80 rounded-full h-5" />
              <span className="w-1 bg-amber-400 rounded-full h-3" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xs font-medium text-slate-400">Critical Alerts</div>
            <div className="text-2xl font-extrabold text-white tracking-tight mt-0.5 tabular-nums">
              {criticalCount}
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-400 font-medium">
            <span>▲ 2 new since 6am</span>
            <span className="text-slate-400 text-[11px] ml-auto">30d Return Risk</span>
          </div>
        </div>

        {/* Card 3: Avg Recovery Score */}
        <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <div className="flex items-end gap-1 h-5">
              <span className="w-1 bg-teal-500/40 rounded-full h-3" />
              <span className="w-1 bg-teal-500/60 rounded-full h-4" />
              <span className="w-1 bg-teal-500/80 rounded-full h-5" />
              <span className="w-1 bg-teal-400 rounded-full h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xs font-medium text-slate-400">Avg Recovery Score</div>
            <div className="text-2xl font-extrabold text-white tracking-tight mt-0.5 tabular-nums">
              84.6
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-teal-400 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>▲ 1.8 pts this month</span>
            <span className="text-slate-400 text-[11px] ml-auto">11.16% Benchmark</span>
          </div>
        </div>

        {/* Card 4: AI Risk Flags */}
        <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
              <Brain className="w-5 h-5" />
            </div>
            <div className="flex items-end gap-1 h-5">
              <span className="w-1 bg-purple-500/40 rounded-full h-2" />
              <span className="w-1 bg-purple-500/70 rounded-full h-5" />
              <span className="w-1 bg-purple-500/80 rounded-full h-3" />
              <span className="w-1 bg-purple-400 rounded-full h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xs font-medium text-slate-400">AI Risk Flags</div>
            <div className="text-2xl font-extrabold text-white tracking-tight mt-0.5 tabular-nums">
              {highPriorityCount * 4 + 7}
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-purple-300 font-medium">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            <span>{highPriorityCount} high-priority</span>
            <span className="text-slate-400 text-[11px] ml-auto">XGBoost v2.4</span>
          </div>
        </div>
      </div>

      {/* MIDDLE SECTION: Admissions Chart + Diagnosis Mix Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Weekly Admissions (Emergency vs Scheduled) */}
        <div className="lg:col-span-7 bg-slate-900/90 rounded-2xl p-5 border border-slate-800/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Weekly Admissions</h2>
              <p className="text-xs text-slate-400">Emergency vs Scheduled</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-slate-600 inline-block" />
                <span className="text-slate-400">Emergency</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-blue-500 inline-block" />
                <span className="text-slate-400">Scheduled</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={WEEKLY_ADMISSIONS_DATA}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                barGap={6}
              >
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94A3B8', fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94A3B8', fontSize: 12 }}
                  domain={[0, 60]}
                  ticks={[15, 30, 45, 60]}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(255, 255, 255, 0.04)' }}
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#F8FAFC',
                    fontSize: '12px'
                  }}
                />
                <Bar
                  dataKey="emergency"
                  name="Emergency"
                  fill="#475569"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={28}
                />
                <Bar
                  dataKey="scheduled"
                  name="Scheduled"
                  fill="#3B82F6"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={28}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Diagnosis Mix (Donut Chart) */}
        <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl p-5 border border-slate-800/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Diagnosis Mix</h2>
              <p className="text-xs text-slate-400">Current patient cohort</p>
            </div>
            <div className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700/80">
              Last 30 days
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4 my-2">
            {/* Donut with center label */}
            <div className="h-44 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={DIAGNOSIS_MIX_DATA}
                    innerRadius={50}
                    outerRadius={68}
                    paddingAngle={4}
                    dataKey="count"
                  >
                    {DIAGNOSIS_MIX_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#334155',
                      borderRadius: '0.75rem',
                      color: '#F8FAFC',
                      fontSize: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-lg font-bold text-white tabular-nums">1,284</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">patients</span>
              </div>
            </div>

            {/* Legend list */}
            <div className="space-y-1.5 text-xs">
              {DIAGNOSIS_MIX_DATA.map((d) => (
                <div key={d.name} className="flex items-center justify-between text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                    <span className="truncate">{d.name}</span>
                  </div>
                  <span className="text-slate-400 tabular-nums font-mono text-[11px]">
                    {d.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Clinical Insights Quote Banner (matches reference) */}
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-800 text-slate-300 text-xs leading-relaxed flex items-start gap-2.5">
            <span className="text-teal-400 text-base leading-none select-none">💬</span>
            <p className="text-[11px] text-slate-400">
              In diabetic patients with comorbid cardiovascular conditions, 30-day readmissions cluster strongly around post-discharge days 4–12. Early nurse outreach reduces acute re-presentations by up to 28%.
            </p>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: 30-Day Vitals Trend + Priority Patient Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Cardiac Vitals — 30 Day Trend */}
        <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl p-5 border border-slate-800/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Cardiac Vitals — 30 Day Trend</h2>
              <p className="text-xs text-slate-400">Averaged across monitored patients</p>
            </div>
            {/* Segmented control */}
            <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700/80 text-xs font-medium">
              {(['7D', '30D', '90D'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setVitalsTimeframe(range)}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    vitalsTimeframe === range
                      ? 'bg-slate-700 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={CLINICAL_VITALS_TREND}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94A3B8', fontSize: 11 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94A3B8', fontSize: 11 }}
                  domain={[20, 160]}
                  ticks={[20, 60, 100, 140]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#F8FAFC',
                    fontSize: '12px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="heartRate"
                  name="Heart Rate"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ r: 2, fill: '#10B981' }}
                />
                <Line
                  type="monotone"
                  dataKey="bpSystolic"
                  name="BP Systolic"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  dot={{ r: 2, fill: '#8B5CF6' }}
                />
                <Line
                  type="monotone"
                  dataKey="glucose"
                  name="Blood Glucose"
                  stroke="#F97316"
                  strokeWidth={1.5}
                  strokeDasharray="3 3"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 pt-3 border-t border-slate-800 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Heart Rate (bpm)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              <span>BP Systolic</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-1 rounded bg-orange-500" />
              <span>Glucose</span>
            </div>
          </div>
        </div>

        {/* Right: Priority Patient Queue (Sorted by AI risk score) */}
        <div className="lg:col-span-7 bg-slate-900/90 rounded-2xl p-5 border border-slate-800/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">Priority Patient Queue</h2>
                <button
                  onClick={onNavigateToPrioritization}
                  className="text-xs text-teal-400 hover:text-teal-300 font-medium flex items-center gap-1 transition-colors"
                >
                  View All <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs text-slate-400">
                Sorted by AI risk score · {highPriorityCount} high-priority patients
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700/80 text-xs font-medium">
              {(['All', 'Critical', 'Monitoring', 'Improving'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setPriorityFilter(f)}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    priorityFilter === f
                      ? 'bg-slate-700 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px] font-semibold tracking-wider">
                  <th className="pb-2.5 pr-2 font-medium">PATIENT</th>
                  <th className="pb-2.5 px-2 font-medium">DIAGNOSIS</th>
                  <th className="pb-2.5 px-2 font-medium">STATUS</th>
                  <th className="pb-2.5 px-2 font-medium">HEART RATE</th>
                  <th className="pb-2.5 px-2 font-medium">BP</th>
                  <th className="pb-2.5 px-2 font-medium text-right">AI RISK SCORE</th>
                  <th className="pb-2.5 pl-2 font-medium text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredQueue.slice(0, 5).map((patient) => {
                  const isHighRisk = patient.riskCategory === 'High';
                  const isModRisk = patient.riskCategory === 'Moderate';

                  return (
                    <tr
                      key={patient.id}
                      onClick={() => onSelectPatient(patient)}
                      className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
                    >
                      <td className="py-3 pr-2">
                        <div className="font-semibold text-slate-100 group-hover:text-teal-400 transition-colors">
                          {patient.patientName}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400">{patient.patientId}</div>
                      </td>

                      <td className="py-3 px-2 text-slate-300">
                        <div className="truncate max-w-[130px]">{patient.primaryDiagnosis}</div>
                        <div className="text-[10px] text-slate-400">{patient.ageGroup}</div>
                      </td>

                      <td className="py-3 px-2">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                            patient.status === 'Critical'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : patient.status === 'Monitoring'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {patient.status}
                        </span>
                      </td>

                      <td className="py-3 px-2 text-slate-200 font-mono tabular-nums">
                        {patient.vitals.heartRate} bpm
                      </td>

                      <td className="py-3 px-2 text-slate-200 font-mono tabular-nums">
                        {patient.vitals.bpSystolic} / {patient.vitals.bpDiastolic}
                      </td>

                      <td className="py-3 px-2 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                isHighRisk ? 'bg-rose-500' : isModRisk ? 'bg-amber-500' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${patient.riskScore}%` }}
                            />
                          </div>
                          <span
                            className={`font-mono font-bold text-xs tabular-nums ${
                              isHighRisk ? 'text-rose-400' : isModRisk ? 'text-amber-400' : 'text-emerald-400'
                            }`}
                          >
                            {patient.riskScore}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 pl-2 text-right">
                        <span className="p-1 rounded text-slate-400 group-hover:text-white transition-colors">
                          <ChevronRight className="w-4 h-4 inline" />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Showing top monitored encounters</span>
            <button
              onClick={onNavigateToPatients}
              className="text-teal-400 hover:text-teal-300 font-medium"
            >
              Browse All Encounters →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
