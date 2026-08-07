import React, { useState, useEffect } from 'react';
import {
  Building2,
  CheckCircle2,
  Filter,
  Hospital as HospIcon,
  MapPin,
  PhoneCall,
  Search,
  Sparkles,
  Stethoscope,
  Wind,
} from 'lucide-react';
import { Hospital } from '../../types';

export const BedAvailability: React.FC = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [search, setSearch] = useState('');
  const [filterBedType, setFilterBedType] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [bookedHospital, setBookedHospital] = useState<string | null>(null);

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      const res = await fetch('/api/hospitals');
      const data = await res.json();
      setHospitals(data);
    } catch (err) {
      console.error('Error fetching hospitals:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredHospitals = hospitals.filter((h) => {
    const matchesSearch =
      h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.address.toLowerCase().includes(search.toLowerCase()) ||
      h.specialties.some((s) => s.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterBedType === 'icu') return h.beds.icu.available > 0;
    if (filterBedType === 'ventilator') return h.beds.ventilator.available > 0;
    if (filterBedType === 'oxygen') return h.beds.oxygen.available > 0;

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 px-3 py-1 rounded-full text-xs font-semibold mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            Real-Time Bed Availability Mesh
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Live Hospital Bed & Emergency Triage Portal
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm">
            Search nearby hospitals for real-time ICU, Ventilator, Oxygen, and Normal bed vacancies. Instant pre-registration with automated ER notification.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by hospital name, location, or specialty (e.g., Cardiology)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-500" />
          <select
            value={filterBedType}
            onChange={(e) => setFilterBedType(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 bg-slate-50 outline-none"
          >
            <option value="all">All Bed Types</option>
            <option value="icu">ICU Beds Only</option>
            <option value="ventilator">Ventilator Beds Only</option>
            <option value="oxygen">Oxygen Beds Only</option>
          </select>
        </div>
      </div>

      {/* Booking Toast Banner */}
      {bookedHospital && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center justify-between text-xs text-emerald-900 animate-in fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div>
              <span className="font-bold block">Pre-Registration Confirmed!</span>
              Bed reserved at <span className="underline font-bold">{bookedHospital}</span>. Emergency Admissions team has received your profile.
            </div>
          </div>
          <button
            onClick={() => setBookedHospital(null)}
            className="px-3 py-1 bg-emerald-700 text-white font-bold rounded-lg cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Hospital Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHospitals.map((hosp) => (
          <div
            key={hosp.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden"
          >
            {/* Hospital Top Info */}
            <div className="p-5 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                    <HospIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm leading-tight">
                      {hosp.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{hosp.distanceKm} km away</span>
                    </div>
                  </div>
                </div>
                <span className="bg-amber-50 text-amber-800 text-[10px] font-extrabold px-2 py-1 rounded border border-amber-200">
                  ★ {hosp.rating}
                </span>
              </div>

              {/* Specialties */}
              <div className="flex flex-wrap gap-1">
                {hosp.specialties.map((s, i) => (
                  <span
                    key={i}
                    className="bg-slate-100 text-slate-700 text-[10px] font-medium px-2 py-0.5 rounded-md"
                  >
                    {s}
                  </span>
                ))}
              </div>

              {/* Bed Count Grid */}
              <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                {/* ICU */}
                <div className="p-2.5 rounded-xl bg-red-50/80 border border-red-200">
                  <div className="flex items-center justify-between text-[10px] text-red-700 font-bold uppercase">
                    <span>ICU Beds</span>
                    <Wind className="w-3 h-3" />
                  </div>
                  <div className="text-lg font-black text-red-900 mt-0.5">
                    {hosp.beds.icu.available}{' '}
                    <span className="text-xs text-red-500 font-medium">/ {hosp.beds.icu.total}</span>
                  </div>
                </div>

                {/* Ventilator */}
                <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200">
                  <div className="flex items-center justify-between text-[10px] text-amber-700 font-bold uppercase">
                    <span>Ventilators</span>
                  </div>
                  <div className="text-lg font-black text-amber-900 mt-0.5">
                    {hosp.beds.ventilator.available}{' '}
                    <span className="text-xs text-amber-500 font-medium">/ {hosp.beds.ventilator.total}</span>
                  </div>
                </div>

                {/* Oxygen */}
                <div className="p-2.5 rounded-xl bg-teal-50/80 border border-teal-200">
                  <div className="flex items-center justify-between text-[10px] text-teal-700 font-bold uppercase">
                    <span>Oxygen Beds</span>
                  </div>
                  <div className="text-lg font-black text-teal-900 mt-0.5">
                    {hosp.beds.oxygen.available}{' '}
                    <span className="text-xs text-teal-500 font-medium">/ {hosp.beds.oxygen.total}</span>
                  </div>
                </div>

                {/* Normal */}
                <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200">
                  <div className="flex items-center justify-between text-[10px] text-slate-600 font-bold uppercase">
                    <span>Normal Beds</span>
                  </div>
                  <div className="text-lg font-black text-slate-800 mt-0.5">
                    {hosp.beds.normal.available}{' '}
                    <span className="text-xs text-slate-500 font-medium">/ {hosp.beds.normal.total}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Action Bar */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
              <a
                href={`tel:${hosp.contactPhone}`}
                className="px-3 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5 text-indigo-600" />
                Call ER
              </a>

              <button
                onClick={() => setBookedHospital(hosp.name)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
              >
                Pre-Register Bed
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
