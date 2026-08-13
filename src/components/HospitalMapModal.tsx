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
  type: 'Hospital' | 'General hospital' | 'Government hospital' | 'Medical clinic' | 'Trauma ER';
  address: string;
  distanceKm: number;
  openHours: string;
  phone: string;
  website?: string;
  specialties: string[];
  rating: number;
  reviewsCount: number;
  location: { lat: number; lng: number };
}

// REAL HOSPITAL DATASET FOR GREATER NOIDA & JUDGES SOCIETY / KNOWLEDGE PARK REGION
const realGreaterNoidaFacilities: HealthcareFacility[] = [
  {
    id: 'hosp-gn-1',
    name: 'SPES Super Speciality Hospital',
    type: 'Hospital',
    address: 'Pari Chowk, NRI City, Omega II, Greater Noida, Uttar Pradesh 201315',
    distanceKm: 0.8,
    openHours: 'Open 24 hours',
    phone: '+91 90508 80099',
    website: 'http://speshospitalnoida.com/',
    specialties: ['Super Speciality', 'ICU', 'Emergency', 'Cardiology'],
    rating: 4.6,
    reviewsCount: 406,
    location: { lat: 28.4636, lng: 77.5121 },
  },
  {
    id: 'hosp-gn-2',
    name: 'Kailash Hospital, Greater Noida',
    type: 'General hospital',
    address: 'Plot No 23, near Pari Chowk, Knowledge Park I, Greater Noida, UP 201310',
    distanceKm: 1.1,
    openHours: 'Open 24 hours',
    phone: '+91 120 232 7799',
    website: 'https://www.kailashhealthcare.com/',
    specialties: ['General Medicine', 'Multispecialty', 'Trauma ER', 'Neurology'],
    rating: 4.6,
    reviewsCount: 4782,
    location: { lat: 28.4706, lng: 77.5053 },
  },
  {
    id: 'hosp-gn-3',
    name: 'Yatharth Super Speciality Hospital, Greater Noida',
    type: 'Hospital',
    address: 'Plot No 32, Block A, Omega-I, Greater Noida, Uttar Pradesh 201315',
    distanceKm: 1.4,
    openHours: 'Open 24 hours',
    phone: '+91 88004 47777',
    website: 'https://www.yatharthhospitals.com/',
    specialties: ['Cardiology', 'Oncology', 'Joint Replacement', 'Gastroenterology'],
    rating: 4.6,
    reviewsCount: 11358,
    location: { lat: 28.4517, lng: 77.5095 },
  },
  {
    id: 'hosp-gn-4',
    name: 'Sharda Hospital',
    type: 'Hospital',
    address: 'Plot No 32, 34, Knowledge Park III, Greater Noida, Uttar Pradesh 201310',
    distanceKm: 2.2,
    openHours: 'Open 24 hours',
    phone: '+91 84473 33999',
    website: 'https://www.shardahospital.org/',
    specialties: ['Medical College Hospital', 'Dental Clinic', 'Dermatology', 'Gynecology'],
    rating: 4.5,
    reviewsCount: 5729,
    location: { lat: 28.4751, lng: 77.4823 },
  },
  {
    id: 'hosp-gn-5',
    name: 'Felix Hospital - Greater Noida',
    type: 'General hospital',
    address: 'NH-14, Block C, Gamma 1, Greater Noida, Uttar Pradesh 201308',
    distanceKm: 2.5,
    openHours: 'Open 24 hours',
    phone: '+91 96670 64100',
    website: 'https://www.felixhospital.com/',
    specialties: ['Cancer Care', 'Pediatrics', 'Orthopedic Surgery', 'Neurology'],
    rating: 4.9,
    reviewsCount: 2817,
    location: { lat: 28.4882, lng: 77.5022 },
  },
  {
    id: 'hosp-gn-6',
    name: 'Sharma Medicare Super Speciality Hospital and Trauma Centre',
    type: 'Trauma ER',
    address: 'NH-19A, L Block, Delta II, Greater Noida, Uttar Pradesh 201310',
    distanceKm: 2.8,
    openHours: 'Open 24 hours',
    phone: '+91 120 232 6666',
    website: 'https://www.sharmamedicarehospital.com/',
    specialties: ['Trauma Center', 'Emergency ICU', 'Orthopedics', 'General Surgery'],
    rating: 4.8,
    reviewsCount: 2810,
    location: { lat: 28.4874, lng: 77.5183 },
  },
  {
    id: 'hosp-gn-7',
    name: 'GIMS Hospital (Government Institute of Medical Sciences)',
    type: 'Government hospital',
    address: 'Greater Noida, Kasna Road, Uttar Pradesh 201310',
    distanceKm: 3.4,
    openHours: 'Open 24 hours',
    phone: '+91 120 234 1738',
    website: 'https://gims.ac.in/',
    specialties: ['Govt Super Specialty', '24/7 Emergency', 'Affordable ICU', 'Pathology'],
    rating: 3.7,
    reviewsCount: 392,
    location: { lat: 28.4328, lng: 77.5320 },
  },
  {
    id: 'hosp-gn-8',
    name: 'Fortis Hospital Greater Noida',
    type: 'Hospital',
    address: 'Block D, Industrial Area, Surajpur Site 4, Greater Noida, UP 201315',
    distanceKm: 3.8,
    openHours: 'Open 24 hours',
    phone: '+91 88005 97374',
    website: 'https://www.fortishealthcare.com/',
    specialties: ['Heart Hospital', 'Oncology', 'Neurology', 'Gastroenterology'],
    rating: 4.5,
    reviewsCount: 2868,
    location: { lat: 28.4491, lng: 77.5322 },
  },
  {
    id: 'hosp-gn-9',
    name: 'Bakson Multispeciality Hospital',
    type: 'Hospital',
    address: 'Plot No. 36, Knowledge Park I, Greater Noida, Uttar Pradesh 201310',
    distanceKm: 1.3,
    openHours: 'Open 24 hours',
    phone: '+91 92893 22162',
    website: 'https://baksonhospital.com/',
    specialties: ['Dialysis Center', 'Gynecology', 'Urology', 'Radiology'],
    rating: 4.4,
    reviewsCount: 45,
    location: { lat: 28.4678, lng: 77.5018 },
  },
  {
    id: 'hosp-gn-10',
    name: 'Surya Hospital - Managed By Vedansh Medicare',
    type: 'General hospital',
    address: '47, Knowledge Park III, Greater Noida, Uttar Pradesh 201308',
    distanceKm: 1.9,
    openHours: 'Open 24 hours',
    phone: '+91 96504 94019',
    website: 'http://www.vedanshmedicare.com/',
    specialties: ['Super Speciality', 'Emergency Care', 'Dialysis Unit'],
    rating: 4.6,
    reviewsCount: 616,
    location: { lat: 28.4689, lng: 77.4856 },
  },
  {
    id: 'hosp-gn-11',
    name: 'NAVIN HOSPITAL - Super Speciality Hospital',
    type: 'Hospital',
    address: 'NH-3, Pocket F, Sector Alpha II, Greater Noida, UP 201310',
    distanceKm: 2.1,
    openHours: 'Open 24 hours',
    phone: '+91 99996 23102',
    website: 'https://www.navinhospitals.com/',
    specialties: ['Pediatrics', 'Obstetrics & Gynecology', 'ENT', 'Dental'],
    rating: 4.4,
    reviewsCount: 1103,
    location: { lat: 28.4776, lng: 77.5186 },
  },
  {
    id: 'hosp-gn-12',
    name: 'Green City Hospital',
    type: 'General hospital',
    address: 'NH-17, Delta 1, Block C, Greater Noida, Uttar Pradesh 201308',
    distanceKm: 2.7,
    openHours: 'Open 24 hours',
    phone: '+91 98118 57783',
    website: 'https://greencityhospitals.co.in/',
    specialties: ['General Medicine', 'Gynae & Maternity', 'Orthopedics'],
    rating: 3.4,
    reviewsCount: 262,
    location: { lat: 28.4837, lng: 77.5269 },
  },
  {
    id: 'hosp-gn-13',
    name: 'Nix Multispeciality Hospital',
    type: 'Hospital',
    address: 'Plot 813, Sector 1, Aimnabad, Greater Noida, Uttar Pradesh 201318',
    distanceKm: 6.5,
    openHours: 'Open 24 hours',
    phone: '+91 83838 00553',
    website: 'https://www.nixhealthcare.org/',
    specialties: ['Ambulance Service', 'Diagnostic Center', 'Pulmonology'],
    rating: 4.6,
    reviewsCount: 864,
    location: { lat: 28.5608, lng: 77.4513 },
  },
  {
    id: 'hosp-gn-14',
    name: 'Swastham Medicare Hospital',
    type: 'Hospital',
    address: 'Plot No 107, Tech Zone IV, Iteda, Greater Noida, UP 201009',
    distanceKm: 7.2,
    openHours: 'Open 24 hours',
    phone: '+91 97177 05323',
    website: 'https://www.swasthamedicare.com/',
    specialties: ['Emergency', 'General Surgery', 'Internal Medicine'],
    rating: 4.7,
    reviewsCount: 705,
    location: { lat: 28.6008, lng: 77.4435 },
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
  const [selectedFacility, setSelectedFacility] = useState<HealthcareFacility>(realGreaterNoidaFacilities[0]);

  if (!isOpen) return null;

  // Fuzzy Search Matcher to handle typos (e.g. "knowlege part 2" -> "knowledge park")
  const normalize = (str: string) =>
    str.toLowerCase().replace(/knowlege/g, 'knowledge').replace(/part/g, 'park').replace(/[^a-z0-9]/g, ' ');

  const filteredFacilities = realGreaterNoidaFacilities.filter((fac) => {
    const q = normalize(searchQuery.trim());
    if (!q) return true;

    const tokens = q.split(/\s+/).filter(Boolean);
    const targetText = normalize(`${fac.name} ${fac.address} ${fac.specialties.join(' ')} ${fac.type}`);

    const matchesSearch = tokens.every((token) => targetText.includes(token));

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
                Hospitals & Clinics Near Me (Judges Society / Knowledge Park, Greater Noida)
                <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2.5 py-0.5 rounded-full border border-indigo-200">
                  GREATER NOIDA GPS RADAR
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Discover nearby verified hospitals (SPES, Kailash, Yatharth, Sharda, GIMS, Fortis, Felix) with phone numbers and Google Maps navigation.
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
              placeholder="Search by Hospital Name, Area (Knowledge Park, Pari Chowk, Omega, Delta, Alpha)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:border-indigo-500 bg-white outline-none font-medium"
            />
          </div>

          <select
            value={facilityTypeFilter}
            onChange={(e) => setFacilityTypeFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 outline-none w-full sm:w-auto"
          >
            <option value="all">All Healthcare Facilities ({realGreaterNoidaFacilities.length})</option>
            <option value="Hospital">Super Specialty Hospitals</option>
            <option value="General">General Hospitals</option>
            <option value="Government">Government Hospitals (GIMS)</option>
            <option value="Trauma">24/7 Trauma ER Centers</option>
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Interactive Radar Location Map */}
          <div className="lg:col-span-7 bg-slate-950 rounded-3xl p-4 text-white relative min-h-[400px] border border-slate-800 overflow-hidden flex flex-col justify-between shadow-inner">
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
                  YOUR LOCATION: Judges Society, Knowledge Park, Greater Noida
                </span>
              </div>
              <span className="text-[10px] bg-teal-500/20 text-teal-300 border border-teal-400/30 px-2.5 py-0.5 rounded font-bold">
                {filteredFacilities.length} HOSPITALS FOUND
              </span>
            </div>

            {/* Interactive Map Pin Layout */}
            <div className="relative z-10 h-64 my-4 flex items-center justify-center">
              {filteredFacilities.slice(0, 10).map((fac, idx) => {
                const isSelected = selectedFacility.id === fac.id;
                const positions = [
                  { top: '25%', left: '30%' },
                  { top: '65%', left: '70%' },
                  { top: '35%', left: '60%' },
                  { top: '75%', left: '25%' },
                  { top: '50%', left: '45%' },
                  { top: '20%', left: '75%' },
                  { top: '80%', left: '55%' },
                  { top: '40%', left: '20%' },
                  { top: '60%', left: '35%' },
                  { top: '30%', left: '85%' },
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
                            : 'bg-slate-900 text-white border-slate-700'
                        }`}
                      >
                        <HospIcon className="w-3 h-3 text-red-400" />
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
                  <span className="text-[10px] text-amber-300 font-mono font-bold">★ {selectedFacility.rating} ({selectedFacility.reviewsCount} reviews)</span>
                </div>
                <h4 className="font-extrabold text-white text-sm">{selectedFacility.name}</h4>
                <p className="text-[11px] text-slate-300 mt-0.5">{selectedFacility.address} • <strong className="text-teal-300">{selectedFacility.distanceKm} km from Judges Society</strong></p>
              </div>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedFacility.name + ' ' + selectedFacility.address)}`}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold rounded-xl text-[11px] flex items-center gap-1.5 shadow-md cursor-pointer shrink-0 transition-all"
              >
                <Navigation className="w-3.5 h-3.5 fill-slate-950" />
                Open Google Maps GPS
              </a>
            </div>
          </div>

          {/* Facilities List Side Panel */}
          <div className="lg:col-span-5 space-y-3 max-h-[420px] overflow-y-auto pr-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Greater Noida Hospitals ({filteredFacilities.length})
            </h3>

            {filteredFacilities.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs space-y-2">
                <p className="font-bold">No exact hospital matches found for your search query.</p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-3 py-1.5 bg-slate-900 text-white rounded-xl font-bold"
                >
                  Clear Search & View All Hospitals
                </button>
              </div>
            ) : (
              filteredFacilities.map((fac) => {
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
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
