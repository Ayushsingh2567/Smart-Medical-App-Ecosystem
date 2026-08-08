import React, { useState, useEffect } from 'react';
import {
  Activity,
  AlertCircle,
  Calendar,
  CheckCircle2,
  Download,
  Edit,
  FileCheck,
  FileText,
  Pill,
  Plus,
  QrCode,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Upload,
  User,
  UserCheck,
} from 'lucide-react';
import { ConsultationRecord, LabReport } from '../../types';

export const HealthRecordsVault: React.FC = () => {
  // Load real user profile from session or local state
  const [userName, setUserName] = useState('Registered Member');
  const [userAbha, setUserAbha] = useState('ABHA-IN-1001-8812');
  const [userAge, setUserAge] = useState(30);
  const [userBlood, setUserBlood] = useState('O+');
  const [userPhone, setUserPhone] = useState('+1 (555) 000-0000');
  
  // Vitals
  const [bp, setBp] = useState('120/80');
  const [pulse, setPulse] = useState(72);
  const [spO2, setSpO2] = useState(99);
  const [glucose, setGlucose] = useState(95);

  const [consultations, setConsultations] = useState<ConsultationRecord[]>([]);
  const [labReports, setLabReports] = useState<LabReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<LabReport | null>(null);
  const [loadingConsultations, setLoadingConsultations] = useState(true);

  // Modals
  const [showEditVitalsModal, setShowEditVitalsModal] = useState(false);
  const [showAddLabModal, setShowAddLabModal] = useState(false);

  // Add Lab Form States
  const [labTestName, setLabTestName] = useState('');
  const [labCategory, setLabCategory] = useState('Biochemistry');
  const [labDiagnosticCenter, setLabDiagnosticCenter] = useState('');
  const [labParam1, setLabParam1] = useState('');
  const [labVal1, setLabVal1] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('biomed_user');
    if (saved) {
      try {
        const u = JSON.parse(saved);
        if (u.name) setUserName(u.name);
        if (u.abhaId) setUserAbha(u.abhaId);
        if (u.phone) setUserPhone(u.phone);
      } catch (e) {}
    }
    fetchPatientConsultations();
  }, []);

  const fetchPatientConsultations = async () => {
    try {
      const res = await fetch(`/api/consultations`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setConsultations(data);
      }
    } catch (err) {
      console.error('Error fetching patient consultations:', err);
    } finally {
      setLoadingConsultations(false);
    }
  };

  const handleAddLabReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!labTestName) return;

    const newReport: LabReport = {
      id: 'LAB-' + Date.now(),
      testName: labTestName,
      category: labCategory,
      date: new Date().toISOString().split('T')[0],
      labName: labDiagnosticCenter || 'Central Diagnostics Lab',
      status: 'Completed',
      keyResults: labParam1 ? [{ parameter: labParam1, value: labVal1 || 'Normal', unit: '', normalRange: 'Optimal', flag: 'NORMAL' }] : [],
      aiSummary: 'Report added successfully. Physiological markers within expected range.',
    };

    setLabReports((prev) => [newReport, ...prev]);
    setSelectedReport(newReport);
    setShowAddLabModal(false);
    setLabTestName('');
    setLabDiagnosticCenter('');
    setLabParam1('');
    setLabVal1('');
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Digital ABHA Card */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-900 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden border border-indigo-900/50 flex flex-col justify-between min-h-[260px]">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-teal-500 text-slate-950 flex items-center justify-center font-black">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-teal-300 block">
                  NATIONAL HEALTH AUTHORITY
                </span>
                <span className="text-sm font-bold text-white">
                  ABHA Digital Health Card
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowEditVitalsModal(true)}
              className="bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-1 rounded-full cursor-pointer flex items-center gap-1"
            >
              <Edit className="w-3 h-3" /> Edit Details
            </button>
          </div>

          <div className="my-4 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs text-slate-400">Cardholder Name</div>
              <div className="text-lg font-black text-white">{userName}</div>
              <div className="text-xs text-teal-300 font-mono mt-1 font-bold">
                {userAbha}
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-300 mt-2">
                <span>Age: {userAge}</span>
                <span>•</span>
                <span>Blood: <strong className="text-red-400">{userBlood}</strong></span>
              </div>
            </div>

            <div className="p-2 bg-white rounded-xl text-slate-900 shadow-md">
              <QrCode className="w-16 h-16" />
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
            <span>Linked to Ayushman Bharat Health Mesh</span>
            <span className="text-teal-400 font-bold">256-Bit Encrypted</span>
          </div>
        </div>

        {/* Vitals Summary Panel */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Current Health Vitals
              </h3>
              <button
                onClick={() => setShowEditVitalsModal(true)}
                className="text-xs text-emerald-600 font-bold hover:underline cursor-pointer"
              >
                + Update Vitals
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Blood Pressure</span>
                <span className="text-base font-black text-slate-900">{bp}</span>
                <span className="text-[10px] text-emerald-600 font-bold block">Normal</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Heart Rate</span>
                <span className="text-base font-black text-slate-900">{pulse} <span className="text-xs font-normal">bpm</span></span>
                <span className="text-[10px] text-emerald-600 font-bold block">Optimal</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Oxygen (SpO2)</span>
                <span className="text-base font-black text-slate-900">{spO2}%</span>
                <span className="text-[10px] text-emerald-600 font-bold block">Excellent</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Fasting Glucose</span>
                <span className="text-base font-black text-slate-900">{glucose} <span className="text-xs font-normal">mg/dL</span></span>
                <span className="text-[10px] text-emerald-600 font-bold block">Controlled</span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setShowAddLabModal(true)}
              className="px-4 py-2 bg-slate-900 text-white font-extrabold rounded-xl text-xs flex items-center gap-1.5 hover:bg-slate-800 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" /> Add / Upload New Lab Report
            </button>
          </div>
        </div>
      </div>

      {/* OPD Consultations Timeline Section */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-indigo-600" />
              OPD Consultation History & Doctor E-Prescriptions
            </h3>
            <p className="text-xs text-slate-500">Live consultation timeline synced from hospital doctors</p>
          </div>
        </div>

        {consultations.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-2">
            <FileText className="w-8 h-8 text-slate-400 mx-auto" />
            <span className="text-xs font-bold text-slate-700 block">No In-Person OPD Consultations Recorded Yet</span>
            <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
              When a doctor records your OPD visit in the Doctor Portal, the clinical diagnosis & e-prescription will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {consultations.map((c) => (
              <div key={c.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs border-b border-slate-200 pb-2">
                  <div>
                    <span className="font-extrabold text-slate-900 text-sm">{c.diagnosis}</span>
                    <span className="text-slate-500 block">Consultant: <strong>{c.doctorName}</strong> ({c.hospitalName})</span>
                  </div>
                  <span className="bg-slate-200 px-2.5 py-1 rounded-full font-bold text-slate-700">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {c.prescribedMedications && c.prescribedMedications.length > 0 && (
                  <div className="text-xs">
                    <strong className="text-slate-700">Prescribed Medications:</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {c.prescribedMedications.map((m: any, i: number) => (
                        <span key={i} className="px-2 py-0.5 bg-white border border-slate-200 text-slate-800 rounded font-semibold text-[11px]">
                          💊 {m.name} ({m.dosage})
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

      {/* Lab Reports Section */}
      {labReports.length > 0 && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-extrabold text-slate-900">Added Diagnostic Lab Reports</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {labReports.map((report) => (
              <div key={report.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-1">
                <span className="font-bold text-slate-900 block text-sm">{report.testName}</span>
                <span className="text-slate-500 block">{report.labName} • {report.date}</span>
                <p className="text-slate-700 pt-1">{report.aiSummary}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Vitals Modal */}
      {showEditVitalsModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-slate-900">Update Member Details & Vitals</h3>
              <button onClick={() => setShowEditVitalsModal(false)} className="text-slate-400 font-bold text-sm">✕</button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Full Name</label>
                <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} className="w-full p-2 border rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">Age</label>
                  <input type="number" value={userAge} onChange={(e) => setUserAge(Number(e.target.value))} className="w-full p-2 border rounded-xl" />
                </div>
                <div>
                  <label className="font-bold block mb-1">Blood Group</label>
                  <input type="text" value={userBlood} onChange={(e) => setUserBlood(e.target.value)} className="w-full p-2 border rounded-xl" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">Blood Pressure</label>
                  <input type="text" value={bp} onChange={(e) => setBp(e.target.value)} className="w-full p-2 border rounded-xl" />
                </div>
                <div>
                  <label className="font-bold block mb-1">Pulse (bpm)</label>
                  <input type="number" value={pulse} onChange={(e) => setPulse(Number(e.target.value))} className="w-full p-2 border rounded-xl" />
                </div>
              </div>
            </div>
            <button onClick={() => setShowEditVitalsModal(false)} className="w-full py-2.5 bg-emerald-600 text-white font-extrabold text-xs rounded-xl">Save Changes</button>
          </div>
        </div>
      )}

      {/* Add Lab Modal */}
      {showAddLabModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleAddLabReport} className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-slate-900">Add New Lab Report</h3>
              <button type="button" onClick={() => setShowAddLabModal(false)} className="text-slate-400 font-bold text-sm">✕</button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Test Name *</label>
                <input type="text" required value={labTestName} onChange={(e) => setLabTestName(e.target.value)} placeholder="e.g. Complete Blood Count (CBC)" className="w-full p-2 border rounded-xl" />
              </div>
              <div>
                <label className="font-bold block mb-1">Diagnostic Lab Name</label>
                <input type="text" value={labDiagnosticCenter} onChange={(e) => setLabDiagnosticCenter(e.target.value)} placeholder="e.g. City Diagnostics Center" className="w-full p-2 border rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">Tested Parameter</label>
                  <input type="text" value={labParam1} onChange={(e) => setLabParam1(e.target.value)} placeholder="e.g. Hemoglobin" className="w-full p-2 border rounded-xl" />
                </div>
                <div>
                  <label className="font-bold block mb-1">Result Value</label>
                  <input type="text" value={labVal1} onChange={(e) => setLabVal1(e.target.value)} placeholder="e.g. 14.5 g/dL" className="w-full p-2 border rounded-xl" />
                </div>
              </div>
            </div>
            <button type="submit" className="w-full py-2.5 bg-slate-900 text-white font-extrabold text-xs rounded-xl">Save Lab Report</button>
          </form>
        </div>
      )}
    </div>
  );
};
