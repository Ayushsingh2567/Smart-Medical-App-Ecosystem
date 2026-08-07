import React, { useState, useEffect } from 'react';
import {
  Activity,
  AlertCircle,
  BarChart2,
  CheckCircle2,
  Hospital as HospIcon,
  Save,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserCheck,
  Wind,
  XCircle,
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { Hospital, DigitalReferral } from '../../types';

export const HospitalAdminPortal: React.FC = () => {
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [referrals, setReferrals] = useState<DigitalReferral[]>([]);
  const [beds, setBeds] = useState<any>({
    icu: { total: 40, available: 6 },
    ventilator: { total: 20, available: 3 },
    oxygen: { total: 80, available: 14 },
    normal: { total: 150, available: 32 },
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const resHosp = await fetch('/api/hospitals');
      const hosps = await resHosp.json();
      if (hosps.length > 0) {
        setHospital(hosps[0]);
        setBeds(hosps[0].beds);
      }

      const resRef = await fetch('/api/referrals');
      const refs = await resRef.json();
      setReferrals(refs);
    } catch (err) {
      console.error('Error loading admin data:', err);
    }
  };

  const handleSaveBeds = async () => {
    if (!hospital) return;
    try {
      await fetch(`/api/hospitals/${hospital.id}/beds`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ beds }),
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving beds:', err);
    }
  };

  const handleUpdateReferralStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/referrals/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          actor: 'Hospital Admin (City Central)',
          ambulanceAssignedId: 'amb-101',
        }),
      });
      fetchData();
    } catch (err) {
      console.error('Error updating referral:', err);
    }
  };

  const occupancyForecast = [
    { time: '08:00 AM', occupancyPercent: 82 },
    { time: '12:00 PM', occupancyPercent: 88 },
    { time: '04:00 PM', occupancyPercent: 94 },
    { time: '08:00 PM', occupancyPercent: 91 },
    { time: '12:00 AM', occupancyPercent: 85 },
  ];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 px-3 py-1 rounded-full text-xs font-semibold mb-3">
              <HospIcon className="w-3.5 h-3.5 text-indigo-400" />
              City Central Super Specialty Hospital Command Desk
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Hospital Admin & Live Bed Management Desk
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm">
              Real-time ICU/Ventilator bed controls, incoming transfer approval desk, and predictive occupancy analytics.
            </p>
          </div>

          <button
            onClick={handleSaveBeds}
            className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" /> Save Bed Vacancies
          </button>
        </div>
      </div>

      {/* Save Toast */}
      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-3 text-xs text-emerald-900 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span className="font-bold">Bed Vacancies Updated & Broadcasted to Regional Triage Mesh!</span>
        </div>
      )}

      {/* Bed Inventory Adjuster Controls */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-600" />
          Live Bed Capacity & Availability Controls
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* ICU */}
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 space-y-2">
            <span className="font-bold text-red-900 uppercase tracking-wider block">
              ICU Beds
            </span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-500 font-semibold">Available</label>
                <input
                  type="number"
                  value={beds.icu?.available || 0}
                  onChange={(e) =>
                    setBeds({
                      ...beds,
                      icu: { ...beds.icu, available: parseInt(e.target.value) || 0 },
                    })
                  }
                  className="w-full px-2 py-1.5 rounded-lg border border-red-300 bg-white font-bold text-red-900 text-sm"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-semibold">Total Capacity</label>
                <input
                  type="number"
                  value={beds.icu?.total || 0}
                  onChange={(e) =>
                    setBeds({
                      ...beds,
                      icu: { ...beds.icu, total: parseInt(e.target.value) || 0 },
                    })
                  }
                  className="w-full px-2 py-1.5 rounded-lg border border-slate-200 bg-slate-100 font-bold text-slate-700 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Ventilator */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
            <span className="font-bold text-amber-900 uppercase tracking-wider block">
              Ventilator Units
            </span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-500 font-semibold">Available</label>
                <input
                  type="number"
                  value={beds.ventilator?.available || 0}
                  onChange={(e) =>
                    setBeds({
                      ...beds,
                      ventilator: {
                        ...beds.ventilator,
                        available: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full px-2 py-1.5 rounded-lg border border-amber-300 bg-white font-bold text-amber-900 text-sm"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-semibold">Total Capacity</label>
                <input
                  type="number"
                  value={beds.ventilator?.total || 0}
                  onChange={(e) =>
                    setBeds({
                      ...beds,
                      ventilator: {
                        ...beds.ventilator,
                        total: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full px-2 py-1.5 rounded-lg border border-slate-200 bg-slate-100 font-bold text-slate-700 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Oxygen */}
          <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 space-y-2">
            <span className="font-bold text-teal-900 uppercase tracking-wider block">
              Oxygen Beds
            </span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-500 font-semibold">Available</label>
                <input
                  type="number"
                  value={beds.oxygen?.available || 0}
                  onChange={(e) =>
                    setBeds({
                      ...beds,
                      oxygen: { ...beds.oxygen, available: parseInt(e.target.value) || 0 },
                    })
                  }
                  className="w-full px-2 py-1.5 rounded-lg border border-teal-300 bg-white font-bold text-teal-900 text-sm"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-semibold">Total Capacity</label>
                <input
                  type="number"
                  value={beds.oxygen?.total || 0}
                  onChange={(e) =>
                    setBeds({
                      ...beds,
                      oxygen: { ...beds.oxygen, total: parseInt(e.target.value) || 0 },
                    })
                  }
                  className="w-full px-2 py-1.5 rounded-lg border border-slate-200 bg-slate-100 font-bold text-slate-700 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Normal */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="font-bold text-slate-800 uppercase tracking-wider block">
              Normal Wards
            </span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-500 font-semibold">Available</label>
                <input
                  type="number"
                  value={beds.normal?.available || 0}
                  onChange={(e) =>
                    setBeds({
                      ...beds,
                      normal: { ...beds.normal, available: parseInt(e.target.value) || 0 },
                    })
                  }
                  className="w-full px-2 py-1.5 rounded-lg border border-slate-300 bg-white font-bold text-slate-900 text-sm"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-semibold">Total Capacity</label>
                <input
                  type="number"
                  value={beds.normal?.total || 0}
                  onChange={(e) =>
                    setBeds({
                      ...beds,
                      normal: { ...beds.normal, total: parseInt(e.target.value) || 0 },
                    })
                  }
                  className="w-full px-2 py-1.5 rounded-lg border border-slate-200 bg-slate-100 font-bold text-slate-700 text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Incoming Referral Review Desk */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-indigo-600" />
          Incoming Digital Referral Triage Desk ({referrals.length})
        </h2>

        <div className="space-y-4">
          {referrals.map((ref) => (
            <div
              key={ref.id}
              className="p-5 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 text-base">{ref.patientName}</span>
                  <span className="bg-blue-100 text-blue-800 text-xs font-mono font-bold px-2 py-0.5 rounded">
                    {ref.abhaId}
                  </span>
                  <span className="bg-red-100 text-red-800 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                    {ref.urgency}
                  </span>
                </div>
                <p className="text-xs text-slate-600 max-w-xl">{ref.medicalSummary}</p>
                <div className="text-[11px] text-slate-400">
                  Referred by: {ref.referredByDoctor} • Status: <strong className="text-indigo-700">{ref.status}</strong>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    handleUpdateReferralStatus(ref.id, 'APPROVED_BY_RECEIVING_HOSPITAL')
                  }
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <CheckCircle2 className="w-4 h-4" /> Accept & Reserve Bed
                </button>
                <button
                  onClick={() => handleUpdateReferralStatus(ref.id, 'REJECTED')}
                  className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-xs cursor-pointer"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bed Occupancy Demand Forecast Graph */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-indigo-600" />
          AI Bed Demand & Occupancy Forecast (%)
        </h3>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={occupancyForecast}>
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
              <YAxis domain={[50, 100]} stroke="#94a3b8" fontSize={11} />
              <Tooltip formatter={(v) => [`${v}% Occupied`, 'Predictive Bed Load']} />
              <Area type="monotone" dataKey="occupancyPercent" stroke="#4f46e5" fill="#e0e7ff" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
