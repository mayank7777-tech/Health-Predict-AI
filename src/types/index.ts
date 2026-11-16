/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AgeGroup =
  | '[0-10)'
  | '[10-20)'
  | '[20-30)'
  | '[30-40)'
  | '[40-50)'
  | '[50-60)'
  | '[60-70)'
  | '[70-80)'
  | '[80-90)'
  | '[90-100)';

export type Gender = 'Male' | 'Female';

export type Race =
  | 'Caucasian'
  | 'AfricanAmerican'
  | 'Hispanic'
  | 'Asian'
  | 'Other';

export type AdmissionType =
  | 'Emergency'
  | 'Urgent'
  | 'Elective'
  | 'Newborn'
  | 'Trauma Center';

export type DischargeDisposition =
  | 'Discharged to home'
  | 'Discharged/transferred to SNF'
  | 'Discharged to home with home health service'
  | 'Transferred to short term general hospital'
  | 'Discharged/transferred to rehab'
  | 'Hospice / Medical facility'
  | 'Left AMA (Against Medical Advice)'
  | 'Other';

export type AdmissionSource =
  | 'Emergency Room'
  | 'Physician Referral'
  | 'Clinic Referral'
  | 'Transfer from hospital'
  | 'Transfer from SNF'
  | 'Other';

export type MedicalSpecialty =
  | 'Cardiology'
  | 'InternalMedicine'
  | 'Emergency/Trauma'
  | 'Family/GeneralPractice'
  | 'Surgery-General'
  | 'Endocrinology'
  | 'Nephrology'
  | 'Neurology'
  | 'Orthopedics'
  | 'Other';

export type GlucoseSerum = 'None' | 'Norm' | '>200' | '>300';
export type A1CResult = 'None' | 'Norm' | '>7' | '>8';
export type MedChange = 'No' | 'Ch';
export type DiabetesMed = 'Yes' | 'No';
export type MedStatus = 'No' | 'Steady' | 'Up' | 'Down';

export type ReadmissionClass = '<30' | '>30' | 'NO';
export type RiskLevel = 'Low' | 'Moderate' | 'High';

export interface ShapContribution {
  feature: string;
  displayName: string;
  value: number; // positive increases risk, negative decreases
  featureValue: string | number;
  explanation: string;
  category: 'clinical' | 'utilization' | 'demographic' | 'medication';
}

export interface PatientVitals {
  heartRate: number;
  bpSystolic: number;
  bpDiastolic: number;
  spO2: number;
  bloodGlucose: number;
}

export interface PatientEncounter {
  id: string; // internal unique key
  patientId: string; // e.g. #P-00412
  encounterId: string; // e.g. #ENC-88219
  patientName: string;
  ageGroup: AgeGroup;
  gender: Gender;
  race: Race;
  admissionType: AdmissionType;
  dischargeDisposition: DischargeDisposition;
  admissionSource: AdmissionSource;
  medicalSpecialty: MedicalSpecialty;
  primaryDiagnosis: string;
  icd9Code: string;
  timeInHospital: number; // 1 to 14
  numLabProcedures: number; // 1 to 132
  numProcedures: number; // 0 to 6
  numMedications: number; // 1 to 81
  numberOutpatient: number;
  numberEmergency: number;
  numberInpatient: number;
  numberDiagnoses: number;
  maxGluSerum: GlucoseSerum;
  a1cResult: A1CResult;
  change: MedChange;
  diabetesMed: DiabetesMed;
  insulin: MedStatus;
  metformin: MedStatus;
  
  // Clinical vitals
  vitals: PatientVitals;
  ward: string;
  attendingPhysician: string;
  admissionDate: string;
  dischargeDate: string;

  // Outcomes and ML predictions
  actualReadmission: ReadmissionClass;
  predictedReadmission: ReadmissionClass;
  readmission30dProb: number; // 0.0 - 1.0
  readmissionOver30dProb: number;
  noReadmissionProb: number;
  riskScore: number; // 0 - 100
  riskCategory: RiskLevel;
  priorityScore: number; // 0 - 100
  priorityRank?: number;
  status: 'Critical' | 'Monitoring' | 'Improving' | 'Stable';
  
  // Explainability
  shapValues: ShapContribution[];
  suggestedActions: string[];
}

export interface ModelMetrics {
  name: string;
  version: string;
  type: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  rocAuc: number;
  prAuc: number;
  confusionMatrix: {
    tp: number;
    fp: number;
    fn: number;
    tn: number;
  };
  multiclassAccuracy: number;
  description: string;
  isProductionBest?: boolean;
}

export interface PredictionHistoryRecord {
  id: string;
  timestamp: string;
  patientId: string;
  encounterId: string;
  patientName: string;
  ageGroup: AgeGroup;
  gender: Gender;
  primaryDiagnosis: string;
  predictedClass: ReadmissionClass;
  prob30d: number;
  probOver30d: number;
  probNo: number;
  riskCategory: RiskLevel;
  riskScore: number;
  modelVersion: string;
  reviewedBy?: string;
  reviewStatus: 'Pending Review' | 'Reviewed & Actioned' | 'Discharge Follow-up Scheduled';
  clinicalNotes?: string;
  topFactors: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'doctor' | 'analyst' | 'admin';
  roleTitle: string;
  department: string;
  avatarInitials: string;
}

export interface RiskThresholds {
  lowMax: number; // e.g. 15%
  moderateMax: number; // e.g. 30%
}
