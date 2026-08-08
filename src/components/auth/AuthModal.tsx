import React, { useState } from 'react';
import {
  Activity,
  AlertCircle,
  Building2,
  CheckCircle2,
  HeartPulse,
  Hospital,
  KeyRound,
  Lock,
  LogOut,
  Mail,
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
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('patient');
  const [identifier, setIdentifier] = useState('patient@smartmedical.com');
  const [password, setPassword] = useState('patient123');
  const [name, setName] = useState('Alexander Wright');
  const [abhaIdInput, setAbhaIdInput] = useState('ABHA-9102-4410-8812');
  const [licenseInput, setLicenseInput] = useState('MED-CA-88192');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const roleConfigs: Record<
    UserRole,
    { label: string; icon: React.ReactNode; defaultEmail: string; defaultPass: string; defaultName: string }
  > = {
    patient: {
      label: 'Patient / General User',
      icon: <HeartPulse className="w-4 h-4 text-emerald-500" />,
      defaultEmail: 'patient@smartmedical.com',
      defaultPass: 'patient123',
      defaultName: 'Alexander Wright',
    },
    doctor: {
      label: 'Attending Doctor / Physician',
      icon: <Stethoscope className="w-4 h-4 text-blue-500" />,
      defaultEmail: 'dr.sarah@citycentral.org',
      defaultPass: 'doctor123',
      defaultName: 'Dr. Sarah Jenkins, MD',
    },
    hospital_admin: {
      label: 'Hospital ER Bed Admin',
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
      label: 'Pathology & Lab Diagnostics',
      icon: <Activity className="w-4 h-4 text-purple-500" />,
      defaultEmail: 'lab@citydiagnostics.org',
      defaultPass: 'lab123',
      defaultName: 'Chief Diagnostics Officer',
    },
    pharmacy_staff: {
      label: 'Pharmacy & Blood Bank Manager',
      icon: <Building2 className="w-4 h-4 text-rose-500" />,
      defaultEmail: 'pharmacy@medexpress.com',
      defaultPass: 'pharmacy123',
      defaultName: 'Central Blood Bank Lead',
    },
    super_admin: {
      label: 'National Health Super Admin',
      icon: <Shield className="w-4 h-4 text-slate-700" />,
      defaultEmail: 'superadmin@healthmesh.gov',
      defaultPass: 'super123',
      defaultName: 'National Health Authority Admin',
    },
  };

  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role);
    const cfg = roleConfigs[role];
    setIdentifier(cfg.defaultEmail);
    setPassword(cfg.defaultPass);
    setName(cfg.defaultName);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const bodyPayload =
        authMode === 'login'
          ? { identifier, password, role: selectedRole }
          : {
              email: identifier,
              password,
              name,
              role: selectedRole,
              abhaId: selectedRole === 'patient' ? abhaIdInput : undefined,
              licenseNo: selectedRole === 'doctor' ? licenseInput : undefined,
            };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || 'Authentication failed');
      } else if (data.success && data.user) {
        onLoginSuccess(data.user);
        onClose();
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError('Connection failed. Please check backend server.');
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
                Member Portal Authentication
              </h2>
              <p className="text-xs text-slate-500">
                Secure Unified Login for Patients, Doctors & Medical Staff
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

        {/* Role Selector Tabs */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
            Select Member Account Role
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {(Object.keys(roleConfigs) as UserRole[]).map((r) => {
              const cfg = roleConfigs[r];
              const isSelected = selectedRole === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleSelectRole(r)}
                  className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer text-xs ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 font-bold shadow-sm'
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

        {/* Mode Selector */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setAuthMode('login')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              authMode === 'login'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign In (Login)
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('register')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              authMode === 'register'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Create New Account
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {authMode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email / ABHA Health ID / License No.
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="user@smartmedical.com"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>
          </div>

          {authMode === 'register' && selectedRole === 'patient' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ABHA Health ID Number
              </label>
              <input
                type="text"
                value={abhaIdInput}
                onChange={(e) => setAbhaIdInput(e.target.value)}
                placeholder="ABHA-9102-4410-8812"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
              />
            </div>
          )}

          {authMode === 'register' && selectedRole === 'doctor' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Medical License Registration No.
              </label>
              <input
                type="text"
                value={licenseInput}
                onChange={(e) => setLicenseInput(e.target.value)}
                placeholder="MED-CA-88192"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
              />
            </div>
          )}

          {/* Quick Demo Fill Helper */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs flex items-center justify-between">
            <span className="text-slate-600 font-medium">
              Demo account pre-filled for <strong>{roleConfigs[selectedRole].label}</strong>
            </span>
            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
              Ready to Sign In
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            {authMode === 'login' ? <KeyRound className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            {loading ? 'Authenticating...' : authMode === 'login' ? `Sign In as ${roleConfigs[selectedRole].label.split('/')[0]}` : 'Complete Registration'}
          </button>
        </form>
      </div>
    </div>
  );
};
