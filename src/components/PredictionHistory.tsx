/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  History,
  Search,
  Filter,
  Download,
  CheckCircle2,
  Clock,
  ArrowRightLeft,
  X,
  FileCheck,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PredictionHistoryRecord } from '../types';

export const PredictionHistory: React.FC<{ onNewAssessment: () => void }> = ({ onNewAssessment }) => {
  const { predictionHistory, updatePredictionStatus, clearHistory, currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNote, setEditNote] = useState('');
  const [editStatus, setEditStatus] = useState<PredictionHistoryRecord['reviewStatus']>('Reviewed & Actioned');

  const filteredHistory = predictionHistory.filter((item) => {
    return (
      item.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.encounterId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.primaryDiagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.predictedClass.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const toggleCompare = (id: string) => {
    if (selectedForCompare.includes(id)) {
      setSelectedForCompare(selectedForCompare.filter((i) => i !== id));
    } else {
      if (selectedForCompare.length >= 2) {
        setSelectedForCompare([selectedForCompare[1], id]);
      } else {
        setSelectedForCompare([...selectedForCompare, id]);
      }
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'Prediction ID',
      'Timestamp',
      'Patient ID',
      'Encounter ID',
      'Patient Name',
      'Diagnosis',
      'Predicted Class',
      '30d Readmission Prob',
      'Over 30d Prob',
      'No Readmission Prob',
      'Risk Category',
      'Model Version',
      'Reviewed By',
      'Review Status',
      'Clinical Notes'
    ];

    const rows = filteredHistory.map((p) => [
      p.id,
      p.timestamp,
      p.patientId,
      p.encounterId,
      p.patientName,
      `"${p.primaryDiagnosis}"`,
      p.predictedClass,
      (p.prob30d * 100).toFixed(1) + '%',
      (p.probOver30d * 100).toFixed(1) + '%',
      (p.probNo * 100).toFixed(1) + '%',
      p.riskCategory,
      p.modelVersion,
      p.reviewedBy || 'Unassigned',
      p.reviewStatus,
      `"${p.clinicalNotes || ''}"`
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `HealthPredict_Prediction_History_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const compareItems = selectedForCompare
    .map((id) => predictionHistory.find((p) => p.id === id))
    .filter(Boolean) as PredictionHistoryRecord[];

  return (
    <div className="space-y-6 pb-12">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <History className="w-5 h-5 text-teal-400" />
            Machine Learning Prediction Audit Log & History
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Immutable longitudinal log of all patient inferences, model versions, probability distributions, and clinical reviews
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-teal-400" />
            <span>Export Audit Log</span>
          </button>

          <button
            onClick={onNewAssessment}
            className="px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          >
            + New In-Clinic Assessment
          </button>
        </div>
      </div>

      {/* Side-by-Side Comparison Drawer (if 2 selected) */}
      {compareItems.length === 2 && (
        <div className="bg-slate-900 border border-teal-500/40 rounded-2xl p-5 shadow-xl relative animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4 text-teal-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Side-by-Side Inpatient Prediction Comparison
              </span>
            </div>
            <button
              onClick={() => setSelectedForCompare([])}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <X className="w-4 h-4" /> Close Comparison
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {compareItems.map((item, idx) => (
              <div key={item.id} className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-teal-400">Encounter Case #{idx + 1}</span>
                  <span className="font-mono text-[11px] text-slate-400">{item.timestamp}</span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white">{item.patientName}</h4>
                  <div className="text-slate-400 text-xs">
                    {item.patientId} · {item.ageGroup} · {item.gender}
                  </div>
                  <div className="text-slate-300 font-semibold mt-1">Dx: {item.primaryDiagnosis}</div>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-slate-400">30-Day Readmission Risk:</span>
                    <span
                      className={`text-lg font-mono font-bold ${
                        item.riskCategory === 'High'
                          ? 'text-rose-400'
                          : item.riskCategory === 'Moderate'
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {(item.prob30d * 100).toFixed(1)}% ({item.riskCategory})
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono pt-1 border-t border-slate-800">
                    <div>
                      <span className="text-slate-400 block">&lt;30d</span>
                      <span className="text-rose-400 font-bold">{(item.prob30d * 100).toFixed(0)}%</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">&gt;30d</span>
                      <span className="text-amber-400 font-bold">{(item.probOver30d * 100).toFixed(0)}%</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">NO</span>
                      <span className="text-emerald-400 font-bold">{(item.probNo * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-[11px] text-slate-400 font-semibold">Top Driving Clinical Factors:</div>
                  <ul className="text-[11px] text-slate-300 space-y-1">
                    {item.topFactors.map((f, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="text-teal-400 font-bold">·</span> {f}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 border-t border-slate-700/60 text-[11px] text-slate-400">
                  Reviewed: <span className="text-slate-200">{item.reviewedBy || 'Pending'}</span> ({item.reviewStatus})
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter and Search */}
      <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Patient ID, Encounter ID, Diagnosis, or Category..."
            className="w-full bg-slate-800/80 border border-slate-700/80 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-teal-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span>
            Compare: <strong className="text-teal-400">{selectedForCompare.length}/2</strong> selected
          </span>
          <span className="tabular-nums">
            Total Logged: <strong className="text-white">{filteredHistory.length}</strong>
          </span>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-800/50 border-b border-slate-800 text-slate-400 text-[11px] font-semibold tracking-wider">
                <th className="py-3 px-4">COMPARE</th>
                <th className="py-3 px-3">TIMESTAMP</th>
                <th className="py-3 px-3">PATIENT & ENCOUNTER</th>
                <th className="py-3 px-3">DIAGNOSIS</th>
                <th className="py-3 px-3 text-center">PREDICTED CLASS</th>
                <th className="py-3 px-3 text-right">30D PROBABILITY</th>
                <th className="py-3 px-3">REVIEW STATUS</th>
                <th className="py-3 pr-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="font-medium text-slate-300">No predictions recorded yet</p>
                    <p className="text-xs text-slate-400 mt-1">Run an assessment to log predictions to history</p>
                  </td>
                </tr>
              ) : (
                filteredHistory.map((item) => {
                  const isChecked = selectedForCompare.includes(item.id);
                  const isHigh = item.riskCategory === 'High';
                  const isMod = item.riskCategory === 'Moderate';

                  return (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleCompare(item.id)}
                          className="rounded bg-slate-800 border-slate-700 text-teal-600 focus:ring-0 cursor-pointer"
                        />
                      </td>

                      <td className="py-3 px-3 font-mono text-slate-400 text-[11px] whitespace-nowrap">
                        {item.timestamp}
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-200">{item.patientName}</div>
                        <div className="text-[11px] font-mono text-slate-400">
                          {item.patientId} · {item.encounterId}
                        </div>
                      </td>

                      <td className="py-3 px-3 text-slate-300">
                        <div className="truncate max-w-[170px]">{item.primaryDiagnosis}</div>
                        <div className="text-[10px] text-slate-400">{item.ageGroup} · {item.gender}</div>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded font-mono font-bold text-[11px] ${
                            item.predictedClass === '<30'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : item.predictedClass === '>30'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {item.predictedClass === '<30'
                            ? '< 30d'
                            : item.predictedClass === '>30'
                            ? '> 30d'
                            : 'NO'}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right">
                        <span
                          className={`font-mono font-bold text-xs tabular-nums ${
                            isHigh ? 'text-rose-400' : isMod ? 'text-amber-400' : 'text-emerald-400'
                          }`}
                        >
                          {(item.prob30d * 100).toFixed(1)}%
                        </span>
                        <div className="text-[10px] text-slate-400 font-semibold">{item.riskCategory}</div>
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          {item.reviewStatus === 'Reviewed & Actioned' ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          ) : item.reviewStatus === 'Discharge Follow-up Scheduled' ? (
                            <FileCheck className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                          ) : (
                            <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          )}
                          <span className="text-slate-200 text-xs truncate max-w-[140px]">
                            {item.reviewStatus}
                          </span>
                        </div>
                        {item.clinicalNotes && (
                          <div className="text-[10px] text-slate-400 truncate max-w-[160px] italic">
                            "{item.clinicalNotes}"
                          </div>
                        )}
                      </td>

                      <td className="py-3 pr-4 text-right">
                        <button
                          onClick={() => {
                            setEditingId(item.id);
                            setEditNote(item.clinicalNotes || '');
                            setEditStatus(item.reviewStatus);
                          }}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
                        >
                          Update Status
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Review Modal */}
      {editingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">Update Clinician Review Record</h3>
              <button onClick={() => setEditingId(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Review Outcome Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-teal-500"
                >
                  <option value="Reviewed & Actioned">Reviewed & Actioned</option>
                  <option value="Discharge Follow-up Scheduled">Discharge Follow-up Scheduled</option>
                  <option value="Pending Review">Pending Review</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Clinical Care Notes</label>
                <textarea
                  rows={3}
                  value={editNote}
                  onChange={(e) => setEditNote(e.target.value)}
                  placeholder="Record instructions for care transitions, follow-up nurse visits, or medication reconciliation..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setEditingId(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  updatePredictionStatus(editingId, editStatus, editNote);
                  setEditingId(null);
                }}
                className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold cursor-pointer"
              >
                Save Review Log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
