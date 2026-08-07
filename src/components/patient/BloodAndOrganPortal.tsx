import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Award,
  CheckCircle2,
  Droplet,
  Heart,
  Plus,
  ShieldCheck,
} from 'lucide-react';
import { sampleOrganDonor } from '../../data/mockData';
import { BloodStock, OrganDonor } from '../../types';

export const BloodAndOrganPortal: React.FC = () => {
  const [bloodStock, setBloodStock] = useState<BloodStock[]>([]);
  const [donor, setDonor] = useState<OrganDonor>(sampleOrganDonor);
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [requestedGroup, setRequestedGroup] = useState('O-');

  useEffect(() => {
    fetch('/api/blood-bank')
      .then((res) => res.json())
      .then((data) => setBloodStock(data))
      .catch((err) => console.error(err));
  }, []);

  const handleTriggerBloodRequest = (group: string) => {
    setRequestedGroup(group);
    setRequestSuccess(true);
    setTimeout(() => setRequestSuccess(false), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-rose-500/20 border border-rose-400/30 text-rose-300 px-3 py-1 rounded-full text-xs font-semibold mb-3">
            <Droplet className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
            National Blood Mesh & Organ Donor Registry
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Blood Bank Inventory & Organ Donation Portal
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm">
            Check real-time blood group availability across hospital networks, issue urgent blood requests, or pledge life-saving organs.
          </p>
        </div>
      </div>

      {/* Emergency Request Toast */}
      {requestSuccess && (
        <div className="p-4 bg-rose-50 border border-rose-300 rounded-2xl flex items-center gap-3 text-xs text-rose-900 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <div>
            <span className="font-bold block">Urgent Blood Request Broadcasted!</span>
            Emergency request for <span className="font-extrabold underline">{requestedGroup}</span> sent to 4 nearby regional blood banks.
          </div>
        </div>
      )}

      {/* Blood Bank Live Stock */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Droplet className="w-5 h-5 text-rose-600 fill-rose-600" />
            Real-Time Regional Blood Bank Stock
          </h2>
          <span className="text-xs font-bold text-slate-500">Live Cold Storage Sync</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {bloodStock.map((stock) => (
            <div
              key={stock.bloodGroup}
              className={`p-4 rounded-2xl border flex flex-col justify-between transition-all ${
                stock.unitsAvailable < 5
                  ? 'bg-rose-50 border-rose-300'
                  : 'bg-slate-50 border-slate-200 hover:border-rose-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-black text-slate-900">
                  {stock.bloodGroup}
                </span>
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    stock.unitsAvailable < 5
                      ? 'bg-rose-200 text-rose-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {stock.unitsAvailable < 5 ? 'LOW STOCK' : 'AVAILABLE'}
                </span>
              </div>

              <div>
                <div className="text-lg font-black text-rose-700">
                  {stock.unitsAvailable} <span className="text-xs text-slate-500 font-normal">Units</span>
                </div>
                <button
                  onClick={() => handleTriggerBloodRequest(stock.bloodGroup)}
                  className="mt-3 w-full py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-[11px] transition-colors cursor-pointer"
                >
                  Request Emergency Unit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Digital Organ Donor Pledge Card */}
      <div className="bg-gradient-to-br from-slate-900 via-rose-950 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl border border-rose-900/50 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-lg">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-300 bg-rose-500/20 px-3 py-1 rounded-full border border-rose-500/30">
            <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
            National Organ Donation Registry
          </div>
          <h3 className="text-xl font-bold text-white">
            Digital Organ Donor Badge & Pledge Card
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Registered Cardholder: <strong className="text-white">{donor.donorName}</strong> ({donor.donorAbhaId}).
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {donor.pledgedOrgans.map((organ, idx) => (
              <span
                key={idx}
                className="bg-white/10 text-rose-200 text-xs font-semibold px-2.5 py-1 rounded-lg border border-white/10"
              >
                ❤️ {organ}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white text-slate-900 p-5 rounded-2xl shadow-xl space-y-3 text-xs w-full md:w-64 border border-slate-200">
          <div className="flex items-center justify-between font-bold text-slate-800 border-b border-slate-100 pb-2">
            <span>ORGAN DONOR CARD</span>
            <Award className="w-4 h-4 text-rose-600" />
          </div>
          <div className="space-y-1 text-[11px]">
            <div className="text-slate-500">ID: {donor.donorCardId}</div>
            <div className="font-bold text-slate-900">{donor.donorName}</div>
            <div className="text-rose-700 font-extrabold">Blood Group: {donor.bloodGroup}</div>
            <div className="text-slate-400">Pledged Since: {donor.registeredDate}</div>
          </div>
          <div className="text-[10px] bg-rose-50 text-rose-800 p-2 rounded-lg font-medium text-center">
            Pledge Verified & Linked to Health ID
          </div>
        </div>
      </div>
    </div>
  );
};
