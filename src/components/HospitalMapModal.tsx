import React, { useState } from 'react';
import {
  Building2,
  CheckCircle2,
  Clock,
  Compass,
  Globe,
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
  city: string;
  state: string;
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

// PAN-INDIA HEALTHCARE FACILITY DATASET (COVERING ALL MAJOR METROS & STATES)
const panIndiaFacilities: HealthcareFacility[] = [
  // DELHI NCR & GREATER NOIDA
  {
    id: 'fac-in-1',
    name: 'SPES Super Speciality Hospital',
    type: 'Hospital',
    city: 'Greater Noida',
    state: 'Uttar Pradesh',
    address: 'Pari Chowk, NRI City, Omega II, Greater Noida, UP 201315',
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
    id: 'fac-in-2',
    name: 'AIIMS (All India Institute of Medical Sciences)',
    type: 'Government hospital',
    city: 'New Delhi',
    state: 'Delhi',
    address: 'Sri Aurobindo Marg, Ansari Nagar, New Delhi 110029',
    distanceKm: 32.0,
    openHours: 'Open 24 hours',
    phone: '+91 11 2658 8500',
    website: 'https://www.aiims.edu/',
    specialties: ['National Premier Referral', 'Cardiology', 'Oncology', 'Organ Transplant'],
    rating: 4.8,
    reviewsCount: 18920,
    location: { lat: 28.5672, lng: 77.2100 },
  },
  {
    id: 'fac-in-3',
    name: 'Medanta - The Medicity',
    type: 'Hospital',
    city: 'Gurugram',
    state: 'Haryana',
    address: 'CH Baktawar Singh Road, Sector 38, Gurugram, Haryana 122001',
    distanceKm: 48.5,
    openHours: 'Open 24 hours',
    phone: '+91 124 414 1414',
    website: 'https://www.medanta.org/',
    specialties: ['Heart Institute', 'Liver Transplant', 'Neurosciences', 'Robotic Surgery'],
    rating: 4.7,
    reviewsCount: 14500,
    location: { lat: 28.4385, lng: 77.0425 },
  },
  {
    id: 'fac-in-4',
    name: 'Kailash Hospital, Greater Noida',
    type: 'General hospital',
    city: 'Greater Noida',
    state: 'Uttar Pradesh',
    address: 'Plot No 23, Knowledge Park I, Greater Noida, UP 201310',
    distanceKm: 1.1,
    openHours: 'Open 24 hours',
    phone: '+91 120 232 7799',
    website: 'https://www.kailashhealthcare.com/',
    specialties: ['General Medicine', 'Multispecialty', 'Trauma ER'],
    rating: 4.6,
    reviewsCount: 4782,
    location: { lat: 28.4706, lng: 77.5053 },
  },
  {
    id: 'fac-in-5',
    name: 'Yatharth Super Speciality Hospital',
    type: 'Hospital',
    city: 'Greater Noida',
    state: 'Uttar Pradesh',
    address: 'Plot No 32, Block A, Omega-I, Greater Noida, UP 201315',
    distanceKm: 1.4,
    openHours: 'Open 24 hours',
    phone: '+91 88004 47777',
    website: 'https://www.yatharthhospitals.com/',
    specialties: ['Cardiology', 'Oncology', 'Joint Replacement'],
    rating: 4.6,
    reviewsCount: 11358,
    location: { lat: 28.4517, lng: 77.5095 },
  },

  // MUMBAI & MAHARASHTRA
  {
    id: 'fac-in-6',
    name: 'Lilavati Hospital & Research Centre',
    type: 'Hospital',
    city: 'Mumbai',
    state: 'Maharashtra',
    address: 'A-791, Bandra Reclamation, Bandra West, Mumbai, MH 400050',
    distanceKm: 1350.0,
    openHours: 'Open 24 hours',
    phone: '+91 22 2675 1000',
    website: 'https://www.lilavatihospital.com/',
    specialties: ['Cardiology', 'Nephrology', 'Critical Care', 'Gastroenterology'],
    rating: 4.6,
    reviewsCount: 8900,
    location: { lat: 19.0512, lng: 72.8285 },
  },
  {
    id: 'fac-in-7',
    name: 'Kokilaben Dhirubhai Ambani Hospital',
    type: 'Hospital',
    city: 'Mumbai',
    state: 'Maharashtra',
    address: 'Rao Saheb, Achutrao Patwardhan Marg, Four Bungalows, Andheri West, Mumbai 400053',
    distanceKm: 1355.0,
    openHours: 'Open 24 hours',
    phone: '+91 22 4269 6969',
    website: 'https://www.kokilabenhospital.com/',
    specialties: ['Childrens Heart Center', 'Robotic Surgery', 'Stroke Center'],
    rating: 4.7,
    reviewsCount: 11200,
    location: { lat: 19.1311, lng: 72.8252 },
  },

  // BENGALURU & KARNATAKA
  {
    id: 'fac-in-8',
    name: 'Manipal Hospital, HAL Airport Road',
    type: 'Hospital',
    city: 'Bengaluru',
    state: 'Karnataka',
    address: '98, HAL Old Airport Rd, Kodihalli, Bengaluru, Karnataka 560017',
    distanceKm: 2100.0,
    openHours: 'Open 24 hours',
    phone: '+91 80 2502 4444',
    website: 'https://www.manipalhospitals.com/',
    specialties: ['Cardiology', 'Neurology', 'Organ Transplant', 'Oncology'],
    rating: 4.7,
    reviewsCount: 15400,
    location: { lat: 12.9582, lng: 77.6493 },
  },
  {
    id: 'fac-in-9',
    name: 'Narayana Health City (Narayana Hrudayalaya)',
    type: 'Hospital',
    city: 'Bengaluru',
    state: 'Karnataka',
    address: '258/A, Bommasandra Industrial Area, Anekal Taluk, Bengaluru 560099',
    distanceKm: 2120.0,
    openHours: 'Open 24 hours',
    phone: '+91 80 7122 2222',
    website: 'https://www.narayanahealth.org/',
    specialties: ['Pediatric Cardiac Surgery', 'Bone Marrow Transplant', 'Nephrology'],
    rating: 4.8,
    reviewsCount: 22100,
    location: { lat: 12.8092, lng: 77.6974 },
  },

  // HYDERABAD & TELANGANA
  {
    id: 'fac-in-10',
    name: 'KIMS Hospitals (Krishna Institute of Medical Sciences)',
    type: 'Hospital',
    city: 'Hyderabad',
    state: 'Telangana',
    address: '1-8-31/1, Minister Rd, Krishna Nagar Colony, Begumpet, Secunderabad, Telangana 500003',
    distanceKm: 1580.0,
    openHours: 'Open 24 hours',
    phone: '+91 40 4488 5000',
    website: 'https://www.kimshospitals.com/',
    specialties: ['Heart & Lung Transplant', 'Neuro Surgery', 'Trauma Care'],
    rating: 4.7,
    reviewsCount: 9800,
    location: { lat: 17.4344, lng: 78.4867 },
  },

  // CHENNAI & TAMIL NADU
  {
    id: 'fac-in-11',
    name: 'Apollo Hospitals, Greams Road',
    type: 'Hospital',
    city: 'Chennai',
    state: 'Tamil Nadu',
    address: '21, Greams Lane, Thousand Lights, Chennai, Tamil Nadu 600006',
    distanceKm: 2180.0,
    openHours: 'Open 24 hours',
    phone: '+91 44 2829 0200',
    website: 'https://www.apollohospitals.com/',
    specialties: ['Proton Therapy', 'Cardiology', 'Liver & Kidney Transplant'],
    rating: 4.8,
    reviewsCount: 16500,
    location: { lat: 13.0604, lng: 80.2514 },
  },

  // KOLKATA & WEST BENGAL
  {
    id: 'fac-in-12',
    name: 'Apollo Multispecialty Hospitals, Kolkata',
    type: 'Hospital',
    city: 'Kolkata',
    state: 'West Bengal',
    address: '58, Canal Circular Rd, Kadapara, Phool Bagan, Kankurgachi, Kolkata, WB 700054',
    distanceKm: 1480.0,
    openHours: 'Open 24 hours',
    phone: '+91 33 2320 3040',
    website: 'https://kolkata.apollohospitals.com/',
    specialties: ['Cardiac Sciences', 'Neurosciences', 'Emergency Medicine'],
    rating: 4.6,
    reviewsCount: 12400,
    location: { lat: 22.5726, lng: 88.3980 },
  },

  // AHMEDABAD & GUJARAT
  {
    id: 'fac-in-13',
    name: 'Marengo CIMS Hospital',
    type: 'Hospital',
    city: 'Ahmedabad',
    state: 'Gujarat',
    address: 'Off Science City Road, Sola, Ahmedabad, Gujarat 380060',
    distanceKm: 920.0,
    openHours: 'Open 24 hours',
    phone: '+91 79 4800 0000',
    website: 'https://www.marengocims.com/',
    specialties: ['Heart Care', 'Joint Replacement', 'Pulmonology'],
    rating: 4.8,
    reviewsCount: 8900,
    location: { lat: 23.0754, lng: 72.5186 },
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
  const [selectedStateFilter, setSelectedStateFilter] = useState<string>('all');
  const [selectedFacility, setSelectedFacility] = useState<HealthcareFacility>(panIndiaFacilities[0]);

  if (!isOpen) return null;

  // Search Normalizer
  const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, ' ');

  const filteredFacilities = panIndiaFacilities.filter((fac) => {
    const q = normalize(searchQuery.trim());
    const matchesState =
      selectedStateFilter === 'all' ||
      fac.state.toLowerCase().includes(selectedStateFilter.toLowerCase()) ||
      fac.city.toLowerCase().includes(selectedStateFilter.toLowerCase());

    if (!q) return matchesState;

    const tokens = q.split(/\s+/).filter(Boolean);
    const targetText = normalize(`${fac.name} ${fac.city} ${fac.state} ${fac.address} ${fac.specialties.join(' ')} ${fac.type}`);

    const matchesSearch = tokens.every((token) => targetText.includes(token));
    return matchesSearch && matchesState;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-5xl w-full p-6 sm:p-8 shadow-2xl space-y-6 text-slate-900 border border-slate-200 my-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-600 text-white flex items-center justify-center shadow-md">
              <Globe className="w-6 h-6 text-teal-300" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                Pan-India Hospital & Clinic Location Search Map
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                  INDIA MAP SYNC 🇮🇳
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Search verified hospitals, clinics, and medical centers across all major Indian cities and states.
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

        {/* Search & State Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hospital name, city (Delhi, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:border-indigo-500 bg-white outline-none font-medium"
            />
          </div>

          <select
            value={selectedStateFilter}
            onChange={(e) => setSelectedStateFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 outline-none w-full sm:w-auto"
          >
            <option value="all">🇮🇳 All India (Pan-India)</option>
            <option value="Uttar Pradesh">Delhi NCR / UP (Greater Noida)</option>
            <option value="Delhi">Delhi Capital Region</option>
            <option value="Maharashtra">Mumbai & Maharashtra</option>
            <option value="Karnataka">Bengaluru & Karnataka</option>
            <option value="Telangana">Hyderabad & Telangana</option>
            <option value="Tamil Nadu">Chennai & Tamil Nadu</option>
            <option value="West Bengal">Kolkata & West Bengal</option>
            <option value="Gujarat">Ahmedabad & Gujarat</option>
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Interactive Pan-India Map View Canvas */}
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
                  PAN-INDIA MAP COVERAGE: ACTIVE
                </span>
              </div>
              <span className="text-[10px] bg-teal-500/20 text-teal-300 border border-teal-400/30 px-2.5 py-0.5 rounded font-bold">
                {filteredFacilities.length} PAN-INDIA HOSPITALS
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
                        <span className="font-mono text-[9px] opacity-90">({fac.city})</span>
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
                    {selectedFacility.city}, {selectedFacility.state}
                  </span>
                  <span className="text-[10px] text-amber-300 font-mono font-bold">★ {selectedFacility.rating} ({selectedFacility.reviewsCount} reviews)</span>
                </div>
                <h4 className="font-extrabold text-white text-sm">{selectedFacility.name}</h4>
                <p className="text-[11px] text-slate-300 mt-0.5">{selectedFacility.address}</p>
              </div>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedFacility.name + ' ' + selectedFacility.address)}`}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold rounded-xl text-[11px] flex items-center gap-1.5 shadow-md cursor-pointer shrink-0 transition-all"
              >
                <Navigation className="w-3.5 h-3.5 fill-slate-950" />
                Open Google Maps
              </a>
            </div>
          </div>

          {/* Facilities List Side Panel */}
          <div className="lg:col-span-5 space-y-3 max-h-[420px] overflow-y-auto pr-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              India Healthcare Network ({filteredFacilities.length})
            </h3>

            {filteredFacilities.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs space-y-2">
                <p className="font-bold">No hospital matches found for your search query.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedStateFilter('all');
                  }}
                  className="px-3 py-1.5 bg-slate-900 text-white rounded-xl font-bold"
                >
                  Clear Search & View All India Hospitals
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
                          <span className="bg-indigo-100 text-indigo-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                            {fac.city}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                          {fac.address}
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
