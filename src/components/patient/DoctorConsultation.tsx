import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Mic,
  MicOff,
  PhoneOff,
  Star,
  Stethoscope,
  Video,
  VideoOff,
} from 'lucide-react';
import { sampleDoctors } from '../../data/mockData';
import { Doctor } from '../../types';

export const DoctorConsultation: React.FC = () => {
  const [doctors] = useState<Doctor[]>(sampleDoctors);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [activeVideoCall, setActiveVideoCall] = useState<Doctor | null>(null);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const handleBookSlot = (doc: Doctor, slot: string) => {
    setSelectedDoctor(doc);
    setSelectedSlot(slot);
    setBookingSuccess(true);
    setTimeout(() => setBookingSuccess(false), 5000);
  };

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
            Doctor Consultations & Telemedicine Video Room
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm">
            Book in-person hospital OPD slots or launch high-definition virtual video consultations with top specialists in real time.
          </p>
        </div>
      </div>

      {/* Booking Toast */}
      {bookingSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-3 text-xs text-emerald-900 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div>
            <span className="font-bold block">Appointment Confirmed!</span>
            Booked slot <span className="font-bold">{selectedSlot}</span> with {selectedDoctor?.name}. Notification sent to patient SMS & calendar.
          </div>
        </div>
      )}

      {/* Live Telemedicine Room if active */}
      {activeVideoCall && (
        <div className="bg-slate-950 rounded-3xl p-6 text-white border border-slate-800 shadow-2xl space-y-4 animate-in zoom-in-95">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
              <span className="text-xs font-bold text-red-400 uppercase tracking-widest">
                LIVE TELEMEDICINE CONSULTATION
              </span>
            </div>
            <span className="text-xs font-mono text-slate-400">Call Time: 04:12</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Doctor Video Screen */}
            <div className="relative bg-slate-900 rounded-2xl h-64 overflow-hidden border border-slate-800 flex items-center justify-center">
              <img
                src={activeVideoCall.photoUrl}
                alt={activeVideoCall.name}
                className="absolute inset-0 w-full h-full object-cover opacity-80"
              />
              <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-bold text-white border border-slate-700">
                {activeVideoCall.name} ({activeVideoCall.specialty})
              </div>
            </div>

            {/* Patient Self Video Screen */}
            <div className="relative bg-slate-900 rounded-2xl h-64 overflow-hidden border border-slate-800 flex items-center justify-center">
              {cameraOn ? (
                <div className="w-full h-full bg-gradient-to-tr from-slate-800 to-slate-700 flex items-center justify-center text-slate-400">
                  <span className="text-xs font-semibold">Self Video Stream Active (1080p)</span>
                </div>
              ) : (
                <div className="text-xs text-slate-500 flex items-center gap-2">
                  <VideoOff className="w-5 h-5 text-slate-500" /> Camera Off
                </div>
              )}
              <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-bold text-white border border-slate-700">
                You (Alexander Wright)
              </div>
            </div>
          </div>

          {/* Call Controls Bar */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setMicOn(!micOn)}
              className={`p-3 rounded-full transition-colors cursor-pointer ${
                micOn ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-red-600 text-white'
              }`}
            >
              {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setCameraOn(!cameraOn)}
              className={`p-3 rounded-full transition-colors cursor-pointer ${
                cameraOn ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-red-600 text-white'
              }`}
            >
              {cameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setActiveVideoCall(null)}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-red-600/30"
            >
              <PhoneOff className="w-4 h-4" /> End Telemedicine Session
            </button>
          </div>
        </div>
      )}

      {/* Doctor Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {doctors.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all space-y-4"
          >
            <div className="flex items-start gap-4">
              <img
                src={doc.photoUrl}
                alt={doc.name}
                className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-xs"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm">{doc.name}</h3>
                  <span className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {doc.rating}
                  </span>
                </div>
                <p className="text-xs text-blue-700 font-semibold">{doc.specialty}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{doc.hospitalName}</p>
                <p className="text-[11px] text-slate-400">{doc.qualification} • {doc.experienceYears} Yrs Exp</p>
              </div>
            </div>

            {/* Available Slot Chips */}
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                Available Appointment Slots Today:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {doc.availableSlots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => handleBookSlot(doc, slot)}
                    className="px-2.5 py-1 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                  >
                    <Clock className="w-3 h-3 inline mr-1 text-slate-400" />
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
              <span className="font-extrabold text-slate-900">
                ${doc.consultationFee} <span className="text-[10px] text-slate-500 font-normal">/ Session</span>
              </span>

              <button
                onClick={() => setActiveVideoCall(doc)}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                <Video className="w-3.5 h-3.5" /> Start Telemedicine Call
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
