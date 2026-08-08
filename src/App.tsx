import React, { useState, useEffect } from 'react';
import { UserRole } from './types';
import { Navbar } from './components/Navbar';
import { AuthModal, AuthUser } from './components/auth/AuthModal';

// Patient View Components
import { PatientDashboard } from './components/patient/PatientDashboard';
import { SymptomChecker } from './components/patient/SymptomChecker';
import { RiskPrediction } from './components/patient/RiskPrediction';
import { BedAvailability } from './components/patient/BedAvailability';
import { MedicineManager } from './components/patient/MedicineManager';
import { HealthRecordsVault } from './components/patient/HealthRecordsVault';
import { DoctorConsultation } from './components/patient/DoctorConsultation';
import { BloodAndOrganPortal } from './components/patient/BloodAndOrganPortal';
import { AIChatbot } from './components/patient/AIChatbot';
import { EmergencySOSModal } from './components/patient/EmergencySOSModal';

// Role Portal Components
import { DoctorPortal } from './components/doctor/DoctorPortal';
import { HospitalAdminPortal } from './components/hospital/HospitalAdminPortal';
import { AmbulanceDriverPortal } from './components/ambulance/AmbulanceDriverPortal';
import { LabStaffPortal } from './components/lab/LabStaffPortal';
import { PharmacyPortal } from './components/pharmacy/PharmacyPortal';
import { SuperAdminDashboard } from './components/admin/SuperAdminDashboard';

// Workflow Modal
import { ReferralWorkflowModal } from './components/ReferralWorkflowModal';
import { UserCheck, KeyRound } from 'lucide-react';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('patient');
  const [activePatientTab, setActivePatientTab] = useState<string>('dashboard');
  const [showSOSModal, setShowSOSModal] = useState<boolean>(false);
  const [showReferralWorkflowModal, setShowReferralWorkflowModal] = useState<boolean>(false);

  // Authentication State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  // Load real authenticated user session from localStorage on initial render
  useEffect(() => {
    const savedUser = localStorage.getItem('biomed_user');
    if (savedUser) {
      try {
        const user: AuthUser = JSON.parse(savedUser);
        setCurrentUser(user);
        setCurrentRole(user.role);
      } catch (err) {
        console.error('Error parsing stored user session:', err);
      }
    }
  }, []);

  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    setCurrentRole(user.role);
    localStorage.setItem('biomed_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('biomed_user');
    localStorage.removeItem('biomed_token');
  };

  // Tab Navigation items for Patient view
  const patientTabs = [
    { id: 'dashboard', label: 'Overview' },
    { id: 'symptoms', label: 'AI Triage' },
    { id: 'risk', label: 'Risk Analytics' },
    { id: 'beds', label: 'ICU / Bed Finder' },
    { id: 'medicines', label: 'Medicine / OCR' },
    { id: 'records', label: 'ABHA Health Vault' },
    { id: 'consultation', label: 'Doctor & Video' },
    { id: 'blood_organ', label: 'Blood & Organ Mesh' },
    { id: 'ai_chat', label: 'BioMed AI Chat' },
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col">
      {/* Top Navbar with Role Switching and Modal Triggers */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        onTriggerSOS={() => setShowSOSModal(true)}
        onOpenWorkflow={() => setShowReferralWorkflowModal(true)}
        activeTab={activePatientTab}
        setActiveTab={setActivePatientTab}
        currentUser={currentUser}
        onOpenAuthModal={() => setShowAuthModal(true)}
        onLogout={handleLogout}
      />

      {/* Real User Unauthenticated Banner Prompt */}
      {!currentUser && (
        <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-900 text-white px-4 py-3 border-b border-teal-500/30">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-teal-500/20 rounded-lg text-teal-400 font-bold">
                <UserCheck className="w-4 h-4" />
              </span>
              <span>
                <strong>Welcome to BioMed SmartEcosystem!</strong> Create your real account or sign in to save your ABHA Health Vault & OPD consultations in PostgreSQL.
              </span>
            </div>
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-xl shadow-md transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5"
            >
              <KeyRound className="w-3.5 h-3.5" />
              Register / Sign In Now
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Render role-specific portal */}
        {currentRole === 'patient' && (
          <div className="space-y-6">
            {/* Patient Secondary Sub-Navbar */}
            <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs overflow-x-auto flex items-center gap-1.5 no-scrollbar">
              {patientTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActivePatientTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    activePatientTab === tab.id
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Render Active Patient Tab View */}
            {activePatientTab === 'dashboard' && (
              <PatientDashboard
                onTriggerSOS={() => setShowSOSModal(true)}
                setActiveTab={setActivePatientTab}
              />
            )}
            {activePatientTab === 'symptoms' && <SymptomChecker />}
            {activePatientTab === 'risk' && <RiskPrediction />}
            {activePatientTab === 'beds' && <BedAvailability />}
            {activePatientTab === 'medicines' && <MedicineManager />}
            {activePatientTab === 'records' && <HealthRecordsVault />}
            {activePatientTab === 'consultation' && <DoctorConsultation />}
            {activePatientTab === 'blood_organ' && <BloodAndOrganPortal />}
            {activePatientTab === 'ai_chat' && <AIChatbot />}
          </div>
        )}

        {currentRole === 'doctor' && <DoctorPortal />}
        {currentRole === 'hospital_admin' && <HospitalAdminPortal />}
        {currentRole === 'ambulance_driver' && <AmbulanceDriverPortal />}
        {currentRole === 'lab_staff' && <LabStaffPortal />}
        {currentRole === 'pharmacy_staff' && <PharmacyPortal />}
        {currentRole === 'super_admin' && <SuperAdminDashboard />}
      </main>

      {/* Modals */}
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
      {showSOSModal && <EmergencySOSModal onClose={() => setShowSOSModal(false)} />}
      {showReferralWorkflowModal && (
        <ReferralWorkflowModal
          isOpen={showReferralWorkflowModal}
          onClose={() => setShowReferralWorkflowModal(false)}
        />
      )}

      {/* Global Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span>
            <span className="font-bold text-slate-800">Smart Medical Ecosystem Engine</span>
          </div>
          <span>Powered by Gemini 3.6 • Real Member Registration & PostgreSQL Stack</span>
        </div>
      </footer>
    </div>
  );
}
