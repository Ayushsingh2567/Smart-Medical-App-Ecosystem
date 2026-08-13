import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Compass,
  FileText,
  HeartPulse,
  Hospital,
  MapPin,
  Navigation,
  PhoneCall,
  Radio,
  Send,
  ShieldCheck,
  Stethoscope,
  Truck,
  User,
  UserCheck,
} from 'lucide-react';

interface EmergencyDispatchCall {
  id: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  patientPhone: string;
  pickupAddress: string;
  destinationHospital: string;
  urgency: 'CRITICAL' | 'HIGH' | 'ROUTINE';
  conditionSummary: string;
  vitals: {
    bp: string;
    pulse: number;
    spO2: number;
  };
  etaMinutes: number;
  status: 'DISPATCHED' | 'EN_ROUTE_PICKUP' | 'PATIENT_ONBOARD' | 'ARRIVED_AT_ER' | 'COMPLETED';
}

export const AmbulanceDriverPortal: React.FC = () => {
  const [driverDuty, setDriverDuty] = useState(true);
  const [activeCall, setActiveCall] = useState<EmergencyDispatchCall>({
    id: 'SOS-CALL-8849',
    patientName: 'Eleanor Vance',
    patientAge: 64,
    patientGender: 'Female',
    patientPhone: '+91 98000 12345',
    pickupAddress: 'Flat 402, Green Avenue, Downtown Sector 4',
    destinationHospital: 'City Central Super Specialty Hospital (ICU Bed #04 Reserved)',
    urgency: 'CRITICAL',
    conditionSummary: 'Acute Chest Pain, Dyspnea, High Cardiovascular Risk',
    vitals: { bp: '135/88', pulse: 92, spO2: 94 },
    etaMinutes: 6,
    status: 'EN_ROUTE_PICKUP',
  });

  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [statusUpdateToast, setStatusUpdateToast] = useState('');

  const handleUpdateStatus = (newStatus: EmergencyDispatchCall['status'], message: string) => {
    setActiveCall((prev) => ({
      ...prev,
      status: newStatus,
      etaMinutes: newStatus === 'PATIENT_ONBOARD' ? 10 : newStatus === 'ARRIVED_AT_ER' ? 0 : prev.etaMinutes,
    }));
    setStatusUpdateToast(message);
    setTimeout(() => setStatusUpdateToast(''), 6000);
  };

  return (
    <div className="space-y-6">
      {/* Driver Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/30 text-amber-300 px-3 py-1 rounded-full text-xs font-semibold mb-3">
            <Truck className="w-3.5 h-3.5 text-amber-400" />
            ALS Emergency Ambulance Unit #AMB-ALS-9102
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Ambulance Driver & Paramedic Command Terminal
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm">
            Driver: <strong>Robert Miller</strong> • Live Emergency Dispatch, Patient Vitals & GPS Navigation Mesh
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setDriverDuty(!driverDuty)}
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${
              driverDuty
                ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            <Radio className="w-4 h-4 animate-pulse" />
            {driverDuty ? 'ON DUTY (LIVE SOS ACTIVE)' : 'OFF DUTY'}
          </button>
        </div>
      </div>

      {/* Status Toast */}
      {statusUpdateToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-3 text-xs text-emerald-900 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-bold">{statusUpdateToast}</span>
        </div>
      )}

      {/* Active Dispatch Terminal */}
      <div className="bg-slate-900 rounded-3xl p-6 text-white border border-slate-800 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shrink-0">
              <Navigation className="w-6 h-6 animate-spin" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
                  ACTIVE DISPATCH CALL #{activeCall.id}
                </span>
                <span className="bg-red-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full uppercase">
                  {activeCall.urgency} SEVERITY
                </span>
              </div>
              <h2 className="text-base font-extrabold text-white">
                Emergency Patient Pickup & Live Hospital Transport
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 px-4 py-2 rounded-2xl text-xs">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Live ETA to Destination: <strong className="text-amber-400 font-mono text-sm">{activeCall.etaMinutes} Mins</strong></span>
          </div>
        </div>

        {/* Patient Details & Pickup Location Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Box 1: Patient Information */}
          <div className="bg-slate-800/90 p-5 rounded-2xl border border-slate-700 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-700/80 pb-2">
              <span className="font-bold text-amber-400 flex items-center gap-1.5 text-sm">
                <User className="w-4 h-4 text-amber-400" />
                Patient Personal Details
              </span>
              <button
                onClick={() => setShowHistoryModal(true)}
                className="text-[11px] text-teal-400 hover:underline font-bold cursor-pointer"
              >
                View ABHA History & Allergies
              </button>
            </div>

            <div className="space-y-1.5 text-slate-200">
              <p className="text-sm font-extrabold text-white">{activeCall.patientName} ({activeCall.patientAge} Y, {activeCall.patientGender})</p>
              <p><strong>Contact Phone:</strong> <a href={`tel:${activeCall.patientPhone}`} className="text-cyan-300 underline font-mono font-bold">{activeCall.patientPhone}</a></p>
              <p className="text-red-300 font-medium"><strong>Emergency Condition:</strong> {activeCall.conditionSummary}</p>
            </div>

            <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-700/80 flex items-center justify-between font-mono">
              <span className="text-slate-400 text-[11px]">Transmitted Vitals:</span>
              <span className="text-emerald-400 font-bold">BP {activeCall.vitals.bp} | Pulse {activeCall.vitals.pulse} bpm | SpO2 {activeCall.vitals.spO2}%</span>
            </div>
          </div>

          {/* Box 2: GPS Location & Destination */}
          <div className="bg-slate-800/90 p-5 rounded-2xl border border-slate-700 space-y-3">
            <div className="border-b border-slate-700/80 pb-2">
              <span className="font-bold text-emerald-400 flex items-center gap-1.5 text-sm">
                <Compass className="w-4 h-4 text-emerald-400" />
                GPS Navigation & Route
              </span>
            </div>

            <div className="space-y-2 text-slate-200">
              <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-700">
                <span className="text-slate-400 text-[10px] uppercase font-bold block mb-0.5">1. Pickup Address</span>
                <span className="font-bold text-white flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-red-400" /> {activeCall.pickupAddress}
                </span>
              </div>

              <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-700">
                <span className="text-slate-400 text-[10px] uppercase font-bold block mb-0.5">2. Receiving ER Hospital</span>
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <Hospital className="w-3.5 h-3.5 text-emerald-400" /> {activeCall.destinationHospital}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls for Driver */}
        <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleUpdateStatus('EN_ROUTE_PICKUP', 'En Route to Patient Location. GPS Tracking Transmitted.')}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeCall.status === 'EN_ROUTE_PICKUP'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              1. En Route to Pickup
            </button>

            <button
              onClick={() => handleUpdateStatus('PATIENT_ONBOARD', 'Patient Onboarded into Ambulance! Oxygen & ECG Active.')}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeCall.status === 'PATIENT_ONBOARD'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              2. Patient Onboarded
            </button>

            <button
              onClick={() => handleUpdateStatus('ARRIVED_AT_ER', 'Arrived at Hospital Emergency Room Triage Desk!')}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeCall.status === 'ARRIVED_AT_ER'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              3. Arrived at Hospital ER
            </button>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${activeCall.patientPhone}`}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <PhoneCall className="w-4 h-4" /> Call Patient
            </a>
          </div>
        </div>
      </div>

      {/* Patient History Lookup Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-slate-900">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-600" />
                ABHA Medical History: {activeCall.patientName}
              </h3>
              <button onClick={() => setShowHistoryModal(false)} className="text-slate-400 font-bold text-sm">✕</button>
            </div>
            <div className="space-y-2 text-xs text-slate-700">
              <p><strong>ABHA Health ID:</strong> <span className="font-mono font-bold text-teal-700">ABHA-9102-4410-8812</span></p>
              <p><strong>Allergies:</strong> Penicillin, Sulfa Drugs</p>
              <p><strong>Chronic Conditions:</strong> Essential Hypertension, Asthma</p>
              <p><strong>Emergency Contact:</strong> Mark Vance (Spouse) • +91 9830112244</p>
            </div>
            <button onClick={() => setShowHistoryModal(false)} className="w-full py-2.5 bg-slate-900 text-white font-extrabold text-xs rounded-xl">Close Medical Records</button>
          </div>
        </div>
      )}
    </div>
  );
};
