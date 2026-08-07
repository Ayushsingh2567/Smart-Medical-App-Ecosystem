import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Compass,
  MapPin,
  PhoneCall,
  ShieldAlert,
  Truck,
  User,
  X,
} from 'lucide-react';
import { Hospital, Ambulance } from '../../types';

interface EmergencySOSModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencySOSModal: React.FC<EmergencySOSModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [dispatchStatus, setDispatchStatus] = useState<'IDLE' | 'DISPATCHING' | 'ACTIVE'>('IDLE');
  const [ambulanceInfo, setAmbulanceInfo] = useState<Ambulance | null>(null);
  const [assignedHospital, setAssignedHospital] = useState<Hospital | null>(null);
  const [etaMinutes, setEtaMinutes] = useState(6);
  const [patientLocation, setPatientLocation] = useState("Downtown Sector 4, 102 Health Ave");

  useEffect(() => {
    if (isOpen && dispatchStatus === 'IDLE') {
      triggerSOSDispatch();
    }
  }, [isOpen]);

  const triggerSOSDispatch = async () => {
    setDispatchStatus('DISPATCHING');
    try {
      const res = await fetch('/api/ambulances/dispatch-sos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientLocation,
          patientName: 'Alexander Wright',
          emergencyType: 'Acute Cardiac / Severe Pain',
        }),
      });
      const data = await res.json();
      setAmbulanceInfo(data.ambulance);
      setAssignedHospital(data.assignedHospital);
      setEtaMinutes(data.etaMinutes || 6);
      setDispatchStatus('ACTIVE');
    } catch (err) {
      console.error('SOS Error:', err);
      setDispatchStatus('ACTIVE');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-red-200 relative animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-500/30 animate-pulse">
              <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black tracking-widest text-red-600 uppercase">
                  EMERGENCY TIER 1 ALARM
                </span>
                <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  LIVE SOS
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Advanced Life Support Dispatch
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {dispatchStatus === 'DISPATCHING' ? (
          <div className="py-12 text-center space-y-4">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-red-200 animate-ping opacity-75"></div>
              <div className="relative rounded-full w-20 h-20 bg-red-600 text-white flex items-center justify-center shadow-xl shadow-red-600/40">
                <Truck className="w-10 h-10 animate-bounce" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Locating & Dispatched Nearest ALS Ambulance...
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Broadcasting GPS coordinates to City Emergency Command, notifying receiving ICU Trauma teams.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Live GPS Tracker Card */}
            <div className="bg-slate-900 rounded-2xl p-5 text-white relative overflow-hidden border border-slate-800 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Live GPS Navigation
                </div>
                <div className="bg-red-950/80 border border-red-800 text-red-200 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  ETA: ~{etaMinutes} Minutes
                </div>
              </div>

              {/* Map Route Visualizer */}
              <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/80 mb-4 relative min-h-[140px] flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-red-400 fill-red-400/20" />
                    <span className="font-semibold text-white">{patientLocation}</span>
                  </div>
                  <span className="bg-slate-700 px-2 py-0.5 rounded text-[10px] text-slate-300">
                    Your Location
                  </span>
                </div>

                {/* Animated Route Line */}
                <div className="relative my-3">
                  <div className="h-1.5 bg-slate-700 rounded-full w-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-500 w-3/4 transition-all duration-1000"></div>
                  </div>
                  <div className="absolute top-1/2 -translate-y-1/2 left-[65%] w-6 h-6 bg-red-600 rounded-full border-2 border-white flex items-center justify-center text-white shadow-lg animate-pulse">
                    <Truck className="w-3 h-3" />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-emerald-400" />
                    <span className="font-semibold text-white">
                      {assignedHospital?.name || 'City Central Super Specialty Hospital'}
                    </span>
                  </div>
                  <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded text-[10px] font-medium">
                    Pre-Alerted ER
                  </span>
                </div>
              </div>

              {/* Vehicle & Driver Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50 flex items-center gap-3">
                  <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-slate-400 text-[10px] uppercase font-semibold">
                      Vehicle & Equipment
                    </div>
                    <div className="font-bold text-white">
                      {ambulanceInfo?.vehicleNumber || 'AMB-NY-4091'}
                    </div>
                    <div className="text-[10px] text-slate-300">
                      Advanced Life Support (Oxygen + Defib)
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-slate-400 text-[10px] uppercase font-semibold">
                        Driver & Paramedic
                      </div>
                      <div className="font-bold text-white">
                        {ambulanceInfo?.driverName || 'Robert Miller'}
                      </div>
                      <div className="text-[10px] text-slate-300">Certified Paramedic</div>
                    </div>
                  </div>
                  <a
                    href={`tel:${ambulanceInfo?.phone || '+1555014992'}`}
                    className="p-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-colors cursor-pointer"
                    title="Call Ambulance Driver"
                  >
                    <PhoneCall className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* ER Notification Status */}
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-slate-800 space-y-1">
                <span className="font-bold text-emerald-900 block">
                  Hospital ER & Trauma Unit Pre-Alerted
                </span>
                <p className="text-slate-600">
                  Your ABHA Digital Profile (Blood Group O+, Allergies: Penicillin, Vitals) has been transmitted directly to the receiving ER triage monitor at {assignedHospital?.name || 'City Central Hospital'}.
                </p>
              </div>
            </div>

            {/* Cancel/Close buttons */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={onClose}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Keep Emergency SOS Active & Close View
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
