import React from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Building2,
  HeartPulse,
  Hospital,
  KeyRound,
  Sparkles,
  Stethoscope,
  Truck,
  Zap,
} from 'lucide-react';
import { UserRole } from '../../types';

interface LandingHomePageProps {
  onOpenAuthModal: (role?: UserRole) => void;
  onInstantLogin: (role: UserRole) => void;
  onTriggerSOS: () => void;
}

export const LandingHomePage: React.FC<LandingHomePageProps> = ({
  onOpenAuthModal,
  onInstantLogin,
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
      bgGradient: 'from-emerald-50 to-teal-50 border-emerald-200 hover:border-emerald-400',
    },
    {
      role: 'doctor',
      title: 'Doctor & Physician Portal',
      description: 'Record OPD patient visits, write e-prescriptions, look up past ABHA health records, and dispatch hospital referrals.',
      icon: <Stethoscope className="w-7 h-7 text-blue-500" />,
      badge: 'Clinician Desk',
      bgGradient: 'from-blue-50 to-indigo-50 border-blue-200 hover:border-blue-400',
    },
    {
      role: 'hospital_admin',
      title: 'Hospital ER Bed Desk',
      description: 'Manage ICU, Ventilator, and Oxygen bed capacities in real time with automated emergency triage acceptance.',
      icon: <Hospital className="w-7 h-7 text-indigo-500" />,
      badge: 'ER Bed Control',
      bgGradient: 'from-indigo-50 to-purple-50 border-indigo-200 hover:border-indigo-400',
    },
    {
      role: 'ambulance_driver',
      title: 'Ambulance Driver & SOS',
      description: 'Receive immediate GPS SOS emergency alerts, patient vital updates, and hospital route navigation.',
      icon: <Truck className="w-7 h-7 text-amber-500" />,
      badge: 'Emergency SOS',
      bgGradient: 'from-amber-50 to-orange-50 border-amber-200 hover:border-amber-400',
    },
    {
      role: 'lab_staff',
      title: 'Pathology & Lab Diagnostics',
      description: 'Upload pathology test results, blood counts, metabolic panels, and publish digital lab reports to patient vaults.',
      icon: <Activity className="w-7 h-7 text-purple-500" />,
      badge: 'Lab Workstation',
      bgGradient: 'from-purple-50 to-fuchsia-50 border-purple-200 hover:border-purple-400',
    },
    {
      role: 'pharmacy_staff',
      title: 'Pharmacy & Blood Bank Manager',
      description: 'Monitor blood bag inventory (A+, O+, B-), fulfill doctor e-prescriptions, and manage emergency donor mesh.',
      icon: <Building2 className="w-7 h-7 text-rose-500" />,
      badge: 'Blood & Pharmacy',
      bgGradient: 'from-rose-50 to-pink-50 border-rose-200 hover:border-rose-400',
    },
  ];

  return (
    <div className="space-y-8 py-4">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden border border-slate-800">
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 px-3.5 py-1 rounded-full text-xs font-extrabold">
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            1-Click Instant Login Active • Zero Complexity
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            National Smart Medical <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">App Ecosystem</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Click any portal below to log in instantly, or use standard sign in to access your custom healthcare tools.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <button
              onClick={() => onInstantLogin('patient')}
              className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              1-Click Enter Patient Portal
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onOpenAuthModal()}
              className="px-5 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer border border-slate-700"
            >
              <KeyRound className="w-4 h-4 text-teal-400" />
              Custom Email Login / Register
            </button>

            <button
              onClick={onTriggerSOS}
              className="px-5 py-3.5 bg-red-600/90 hover:bg-red-600 text-white font-bold rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer animate-pulse"
            >
              <AlertTriangle className="w-4 h-4" />
              Emergency SOS
            </button>
          </div>
        </div>
      </div>

      {/* Select Member Login Portal Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Click Any Portal Card for 1-Click Instant Entry</h2>
            <p className="text-xs text-slate-500">No passwords or OTP required for instant testing — click any role below to enter!</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {memberRoles.map((m) => (
            <div
              key={m.role}
              onClick={() => onInstantLogin(m.role)}
              className={`bg-gradient-to-br ${m.bgGradient} p-6 rounded-3xl border shadow-xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between cursor-pointer group`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-white rounded-2xl shadow-xs border border-slate-100">{m.icon}</div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white text-slate-800 border border-slate-200 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-500 fill-amber-500" /> 1-Click Entry
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {m.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">{m.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-extrabold text-slate-900">
                <span className="text-emerald-700 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 fill-emerald-700" /> Enter Portal Instantly
                </span>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
