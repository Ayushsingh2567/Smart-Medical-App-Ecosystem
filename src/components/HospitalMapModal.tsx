import React, { useState } from 'react';
import {
  Building2,
  CheckCircle2,
  Compass,
  Hospital as HospIcon,
  MapPin,
  Navigation,
  PhoneCall,
  Search,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Wind,
  X,
} from 'lucide-react';
import { Hospital } from '../types';

const defaultHospitals: Hospital[] = [
  {
    id: 'hosp-1',
    name: 'City Central Super Specialty Hospital',
    address: '102 Healthcare Avenue, Medical District, Sector 4',
    location: { lat: 28.6139, lng: 77.2090 },
    distanceKm: 2.5,
    contactPhone: '+1 (555) 234-5678',
    emergencyNumber: '+1 (555) 911-0001',
    beds: {
      icu: { total: 20, available: 6 },
      ventilator: { total: 10, available: 3 },
      oxygen: { total: 50, available: 18 },
      normal: { total: 100, available: 42 },
      pediatric: { total: 15, available: 5 },
    },
    specialties: ['Cardiology', 'Emergency Trauma', 'Critical Care', 'Neurology'],
    rating: 4.9,
  },
  {
    id: 'hosp-2',
    name: 'Apex Heart & Trauma Center',
    address: '45 Emergency Ring Road, Metro East',
    location: { lat: 28.6250, lng: 77.2200 },
    distanceKm: 4.1,
    contactPhone: '+1 (555) 345-6789',
    emergencyNumber: '+1 (555) 911-0002',
    beds: {
      icu: { total: 15, available: 4 },
      ventilator: { total: 8, available: 2 },
      oxygen: { total: 35, available: 12 },
      normal: { total: 80, available: 30 },
      pediatric: { total: 10, available: 4 },
    },
    specialties: ['Cardiac Surgery', 'Trauma & Emergency', 'Orthopedics'],
    rating: 4.8,
  },
  {
    id: 'hosp-3',
    name: 'St. Jude Emergency & ICU Center',
    address: '88 Saint Jude Boulevard, West Park',
    location: { lat: 28.6010, lng: 77.1950 },
    distanceKm: 6.2,
    contactPhone: '+1 (555) 456-7890',
    emergencyNumber: '+1 (555) 911-0003',
    beds: {
      icu: { total: 30, available: 11 },
      ventilator: { total: 15, available: 7 },
      oxygen: { total: 70, available: 29 },
      normal: { total: 120, available: 55 },
      pediatric: { total: 20, available: 8 },
    },
    specialties: ['ICU & Critical Care', 'Pulmonology', 'Pediatric ER'],
    rating: 4.7,
  },
  {
    id: 'hosp-4',
    name: 'Metro Child & Maternity Hospital',
    address: '14 Sunshine Boulevard, North Extension',
    location: { lat: 28.6300, lng: 77.1800 },
    distanceKm: 8.0,
    contactPhone: '+1 (555) 567-8901',
    emergencyNumber: '+1 (555) 911-0004',
    beds: {
      icu: { total: 12, available: 3 },
      ventilator: { total: 5, available: 1 },
      oxygen: { total: 25, available: 10 },
      normal: { total: 60, available: 22 },
      pediatric: { total: 30, available: 14 },
    },
    specialties: ['Pediatrics', 'Obstetrics & Gynecology', 'Neonatal ICU'],
    rating: 4.9,
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
  const [selectedHospital, setSelectedHospital] = useState<Hospital>(defaultHospitals[0]);
  const [filterType, setFilterType] = useState<string>('all');

  if (!isOpen) return null;

  const filteredHospitals = defaultHospitals.filter((hosp) => {
    const matchesSearch =
      hosp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hosp.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hosp.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesBed =
      filterType === 'all' ||
      (filterType === 'icu' && hosp.beds.icu.available > 0) ||
      (filterType === 'ventilator' && hosp.beds.ventilator.available > 0);

    return matchesSearch && matchesBed;
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
                Live National Hospital Radar Map & GPS Finder
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                  GPS LIVE SYNC
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Locate nearby hospitals, check live ICU bed capacity, and trigger GPS navigation route.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-800 font-bold text-sm cursor-pointer p-1 rounded-xl hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hospital by Name, City, Area, or Specialty on map..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:border-indigo-500 bg-white outline-none"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 outline-none w-full sm:w-auto"
          >
            <option value="all">All Nearby Hospitals</option>
            <option value="icu">ICU Bed Available</option>
            <option value="ventilator">Ventilator Available</option>
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Interactive Visual Radar Map Box */}
          <div className="lg:col-span-7 bg-slate-950 rounded-3xl p-4 text-white relative min-h-[380px] border border-slate-800 overflow-hidden flex flex-col justify-between shadow-inner">
            {/* Map Canvas Background Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

            {/* Radar Pulsing Circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-teal-500/20 animate-ping pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-indigo-500/30 pointer-events-none" />

            {/* Top Map Bar */}
            <div className="relative z-10 flex items-center justify-between text-xs bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-teal-400 animate-spin" />
                <span className="font-mono text-teal-300 font-bold text-[11px]">
                  YOUR GPS LOCATION: 28.6139° N, 77.2090° E
                </span>
              </div>
              <span className="text-[10px] bg-teal-500/20 text-teal-300 border border-teal-400/30 px-2 py-0.5 rounded font-bold">
                {filteredHospitals.length} HOSPITALS PINNED
              </span>
            </div>

            {/* Hospital Map Pins Visual Layout */}
            <div className="relative z-10 h-64 my-4 flex items-center justify-center">
              {filteredHospitals.map((hosp, idx) => {
                const isSelected = selectedHospital.id === hosp.id;
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
                    key={hosp.id}
                    onClick={() => setSelectedHospital(hosp)}
                    style={{ top: pos.top, left: pos.left }}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 group cursor-pointer ${
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
                            : 'bg-slate-900 text-white border-slate-700'
                        }`}
                      >
                        <HospIcon className="w-3 h-3 text-red-400" />
                        <span>{hosp.name.split(' ')[0]}</span>
                        <span className="font-mono text-[9px] opacity-80">({hosp.distanceKm}km)</span>
                      </div>

                      <div className={`w-2 h-2 rotate-45 -mt-1 ${isSelected ? 'bg-teal-400' : 'bg-slate-900'}`} />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Hospital Pin Popup Card */}
            <div className="relative z-10 bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-teal-400 font-extrabold uppercase tracking-wider block">
                  SELECTED ON MAP
                </span>
                <h4 className="font-extrabold text-white text-sm">{selectedHospital.name}</h4>
                <p className="text-[11px] text-slate-300 mt-0.5">{selectedHospital.address} • {selectedHospital.distanceKm} km away</p>
              </div>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedHospital.name + ' ' + selectedHospital.address)}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold rounded-xl text-[11px] flex items-center gap-1.5 shadow-md cursor-pointer shrink-0 transition-all"
              >
                <Navigation className="w-3.5 h-3.5 fill-slate-950" />
                Open GPS Directions
              </a>
            </div>
          </div>

          {/* Hospital Details List Side Panel */}
          <div className="lg:col-span-5 space-y-3 max-h-[420px] overflow-y-auto pr-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Nearby Hospitals ({filteredHospitals.length})
            </h3>

            {filteredHospitals.map((hosp) => {
              const isSelected = selectedHospital.id === hosp.id;
              return (
                <div
                  key={hosp.id}
                  onClick={() => setSelectedHospital(hosp)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-3 ${
                    isSelected
                      ? 'bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-400/40 shadow-sm'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100/80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-xs">{hosp.name}</h4>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                        {hosp.address} • <strong className="text-slate-800 font-mono">{hosp.distanceKm} km</strong>
                      </p>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0">
                      ★ {hosp.rating}
                    </span>
                  </div>

                  {/* Bed Capacity Quick Matrix */}
                  <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] pt-1 border-t border-slate-200/60">
                    <div className="p-1.5 bg-red-100/60 text-red-900 rounded-xl font-bold">
                      ICU: {hosp.beds.icu.available} Available
                    </div>
                    <div className="p-1.5 bg-amber-100/60 text-amber-900 rounded-xl font-bold">
                      Venti: {hosp.beds.ventilator.available}
                    </div>
                    <div className="p-1.5 bg-blue-100/60 text-blue-900 rounded-xl font-bold">
                      O2: {hosp.beds.oxygen.available}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <a
                      href={`tel:${hosp.emergencyNumber}`}
                      className="flex-1 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-[11px] flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <PhoneCall className="w-3.5 h-3.5" /> Call ER Desk
                    </a>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hosp.name + ' ' + hosp.address)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-[11px] flex items-center gap-1 cursor-pointer"
                    >
                      <Navigation className="w-3.5 h-3.5" /> Route
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
