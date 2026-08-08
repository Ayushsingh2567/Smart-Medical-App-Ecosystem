import React, { useState, useEffect } from 'react';
import {
  Building2,
  CheckCircle2,
  Filter,
  Hospital as HospIcon,
  MapPin,
  PhoneCall,
  Plus,
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

  // Add Hospital Modal
  const [showAddHospitalModal, setShowAddHospitalModal] = useState(false);
  const [hospName, setHospName] = useState('');
  const [hospAddress, setHospAddress] = useState('');
  const [hospPhone, setHospPhone] = useState('');
  const [icuAvailable, setIcuAvailable] = useState(10);
  const [ventilatorAvailable, setVentilatorAvailable] = useState(5);
  const [oxygenAvailable, setOxygenAvailable] = useState(25);
  const [normalAvailable, setNormalAvailable] = useState(50);

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      const res = await fetch('/api/hospitals');
      const data = await res.json();
      if (Array.isArray(data)) setHospitals(data);
    } catch (err) {
      console.error('Error fetching hospitals:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddHospital = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hospName || !hospAddress) return;

    const newHosp: Hospital = {
      id: 'hosp-' + Date.now(),
      name: hospName,
      address: hospAddress,
      location: { lat: 28.6139, lng: 77.209 },
      distanceKm: 2.5,
      contactPhone: hospPhone || '+1 (555) 000-0000',
      emergencyNumber: hospPhone || '+1 (555) 000-0000',
      beds: {
        icu: { total: icuAvailable + 5, available: Number(icuAvailable) },
        ventilator: { total: ventilatorAvailable + 3, available: Number(ventilatorAvailable) },
        oxygen: { total: oxygenAvailable + 10, available: Number(oxygenAvailable) },
        normal: { total: normalAvailable + 20, available: Number(normalAvailable) },
        pediatric: { total: 10, available: 5 },
      },
      specialties: ['Emergency Trauma', 'Critical Care', 'General Medicine'],
      rating: 4.8,
    };

    setHospitals((prev) => [newHosp, ...prev]);
    setShowAddHospitalModal(false);
    setHospName('');
    setHospAddress('');
    setHospPhone('');
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
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
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

        <button
          onClick={() => setShowAddHospitalModal(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold rounded-xl flex items-center gap-2 shadow-lg shrink-0 cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" />
          + Register New Hospital / Beds
        </button>
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
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-3 text-xs text-emerald-900">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <span className="font-bold block">Pre-Registration Sent to {bookedHospital}!</span>
            The hospital ER triage team has been alerted. Your emergency patient pass is active.
          </div>
        </div>
      )}

      {/* Hospital List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHospitals.map((hosp) => (
          <div key={hosp.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4 flex flex-col justify-between hover:shadow-md transition-all">
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-extrabold text-base text-slate-900">{hosp.name}</h3>
                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                  ★ {hosp.rating}
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> {hosp.address}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-slate-100">
              <div className="p-2.5 bg-red-50/70 border border-red-100 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-red-700 block">ICU Beds</span>
                <span className="text-sm font-black text-red-950">{hosp.beds.icu.available} / {hosp.beds.icu.total}</span>
              </div>
              <div className="p-2.5 bg-indigo-50/70 border border-indigo-100 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-indigo-700 block">Ventilators</span>
                <span className="text-sm font-black text-indigo-950">{hosp.beds.ventilator.available} / {hosp.beds.ventilator.total}</span>
              </div>
              <div className="p-2.5 bg-teal-50/70 border border-teal-100 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-teal-700 block">Oxygen Beds</span>
                <span className="text-sm font-black text-teal-950">{hosp.beds.oxygen.available} / {hosp.beds.oxygen.total}</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-slate-600 block">Normal Ward</span>
                <span className="text-sm font-black text-slate-900">{hosp.beds.normal.available} / {hosp.beds.normal.total}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setBookedHospital(hosp.name);
                setTimeout(() => setBookedHospital(null), 5000);
              }}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-xs cursor-pointer transition-all"
            >
              Pre-Register Emergency Patient Bed
            </button>
          </div>
        ))}
      </div>

      {/* Add Hospital Modal */}
      {showAddHospitalModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleAddHospital} className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-slate-900">Register New Hospital Facility</h3>
              <button type="button" onClick={() => setShowAddHospitalModal(false)} className="text-slate-400 font-bold text-sm">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Hospital Name *</label>
                <input type="text" required value={hospName} onChange={(e) => setHospName(e.target.value)} placeholder="e.g. Metro Multispecialty Hospital" className="w-full p-2.5 border rounded-xl" />
              </div>
              <div>
                <label className="font-bold block mb-1">Location Address *</label>
                <input type="text" required value={hospAddress} onChange={(e) => setHospAddress(e.target.value)} placeholder="Full street address & city" className="w-full p-2.5 border rounded-xl" />
              </div>
              <div>
                <label className="font-bold block mb-1">Emergency Phone Number</label>
                <input type="tel" value={hospPhone} onChange={(e) => setHospPhone(e.target.value)} placeholder="+1 (555) 000-0000" className="w-full p-2.5 border rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">ICU Beds Available</label>
                  <input type="number" value={icuAvailable} onChange={(e) => setIcuAvailable(Number(e.target.value))} className="w-full p-2.5 border rounded-xl" />
                </div>
                <div>
                  <label className="font-bold block mb-1">Ventilator Beds</label>
                  <input type="number" value={ventilatorAvailable} onChange={(e) => setVentilatorAvailable(Number(e.target.value))} className="w-full p-2.5 border rounded-xl" />
                </div>
              </div>
            </div>

            <button type="submit" className="w-full py-2.5 bg-indigo-600 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer">Register Hospital</button>
          </form>
        </div>
      )}
    </div>
  );
};
