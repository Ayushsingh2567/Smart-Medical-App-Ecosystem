import React from 'react';
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  Hospital,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Truck,
  UserCheck,
  X,
} from 'lucide-react';

interface WorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReferralWorkflowModal: React.FC<WorkflowModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const steps = [
    {
      step: 1,
      title: 'Patient Arrives & Doctor Examination',
      icon: <Stethoscope className="w-5 h-5 text-blue-600" />,
      desc: 'Patient presents with acute symptoms. Attending doctor evaluates clinical condition.',
    },
    {
      step: 2,
      title: 'Treatment Capability Check',
      icon: <AlertCircle className="w-5 h-5 text-amber-600" />,
      desc: 'If local ICU/specialist capacity is insufficient, doctor initiates a Digital Referral Workflow.',
    },
    {
      step: 3,
      title: 'Digital Referral & Medical Record Attachment',
      icon: <FileText className="w-5 h-5 text-indigo-600" />,
      desc: 'ABHA Health ID, blood vitals, EKG scans, and lab reports are securely attached to the referral bundle.',
    },
    {
      step: 4,
      title: 'Real-Time Bed Availability Check',
      icon: <Hospital className="w-5 h-5 text-teal-600" />,
      desc: 'System queries network hospitals for live ICU, Ventilator, and Oxygen bed counts in real time.',
    },
    {
      step: 5,
      title: 'AI Smart Hospital Recommendation',
      icon: <Sparkles className="w-5 h-5 text-purple-600" />,
      desc: 'Gemini AI evaluates distance, required clinical equipment, bed availability, and specialist readiness.',
    },
    {
      step: 6,
      title: 'Receiving Hospital Review Desk',
      icon: <UserCheck className="w-5 h-5 text-emerald-600" />,
      desc: 'Receiving ER doctors review full attached digital records and hit Accept, reserving the bed instantly.',
    },
    {
      step: 7,
      title: 'Automatic ALS Ambulance Dispatch',
      icon: <Truck className="w-5 h-5 text-rose-600" />,
      desc: 'Nearest ALS/BLS Ambulance is dispatched with GPS route tracking sent to both hospitals.',
    },
    {
      step: 8,
      title: 'Admission & Immutable Audit Logging',
      icon: <ShieldCheck className="w-5 h-5 text-slate-800" />,
      desc: 'Patient arrives, records sync to receiving ER monitors, patient is admitted, and audit log closes.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl border border-slate-200 relative my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-700 rounded-xl border border-blue-200">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Smart Digital Hospital Referral & Triage Workflow
              </h2>
              <p className="text-xs text-slate-500">
                End-to-End Clinical Transfer, AI Bed Matching & Live GPS Transport Loop
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Interactive Diagram Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {steps.map((s) => (
            <div
              key={s.step}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-300 hover:shadow-md transition-all flex gap-3"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-800 shadow-xs">
                {s.step}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {s.icon}
                  <h3 className="text-sm font-bold text-slate-900">{s.title}</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer info box */}
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl p-4 border border-teal-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <p className="text-xs text-slate-700">
              <span className="font-bold">Ecosystem Standard:</span> Fully integrated with ABHA health standards, real-time WebSocket bed updates, and automated emergency triage.
            </p>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex-shrink-0 cursor-pointer"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
