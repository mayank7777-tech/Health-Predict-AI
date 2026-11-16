/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Brain,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Save,
  RotateCcw,
  Info,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Activity
} from 'lucide-react';
import {
  AgeGroup,
  Gender,
  AdmissionType,
  DischargeDisposition,
  AdmissionSource,
  MedicalSpecialty,
  GlucoseSerum,
  A1CResult,
  MedChange,
  DiabetesMed,
  MedStatus
} from '../types';
import { predictPatientRisk, PredictionInput, PredictionResult } from '../services/mlEngine';
import { useAuth } from '../context/AuthContext';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ReferenceLine } from 'recharts';

export const RiskAssessment: React.FC<{ onNavigateToHistory?: () => void }> = ({ onNavigateToHistory }) => {
  const { thresholds, addPredictionHistory, currentUser } = useAuth();

  // Form State
  const [formData, setFormData] = useState<PredictionInput>({
    ageGroup: '[70-80)',
    gender: 'Male',
    race: 'Caucasian',
    admissionType: 'Emergency',
    dischargeDisposition: 'Discharged/transferred to SNF',
    admissionSource: 'Emergency Room',
    medicalSpecialty: 'Cardiology',
    timeInHospital: 7,
    numLabProcedures: 58,
    numProcedures: 2,
    numMedications: 22,
    numberOutpatient: 1,
    numberEmergency: 2,
    numberInpatient: 2,
    numberDiagnoses: 9,
    maxGluSerum: '>300',
    a1cResult: '>8',
    change: 'Ch',
    diabetesMed: 'Yes',
    insulin: 'Up',
    metformin: 'Steady'
  });

  const [patientName, setPatientName] = useState('William Vance');
  const [patientId, setPatientId] = useState('#P-00941');
  const [primaryDx, setPrimaryDx] = useState('Decompensated Heart Failure & T2D');

  // Live Prediction Result
  const [result, setResult] = useState<PredictionResult>(() =>
    predictPatientRisk(formData, thresholds)
  );

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Recalculate
  const handleInputChange = (field: keyof PredictionInput, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    setResult(predictPatientRisk(updated, thresholds));
    setSavedSuccess(false);
  };

  // Preset Presets
  const applyPreset = (preset: 'high' | 'moderate' | 'low') => {
    if (preset === 'high') {
      const data: PredictionInput = {
        ageGroup: '[70-80)',
        gender: 'Male',
        race: 'Caucasian',
        admissionType: 'Emergency',
        dischargeDisposition: 'Discharged/transferred to SNF',
        admissionSource: 'Emergency Room',
        medicalSpecialty: 'Cardiology',
        timeInHospital: 8,
        numLabProcedures: 64,
        numProcedures: 2,
        numMedications: 24,
        numberOutpatient: 1,
        numberEmergency: 3,
        numberInpatient: 3,
        numberDiagnoses: 9,
        maxGluSerum: '>300',
        a1cResult: '>8',
        change: 'Ch',
        diabetesMed: 'Yes',
        insulin: 'Up',
        metformin: 'Steady'
      };
      setPatientName('Arthur Pendelton');
      setPatientId('#P-00788');
      setPrimaryDx('Acute Heart Failure with Poor Glycemic Control');
      setFormData(data);
      setResult(predictPatientRisk(data, thresholds));
    } else if (preset === 'moderate') {
      const data: PredictionInput = {
        ageGroup: '[50-60)',
        gender: 'Female',
        race: 'AfricanAmerican',
        admissionType: 'Urgent',
        dischargeDisposition: 'Discharged to home with home health service',
        admissionSource: 'Physician Referral',
        medicalSpecialty: 'InternalMedicine',
        timeInHospital: 4,
        numLabProcedures: 46,
        numProcedures: 1,
        numMedications: 17,
        numberOutpatient: 2,
        numberEmergency: 1,
        numberInpatient: 1,
        numberDiagnoses: 7,
        maxGluSerum: '>200',
        a1cResult: '>7',
        change: 'Ch',
        diabetesMed: 'Yes',
        insulin: 'Steady',
        metformin: 'Up'
      };
      setPatientName('Brenda Davis');
      setPatientId('#P-00512');
      setPrimaryDx('Diabetic Hyperglycemia & Stage 2 Hypertension');
      setFormData(data);
      setResult(predictPatientRisk(data, thresholds));
    } else {
      const data: PredictionInput = {
        ageGroup: '[40-50)',
        gender: 'Male',
        race: 'Asian',
        admissionType: 'Elective',
        dischargeDisposition: 'Discharged to home',
        admissionSource: 'Physician Referral',
        medicalSpecialty: 'Surgery-General',
        timeInHospital: 2,
        numLabProcedures: 30,
        numProcedures: 2,
        numMedications: 9,
        numberOutpatient: 1,
        numberEmergency: 0,
        numberInpatient: 0,
        numberDiagnoses: 4,
        maxGluSerum: 'Norm',
        a1cResult: 'Norm',
        change: 'No',
        diabetesMed: 'Yes',
        insulin: 'No',
        metformin: 'Steady'
      };
      setPatientName('Kenji Tanaka');
      setPatientId('#P-00204');
      setPrimaryDx('Elective Inguinal Herniorrhaphy in Well-Controlled T2D');
      setFormData(data);
      setResult(predictPatientRisk(data, thresholds));
    }
    setSavedSuccess(false);
  };

  const handleSaveToHistory = () => {
    addPredictionHistory({
      patientId,
      encounterId: `#ENC-${Math.floor(10000 + Math.random() * 90000)}`,
      patientName,
      ageGroup: formData.ageGroup as AgeGroup,
      gender: formData.gender as Gender,
      primaryDiagnosis: primaryDx,
      predictedClass: result.predictedClass,
      prob30d: result.prob30d,
      probOver30d: result.probOver30d,
      probNo: result.probNo,
      riskCategory: result.riskCategory,
      riskScore: result.riskScore,
      modelVersion: result.modelVersion,
      reviewStatus: 'Pending Review',
      topFactors: result.topRiskDrivers
    });
    setSavedSuccess(true);
  };

  // Waterfall Chart Data preparation
  const waterfallData = result.shapValues.slice(0, 8).map((s) => ({
    name: s.displayName.length > 24 ? s.displayName.substring(0, 22) + '...' : s.displayName,
    impact: Number((s.value * 100).toFixed(1)),
    category: s.category,
    rawName: s.displayName
  }));

  const isHigh = result.riskCategory === 'High';
  const isMod = result.riskCategory === 'Moderate';

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Presets */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Brain className="w-5 h-5 text-teal-400" />
            Individual Patient Risk Assessment
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time inference using the trained XGBoost model and TreeSHAP explainability engine
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 hidden sm:inline">Load Clinical Case:</span>
          <button
            onClick={() => applyPreset('high')}
            className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-medium transition-colors cursor-pointer"
          >
            High Risk Case
          </button>
          <button
            onClick={() => applyPreset('moderate')}
            className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-medium transition-colors cursor-pointer"
          >
            Moderate Case
          </button>
          <button
            onClick={() => applyPreset('low')}
            className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-medium transition-colors cursor-pointer"
          >
            Low Risk Case
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Clinical Assessment Form (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Patient Header Identification */}
          <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                1. Patient Encounter Demographics
              </span>
              <span className="text-xs text-teal-400 font-mono">HIPAA Pseudonymized</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Patient Name</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Patient ID</label>
                <input
                  type="text"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 font-mono focus:outline-none focus:border-teal-500"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Primary Diagnosis</label>
                <input
                  type="text"
                  value={primaryDx}
                  onChange={(e) => setPrimaryDx(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Age Bracket</label>
                <select
                  value={formData.ageGroup}
                  onChange={(e) => handleInputChange('ageGroup', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-teal-500"
                >
                  <option value="[0-10)">[0-10) yrs</option>
                  <option value="[10-20)">[10-20) yrs</option>
                  <option value="[20-30)">[20-30) yrs</option>
                  <option value="[30-40)">[30-40) yrs</option>
                  <option value="[40-50)">[40-50) yrs</option>
                  <option value="[50-60)">[50-60) yrs</option>
                  <option value="[60-70)">[60-70) yrs</option>
                  <option value="[70-80)">[70-80) yrs</option>
                  <option value="[80-90)">[80-90) yrs</option>
                  <option value="[90-100)">[90-100) yrs</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-teal-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Admission Type</label>
                <select
                  value={formData.admissionType}
                  onChange={(e) => handleInputChange('admissionType', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-teal-500"
                >
                  <option value="Emergency">Emergency</option>
                  <option value="Urgent">Urgent</option>
                  <option value="Elective">Elective</option>
                  <option value="Trauma Center">Trauma Center</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Discharge Disposition</label>
                <select
                  value={formData.dischargeDisposition}
                  onChange={(e) => handleInputChange('dischargeDisposition', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-teal-500 text-xs"
                >
                  <option value="Discharged to home">Routine Home</option>
                  <option value="Discharged/transferred to SNF">Discharged to SNF</option>
                  <option value="Discharged to home with home health service">Home Health Care</option>
                  <option value="Transferred to short term general hospital">Transferred Short Term</option>
                  <option value="Left AMA (Against Medical Advice)">Left AMA</option>
                  <option value="Hospice / Medical facility">Hospice</option>
                </select>
              </div>
            </div>
          </div>

          {/* Hospital Utilization & Comorbidity Burdens */}
          <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                2. Prior Hospital Utilization & Clinical Burden
              </span>
              <span className="text-xs text-amber-400/90 font-medium">Critical Risk Predictors</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Prior Inpatient Visits (12m)</label>
                <input
                  type="number"
                  min="0"
                  max="25"
                  value={formData.numberInpatient}
                  onChange={(e) => handleInputChange('numberInpatient', parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 font-mono font-bold focus:outline-none focus:border-teal-500"
                />
                <span className="text-[10px] text-slate-400 block mt-0.5">Top odds ratio contributor</span>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Prior Emergency Visits (12m)</label>
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={formData.numberEmergency}
                  onChange={(e) => handleInputChange('numberEmergency', parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 font-mono font-bold focus:outline-none focus:border-teal-500"
                />
                <span className="text-[10px] text-slate-400 block mt-0.5">Acute instability marker</span>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Length of Stay (Days)</label>
                <input
                  type="number"
                  min="1"
                  max="14"
                  value={formData.timeInHospital}
                  onChange={(e) => handleInputChange('timeInHospital', parseInt(e.target.value) || 1)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 font-mono font-bold focus:outline-none focus:border-teal-500"
                />
                <span className="text-[10px] text-slate-400 block mt-0.5">1 to 14 days in dataset</span>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Number of Diagnoses</label>
                <input
                  type="number"
                  min="1"
                  max="16"
                  value={formData.numberDiagnoses}
                  onChange={(e) => handleInputChange('numberDiagnoses', parseInt(e.target.value) || 1)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 font-mono font-bold focus:outline-none focus:border-teal-500"
                />
                <span className="text-[10px] text-slate-400 block mt-0.5">Comorbidity index</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs pt-2">
              <div>
                <label className="text-slate-400 block mb-1">Number of Medications</label>
                <input
                  type="number"
                  min="1"
                  max="80"
                  value={formData.numMedications}
                  onChange={(e) => handleInputChange('numMedications', parseInt(e.target.value) || 1)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 font-mono focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Lab Procedures</label>
                <input
                  type="number"
                  min="1"
                  max="130"
                  value={formData.numLabProcedures}
                  onChange={(e) => handleInputChange('numLabProcedures', parseInt(e.target.value) || 1)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 font-mono focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Other Procedures</label>
                <input
                  type="number"
                  min="0"
                  max="6"
                  value={formData.numProcedures}
                  onChange={(e) => handleInputChange('numProcedures', parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 font-mono focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Glycemic Markers & Medication Changes */}
          <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                3. Diabetes Glycemic Status & Medication Management
              </span>
              <span className="text-xs text-teal-400 font-mono">UCI Lab Indicators</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">HbA1c Result</label>
                <select
                  value={formData.a1cResult}
                  onChange={(e) => handleInputChange('a1cResult', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-teal-500"
                >
                  <option value="None">None (Not Measured)</option>
                  <option value="Norm">Normal (&lt;7%)</option>
                  <option value=">7">&gt; 7%</option>
                  <option value=">8">&gt; 8% (Poor Control)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Max Glucose Serum</label>
                <select
                  value={formData.maxGluSerum}
                  onChange={(e) => handleInputChange('maxGluSerum', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-teal-500"
                >
                  <option value="None">None</option>
                  <option value="Norm">Normal</option>
                  <option value=">200">&gt; 200 mg/dL</option>
                  <option value=">300">&gt; 300 mg/dL</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Insulin Titration</label>
                <select
                  value={formData.insulin}
                  onChange={(e) => handleInputChange('insulin', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-teal-500"
                >
                  <option value="No">No Insulin</option>
                  <option value="Steady">Steady Regimen</option>
                  <option value="Up">Increased (Up)</option>
                  <option value="Down">Decreased (Down)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Diabetes Med Change</label>
                <select
                  value={formData.change}
                  onChange={(e) => handleInputChange('change', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-teal-500"
                >
                  <option value="Ch">Ch (Dosage Changed)</option>
                  <option value="No">No (Unchanged)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Model Prediction & SHAP Decomposition (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Main Prediction Score Card */}
          <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800/80 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Predicted 30-Day Readmission Risk
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {result.modelVersion}
              </span>
            </div>

            <div className="mt-4 flex items-baseline justify-between">
              <div>
                <div
                  className={`text-4xl font-extrabold tracking-tight tabular-nums ${
                    isHigh ? 'text-rose-400' : isMod ? 'text-amber-400' : 'text-emerald-400'
                  }`}
                >
                  {(result.prob30d * 100).toFixed(1)}%
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Population Baseline: 11.2% · Priority Score:{' '}
                  <strong className="text-white font-mono">{result.priorityScore}/100</strong>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${
                    isHigh
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      : isMod
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  }`}
                >
                  {result.riskCategory} Risk
                </span>
                <div className="text-[10px] text-slate-400 mt-1">
                  Confidence: {(result.confidence * 100).toFixed(0)}%
                </div>
              </div>
            </div>

            {/* 3-Class Probability Breakdown Bar (Original UCI labels) */}
            <div className="mt-5 pt-4 border-t border-slate-800">
              <div className="flex justify-between text-xs text-slate-300 mb-2 font-medium">
                <span>Original 3-Class Probabilities</span>
                <span className="text-slate-400 font-mono text-[11px]">Σ = 100%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden flex">
                <div
                  title={`<30 Days: ${(result.prob30d * 100).toFixed(1)}%`}
                  className="bg-rose-500 h-full transition-all duration-300"
                  style={{ width: `${result.prob30d * 100}%` }}
                />
                <div
                  title={`>30 Days: ${(result.probOver30d * 100).toFixed(1)}%`}
                  className="bg-amber-500 h-full transition-all duration-300"
                  style={{ width: `${result.probOver30d * 100}%` }}
                />
                <div
                  title={`No Readmission: ${(result.probNo * 100).toFixed(1)}%`}
                  className="bg-emerald-500 h-full transition-all duration-300"
                  style={{ width: `${result.probNo * 100}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 font-mono">
                <span className="text-rose-400 font-semibold">
                  &lt;30d: {(result.prob30d * 100).toFixed(1)}%
                </span>
                <span className="text-amber-400 font-semibold">
                  &gt;30d: {(result.probOver30d * 100).toFixed(1)}%
                </span>
                <span className="text-emerald-400 font-semibold">
                  NO: {(result.probNo * 100).toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Save to History Button */}
            <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={handleSaveToHistory}
                disabled={savedSuccess}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  savedSuccess
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-teal-600 hover:bg-teal-500 text-white'
                }`}
              >
                {savedSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Logged to Prediction History</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save to Prediction History</span>
                  </>
                )}
              </button>

              {savedSuccess && onNavigateToHistory && (
                <button
                  onClick={onNavigateToHistory}
                  className="text-xs text-teal-400 hover:text-teal-300 font-medium transition-colors"
                >
                  View History →
                </button>
              )}
            </div>
          </div>

          {/* SHAP Waterfall Plot */}
          <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800/80 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  SHAP Feature Attribution (Waterfall)
                </h3>
                <p className="text-[11px] text-slate-400">
                  Feature shifts relative to base rate E[f(x)] = 11.2%
                </p>
              </div>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={waterfallData}
                  margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
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
                    formatter={(val: any) => [`${val > 0 ? '+' : ''}${val}% Risk Shift`, 'SHAP Value']}
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

            {/* Plain clinical explanation */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="text-xs font-semibold text-slate-300">Clinical Explanation:</div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {result.shapValues.slice(0, 3).map((s, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    {s.value > 0 ? (
                      <TrendingUp className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                    ) : (
                      <TrendingDown className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    )}
                    <span className="text-[11px] leading-relaxed">
                      <strong className="text-white">{s.displayName}:</strong> {s.explanation}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Decision Support & Follow-up Protocols */}
          <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800/80 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-teal-400 uppercase tracking-wider">
              <Activity className="w-4 h-4 text-teal-400" />
              <span>Suggested Decision Support Actions</span>
            </div>

            <div className="space-y-2">
              {result.suggestedActions.map((action, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-xl bg-slate-800/70 border border-slate-700/70 text-xs text-slate-200 flex items-start gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <span>{action}</span>
                </div>
              ))}
            </div>

            {/* Academic Notice */}
            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
              <span className="font-semibold text-slate-300">Clinical Practice Notice:</span> These suggestions are intended strictly for clinical decision support and care coordination prioritization. They do not constitute an automated medical order or clinical diagnosis.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
