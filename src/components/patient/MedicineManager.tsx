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
  Upload,
} from 'lucide-react';
import { sampleMedicineReminders } from '../../data/mockData';
import { MedicineReminder } from '../../types';

export const MedicineManager: React.FC = () => {
  const [reminders, setReminders] = useState<MedicineReminder[]>(sampleMedicineReminders);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [prescriptionText, setPrescriptionText] = useState('');
  const [ocrResult, setOcrResult] = useState<any>(null);

  const toggleTaken = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, takenToday: !r.takenToday } : r))
    );
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
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-rose-500/20 border border-rose-400/30 text-rose-300 px-3 py-1 rounded-full text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            Gemini Multimodal OCR & Drug Interaction Safety Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Smart Medicine Manager & Prescription Reader
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm">
            Scan physical prescription slips or pill labels with AI vision. Automatically schedule dosage alarms and cross-check severe drug interactions.
          </p>
        </div>
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

          <div className="space-y-3">
            {reminders.map((med) => (
              <div
                key={med.id}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                  med.takenToday
                    ? 'bg-slate-50 border-slate-200 opacity-80'
                    : 'bg-white border-rose-200 shadow-xs hover:border-rose-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleTaken(med.id)}
                    className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
                      med.takenToday
                        ? 'bg-emerald-600 text-white'
                        : 'border-2 border-slate-300 hover:border-rose-500'
                    }`}
                  >
                    {med.takenToday && <CheckCircle2 className="w-5 h-5" />}
                  </button>

                  <div>
                    <h3 className={`text-sm font-bold ${med.takenToday ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                      {med.name} <span className="text-xs font-normal text-slate-500">({med.dosage})</span>
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1 font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                        <Clock className="w-3 h-3" />
                        {med.times.join(', ')}
                      </span>
                      <span>{med.timing}</span>
                    </div>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    med.takenToday
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {med.takenToday ? 'Completed' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Prescription OCR Reader Panel */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Camera className="w-5 h-5 text-rose-600" />
            AI Prescription OCR Scanner
          </h2>

          <div className="space-y-3">
            {/* Upload File Box */}
            <label className="border-2 border-dashed border-rose-200 hover:border-rose-400 bg-rose-50/40 rounded-2xl p-5 text-center block cursor-pointer transition-colors">
              <Upload className="w-8 h-8 text-rose-500 mx-auto mb-2" />
              <span className="text-xs font-bold text-slate-800 block">
                Upload Prescription Photo / Scan
              </span>
              <span className="text-[10px] text-slate-500">
                Supports JPG, PNG, PDF prescription slips
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <div className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              — Or Paste Prescription Text —
            </div>

            <textarea
              rows={3}
              value={prescriptionText}
              onChange={(e) => setPrescriptionText(e.target.value)}
              placeholder="e.g. Tab Metformin 500mg BD after meals x 30 days. Tab Lisinopril 10mg OD."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none"
            />

            <button
              onClick={() => handleRunOCR()}
              disabled={ocrLoading}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-rose-600/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {ocrLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Extracting Prescription via Gemini Vision...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Analyze Medications & Drug Interactions
                </>
              )}
            </button>
          </div>

          {/* OCR Results Display */}
          {ocrResult && (
            <div className="space-y-4 pt-3 border-t border-slate-200 animate-in fade-in">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Extracted Medications ({ocrResult.detectedMedications?.length || 0})
              </h3>

              <div className="space-y-2">
                {ocrResult.detectedMedications?.map((m: any, idx: number) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <div className="font-bold text-slate-900">{m.name} - {m.dosage}</div>
                    <div className="text-slate-600 mt-0.5">Frequency: {m.frequency} ({m.timing})</div>
                    <div className="text-[10px] text-slate-500 italic mt-1">Purpose: {m.purpose}</div>
                  </div>
                ))}
              </div>

              {/* Drug Interactions Safety Alert */}
              {ocrResult.drugInteractions && ocrResult.drugInteractions.length > 0 && (
                <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl space-y-1">
                  <div className="flex items-center gap-2 font-bold text-amber-900 text-xs">
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                    Drug Interaction Warning ({ocrResult.drugInteractions[0].severity})
                  </div>
                  <p className="text-xs text-amber-800">
                    {ocrResult.drugInteractions[0].warningText}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
