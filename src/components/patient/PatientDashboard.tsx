import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Bell,
  Bot,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Droplet,
  FileText,
  Heart,
  HeartPulse,
  Hospital,
  Pill,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  TrendingUp,
  User,
  Video,
  Wind,
} from 'lucide-react';
import { initialPatientProfile, sampleLabReports, sampleMedicineReminders } from '../../data/mockData';

interface PatientDashboardProps {
  onTriggerSOS: () => void;
  setActiveTab: (tab: string) => void;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({
  onTriggerSOS,
  setActiveTab,
}) => {
  const [patient] = useState(initialPatientProfile);
  const [reminders, setReminders] = useState(sampleMedicineReminders);

  const toggleMedication = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, takenToday: !r.takenToday } : r))
    );
  };

  return (
    <div className="space-y-6">
      {/* Welcome Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-400/30 text-teal-300 px-3 py-1 rounded-full text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              ABHA ID: {patient.abhaId}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Good Morning, {patient.name}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Your vital biometrics remain stable. You have <strong className="text-white">1 pending medicine alarm</strong> for Atorvastatin Calcium (10 PM) tonight.
            </p>
          </div>

          {/* Quick Action SOS Bar */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onTriggerSOS}
              className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-red-600/30 transition-all cursor-pointer animate-pulse"
            >
              <AlertTriangle className="w-4 h-4 fill-white text-red-600" />
              EMERGENCY SOS DISPATCH
            </button>

            <button
              onClick={() => setActiveTab('ai_chat')}
              className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl text-xs backdrop-blur-md border border-white/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Bot className="w-4 h-4 text-cyan-400" />
              BioMed AI Assistant
            </button>
          </div>
        </div>
      </div>

      {/* Vitals & Composite Score Row */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Blood Pressure */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>Blood Pressure</span>
            <Activity className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {patient.vitals.bloodPressure}
          </div>
          <div className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Normal Pre-Hypertensive Range
          </div>
        </div>

        {/* Heart Rate */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>Heart Rate</span>
            <Heart className="w-4 h-4 text-rose-600 fill-rose-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {patient.vitals.heartRate} <span className="text-xs font-normal text-slate-400">BPM</span>
          </div>
          <div className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Optimal Resting Rhythm
          </div>
        </div>

        {/* Oxygen SpO2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>SpO2 Oxygen</span>
            <Wind className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">
            {patient.vitals.spO2}%
          </div>
          <div className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Excellent Arterial Saturation
          </div>
        </div>

        {/* Health Score */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>Health Score</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            78 <span className="text-xs font-normal text-slate-400">/ 100</span>
          </div>
          <div className="text-[10px] font-semibold text-teal-600 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> AI Low Metabolic Risk
          </div>
        </div>
      </div>

      {/* Feature Modules Quick Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Symptom Assessment Card */}
        <div
          onClick={() => setActiveTab('symptoms')}
          className="bg-gradient-to-br from-blue-50 to-indigo-50/50 p-6 rounded-2xl border border-blue-200 shadow-xs hover:shadow-md transition-all cursor-pointer group space-y-3"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-600/20">
            <Stethoscope className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-700 transition-colors flex items-center justify-between">
            <span>AI Symptom Triage</span>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-700" />
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Run an evidence-based clinical assessment for any pain, fever, or respiratory symptoms.
          </p>
        </div>

        {/* Bed Availability Finder */}
        <div
          onClick={() => setActiveTab('beds')}
          className="bg-gradient-to-br from-indigo-50 to-purple-50/50 p-6 rounded-2xl border border-indigo-200 shadow-xs hover:shadow-md transition-all cursor-pointer group space-y-3"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-600/20">
            <Hospital className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm group-hover:text-indigo-700 transition-colors flex items-center justify-between">
            <span>Live ICU & Bed Finder</span>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-700" />
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Check real-time ICU, Ventilator, and Oxygen bed availability in nearby hospitals.
          </p>
        </div>

        {/* Medicine & OCR Scanner */}
        <div
          onClick={() => setActiveTab('medicines')}
          className="bg-gradient-to-br from-rose-50 to-amber-50/50 p-6 rounded-2xl border border-rose-200 shadow-xs hover:shadow-md transition-all cursor-pointer group space-y-3"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold shadow-md shadow-rose-600/20">
            <Pill className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm group-hover:text-rose-700 transition-colors flex items-center justify-between">
            <span>Prescription OCR & Alarms</span>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-rose-700" />
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Scan physical prescriptions with camera/OCR and check for dangerous drug interactions.
          </p>
        </div>
      </div>

      {/* Medication Alarms & Telemedicine Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Daily Medication Alarms */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-rose-600" />
              Daily Medication Schedule
            </h3>
            <button
              onClick={() => setActiveTab('medicines')}
              className="text-xs font-semibold text-rose-600 hover:underline"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {reminders.map((med) => (
              <div
                key={med.id}
                className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 text-xs ${
                  med.takenToday ? 'bg-slate-50 border-slate-200 opacity-75' : 'bg-rose-50/50 border-rose-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleMedication(med.id)}
                    className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                      med.takenToday
                        ? 'bg-emerald-600 text-white'
                        : 'border-2 border-slate-300 hover:border-rose-500'
                    }`}
                  >
                    {med.takenToday && <CheckCircle2 className="w-4 h-4" />}
                  </button>

                  <div>
                    <div className="font-bold text-slate-900">{med.name} ({med.dosage})</div>
                    <div className="text-slate-500 text-[10px] mt-0.5">{med.timing} • {med.times.join(', ')}</div>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    med.takenToday ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {med.takenToday ? 'Taken' : 'Due Today'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Telemedicine & Lab Highlights */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              Upcoming Doctor Consultation
            </h3>
            <button
              onClick={() => setActiveTab('consultation')}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              Book Slot
            </button>
          </div>

          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 flex items-center justify-between gap-3 text-xs">
            <div>
              <div className="font-bold text-slate-900">Dr. Sarah Jenkins, MD</div>
              <div className="text-blue-700 font-semibold">Cardiology & Interventional Care</div>
              <div className="text-slate-500 text-[10px] mt-1">Today @ 02:00 PM • Virtual Video Room</div>
            </div>

            <button
              onClick={() => setActiveTab('consultation')}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <Video className="w-3.5 h-3.5" /> Join Video
            </button>
          </div>

          {/* Recent Lab Report Summary */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-slate-700">Recent Diagnostic Report</span>
              <button
                onClick={() => setActiveTab('records')}
                className="text-indigo-600 font-semibold hover:underline"
              >
                Vault
              </button>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">Comprehensive Metabolic Panel</div>
                <div className="text-[10px] text-slate-500">HbA1c 5.8% • Total Cholesterol 185 mg/dL</div>
              </div>
              <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                Reviewed
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
