import React, { useState } from 'react';
import { Building2, CheckCircle2, Droplet, PackageCheck, Pill, Search } from 'lucide-react';

export const PharmacyPortal: React.FC = () => {
  const [fulfilledOrder, setFulfilledOrder] = useState(false);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-rose-500/20 border border-rose-400/30 text-rose-300 px-3 py-1 rounded-full text-xs font-semibold mb-3">
            <Building2 className="w-3.5 h-3.5 text-rose-400" />
            Central Pharmacy & Inventory Management
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Pharmacy Dispensing & Inventory System
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm">
            Manage e-Prescription orders, drug stock, and automatic refills for chronic patients.
          </p>
        </div>
      </div>

      {fulfilledOrder && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-3 text-xs text-emerald-900 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span className="font-bold">Order RX-88402 Dispensed & Patient Inventory Updated!</span>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Pill className="w-5 h-5 text-rose-600" />
          Pending E-Prescription Orders
        </h2>

        <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
          <div>
            <div className="font-extrabold text-slate-900 text-sm">
              Prescription #RX-88402 - Alexander Wright
            </div>
            <div className="text-slate-500 mt-1">
              Amlodipine 5mg (30 Tabs) • Atorvastatin 10mg (30 Tabs)
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Prescribed by Dr. Sarah Jenkins (Cardiology)</div>
          </div>

          <button
            onClick={() => {
              setFulfilledOrder(true);
              setTimeout(() => setFulfilledOrder(false), 4000);
            }}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-rose-600/20"
          >
            <PackageCheck className="w-4 h-4" /> Fulfill & Dispense
          </button>
        </div>
      </div>
    </div>
  );
};
