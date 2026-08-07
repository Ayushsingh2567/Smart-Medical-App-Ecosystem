import React, { useState } from 'react';
import {
  Activity,
  AlertCircle,
  BarChart2,
  CheckCircle2,
  Heart,
  Loader2,
  Scale,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';
import { RiskPredictionResult } from '../../types';

export const RiskPrediction: React.FC = () => {
  const [age, setAge] = useState(42);
  const [bmi, setBmi] = useState(26.8);
  const [systolicBP, setSystolicBP] = useState(132);
  const [diastolicBP, setDiastolicBP] = useState(84);
  const [bloodGlucose, setBloodGlucose] = useState(108);
  const [smoking, setSmoking] = useState(false);
  const [exerciseDays, setExerciseDays] = useState(2);
  const [familyHistory, setFamilyHistory] = useState('Hypertension & Type 2 Diabetes');

  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<RiskPredictionResult | null>({
    overallHealthScore: 78,
    cardiovascularRisk: {
      level: 'Moderate',
      percent: 24,
      keyDriver: 'Elevated Systolic BP (132 mmHg) & BMI (26.8)',
    },
    diabetesRisk: {
      level: 'Moderate',
      percent: 28,
      keyDriver: 'Fasting Glucose 108 mg/dL + Family History',
    },
    hypertensionRisk: {
      level: 'Moderate',
      percent: 32,
      keyDriver: 'Stage 1 Pre-Hypertension (132/84 mmHg)',
    },
    lifestyleRecommendations: [
      'Increase aerobic exercise to 150 mins/week (brisk walking, swimming)',
      'Adopt DASH diet reducing sodium to under 2,000 mg/day',
      'Target 5% body weight loss over the next 12 weeks',
    ],
    dietaryAdvice: [
      'Replace refined carbs with high-fiber whole grains',
      'Increase potassium-rich foods (leafy greens, avocados, bananas)',
    ],
    clinicalNextSteps: [
      'Schedule 24-hour ambulatory blood pressure monitoring with PCP',
      'Repeat HbA1c lab test in 3 months',
    ],
  });

  const handlePredict = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/risk-prediction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          age,
          bmi,
          systolicBP,
          diastolicBP,
          bloodGlucose,
          smoking,
          exerciseDays,
          familyHistory,
        }),
      });
      const data = await res.json();
      setPrediction(data);
    } catch (err) {
      console.error('Risk prediction error:', err);
    } finally {
      setLoading(false);
    }
  };

  const chartData = prediction
    ? [
        { name: 'Cardiovascular', percent: prediction.cardiovascularRisk?.percent || 0, color: '#ef4444' },
        { name: 'Diabetes (T2D)', percent: prediction.diabetesRisk?.percent || 0, color: '#f59e0b' },
        { name: 'Hypertension', percent: prediction.hypertensionRisk?.percent || 0, color: '#3b82f6' },
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-400/30 text-teal-300 px-3 py-1 rounded-full text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            AI Predictive Disease Analytics Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            AI Disease Risk Calculator & Health Score
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm">
            Predicts 10-year cardiovascular risk, diabetes susceptibility, and hypertension progression based on clinical metrics and lifestyle factors.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Metric Form Controls */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Activity className="w-5 h-5 text-teal-600" />
            Clinical Biomarkers & Lifestyle Input
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Age (Years)
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                BMI (kg/m²)
              </label>
              <input
                type="number"
                step="0.1"
                value={bmi}
                onChange={(e) => setBmi(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Systolic BP (mmHg)
              </label>
              <input
                type="number"
                value={systolicBP}
                onChange={(e) => setSystolicBP(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Diastolic BP (mmHg)
              </label>
              <input
                type="number"
                value={diastolicBP}
                onChange={(e) => setDiastolicBP(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Fasting Blood Glucose (mg/dL)
            </label>
            <input
              type="number"
              value={bloodGlucose}
              onChange={(e) => setBloodGlucose(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer p-2 rounded-xl border border-slate-200 bg-slate-50">
              <input
                type="checkbox"
                checked={smoking}
                onChange={(e) => setSmoking(e.target.checked)}
                className="rounded text-teal-600 focus:ring-teal-500"
              />
              Tobacco / Smoker
            </label>
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                Exercise Days/Wk
              </label>
              <select
                value={exerciseDays}
                onChange={(e) => setExerciseDays(parseInt(e.target.value))}
                className="w-full px-2 py-1.5 rounded-xl border border-slate-300 text-xs bg-white"
              >
                <option value={0}>0 Days</option>
                <option value={1}>1-2 Days</option>
                <option value={3}>3-4 Days</option>
                <option value={5}>5+ Days</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Family Medical History
            </label>
            <input
              type="text"
              value={familyHistory}
              onChange={(e) => setFamilyHistory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
            />
          </div>

          <button
            onClick={handlePredict}
            disabled={loading}
            className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-teal-600/25 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Computing Risk Model...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Calculate Predictive Risk Score
              </>
            )}
          </button>
        </div>

        {/* Prediction Results Display */}
        <div className="lg:col-span-7 space-y-6">
          {prediction && (
            <>
              {/* Overall Health Score Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">
                    BioMed Composite Health Index
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-slate-900">
                      {prediction.overallHealthScore}
                    </span>
                    <span className="text-slate-400 text-sm font-bold">/ 100</span>
                  </div>
                  <p className="text-xs text-emerald-600 font-semibold mt-1">
                    Good Metabolic & Cardiovascular Reserve
                  </p>
                </div>

                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="36"
                      stroke="#f1f5f9"
                      strokeWidth="8"
                      fill="transparent"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="36"
                      stroke="#0d9488"
                      strokeWidth="8"
                      strokeDasharray={226}
                      strokeDashoffset={226 - (226 * prediction.overallHealthScore) / 100}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <span className="absolute text-sm font-black text-teal-800">
                    {prediction.overallHealthScore}%
                  </span>
                </div>
              </div>

              {/* Visual Risk Breakdown Bar Chart */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-teal-600" />
                  Specific Disease Risk Probability Breakdown (%)
                </h3>

                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
                      <XAxis type="number" domain={[0, 100]} stroke="#94a3b8" fontSize={11} />
                      <YAxis dataKey="name" type="category" stroke="#475569" fontSize={11} width={110} />
                      <Tooltip formatter={(value: any) => [`${value}% Risk`, 'Probability']} />
                      <Bar dataKey="percent" radius={[0, 8, 8, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Actionable Insights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 space-y-2">
                  <h4 className="text-xs font-bold text-teal-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    Targeted Lifestyle Interventions
                  </h4>
                  <ul className="text-xs text-teal-800 space-y-1.5 list-disc list-inside">
                    {prediction.lifestyleRecommendations?.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-2 border border-slate-800">
                  <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4" />
                    Clinical Follow-Up Protocol
                  </h4>
                  <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                    {prediction.clinicalNextSteps?.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
