import React, { useState } from 'react';
import {
  Building2,
  CheckCircle2,
  Clock,
  Compass,
  Hospital as HospIcon,
  MapPin,
  Navigation,
  PhoneCall,
  Search,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  X,
} from 'lucide-react';

export interface HealthcareFacility {
  id: string;
  name: string;
  type: 'Hospital' | 'Clinic' | 'Trauma ER' | 'Diagnostic Center';
  address: string;
  distanceKm: number;
  openHours: string;
  phone: string;
  specialties: string[];
  rating: number;
  location: { lat: number; lng: number };
}

const nearbyFacilities: HealthcareFacility[] = [
  {
    id: 'fac-1',
    name: 'City Central Super Specialty Hospital',
    type: 'Hospital',
    address: '102 Healthcare Avenue, Sector 4, Medical District',
    distanceKm: 1.2,
    openHours: 'Open 24/7 (Emergency & ICU)',
    phone: '+91 98000 12345',
    specialties: ['Cardiology', 'Emergency Trauma', 'Neurology', 'ICU'],
    rating: 4.9,
    location: { lat: 28.6139, lng: 77.2090 },
  },
  {
    id: 'fac-2',
    name: 'Apollo Family Clinic & Consultation Center',
    type: 'Clinic',
    address: '14 Sunshine Plaza, Green Park Road',
    distanceKm: 2.1,
    openHours: '08:00 AM - 09:00 PM (Mon-Sat)',
    phone: '+91 98111 22334',
    specialties: ['General OPD', 'Pediatrics', 'Diabetes Care', 'Dermatology'],
    rating: 4.8,
    location: { lat: 28.6250, lng: 77.2200 },
  },
  {
    id: 'fac-3',
    name: 'Apex Heart & Trauma Center',
    type: 'Trauma ER',
    address: '45 Emergency Ring Road, Metro East',
    distanceKm: 3.5,
    openHours: 'Open 24/7 (Accident & Emergency)',
    phone: '+91 98222 33445',
    specialties: ['Cardiac Emergency', 'Trauma Surgery', 'Orthopedics'],
    rating: 4.9,
    location: { lat: 28.6010, lng: 77.1950 },
  },
  {
    id: 'fac-4',
    name: 'Max Health Diagnostic Lab & Imaging Center',
    type: 'Diagnostic Center',
    address: '88 Saint Jude Complex, West Park',
    distanceKm: 4.2,
    openHours: '07:00 AM - 08:00 PM (Daily)',
    phone: '+91 98333 44556',
    specialties: ['MRI & CT Scan', 'Ultrasound', 'Blood Diagnostics'],
    rating: 4.7,
    location: { lat: 28.6300, lng: 77.1800 },
  },
  {
    id: 'fac-5',
    name: 'Lotus Women & Child Care Clinic',
    type: 'Clinic',
    address: '29 Lotus Tower, Main Market Street',
    distanceKm: 5.0,
    openHours: '09:00 AM - 07:00 PM (Mon-Sat)',
    phone: '+91 98444 55667',
    specialties: ['Gynecology', 'Pediatrics', 'Vaccination Desk'],
    rating: 4.8,
    location: { lat: 28.6100, lng: 77.2150 },
  },
];

interface HospitalMapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HospitalMapModal: React.FC<HospitalMapModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [facilityTypeFilter, setFacilityTypeFilter] = useState<string>('all');
  const [selectedFacility, setSelectedFacility] = useState<HealthcareFacility>(nearbyFacilities[0]);

  if (!isOpen) return null;

  const filteredFacilities = nearbyFacilities.filter((fac) => {
    const matchesSearch =
      fac.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fac.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fac.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType =
      facilityTypeFilter === 'all' || fac.type.toLowerCase().includes(facilityTypeFilter.toLowerCase());

    return matchesSearch && matchesType;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-5xl w-full p-6 sm:p-8 shadow-2xl space-y-6 text-slate-900 border border-slate-200 my-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-600 text-white flex items-center justify-center shadow-md">
              <MapPin className="w-6 h-6 text-teal-300" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                Search Hospitals & Clinics Near Me
                <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2.5 py-0.5 rounded-full border border-indigo-200">
                  LOCATION RADAR
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Discover nearby hospitals, OPD clinics, and diagnostic labs with distance, open hours, and Google Maps GPS navigation.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-800 font-bold text-sm cursor-pointer p-1.5 rounded-xl hover:bg-slate-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Hospital/Clinic Name, Area, City, or Specialty (e.g. Cardiology, Pediatrics)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:border-indigo-500 bg-white outline-none font-medium"
            />
          </div>

          <select
            value={facilityTypeFilter}
            onChange={(e) => setFacilityTypeFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 outline-none w-full sm:w-auto"
          >
            <option value="all">All Healthcare Facilities</option>
            <option value="Hospital">Hospitals Only</option>
            <option value="Clinic">OPD Clinics Only</option>
            <option value="Trauma">24/7 Trauma ER</option>
            <option value="Diagnostic">Diagnostic Labs</option>
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Interactive Radar Location Map */}
          <div className="lg:col-span-7 bg-slate-950 rounded-3xl p-4 text-white relative min-h-[380px] border border-slate-800 overflow-hidden flex flex-col justify-between shadow-inner">
            {/* Map Canvas Background Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

            {/* Radar Pulsing Circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-teal-500/20 animate-ping pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-indigo-500/30 pointer-events-none" />

            {/* GPS Tracker Header */}
            <div className="relative z-10 flex items-center justify-between text-xs bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-teal-400 animate-spin" />
                <span className="font-mono text-teal-300 font-bold text-[11px]">
                  YOUR CURRENT LOCATION: Sector 4, Main Road
                </span>
              </div>
              <span className="text-[10px] bg-teal-500/20 text-teal-300 border border-teal-400/30 px-2 py-0.5 rounded font-bold">
                {filteredFacilities.length} FACILITIES NEARBY
              </span>
            </div>

            {/* Interactive Map Pin Layout */}
            <div className="relative z-10 h-64 my-4 flex items-center justify-center">
              {filteredFacilities.map((fac, idx) => {
                const isSelected = selectedFacility.id === fac.id;
                const positions = [
                  { top: '25%', left: '30%' },
                  { top: '65%', left: '70%' },
                  { top: '35%', left: '60%' },
                  { top: '75%', left: '25%' },
                  { top: '50%', left: '45%' },
                ];
                const pos = positions[idx % positions.length];

                return (
                  <button
                    key={fac.id}
                    onClick={() => setSelectedFacility(fac)}
                    style={{ top: pos.top, left: pos.left }}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 cursor-pointer ${
                      isSelected ? 'z-30 scale-125' : 'z-20 hover:scale-110 opacity-80'
                    }`}
                  >
                    <div className="relative flex flex-col items-center">
                      {isSelected && (
                        <div className="absolute -inset-2 rounded-full bg-teal-400/30 animate-ping" />
                      )}

                      <div
                        className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold flex items-center gap-1 shadow-lg border ${
                          isSelected
                            ? 'bg-teal-400 text-slate-950 border-white ring-2 ring-teal-300'
                            : fac.type === 'Hospital'
                            ? 'bg-blue-900 text-white border-blue-400'
                            : fac.type === 'Clinic'
                            ? 'bg-emerald-900 text-white border-emerald-400'
                            : 'bg-purple-900 text-white border-purple-400'
                        }`}
                      >
                        <MapPin className="w-3 h-3 text-amber-300" />
                        <span>{fac.name.split(' ')[0]}</span>
                        <span className="font-mono text-[9px] opacity-90">({fac.distanceKm}km)</span>
                      </div>

                      <div className={`w-2 h-2 rotate-45 -mt-1 ${isSelected ? 'bg-teal-400' : 'bg-slate-900'}`} />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Pin Details Box */}
            <div className="relative z-10 bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] text-teal-400 font-extrabold uppercase tracking-wider">
                    {selectedFacility.type}
                  </span>
                  <span className="text-[10px] text-amber-300 font-mono font-bold">★ {selectedFacility.rating}</span>
                </div>
                <h4 className="font-extrabold text-white text-sm">{selectedFacility.name}</h4>
                <p className="text-[11px] text-slate-300 mt-0.5">{selectedFacility.address} • <strong className="text-teal-300">{selectedFacility.distanceKm} km away</strong></p>
              </div>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedFacility.name + ' ' + selectedFacility.address)}`}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold rounded-xl text-[11px] flex items-center gap-1.5 shadow-md cursor-pointer shrink-0 transition-all"
              >
                <Navigation className="w-3.5 h-3.5 fill-slate-950" />
                Navigate via Google Maps
              </a>
            </div>
          </div>

          {/* Facilities List Side Panel */}
          <div className="lg:col-span-5 space-y-3 max-h-[420px] overflow-y-auto pr-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Discovered Facilities Near Me ({filteredFacilities.length})
            </h3>

            {filteredFacilities.map((fac) => {
              const isSelected = selectedFacility.id === fac.id;
              return (
                <div
                  key={fac.id}
                  onClick={() => setSelectedFacility(fac)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2.5 ${
                    isSelected
                      ? 'bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-400/40 shadow-sm'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100/80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-slate-900 text-xs">{fac.name}</h4>
                        <span className="bg-slate-200 text-slate-800 text-[9px] font-bold px-1.5 py-0.5 rounded">
                          {fac.type}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                        {fac.address} • <strong className="text-slate-800 font-mono">{fac.distanceKm} km</strong>
                      </p>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0">
                      ★ {fac.rating}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-600 flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>{fac.openHours}</span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {fac.specialties.map((spec, idx) => (
                      <span key={idx} className="bg-white border border-slate-200 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded-lg">
                        {spec}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-1 border-t border-slate-200/60">
                    <a
                      href={`tel:${fac.phone}`}
                      className="flex-1 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-[11px] flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <PhoneCall className="w-3.5 h-3.5" /> Call {fac.phone}
                    </a>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fac.name + ' ' + fac.address)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-[11px] flex items-center gap-1 cursor-pointer"
                    >
                      <Navigation className="w-3.5 h-3.5" /> Google Maps
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
