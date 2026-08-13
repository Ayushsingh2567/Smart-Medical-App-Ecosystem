import React, { useState, useEffect } from 'react';
import {
  Activity,
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  FileSpreadsheet,
  FileText,
  Heart,
  Hospital,
  Loader2,
  Pill,
  Plus,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Trash2,
  Truck,
  User,
  UserCheck,
  Wind,
  X,
} from 'lucide-react';
import { DigitalReferral, ConsultationRecord } from '../../types';

export const DoctorPortal: React.FC = () => {
  const [activeDoctorTab, setActiveDoctorTab] = useState<'consultations' | 'referrals'>('consultations');
  const [referrals, setReferrals] = useState<DigitalReferral[]>([]);
  const [consultations, setConsultations] = useState<ConsultationRecord[]>([]);

  // Patient Record File Modal State for Doctors
  const [selectedPatientFile, setSelectedPatientFile] = useState<ConsultationRecord | null>(null);

  // Referral Modal state
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

  // Consultation Modal State
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  const [consultDoctorName, setConsultDoctorName] = useState('');
  const [consultHospitalName, setConsultHospitalName] = useState('');
  const [consultPatientName, setConsultPatientName] = useState('');
  const [consultAbhaId, setConsultAbhaId] = useState('');
  const [consultAge, setConsultAge] = useState<number | ''>('');
  const [consultGender, setConsultGender] = useState('Male');

  // Problem Details
  const [problemSeverity, setProblemSeverity] = useState<'MINOR' | 'MODERATE' | 'MAJOR' | 'CRITICAL'>('MODERATE');
  const [minorSymptoms, setMinorSymptoms] = useState('');
  const [majorDiseases, setMajorDiseases] = useState('');
  const [pastMedicalHistory, setPastMedicalHistory] = useState('');

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
      if (Array.isArray(data) && data.length > 0) {
        setConsultations(data);
      } else {
        // Sample default consultation record
        setConsultations([
          {
            id: 'cons-sample-1',
            patientName: 'Ayush Singh',
            patientAbhaId: 'ABHA-IN-1001-8812',
            patientAge: 30,
            patientGender: 'Male',
            doctorName: 'Dr. Sarah Jenkins, MD',
            doctorSpecialty: 'Cardiology & Interventional Care',
            hospitalName: 'City Central Super Specialty Hospital',
            problemSeverity: 'MODERATE',
            minorSymptoms: 'Intermittent shortness of breath, mild chest discomfort after stairs',
            majorDiseases: 'Hypertension Stage 1, Type 2 Diabetes Susceptibility',
            pastMedicalHistory: 'Family history of cardiovascular disease',
            chiefComplaints: 'Patient complains of exertion fatigue and elevated blood pressure readings',
            diagnosis: 'Pre-Hypertension & Mild Coronary Stress Risk',
            bloodPressure: '132/84',
            heartRate: 78,
            temperature: 98.6,
            spO2: 98,
            prescribedMedications: [
              { name: 'Amlodipine 5mg', dosage: '1 Tablet', frequency: '1-0-0 (Morning)', duration: '30 Days', instructions: 'After Breakfast' },
              { name: 'Metformin Hydrochloride 500mg', dosage: '1 Tablet', frequency: '1-0-1 (BD)', duration: '30 Days', instructions: 'After Meals' },
            ],
            recommendedTests: ['Lipid Profile', 'HbA1c Blood Glucose', '24-Hr Ambulatory BP Tracking'],
            doctorNotes: 'Advised 150 mins weekly aerobic exercise and DASH low sodium diet. Re-check BP in 4 weeks.',
            followUpDate: '2026-09-15',
            visitDate: '2026-08-13',
          },
        ]);
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
      const docNameVal = consultDoctorName || 'Dr. Sarah Jenkins, MD';

      const newConsultation: ConsultationRecord = {
        id: 'cons-' + Date.now(),
        patientName: consultPatientName,
        patientAbhaId: consultAbhaId || 'ABHA-' + Math.floor(1000 + Math.random() * 9000) + '-8812',
        patientAge: Number(consultAge) || 30,
        patientGender: consultGender,
        doctorName: docNameVal,
        doctorSpecialty: 'General Medicine & Multi-Specialty Care',
        hospitalName: consultHospitalName || 'City Central Super Specialty Hospital',
        problemSeverity,
        minorSymptoms,
        majorDiseases,
        pastMedicalHistory,
        chiefComplaints,
        diagnosis,
        bloodPressure: bp || '120/80',
        heartRate: Number(pulse) || 72,
        temperature: Number(temp) || 98.6,
        spO2: Number(spO2Val) || 99,
        prescribedMedications: medList,
        recommendedTests: recommendedTestsInput.split(',').map((t) => t.trim()).filter(Boolean),
        doctorNotes,
        followUpDate: followUpDate || '2026-09-15',
        visitDate: new Date().toISOString().split('T')[0],
      };

      // REAL CROSS-PORTAL SYNC: Push prescribed medicines to Patient Portal local storage
      if (medList.length > 0) {
        const existingRemindersStr = localStorage.getItem('biomed_reminders');
        const existingReminders = existingRemindersStr ? JSON.parse(existingRemindersStr) : [];

        const newReminders = medList.map((m, idx) => ({
          id: `med-rx-${Date.now()}-${idx}`,
          name: m.name,
          dosage: m.dosage,
          frequency: m.frequency,
          timing: m.instructions || 'After Meals',
          times: ['08:00 AM'],
          active: true,
          takenToday: false,
          prescribedBy: docNameVal,
        }));

        const merged = [...newReminders, ...existingReminders];
        localStorage.setItem('biomed_reminders', JSON.stringify(merged));

        // Save active Rx prescriptions for patient doorstep ordering
        const existingRxStr = localStorage.getItem('biomed_doctor_prescriptions');
        const existingRx = existingRxStr ? JSON.parse(existingRxStr) : [];
        const newRxList = medList.map((m) => ({
          ...m,
          doctorName: docNameVal,
          date: new Date().toISOString().split('T')[0],
        }));
        localStorage.setItem('biomed_doctor_prescriptions', JSON.stringify([...newRxList, ...existingRx]));
      }

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
      setMinorSymptoms('');
      setMajorDiseases('');
      setPastMedicalHistory('');
      setChiefComplaints('');
      setDiagnosis('');
      setMedList([]);
      setDoctorNotes('');

      alert(`Consultation saved! Prescribed medicines (${medList.length}) have been automatically synced to the Patient Portal for home delivery ordering.`);
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
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 px-3 py-1 rounded-full text-xs font-semibold mb-3">
            <Stethoscope className="w-3.5 h-3.5" />
            Physician OPD & Patient Medical File Workstation
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Doctor Clinical Portal & Patient Vault Sync
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
            Inspect complete patient medical files & vitals, write e-prescriptions that automatically sync to the Patient Portal, and manage hospital referrals.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setShowConsultationModal(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold rounded-2xl flex items-center gap-2 shadow-lg cursor-pointer transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            + New In-Person Consultation & e-Rx
          </button>
          <button
            onClick={() => setShowNewReferralModal(true)}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold rounded-2xl flex items-center gap-2 shadow-lg cursor-pointer transition-all active:scale-95"
          >
            <Send className="w-4 h-4" />
            Dispatch ER Referral
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
        <button
          onClick={() => setActiveDoctorTab('consultations')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeDoctorTab === 'consultations'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4 text-blue-400" />
          Patient Medical Files & OPD Prescriptions ({consultations.length})
        </button>
        <button
          onClick={() => setActiveDoctorTab('referrals')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeDoctorTab === 'referrals'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Hospital className="w-4 h-4 text-rose-400" />
          Emergency ER Hospital Referrals ({referrals.length})
        </button>
      </div>

      {/* CONSULTATIONS & PATIENT MEDICAL FILES LIST */}
      {activeDoctorTab === 'consultations' && (
        <div className="space-y-4">
          {consultations.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
              <Stethoscope className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-700">No Patient Consultations Recorded Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Click <strong>"+ New In-Person Consultation & e-Rx"</strong> to examine a patient, record symptoms, and prescribe medicines synced to the Patient Portal.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {consultations.map((cons) => (
                <div
                  key={cons.id}
                  className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4 flex flex-col justify-between hover:shadow-md transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-slate-900 text-base">{cons.patientName}</h3>
                          <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded">
                            {cons.patientAge}Y • {cons.patientGender}
                          </span>
                        </div>
                        <span className="text-xs font-mono font-bold text-teal-700 block mt-0.5">
                          {cons.patientAbhaId}
                        </span>
                      </div>

                      <span
                        className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase border ${
                          cons.problemSeverity === 'CRITICAL'
                            ? 'bg-red-100 text-red-800 border-red-300'
                            : cons.problemSeverity === 'MAJOR'
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : 'bg-blue-100 text-blue-800 border-blue-300'
                        }`}
                      >
                        {cons.problemSeverity} SEVERITY
                      </span>
                    </div>

                    {/* Vitals Summary */}
                    <div className="grid grid-cols-4 gap-1 text-center text-[10px] font-bold p-2 bg-slate-50 rounded-2xl border border-slate-200">
                      <div><span className="text-slate-400 block">BP</span><span className="text-slate-900">{cons.bloodPressure}</span></div>
                      <div><span className="text-slate-400 block">PULSE</span><span className="text-slate-900">{cons.heartRate} BPM</span></div>
                      <div><span className="text-slate-400 block">SpO2</span><span className="text-slate-900">{cons.spO2}%</span></div>
                      <div><span className="text-slate-400 block">TEMP</span><span className="text-slate-900">{cons.temperature}°F</span></div>
                    </div>

                    <div className="text-xs space-y-1">
                      <div className="font-bold text-slate-900">Diagnosis: <span className="text-blue-700 font-extrabold">{cons.diagnosis}</span></div>
                      {cons.minorSymptoms && <div className="text-slate-600 text-[11px]">Minor Symptoms: {cons.minorSymptoms}</div>}
                      {cons.majorDiseases && <div className="text-rose-700 text-[11px] font-semibold">Major Chronic Disease: {cons.majorDiseases}</div>}
                    </div>

                    {/* Prescribed Medicines Badge */}
                    {cons.prescribedMedications && cons.prescribedMedications.length > 0 && (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1 text-xs">
                        <span className="font-extrabold text-emerald-900 text-[11px] flex items-center gap-1">
                          <Pill className="w-3.5 h-3.5 text-emerald-600" /> Prescribed Rx Medicines (Synced with Patient Portal):
                        </span>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {cons.prescribedMedications.map((m, idx) => (
                            <span key={idx} className="bg-white text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-300">
                              💊 {m.name} ({m.dosage})
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-[10px] text-slate-400">Date: {cons.visitDate}</span>
                    <button
                      onClick={() => setSelectedPatientFile(cons)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
                    >
                      <Eye className="w-3.5 h-3.5 text-teal-300" />
                      View Full Patient File & History
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* REFERRALS TAB */}
      {activeDoctorTab === 'referrals' && (
        <div className="space-y-4">
          {referrals.map((ref) => (
            <div key={ref.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between text-xs">
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">{ref.patientName} ({ref.patientAge}Y)</h4>
                <p className="text-slate-500 mt-0.5">Referred to: <strong>{ref.receivingHospitalName}</strong> • {ref.requiredBedType.toUpperCase()} BED</p>
                <p className="text-slate-600 italic mt-1">"{ref.medicalSummary}"</p>
              </div>
              <span className="bg-amber-100 text-amber-800 font-bold px-3 py-1 rounded-full text-[10px]">
                {ref.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* MODAL 1: FULL PATIENT MEDICAL FILE & HISTORY (DOCTOR VIEW) */}
      {selectedPatientFile && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 text-slate-900 border border-slate-200 my-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold">
                  <User className="w-6 h-6 text-teal-300" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Patient Vault File: {selectedPatientFile.patientName}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    ABHA ID: {selectedPatientFile.patientAbhaId} • {selectedPatientFile.patientAge}Y, {selectedPatientFile.patientGender}
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedPatientFile(null)} className="text-slate-400 font-bold text-sm hover:text-slate-800 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Vitals Grid */}
              <div className="grid grid-cols-4 gap-2 text-center p-3 bg-slate-50 rounded-2xl border border-slate-200 font-bold">
                <div><span className="text-slate-400 block text-[10px]">BP</span><span className="text-slate-900 text-sm font-black">{selectedPatientFile.bloodPressure}</span></div>
                <div><span className="text-slate-400 block text-[10px]">PULSE</span><span className="text-slate-900 text-sm font-black">{selectedPatientFile.heartRate} BPM</span></div>
                <div><span className="text-slate-400 block text-[10px]">SpO2</span><span className="text-slate-900 text-sm font-black">{selectedPatientFile.spO2}%</span></div>
                <div><span className="text-slate-400 block text-[10px]">TEMP</span><span className="text-slate-900 text-sm font-black">{selectedPatientFile.temperature}°F</span></div>
              </div>

              <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-2xl space-y-2">
                <span className="font-extrabold text-blue-900 block text-sm">Clinical Diagnosis & Findings</span>
                <p className="text-slate-800 font-semibold">{selectedPatientFile.diagnosis}</p>
                {selectedPatientFile.chiefComplaints && <p className="text-slate-600">Chief Complaints: {selectedPatientFile.chiefComplaints}</p>}
                {selectedPatientFile.doctorNotes && <p className="text-slate-600 italic">Doctor Notes: {selectedPatientFile.doctorNotes}</p>}
              </div>

              {/* Minor & Major Problem Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                  <span className="font-bold text-slate-800 block text-[11px]">Minor Symptoms Reported</span>
                  <p className="text-slate-700">{selectedPatientFile.minorSymptoms || 'None reported'}</p>
                </div>

                <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl space-y-1">
                  <span className="font-bold text-rose-900 block text-[11px]">Major Chronic Diseases</span>
                  <p className="text-rose-950 font-semibold">{selectedPatientFile.majorDiseases || 'None recorded'}</p>
                </div>
              </div>

              {/* Prescribed Medications */}
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
                <span className="font-extrabold text-emerald-950 block">Prescribed Rx Medications (Synced to Patient Portal)</span>
                {selectedPatientFile.prescribedMedications.map((m, idx) => (
                  <div key={idx} className="p-2.5 bg-white rounded-xl border border-emerald-200 flex items-center justify-between">
                    <div>
                      <span className="font-extrabold text-slate-900 block">{m.name} ({m.dosage})</span>
                      <span className="text-[10px] text-slate-500">{m.frequency} • {m.duration} • {m.instructions}</span>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                      ACTIVE RX
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedPatientFile(null)}
                className="px-5 py-2.5 bg-slate-900 text-white font-extrabold rounded-xl text-xs cursor-pointer"
              >
                Close Patient File
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: IN-PERSON CONSULTATION & E-RX CREATION MODAL */}
      {showConsultationModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-5 text-slate-900 border border-slate-200 my-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-blue-600" />
                New Patient Consultation & e-Prescription (Auto-Sync to Patient Portal)
              </h3>
              <button onClick={() => setShowConsultationModal(false)} className="text-slate-400 font-bold text-sm hover:text-slate-800 cursor-pointer">
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs max-h-[70vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Patient Full Name *</label>
                  <input
                    type="text"
                    required
                    value={consultPatientName}
                    onChange={(e) => setConsultPatientName(e.target.value)}
                    placeholder="e.g. Ayush Singh"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ABHA Health ID</label>
                  <input
                    type="text"
                    value={consultAbhaId}
                    onChange={(e) => setConsultAbhaId(e.target.value)}
                    placeholder="e.g. ABHA-IN-1001-8812"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Age</label>
                  <input
                    type="number"
                    value={consultAge}
                    onChange={(e) => setConsultAge(Number(e.target.value))}
                    placeholder="30"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Gender</label>
                  <select
                    value={consultGender}
                    onChange={(e) => setConsultGender(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Problem Severity</label>
                  <select
                    value={problemSeverity}
                    onChange={(e) => setProblemSeverity(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-bold"
                  >
                    <option value="MINOR">Minor Problem</option>
                    <option value="MODERATE">Moderate Problem</option>
                    <option value="MAJOR">Major Disease</option>
                    <option value="CRITICAL">Critical Emergency</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Minor Symptoms & Complaints</label>
                <input
                  type="text"
                  value={minorSymptoms}
                  onChange={(e) => setMinorSymptoms(e.target.value)}
                  placeholder="e.g. Mild headache, fever (100°F), cough for 2 days"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Major Chronic Diseases / Conditions</label>
                <input
                  type="text"
                  value={majorDiseases}
                  onChange={(e) => setMajorDiseases(e.target.value)}
                  placeholder="e.g. Stage 1 Hypertension, Type 2 Diabetes, Asthma"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Clinical Diagnosis *</label>
                <input
                  type="text"
                  required
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="e.g. Essential Pre-Hypertension & Upper Respiratory Infection"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                />
              </div>

              {/* Vitals Input Grid */}
              <div className="grid grid-cols-4 gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500">BP (mmHg)</label>
                  <input type="text" value={bp} onChange={(e) => setBp(e.target.value)} placeholder="120/80" className="w-full px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500">PULSE (BPM)</label>
                  <input type="number" value={pulse} onChange={(e) => setPulse(Number(e.target.value))} placeholder="72" className="w-full px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500">TEMP (°F)</label>
                  <input type="number" value={temp} onChange={(e) => setTemp(Number(e.target.value))} placeholder="98.6" className="w-full px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500">SpO2 (%)</label>
                  <input type="number" value={spO2Val} onChange={(e) => setSpO2Val(Number(e.target.value))} placeholder="99" className="w-full px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs" />
                </div>
              </div>

              {/* Prescribe Medicines (Auto-Synced to Patient Portal) */}
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3">
                <span className="font-extrabold text-emerald-950 block text-xs flex items-center gap-1.5">
                  <Pill className="w-4 h-4 text-emerald-600" />
                  Prescribe e-Rx Medications (Auto-Synced with Patient Portal)
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={medName}
                    onChange={(e) => setMedName(e.target.value)}
                    placeholder="Medicine Name (e.g. Amlodipine 5mg)"
                    className="px-3 py-1.5 bg-white border border-emerald-300 rounded-xl text-xs"
                  />
                  <input
                    type="text"
                    value={medDosage}
                    onChange={(e) => setMedDosage(e.target.value)}
                    placeholder="Dosage (e.g. 1 Tablet)"
                    className="px-3 py-1.5 bg-white border border-emerald-300 rounded-xl text-xs"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <select value={medFrequency} onChange={(e) => setMedFrequency(e.target.value)} className="flex-1 px-3 py-1.5 bg-white border border-emerald-300 rounded-xl text-xs">
                    <option value="1-0-0 (Morning)">1-0-0 (Morning)</option>
                    <option value="1-0-1 (BD)">1-0-1 (Morning & Night)</option>
                    <option value="1-1-1 (TDS)">1-1-1 (Three Times Daily)</option>
                  </select>
                  <button
                    type="button"
                    onClick={handleAddMedication}
                    className="px-3 py-1.5 bg-emerald-600 text-white font-bold rounded-xl text-xs shrink-0 cursor-pointer"
                  >
                    + Add Rx
                  </button>
                </div>

                {medList.length > 0 && (
                  <div className="space-y-1.5 pt-2">
                    {medList.map((m, i) => (
                      <div key={i} className="p-2 bg-white rounded-xl border border-emerald-200 flex items-center justify-between">
                        <span className="font-bold text-slate-900">{m.name} - {m.dosage} ({m.frequency})</span>
                        <button type="button" onClick={() => handleRemoveMedication(i)} className="text-red-500 font-bold text-xs">✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Doctor Notes & Lifestyle Advice</label>
                <textarea
                  rows={2}
                  value={doctorNotes}
                  onChange={(e) => setDoctorNotes(e.target.value)}
                  placeholder="Advice for patient..."
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <button
                type="button"
                onClick={handleSaveConsultation}
                disabled={savingConsultation}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
              >
                {savingConsultation ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                Save Consultation & Sync Prescriptions to Patient Portal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REFERRAL CREATION MODAL */}
      {showNewReferralModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-4 text-slate-900 border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Send className="w-5 h-5 text-rose-600" />
                Dispatch Emergency Hospital Referral
              </h3>
              <button onClick={() => setShowNewReferralModal(false)} className="text-slate-400 font-bold text-sm">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Patient Name *</label>
                <input type="text" value={patientName} onChange={(e) => setPatientName(e.target.value)} placeholder="Patient Name" className="w-full px-3 py-2 rounded-xl border border-slate-300" />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Medical Summary *</label>
                <textarea rows={3} value={medicalSummary} onChange={(e) => setMedicalSummary(e.target.value)} placeholder="Condition summary..." className="w-full p-3 rounded-xl border border-slate-300" />
              </div>

              <button type="button" onClick={handleCreateReferral} className="w-full py-3 bg-rose-600 text-white font-extrabold rounded-2xl text-xs">
                Submit Referral Dispatch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
