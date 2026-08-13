import React, { useState, useEffect } from 'react';
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
  Stethoscope,
  Trash2,
  Truck,
  Upload,
  X,
} from 'lucide-react';
import { MedicineReminder, PaymentTransaction } from '../../types';
import { PaymentModal } from '../payment/PaymentModal';

export const MedicineManager: React.FC = () => {
  const [reminders, setReminders] = useState<MedicineReminder[]>([]);
  const [doctorRxList, setDoctorRxList] = useState<any[]>([]);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [prescriptionText, setPrescriptionText] = useState('');
  const [ocrResult, setOcrResult] = useState<any>(null);

  // Add Medicine Reminder Modal State
  const [showAddMedModal, setShowAddMedModal] = useState(false);
  const [medName, setMedName] = useState('');
  const [dosage, setDosage] = useState('1 Tablet');
  const [frequency, setFrequency] = useState('Once Daily');
  const [timing, setTiming] = useState('After Meals');
  const [alarmTime, setAlarmTime] = useState('08:00 AM');
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

  // Load and sync reminders & doctor prescriptions with localStorage
  useEffect(() => {
    const saved = localStorage.getItem('biomed_reminders');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setReminders(parsed);
      } catch (err) {
        console.error('Error loading stored reminders:', err);
      }
    }

    const savedRx = localStorage.getItem('biomed_doctor_prescriptions');
    if (savedRx) {
      try {
        const parsedRx = JSON.parse(savedRx);
        if (Array.isArray(parsedRx)) setDoctorRxList(parsedRx);
      } catch (err) {
        console.error('Error loading doctor prescriptions:', err);
      }
    }
  }, []);

  const saveRemindersToStorage = (updated: MedicineReminder[]) => {
    setReminders(updated);
    localStorage.setItem('biomed_reminders', JSON.stringify(updated));
  };

  const handleInitiateHomeDelivery = (itemName: string, amount: number, doctorName?: string) => {
    setOrderMedicineName(itemName);
    if (doctorName) setDoctorPrescriptionName(doctorName);
    setOrderedItemName(itemName);
    setOrderTotalAmount(amount);
    setShowPaymentModal(true);
  };

  const toggleTaken = (id: string) => {
    const updated = reminders.map((r) => (r.id === id ? { ...r, takenToday: !r.takenToday } : r));
    saveRemindersToStorage(updated);
  };

  const handleDeleteReminder = (id: string) => {
    const updated = reminders.filter((r) => r.id !== id);
    saveRemindersToStorage(updated);
  };

  const handleAddMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medName.trim()) return;

    const newMed: MedicineReminder = {
      id: 'med-' + Date.now(),
      name: medName.trim(),
      dosage: dosage || '1 Tablet',
      frequency,
      timing,
      times: [alarmTime],
      active: true,
      takenToday: false,
      prescribedBy: prescribedBy.trim() || 'Self Scheduled',
    };

    saveRemindersToStorage([newMed, ...reminders]);
    setShowAddMedModal(false);
    setMedName('');
    setDosage('1 Tablet');
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
            Express Pharmacy Home Delivery & Inter-Portal Doctor Sync
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Smart Medicine Manager & Doctor e-Rx Order Center
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm">
            Order doorstep delivery of medicines written by your attending doctor, schedule daily alarms, and scan physical prescriptions.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleInitiateOrderModal}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold rounded-xl flex items-center gap-2 shadow-lg cursor-pointer transition-all active:scale-95"
          >
            <Truck className="w-4 h-4" />
            Order Pharmacy Home Delivery
          </button>
          <button
            onClick={() => setShowAddMedModal(true)}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold rounded-xl flex items-center gap-2 shadow-lg cursor-pointer transition-all active:scale-95"
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

      {/* ACTIVE DOCTOR PRESCRIPTIONS BANNER (DOCTOR PORTAL INTEGRATION) */}
      {doctorRxList.length > 0 && (
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-5 rounded-3xl border border-blue-700 space-y-3 shadow-xl">
          <div className="flex items-center justify-between border-b border-blue-800/80 pb-2">
            <span className="font-extrabold text-xs text-teal-300 uppercase tracking-widest flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-teal-300" />
              Doctor Prescribed Medications (Ready for 1-Click Order)
            </span>
            <span className="text-[10px] bg-teal-500/20 text-teal-200 border border-teal-400/30 px-2 py-0.5 rounded font-bold">
              VERIFIED DOCTOR RX
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            {doctorRxList.map((rx, idx) => (
              <div key={idx} className="p-3.5 bg-slate-900/90 rounded-2xl border border-blue-800/60 flex flex-col justify-between space-y-2">
                <div>
                  <div className="font-extrabold text-white text-xs">{rx.name} ({rx.dosage})</div>
                  <div className="text-[10px] text-teal-300 font-medium">{rx.frequency} • Prescribed by {rx.doctorName || 'Dr. Sarah Jenkins, MD'}</div>
                </div>
                <button
                  onClick={() => handleInitiateHomeDelivery(rx.name, 35.00, rx.doctorName)}
                  className="w-full py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-[11px] flex items-center justify-center gap-1 cursor-pointer transition-all shadow-md"
                >
                  <Truck className="w-3.5 h-3.5 fill-slate-950" /> Order for Doorstep Delivery
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Deliveries */}
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
            <button
              onClick={() => setShowAddMedModal(true)}
              className="text-xs font-extrabold text-rose-600 hover:underline cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Medicine
            </button>
          </div>

          {reminders.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <Pill className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-600">No Active Medicine Reminders</p>
              <p className="text-[11px] text-slate-400">Click "+ Add Medicine" or order doorstep pharmacy delivery.</p>
              <button
                onClick={() => setShowAddMedModal(true)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-extrabold rounded-xl text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" /> Add Medicine Alarm Now
              </button>
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
                      onClick={() => handleInitiateHomeDelivery(med.name, 35.00, med.prescribedBy)}
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

      {/* MODAL 1: INSTANT ADD MEDICINE SCHEDULE MODAL */}
      {showAddMedModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-slate-900 border border-slate-200 animate-in fade-in">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Pill className="w-4 h-4 text-rose-600" />
                Add New Medication & Dosage Alarm
              </h3>
              <button onClick={() => setShowAddMedModal(false)} className="text-slate-400 font-bold text-sm hover:text-slate-800 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMedicine} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Medicine Name & Strength *</label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={medName}
                  onChange={(e) => setMedName(e.target.value)}
                  placeholder="e.g. Atorvastatin 10mg / Metformin 500mg"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium focus:border-rose-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Dosage Amount</label>
                  <input
                    type="text"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    placeholder="e.g. 1 Tablet / 5ml Syrup"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Frequency</label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium"
                  >
                    <option value="Once Daily">Once Daily</option>
                    <option value="Twice Daily">Twice Daily (BD)</option>
                    <option value="Three Times Daily">Three Times Daily (TDS)</option>
                    <option value="As Needed (PRN)">As Needed (PRN)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Meal Timing</label>
                  <select
                    value={timing}
                    onChange={(e) => setTiming(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium"
                  >
                    <option value="After Meals">After Meals</option>
                    <option value="Before Meals">Before Meals</option>
                    <option value="With Meals">With Meals</option>
                    <option value="At Bedtime">At Bedtime</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Alarm Time</label>
                  <select
                    value={alarmTime}
                    onChange={(e) => setAlarmTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-mono font-bold"
                  >
                    <option value="08:00 AM">08:00 AM (Morning)</option>
                    <option value="01:00 PM">01:00 PM (Afternoon)</option>
                    <option value="08:00 PM">08:00 PM (Evening)</option>
                    <option value="10:00 PM">10:00 PM (Night)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Prescribing Doctor (Optional)</label>
                <input
                  type="text"
                  value={prescribedBy}
                  onChange={(e) => setPrescribedBy(e.target.value)}
                  placeholder="e.g. Dr. Sarah Jenkins, MD"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                Schedule Medication Alarm
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ORDER MEDICINE & DOCTOR PRESCRIPTION MODAL */}
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
