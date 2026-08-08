import {
  PatientProfile,
  Doctor,
  MedicineReminder,
  Prescription,
  LabReport,
  OrganDonor,
} from '../types';

export const initialPatientProfile: PatientProfile = {
  id: "pat-default",
  name: "New Member",
  abhaId: "ABHA-IN-1001-8812",
  age: 30,
  gender: "Not Specified",
  bloodGroup: "O+",
  phone: "+1 (555) 000-0000",
  emergencyContact: {
    name: "Emergency Contact",
    relation: "Family Member",
    phone: "+1 (555) 000-0000",
  },
  allergies: [],
  chronicConditions: [],
  vitals: {
    bloodPressure: "120/80",
    heartRate: 72,
    spO2: 99,
    temperature: 98.6,
    bloodGlucose: 95,
    lastUpdated: "Not updated yet",
  },
};

export const sampleDoctors: Doctor[] = [
  {
    id: "doc-1",
    name: "Dr. Sarah Jenkins, MD",
    specialty: "Cardiology & Interventional Care",
    qualification: "MBBS, MD (Cardiology), FACC",
    hospitalName: "City Central Super Specialty Hospital",
    experienceYears: 16,
    consultationFee: 75,
    rating: 4.9,
    availableDays: ["Mon", "Wed", "Fri", "Sat"],
    availableSlots: ["09:00 AM", "11:30 AM", "02:00 PM", "04:30 PM"],
    photoUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300",
  },
  {
    id: "doc-2",
    name: "Dr. Rajesh K. Sharma, MD",
    specialty: "Neurology & Stroke Care",
    qualification: "MD, DM (Neurology)",
    hospitalName: "Apex Heart & Trauma Center",
    experienceYears: 20,
    consultationFee: 90,
    rating: 4.9,
    availableDays: ["Tue", "Thu", "Sat"],
    availableSlots: ["10:00 AM", "01:00 PM", "03:30 PM"],
    photoUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300",
  },
];

export const sampleMedicineReminders: MedicineReminder[] = [];
export const samplePrescriptions: Prescription[] = [];
export const sampleLabReports: LabReport[] = [];

export const sampleOrganDonor: OrganDonor = {
  id: "DONOR-001",
  donorName: "Registered Member",
  donorAbhaId: "ABHA-IN-1001-8812",
  bloodGroup: "O+",
  pledgedOrgans: ["Corneas", "Kidneys"],
  registeredDate: "2026-08-08",
  donorCardId: "ODR-NATIONAL-1001",
};
