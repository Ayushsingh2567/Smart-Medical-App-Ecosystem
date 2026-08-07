import React, { useState } from 'react';
import { Activity, CheckCircle2, FileText, Upload, Sparkles, User } from 'lucide-react';

export const LabStaffPortal: React.FC = () => {
  const [testName, setTestName] = useState('Lipid Profile & HbA1c');
  const [patientName, setPatientName] = useState('Alexander Wright');
  const [reportUploaded, setReportUploaded] = useState(false);

  const handleUploadReport = () => {
    setReportUploaded(true);
    setTimeout(() => setReportUploaded(false), 4000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-400/30 text-purple-300 px-3 py-1 rounded-full text-xs font-semibold mb-3">
            <Activity className="w-3.5 h-3.5 text-purple-400" />
            Central Diagnostics & Pathology Desk
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Laboratory Staff & Report Verification Desk
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm">
            Upload diagnostic blood work, EKG scans, and radiology reports. Gemini AI automatically extracts key biometric flags for patient health records.
          </p>
        </div>
      </div>

      {reportUploaded && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-3 text-xs text-emerald-900 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span className="font-bold">Diagnostic Report Uploaded & Biometrics Auto-Synced to ABHA Vault!</span>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Upload className="w-5 h-5 text-purple-600" />
          Upload & Auto-Parse Patient Lab Report
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Patient Name / ABHA ID</label>
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Test Name / Panel</label>
            <input
              type="text"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
            />
          </div>
        </div>

        <div className="border-2 border-dashed border-purple-200 bg-purple-50/30 p-8 rounded-2xl text-center space-y-2">
          <FileText className="w-10 h-10 text-purple-500 mx-auto" />
          <div className="text-xs font-bold text-slate-800">
            Drag & Drop PDF or Image Analyzer
          </div>
          <p className="text-[10px] text-slate-500">
            Automated OCR will extract Hemoglobin, HbA1c, Cholesterol, and Creatinine flags.
          </p>
          <button
            onClick={handleUploadReport}
            className="mt-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs shadow-md shadow-purple-600/20 cursor-pointer"
          >
            Upload & Sync Report
          </button>
        </div>
      </div>
    </div>
  );
};
