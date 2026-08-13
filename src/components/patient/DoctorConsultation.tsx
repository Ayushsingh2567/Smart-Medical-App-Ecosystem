import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  Mic,
  MicOff,
  PhoneOff,
  Plus,
  Search,
  Star,
  Stethoscope,
  Video,
  VideoOff,
} from 'lucide-react';
import { sampleDoctors } from '../../data/mockData';
import { Doctor, PaymentTransaction } from '../../types';
import { PaymentModal } from '../payment/PaymentModal';

export const DoctorConsultation: React.FC = () => {
  const [doctors] = useState<Doctor[]>(sampleDoctors);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [activeVideoCall, setActiveVideoCall] = useState<Doctor | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingDoc, setPendingDoc] = useState<Doctor | null>(null);
  const [pendingSlot, setPendingSlot] = useState('');

  const handleInitiateBooking = (doc: Doctor, slot: string) => {
    setPendingDoc(doc);
    setPendingSlot(slot);
    setShowPaymentModal(true);
  };

  const handlePaymentCompleted = (txn: PaymentTransaction) => {
    if (pendingDoc && pendingSlot) {
      setSelectedDoctor(pendingDoc);
      setSelectedSlot(pendingSlot);
      setBookingSuccess(true);
      setTimeout(() => setBookingSuccess(false), 5000);
    }
  };

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.hospitalName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSpecialty =
      selectedSpecialty === 'all' || doc.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase());

    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 px-3 py-1 rounded-full text-xs font-semibold mb-3">
            <Stethoscope className="w-3.5 h-3.5" />
            Telemedicine & OPD Appointment Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Doctor Consultations & Telemedicine Room
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm">
            Book in-person hospital OPD slots or launch high-definition virtual video consultations with top specialists in real time.
          </p>
        </div>
      </div>

      {/* Success Toast */}
      {bookingSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-3 text-xs text-emerald-900 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div>
            <span className="font-bold block">OPD Appointment Confirmed!</span>
            Booked slot with <span className="font-bold underline">{selectedDoctor?.name}</span> for {selectedSlot}.
          </div>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search available doctors by Name, Specialty (Cardiology, Neurology, Pediatrics), or Hospital..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs text-slate-800 focus:border-blue-500 bg-slate-50 outline-none"
          />
        </div>

        <select
          value={selectedSpecialty}
          onChange={(e) => setSelectedSpecialty(e.target.value)}
          className="px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 outline-none w-full sm:w-auto"
        >
          <option value="all">All Medical Specialties</option>
          <option value="Cardiology">Cardiology & Heart Care</option>
          <option value="Neurology">Neurology & Stroke</option>
          <option value="Pediatrics">Pediatrics & Child Care</option>
          <option value="Orthopedics">Orthopedics & Joint Care</option>
        </select>
      </div>

      {/* Doctor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDoctors.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="flex items-start gap-4">
              <img
                src={doc.photoUrl}
                alt={doc.name}
                className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-xs shrink-0"
              />
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-slate-900 text-base">{doc.name}</h3>
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> {doc.rating}
                  </span>
                </div>
                <div className="text-blue-600 font-extrabold">{doc.specialty} • {doc.qualification}</div>
                <div className="text-slate-500">{doc.hospitalName}</div>
                <div className="text-emerald-700 font-bold">Consultation Fee: ${doc.consultationFee}</div>
              </div>
            </div>

            {/* OPD Slots */}
            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Select OPD Appointment Slot:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {doc.availableSlots.map((slot, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleInitiateBooking(doc, slot)}
                    className="py-1.5 px-2 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-800 font-bold rounded-xl text-[11px] cursor-pointer transition-all text-center"
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setActiveVideoCall(doc)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
            >
              <Video className="w-4 h-4" />
              Launch Live Telemedicine Video Room
            </button>
          </div>
        ))}
      </div>

      {/* Video Call Modal */}
      {activeVideoCall && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl max-w-2xl w-full p-6 text-white shadow-2xl space-y-4 border border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-bold text-sm">Telemedicine Consultation Room • {activeVideoCall.name}</span>
              </div>
              <button onClick={() => setActiveVideoCall(null)} className="text-slate-400 font-bold text-sm">✕</button>
            </div>

            <div className="bg-slate-950 rounded-2xl h-64 border border-slate-800 flex flex-col items-center justify-center text-center p-6 space-y-3 relative overflow-hidden">
              <img src={activeVideoCall.photoUrl} alt={activeVideoCall.name} className="w-20 h-20 rounded-full border-2 border-blue-500 object-cover shadow-lg" />
              <div>
                <h4 className="font-extrabold text-white text-base">{activeVideoCall.name}</h4>
                <p className="text-xs text-blue-400 font-bold">{activeVideoCall.specialty}</p>
              </div>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-3 py-1 rounded-full font-bold">
                ENCRYPTED TELEMEDICINE STREAM ACTIVE
              </span>
            </div>

            <div className="flex items-center justify-center gap-4 pt-2">
              <button className="p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-full"><Mic className="w-5 h-5" /></button>
              <button className="p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-full"><Video className="w-5 h-5" /></button>
              <button onClick={() => setActiveVideoCall(null)} className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl text-xs flex items-center gap-2">
                <PhoneOff className="w-4 h-4" /> End Video Consult
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Gateway Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        serviceTitle="Doctor OPD Appointment Booking"
        itemName={`${pendingDoc?.name} (${pendingDoc?.specialty}) • Slot: ${pendingSlot}`}
        totalAmount={pendingDoc?.consultationFee || 75}
        onPaymentSuccess={handlePaymentCompleted}
      />
    </div>
  );
};
