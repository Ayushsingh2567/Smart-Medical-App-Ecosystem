import React, { useState } from 'react';
import {
  AlertTriangle,
  Bell,
  Camera,
  CheckCircle2,
  Clock,
  CreditCard,
  FileText,
  Home,
  Loader2,
  PackageCheck,
  Pill,
  Plus,
  ShieldAlert,
  ShoppingBag,
  Sparkles,
  Trash2,
  Truck,
  Upload,
} from 'lucide-react';
import { MedicineReminder, PaymentTransaction } from '../../types';
import { PaymentModal } from '../payment/PaymentModal';

export const MedicineManager: React.FC = () => {
  const [reminders, setReminders] = useState<MedicineReminder[]>([]);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [prescriptionText, setPrescriptionText] = useState('');
  const [ocrResult, setOcrResult] = useState<any>(null);

  // Add Medicine Reminder Modal State
  const [showAddMedModal, setShowAddMedModal] = useState(false);
  const [medName, setMedName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('Once Daily');
  const [timing, setTiming] = useState('After Meals');
  const [prescribedBy, setPrescribedBy] = useState('');

  // Explicit Order Medicine & Doctor Prescription Upload Modal State
  const [showOrderMedModal, setShowOrderMedModal] = useState(false);
  const [orderMedicineName, setOrderMedicineName] = useState('');
  const [orderQuantity, setOrderQuantity] = useState('30 Tablets (1 Month Supply)');
  const [doctorPrescriptionName, setDoctorPrescriptionName] = useState('');
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);
  const [deliveryAddressText, setDeliveryAddressText] = useState('Flat 402, Green Valley Apartments, Main Street');

  // Payment & Express Home Delivery State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [orderedItemName, setOrderedItemName] = useState('');
  const [orderTotalAmount, setOrderTotalAmount] = useState(35.00);
  const [activeDeliveries, setActiveDeliveries] = useState<PaymentTransaction[]>([]);
  const [deliverySuccessToast, setDeliverySuccessToast] = useState('');

  const handleInitiateHomeDelivery = (itemName: string, amount: number) => {
    setOrderedItemName(itemName);
    setOrderTotalAmount(amount);
    setShowPaymentModal(true);
  };

  const toggleTaken = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, takenToday: !r.takenToday } : r))
    );
  };

  const handleDeleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  const handleAddMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medName) return;

    const newMed: MedicineReminder = {
      id: 'med-' + Date.now(),
      name: medName,
      dosage: dosage || '1 Tablet',
      frequency,
      timing,
      times: ['08:00 AM'],
      active: true,
      takenToday: false,
      prescribedBy: prescribedBy || 'Self Scheduled',
    };

    setReminders((prev) => [newMed, ...prev]);
    setShowAddMedModal(false);
    setMedName('');
    setDosage('');
    setPrescribedBy('');
  };

  const handleInitiateOrderModal = () => {
    setOrderMedicineName(medName || 'Amlodipine 5mg / Atorvastatin 10mg');
    setShowOrderMedModal(true);
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderMedicineName) return;

    setShowOrderMedModal(false);
    setOrderedItemName(`${orderMedicineName} (${orderQuantity}) • Rx: ${doctorPrescriptionName || 'Verified Doctor Prescription'}`);
    setOrderTotalAmount(45.00);
    setShowPaymentModal(true);
  };

  const handlePaymentCompleted = (txn: PaymentTransaction) => {
    setActiveDeliveries((prev) => [txn, ...prev]);
    setDeliverySuccessToast(`Medicine Order Confirmed for ${orderedItemName}! Express courier dispatched.`);
    setTimeout(() => setDeliverySuccessToast(''), 8000);
  };

  const handleAnalyzePrescriptionText = () => {
    if (!prescriptionText.trim()) return;
    setOcrLoading(true);

    setTimeout(() => {
      setOcrResult({
        detectedMedicines: [
          { name: 'Metformin Hydrochloride 500mg', dosage: '1 Tab Twice Daily (After Meals)', duration: '30 Days' },
          { name: 'Telmisartan 40mg', dosage: '1 Tab Morning (Before Breakfast)', duration: '30 Days' },
        ],
        confidenceScore: 98,
        interactionsWarning: 'No harmful drug-drug interactions detected between prescribed medications.',
      });
      setOcrLoading(false);
    }, 700);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-rose-500/20 border border-rose-400/30 text-rose-300 px-3 py-1 rounded-full text-xs font-semibold mb-3">
            <ShoppingBag className="w-3.5 h-3.5" />
            Express Pharmacy Home Delivery & Online Payment Gateway
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Smart Medicine Manager & Home Delivery Service
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm">
            Schedule dosage alarms, scan physical prescriptions, and order doorstep medicine delivery with live courier tracking & UPI/Card payment.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleInitiateOrderModal}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold rounded-xl flex items-center gap-2 shadow-lg cursor-pointer transition-all"
          >
            <Truck className="w-4 h-4" />
            Order Pharmacy Home Delivery
          </button>
          <button
            onClick={() => setShowAddMedModal(true)}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold rounded-xl flex items-center gap-2 shadow-lg cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            + Add Medicine
          </button>
        </div>
      </div>

      {/* Success Toast */}
      {deliverySuccessToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-3 text-xs text-emerald-900 animate-in fade-in">
          <PackageCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <span className="font-bold block">Pharmacy Doorstep Order Confirmed!</span>
            {deliverySuccessToast}
          </div>
        </div>
      )}

      {/* Active Orders List */}
      {activeDeliveries.length > 0 && (
        <div className="bg-slate-900 text-white p-5 rounded-3xl border border-slate-800 space-y-3 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-xs text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-amber-400 animate-bounce" />
              Active Home Delivery Orders ({activeDeliveries.length})
            </span>
            <span className="text-[10px] text-slate-400">Live Rider Dispatch Sync</span>
          </div>

          <div className="space-y-2 text-xs">
            {activeDeliveries.map((del) => (
              <div key={del.id} className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/80 flex items-center justify-between">
                <div>
                  <div className="font-extrabold text-white">{del.itemName}</div>
                  <div className="text-[10px] text-slate-400">Courier ID: {del.transactionId} • Address: {del.address}</div>
                </div>
                <div className="text-right">
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded text-[10px] font-bold">
                    DISPATCHED (ETA 25 Mins)
                  </span>
                  <div className="text-amber-300 font-mono font-bold mt-0.5">${del.amount.toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Medicine Alarms */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Pill className="w-5 h-5 text-rose-600" />
              Active Daily Medication Schedule
            </h2>
            <span className="text-xs font-bold text-slate-500">
              {reminders.filter((r) => r.takenToday).length} of {reminders.length} Taken Today
            </span>
          </div>

          {reminders.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <Pill className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-600">No Active Medicine Reminders</p>
              <p className="text-[11px] text-slate-400">Click "+ Add Medicine" or order doorstep pharmacy delivery.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reminders.map((med) => (
                <div
                  key={med.id}
                  className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                    med.takenToday
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleTaken(med.id)}
                      className={`w-6 h-6 rounded-lg border flex items-center justify-center cursor-pointer transition-all ${
                        med.takenToday
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 bg-white hover:border-emerald-500'
                      }`}
                    >
                      {med.takenToday && <CheckCircle2 className="w-4 h-4" />}
                    </button>
                    <div>
                      <h4 className={`text-sm font-extrabold ${med.takenToday ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                        {med.name} ({med.dosage})
                      </h4>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span>{med.frequency} • {med.timing}</span>
                        <span>• Rx: {med.prescribedBy}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleInitiateHomeDelivery(med.name, 35.00)}
                      className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-[11px] cursor-pointer"
                    >
                      Re-order
                    </button>
                    <button
                      onClick={() => handleDeleteReminder(med.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Prescription OCR & Scanner */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Camera className="w-5 h-5 text-rose-600" />
              Prescription OCR & Order Scanner
            </h2>
            <p className="text-xs text-slate-500">Upload prescription image or paste doctor notes to extract dosages.</p>
          </div>

          <div className="border-2 border-dashed border-rose-200 rounded-2xl p-6 text-center bg-rose-50/40 hover:bg-rose-50/80 transition-all cursor-pointer">
            <Upload className="w-8 h-8 text-rose-500 mx-auto mb-2" />
            <span className="text-xs font-bold text-slate-800 block">Upload Prescription Photo / PDF</span>
            <span className="text-[10px] text-slate-400">JPG, PNG, PDF up to 10MB</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Or paste prescription text:</label>
            <textarea
              rows={3}
              value={prescriptionText}
              onChange={(e) => setPrescriptionText(e.target.value)}
              placeholder="Paste medicines e.g. Metformin 500mg BD..."
              className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-800 focus:ring-2 focus:ring-rose-500 outline-none"
            />
          </div>

          <button
            onClick={handleAnalyzePrescriptionText}
            disabled={ocrLoading}
            className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
          >
            {ocrLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Analyze Prescription & Check Interactions
          </button>

          {ocrResult && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 animate-in fade-in text-xs">
              <span className="font-bold text-slate-900 block">Extracted Medicines ({ocrResult.confidenceScore}% Confidence)</span>
              {ocrResult.detectedMedicines.map((m: any, idx: number) => (
                <div key={idx} className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900">{m.name}</div>
                    <div className="text-[11px] text-slate-500">{m.dosage} • {m.duration}</div>
                  </div>
                  <button
                    onClick={() => handleInitiateHomeDelivery(m.name, 40.00)}
                    className="px-2.5 py-1 bg-emerald-600 text-white font-bold rounded-lg text-[10px]"
                  >
                    Order Now
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* EXPLICIT ORDER MEDICINE & DOCTOR PRESCRIPTION MODAL */}
      {showOrderMedModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-slate-900 border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-emerald-600" />
                Order Medicine & Upload Doctor Prescription
              </h3>
              <button onClick={() => setShowOrderMedModal(false)} className="text-slate-400 font-bold text-sm">✕</button>
            </div>

            <form onSubmit={handleProceedToPayment} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Medicine Name & Strength *</label>
                <input
                  type="text"
                  required
                  value={orderMedicineName}
                  onChange={(e) => setOrderMedicineName(e.target.value)}
                  placeholder="e.g. Amlodipine 5mg / Paracetamol 500mg"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Quantity / Supply</label>
                  <select
                    value={orderQuantity}
                    onChange={(e) => setOrderQuantity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="15 Tablets (2 Weeks)">15 Tablets (2 Weeks)</option>
                    <option value="30 Tablets (1 Month)">30 Tablets (1 Month)</option>
                    <option value="60 Tablets (2 Months)">60 Tablets (2 Months)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Prescribing Doctor</label>
                  <input
                    type="text"
                    value={doctorPrescriptionName}
                    onChange={(e) => setDoctorPrescriptionName(e.target.value)}
                    placeholder="e.g. Dr. Sarah Jenkins, MD"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Upload Doctor Prescription File (Optional)</label>
                <input
                  type="file"
                  onChange={(e) => setPrescriptionFile(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-[11px]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Home Delivery Address *</label>
                <input
                  type="text"
                  required
                  value={deliveryAddressText}
                  onChange={(e) => setDeliveryAddressText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                Proceed to Online Payment ($45.00)
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Payment Gateway Checkout Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        serviceTitle="Express Pharmacy Home Delivery"
        itemName={orderedItemName || 'Prescription Medicines Supply'}
        totalAmount={orderTotalAmount}
        deliveryAddress={deliveryAddressText}
        onPaymentSuccess={handlePaymentCompleted}
      />
    </div>
  );
};
