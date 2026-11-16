/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar, NavView } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { PatientManagement } from './components/PatientManagement';
import { PatientDetailModal } from './components/PatientDetailModal';
import { RiskAssessment } from './components/RiskAssessment';
import { HighRiskPrioritization } from './components/HighRiskPrioritization';
import { PredictionHistory } from './components/PredictionHistory';
import { ModelPerformance } from './components/ModelPerformance';
import { PopulationAnalytics } from './components/PopulationAnalytics';
import { ReportsView } from './components/ReportsView';
import { SettingsView } from './components/SettingsView';
import { LandingPage } from './components/LandingPage';
import { INITIAL_PATIENT_COHORT } from './data/uciDataset';
import { PatientEncounter } from './types';

function MainAppContent() {
  const [portalMode, setPortalMode] = useState<'clinical' | 'landing'>('clinical');
  const [currentView, setCurrentView] = useState<NavView>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<PatientEncounter | null>(null);
  const [patients, setPatients] = useState<PatientEncounter[]>(INITIAL_PATIENT_COHORT);

  const highRiskCount = patients.filter((p) => p.riskCategory === 'High').length;

  if (portalMode === 'landing') {
    return <LandingPage onEnterApp={() => setPortalMode('clinical')} />;
  }

  const getViewTitle = (view: NavView): string => {
    switch (view) {
      case 'dashboard':
        return 'Cardiology Surveillance Dashboard';
      case 'patients':
        return 'Patient Encounters Directory';
      case 'assessment':
        return 'Individual Patient Risk Assessment';
      case 'prioritization':
        return 'Priority Patient Queue';
      case 'history':
        return 'Prediction History & Audit Logs';
      case 'analytics':
        return 'Population Health Analytics';
      case 'model':
        return 'ML Models & Pipeline Architecture';
      case 'reports':
        return 'Clinical Reports & CSV/PDF Export';
      case 'settings':
        return 'Governance & Risk Thresholds';
      default:
        return 'Hospital Readmission Platform';
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        onSelectView={(v) => setCurrentView(v)}
        onOpenLanding={() => setPortalMode('landing')}
        patientCount={patients.length}
        highRiskCount={highRiskCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header
          searchQuery={searchQuery}
          onSearchChange={(q) => {
            setSearchQuery(q);
            if (q && currentView !== 'patients') {
              setCurrentView('patients');
            }
          }}
          onNewAssessment={() => setCurrentView('assessment')}
          activeViewTitle={getViewTitle(currentView)}
        />

        {/* Dynamic View Viewport */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {currentView === 'dashboard' && (
              <Dashboard
                patients={patients}
                onSelectPatient={(p) => setSelectedPatient(p)}
                onNavigateToPrioritization={() => setCurrentView('prioritization')}
                onNavigateToPatients={() => setCurrentView('patients')}
                onNavigateToAssessment={() => setCurrentView('assessment')}
              />
            )}

            {currentView === 'patients' && (
              <PatientManagement
                patients={patients}
                onSelectPatient={(p) => setSelectedPatient(p)}
                onNewAssessment={() => setCurrentView('assessment')}
              />
            )}

            {currentView === 'assessment' && (
              <RiskAssessment onNavigateToHistory={() => setCurrentView('history')} />
            )}

            {currentView === 'prioritization' && (
              <HighRiskPrioritization
                patients={patients}
                onSelectPatient={(p) => setSelectedPatient(p)}
                onNewAssessment={() => setCurrentView('assessment')}
              />
            )}

            {currentView === 'history' && (
              <PredictionHistory onNewAssessment={() => setCurrentView('assessment')} />
            )}

            {currentView === 'analytics' && <PopulationAnalytics />}

            {currentView === 'model' && <ModelPerformance />}

            {currentView === 'reports' && <ReportsView patients={patients} />}

            {currentView === 'settings' && <SettingsView />}
          </div>
        </main>
      </div>

      {/* Slide-in Patient Detail Modal with SHAP Waterfall */}
      <PatientDetailModal
        patient={selectedPatient}
        onClose={() => setSelectedPatient(null)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
