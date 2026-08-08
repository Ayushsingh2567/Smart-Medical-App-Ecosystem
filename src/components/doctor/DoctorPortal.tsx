import React, { useState, useEffect } from 'react';
import {
  Activity,
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  FileSpreadsheet,
  FileText,
  Hospital,
  Loader2,
  Pill,
  Plus,
  Search,
  Send,
  Sparkles,
  Stethoscope,
  Trash2,
  Truck,
  User,
  UserCheck,
} from 'lucide-react';
import { DigitalReferral, ConsultationRecord } from '../../types';

export const DoctorPortal: React.FC = () => {
  const [activeDoctorTab, setActiveDoctorTab] = useState<'consultations' | 'referrals'>('consultations');
  const [referrals, setReferrals] = useState<DigitalReferral[]>([]);
  const [consultations, setConsultations] = useState<ConsultationRecord[]>([]);
  
  // Referral Modal state (Blank defaults for real usage)
  const [showNewReferralModal, setShowNewReferralModal] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState<number | ''>('');
  const [abhaId, setAbhaId] = useState('');
  const [medicalSummary, setMedicalSummary] = useState('');
  const [requiredBedType, setRequiredBedType] = useState<'icu' | 'ventilator' | 'oxygen' | 'normal'>('icu');
  const [urgency, setUrgency] = useState<'CRITICAL' | 'HIGH' | 'ROUTINE'>('CRITICAL');
  const [loadingAiMatch, setLoadingAiMatch] = useState(false);
  const [aiMatchResult, setAiMatchResult] = useState<any>(null);
  const [selectedReceivingHosp, setSelectedReceivingHosp] = useState('hosp-1');
  const [selectedReceivingHospName, setSelectedReceivingHospName] = useState('City Central Super Specialty Hospital');

  // New In-Person Consultation Modal State (Blank defaults for real usage)
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  const [consultDoctorName, setConsultDoctorName] = useState('');
  const [consultHospitalName, setConsultHospitalName] = useState('');
  const [consultPatientName, setConsultPatientName] = useState('');
  const [consultAbhaId, setConsultAbhaId] = useState('');
  const [consultAge, setConsultAge] = useState<number | ''>('');
  const [consultGender, setConsultGender] = useState('Male');
  const [chiefComplaints, setChiefComplaints] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [bp, setBp] = useState('');
  const [pulse, setPulse] = useState<number | ''>('');
  const [temp, setTemp] = useState<number | ''>('');
  const [spO2Val, setSpO2Val] = useState<number | ''>('');
  
  // Medicine list for consultation
  const [medName, setMedName] = useState('');
  const [medDosage, setMedDosage] = useState('');
  const [medFrequency, setMedFrequency] = useState('1-0-0 (Morning)');
  const [medDuration, setMedDuration] = useState('30 Days');
  const [medInstructions, setMedInstructions] = useState('');
  const [medList, setMedList] = useState<Array<{ name: string; dosage: string; frequency: string; duration: string; instructions: string }>>([]);
  const [recommendedTestsInput, setRecommendedTestsInput] = useState('');
  const [doctorNotes, setDoctorNotes] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [savingConsultation, setSavingConsultation] = useState(false);
  
  // Search patient history state
  const [selectedPatientHistory, setSelectedPatientHistory] = useState<ConsultationRecord[]>([]);

  useEffect(() => {
    fetchReferrals();
    fetchConsultations();
  }, []);

  const fetchReferrals = async () => {
    try {
      const res = await fetch('/api/referrals');
      const data = await res.json();
      if (Array.isArray(data)) setReferrals(data);
    } catch (err) {
      console.error('Error fetching referrals:', err);
    }
  };

  const fetchConsultations = async () => {
    try {
      const res = await fetch('/api/consultations');
      const data = await res.json();
      if (Array.isArray(data)) {
        setConsultations(data);
        setSelectedPatientHistory(data);
      }
    } catch (err) {
      console.error('Error fetching consultations:', err);
    }
  };

  const handleAddMedication = () => {
    if (!medName || !medDosage) return;
    setMedList((prev) => [
      ...prev,
      { name: medName, dosage: medDosage, frequency: medFrequency, duration: medDuration, instructions: medInstructions },
    ]);
    setMedName('');
    setMedDosage('');
    setMedInstructions('');
  };

  const handleRemoveMedication = (index: number) => {
    setMedList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveConsultation = async () => {
    if (!consultPatientName || !diagnosis) {
      alert('Please enter Patient Name and Clinical Diagnosis');
      return;
    }
    setSavingConsultation(true);
    try {
      const newConsultation: ConsultationRecord = {
        id: 'cons-' + Date.now(),
        patientName: consultPatientName,
        patientAbhaId: consultAbhaId || 'ABHA-' + Math.floor(1000 + Math.random() * 9000) + '-8812',
        patientAge: Number(consultAge) || 30,
        patientGender: consultGender,
        doctorName: consultDoctorName || 'Attending Physician, MD',
        doctorSpecialty: 'General Medicine & OPD Care',
        hospitalName: consultHospitalName || 'Medical Ecosystem Center',
        chiefComplaints,
        diagnosis,
        bloodPressure: bp || '120/80',
        heartRate: Number(pulse) || 72,
        temperature: Number(temp) || 98.6,
        spO2: Number(spO2Val) || 99,
        prescribedMedications: medList,
        recommendedTests: recommendedTestsInput.split(',').map((t) => t.trim()).filter(Boolean),
        doctorNotes,
        followUpDate: followUpDate || '2026-09-01',
        visitDate: new Date().toISOString().split('T')[0],
      };

      const res = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConsultation),
      });

      const data = await res.json().catch(() => null);
      const added = data && data.id ? data : newConsultation;

      setConsultations((prev) => [added, ...prev]);
      setShowConsultationModal(false);
      
      // Clear form
      setConsultPatientName('');
      setConsultAbhaId('');
      setChiefComplaints('');
      setDiagnosis('');
      setMedList([]);
      setDoctorNotes('');
    } catch (err) {
      console.error('Error saving consultation:', err);
    } finally {
      setSavingConsultation(false);
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
          specialCareNeeded: 'Emergency Trauma & ICU Care',
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
    if (!patientName || !medicalSummary) {
      alert('Please fill in Patient Name and Medical Summary');
      return;
    }
    try {
      const newRef = {
        id: 'ref-' + Date.now(),
        patientName,
        patientAge: Number(patientAge) || 40,
        gender: 'Not Specified',
        abhaId: abhaId || 'ABHA-' + Math.floor(1000 + Math.random() * 9000) + '-8812',
        referredByDoctor: 'Attending Physician',
        referringHospital: 'Clinic / Primary Care Center',
        receivingHospitalId: selectedReceivingHosp,
        receivingHospitalName: selectedReceivingHospName,
        medicalSummary,
        requiredBedType,
        urgency,
        status: 'PENDING_APPROVAL',
        createdAt: new Date().toISOString(),
      };

      const res = await fetch('/api/referrals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRef),
      });

      const data = await res.json().catch(() => null);
      const added = data && data.id ? data : newRef;

      setReferrals((prev) => [added, ...prev]);
      setShowNewReferralModal(false);
      setPatientName('');
      setAbhaId('');
      setMedicalSummary('');
    } catch (err) {
      console.error('Error creating referral:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 px-3 py-1 rounded-full text-xs font-semibold mb-3">
            <Stethoscope className="w-3.5 h-3.5" />
            Physician OPD & Hospital Referral Workstation
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Doctor & Specialist Medical Portal
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
            Record in-person OPD consultation details, prescribe medicines, look up past patient health vault history, and dispatch digital referrals.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setShowConsultationModal(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold rounded-xl flex items-center gap-2 shadow-lg cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            + Record OPD Patient Visit
          </button>

          <button
            onClick={() => setShowNewReferralModal(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold rounded-xl flex items-center gap-2 shadow-lg cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            + Dispatch Hospital Referral
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveDoctorTab('consultations')}
          className={`pb-2 px-3 text-xs font-extrabold cursor-pointer border-b-2 transition-all ${
            activeDoctorTab === 'consultations'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4 inline mr-1.5 text-emerald-600" />
          OPD Consultations ({consultations.length})
        </button>

        <button
          onClick={() => setActiveDoctorTab('referrals')}
          className={`pb-2 px-3 text-xs font-extrabold cursor-pointer border-b-2 transition-all ${
            activeDoctorTab === 'referrals'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Hospital className="w-4 h-4 inline mr-1.5 text-blue-600" />
          Hospital Bed Referrals ({referrals.length})
        </button>
      </div>

      {/* Tab 1: OPD Consultations */}
      {activeDoctorTab === 'consultations' && (
        <div className="space-y-4">
          {consultations.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
                <Stethoscope className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No Consultation Records Yet</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Start recording patient OPD visits, clinical diagnoses, vitals, and e-prescriptions.
              </p>
              <button
                onClick={() => setShowConsultationModal(true)}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl inline-flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                Record First OPD Patient Visit
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {consultations.map((c) => (
                <div key={c.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">{c.patientName}</h4>
                      <span className="text-xs font-mono font-bold text-teal-700">{c.patientAbhaId}</span>
                    </div>
                    <span className="text-[10px] font-bold bg-slate-100 px-2.5 py-1 rounded-full text-slate-700">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="text-xs space-y-1 text-slate-700">
                    <p><strong>Chief Complaints:</strong> {c.chiefComplaints}</p>
                    <p className="text-emerald-800 font-bold"><strong>Diagnosis:</strong> {c.diagnosis}</p>
                    <p><strong>Vitals:</strong> BP {c.bloodPressure} | HR {c.heartRate} bpm | SpO2 {c.spO2}%</p>
                  </div>

                  {c.prescribedMedications && c.prescribedMedications.length > 0 && (
                    <div className="pt-2 border-t border-slate-100">
                      <span className="text-[11px] font-bold text-slate-500 block mb-1">Prescribed Medicines:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {c.prescribedMedications.map((m: any, idx: number) => (
                          <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-800 text-[10px] font-bold rounded">
                            {m.name} ({m.dosage})
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Referrals */}
      {activeDoctorTab === 'referrals' && (
        <div className="space-y-4">
          {referrals.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
                <Hospital className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No Emergency Referrals Dispatched</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Create digital hospital-to-hospital referrals for ICU, ventilator, or emergency bed allocations.
              </p>
              <button
                onClick={() => setShowNewReferralModal(true)}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl inline-flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                Dispatch First Emergency Referral
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {referrals.map((r) => (
                <div key={r.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">{r.patientName} (Age: {r.patientAge})</h4>
                      <span className="text-xs font-mono font-bold text-teal-700">{r.abhaId}</span>
                    </div>
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full">
                      {r.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-700 space-y-1">
                    <p><strong>Receiving Hospital:</strong> {r.receivingHospitalName}</p>
                    <p><strong>Required Bed:</strong> {r.requiredBedType.toUpperCase()}</p>
                    <p><strong>Medical Summary:</strong> {r.medicalSummary}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: Record OPD Patient Consultation */}
      {showConsultationModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 my-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Record In-Person OPD Patient Visit</h3>
                  <p className="text-xs text-slate-500">Save clinical observations & e-prescription to ABHA Vault</p>
                </div>
              </div>
              <button onClick={() => setShowConsultationModal(false)} className="text-slate-400 font-bold hover:text-slate-800 text-sm cursor-pointer">✕</button>
            </div>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Doctor Name</label>
                  <input
                    type="text"
                    value={consultDoctorName}
                    onChange={(e) => setConsultDoctorName(e.target.value)}
                    placeholder="e.g. Dr. Sarah Jenkins, MD"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Hospital / Clinic Name</label>
                  <input
                    type="text"
                    value={consultHospitalName}
                    onChange={(e) => setConsultHospitalName(e.target.value)}
                    placeholder="e.g. City Central Super Specialty Hospital"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Patient Full Name *</label>
                  <input
                    type="text"
                    required
                    value={consultPatientName}
                    onChange={(e) => setConsultPatientName(e.target.value)}
                    placeholder="Enter patient name"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ABHA Health ID</label>
                  <input
                    type="text"
                    value={consultAbhaId}
                    onChange={(e) => setConsultAbhaId(e.target.value)}
                    placeholder="e.g. ABHA-9102-4410-8812"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Age & Gender</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={consultAge}
                      onChange={(e) => setConsultAge(e.target.value ? Number(e.target.value) : '')}
                      placeholder="Age"
                      className="w-1/2 px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                    <select
                      value={consultGender}
                      onChange={(e) => setConsultGender(e.target.value)}
                      className="w-1/2 px-2 py-2 rounded-xl border border-slate-300 text-xs"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Chief Complaints</label>
                <input
                  type="text"
                  value={chiefComplaints}
                  onChange={(e) => setChiefComplaints(e.target.value)}
                  placeholder="e.g. Fever, cough, chest discomfort for 3 days"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Clinical Diagnosis *</label>
                <input
                  type="text"
                  required
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="e.g. Acute Viral Bronchitis & Hypertension"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <span className="text-xs font-bold text-slate-800 block">Patient Vitals</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block">BP (mmHg)</span>
                    <input type="text" value={bp} onChange={(e) => setBp(e.target.value)} placeholder="120/80" className="w-full px-2 py-1.5 border rounded-lg" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Pulse (bpm)</span>
                    <input type="number" value={pulse} onChange={(e) => setPulse(e.target.value ? Number(e.target.value) : '')} placeholder="72" className="w-full px-2 py-1.5 border rounded-lg" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Temp (°F)</span>
                    <input type="number" value={temp} onChange={(e) => setTemp(e.target.value ? Number(e.target.value) : '')} placeholder="98.6" className="w-full px-2 py-1.5 border rounded-lg" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">SpO2 (%)</span>
                    <input type="number" value={spO2Val} onChange={(e) => setSpO2Val(e.target.value ? Number(e.target.value) : '')} placeholder="99" className="w-full px-2 py-1.5 border rounded-lg" />
                  </div>
                </div>
              </div>

              {/* Add Medicines */}
              <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-2xl space-y-3">
                <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                  <Pill className="w-4 h-4 text-emerald-600" />
                  Prescribe Medicines (e-Rx)
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input type="text" value={medName} onChange={(e) => setMedName(e.target.value)} placeholder="Medicine Name" className="px-2.5 py-1.5 text-xs border rounded-xl" />
                  <input type="text" value={medDosage} onChange={(e) => setMedDosage(e.target.value)} placeholder="Dosage (e.g. 500mg)" className="px-2.5 py-1.5 text-xs border rounded-xl" />
                  <select value={medFrequency} onChange={(e) => setMedFrequency(e.target.value)} className="px-2.5 py-1.5 text-xs border rounded-xl">
                    <option value="1-0-0 (Morning)">1-0-0 (Morning)</option>
                    <option value="1-0-1 (Morning & Night)">1-0-1 (Morning & Night)</option>
                    <option value="1-1-1 (Thrice Daily)">1-1-1 (Thrice Daily)</option>
                    <option value="0-0-1 (Night)">0-0-1 (Night)</option>
                  </select>
                </div>

                <button type="button" onClick={handleAddMedication} className="px-3 py-1.5 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 cursor-pointer">
                  + Add Medicine to Prescription
                </button>

                {medList.length > 0 && (
                  <div className="space-y-1">
                    {medList.map((m, idx) => (
                      <div key={idx} className="p-2 bg-white rounded-xl border flex items-center justify-between text-xs">
                        <span><strong>{m.name}</strong> ({m.dosage}) - {m.frequency}</span>
                        <button type="button" onClick={() => handleRemoveMedication(idx)} className="text-red-500 font-bold hover:underline cursor-pointer">Remove</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Recommended Diagnostics & Lab Tests</label>
                <input
                  type="text"
                  value={recommendedTestsInput}
                  onChange={(e) => setRecommendedTestsInput(e.target.value)}
                  placeholder="e.g. Complete Blood Count (CBC), Lipid Profile, ECG"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Doctor Advice & Notes</label>
                <textarea
                  rows={2}
                  value={doctorNotes}
                  onChange={(e) => setDoctorNotes(e.target.value)}
                  placeholder="Dietary advice, lifestyle changes, precautions..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>
            </div>

            <button
              onClick={handleSaveConsultation}
              disabled={savingConsultation}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer transition-all disabled:opacity-50"
            >
              {savingConsultation ? 'Saving Record...' : 'Save & Publish Consultation Record to ABHA Vault'}
            </button>
          </div>
        </div>
      )}

      {/* MODAL 2: Create Digital Referral */}
      {showNewReferralModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 my-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                  <Hospital className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Dispatch Digital Hospital Referral</h3>
                  <p className="text-xs text-slate-500">Automated bed allocation & triage dispatch</p>
                </div>
              </div>
              <button onClick={() => setShowNewReferralModal(false)} className="text-slate-400 font-bold hover:text-slate-800 text-sm cursor-pointer">✕</button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Patient Full Name *</label>
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Enter patient full name"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ABHA Health ID</label>
                  <input
                    type="text"
                    value={abhaId}
                    onChange={(e) => setAbhaId(e.target.value)}
                    placeholder="e.g. ABHA-9102-4410-8812"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Medical Clinical Summary *</label>
                <textarea
                  rows={3}
                  required
                  value={medicalSummary}
                  onChange={(e) => setMedicalSummary(e.target.value)}
                  placeholder="Describe patient diagnosis, acute symptoms, and required emergency setup..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Required Bed Type</label>
                  <select
                    value={requiredBedType}
                    onChange={(e) => setRequiredBedType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                  >
                    <option value="icu">ICU Bed</option>
                    <option value="ventilator">Ventilator Bed</option>
                    <option value="oxygen">Oxygen Supported Bed</option>
                    <option value="normal">Normal Ward Bed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Receiving Hospital</label>
                  <input
                    type="text"
                    value={selectedReceivingHospName}
                    onChange={(e) => setSelectedReceivingHospName(e.target.value)}
                    placeholder="Enter hospital name"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleRunAiHospitalMatch}
                disabled={loadingAiMatch || !medicalSummary}
                className="w-full py-2.5 bg-indigo-50 border border-indigo-200 text-indigo-900 font-bold rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-indigo-100 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-indigo-600" />
                {loadingAiMatch ? 'AI Matching...' : 'Run Gemini AI Smart Hospital Match'}
              </button>

              {aiMatchResult && (
                <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs space-y-1">
                  <span className="font-bold text-indigo-900">AI Recommendation:</span>
                  <p className="text-indigo-950">{aiMatchResult.recommendation}</p>
                </div>
              )}

              <button
                type="button"
                onClick={handleCreateReferral}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer transition-all"
              >
                Dispatch Referral Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
