/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, RiskThresholds, PredictionHistoryRecord } from '../types';

interface AuthContextType {
  currentUser: UserProfile;
  switchRole: (role: 'doctor' | 'analyst' | 'admin') => void;
  thresholds: RiskThresholds;
  updateThresholds: (thresholds: RiskThresholds) => void;
  predictionHistory: PredictionHistoryRecord[];
  addPredictionHistory: (record: Omit<PredictionHistoryRecord, 'id' | 'timestamp'>) => void;
  updatePredictionStatus: (id: string, status: PredictionHistoryRecord['reviewStatus'], notes?: string) => void;
  clearHistory: () => void;
}

const DEMO_USERS: Record<'doctor' | 'analyst' | 'admin', UserProfile> = {
  doctor: {
    id: 'usr-doc-01',
    name: 'Dr. Rivera',
    email: 'm.rivera@metrohealth.org',
    role: 'doctor',
    roleTitle: 'Cardiologist',
    department: 'Ward 4B — Cardiology',
    avatarInitials: 'DR'
  },
  analyst: {
    id: 'usr-ana-02',
    name: 'Elena Chen, MPH',
    email: 'e.chen@metrohealth.org',
    role: 'analyst',
    roleTitle: 'Healthcare Analyst',
    department: 'Clinical Quality & Analytics',
    avatarInitials: 'EC'
  },
  admin: {
    id: 'usr-adm-03',
    name: 'Marcus Vance, MBA',
    email: 'm.vance@metrohealth.org',
    role: 'admin',
    roleTitle: 'Chief Operations Officer',
    department: 'Hospital Administration',
    avatarInitials: 'MV'
  }
};

const INITIAL_HISTORY: PredictionHistoryRecord[] = [
  {
    id: 'pred-hist-101',
    timestamp: '2026-03-17 09:42',
    patientId: '#P-00412',
    encounterId: '#ENC-88219',
    patientName: 'Marcus Vance',
    ageGroup: '[70-80)',
    gender: 'Male',
    primaryDiagnosis: 'Atrial Fibrillation',
    predictedClass: '<30',
    prob30d: 0.84,
    probOver30d: 0.11,
    probNo: 0.05,
    riskCategory: 'High',
    riskScore: 84,
    modelVersion: 'XGBoost v2.4-tuned',
    reviewedBy: 'Dr. Rivera',
    reviewStatus: 'Discharge Follow-up Scheduled',
    clinicalNotes: 'Assigned 48-hour post-discharge nurse call and cardiology follow-up on Day 5. Discharge to SNF confirmed.',
    topFactors: ['3 Prior Inpatient Admissions (+42% risk)', 'Discharge to SNF (+7.8% risk)', 'Uncontrolled HbA1c >8% (+4.8% risk)']
  },
  {
    id: 'pred-hist-102',
    timestamp: '2026-03-17 08:15',
    patientId: '#P-00308',
    encounterId: '#ENC-87941',
    patientName: 'Roberto Morales',
    ageGroup: '[60-70)',
    gender: 'Male',
    primaryDiagnosis: 'Hypertensive Crisis',
    predictedClass: '<30',
    prob30d: 0.62,
    probOver30d: 0.24,
    probNo: 0.14,
    riskCategory: 'High',
    riskScore: 62,
    modelVersion: 'XGBoost v2.4-tuned',
    reviewedBy: 'Dr. Rivera',
    reviewStatus: 'Reviewed & Actioned',
    clinicalNotes: 'Home health transition nurse assigned. Blood pressure titration protocol communicated.',
    topFactors: ['2 Prior Inpatient Admissions (+28% risk)', 'Home Health Transition (+3.8% risk)', 'HbA1c >8% with Med Adjustment (+4.8% risk)']
  },
  {
    id: 'pred-hist-103',
    timestamp: '2026-03-16 16:30',
    patientId: '#P-00219',
    encounterId: '#ENC-86512',
    patientName: 'Amara Okafor',
    ageGroup: '[50-60)',
    gender: 'Female',
    primaryDiagnosis: 'Heart Failure (CHF)',
    predictedClass: '>30',
    prob30d: 0.28,
    probOver30d: 0.42,
    probNo: 0.30,
    riskCategory: 'Moderate',
    riskScore: 28,
    modelVersion: 'XGBoost v2.4-tuned',
    reviewedBy: 'Dr. Rivera',
    reviewStatus: 'Reviewed & Actioned',
    clinicalNotes: 'Cardiac rehab referral provided. Target follow-up at 14 days in heart failure clinic.',
    topFactors: ['1 Prior Inpatient Visit (+14% risk)', 'Controlled HbA1c (-3.9% risk)', 'Routine Discharge Home (-3.1% risk)']
  },
  {
    id: 'pred-hist-104',
    timestamp: '2026-03-16 14:10',
    patientId: '#P-00104',
    encounterId: '#ENC-85190',
    patientName: 'James Henderson',
    ageGroup: '[40-50)',
    gender: 'Male',
    primaryDiagnosis: 'Coronary Atherosclerosis',
    predictedClass: 'NO',
    prob30d: 0.08,
    probOver30d: 0.22,
    probNo: 0.70,
    riskCategory: 'Low',
    riskScore: 8,
    modelVersion: 'XGBoost v2.4-tuned',
    reviewedBy: 'Dr. Patel',
    reviewStatus: 'Reviewed & Actioned',
    clinicalNotes: 'Elective coronary stent patient. Normal glucose control and no prior admissions. Standard discharge protocol.',
    topFactors: ['Zero Prior Inpatient Stays (-2.5% risk)', 'Elective Admission (-4.4% risk)', 'Routine Discharge Home (-3.1% risk)']
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('hp_user_role');
    if (saved && (saved === 'doctor' || saved === 'analyst' || saved === 'admin')) {
      return DEMO_USERS[saved];
    }
    return DEMO_USERS.doctor;
  });

  const [thresholds, setThresholds] = useState<RiskThresholds>(() => {
    const saved = localStorage.getItem('hp_risk_thresholds');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return { lowMax: 0.15, moderateMax: 0.30 };
  });

  const [predictionHistory, setPredictionHistory] = useState<PredictionHistoryRecord[]>(() => {
    const saved = localStorage.getItem('hp_pred_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_HISTORY;
  });

  useEffect(() => {
    localStorage.setItem('hp_user_role', currentUser.role);
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('hp_risk_thresholds', JSON.stringify(thresholds));
  }, [thresholds]);

  useEffect(() => {
    localStorage.setItem('hp_pred_history', JSON.stringify(predictionHistory));
  }, [predictionHistory]);

  const switchRole = (role: 'doctor' | 'analyst' | 'admin') => {
    setCurrentUser(DEMO_USERS[role]);
  };

  const updateThresholds = (newThresholds: RiskThresholds) => {
    setThresholds(newThresholds);
  };

  const addPredictionHistory = (record: Omit<PredictionHistoryRecord, 'id' | 'timestamp'>) => {
    const newEntry: PredictionHistoryRecord = {
      ...record,
      id: `pred-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      reviewedBy: currentUser.name
    };
    setPredictionHistory((prev) => [newEntry, ...prev]);
  };

  const updatePredictionStatus = (
    id: string,
    status: PredictionHistoryRecord['reviewStatus'],
    notes?: string
  ) => {
    setPredictionHistory((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              reviewStatus: status,
              clinicalNotes: notes !== undefined ? notes : item.clinicalNotes,
              reviewedBy: currentUser.name
            }
          : item
      )
    );
  };

  const clearHistory = () => {
    setPredictionHistory([]);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        switchRole,
        thresholds,
        updateThresholds,
        predictionHistory,
        addPredictionHistory,
        updatePredictionStatus,
        clearHistory
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
