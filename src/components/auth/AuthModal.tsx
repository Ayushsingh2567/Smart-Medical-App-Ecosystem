import React, { useState } from 'react';
import {
  Activity,
  AlertCircle,
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  HeartPulse,
  Hospital,
  KeyRound,
  Lock,
  LogOut,
  Mail,
  Phone,
  Shield,
  Stethoscope,
  Truck,
  User,
  UserCheck,
  UserPlus,
} from 'lucide-react';
import { UserRole } from '../../types';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  abhaId?: string;
  licenseNo?: string;
  hospitalId?: string;
  phone?: string;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AuthUser) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [authMode, setAuthMode] = useState<'register' | 'login'>('register');
  const [selectedRole, setSelectedRole] = useState<UserRole>('patient');
  
  // Real Form States
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [customAbha, setCustomAbha] = useState('');
  const [customLicense, setCustomLicense] = useState('');
  const [showDemoOptions, setShowDemoOptions] = useState(false);
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const roleConfigs: Record<
    UserRole,
    { label: string; icon: React.ReactNode; defaultEmail: string; defaultPass: string; defaultName: string }
  > = {
    patient: {
      label: 'Patient / Citizen Member',
      icon: <HeartPulse className="w-4 h-4 text-emerald-500" />,
      defaultEmail: 'patient@smartmedical.com',
      defaultPass: 'patient123',
      defaultName: 'Alexander Wright',
    },
    doctor: {
      label: 'Doctor / Physician',
      icon: <Stethoscope className="w-4 h-4 text-blue-500" />,
      defaultEmail: 'dr.sarah@citycentral.org',
      defaultPass: 'doctor123',
      defaultName: 'Dr. Sarah Jenkins, MD',
    },
    hospital_admin: {
      label: 'Hospital ER Admin',
      icon: <Hospital className="w-4 h-4 text-indigo-500" />,
      defaultEmail: 'admin@citycentral.org',
      defaultPass: 'admin123',
      defaultName: 'City Central ER Admin',
    },
    ambulance_driver: {
      label: 'Ambulance Driver & SOS',
      icon: <Truck className="w-4 h-4 text-amber-500" />,
      defaultEmail: 'driver.robert@citycentral.org',
      defaultPass: 'driver123',
      defaultName: 'Robert Miller',
    },
    lab_staff: {
      label: 'Pathology & Lab Staff',
      icon: <Activity className="w-4 h-4 text-purple-500" />,
      defaultEmail: 'lab@citydiagnostics.org',
      defaultPass: 'lab123',
      defaultName: 'Chief Diagnostics Officer',
    },
    pharmacy_staff: {
      label: 'Pharmacy & Blood Bank',
      icon: <Building2 className="w-4 h-4 text-rose-500" />,
      defaultEmail: 'pharmacy@medexpress.com',
      defaultPass: 'pharmacy123',
      defaultName: 'Central Blood Bank Lead',
    },
    super_admin: {
      label: 'Super Administrator',
      icon: <Shield className="w-4 h-4 text-slate-700" />,
      defaultEmail: 'superadmin@healthmesh.gov',
      defaultPass: 'super123',
      defaultName: 'National Health Authority Admin',
    },
  };

  const handleSelectDemoUser = (role: UserRole) => {
    setSelectedRole(role);
    const cfg = roleConfigs[role];
    setEmailInput(cfg.defaultEmail);
    setPasswordInput(cfg.defaultPass);
    setNameInput(cfg.defaultName);
    setAuthMode('login');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!emailInput || !passwordInput) {
      setError('Please fill in your email and password');
      return;
    }

    if (authMode === 'register' && !nameInput) {
      setError('Please enter your full name');
      return;
    }

    setLoading(true);

    try {
      const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const bodyPayload =
        authMode === 'login'
          ? { identifier: emailInput, password: passwordInput, role: selectedRole }
          : {
              email: emailInput,
              password: passwordInput,
              name: nameInput,
              role: selectedRole,
              phone: phoneInput,
              abhaId: selectedRole === 'patient' ? customAbha || undefined : undefined,
              licenseNo: selectedRole === 'doctor' ? customLicense || undefined : undefined,
            };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || 'Authentication failed. Please check credentials.');
      } else if (data.success && data.user) {
        // Save real session token to localStorage
        localStorage.setItem('biomed_user', JSON.stringify(data.user));
        localStorage.setItem('biomed_token', data.token);

        onLoginSuccess(data.user);
        onClose();
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError('Connection error. Could not connect to authentication server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 my-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-teal-500 text-white flex items-center justify-center shadow-md">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">
                {authMode === 'register' ? 'Create Real Account' : 'Member Sign In'}
              </h2>
              <p className="text-xs text-slate-500">
                Smart Medical Ecosystem • PostgreSQL Verified Authentication
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-800 font-bold text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Auth Mode Toggle */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => {
              setAuthMode('register');
              setError('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              authMode === 'register'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5 inline mr-1" />
            Create Real Account (Sign Up)
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('login');
              setError('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              authMode === 'login'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5 inline mr-1" />
            Existing User Sign In
          </button>
        </div>

        {/* Role Selection */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
            Account Role
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {(Object.keys(roleConfigs) as UserRole[]).map((r) => {
              const cfg = roleConfigs[r];
              const isSelected = selectedRole === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setSelectedRole(r);
                    setError('');
                  }}
                  className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer text-xs ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {cfg.icon}
                  <span className="truncate">{cfg.label.split('/')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {authMode === 'register' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email Address * {authMode === 'login' && '(or ABHA ID / License No.)'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="your.email@domain.com"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Account Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Create a strong password"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>
          </div>

          {authMode === 'register' && selectedRole === 'patient' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ABHA Health ID (Optional – auto-generated if left blank)
              </label>
              <input
                type="text"
                value={customAbha}
                onChange={(e) => setCustomAbha(e.target.value)}
                placeholder="e.g. ABHA-9102-4410-8812"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
              />
            </div>
          )}

          {authMode === 'register' && selectedRole === 'doctor' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Medical License Number (Optional – auto-generated if left blank)
              </label>
              <input
                type="text"
                value={customLicense}
                onChange={(e) => setCustomLicense(e.target.value)}
                placeholder="e.g. MED-CA-88192"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {authMode === 'register' ? <UserPlus className="w-4 h-4" /> : <KeyRound className="w-4 h-4" />}
            {loading
              ? 'Processing...'
              : authMode === 'register'
              ? `Register Real Account as ${roleConfigs[selectedRole].label.split('/')[0]}`
              : `Sign In as ${roleConfigs[selectedRole].label.split('/')[0]}`}
          </button>
        </form>

        {/* Accordion helper for Quick Demo Testing */}
        <div className="pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setShowDemoOptions(!showDemoOptions)}
            className="text-[11px] font-bold text-slate-500 hover:text-slate-800 flex items-center justify-between w-full cursor-pointer py-1"
          >
            <span>Need quick demo credentials to test roles?</span>
            {showDemoOptions ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showDemoOptions && (
            <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs">
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                Click any demo persona to auto-fill test credentials:
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {(Object.keys(roleConfigs) as UserRole[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => handleSelectDemoUser(r)}
                    className="p-1.5 text-[11px] bg-white rounded border border-slate-200 hover:border-emerald-400 text-left font-semibold text-slate-700 truncate cursor-pointer"
                  >
                    ⚡ {roleConfigs[r].label.split('/')[0]}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
