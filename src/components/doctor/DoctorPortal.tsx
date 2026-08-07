import React, { useState, useEffect } from 'react';
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  FileText,
  Hospital,
  Loader2,
  Plus,
  Send,
  Sparkles,
  Stethoscope,
  Truck,
  User,
} from 'lucide-react';
import { DigitalReferral } from '../../types';

export const DoctorPortal: React.FC = () => {
  const [referrals, setReferrals] = useState<DigitalReferral[]>([]);
  const [showNewReferralModal, setShowNewReferralModal] = useState(false);
  const [patientName, setPatientName] = useState('Eleanor Vance');
  const [patientAge, setPatientAge] = useState(64);
  const [abhaId, setAbhaId] = useState('ABHA-9102-4410-8812');
  const [medicalSummary, setMedicalSummary] = useState(
    'Acute Anterior Wall Myocardial Infarction. ST elevation in leads V1-V4. Given dual antiplatelet therapy. Requires urgent PCI & ICU bed with ventilator backup.'
  );
  const [requiredBedType, setRequiredBedType] = useState<'icu' | 'ventilator' | 'oxygen' | 'normal'>('icu');
  const [urgency, setUrgency] = useState<'CRITICAL' | 'HIGH' | 'ROUTINE'>('CRITICAL');
  const [loadingAiMatch, setLoadingAiMatch] = useState(false);
  const [aiMatchResult, setAiMatchResult] = useState<any>(null);
  const [selectedReceivingHosp, setSelectedReceivingHosp] = useState('hosp-1');
  const [selectedReceivingHospName, setSelectedReceivingHospName] = useState('City Central Super Specialty Hospital');

  useEffect(() => {
    fetchReferrals();
  }, []);

  const fetchReferrals = async () => {
    try {
      const res = await fetch('/api/referrals');
      const data = await res.json();
      setReferrals(data);
    } catch (err) {
      console.error('Error fetching referrals:', err);
    }
  };

  const handleRunAiHospitalMatch = async () => {
    setLoadingAiMatch(true);
    try {
      const res = await fetch('/api/ai/smart-referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientCondition: medicalSummary,
          requiredBedType,
          specialCareNeeded: 'Cardiac Catheterization & ICU Ventilator',
        }),
      });
      const data = await res.json();
      setAiMatchResult(data);
    } catch (err) {
      console.error('AI match error:', err);
    } finally {
      setLoadingAiMatch(false);
    }
  };

  const handleCreateReferral = async () => {
    try {
      const res = await fetch('/api/referrals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName,
          patientAge,
          gender: 'Female',
          abhaId,
          referredByDoctor: 'Dr. Arthur Pendelton (Community Care Clinic)',
          referringHospital: 'Community Health Center #4',
          receivingHospitalId: selectedReceivingHosp,
          receivingHospitalName: selectedReceivingHospName,
          medicalSummary,
          requiredBedType,
          urgency,
        }),
      });
      const data = await res.json();
      setReferrals((prev) => [data, ...prev]);
      setShowNewReferralModal(false);
    } catch (err) {
      console.error('Error creating referral:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 px-3 py-1 rounded-full text-xs font-semibold mb-3">
              <Stethoscope className="w-3.5 h-3.5 text-blue-400" />
              Attending Physician Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Clinical Desk & Smart Digital Referral System
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm">
              Dr. Arthur Pendelton • Community Care Cardiology Division
            </p>
          </div>

          <button
            onClick={() => setShowNewReferralModal(true)}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create Digital Referral
          </button>
        </div>
      </div>

      {/* Active Digital Referrals Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Send className="w-5 h-5 text-blue-600" />
            Active Digital Patient Transfer Referrals ({referrals.length})
          </h2>
          <span className="text-xs text-slate-500">Real-Time Hospital Sync</span>
        </div>

        <div className="space-y-4">
          {referrals.map((ref) => (
            <div
              key={ref.id}
              className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 text-base">
                      {ref.patientName} ({ref.patientAge} Y, {ref.gender})
                    </span>
                    <span className="text-xs text-blue-700 font-mono font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {ref.abhaId}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Ref ID: <span className="font-bold text-slate-800">{ref.id}</span> • Target: <span className="font-bold text-slate-800">{ref.receivingHospitalName}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black ${
                      ref.urgency === 'CRITICAL'
                        ? 'bg-red-100 text-red-800 border border-red-300'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {ref.urgency}
                  </span>

                  <span className="px-3 py-1 bg-indigo-100 text-indigo-900 rounded-full text-xs font-bold border border-indigo-200">
                    {ref.status}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                <span className="font-bold text-slate-900 block mb-1">Attached Medical Summary:</span>
                {ref.medicalSummary}
              </div>

              {ref.ambulanceVehicle && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-amber-700" />
                    <span>Assigned Ambulance: <strong className="underline">{ref.ambulanceVehicle}</strong></span>
                  </div>
                  <span className="font-bold">ETA: ~{ref.etaMinutes || 8} Mins</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* New Referral Creation Modal */}
      {showNewReferralModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Initiate Digital Patient Referral
              </h2>
              <button
                onClick={() => setShowNewReferralModal(false)}
                className="text-slate-400 hover:text-slate-800 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Patient Name</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">ABHA Health ID</label>
                <input
                  type="text"
                  value={abhaId}
                  onChange={(e) => setAbhaId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                />
              </div>
            </div>

            <div className="text-xs space-y-1">
              <label className="block font-bold text-slate-700">Clinical Case Summary & Diagnosis</label>
              <textarea
                rows={3}
                value={medicalSummary}
                onChange={(e) => setMedicalSummary(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none"
              />
            </div>

            {/* AI Smart Bed Match Trigger */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  Gemini Hospital Bed Recommendation Engine
                </span>
                <button
                  onClick={handleRunAiHospitalMatch}
                  disabled={loadingAiMatch}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  {loadingAiMatch ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Run AI Bed Match'}
                </button>
              </div>

              {aiMatchResult && (
                <div className="p-3 bg-white rounded-xl border border-blue-200 text-xs text-slate-800 space-y-1 animate-in fade-in">
                  <div className="font-bold text-blue-900">
                    Recommended: City Central Hospital ({aiMatchResult.matchConfidenceScore}% Match)
                  </div>
                  <p className="text-slate-600">{aiMatchResult.reasoning}</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Required Bed Equipment</label>
                <select
                  value={requiredBedType}
                  onChange={(e) => setRequiredBedType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                >
                  <option value="icu">ICU Bed (Ventilator Backup)</option>
                  <option value="ventilator">Dedicated Ventilator Unit</option>
                  <option value="oxygen">High-Flow Oxygen Bed</option>
                  <option value="normal">Normal Specialty Ward</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Triage Urgency Level</label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                >
                  <option value="CRITICAL">CRITICAL (Immediate Transfer)</option>
                  <option value="HIGH">HIGH (Under 1 Hour)</option>
                  <option value="ROUTINE">ROUTINE (Scheduled Transfer)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowNewReferralModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateReferral}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/20 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                Dispatch Digital Referral
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
