import React, { useState } from 'react';
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  CreditCard,
  DollarSign,
  Home,
  Lock,
  MapPin,
  PackageCheck,
  Phone,
  QrCode,
  ShieldCheck,
  Smartphone,
  Truck,
  User,
} from 'lucide-react';
import { PaymentTransaction } from '../../types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  amount: number;
  serviceType: 'DOCTOR_OPD' | 'HOSPITAL_BED' | 'LAB_BLOOD_TEST' | 'PHARMACY_HOME_DELIVERY';
  itemName: string;
  onPaymentSuccess: (transaction: PaymentTransaction) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  title,
  amount,
  serviceType,
  itemName,
  onPaymentSuccess,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'NET_BANKING' | 'HEALTH_INSURANCE'>('UPI');
  
  // Payment Form States
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [insuranceId, setInsuranceId] = useState('');
  
  // Home Delivery Address Form (Required if PHARMACY_HOME_DELIVERY or optionally for tests/beds)
  const [isHomeDelivery, setIsHomeDelivery] = useState(serviceType === 'PHARMACY_HOME_DELIVERY');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [deliveryPhone, setDeliveryPhone] = useState('');

  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isHomeDelivery && (!streetAddress || !city || !pincode)) {
      setError('Please fill in your complete Home Delivery Address (Street, City, Pincode)');
      return;
    }

    if (paymentMethod === 'UPI' && !upiId) {
      setError('Please enter your UPI ID (e.g., username@upi or mobile@gpay)');
      return;
    }

    if ((paymentMethod === 'CREDIT_CARD' || paymentMethod === 'DEBIT_CARD') && !cardNumber) {
      setError('Please enter valid 16-digit Card Number');
      return;
    }

    setProcessing(true);

    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);

      const txn: PaymentTransaction = {
        id: 'TXN-' + Math.floor(100000 + Math.random() * 900000),
        amount,
        serviceType,
        paymentMethod,
        status: 'SUCCESS',
        deliveryAddress: isHomeDelivery ? `${streetAddress}, ${city} - ${pincode}` : undefined,
        deliveryPhone: deliveryPhone || undefined,
        deliveryStatus: isHomeDelivery ? 'OUT_FOR_DELIVERY' : undefined,
        timestamp: new Date().toISOString(),
      };

      setTimeout(() => {
        onPaymentSuccess(txn);
        onClose();
      }, 2000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 my-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">{title}</h3>
              <p className="text-xs text-slate-500">256-Bit Encrypted Payment & Order Portal</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 font-bold hover:text-slate-800 text-sm">✕</button>
        </div>

        {/* Item Summary Banner */}
        <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-between shadow-md">
          <div>
            <span className="text-[10px] uppercase font-bold text-teal-400 block tracking-wider">Checkout Item</span>
            <span className="text-sm font-extrabold text-white block">{itemName}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Payable</span>
            <span className="text-xl font-black text-emerald-400">${amount.toFixed(2)}</span>
          </div>
        </div>

        {success ? (
          <div className="p-8 text-center bg-emerald-50 border border-emerald-300 rounded-3xl space-y-3 animate-in zoom-in-95">
            <div className="w-14 h-14 rounded-full bg-emerald-600 text-white mx-auto flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-black text-emerald-950">Payment Approved Successfully!</h4>
            <p className="text-xs text-emerald-900 leading-relaxed">
              Transaction ID: <span className="font-mono font-bold">TXN-{Math.floor(100000 + Math.random() * 900000)}</span>.
              {isHomeDelivery && (
                <span className="block mt-2 font-bold text-teal-800">
                  🚚 Medicine Express Rider Dispatched to: {streetAddress}, {city}!
                </span>
              )}
            </p>
          </div>
        ) : (
          <form onSubmit={handleProcessPayment} className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Home Delivery Address Option */}
            {(serviceType === 'PHARMACY_HOME_DELIVERY' || serviceType === 'LAB_BLOOD_TEST') && (
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-emerald-600" />
                    Express Pharmacy Home Delivery & Sample Collection
                  </span>
                  <input
                    type="checkbox"
                    checked={isHomeDelivery}
                    onChange={(e) => setIsHomeDelivery(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                  />
                </div>

                {isHomeDelivery && (
                  <div className="space-y-2 pt-1 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">House No. / Street Address *</label>
                      <input
                        type="text"
                        required
                        value={streetAddress}
                        onChange={(e) => setStreetAddress(e.target.value)}
                        placeholder="e.g. Flat 402, Green Avenue, Main Road"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">City / Town *</label>
                        <input
                          type="text"
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="City"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Postal Pincode *</label>
                        <input
                          type="text"
                          required
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                          placeholder="e.g. 700001"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Contact Phone for Delivery Rider</label>
                      <input
                        type="tel"
                        value={deliveryPhone}
                        onChange={(e) => setDeliveryPhone(e.target.value)}
                        placeholder="+91 8114240263"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Payment Method
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-2.5 rounded-xl border font-bold flex items-center gap-2 cursor-pointer ${
                    paymentMethod === 'UPI' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Smartphone className="w-4 h-4" /> UPI / GPay / PhonePe
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('CREDIT_CARD')}
                  className={`p-2.5 rounded-xl border font-bold flex items-center gap-2 cursor-pointer ${
                    paymentMethod === 'CREDIT_CARD' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <CreditCard className="w-4 h-4" /> Credit / Debit Card
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('HEALTH_INSURANCE')}
                  className={`p-2.5 rounded-xl border font-bold flex items-center gap-2 cursor-pointer ${
                    paymentMethod === 'HEALTH_INSURANCE' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Building2 className="w-4 h-4" /> PM-JAY / Insurance
                </button>
              </div>
            </div>

            {/* Form Fields for selected Payment Method */}
            {paymentMethod === 'UPI' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Enter UPI ID / VPA *</label>
                <input
                  type="text"
                  required
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="mobile@gpay or username@upi"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                />
              </div>
            )}

            {(paymentMethod === 'CREDIT_CARD' || paymentMethod === 'DEBIT_CARD') && (
              <div className="space-y-2 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Card Number *</label>
                  <input
                    type="text"
                    required
                    maxLength={19}
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4532 •••• •••• 8920"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Expiry (MM/YY)</label>
                    <input
                      type="text"
                      maxLength={5}
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="08/28"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">CVC Code</label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      placeholder="•••"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'HEALTH_INSURANCE' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Health Insurance / PM-JAY Card ID *</label>
                <input
                  type="text"
                  required
                  value={insuranceId}
                  onChange={(e) => setInsuranceId(e.target.value)}
                  placeholder="INS-CARD-881920"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={processing}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              {processing ? 'Authorizing Payment...' : `Pay $${amount.toFixed(2)} & Confirm Booking`}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
