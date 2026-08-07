import React, { useState } from 'react';
import {
  Activity,
  AlertOctagon,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock,
  HeartPulse,
  HelpCircle,
  Loader2,
  ShieldAlert,
  Sparkles,
  Stethoscope,
  User,
} from 'lucide-react';
import { SymptomEvaluation } from '../../types';

export const SymptomChecker: React.FC = () => {
  const [symptoms, setSymptoms] = useState('');
  const [selectedBodyArea, setSelectedBodyArea] = useState('Chest / Heart');
  const [duration, setDuration] = useState('2 hours');
  const [age, setAge] = useState(42);
  const [preexistingConditions, setPreexistingConditions] = useState('Hypertension');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SymptomEvaluation | null>(null);

  const quickSymptoms = [
    'Chest Pain / Tightness',
    'Shortness of Breath',
    'Sudden Severe Headache',
    'High Fever & Chills',
    'Abdominal Pain (Right Lower Quad)',
    'Dizziness & Confusion',
    'Persistent Cough & Fatigue',
  ];

  const handleEvaluate = async () => {
    const querySymptoms = symptoms.trim() || selectedBodyArea;
    if (!querySymptoms) return;

    setLoading(true);
    try {
      const res = await fetch('/api/ai/symptom-checker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptoms: `${selectedBodyArea}: ${querySymptoms}`,
          duration,
          age,
          gender: 'Male',
          preexistingConditions,
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error('Symptom evaluation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTriageBadge = (level?: string) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'URGENT':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'MODERATE':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 px-3 py-1 rounded-full text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Gemini Clinical Triage Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            AI Symptom Checker & Clinical Assessment
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Evaluate your symptoms instantly using evidence-based medical algorithms. Get triage urgency scoring, differential diagnostic probabilities, and recommended specialist guidance.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Panel */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Stethoscope className="w-5 h-5 text-blue-600" />
            Describe Symptoms & Vitals
          </h2>

          {/* Quick Body Area Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Body Area / Focus Region
            </label>
            <select
              value={selectedBodyArea}
              onChange={(e) => setSelectedBodyArea(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
            >
              <option value="Chest / Heart">Chest / Heart / Circulation</option>
              <option value="Head & Neurological">Head / Brain / Neurological</option>
              <option value="Lungs & Respiratory">Lungs / Airway / Breathing</option>
              <option value="Abdomen & Digestion">Abdomen / Stomach / Gastro</option>
              <option value="Muscles & Joints">Muscles / Bone / Joint Pain</option>
              <option value="General Fever & Fatigue">General / Fever / Systemic</option>
            </select>
          </div>

          {/* Quick Symptoms Chips */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">
              Frequent Symptom Selectors
            </label>
            <div className="flex flex-wrap gap-1.5">
              {quickSymptoms.map((qs) => (
                <button
                  key={qs}
                  onClick={() => setSymptoms((prev) => (prev ? `${prev}, ${qs}` : qs))}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                >
                  + {qs}
                </button>
              ))}
            </div>
          </div>

          {/* Symptom Text Details */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Detailed Description & Severity
            </label>
            <textarea
              rows={3}
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="e.g. Sharp squeezing pressure behind breastbone radiating to left arm with cold sweats..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Additional Parameters */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Duration
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Patient Age
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Pre-existing Medical History
            </label>
            <input
              type="text"
              value={preexistingConditions}
              onChange={(e) => setPreexistingConditions(e.target.value)}
              placeholder="e.g. Asthma, Hypertension, Diabetes"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800"
            />
          </div>

          {/* Submit Action Button */}
          <button
            onClick={handleEvaluate}
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing Clinical Schema...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Run AI Clinical Triage Assessment
              </>
            )}
          </button>
        </div>

        {/* Evaluation Output Panel */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          {!result && !loading && (
            <div className="py-20 text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <HeartPulse className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-700">
                Awaiting Symptom Parameters
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Select your symptoms on the left to trigger the AI Clinical Assessment engine.
              </p>
            </div>
          )}

          {loading && (
            <div className="py-20 text-center space-y-4">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto" />
              <p className="text-xs font-bold text-slate-700">
                Processing clinical differential algorithms via Gemini 3.6...
              </p>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-6">
              {/* Triage Urgency Header */}
              <div
                className={`p-4 rounded-2xl border flex items-center justify-between ${getTriageBadge(
                  result.triageLevel
                )}`}
              >
                <div className="flex items-center gap-3">
                  <ShieldAlert className="w-6 h-6 flex-shrink-0" />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest block opacity-75">
                      Triage Category
                    </span>
                    <h3 className="text-lg font-black tracking-tight">
                      {result.triageLevel} URGENCY
                    </h3>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold block opacity-75">
                    Recommended Specialist
                  </span>
                  <span className="text-xs font-extrabold bg-white/80 px-2.5 py-1 rounded-lg">
                    {result.recommendedSpecialist}
                  </span>
                </div>
              </div>

              {/* Immediate Action Needed */}
              <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-1">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                  <AlertOctagon className="w-4 h-4" />
                  Recommended Immediate Protocol
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {result.immediateAction}
                </p>
              </div>

              {/* Differential Diagnoses Probabilities */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Differential Diagnostic Probabilities
                </h4>
                <div className="space-y-3">
                  {result.possibleConditions?.map((cond, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-900">
                          {cond.name}
                        </span>
                        <span className="text-xs font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {cond.probabilityPercent}% Probability
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full mb-2 overflow-hidden">
                        <div
                          className="bg-blue-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${cond.probabilityPercent}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-slate-600">{cond.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Red Flags & Home Care */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 space-y-2">
                  <h5 className="text-xs font-bold text-red-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    Red Flag Warnings
                  </h5>
                  <ul className="text-xs text-red-800 space-y-1 list-disc list-inside">
                    {result.redFlagWarnings?.map((rf, idx) => (
                      <li key={idx}>{rf}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
                  <h5 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Recommended Home Care
                  </h5>
                  <ul className="text-xs text-emerald-800 space-y-1 list-disc list-inside">
                    {result.homeCareTips?.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Suggested Diagnostic Tests */}
              {result.suggestedTests && result.suggestedTests.length > 0 && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <h5 className="text-xs font-bold text-slate-800 mb-2">
                    Suggested Confirmatory Diagnostic Tests:
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {result.suggestedTests.map((test, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-700 shadow-2xs"
                      >
                        🧪 {test}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
