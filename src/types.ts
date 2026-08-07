export type UserRole =
  | 'patient'
  | 'doctor'
  | 'hospital_admin'
  | 'ambulance_driver'
  | 'lab_staff'
  | 'pharmacy_staff'
  | 'super_admin';

export interface BedCategory {
  total: number;
  available: number;
}

export interface HospitalBeds {
  icu: BedCategory;
  ventilator: BedCategory;
  oxygen: BedCategory;
  normal: BedCategory;
  pediatric: BedCategory;
}

export interface Hospital {
  id: string;
  name: string;
  address: string;
  location: { lat: number; lng: number };
  distanceKm: number;
  rating: number;
  contactPhone: string;
  emergencyNumber: string;
  beds: HospitalBeds;
  specialties: string[];
}

export interface PatientProfile {
  id: string;
  name: string;
  abhaId: string; // Digital Ayushman Bharat Health ID e.g., 9102-4410-8812
  age: number;
  gender: string;
  bloodGroup: string;
  phone: string;
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  allergies: string[];
  chronicConditions: string[];
  vitals: {
    bloodPressure: string;
    heartRate: number;
    spO2: number;
    temperature: number;
    bloodGlucose: number;
    lastUpdated: string;
  };
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  qualification: string;
  hospitalName: string;
  experienceYears: number;
  consultationFee: number;
  rating: number;
  availableDays: string[];
  availableSlots: string[];
  photoUrl: string;
}

export interface Ambulance {
  id: string;
  vehicleNumber: string;
  driverName: string;
  phone: string;
  type: string;
  status: 'Available' | 'En Route to Patient' | 'Patient Onboard' | 'Completed';
  currentLocation: { lat: number; lng: number };
  hospitalId: string;
}

export interface DigitalReferral {
  id: string;
  patientName: string;
  patientAge: number;
  gender: string;
  abhaId: string;
  referredByDoctor: string;
  referringHospital: string;
  receivingHospitalId: string;
  receivingHospitalName: string;
  medicalSummary: string;
  requiredBedType: 'icu' | 'ventilator' | 'oxygen' | 'normal' | 'pediatric';
  urgency: 'CRITICAL' | 'HIGH' | 'ROUTINE';
  status:
    | 'PENDING_RECEIVING_REVIEW'
    | 'APPROVED_BY_RECEIVING_HOSPITAL'
    | 'REJECTED'
    | 'AMBULANCE_DISPATCHED'
    | 'PATIENT_ADMITTED'
    | 'CLOSED';
  ambulanceAssignedId?: string;
  ambulanceVehicle?: string;
  etaMinutes?: number;
  createdAt: string;
  updatedAt: string;
}

export interface MedicineReminder {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  timing: 'Before Meals' | 'After Meals' | 'With Water' | 'Bedtime';
  times: string[]; // e.g. ["08:00 AM", "08:00 PM"]
  active: boolean;
  takenToday: boolean;
  prescribedBy?: string;
}

export interface Prescription {
  id: string;
  date: string;
  doctorName: string;
  doctorSpecialty: string;
  hospitalName: string;
  diagnosis: string;
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }[];
}

export interface LabReport {
  id: string;
  testName: string;
  category: string;
  date: string;
  labName: string;
  status: 'Completed' | 'Pending Review';
  keyResults: {
    parameter: string;
    value: string;
    unit: string;
    normalRange: string;
    flag: 'NORMAL' | 'HIGH' | 'CRITICAL';
  }[];
  aiSummary?: string;
  downloadUrl?: string;
}

export interface BloodStock {
  bloodGroup: string;
  unitsAvailable: number;
  location: string;
}

export interface OrganDonor {
  id: string;
  donorName: string;
  donorAbhaId: string;
  bloodGroup: string;
  pledgedOrgans: string[];
  registeredDate: string;
  donorCardId: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  details: string;
}

export interface SymptomEvaluation {
  triageLevel: 'CRITICAL' | 'URGENT' | 'MODERATE' | 'LOW_RISK';
  urgencyColor: 'red' | 'orange' | 'yellow' | 'green';
  recommendedSpecialist: string;
  possibleConditions: {
    name: string;
    probabilityPercent: number;
    description: string;
  }[];
  immediateAction: string;
  redFlagWarnings: string[];
  homeCareTips: string[];
  suggestedTests: string[];
}

export interface RiskPredictionResult {
  overallHealthScore: number;
  cardiovascularRisk: { level: string; percent: number; keyDriver: string };
  diabetesRisk: { level: string; percent: number; keyDriver: string };
  hypertensionRisk: { level: string; percent: number; keyDriver: string };
  lifestyleRecommendations: string[];
  dietaryAdvice: string[];
  clinicalNextSteps: string[];
}
