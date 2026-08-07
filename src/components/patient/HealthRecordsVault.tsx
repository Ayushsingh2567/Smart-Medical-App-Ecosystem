import React, { useState } from 'react';
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  Download,
  FileCheck,
  FileText,
  QrCode,
  ShieldCheck,
  Sparkles,
  Upload,
  User,
} from 'lucide-react';
import { initialPatientProfile, sampleLabReports } from '../../data/mockData';

export const HealthRecordsVault: React.FC = () => {
  const [patient] = useState(initialPatientProfile);
  const [labReports] = useState(sampleLabReports);
  const [selectedReport, setSelectedReport] = useState(labReports[0]);

  return (
    <div className="space-y-6">
      {/* ABHA Health ID Digital Card Header */}
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
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-1 rounded-full">
              VERIFIED
            </span>
          </div>

          <div className="my-4 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs text-slate-400">Cardholder Name</div>
              <div className="text-lg font-black text-white">{patient.name}</div>
              <div className="text-xs text-teal-300 font-mono mt-1 font-bold">
                {patient.abhaId}
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-300 mt-2">
                <span>Age: {patient.age}</span>
                <span>•</span>
                <span>Blood: <strong className="text-red-400">{patient.bloodGroup}</strong></span>
              </div>
            </div>

            {/* QR Code Graphic */}
            <div className="p-2 bg-white rounded-xl text-slate-900 shadow-md">
              <QrCode className="w-16 h-16" />
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
            <span>Linked to PM-JAY & Ayushman Bharat Mesh</span>
            <span className="text-teal-400 font-bold">Encrypted 256-Bit</span>
          </div>
        </div>

        {/* Vitals Summary & Upload Panel */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-600" />
                Latest Synchronized Vitals & Clinical History
              </h2>
              <span className="text-xs text-slate-500">{patient.vitals.lastUpdated}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Blood Pressure</span>
                <span className="text-base font-black text-slate-900">{patient.vitals.bloodPressure}</span>
                <span className="text-[10px] text-slate-500 block">mmHg</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Heart Rate</span>
                <span className="text-base font-black text-slate-900">{patient.vitals.heartRate}</span>
                <span className="text-[10px] text-slate-500 block">BPM</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">SpO2 Oxygen</span>
                <span className="text-base font-black text-emerald-700">{patient.vitals.spO2}%</span>
                <span className="text-[10px] text-emerald-600 block">Normal Range</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Blood Glucose</span>
                <span className="text-base font-black text-amber-700">{patient.vitals.bloodGlucose}</span>
                <span className="text-[10px] text-amber-600 block">mg/dL</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md shadow-indigo-600/20 transition-all cursor-pointer">
              <Upload className="w-4 h-4" />
              Upload Medical Report / Scan (PDF/Image)
            </button>
          </div>
        </div>
      </div>

      {/* Lab Reports & AI Diagnostic Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Lab Reports List */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <FileText className="w-5 h-5 text-indigo-600" />
            Digital Diagnostic Reports
          </h2>

          <div className="space-y-3">
            {labReports.map((report) => (
              <div
                key={report.id}
                onClick={() => setSelectedReport(report)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedReport.id === report.id
                    ? 'bg-indigo-50/70 border-indigo-400 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-indigo-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900">
                    {report.testName}
                  </span>
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
                    {report.date}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">{report.labName}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Report AI Breakdown */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {selectedReport.testName}
              </h3>
              <p className="text-xs text-slate-500">{selectedReport.labName} • {selectedReport.date}</p>
            </div>
            <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer">
              <Download className="w-3.5 h-3.5" />
              Download Report
            </button>
          </div>

          {/* Gemini AI Lab Interpretation Box */}
          {selectedReport.aiSummary && (
            <div className="p-4 bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-2xl space-y-1 shadow-md">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
                <Sparkles className="w-4 h-4" />
                Gemini Clinical Lab Interpretation
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                {selectedReport.aiSummary}
              </p>
            </div>
          )}

          {/* Key Result Parameters Table */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              Biometric Test Parameters
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold">
                    <th className="py-2 px-3">Parameter</th>
                    <th className="py-2 px-3">Result</th>
                    <th className="py-2 px-3">Normal Range</th>
                    <th className="py-2 px-3 text-right">Status Flag</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedReport.keyResults.map((param, i) => (
                    <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-semibold text-slate-900">
                        {param.parameter}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-slate-800">
                        {param.value} {param.unit}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500">{param.normalRange}</td>
                      <td className="py-2.5 px-3 text-right">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                            param.flag === 'HIGH' || param.flag === 'CRITICAL'
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          }`}
                        >
                          {param.flag}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
