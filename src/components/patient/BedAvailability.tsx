import React, { useState, useEffect } from 'react';
import {
  Building2,
  CheckCircle2,
  Compass,
  CreditCard,
  Filter,
  Hospital as HospIcon,
  MapPin,
  Navigation,
  PhoneCall,
  Plus,
  Search,
  Sparkles,
  Stethoscope,
  Wind,
} from 'lucide-react';
import { Hospital, PaymentTransaction } from '../../types';
import { PaymentModal } from '../payment/PaymentModal';

export const BedAvailability: React.FC = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [search, setSearch] = useState('');
  const [filterBedType, setFilterBedType] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [bookedHospital, setBookedHospital] = useState<string | null>(null);

  // Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedHospForBed, setSelectedHospForBed] = useState<Hospital | null>(null);

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

  const handleInitiateBedBooking = (hosp: Hospital) => {
    setSelectedHospForBed(hosp);
    setShowPaymentModal(true);
  };

  const handleBedPaymentCompleted = (txn: PaymentTransaction) => {
    if (selectedHospForBed) {
      setBookedHospital(selectedHospForBed.name);
      setTimeout(() => setBookedHospital(null), 6000);
    }
  };

  const filteredHospitals = hospitals.filter((hosp) => {
    const matchesSearch =
      hosp.name.toLowerCase().includes(search.toLowerCase()) ||
      hosp.address.toLowerCase().includes(search.toLowerCase()) ||
      hosp.specialties.some((s) => s.toLowerCase().includes(search.toLowerCase()));

    const matchesBed =
      filterBedType === 'all' ||
      (filterBedType === 'icu' && hosp.beds.icu.available > 0) ||
      (filterBedType === 'ventilator' && hosp.beds.ventilator.available > 0) ||
      (filterBedType === 'oxygen' && hosp.beds.oxygen.available > 0);

    return matchesSearch && matchesBed;
  });

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 px-3 py-1 rounded-full text-xs font-semibold mb-3">
            <HospIcon className="w-3.5 h-3.5" />
            Live National ER & ICU Bed Mesh
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Real-Time ICU & Hospital Bed Availability
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm">
            Locate nearby hospitals near you with live ICU, Ventilator, and Oxygen bed capacity & pre-book emergency seat reservations.
          </p>
        </div>
      </div>

      {/* Success Toast */}
      {bookedHospital && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-3 text-xs text-emerald-900 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div>
            <span className="font-bold block">ICU Emergency Seat Deposit Confirmed!</span>
            Seat reservation pre-booked at <span className="font-extrabold underline">{bookedHospital}</span>.
          </div>
        </div>
      )}

      {/* SEARCH HOSPITALS NEAR ME SEARCH BAR */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Nearby Hospitals Near Me by Name, Location/City, or Emergency Specialty..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs text-slate-800 focus:border-indigo-500 bg-slate-50 outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={filterBedType}
              onChange={(e) => setFilterBedType(e.target.value)}
              className="px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 outline-none flex-1 sm:flex-none"
            >
              <option value="all">All Bed Types</option>
              <option value="icu">Must Have ICU Available</option>
              <option value="ventilator">Must Have Ventilator Available</option>
              <option value="oxygen">Must Have Oxygen Available</option>
            </select>
          </div>
        </div>
      </div>

      {/* Hospital Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredHospitals.map((hosp) => (
          <div
            key={hosp.id}
            className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">{hosp.name}</h3>
                  <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    {hosp.address} • <strong className="text-slate-800 font-mono">{hosp.distanceKm} km away</strong>
                  </div>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full shrink-0">
                  ★ {hosp.rating}
                </span>
              </div>

              <div className="flex flex-wrap gap-1 pt-1">
                {hosp.specialties.map((spec, idx) => (
                  <span key={idx} className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-lg">
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            {/* Bed Matrix */}
            <div className="grid grid-cols-4 gap-2 text-center text-xs pt-2 border-t border-slate-100">
              <div className="p-2 bg-red-50 rounded-2xl border border-red-100">
                <div className="text-[10px] text-red-700 font-bold uppercase">ICU Beds</div>
                <div className="text-base font-black text-red-900">{hosp.beds.icu.available}</div>
              </div>
              <div className="p-2 bg-amber-50 rounded-2xl border border-amber-100">
                <div className="text-[10px] text-amber-700 font-bold uppercase">Ventilator</div>
                <div className="text-base font-black text-amber-900">{hosp.beds.ventilator.available}</div>
              </div>
              <div className="p-2 bg-blue-50 rounded-2xl border border-blue-100">
                <div className="text-[10px] text-blue-700 font-bold uppercase">Oxygen</div>
                <div className="text-base font-black text-blue-900">{hosp.beds.oxygen.available}</div>
              </div>
              <div className="p-2 bg-emerald-50 rounded-2xl border border-emerald-100">
                <div className="text-[10px] text-emerald-700 font-bold uppercase">Normal</div>
                <div className="text-base font-black text-emerald-900">{hosp.beds.normal.available}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => handleInitiateBedBooking(hosp)}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
              >
                <CreditCard className="w-4 h-4" />
                Pre-Book ICU Seat Deposit ($150)
              </button>

              <a
                href={`tel:${hosp.emergencyNumber}`}
                className="px-3.5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-2xl text-xs flex items-center gap-1 cursor-pointer"
                title="Call ER Desk"
              >
                <PhoneCall className="w-4 h-4" /> Call
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Payment Gateway Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        serviceTitle="Hospital ICU Bed Pre-Booking Deposit"
        itemName={`ICU Bed Seat Deposit at ${selectedHospForBed?.name}`}
        totalAmount={150.00}
        onPaymentSuccess={handleBedBedPaymentCompleted}
      />
    </div>
  );

  function handleBedBedPaymentCompleted(txn: PaymentTransaction) {
    handleBedPaymentCompleted(txn);
  }
};
