import React, { useState } from 'react';
import { Building2, CheckCircle2, Droplet, MapPin, PackageCheck, Pill, Search, Send, Truck } from 'lucide-react';

export const PharmacyPortal: React.FC = () => {
  const [fulfilledOrder, setFulfilledOrder] = useState(false);
  const [dispatchedRider, setDispatchedRider] = useState(false);

  // Delivery Orders State
  const [homeDeliveryOrders, setHomeDeliveryOrders] = useState([
    {
      id: 'ORD-881920',
      patientName: 'Registered Patient Member',
      phone: '+91 8114240263',
      address: 'Flat 402, Green Valley Apartments, Main Street',
      items: 'Amlodipine 5mg (30 Tabs), Paracetamol 500mg (10 Tabs)',
      amount: 45.00,
      paymentStatus: 'PAID (UPI)',
      status: 'READY_FOR_DISPATCH',
    },
  ]);

  const handleDispatchRider = (id: string) => {
    setHomeDeliveryOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: 'DISPATCHED_RIDER' } : o))
    );
    setDispatchedRider(true);
    setTimeout(() => setDispatchedRider(false), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-rose-500/20 border border-rose-400/30 text-rose-300 px-3 py-1 rounded-full text-xs font-semibold mb-3">
            <Truck className="w-3.5 h-3.5 text-rose-400" />
            Express Pharmacy Home Delivery & Inventory Control
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Central Pharmacy & Home Delivery Dispatch
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
            Fulfill e-Prescriptions, track paid online medicine orders, and assign pharmacy delivery riders for express doorstep delivery.
          </p>
        </div>
      </div>

      {/* Dispatched Toast */}
      {dispatchedRider && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-3 text-xs text-emerald-900 animate-in fade-in">
          <Truck className="w-5 h-5 text-emerald-600 flex-shrink-0 animate-bounce" />
          <span className="font-bold">Pharmacy Express Rider Dispatched with Patient Medicine Package!</span>
        </div>
      )}

      {/* Pending Home Delivery Orders */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Truck className="w-5 h-5 text-emerald-600" />
          Paid Doorstep Home Delivery Orders
        </h2>

        <div className="space-y-3">
          {homeDeliveryOrders.map((ord) => (
            <div key={ord.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 text-sm">{ord.id} - {ord.patientName}</span>
                  <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                    {ord.paymentStatus}
                  </span>
                </div>
                <p className="text-slate-600 font-medium">{ord.items}</p>
                <p className="text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> {ord.address} ({ord.phone})
                </p>
              </div>

              {ord.status === 'DISPATCHED_RIDER' ? (
                <span className="px-3 py-1.5 bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Rider En Route
                </span>
              ) : (
                <button
                  onClick={() => handleDispatchRider(ord.id)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-600/20"
                >
                  <Send className="w-4 h-4" /> Dispatch Delivery Rider
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
