import React from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Building2,
  CheckCircle2,
  HeartPulse,
  Hospital,
  KeyRound,
  Lock,
  Shield,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Truck,
  UserCheck,
  UserPlus,
} from 'lucide-react';
import { UserRole } from '../../types';

interface LandingHomePageProps {
  onOpenAuthModal: (role?: UserRole) => void;
  onTriggerSOS: () => void;
}

export const LandingHomePage: React.FC<LandingHomePageProps> = ({
  onOpenAuthModal,
  onTriggerSOS,
}) => {
  const memberRoles: Array<{
    role: UserRole;
    title: string;
    description: string;
    icon: React.ReactNode;
    badge: string;
    bgGradient: string;
  }> = [
    {
      role: 'patient',
      title: 'Patient & Citizen Portal',
      description: 'Access AI Symptom Triage, ABHA Health Vault, ICU Bed Finder, Medication Alarms, and Video Doctor Calls.',
      icon: <HeartPulse className="w-7 h-7 text-emerald-500" />,
      badge: 'Patient Vault',
      bgGradient: 'from-emerald-50 to-teal-50 border-emerald-200',
    },
    {
      role: 'doctor',
      title: 'Doctor & Physician Portal',
      description: 'Record OPD patient visits, write e-prescriptions, look up past ABHA health records, and dispatch hospital referrals.',
      icon: <Stethoscope className="w-7 h-7 text-blue-500" />,
      badge: 'Clinician Desk',
      bgGradient: 'from-blue-50 to-indigo-50 border-blue-200',
    },
    {
      role: 'hospital_admin',
      title: 'Hospital ER Bed Desk',
      description: 'Manage ICU, Ventilator, and Oxygen bed capacities in real time with automated emergency triage acceptance.',
      icon: <Hospital className="w-7 h-7 text-indigo-500" />,
      badge: 'ER Bed Control',
      bgGradient: 'from-indigo-50 to-purple-50 border-indigo-200',
    },
    {
      role: 'ambulance_driver',
      title: 'Ambulance Driver & SOS',
      description: 'Receive immediate GPS SOS emergency alerts, patient vital updates, and hospital route navigation.',
      icon: <Truck className="w-7 h-7 text-amber-500" />,
      badge: 'Emergency SOS',
      bgGradient: 'from-amber-50 to-orange-50 border-amber-200',
    },
    {
      role: 'lab_staff',
      title: 'Pathology & Lab Diagnostics',
      description: 'Upload pathology test results, blood counts, metabolic panels, and publish digital lab reports to patient vaults.',
      icon: <Activity className="w-7 h-7 text-purple-500" />,
      badge: 'Lab Workstation',
      bgGradient: 'from-purple-50 to-fuchsia-50 border-purple-200',
    },
    {
      role: 'pharmacy_staff',
      title: 'Pharmacy & Blood Bank Manager',
      description: 'Monitor blood bag inventory (A+, O+, B-), fulfill doctor e-prescriptions, and manage emergency donor mesh.',
      icon: <Building2 className="w-7 h-7 text-rose-500" />,
      badge: 'Blood & Pharmacy',
      bgGradient: 'from-rose-50 to-pink-50 border-rose-200',
    },
  ];

  return (
    <div className="space-y-12 py-4">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden border border-slate-800">
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-400/30 text-teal-300 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            PostgreSQL Verified Authentication • Strict Role-Based Access Control
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            National Smart Medical <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">App Ecosystem</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Please log in or create your member account to access your personalized medical portal. Patients, doctors, hospitals, and medical staff log in securely to access their authorized features.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <button
              onClick={() => onOpenAuthModal('patient')}
              className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              Sign In / Register Account to Enter System
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onTriggerSOS}
              className="px-5 py-3.5 bg-red-600/90 hover:bg-red-600 text-white font-bold rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer animate-pulse"
            >
              <AlertTriangle className="w-4 h-4" />
              Emergency SOS Dispatch
            </button>
          </div>
        </div>
      </div>

      {/* Select Member Login Portal Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Choose Your Account Role to Sign In</h2>
            <p className="text-xs text-slate-500">Each member role grants isolated, secure access to authorized medical tools</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {memberRoles.map((m) => (
            <div
              key={m.role}
              onClick={() => onOpenAuthModal(m.role)}
              className={`bg-gradient-to-br ${m.bgGradient} p-6 rounded-3xl border shadow-xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between cursor-pointer group`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-white rounded-2xl shadow-xs border border-slate-100">{m.icon}</div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white text-slate-800 border border-slate-200">
                    {m.badge}
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {m.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">{m.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-slate-900">
                <span>Sign In / Register</span>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Platform Features Grid */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-xl font-extrabold text-slate-900">Built for Enterprise Healthcare Delivery</h2>
          <p className="text-xs text-slate-500">Fully compliant with ABHA Health Stack, Ayushman Bharat Mesh & PostgreSQL Database</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <Lock className="w-5 h-5 text-emerald-600" />
            <h4 className="font-extrabold text-slate-900">Strict Role Isolation</h4>
            <p className="text-slate-600">Patients cannot view doctor notes or admin controls; doctors access clinical tools securely.</p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <h4 className="font-extrabold text-slate-900">ABHA Health Vault</h4>
            <p className="text-slate-600">End-to-end encrypted medical history, digital e-prescriptions, and OPD consultation logs.</p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <Hospital className="w-5 h-5 text-indigo-600" />
            <h4 className="font-extrabold text-slate-900">Live ICU & Bed Mesh</h4>
            <p className="text-slate-600">Real-time availability of ICU, ventilator, and oxygen beds across regional emergency hospitals.</p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h4 className="font-extrabold text-slate-900">Gemini 3.6 AI Engine</h4>
            <p className="text-slate-600">Intelligent clinical triage, automatic prescription OCR reading, and smart hospital referral matching.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
