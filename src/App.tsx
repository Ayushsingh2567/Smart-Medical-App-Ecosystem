import React, { useState, useEffect } from 'react';
import { UserRole } from './types';
import { Navbar } from './components/Navbar';
import { AuthModal, AuthUser } from './components/auth/AuthModal';
import { LandingHomePage } from './components/home/LandingHomePage';
import { HospitalMapModal } from './components/HospitalMapModal';

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

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('patient');
  const [activePatientTab, setActivePatientTab] = useState<string>('dashboard');
  const [showSOSModal, setShowSOSModal] = useState<boolean>(false);
  const [showReferralWorkflowModal, setShowReferralWorkflowModal] = useState<boolean>(false);
  const [showHospitalMapModal, setShowHospitalMapModal] = useState<boolean>(false);

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

  const handleInstantLogin = (role: UserRole) => {
    const roleNames: Record<UserRole, string> = {
      patient: 'Patient Member',
      doctor: 'Dr. Sarah Jenkins, MD',
      hospital_admin: 'City Central ER Admin',
      ambulance_driver: 'Robert Miller (Ambulance)',
      lab_staff: 'Chief Diagnostics Officer',
      pharmacy_staff: 'Central Blood Bank Lead',
      super_admin: 'National Health Authority Admin',
    };

    const user: AuthUser = {
      id: 'user-' + Date.now(),
      email: `${role}@smartmedical.com`,
      name: roleNames[role] || 'Registered Member',
      role,
      abhaId: role === 'patient' ? 'ABHA-9102-4410-8812' : undefined,
      licenseNo: role === 'doctor' ? 'MED-CA-88192' : undefined,
      phone: '+91 98765 43210',
      isEmailVerified: true,
      isPhoneVerified: true,
    };

    setCurrentUser(user);
    setCurrentRole(role);
    localStorage.setItem('biomed_user', JSON.stringify(user));
  };

  const handleOpenAuthForRole = (role?: UserRole) => {
    if (role) setCurrentRole(role);
    setShowAuthModal(true);
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
      {/* Top Navbar */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        onTriggerSOS={() => setShowSOSModal(true)}
        onOpenWorkflow={() => setShowReferralWorkflowModal(true)}
        onOpenHospitalMap={() => setShowHospitalMapModal(true)}
        activeTab={activePatientTab}
        setActiveTab={setActivePatientTab}
        currentUser={currentUser}
        onOpenAuthModal={() => setShowAuthModal(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Unauthenticated Home Page: Only show landing & login options */}
        {!currentUser ? (
          <LandingHomePage
            onOpenAuthModal={handleOpenAuthForRole}
            onInstantLogin={handleInstantLogin}
            onTriggerSOS={() => setShowSOSModal(true)}
          />
        ) : (
          /* Authenticated Authorized Role Views */
          <div>
            {currentUser.role === 'patient' && (
              <div className="space-y-6">
                {/* Patient Sub-Navbar */}
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

                {/* Render Active Patient View */}
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

            {currentUser.role === 'doctor' && <DoctorPortal />}
            {currentUser.role === 'hospital_admin' && <HospitalAdminPortal />}
            {currentUser.role === 'ambulance_driver' && <AmbulanceDriverPortal />}
            {currentUser.role === 'lab_staff' && <LabStaffPortal />}
            {currentUser.role === 'pharmacy_staff' && <PharmacyPortal />}
            {currentUser.role === 'super_admin' && <SuperAdminDashboard />}
          </div>
        )}
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
      {showHospitalMapModal && (
        <HospitalMapModal
          isOpen={showHospitalMapModal}
          onClose={() => setShowHospitalMapModal(false)}
        />
      )}

      {/* Global Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span>
            <span className="font-bold text-slate-800">BioMed SmartEcosystem Engine</span>
          </div>
          <span>Ayushman Bharat Stack • National Healthcare Network</span>
        </div>
      </footer>
    </div>
  );
}
