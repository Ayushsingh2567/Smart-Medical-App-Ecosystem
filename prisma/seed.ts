import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Neon PostgreSQL Database with Smart Medical Ecosystem initial data...");

  // 1. Seed Hospitals
  await prisma.hospital.deleteMany({});
  await prisma.hospital.createMany({
    data: [
      {
        id: "hosp-1",
        name: "City Central Super Specialty Hospital",
        address: "102 Health Avenue, Downtown",
        lat: 28.6139,
        lng: 77.209,
        distanceKm: 2.4,
        rating: 4.8,
        contactPhone: "+1-800-555-0199",
        emergencyNumber: "108 / 911",
        beds: {
          icu: { total: 40, available: 6 },
          ventilator: { total: 20, available: 3 },
          oxygen: { total: 80, available: 14 },
          normal: { total: 150, available: 32 },
          pediatric: { total: 25, available: 5 },
        },
        specialties: ["Cardiology", "Neurology", "Trauma", "Pulmonology", "Pediatrics"],
      },
      {
        id: "hosp-2",
        name: "Apex Heart & Trauma Center",
        address: "45 Medical Park Drive, Westside",
        lat: 28.621,
        lng: 77.215,
        distanceKm: 4.1,
        rating: 4.9,
        contactPhone: "+1-800-555-0210",
        emergencyNumber: "108 / 911",
        beds: {
          icu: { total: 30, available: 2 },
          ventilator: { total: 15, available: 1 },
          oxygen: { total: 50, available: 8 },
          normal: { total: 100, available: 18 },
          pediatric: { total: 15, available: 2 },
        },
        specialties: ["Cardiology", "Cardiothoracic Surgery", "Emergency Medicine"],
      },
      {
        id: "hosp-3",
        name: "St. Jude Multispecialty Hospital",
        address: "88 Community Way, Eastside",
        lat: 28.605,
        lng: 77.228,
        distanceKm: 5.8,
        rating: 4.6,
        contactPhone: "+1-800-555-0344",
        emergencyNumber: "108 / 911",
        beds: {
          icu: { total: 25, available: 8 },
          ventilator: { total: 10, available: 4 },
          oxygen: { total: 60, available: 22 },
          normal: { total: 120, available: 45 },
          pediatric: { total: 30, available: 12 },
        },
        specialties: ["General Surgery", "Orthopedics", "Pediatrics", "Oncology"],
      },
    ],
  });

  // 2. Seed Ambulances
  await prisma.ambulance.deleteMany({});
  await prisma.ambulance.createMany({
    data: [
      {
        id: "amb-101",
        vehicleNumber: "AMB-NY-4091",
        driverName: "Robert Miller",
        phone: "+1-555-014-992",
        type: "Advanced Life Support (ALS - Oxygen & Ventilator)",
        status: "Available",
        lat: 28.615,
        lng: 77.211,
        hospitalId: "hosp-1",
      },
      {
        id: "amb-102",
        vehicleNumber: "AMB-NY-8820",
        driverName: "Sarah Jenkins",
        phone: "+1-555-018-331",
        type: "Basic Life Support (BLS)",
        status: "En Route to Patient",
        lat: 28.618,
        lng: 77.214,
        hospitalId: "hosp-2",
      },
      {
        id: "amb-103",
        vehicleNumber: "AMB-NY-3312",
        driverName: "David Vance",
        phone: "+1-555-019-774",
        type: "Cardiac Care Unit Ambulance",
        status: "Available",
        lat: 28.608,
        lng: 77.222,
        hospitalId: "hosp-1",
      },
    ],
  });

  // 3. Seed Referrals
  await prisma.referral.deleteMany({});
  await prisma.referral.create({
    data: {
      id: "REF-2026-891",
      patientName: "Eleanor Vance",
      patientAge: 64,
      gender: "Female",
      abhaId: "ABHA-9102-4410-8812",
      referredByDoctor: "Dr. Arthur Pendelton (Community Care Clinic)",
      referringHospital: "Community Health Center #4",
      receivingHospitalId: "hosp-1",
      receivingHospitalName: "City Central Super Specialty Hospital",
      medicalSummary:
        "Acute Anterior Wall Myocardial Infarction. ST elevation in leads V1-V4. Given dual antiplatelet therapy. Requires urgent PCI & ICU bed with ventilator backup.",
      requiredBedType: "icu",
      urgency: "CRITICAL",
      status: "APPROVED_BY_RECEIVING_HOSPITAL",
      ambulanceAssignedId: "amb-101",
      ambulanceVehicle: "AMB-NY-4091",
      etaMinutes: 8,
    },
  });

  // 4. Seed Blood Stock
  await prisma.bloodStock.deleteMany({});
  await prisma.bloodStock.createMany({
    data: [
      { bloodGroup: "A+", unitsAvailable: 18, location: "Main Blood Bank Wing A" },
      { bloodGroup: "A-", unitsAvailable: 5, location: "Main Blood Bank Wing A" },
      { bloodGroup: "B+", unitsAvailable: 24, location: "Main Blood Bank Wing A" },
      { bloodGroup: "B-", unitsAvailable: 3, location: "Main Blood Bank Wing A" },
      { bloodGroup: "O+", unitsAvailable: 31, location: "Main Blood Bank Wing A" },
      { bloodGroup: "O-", unitsAvailable: 2, location: "Emergency Cold Storage" },
      { bloodGroup: "AB+", unitsAvailable: 12, location: "Main Blood Bank Wing A" },
      { bloodGroup: "AB-", unitsAvailable: 4, location: "Emergency Cold Storage" },
    ],
  });

  // 5. Seed Audit Logs
  await prisma.auditLog.deleteMany({});
  await prisma.auditLog.createMany({
    data: [
      {
        actor: "Dr. Arthur Pendelton",
        action: "CREATED_DIGITAL_REFERRAL",
        details: "Created referral REF-2026-891 for Eleanor Vance",
      },
      {
        actor: "AI Bed Demand Engine",
        action: "MATCHED_HOSPITAL",
        details: "Suggested City Central ICU Bed #04 based on 98.4% match score",
      },
      {
        actor: "Hospital Admin (City Central)",
        action: "ACCEPTED_REFERRAL",
        details: "Reserved ICU Bed #04 & dispatched ALS Ambulance AMB-NY-4091",
      },
    ],
  });

  // 6. Seed Consultations
  await prisma.consultation.deleteMany({});
  await prisma.consultation.createMany({
    data: [
      {
        id: "CONSULT-2026-101",
        patientName: "Alexander Wright",
        patientAbhaId: "ABHA-9102-4410-8812",
        patientAge: 42,
        patientGender: "Male",
        doctorName: "Dr. Sarah Jenkins, MD",
        doctorSpecialty: "Cardiology",
        hospitalName: "City Central Super Specialty Hospital",
        visitType: "In-Person OPD Hospital Visit",
        chiefComplaints: "Mild chest tightness during stairs climbing, occasional breathlessness",
        diagnosis: "Essential Hypertension (Stage 1) & Mild Exercise Angina",
        bloodPressure: "135/88",
        heartRate: 78,
        temperature: 98.4,
        spO2: 98.0,
        prescribedMedications: [
          { name: "Amlodipine Besylate", dosage: "5 mg", frequency: "1-0-0 (Morning)", duration: "30 Days", instructions: "After breakfast" },
          { name: "Atorvastatin Calcium", dosage: "10 mg", frequency: "0-0-1 (Night)", duration: "30 Days", instructions: "Bedtime with water" }
        ],
        recommendedTests: ["2D Echocardiogram", "Treadmill Stress Test (TMT)", "Lipid Panel"],
        doctorNotes: "Patient advised Low Sodium DASH diet, 30 min daily walking. Avoid strenuous heavy lifting until TMT results.",
        followUpDate: "2026-08-25"
      },
      {
        id: "CONSULT-2026-102",
        patientName: "Eleanor Vance",
        patientAbhaId: "ABHA-9102-4410-8812",
        patientAge: 64,
        patientGender: "Female",
        doctorName: "Dr. Arthur Pendelton",
        doctorSpecialty: "Cardiology",
        hospitalName: "Community Health Center #4",
        visitType: "Emergency OPD Triage",
        chiefComplaints: "Acute substernal crushing pain radiating to left arm (45 mins duration)",
        diagnosis: "Acute Anterior Wall STEMI",
        bloodPressure: "94/60",
        heartRate: 110,
        temperature: 98.6,
        spO2: 92.0,
        prescribedMedications: [
          { name: "Aspirin (Chewable)", dosage: "320 mg", frequency: "Stat", duration: "1 Day", instructions: "Immediate chew" },
          { name: "Ticagrelor", dosage: "180 mg", frequency: "Stat", duration: "1 Day", instructions: "Loading dose" }
        ],
        recommendedTests: ["12-Lead ECG", "Troponin I Triage", "Emergency Coronary Angiogram"],
        doctorNotes: "Critical condition. Initiated digital referral to City Central Cath Lab for primary PCI.",
        followUpDate: "Immediate Transfer"
      }
    ]
  });

  // 7. Seed Multi-Role Users
  await prisma.user.deleteMany({});
  await prisma.user.createMany({
    data: [
      {
        email: "patient@smartmedical.com",
        passwordHash: "patient123",
        name: "Alexander Wright",
        role: "patient",
        abhaId: "ABHA-9102-4410-8812",
        phone: "+1 (555) 234-5678",
      },
      {
        email: "dr.sarah@citycentral.org",
        passwordHash: "doctor123",
        name: "Dr. Sarah Jenkins, MD",
        role: "doctor",
        licenseNo: "MED-CA-88192",
        hospitalId: "hosp-1",
        phone: "+1 (555) 309-8812",
      },
      {
        email: "admin@citycentral.org",
        passwordHash: "admin123",
        name: "City Central ER Desk Admin",
        role: "hospital_admin",
        hospitalId: "hosp-1",
        phone: "+1 (800) 555-0199",
      },
      {
        email: "driver.robert@citycentral.org",
        passwordHash: "driver123",
        name: "Robert Miller (ALS Ambulance)",
        role: "ambulance_driver",
        hospitalId: "hosp-1",
        phone: "+1 (555) 014-992",
      },
      {
        email: "lab@citydiagnostics.org",
        passwordHash: "lab123",
        name: "Chief Diagnostics Officer",
        role: "lab_staff",
        phone: "+1 (555) 991-0021",
      },
      {
        email: "pharmacy@medexpress.com",
        passwordHash: "pharmacy123",
        name: "Central Blood & Pharmacy Manager",
        role: "pharmacy_staff",
        phone: "+1 (555) 441-2099",
      },
      {
        email: "superadmin@healthmesh.gov",
        passwordHash: "super123",
        name: "National Health Authority Super Admin",
        role: "super_admin",
        phone: "+1 (800) 999-0000",
      },
    ],
  });

  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
