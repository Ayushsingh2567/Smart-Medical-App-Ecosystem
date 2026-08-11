# BioMed SmartEcosystem - Antigravity Guidelines & System Rules

## Technology Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide React, Vite.
- **Backend API**: Node.js & Express.js (`server.ts`).
- **Database**: Neon PostgreSQL cloud instance managed via Prisma ORM (`prisma/schema.prisma`).
- **Authentication**: Single Email Verification OTP Stack (`nodemailer` welcome emails) with custom account registration, ABHA ID generation, and inline password reset.
- **Role Isolation**: Strict Role-Based Access Control (RBAC) across 7 portals: `patient`, `doctor`, `hospital_admin`, `ambulance_driver`, `lab_staff`, `pharmacy_staff`, `super_admin`.

## Key Features & Medical Workflows
1. **Patient Portal**: ABHA Health Vault, ICU Bed Finder, AI Symptom Triage, Risk Analytics, Telemedicine Video Calls, Blood Bank Mesh, Medicine Reminders, and Express Pharmacy Home Delivery.
2. **Doctor Portal**: Multi-Disease Problem Recording (minor symptoms, major chronic diseases, surgeries, vitals, e-Rx) & Digital Hospital ER Referrals.
3. **Payment Gateways**: Integrated payment checkout (`PaymentModal.tsx`) for OPD appointments, ICU bed seat bookings, pathology blood tests, and pharmacy home deliveries.
4. **Pharmacy & Delivery**: Doorstep pharmacy home delivery tracking with delivery rider dispatch.
