import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

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

// Data CRUD & Ecosystem Sync Routes

// Hospitals
app.get("/api/hospitals", (_req, res) => {
  res.json(db.hospitals);
});

app.put("/api/hospitals/:id/beds", (req, res) => {
  const { id } = req.params;
  const { beds } = req.body;
  const hospIndex = db.hospitals.findIndex((h) => h.id === id);
  if (hospIndex !== -1) {
    db.hospitals[hospIndex].beds = beds;
    db.auditLogs.unshift({
      id: "log-" + Date.now(),
      timestamp: new Date().toISOString(),
      actor: `Hospital Admin (${db.hospitals[hospIndex].name})`,
      action: "UPDATED_BED_AVAILABILITY",
      details: `Updated bed count: ICU ${beds.icu.available}/${beds.icu.total}, Ventilator ${beds.ventilator.available}/${beds.ventilator.total}`,
    });
    res.json(db.hospitals[hospIndex]);
  } else {
    res.status(404).json({ error: "Hospital not found" });
  }
});

// Ambulances
app.get("/api/ambulances", (_req, res) => {
  res.json(db.ambulances);
});

app.post("/api/ambulances/dispatch-sos", (req, res) => {
  const { patientLocation, patientName, emergencyType } = req.body;
  // Find available ambulance
  const ambulance = db.ambulances.find((a) => a.status === "Available") || db.ambulances[0];
  ambulance.status = "En Route to Patient";

  const newLog = {
    id: "log-" + Date.now(),
    timestamp: new Date().toISOString(),
    actor: "EMERGENCY_SOS_GATEWAY",
    action: "DISPATCHED_AMBULANCE",
    details: `Dispatched ${ambulance.vehicleNumber} (${ambulance.driverName}) for ${patientName || "Patient"} - Type: ${emergencyType || "Critical Emergency"}`,
  };
  db.auditLogs.unshift(newLog);

  res.json({
    success: true,
    ambulance,
    assignedHospital: db.hospitals[0],
    etaMinutes: 6,
    message: "ALS Ambulance dispatched with active GPS tracking link sent to hospital ER.",
  });
});

// Referrals
app.get("/api/referrals", (_req, res) => {
  res.json(db.referrals);
});

app.post("/api/referrals", (req, res) => {
  const referralData = req.body;
  const newRef = {
    id: "REF-2026-" + Math.floor(100 + Math.random() * 900),
    ...referralData,
    status: "PENDING_RECEIVING_REVIEW",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.referrals.unshift(newRef);

  db.auditLogs.unshift({
    id: "log-" + Date.now(),
    timestamp: new Date().toISOString(),
    actor: referralData.referredByDoctor || "Doctor",
    action: "CREATED_DIGITAL_REFERRAL",
    details: `Created digital referral ${newRef.id} for ${newRef.patientName} -> Target: ${newRef.receivingHospitalName}`,
  });

  res.json(newRef);
});

app.put("/api/referrals/:id/status", (req, res) => {
  const { id } = req.params;
  const { status, actor, ambulanceAssignedId } = req.body;

  const refIndex = db.referrals.findIndex((r) => r.id === id);
  if (refIndex !== -1) {
    db.referrals[refIndex].status = status;
    db.referrals[refIndex].updatedAt = new Date().toISOString();
    if (ambulanceAssignedId) {
      db.referrals[refIndex].ambulanceAssignedId = ambulanceAssignedId;
    }

    db.auditLogs.unshift({
      id: "log-" + Date.now(),
      timestamp: new Date().toISOString(),
      actor: actor || "System User",
      action: "UPDATED_REFERRAL_STATUS",
      details: `Referral ${id} changed status to ${status}`,
    });

    res.json(db.referrals[refIndex]);
  } else {
    res.status(404).json({ error: "Referral not found" });
  }
});

// Blood Bank
app.get("/api/blood-bank", (_req, res) => {
  res.json(db.bloodBank);
});

// Audit Logs
app.get("/api/audit-logs", (_req, res) => {
  res.json(db.auditLogs);
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
