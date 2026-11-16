/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  Eye,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { PatientEncounter, RiskLevel, AdmissionType } from '../types';

interface PatientManagementProps {
  patients: PatientEncounter[];
  onSelectPatient: (patient: PatientEncounter) => void;
  onNewAssessment: () => void;
}

export const PatientManagement: React.FC<PatientManagementProps> = ({
  patients,
  onSelectPatient,
  onNewAssessment
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<'All' | RiskLevel>('All');
  const [admissionFilter, setAdmissionFilter] = useState<'All' | AdmissionType>('All');
  const [sortField, setSortField] = useState<keyof PatientEncounter>('riskScore');
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;

  // Filter and sort
  const filteredPatients = useMemo(() => {
    return patients
      .filter((p) => {
        const matchesSearch =
          p.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.encounterId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.primaryDiagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.medicalSpecialty.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRisk = riskFilter === 'All' || p.riskCategory === riskFilter;
        const matchesAdmission = admissionFilter === 'All' || p.admissionType === admissionFilter;

        return matchesSearch && matchesRisk && matchesAdmission;
      })
      .sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];
        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortAsc ? valA - valB : valB - valA;
        }
        if (typeof valA === 'string' && typeof valB === 'string') {
          return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        return 0;
      });
  }, [patients, searchTerm, riskFilter, admissionFilter, sortField, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(filteredPatients.length / rowsPerPage));
  const paginatedPatients = filteredPatients.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleSort = (field: keyof PatientEncounter) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'Patient ID',
      'Encounter ID',
      'Age Group',
      'Gender',
      'Admission Type',
      'Medical Specialty',
      'Inpatient Visits',
      'Emergency Visits',
      'Outpatient Visits',
      'Discharge Disposition',
      'Actual Readmission',
      'Predicted Readmission',
      '30-Day Probability',
      'Risk Category',
      'Risk Score'
    ];

    const rows = filteredPatients.map((p) => [
      p.patientId,
      p.encounterId,
      p.ageGroup,
      p.gender,
      p.admissionType,
      p.medicalSpecialty,
      p.numberInpatient,
      p.numberEmergency,
      p.numberOutpatient,
      `"${p.dischargeDisposition}"`,
      p.actualReadmission,
      p.predictedReadmission,
      (p.readmission30dProb * 100).toFixed(1) + '%',
      p.riskCategory,
      p.riskScore
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `HealthPredict_Encounters_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Patient Encounters Directory</h2>
          <p className="text-xs text-slate-400 mt-1">
            Grounded in the UCI 130-US Hospitals Diabetes dataset · Pseudonymized identifiers compliant with HIPAA Safe Harbor
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-teal-400" />
            <span>Export Encounters CSV</span>
          </button>

          <button
            onClick={onNewAssessment}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          >
            <span>+ Assess New Patient</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search Patient ID, Encounter ID, Diagnosis, or Specialty..."
            className="w-full bg-slate-800/80 border border-slate-700/80 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-teal-500 transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          {/* Risk Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Risk Tier:</span>
            <select
              value={riskFilter}
              onChange={(e) => {
                setRiskFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-teal-500"
            >
              <option value="All">All Risk Tiers</option>
              <option value="High">High Risk (&gt;30%)</option>
              <option value="Moderate">Moderate Risk (15-30%)</option>
              <option value="Low">Low Risk (&lt;15%)</option>
            </select>
          </div>

          {/* Admission Type Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Admission:</span>
            <select
              value={admissionFilter}
              onChange={(e) => {
                setAdmissionFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-teal-500"
            >
              <option value="All">All Admissions</option>
              <option value="Emergency">Emergency</option>
              <option value="Urgent">Urgent</option>
              <option value="Elective">Elective</option>
            </select>
          </div>

          <span className="text-slate-400 text-xs ml-2 tabular-nums">
            Showing <strong className="text-white">{filteredPatients.length}</strong> encounters
          </span>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-800/50 border-b border-slate-800 text-slate-400 text-[11px] font-semibold tracking-wider">
                <th
                  onClick={() => handleSort('patientId')}
                  className="py-3 px-4 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>PATIENT / ENCOUNTER</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('ageGroup')}
                  className="py-3 px-3 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>AGE / GENDER</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3">ADMISSION / SPECIALTY</th>
                <th
                  onClick={() => handleSort('numberInpatient')}
                  className="py-3 px-3 text-center cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>PRIOR VISITS (INP / ER)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3">DISCHARGE DISPOSITION</th>
                <th className="py-3 px-3 text-center">ACTUAL OUTCOME</th>
                <th
                  onClick={() => handleSort('riskScore')}
                  className="py-3 px-4 text-right cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>PREDICTED RISK (30D)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 pr-4 text-right">DETAILS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {paginatedPatients.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="font-medium text-slate-300">No encounters matched your search filters</p>
                    <p className="text-xs text-slate-400 mt-1">Try resetting the risk filter or search keywords</p>
                  </td>
                </tr>
              ) : (
                paginatedPatients.map((patient) => {
                  const isHigh = patient.riskCategory === 'High';
                  const isMod = patient.riskCategory === 'Moderate';

                  return (
                    <tr
                      key={patient.id}
                      onClick={() => onSelectPatient(patient)}
                      className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
                    >
                      {/* Patient ID / Encounter ID */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-100 group-hover:text-teal-400 transition-colors">
                          {patient.patientName}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                          <span>{patient.patientId}</span>
                          <span className="text-slate-400">·</span>
                          <span className="text-slate-400">{patient.encounterId}</span>
                        </div>
                      </td>

                      {/* Age / Gender */}
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-200">{patient.ageGroup}</div>
                        <div className="text-[11px] text-slate-400">{patient.gender} · {patient.race}</div>
                      </td>

                      {/* Admission / Specialty */}
                      <td className="py-3 px-3">
                        <div className="text-slate-200 font-medium">{patient.admissionType}</div>
                        <div className="text-[11px] text-teal-400/90 truncate max-w-[150px]">
                          {patient.medicalSpecialty}
                        </div>
                      </td>

                      {/* Prior Visits */}
                      <td className="py-3 px-3 text-center">
                        <div className="font-mono text-slate-100 tabular-nums">
                          <span className={patient.numberInpatient > 0 ? 'text-amber-400 font-bold' : 'text-slate-400'}>
                            {patient.numberInpatient} inp
                          </span>
                          <span className="text-slate-400 mx-1">/</span>
                          <span className={patient.numberEmergency > 0 ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                            {patient.numberEmergency} er
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 tabular-nums">
                          {patient.timeInHospital} days stay
                        </div>
                      </td>

                      {/* Discharge Disposition */}
                      <td className="py-3 px-3 text-slate-300">
                        <div className="truncate max-w-[180px]" title={patient.dischargeDisposition}>
                          {patient.dischargeDisposition}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[180px]">
                          Dx: {patient.primaryDiagnosis}
                        </div>
                      </td>

                      {/* Actual Outcome in Dataset */}
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                            patient.actualReadmission === '<30'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : patient.actualReadmission === '>30'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}
                        >
                          {patient.actualReadmission === '<30'
                            ? '< 30 Days'
                            : patient.actualReadmission === '>30'
                            ? '> 30 Days'
                            : 'No Return'}
                        </span>
                      </td>

                      {/* Predicted Risk */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="text-right">
                            <div
                              className={`font-mono font-bold text-xs tabular-nums ${
                                isHigh ? 'text-rose-400' : isMod ? 'text-amber-400' : 'text-emerald-400'
                              }`}
                            >
                              {(patient.readmission30dProb * 100).toFixed(1)}%
                            </div>
                            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                              {patient.riskCategory}
                            </div>
                          </div>
                          <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                isHigh ? 'bg-rose-500' : isMod ? 'bg-amber-500' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${patient.riskScore}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Detail CTA */}
                      <td className="py-3 pr-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectPatient(patient);
                          }}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-teal-600 hover:text-white text-slate-300 transition-colors text-xs font-medium cursor-pointer"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div>
            Page <strong className="text-white">{currentPage}</strong> of <strong className="text-white">{totalPages}</strong>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-200 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-200 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
