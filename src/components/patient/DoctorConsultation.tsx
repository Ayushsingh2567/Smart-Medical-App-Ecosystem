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
  Star,
  Stethoscope,
  Video,
  VideoOff,
} from 'lucide-react';
import { sampleDoctors } from '../../data/mockData';
import { Doctor, PaymentTransaction } from '../../types';
import { PaymentModal } from '../payment/PaymentModal';

export const DoctorConsultation: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>(sampleDoctors);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [activeVideoCall, setActiveVideoCall] = useState<Doctor | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingDoc, setPendingDoc] = useState<Doctor | null>(null);
  const [pendingSlot, setPendingSlot] = useState('');

  // Add Doctor Modal
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);
  const [docName, setDocName] = useState('');
  const [docSpecialty, setDocSpecialty] = useState('');
  const [docHospital, setDocHospital] = useState('');
  const [docFee, setDocFee] = useState(75);

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

  const handleAddDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName || !docSpecialty) return;

    const newDoc: Doctor = {
      id: 'doc-' + Date.now(),
      name: docName,
      specialty: docSpecialty,
      qualification: 'MBBS, MD',
      hospitalName: docHospital || 'Super Specialty Hospital',
      experienceYears: 10,
      consultationFee: Number(docFee) || 75,
      rating: 4.9,
      availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      availableSlots: ['09:00 AM', '11:30 AM', '02:00 PM', '04:30 PM'],
      photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300',
    };

    setDoctors((prev) => [newDoc, ...prev]);
    setShowAddDoctorModal(false);
    setDocName('');
    setDocSpecialty('');
    setDocHospital('');
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
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

        <button
          onClick={() => setShowAddDoctorModal(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold rounded-xl flex items-center gap-2 shadow-lg shrink-0 cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" />
          + Add Doctor Profile
        </button>
      </div>

      {/* Booking Toast */}
      {bookingSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-3 text-xs text-emerald-900 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div>
            <span className="font-bold block">Appointment Paid & Confirmed!</span>
            Booked slot <span className="font-bold">{selectedSlot}</span> with {selectedDoctor?.name}. E-ticket & receipt dispatched to SMS & Health Vault.
          </div>
        </div>
      )}

      {/* Doctor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {doctors.map((doc) => (
          <div key={doc.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4 flex flex-col justify-between hover:shadow-md transition-all">
            <div className="flex items-start gap-4">
              <img src={doc.photoUrl} alt={doc.name} className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-sm" />
              <div>
                <h3 className="font-extrabold text-base text-slate-900">{doc.name}</h3>
                <p className="text-xs font-bold text-blue-600">{doc.specialty}</p>
                <p className="text-xs text-slate-500 mt-1">{doc.hospitalName}</p>
                <span className="inline-block mt-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                  Fee: ${doc.consultationFee}
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-500 block">Select OPD Appointment Slot:</span>
              <div className="flex flex-wrap gap-2">
                {doc.availableSlots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => handleInitiateBooking(doc, slot)}
                    className="px-3 py-1.5 bg-slate-50 hover:bg-emerald-600 hover:text-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer transition-all flex items-center gap-1"
                  >
                    <CreditCard className="w-3 h-3 text-slate-400" />
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setActiveVideoCall(doc)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-2 transition-all"
            >
              <Video className="w-4 h-4" /> Launch Live Telemedicine Video Room
            </button>
          </div>
        ))}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && pendingDoc && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          title="Doctor OPD Consultation Checkout"
          amount={pendingDoc.consultationFee}
          serviceType="DOCTOR_OPD"
          itemName={`OPD Consultation Slot (${pendingSlot}) with ${pendingDoc.name}`}
          onPaymentSuccess={handlePaymentCompleted}
        />
      )}

      {/* Add Doctor Modal */}
      {showAddDoctorModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleAddDoctor} className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-slate-900">Add Practitioner / Doctor Profile</h3>
              <button type="button" onClick={() => setShowAddDoctorModal(false)} className="text-slate-400 font-bold text-sm">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Doctor Full Name *</label>
                <input type="text" required value={docName} onChange={(e) => setDocName(e.target.value)} placeholder="e.g. Dr. Sarah Jenkins, MD" className="w-full p-2.5 border rounded-xl" />
              </div>
              <div>
                <label className="font-bold block mb-1">Medical Specialty *</label>
                <input type="text" required value={docSpecialty} onChange={(e) => setDocSpecialty(e.target.value)} placeholder="e.g. Cardiology & Critical Care" className="w-full p-2.5 border rounded-xl" />
              </div>
              <div>
                <label className="font-bold block mb-1">Hospital / Clinic Name</label>
                <input type="text" value={docHospital} onChange={(e) => setDocHospital(e.target.value)} placeholder="e.g. City Central Hospital" className="w-full p-2.5 border rounded-xl" />
              </div>
              <div>
                <label className="font-bold block mb-1">Consultation Fee ($)</label>
                <input type="number" value={docFee} onChange={(e) => setDocFee(Number(e.target.value))} className="w-full p-2.5 border rounded-xl" />
              </div>
            </div>

            <button type="submit" className="w-full py-2.5 bg-blue-600 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer">Register Doctor Profile</button>
          </form>
        </div>
      )}
    </div>
  );
};
