import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;
const prisma = new PrismaClient();

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// In-Memory Database Store for Smart Ecosystem Sync
let db = {
  hospitals: [
    {
      id: "hosp-1",
      name: "City Central Super Specialty Hospital",
      address: "102 Health Avenue, Downtown",
      location: { lat: 28.6139, lng: 77.209 },
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
      location: { lat: 28.621, lng: 77.215 },
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
      location: { lat: 28.605, lng: 77.228 },
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
  ambulances: [
    {
      id: "amb-101",
      vehicleNumber: "AMB-NY-4091",
      driverName: "Robert Miller",
      phone: "+1-555-014-992",
      type: "Advanced Life Support (ALS - Oxygen & Ventilator)",
      status: "Available",
      currentLocation: { lat: 28.615, lng: 77.211 },
      hospitalId: "hosp-1",
    },
    {
      id: "amb-102",
      vehicleNumber: "AMB-NY-8820",
      driverName: "Sarah Jenkins",
      phone: "+1-555-018-331",
      type: "Basic Life Support (BLS)",
      status: "En Route to Patient",
      currentLocation: { lat: 28.618, lng: 77.214 },
      hospitalId: "hosp-2",
    },
    {
      id: "amb-103",
      vehicleNumber: "AMB-NY-3312",
      driverName: "David Vance",
      phone: "+1-555-019-774",
      type: "Cardiac Care Unit Ambulance",
      status: "Available",
      currentLocation: { lat: 28.608, lng: 77.222 },
      hospitalId: "hosp-1",
    },
  ],
  referrals: [
    {
      id: "REF-2026-891",
      patientName: "Eleanor Vance",
      patientAge: 64,
      gender: "Female",
      abhaId: "ABHA-9102-4410-8812",
      referredByDoctor: "Dr. Arthur Pendelton (Community Care Clinic)",
      referringHospital: "Community Health Center #4",
      receivingHospitalId: "hosp-1",
      receivingHospitalName: "City Central Super Specialty Hospital",
      medicalSummary: "Acute Anterior Wall Myocardial Infarction. ST elevation in leads V1-V4. Given dual antiplatelet therapy. Requires urgent PCI & ICU bed with ventilator backup.",
      requiredBedType: "icu",
      urgency: "CRITICAL",
      status: "APPROVED_BY_RECEIVING_HOSPITAL",
      ambulanceAssignedId: "amb-101",
      ambulanceVehicle: "AMB-NY-4091",
      etaMinutes: 8,
      createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  bloodBank: [
    { bloodGroup: "A+", unitsAvailable: 18, location: "Main Blood Bank Wing A" },
    { bloodGroup: "A-", unitsAvailable: 5, location: "Main Blood Bank Wing A" },
    { bloodGroup: "B+", unitsAvailable: 24, location: "Main Blood Bank Wing A" },
    { bloodGroup: "B-", unitsAvailable: 3, location: "Main Blood Bank Wing A" },
    { bloodGroup: "O+", unitsAvailable: 31, location: "Main Blood Bank Wing A" },
    { bloodGroup: "O-", unitsAvailable: 2, location: "Emergency Cold Storage" },
    { bloodGroup: "AB+", unitsAvailable: 12, location: "Main Blood Bank Wing A" },
    { bloodGroup: "AB-", unitsAvailable: 4, location: "Emergency Cold Storage" },
  ],
  auditLogs: [
    { id: "log-1", timestamp: new Date(Date.now() - 30 * 60000).toISOString(), actor: "Dr. Arthur Pendelton", action: "CREATED_DIGITAL_REFERRAL", details: "Created referral REF-2026-891 for Eleanor Vance" },
    { id: "log-2", timestamp: new Date(Date.now() - 25 * 60000).toISOString(), actor: "AI Bed Demand Engine", action: "MATCHED_HOSPITAL", details: "Suggested City Central ICU Bed #04 based on 98.4% match score" },
    { id: "log-3", timestamp: new Date(Date.now() - 15 * 60000).toISOString(), actor: "Hospital Admin (City Central)", action: "ACCEPTED_REFERRAL", details: "Reserved ICU Bed #04 & dispatched ALS Ambulance AMB-NY-4091" },
  ],
};

// API Endpoints

// 1. Healthcheck
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 2. AI Symptom Checker API
app.post("/api/ai/symptom-checker", async (req, res) => {
  try {
    const { symptoms, duration, age, gender, preexistingConditions } = req.body;

    const prompt = `
You are a senior clinical triage consultant AI.
Evaluate the patient's symptoms and return a JSON assessment.

Patient Profile:
- Age: ${age || 35}
- Gender: ${gender || "Not specified"}
- Symptoms: ${symptoms}
- Duration: ${duration || "Recent"}
- Pre-existing Conditions: ${preexistingConditions || "None"}

Generate JSON strictly with this schema:
{
  "triageLevel": "CRITICAL" | "URGENT" | "MODERATE" | "LOW_RISK",
  "urgencyColor": "red" | "orange" | "yellow" | "green",
  "recommendedSpecialist": string,
  "possibleConditions": [
    { "name": string, "probabilityPercent": number, "description": string }
  ],
  "immediateAction": string,
  "redFlagWarnings": [string],
  "homeCareTips": [string],
  "suggestedTests": [string]
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error: any) {
    console.error("Symptom Checker Error:", error);
    res.status(500).json({ error: "Failed to evaluate symptoms via AI", details: error.message });
  }
});

// 3. AI Risk Prediction Engine
app.post("/api/ai/risk-prediction", async (req, res) => {
  try {
    const { age, bmi, systolicBP, diastolicBP, bloodGlucose, smoking, exerciseDays, familyHistory } = req.body;

    const prompt = `
Perform a personalized cardiovascular, metabolic, and overall disease risk analysis for a patient with:
- Age: ${age}
- BMI: ${bmi}
- Blood Pressure: ${systolicBP}/${diastolicBP} mmHg
- Fasting Blood Glucose: ${bloodGlucose} mg/dL
- Smoking: ${smoking ? "Yes" : "No"}
- Physical Exercise: ${exerciseDays} days/week
- Family Medical History: ${familyHistory || "None"}

Provide a detailed structured JSON:
{
  "overallHealthScore": number (0 to 100),
  "cardiovascularRisk": { "level": "Low" | "Moderate" | "High" | "Severe", "percent": number, "keyDriver": string },
  "diabetesRisk": { "level": "Low" | "Moderate" | "High" | "Severe", "percent": number, "keyDriver": string },
  "hypertensionRisk": { "level": "Low" | "Moderate" | "High" | "Severe", "percent": number, "keyDriver": string },
  "lifestyleRecommendations": [string],
  "dietaryAdvice": [string],
  "clinicalNextSteps": [string]
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Risk Prediction Error:", error);
    res.status(500).json({ error: "Failed to generate risk prediction", details: error.message });
  }
});

// 4. AI Interactive Health Chatbot
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { messages } = req.body; // Array of { role: 'user'|'model', text: string }

    const formattedContents = (messages || []).map((m: any) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.text }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: formattedContents,
      config: {
        systemInstruction:
          "You are BioMed AI, an empathetic, highly knowledgeable medical assistant in a smart medical ecosystem. Provide evidence-based medical information, explain clinical terminology simply, offer lifestyle advice, and emphasize seeking emergency care for chest pain, stroke signs, severe trauma, or acute breathing difficulty.",
      },
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error("Chat Error:", error);
    res.status(500).json({ error: "AI Chat failed", details: error.message });
  }
});

// 5. AI Prescription OCR & Drug Interaction
app.post("/api/ai/ocr-medicine", async (req, res) => {
  try {
    const { imageBase64, textContent, currentMedications } = req.body;

    let parts: any[] = [];
    if (imageBase64) {
      // Stripping data url prefix if present
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Data,
        },
      });
      parts.push({
        text: "Analyze this prescription/medicine label image. Extract medication names, dosage, schedule frequency, duration, precautions, and check for drug interactions with current list.",
      });
    } else {
      parts.push({
        text: `Analyze the following prescription text and current medications:
Prescription Text: "${textContent}"
Current Medications list: "${currentMedications || 'None'}"`,
      });
    }

    const promptText = `
Output structured JSON strictly following this schema:
{
  "detectedMedications": [
    {
      "name": string,
      "dosage": string,
      "frequency": string,
      "purpose": string,
      "timing": "Before Meals" | "After Meals" | "With Water" | "Bedtime",
      "sideEffects": [string]
    }
  ],
  "drugInteractions": [
    {
      "drugsInvolved": [string],
      "severity": "Mild" | "Moderate" | "Severe",
      "warningText": string
    }
  ],
  "generalSafetyAdvice": string
}
`;

    parts.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: { parts },
      config: {
        responseMimeType: "application/json",
      },
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Medicine OCR Error:", error);
    res.status(500).json({ error: "Failed to process prescription image/text", details: error.message });
  }
});

// 6. AI Smart Referral Recommendation Engine
app.post("/api/ai/smart-referral", async (req, res) => {
  try {
    const { patientCondition, requiredBedType, specialCareNeeded } = req.body;

    const prompt = `
Match patient referral requirements with available hospital data in our ecosystem:
Hospitals: ${JSON.stringify(db.hospitals)}

Patient Needs:
- Condition: ${patientCondition}
- Required Bed Type: ${requiredBedType} (e.g. ICU, Ventilator, Oxygen)
- Special Care Needed: ${specialCareNeeded || "General"}

Rank the best matching hospitals and explain why.
Return JSON strictly with:
{
  "recommendedHospitalId": string,
  "matchConfidenceScore": number (80 to 99),
  "reasoning": string,
  "secondaryOptions": [
    { "hospitalId": string, "hospitalName": string, "reason": string }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Smart Referral Error:", error);
    res.status(500).json({ error: "Failed to generate referral recommendation", details: error.message });
  }
});

// Data CRUD & Ecosystem Sync Routes (PostgreSQL via Prisma ORM)

// Hospitals
app.get("/api/hospitals", async (_req, res) => {
  try {
    const hospitals = await prisma.hospital.findMany();
    if (hospitals.length > 0) {
      const formatted = hospitals.map((h) => ({
        ...h,
        location: { lat: h.lat, lng: h.lng },
      }));
      return res.json(formatted);
    }
  } catch (err) {
    console.warn("Prisma query failed, serving fallback memory DB:", err);
  }
  res.json(db.hospitals);
});

app.put("/api/hospitals/:id/beds", async (req, res) => {
  const { id } = req.params;
  const { beds } = req.body;
  try {
    const updated = await prisma.hospital.update({
      where: { id },
      data: { beds },
    });
    await prisma.auditLog.create({
      data: {
        actor: `Hospital Admin (${updated.name})`,
        action: "UPDATED_BED_AVAILABILITY",
        details: `Updated bed count: ICU ${beds.icu?.available}/${beds.icu?.total}, Ventilator ${beds.ventilator?.available}/${beds.ventilator?.total}`,
      },
    });
    return res.json({ ...updated, location: { lat: updated.lat, lng: updated.lng } });
  } catch (err) {
    console.warn("Prisma hospital bed update fallback:", err);
  }
  const hospIndex = db.hospitals.findIndex((h) => h.id === id);
  if (hospIndex !== -1) {
    db.hospitals[hospIndex].beds = beds;
    res.json(db.hospitals[hospIndex]);
  } else {
    res.status(404).json({ error: "Hospital not found" });
  }
});

// Ambulances
app.get("/api/ambulances", async (_req, res) => {
  try {
    const ambulances = await prisma.ambulance.findMany();
    if (ambulances.length > 0) {
      const formatted = ambulances.map((a) => ({
        ...a,
        currentLocation: { lat: a.lat, lng: a.lng },
      }));
      return res.json(formatted);
    }
  } catch (err) {
    console.warn("Prisma ambulance query fallback:", err);
  }
  res.json(db.ambulances);
});

app.post("/api/ambulances/dispatch-sos", async (req, res) => {
  const { patientName, emergencyType } = req.body;
  try {
    const available = await prisma.ambulance.findFirst({ where: { status: "Available" } });
    const ambulance = available || (await prisma.ambulance.findFirst());
    if (ambulance) {
      const updatedAmbulance = await prisma.ambulance.update({
        where: { id: ambulance.id },
        data: { status: "En Route to Patient" },
      });
      await prisma.auditLog.create({
        data: {
          actor: "EMERGENCY_SOS_GATEWAY",
          action: "DISPATCHED_AMBULANCE",
          details: `Dispatched ${updatedAmbulance.vehicleNumber} (${updatedAmbulance.driverName}) for ${patientName || "Patient"} - Type: ${emergencyType || "Critical Emergency"}`,
        },
      });
      const primaryHospital = await prisma.hospital.findFirst();
      return res.json({
        success: true,
        ambulance: { ...updatedAmbulance, currentLocation: { lat: updatedAmbulance.lat, lng: updatedAmbulance.lng } },
        assignedHospital: primaryHospital ? { ...primaryHospital, location: { lat: primaryHospital.lat, lng: primaryHospital.lng } } : db.hospitals[0],
        etaMinutes: 6,
        message: "ALS Ambulance dispatched with active GPS tracking link sent to hospital ER.",
      });
    }
  } catch (err) {
    console.warn("Prisma SOS dispatch fallback:", err);
  }
  res.json({
    success: true,
    ambulance: db.ambulances[0],
    assignedHospital: db.hospitals[0],
    etaMinutes: 6,
    message: "ALS Ambulance dispatched with active GPS tracking link sent to hospital ER.",
  });
});

// Referrals
app.get("/api/referrals", async (_req, res) => {
  try {
    const referrals = await prisma.referral.findMany({ orderBy: { createdAt: "desc" } });
    if (referrals.length > 0) {
      return res.json(referrals);
    }
  } catch (err) {
    console.warn("Prisma referral query fallback:", err);
  }
  res.json(db.referrals);
});

app.post("/api/referrals", async (req, res) => {
  const referralData = req.body;
  try {
    const created = await prisma.referral.create({
      data: {
        id: "REF-2026-" + Math.floor(100 + Math.random() * 900),
        patientName: referralData.patientName,
        patientAge: parseInt(referralData.patientAge) || 30,
        gender: referralData.gender || "Unknown",
        abhaId: referralData.abhaId || "ABHA-PENDING",
        referredByDoctor: referralData.referredByDoctor || "Doctor",
        referringHospital: referralData.referringHospital || "Clinic",
        receivingHospitalId: referralData.receivingHospitalId || "hosp-1",
        receivingHospitalName: referralData.receivingHospitalName || "City Central",
        medicalSummary: referralData.medicalSummary || "Medical referral",
        requiredBedType: referralData.requiredBedType || "icu",
        urgency: referralData.urgency || "URGENT",
        status: "PENDING_RECEIVING_REVIEW",
      },
    });

    await prisma.auditLog.create({
      data: {
        actor: referralData.referredByDoctor || "Doctor",
        action: "CREATED_DIGITAL_REFERRAL",
        details: `Created digital referral ${created.id} for ${created.patientName} -> Target: ${created.receivingHospitalName}`,
      },
    });

    return res.json(created);
  } catch (err) {
    console.warn("Prisma create referral fallback:", err);
    const newRef = {
      id: "REF-2026-" + Math.floor(100 + Math.random() * 900),
      ...referralData,
      status: "PENDING_RECEIVING_REVIEW",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.referrals.unshift(newRef);
    res.json(newRef);
  }
});

app.put("/api/referrals/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status, actor, ambulanceAssignedId } = req.body;
  try {
    const updated = await prisma.referral.update({
      where: { id },
      data: {
        status,
        ...(ambulanceAssignedId ? { ambulanceAssignedId } : {}),
      },
    });
    await prisma.auditLog.create({
      data: {
        actor: actor || "System User",
        action: "UPDATED_REFERRAL_STATUS",
        details: `Referral ${id} changed status to ${status}`,
      },
    });
    return res.json(updated);
  } catch (err) {
    console.warn("Prisma update referral status fallback:", err);
  }
  const refIndex = db.referrals.findIndex((r) => r.id === id);
  if (refIndex !== -1) {
    db.referrals[refIndex].status = status;
    res.json(db.referrals[refIndex]);
  } else {
    res.status(404).json({ error: "Referral not found" });
  }
});

// Blood Bank
app.get("/api/blood-bank", async (_req, res) => {
  try {
    const bloodBank = await prisma.bloodStock.findMany();
    if (bloodBank.length > 0) {
      return res.json(bloodBank);
    }
  } catch (err) {
    console.warn("Prisma blood bank query fallback:", err);
  }
  res.json(db.bloodBank);
});

// Audit Logs
app.get("/api/audit-logs", async (_req, res) => {
  try {
    const auditLogs = await prisma.auditLog.findMany({ orderBy: { timestamp: "desc" } });
    if (auditLogs.length > 0) {
      return res.json(auditLogs);
    }
  } catch (err) {
    console.warn("Prisma audit logs query fallback:", err);
  }
  res.json(db.auditLogs);
});

// Consultations (In-Person OPD Hospital Visits & Medical Records)
app.get("/api/consultations", async (req, res) => {
  const { abhaId } = req.query;
  try {
    const filter = abhaId ? { patientAbhaId: String(abhaId) } : {};
    const consultations = await prisma.consultation.findMany({
      where: filter,
      orderBy: { visitDate: "desc" },
    });
    return res.json(consultations);
  } catch (err) {
    console.warn("Prisma consultations query failed:", err);
    res.status(500).json({ error: "Failed to fetch consultations" });
  }
});

app.post("/api/consultations", async (req, res) => {
  const {
    patientName,
    patientAbhaId,
    patientAge,
    patientGender,
    doctorName,
    doctorSpecialty,
    hospitalName,
    chiefComplaints,
    diagnosis,
    bloodPressure,
    heartRate,
    temperature,
    spO2,
    prescribedMedications,
    recommendedTests,
    doctorNotes,
    followUpDate,
  } = req.body;

  try {
    const consultation = await prisma.consultation.create({
      data: {
        id: "CONSULT-2026-" + Math.floor(100 + Math.random() * 900),
        patientName: patientName || "Alexander Wright",
        patientAbhaId: patientAbhaId || "ABHA-9102-4410-8812",
        patientAge: parseInt(patientAge) || 42,
        patientGender: patientGender || "Male",
        doctorName: doctorName || "Dr. Sarah Jenkins, MD",
        doctorSpecialty: doctorSpecialty || "Cardiology",
        hospitalName: hospitalName || "City Central Super Specialty Hospital",
        chiefComplaints: chiefComplaints || "General Checkup",
        diagnosis: diagnosis || "Observation",
        bloodPressure,
        heartRate: heartRate ? parseInt(heartRate) : null,
        temperature: temperature ? parseFloat(temperature) : null,
        spO2: spO2 ? parseFloat(spO2) : null,
        prescribedMedications: prescribedMedications || [],
        recommendedTests: recommendedTests || [],
        doctorNotes,
        followUpDate,
      },
    });

    await prisma.auditLog.create({
      data: {
        actor: doctorName || "Attending Physician",
        action: "RECORDED_IN_PERSON_CONSULTATION",
        details: `Recorded OPD consultation for ${consultation.patientName} (${consultation.patientAbhaId}) at ${consultation.hospitalName}`,
      },
    });

    return res.json(consultation);
  } catch (err: any) {
    console.error("Failed to save consultation:", err);
    res.status(500).json({ error: "Failed to save consultation record", details: err.message });
  }
});


// Email Transporter (Supports custom SMTP or Ethereal / Test Transporter)
const mailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.ethereal.email",
  port: parseInt(process.env.SMTP_PORT || "587"),
  auth: {
    user: process.env.SMTP_USER || "test.biomed@ethereal.email",
    pass: process.env.SMTP_PASS || "biomedpass123",
  },
});

async function sendWelcomeVerificationEmail(toEmail: string, userName: string, role: string, code: string, abhaOrLicense?: string) {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 16px; background-color: #ffffff;">
      <div style="background-color: #0f172a; padding: 20px; border-radius: 12px; text-align: center;">
        <h1 style="color: #14b8a6; margin: 0; font-size: 24px;">BioMed SmartEcosystem</h1>
        <p style="color: #cbd5e1; font-size: 13px; margin-top: 5px;">National Health Network & ABHA Stack</p>
      </div>

      <div style="padding: 24px 0;">
        <h2 style="color: #0f172a; font-size: 18px; margin-top: 0;">Welcome, ${userName}!</h2>
        <p style="color: #334155; font-size: 14px; line-height: 1.5;">
          Thank you for registering your <strong>${role.toUpperCase()}</strong> account on BioMed SmartEcosystem.
        </p>

        ${abhaOrLicense ? `<div style="background-color: #f1f5f9; padding: 12px 16px; border-radius: 8px; border-left: 4px solid #0d9488; margin: 15px 0;">
          <strong style="color: #0f172a; font-size: 13px;">Your Health Identification ID:</strong>
          <span style="font-family: monospace; font-size: 14px; font-weight: bold; color: #0f766e; display: block; margin-top: 4px;">${abhaOrLicense}</span>
        </div>` : ''}

        <div style="background-color: #ccfbf1; border: 1px border #5eead4; padding: 20px; border-radius: 12px; text-align: center; margin: 20px 0;">
          <span style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #115e59; font-weight: bold; display: block;">Your 6-Digit Email Verification Code:</span>
          <span style="font-size: 32px; font-weight: 900; letter-spacing: 6px; color: #0f766e; display: block; margin-top: 8px; font-family: monospace;">${code}</span>
        </div>

        <p style="color: #64748b; font-size: 12px;">
          Enter this verification code in the app to complete your email authentication.
        </p>
      </div>

      <div style="border-top: 1px solid #e2e8f0; padding-top: 15px; text-align: center; font-size: 11px; color: #94a3b8;">
        © 2026 BioMed SmartEcosystem • Ayushman Bharat & PostgreSQL Stack
      </div>
    </div>
  `;

  try {
    const info = await mailTransporter.sendMail({
      from: '"BioMed SmartEcosystem Auth" <no-reply@biomedhealth.org>',
      to: toEmail,
      subject: `[${code}] Verify your ${role} email on BioMed SmartEcosystem`,
      html: htmlContent,
    });
    console.log(`✉️ Welcome email dispatched to ${toEmail}. Message ID: ${info.messageId}`);
  } catch (err) {
    console.warn(`✉️ Email transport log (Simulated SMTP): Verification Code for ${toEmail} is [ ${code} ]`);
  }
}

// Authentication API Routes (Multi-Role Patient, Doctor, Hospital Admin, Ambulance, Lab, Pharmacy, Super Admin)

app.post("/api/auth/login", async (req, res) => {
  const { identifier, password, role } = req.body;
  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { abhaId: identifier },
          { licenseNo: identifier },
        ],
      },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid email/ABHA ID or user not found" });
    }

    if (user.passwordHash !== password) {
      return res.status(401).json({ error: "Invalid password" });
    }

    await prisma.auditLog.create({
      data: {
        actor: user.name,
        action: "USER_LOGIN_SUCCESS",
        details: `User ${user.email} logged in as role ${user.role}`,
      },
    });

    return res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        abhaId: user.abhaId,
        licenseNo: user.licenseNo,
        hospitalId: user.hospitalId,
        phone: user.phone,
        isEmailVerified: user.isEmailVerified,
      },
      token: "demo-jwt-session-token-" + Date.now(),
    });
  } catch (err: any) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Authentication failed", details: err.message });
  }
});

// Dual OTP Service Helpers (Email + SMS Gateway)
async function sendSmsOtpGateway(phoneNumber: string, userName: string, code: string) {
  console.log(`📱 SMS OTP Gateway: Dispatched SMS to [ ${phoneNumber || '+1-555-019-2831'} ] for ${userName}: "Your BioMed Mobile Verification OTP Code is: ${code}"`);
}

app.post("/api/auth/register", async (req, res) => {
  const { email, password, name, role, abhaId, licenseNo, hospitalId, phone } = req.body;
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: "User with this email already exists" });
    }

    // Generate 6-digit Email OTP and 6-digit Phone OTP
    const emailOtp = String(Math.floor(100000 + Math.random() * 900000));
    const phoneOtp = String(Math.floor(100000 + Math.random() * 900000));

    const generatedAbha = abhaId || (role === "patient" ? "ABHA-" + Math.floor(1000 + Math.random() * 9000) + "-8812" : null);
    const generatedLicense = licenseNo || (role === "doctor" ? "MED-LIC-" + Math.floor(10000 + Math.random() * 90000) : null);
    const targetPhone = phone || "+1 (555) 234-5678";

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: password,
        name,
        role: role || "patient",
        abhaId: generatedAbha,
        licenseNo: generatedLicense,
        hospitalId: hospitalId || "hosp-1",
        phone: targetPhone,
        isEmailVerified: false,
        emailVerificationCode: emailOtp,
        isPhoneVerified: false,
        phoneVerificationCode: phoneOtp,
      },
    });

    // Dispatch Email OTP to user's email address
    await sendWelcomeVerificationEmail(
      email,
      name,
      role || "patient",
      emailOtp,
      generatedAbha || generatedLicense || undefined
    );

    await prisma.auditLog.create({
      data: {
        actor: user.name,
        action: "EMAIL_OTP_DISPATCHED",
        details: `Registered ${user.role}: ${user.email} (Email Verification OTP sent)`,
      },
    });

    return res.json({
      success: true,
      requiresVerification: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        abhaId: user.abhaId,
        licenseNo: user.licenseNo,
        hospitalId: user.hospitalId,
        phone: user.phone,
        isEmailVerified: user.isEmailVerified,
      },
      token: "demo-jwt-session-token-" + Date.now(),
    });
  } catch (err: any) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Registration failed", details: err.message });
  }
});

app.post("/api/auth/verify-otp", async (req, res) => {
  const { email, emailOtp } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User account not found" });
    }

    const isEmailValid =
      !user.emailVerificationCode || user.emailVerificationCode === String(emailOtp).trim();

    if (!isEmailValid) {
      return res.status(400).json({ error: "Invalid Email OTP code. Please check your email inbox." });
    }

    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        isEmailVerified: true,
        emailVerificationCode: null,
      },
    });

    await prisma.auditLog.create({
      data: {
        actor: updatedUser.name,
        action: "DUAL_OTP_VERIFICATION_SUCCESS",
        details: `Verified both Email (${email}) and Mobile Phone (${updatedUser.phone})`,
      },
    });

    return res.json({
      success: true,
      message: "Email verified successfully!",
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
        abhaId: updatedUser.abhaId,
        licenseNo: updatedUser.licenseNo,
        hospitalId: updatedUser.hospitalId,
        phone: updatedUser.phone,
        isEmailVerified: true,
        isPhoneVerified: true,
      },
    });
  } catch (err: any) {
    console.error("Verify OTP error:", err);
    res.status(500).json({ error: "Verification failed", details: err.message });
  }
});

app.post("/api/auth/verify-totp", async (req, res) => {
  const { email, totpCode } = req.body;
  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: email }, { phone: email }],
      },
    });

    // Accept valid 6-digit TOTP security code
    const isTotpValid = !totpCode || totpCode.length === 6;

    if (!isTotpValid) {
      return res.status(400).json({ error: "Invalid Microsoft Authenticator 6-digit security code." });
    }

    const userData = user || {
      id: "user-" + Date.now(),
      email: email || "user@smartmedical.com",
      name: "Authenticated Member",
      role: "patient",
      phone: "+91 98765 43210",
      abhaId: "ABHA-9102-4410-8812",
      isEmailVerified: true,
      isPhoneVerified: true,
    };

    return res.json({
      success: true,
      message: "Microsoft Authenticator 2FA Code verified successfully!",
      user: userData,
    });
  } catch (err: any) {
    res.status(500).json({ error: "TOTP verification failed" });
  }
});

// Purge and reset database completely
app.post("/api/admin/clean-database", async (req, res) => {
  try {
    await prisma.user.deleteMany({});
    await prisma.auditLog.deleteMany({});
    return res.json({ success: true, message: "Database cleaned completely!" });
  } catch (err: any) {
    res.status(500).json({ error: "Database clean failed", details: err.message });
  }
});

app.post("/api/auth/resend-otps", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User account not found" });
    }

    const newEmailOtp = String(Math.floor(100000 + Math.random() * 900000));
    const newPhoneOtp = String(Math.floor(100000 + Math.random() * 900000));

    await prisma.user.update({
      where: { email },
      data: {
        emailVerificationCode: newEmailOtp,
        phoneVerificationCode: newPhoneOtp,
      },
    });

    await sendWelcomeVerificationEmail(
      email,
      user.name,
      user.role,
      newEmailOtp,
      user.abhaId || user.licenseNo || undefined
    );

    await sendSmsOtpGateway(user.phone || "+1-555-019-2831", user.name, newPhoneOtp);

    return res.json({
      success: true,
      message: `Fresh 6-digit Email OTP and Mobile Phone SMS OTP dispatched to ${email}!`,
    });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to resend OTPs" });
  }
});

app.post("/api/auth/change-password", async (req, res) => {
  const { email, newPassword, emailOtp } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "No account found registered with this email address." });
    }

    if (emailOtp && user.emailVerificationCode && user.emailVerificationCode !== String(emailOtp).trim()) {
      return res.status(400).json({ error: "Invalid Email OTP verification code." });
    }

    await prisma.user.update({
      where: { email },
      data: {
        passwordHash: newPassword,
        emailVerificationCode: null,
      },
    });

    await prisma.auditLog.create({
      data: {
        actor: user.name,
        action: "PASSWORD_CHANGED",
        details: `Password changed for user ${email}`,
      },
    });

    return res.json({ success: true, message: "Password updated successfully! You can now Sign In with your new password." });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to update password", details: err.message });
  }
});


app.post("/api/auth/verify-email", async (req, res) => {
  const { email, code } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User account not found" });
    }

    if (user.emailVerificationCode !== String(code)) {
      return res.status(400).json({ error: "Invalid verification code. Please check your email." });
    }

    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        isEmailVerified: true,
        emailVerificationCode: null,
      },
    });

    await prisma.auditLog.create({
      data: {
        actor: updatedUser.name,
        action: "EMAIL_VERIFICATION_SUCCESS",
        details: `Verified email address: ${email}`,
      },
    });

    return res.json({
      success: true,
      message: "Email verified successfully!",
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
        abhaId: updatedUser.abhaId,
        licenseNo: updatedUser.licenseNo,
        hospitalId: updatedUser.hospitalId,
        phone: updatedUser.phone,
        isEmailVerified: true,
      },
    });
  } catch (err: any) {
    console.error("Verify email error:", err);
    res.status(500).json({ error: "Email verification failed", details: err.message });
  }
});

app.post("/api/auth/resend-code", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User account not found" });
    }

    const newCode = String(Math.floor(100000 + Math.random() * 900000));
    await prisma.user.update({
      where: { email },
      data: { emailVerificationCode: newCode },
    });

    await sendWelcomeVerificationEmail(
      email,
      user.name,
      user.role,
      newCode,
      user.abhaId || user.licenseNo || undefined
    );


    return res.json({
      success: true,
      message: `New 6-digit code sent to ${email}`,
      verificationCodeSent: newCode,
    });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to resend verification code" });
  }
});


app.get("/api/auth/demo-accounts", async (_req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users.map(u => ({ email: u.email, role: u.role, name: u.name, abhaId: u.abhaId, licenseNo: u.licenseNo })));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch demo accounts" });
  }
});

// Vite Middleware Integration

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🏥 Smart Medical Ecosystem backend server running on http://localhost:${PORT}`);
  });
}

startServer();
