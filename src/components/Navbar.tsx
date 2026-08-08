import React from 'react';
import { UserRole } from '../types';
import { AuthUser } from './auth/AuthModal';
import {
  Activity,
  AlertTriangle,
  Bell,
  Building2,
  ChevronDown,
  Clock,
  HeartPulse,
  Hospital,
  KeyRound,
  LogOut,
  Shield,
  Stethoscope,
  Truck,
  UserCheck,
  Zap,
} from 'lucide-react';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onTriggerSOS: () => void;
  onOpenWorkflow: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: AuthUser | null;
  onOpenAuthModal: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  onTriggerSOS,
  onOpenWorkflow,
  activeTab,
  setActiveTab,
  currentUser,
  onOpenAuthModal,
  onLogout,
}) => {
  const roles: { role: UserRole; label: string; icon: React.ReactNode; color: string }[] = [
    { role: 'patient', label: 'Patient Portal', icon: <HeartPulse className="w-4 h-4" />, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { role: 'doctor', label: 'Doctor Portal', icon: <Stethoscope className="w-4 h-4" />, color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { role: 'hospital_admin', label: 'Hospital Admin Desk', icon: <Hospital className="w-4 h-4" />, color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    { role: 'ambulance_driver', label: 'Ambulance Driver', icon: <Truck className="w-4 h-4" />, color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { role: 'lab_staff', label: 'Laboratory Staff', icon: <Activity className="w-4 h-4" />, color: 'bg-purple-50 text-purple-700 border-purple-200' },
    { role: 'pharmacy_staff', label: 'Pharmacy & Blood Bank', icon: <Building2 className="w-4 h-4" />, color: 'bg-rose-50 text-rose-700 border-rose-200' },
    { role: 'super_admin', label: 'Super Admin Overview', icon: <Shield className="w-4 h-4" />, color: 'bg-slate-100 text-slate-800 border-slate-300' },
  ];

  const activeRoleObj = roles.find((r) => r.role === currentRole);
  const isSuperAdmin = currentUser?.role === 'super_admin';

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top System Bar */}
      <div className="bg-slate-900 text-slate-200 px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 font-medium text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Ecosystem Connected
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-300 hidden sm:inline">
            PostgreSQL Multi-Member Security Active
          </span>
          <span className="text-slate-500 hidden sm:inline">|</span>
          <button
            onClick={onOpenWorkflow}
            className="hover:text-cyan-300 underline underline-offset-2 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Zap className="w-3 h-3 text-cyan-400" />
            Workflow Diagram
          </button>
        </div>

        <div className="flex items-center gap-2">
          {currentUser ? (
            <div className="flex items-center gap-2">
              <span className="text-slate-300 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                {currentUser.name} ({currentUser.role.toUpperCase()})
              </span>
              <button
                onClick={onLogout}
                className="px-2 py-0.5 bg-slate-800 hover:bg-red-950 hover:text-red-300 text-slate-300 rounded text-[11px] flex items-center gap-1 border border-slate-700 transition-all cursor-pointer font-bold"
              >
                <LogOut className="w-3 h-3" />
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-md text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5" />
              Member Login / Register
            </button>
          )}

          {/* Persona Switch (Only allowed for Super Admin when logged in) */}
          {isSuperAdmin && (
            <>
              <span className="text-slate-600">|</span>
              <div className="relative group">
                <button className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-100 px-2.5 py-1 rounded-md text-xs font-medium border border-slate-700 transition-colors cursor-pointer">
                  {activeRoleObj?.icon}
                  <span className="hidden sm:inline">Switch Role</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>
                <div className="absolute right-0 top-full mt-1 w-64 bg-white rounded-lg shadow-xl border border-slate-200 py-1 hidden group-hover:block z-50 text-slate-800">
                  <div className="px-3 py-1.5 text-[10px] font-semibold tracking-wider text-slate-400 uppercase border-b border-slate-100">
                    Super Admin View Switcher
                  </div>
                  {roles.map((r) => (
                    <button
                      key={r.role}
                      onClick={() => onRoleChange(r.role)}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                        currentRole === r.role ? 'bg-slate-100 font-semibold text-slate-900' : 'text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {r.icon}
                        <span>{r.label}</span>
                      </div>
                      {currentRole === r.role && <UserCheck className="w-3.5 h-3.5 text-emerald-600" />}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main Navbar Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Activity className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-lg tracking-tight">
                  BioMed <span className="text-teal-600">SmartEcosystem</span>
                </span>
                <span className="bg-teal-50 text-teal-700 text-[10px] font-bold px-1.5 py-0.5 rounded border border-teal-200">
                  v2.6
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                National Connected Healthcare Portal
              </p>
            </div>
          </div>

          {/* User Auth Banner Badge */}
          <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-medium bg-slate-50 border-slate-200">
            {currentUser ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-slate-500">Member:</span>
                <span className="font-bold text-slate-900">{currentUser.name}</span>
                <span className="text-emerald-800 font-mono text-[10px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold uppercase">
                  {currentUser.role}
                </span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span className="text-slate-600 font-bold">Unauthenticated Visitor</span>
              </>
            )}
          </div>

          {/* Quick Action Controls */}
          <div className="flex items-center gap-3">
            {/* Login / Auth Button */}
            {!currentUser ? (
              <button
                onClick={onOpenAuthModal}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <KeyRound className="w-4 h-4 text-teal-400" />
                <span>Member Login</span>
              </button>
            ) : (
              <button
                onClick={onLogout}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border border-slate-200"
              >
                <LogOut className="w-4 h-4 text-slate-600" />
                <span>Sign Out</span>
              </button>
            )}

            {/* SOS Button */}
            <button
              onClick={onTriggerSOS}
              className="relative group bg-red-600 hover:bg-red-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-red-600/30 active:scale-95 transition-all cursor-pointer animate-pulse"
              title="Trigger Immediate Emergency SOS Ambulance Dispatch"
            >
              <AlertTriangle className="w-4 h-4 fill-white text-red-600" />
              <span>EMERGENCY SOS</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
