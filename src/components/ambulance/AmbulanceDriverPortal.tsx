import React, { useState } from 'react';
import {
  Activity,
  CheckCircle2,
  Clock,
  Compass,
  MapPin,
  Navigation,
  PhoneCall,
  Radio,
  Truck,
  UserCheck,
} from 'lucide-react';

export const AmbulanceDriverPortal: React.FC = () => {
  const [calloutActive, setCalloutActive] = useState(true);
  const [patientStatus, setPatientStatus] = useState('Patient Onboard - Oxygen Administered');

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/30 text-amber-300 px-3 py-1 rounded-full text-xs font-semibold mb-3">
              <Truck className="w-3.5 h-3.5 text-amber-400" />
              ALS Ambulance Unit #AMB-NY-4091
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ambulance Driver & Paramedic GPS Terminal
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm">
              Driver: Robert Miller • Pre-hospital Emergency Response Unit
            </p>
          </div>

          <div className="flex items-center gap-2 bg-amber-950 text-amber-300 border border-amber-800 px-4 py-2 rounded-2xl text-xs font-bold animate-pulse">
            <Radio className="w-4 h-4 text-amber-400" /> LIVE GPS MESH CONNECTED
          </div>
        </div>
      </div>

      {/* Active Callout Navigation Terminal */}
      <div className="bg-slate-900 rounded-3xl p-6 text-white border border-slate-800 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
              <Navigation className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
                ACTIVE DISPATCH CALLOUT
              </span>
              <h2 className="text-base font-bold text-white">
                Emergency Patient Pickup & ER Transport
              </h2>
            </div>
          </div>
          <span className="bg-red-600 text-white font-black text-xs px-3 py-1 rounded-full">
            ETA: ~6 Mins
          </span>
        </div>

        {/* GPS Map Route Simulation */}
        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-700">
              <span className="text-slate-400 text-[10px] font-bold uppercase block mb-1">
                Pickup Location
              </span>
              <div className="font-bold text-white flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-red-400" />
                Downtown Sector 4, 102 Health Ave
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Patient: Eleanor Vance (64 Y, Female)</div>
            </div>

            <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-700">
              <span className="text-slate-400 text-[10px] font-bold uppercase block mb-1">
                Receiving ER Destination
              </span>
              <div className="font-bold text-white flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-emerald-400" />
                City Central Super Specialty ER
              </div>
              <div className="text-[10px] text-emerald-400 mt-1">ICU Bed #04 Reserved</div>
            </div>
          </div>

          <div className="p-3 bg-slate-900 rounded-xl border border-slate-700 text-xs flex items-center justify-between">
            <span className="text-slate-300">Live Vitals Transmitted to ER Monitor:</span>
            <span className="font-mono font-bold text-emerald-400">BP: 128/84 | SpO2: 96% | HR: 88</span>
          </div>
        </div>

        {/* Paramedic Status Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPatientStatus('Patient Onboard - High-Flow O2 Active')}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 cursor-pointer"
            >
              Update Status: Patient Onboard
            </button>
            <button
              onClick={() => setPatientStatus('Arrived at ER - Handover Complete')}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              Complete Transport
            </button>
          </div>

          <a
            href="tel:+18005550199"
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <PhoneCall className="w-4 h-4" /> Call ER Trauma Desk
          </a>
        </div>
      </div>
    </div>
  );
};
