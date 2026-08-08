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
