import React, { useState, useEffect } from 'react';
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
import { initialPatientProfile } from '../../data/mockData';
import { MedicineReminder } from '../../types';

interface PatientDashboardProps {
  onTriggerSOS: () => void;
  setActiveTab: (tab: string) => void;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({
  onTriggerSOS,
  setActiveTab,
}) => {
  const [patient] = useState(initialPatientProfile);
  const [reminders, setReminders] = useState<MedicineReminder[]>([]);

  useEffect(() => {
    // Sync reminders from localStorage if user added any in Medicine Manager
    const saved = localStorage.getItem('biomed_reminders');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setReminders(parsed);
        }
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  const toggleMedication = (id: string) => {
    setReminders((prev) => {
      const updated = prev.map((r) => (r.id === id ? { ...r, takenToday: !r.takenToday } : r));
      localStorage.setItem('biomed_reminders', JSON.stringify(updated));
      return updated;
    });
  };

  const pendingReminders = reminders.filter((r) => !r.takenToday);

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
              Your vital biometrics remain stable.{' '}
              {pendingReminders.length === 0 ? (
                <span className="text-teal-300 font-bold">You have 0 pending medicine alarms scheduled for today.</span>
              ) : (
                <>
                  You have <strong className="text-amber-300 font-black">{pendingReminders.length} pending medicine alarm{pendingReminders.length > 1 ? 's' : ''}</strong> ({pendingReminders[0].name}) scheduled.
                </>
              )}
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
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {patient.vitals.heartRate} <span className="text-xs text-slate-400 font-normal">BPM</span>
          </div>
          <div className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Optimal Resting Rhythm
          </div>
        </div>

        {/* SpO2 Oxygen */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>SpO2 Oxygen</span>
            <Wind className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {patient.vitals.spO2}%
          </div>
          <div className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Excellent Arterial Saturation
          </div>
        </div>

        {/* Health Index */}
        <div className="bg-gradient-to-br from-teal-600 to-indigo-700 p-5 rounded-2xl text-white shadow-xs space-y-1 flex flex-col justify-between">
          <div className="flex items-center justify-between text-teal-100 text-xs font-extrabold uppercase">
            <span>Composite Health Score</span>
            <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black">78</span>
            <span className="text-xs text-teal-200">/ 100</span>
          </div>
          <div className="text-[10px] text-teal-100 font-medium">
            Good Metabolic & Cardiac Reserve
          </div>
        </div>
      </div>

      {/* Feature Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Symptom Checker */}
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
              className="text-xs font-semibold text-rose-600 hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>

          {reminders.length === 0 ? (
            <div className="py-10 text-center space-y-2">
              <Pill className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-600">No Active Medicine Reminders Scheduled</p>
              <button
                onClick={() => setActiveTab('medicines')}
                className="text-[11px] font-extrabold text-rose-600 underline cursor-pointer"
              >
                + Add Medicine in Medicine Manager
              </button>
            </div>
          ) : (
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
                      className={`w-5 h-5 rounded-md border flex items-center justify-center cursor-pointer transition-all ${
                        med.takenToday
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 bg-white hover:border-emerald-500'
                      }`}
                    >
                      {med.takenToday && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </button>
                    <div>
                      <h4 className={`font-bold ${med.takenToday ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                        {med.name} ({med.dosage})
                      </h4>
                      <p className="text-[10px] text-slate-500">
                        {med.frequency} • {med.timing}
                      </p>
                    </div>
                  </div>

                  <span className="font-mono font-bold text-[11px] text-rose-700 bg-white px-2.5 py-1 rounded-lg border border-rose-100 shadow-2xs">
                    {med.times ? med.times[0] : '08:00 AM'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Telemedicine Appointment Card */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              Upcoming Doctor Consultations
            </h3>
            <button
              onClick={() => setActiveTab('consultation')}
              className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
            >
              Book OPD Slot
            </button>
          </div>

          <div className="p-4 bg-blue-50/50 border border-blue-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-slate-900 text-xs">Dr. Sarah Jenkins, MD</h4>
                <p className="text-[11px] text-blue-700 font-bold">Cardiology & Interventional Care</p>
              </div>
              <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-md">
                CONFIRMED
              </span>
            </div>

            <div className="text-[11px] text-slate-600 flex items-center justify-between border-t border-blue-100 pt-2 font-medium">
              <span>Today @ 02:00 PM • Virtual Video Room</span>
              <button
                onClick={() => setActiveTab('consultation')}
                className="text-blue-700 font-bold flex items-center gap-1 hover:underline cursor-pointer"
              >
                <Video className="w-3.5 h-3.5" /> Launch Room
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
