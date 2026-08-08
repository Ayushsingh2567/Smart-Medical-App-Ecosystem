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
  Truck,
  User,
  UserCheck,
} from 'lucide-react';
import { DigitalReferral, ConsultationRecord } from '../../types';

export const DoctorPortal: React.FC = () => {
  const [activeDoctorTab, setActiveDoctorTab] = useState<'consultations' | 'referrals'>('consultations');
  const [referrals, setReferrals] = useState<DigitalReferral[]>([]);
  const [consultations, setConsultations] = useState<ConsultationRecord[]>([]);
  
  // Referral Modal state
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

  // New In-Person Consultation Modal State
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  const [consultPatientName, setConsultPatientName] = useState('Alexander Wright');
  const [consultAbhaId, setConsultAbhaId] = useState('ABHA-9102-4410-8812');
  const [consultAge, setConsultAge] = useState(42);
  const [consultGender, setConsultGender] = useState('Male');
  const [chiefComplaints, setChiefComplaints] = useState('Mild chest discomfort, dyspnea on exertion for 3 days');
  const [diagnosis, setDiagnosis] = useState('Stable Angina Pectoris & Controlled Essential Hypertension');
  const [bp, setBp] = useState('130/84');
  const [pulse, setPulse] = useState(76);
  const [temp, setTemp] = useState(98.6);
  const [spO2Val, setSpO2Val] = useState(98);
  
  // Medicine list for consultation
  const [medName, setMedName] = useState('Amlodipine Besylate');
  const [medDosage, setMedDosage] = useState('5 mg');
  const [medFrequency, setMedFrequency] = useState('1-0-0 (Morning)');
  const [medDuration, setMedDuration] = useState('30 Days');
  const [medInstructions, setMedInstructions] = useState('Take after breakfast with water');
  const [medList, setMedList] = useState<Array<{ name: string; dosage: string; frequency: string; duration: string; instructions: string }>>([
    { name: 'Amlodipine Besylate', dosage: '5 mg', frequency: '1-0-0 (Morning)', duration: '30 Days', instructions: 'Take after breakfast' }
  ]);
  const [recommendedTestsInput, setRecommendedTestsInput] = useState('2D Echocardiogram, Treadmill Stress Test (TMT), Lipid Profile');
  const [doctorNotes, setDoctorNotes] = useState('Advised DASH diet, regular aerobic exercise 30 mins daily. Return if severe chest pain occurs.');
  const [followUpDate, setFollowUpDate] = useState('2026-08-25');
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
      setReferrals(data);
    } catch (err) {
      console.error('Error fetching referrals:', err);
    }
  };

  const fetchConsultations = async () => {
    try {
      const res = await fetch('/api/consultations');
      const data = await res.json();
      setConsultations(data);
      if (data && data.length > 0) {
        setSelectedPatientHistory(data);
      }
    } catch (err) {
      console.error('Error fetching consultations:', err);
    }
  };

  const handleAddMedication = () => {
    if (!medName) return;
    setMedList((prev) => [
      ...prev,
      { name: medName, dosage: medDosage, frequency: medFrequency, duration: medDuration, instructions: medInstructions },
    ]);
    setMedName('');
    setMedDosage('');
  };

  const handleRemoveMedication = (index: number) => {
    setMedList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveConsultation = async () => {
    setSavingConsultation(true);
    try {
      const res = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: consultPatientName,
          patientAbhaId: consultAbhaId,
          patientAge: consultAge,
          patientGender: consultGender,
          doctorName: 'Dr. Sarah Jenkins, MD',
          doctorSpecialty: 'Cardiology & Interventional Care',
          hospitalName: 'City Central Super Specialty Hospital',
          chiefComplaints,
          diagnosis,
          bloodPressure: bp,
          heartRate: pulse,
          temperature: temp,
          spO2: spO2Val,
          prescribedMedications: medList,
          recommendedTests: recommendedTestsInput.split(',').map((t) => t.trim()).filter(Boolean),
          doctorNotes,
          followUpDate,
        }),
      });
      const data = await res.json();
      setConsultations((prev) => [data, ...prev]);
      setShowConsultationModal(false);
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
      {/* Doctor Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 px-3 py-1 rounded-full text-xs font-semibold mb-3">
              <Stethoscope className="w-3.5 h-3.5 text-blue-400" />
              Hospital OPD & In-Person Clinical Desk
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Physician Consultation & Digital Health Desk
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              Dr. Sarah Jenkins, MD • City Central Super Specialty Hospital • Cardiology OPD
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowConsultationModal(true)}
              className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              Record Patient OPD Visit
            </button>

            <button
              onClick={() => setShowNewReferralModal(true)}
              className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Initiate Transfer Referral
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
        <button
          onClick={() => setActiveDoctorTab('consultations')}
          className={`px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
            activeDoctorTab === 'consultations'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4 text-emerald-400" />
          In-Person OPD Consultations & Health Records ({consultations.length})
        </button>

        <button
          onClick={() => setActiveDoctorTab('referrals')}
          className={`px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
            activeDoctorTab === 'referrals'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Send className="w-4 h-4 text-blue-400" />
          Active Hospital Transfer Referrals ({referrals.length})
        </button>
      </div>

      {/* TAB 1: OPD Consultations & Past Records */}
      {activeDoctorTab === 'consultations' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-emerald-600" />
                  Recent Hospital Consultations & Patient Clinical Files
                </h2>
                <p className="text-xs text-slate-500">Stored & Synchronized with ABHA National Health Mesh</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600">Patient ABHA Filter:</span>
                <span className="text-xs font-mono font-bold bg-slate-100 px-3 py-1 rounded-xl text-slate-800 border border-slate-300">
                  ABHA-9102-4410-8812
                </span>
              </div>
            </div>

            {/* List of Consultations */}
            <div className="space-y-4">
              {consultations.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-xs">
                  No consultation records found. Click <strong>"Record Patient OPD Visit"</strong> to add the first consultation.
                </div>
              ) : (
                consultations.map((c) => (
                  <div
                    key={c.id}
                    className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-emerald-300 transition-all space-y-3 shadow-2xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900 text-base">
                            {c.patientName} ({c.patientAge} Y, {c.patientGender || 'Male'})
                          </span>
                          <span className="text-xs text-emerald-800 font-mono font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                            {c.patientAbhaId}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                          <span>Attending Doctor: <strong className="text-slate-800">{c.doctorName}</strong> ({c.doctorSpecialty})</span>
                          <span>•</span>
                          <span>Hospital: <strong className="text-slate-800">{c.hospitalName}</strong></span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="px-3 py-1 bg-slate-100 text-slate-800 rounded-full text-xs font-bold border border-slate-200 block sm:inline-block">
                          {c.visitType || 'OPD Hospital Visit'}
                        </span>
                        <span className="text-[11px] text-slate-500 block mt-1">
                          Date: {new Date(c.visitDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Vitals Recorded */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">BP Vitals</span>
                        <span className="font-extrabold text-slate-900">{c.bloodPressure || '120/80'} mmHg</span>
                      </div>
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Heart Rate</span>
                        <span className="font-extrabold text-slate-900">{c.heartRate || 74} BPM</span>
                      </div>
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Temperature</span>
                        <span className="font-extrabold text-slate-900">{c.temperature || 98.6}°F</span>
                      </div>
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">SpO2 Oxygen</span>
                        <span className="font-extrabold text-emerald-700">{c.spO2 || 98}%</span>
                      </div>
                    </div>

                    {/* Chief Complaints & Diagnosis */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl">
                        <span className="font-bold text-amber-900 block mb-0.5">Chief Complaints & Symptoms:</span>
                        <p className="text-amber-950">{c.chiefComplaints}</p>
                      </div>
                      <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl">
                        <span className="font-bold text-blue-900 block mb-0.5">Clinical Diagnosis:</span>
                        <p className="text-blue-950 font-semibold">{c.diagnosis}</p>
                      </div>
                    </div>

                    {/* Prescribed Medications */}
                    {c.prescribedMedications && Array.isArray(c.prescribedMedications) && c.prescribedMedications.length > 0 && (
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                        <span className="font-bold text-slate-900 flex items-center gap-1">
                          <Pill className="w-3.5 h-3.5 text-indigo-600" />
                          Prescribed Rx Medications ({c.prescribedMedications.length}):
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {c.prescribedMedications.map((m: any, idx: number) => (
                            <div key={idx} className="p-2 bg-white rounded-lg border border-slate-200 text-[11px]">
                              <span className="font-bold text-slate-900">{m.name}</span> ({m.dosage}) — <span className="text-indigo-700 font-semibold">{m.frequency}</span> for {m.duration}
                              {m.instructions && <span className="block text-slate-500 text-[10px]">{m.instructions}</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Doctor Notes & Follow-up */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs pt-2 border-t border-slate-100 text-slate-600 gap-2">
                      <div>
                        {c.doctorNotes && <span>Advice: <em>"{c.doctorNotes}"</em></span>}
                      </div>
                      {c.followUpDate && (
                        <span className="font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
                          Follow-up Date: {c.followUpDate}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Transfer Referrals */}
      {activeDoctorTab === 'referrals' && (
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
      )}

      {/* Modal 1: Record In-Person OPD Consultation */}
      {showConsultationModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-600" />
                Record Hospital In-Person OPD Consultation
              </h2>
              <button
                onClick={() => setShowConsultationModal(false)}
                className="text-slate-400 hover:text-slate-800 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Patient Info Header */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <label className="block font-bold text-slate-600 mb-1">Patient Name</label>
                <input
                  type="text"
                  value={consultPatientName}
                  onChange={(e) => setConsultPatientName(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-600 mb-1">ABHA Health ID</label>
                <input
                  type="text"
                  value={consultAbhaId}
                  onChange={(e) => setConsultAbhaId(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-mono font-bold"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-600 mb-1">Age (Years)</label>
                <input
                  type="number"
                  value={consultAge}
                  onChange={(e) => setConsultAge(parseInt(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-600 mb-1">Gender</label>
                <select
                  value={consultGender}
                  onChange={(e) => setConsultGender(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Vitals Input */}
            <div className="space-y-1.5">
              <label className="block font-bold text-slate-700 text-xs">Clinical Vitals Recorded at OPD Visit</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block">BP (mmHg)</span>
                  <input
                    type="text"
                    value={bp}
                    onChange={(e) => setBp(e.target.value)}
                    placeholder="120/80"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block">Pulse (BPM)</span>
                  <input
                    type="number"
                    value={pulse}
                    onChange={(e) => setPulse(parseInt(e.target.value) || 0)}
                    placeholder="75"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block">Temp (°F)</span>
                  <input
                    type="number"
                    step="0.1"
                    value={temp}
                    onChange={(e) => setTemp(parseFloat(e.target.value) || 98.6)}
                    placeholder="98.6"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block">SpO2 Oxygen (%)</span>
                  <input
                    type="number"
                    value={spO2Val}
                    onChange={(e) => setSpO2Val(parseFloat(e.target.value) || 98)}
                    placeholder="98"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Complaints & Diagnosis */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Chief Complaints & History</label>
                <textarea
                  rows={2}
                  value={chiefComplaints}
                  onChange={(e) => setChiefComplaints(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Clinical Diagnosis</label>
                <textarea
                  rows={2}
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                />
              </div>
            </div>

            {/* Prescribed Medications Form */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <Pill className="w-4 h-4 text-emerald-600" />
                  Prescribe Rx Medications
                </label>
                <span className="text-[11px] text-slate-500">{medList.length} items added</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <input
                  type="text"
                  placeholder="Medication Name"
                  value={medName}
                  onChange={(e) => setMedName(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs col-span-2 sm:col-span-1"
                />
                <input
                  type="text"
                  placeholder="Dosage (e.g. 500mg)"
                  value={medDosage}
                  onChange={(e) => setMedDosage(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
                />
                <input
                  type="text"
                  placeholder="Frequency (e.g. 1-0-1)"
                  value={medFrequency}
                  onChange={(e) => setMedFrequency(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddMedication}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  + Add Rx
                </button>
              </div>

              {/* Medication List */}
              {medList.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  {medList.map((m, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200 text-xs">
                      <span><strong>{m.name}</strong> ({m.dosage}) — {m.frequency} for {m.duration}</span>
                      <button onClick={() => handleRemoveMedication(idx)} className="text-red-500 font-bold hover:text-red-700">✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recommended Tests & Follow-Up */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Recommended Diagnostic Tests (Comma-separated)</label>
                <input
                  type="text"
                  value={recommendedTestsInput}
                  onChange={(e) => setRecommendedTestsInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Follow-up Date</label>
                <input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="block font-bold text-slate-700 mb-1">Doctor's Advice & Clinical Instructions</label>
              <textarea
                rows={2}
                value={doctorNotes}
                onChange={(e) => setDoctorNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowConsultationModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveConsultation}
                disabled={savingConsultation}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md shadow-emerald-600/20 cursor-pointer disabled:opacity-50"
              >
                {savingConsultation ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserCheck className="w-4 h-4" />}
                Save & Synchronize Health File
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: New Referral Creation Modal */}
      {showNewReferralModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Initiate Digital Patient Transfer Referral
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
