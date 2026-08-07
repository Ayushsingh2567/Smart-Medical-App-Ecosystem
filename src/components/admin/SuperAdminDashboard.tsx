import React, { useState, useEffect } from 'react';
import { Activity, Hospital, Shield, Sparkles, Truck, Users } from 'lucide-react';
import { AuditLog } from '../../types';

export const SuperAdminDashboard: React.FC = () => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    fetch('/api/audit-logs')
      .then((res) => res.json())
      .then((data) => setAuditLogs(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-slate-700/50 border border-slate-600 text-slate-300 px-3 py-1 rounded-full text-xs font-semibold mb-3">
            <Shield className="w-3.5 h-3.5 text-slate-300" />
            Ecosystem Command & Governance Dashboard
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Super Admin Control Center
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm">
            Monitor network health, AI decision accuracy, bed capacity mesh, and real-time security audit trails.
          </p>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 font-bold uppercase">
            <span>Total Patients</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">14,290</div>
          <div className="text-[10px] text-emerald-600 font-semibold">+12% This Month</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 font-bold uppercase">
            <span>Hospital Mesh</span>
            <Hospital className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">38</div>
          <div className="text-[10px] text-slate-500">Super Specialties</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 font-bold uppercase">
            <span>Active Ambulances</span>
            <Truck className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">112</div>
          <div className="text-[10px] text-amber-600 font-semibold">98.2% Dispatch Readiness</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 font-bold uppercase">
            <span>AI Match Score</span>
            <Sparkles className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">98.4%</div>
          <div className="text-[10px] text-purple-600 font-semibold">Gemini Triage Accuracy</div>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Activity className="w-5 h-5 text-slate-800" />
          System Security & Transfer Audit Logs
        </h2>

        <div className="space-y-2">
          {auditLogs.map((log) => (
            <div
              key={log.id}
              className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div>
                <span className="font-bold text-slate-900">{log.actor}</span>{' '}
                <span className="text-slate-500">[{log.action}]</span> — {log.details}
              </div>
              <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
