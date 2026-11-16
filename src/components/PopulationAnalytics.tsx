/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Layers,
  Filter,
  PieChart as PieChartIcon
} from 'lucide-react';
import {
  READMISSION_BY_AGE,
  READMISSION_BY_ADMISSION_TYPE,
  READMISSION_BY_DISPOSITION,
  UCI_DATASET_SUMMARY
} from '../data/uciDataset';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  Legend
} from 'recharts';

export const PopulationAnalytics: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState<'30d' | 'overall'>('30d');

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-teal-400" />
            Population Health & Demographic Analytics
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Empirical readmission epidemiology across 101,766 diabetic patient encounters
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Target Filter:</span>
          <div className="flex items-center bg-slate-900 border border-slate-800 p-0.5 rounded-lg">
            <button
              onClick={() => setSelectedMetric('30d')}
              className={`px-3 py-1 rounded-md transition-colors ${
                selectedMetric === '30d' ? 'bg-slate-800 text-teal-400 font-bold' : 'text-slate-400'
              }`}
            >
              30-Day Returns (&lt;30d)
            </button>
            <button
              onClick={() => setSelectedMetric('overall')}
              className={`px-3 py-1 rounded-md transition-colors ${
                selectedMetric === 'overall' ? 'bg-slate-800 text-teal-400 font-bold' : 'text-slate-400'
              }`}
            >
              All Readmissions (&lt;30d + &gt;30d)
            </button>
          </div>
        </div>
      </div>

      {/* Row 1: Readmission by Age Group */}
      <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Readmission Rate by Age Group</h3>
            <p className="text-xs text-slate-400">
              Geriatric cohorts (70-80 and 80-90) exhibit highest 30-day return rates (12.8% and 13.4%)
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">UCI Benchmark</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={READMISSION_BY_AGE}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <XAxis dataKey="age" tick={{ fill: '#94A3B8', fontSize: 11 }} />
              <YAxis
                tick={{ fill: '#94A3B8', fontSize: 11 }}
                domain={[0, selectedMetric === '30d' ? 16 : 50]}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  color: '#F8FAFC',
                  fontSize: '12px'
                }}
                formatter={(val: any) => [`${val}%`, 'Readmission Rate']}
              />
              <Bar
                dataKey={selectedMetric === '30d' ? 'rate30d' : 'rateOver30d'}
                fill={selectedMetric === '30d' ? '#14B8A6' : '#F59E0B'}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Admission Type & Discharge Disposition */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Admission Type Impact */}
        <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800/80 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Readmission by Admission Type</h3>
            <p className="text-xs text-slate-400">
              Emergency presentations carry a 12.4% 30-day readmission rate vs 8.9% for scheduled elective procedures
            </p>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={READMISSION_BY_ADMISSION_TYPE}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <XAxis dataKey="type" tick={{ fill: '#94A3B8', fontSize: 10 }} />
                <YAxis
                  tick={{ fill: '#94A3B8', fontSize: 10 }}
                  domain={[0, 16]}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#F8FAFC',
                    fontSize: '12px'
                  }}
                  formatter={(val: any) => [`${val}%`, '30-Day Readmission Rate']}
                />
                <Bar dataKey="rate30d" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Discharge Disposition Relative Risk */}
        <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800/80 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Discharge Disposition Risk Gradient</h3>
            <p className="text-xs text-slate-400">
              Left AMA (23.5%) and SNF transfers (18.2%) have elevated 30-day return risk
            </p>
          </div>

          <div className="space-y-2.5 text-xs">
            {READMISSION_BY_DISPOSITION.map((item) => (
              <div key={item.disposition} className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-200">{item.disposition}</div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Relative Risk: {item.relativeRisk}x
                  </div>
                </div>
                <div className="text-right font-mono">
                  <div className="text-sm font-bold text-rose-400">{item.rate30d}%</div>
                  <div className="text-[10px] text-slate-400">30d Rate</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
