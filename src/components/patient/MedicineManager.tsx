import React, { useState } from 'react';
import {
  AlertTriangle,
  Bell,
  Camera,
  CheckCircle2,
  Clock,
  FileText,
  Loader2,
  Pill,
  Plus,
  ShieldAlert,
  Sparkles,
  Trash2,
  Upload,
} from 'lucide-react';
import { MedicineReminder } from '../../types';

export const MedicineManager: React.FC = () => {
  const [reminders, setReminders] = useState<MedicineReminder[]>([]);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [prescriptionText, setPrescriptionText] = useState('');
  const [ocrResult, setOcrResult] = useState<any>(null);

  // Add Medicine Modal State
  const [showAddMedModal, setShowAddMedModal] = useState(false);
  const [medName, setMedName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('Once Daily');
  const [timing, setTiming] = useState('After Meals');
  const [prescribedBy, setPrescribedBy] = useState('');

  const toggleTaken = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, takenToday: !r.takenToday } : r))
    );
  };

  const handleDeleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  const handleAddMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medName) return;

    const newMed: MedicineReminder = {
      id: 'med-' + Date.now(),
      name: medName,
      dosage: dosage || '1 Tablet',
      frequency,
      timing,
      times: ['08:00 AM'],
      active: true,
      takenToday: false,
      prescribedBy: prescribedBy || 'Self Scheduled',
    };

    setReminders((prev) => [newMed, ...prev]);
    setShowAddMedModal(false);
    setMedName('');
    setDosage('');
    setPrescribedBy('');
  };

  const handleRunOCR = async (text?: string, base64Image?: string) => {
    setOcrLoading(true);
    try {
      const res = await fetch('/api/ai/ocr-medicine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          textContent: text || prescriptionText || 'Amlodipine 5mg once daily morning. Atorvastatin 10mg night.',
          imageBase64: base64Image,
          currentMedications: reminders.map((r) => `${r.name} ${r.dosage}`).join(', '),
        }),
      });
      const data = await res.json();
      setOcrResult(data);
    } catch (err) {
      console.error('OCR Error:', err);
    } finally {
      setOcrLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleRunOCR(undefined, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-rose-500/20 border border-rose-400/30 text-rose-300 px-3 py-1 rounded-full text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            Gemini Multimodal OCR & Drug Safety Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Smart Medicine Manager & Alarms
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm">
            Scan physical prescription slips or pill labels with AI vision. Automatically schedule dosage alarms and cross-check severe drug interactions.
          </p>
        </div>

        <button
          onClick={() => setShowAddMedModal(true)}
          className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold rounded-xl flex items-center gap-2 shadow-lg shrink-0 cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" />
          + Add New Medicine
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Medicine Schedule & Alarms Panel */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Pill className="w-5 h-5 text-rose-600" />
              Active Daily Medication Schedule
            </h2>
            <span className="text-xs font-bold text-slate-500">
              {reminders.filter((r) => r.takenToday).length} of {reminders.length} Taken Today
            </span>
          </div>

          {reminders.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-2">
              <Pill className="w-8 h-8 text-slate-400 mx-auto" />
              <span className="text-xs font-bold text-slate-700 block">No Active Medicine Reminders</span>
              <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                Click "+ Add New Medicine" above or upload a prescription slip to automatically populate your daily schedule.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {reminders.map((med) => (
                <div
                  key={med.id}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                    med.takenToday
                      ? 'bg-slate-50 border-slate-200 opacity-80'
                      : 'bg-white border-slate-200 hover:border-rose-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleTaken(med.id)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                        med.takenToday
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600'
                      }`}
                    >
                      <CheckCircle2 className="w-5 h-5" />
                    </button>

                    <div>
                      <h3
                        className={`text-sm font-extrabold ${
                          med.takenToday ? 'line-through text-slate-500' : 'text-slate-900'
                        }`}
                      >
                        {med.name} <span className="text-xs font-semibold text-slate-500">({med.dosage})</span>
                      </h3>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <span>{med.frequency}</span>
                        <span>•</span>
                        <span>{med.timing}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold bg-slate-100 px-2.5 py-1 rounded-lg text-slate-700">
                      {med.times.join(', ')}
                    </span>
                    <button
                      onClick={() => handleDeleteReminder(med.id)}
                      className="text-slate-400 hover:text-red-600 cursor-pointer p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* OCR Scanner */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Camera className="w-5 h-5 text-rose-600" />
              Prescription OCR & Interaction Scanner
            </h2>
            <p className="text-xs text-slate-500">Upload prescription image or paste doctor notes</p>
          </div>

          <div className="space-y-3 text-xs">
            <label className="block p-4 border-2 border-dashed border-rose-200 rounded-2xl bg-rose-50/50 hover:bg-rose-50 text-center cursor-pointer transition-all">
              <Upload className="w-6 h-6 text-rose-500 mx-auto mb-1" />
              <span className="font-bold text-slate-800 block">Upload Prescription Photo / PDF</span>
              <span className="text-[10px] text-slate-500">JPG, PNG, PDF up to 10MB</span>
              <input type="file" accept="image/*,.pdf" onChange={handleFileUpload} className="hidden" />
            </label>

            <div>
              <span className="font-bold text-slate-700 block mb-1">Or paste prescription text:</span>
              <textarea
                rows={3}
                value={prescriptionText}
                onChange={(e) => setPrescriptionText(e.target.value)}
                placeholder="Paste medicines e.g. Metformin 500mg BD..."
                className="w-full p-2.5 border border-slate-300 rounded-xl text-xs"
              />
            </div>

            <button
              onClick={() => handleRunOCR()}
              disabled={ocrLoading}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
            >
              {ocrLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {ocrLoading ? 'Scanning Prescription...' : 'Analyze Prescription & Safety'}
            </button>

            {ocrResult && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="font-bold text-slate-900 block">Scan Analysis Result:</span>
                <pre className="text-[10px] text-slate-700 font-mono overflow-x-auto whitespace-pre-wrap">{JSON.stringify(ocrResult, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Medicine Modal */}
      {showAddMedModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleAddMedicine} className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-slate-900">Add New Medicine Reminder</h3>
              <button type="button" onClick={() => setShowAddMedModal(false)} className="text-slate-400 font-bold text-sm">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Medicine Name *</label>
                <input type="text" required value={medName} onChange={(e) => setMedName(e.target.value)} placeholder="e.g. Paracetamol 500mg" className="w-full p-2.5 border rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">Dosage</label>
                  <input type="text" value={dosage} onChange={(e) => setDosage(e.target.value)} placeholder="e.g. 1 Tablet" className="w-full p-2.5 border rounded-xl" />
                </div>
                <div>
                  <label className="font-bold block mb-1">Timing</label>
                  <select value={timing} onChange={(e) => setTiming(e.target.value)} className="w-full p-2.5 border rounded-xl">
                    <option value="After Meals">After Meals</option>
                    <option value="Before Meals">Before Meals</option>
                    <option value="Bedtime">Bedtime</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="font-bold block mb-1">Prescribed By Doctor</label>
                <input type="text" value={prescribedBy} onChange={(e) => setPrescribedBy(e.target.value)} placeholder="e.g. Dr. Sarah Jenkins" className="w-full p-2.5 border rounded-xl" />
              </div>
            </div>

            <button type="submit" className="w-full py-2.5 bg-rose-600 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer">Save Medicine Reminder</button>
          </form>
        </div>
      )}
    </div>
  );
};
