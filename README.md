# CareConnect
### Healthcare, with a human touch.

CareConnect is a digital healthcare platform connecting patients, doctors, and healthcare administrators. This repository contains the complete Phase 1 frontend monorepo containing three independent, interactive applications:

1. **CareConnect Patient** (`apps/patient`): Mobile application for iOS, Android, and Web built with Expo Router, React Native, and Lucide React Native.
2. **CareConnect Doctor** (`apps/doctor`): Clinical workspace mobile application for iOS, Android, and Web built with Expo Router, React Native, and Lucide React Native.
3. **CareConnect Admin** (`apps/admin`): Web-based administration console built with Next.js 14 App Router, TypeScript, and Tailwind CSS.

---

## 1. Key Principles & Phase 1 Scope

- **Direct Demonstration Access:** There is **NO** authentication requirement in Phase 1. There are no login, registration, OTP, password, or Firebase authentication gates. Each application opens directly into its respective dashboard with realistic, pre-populated demonstration profiles.
- **Independent Visual Personalities:**
  - **Patient App:** *Friendly Human Healthcare* (Warm mint `#E7F4ED`, primary green `#58A88D`, dark `#347C65`, cream `#F8F2E8`, peach `#FBE9DF`).
  - **Doctor App:** *Clean Clinical Workspace* (Clinical teal `#168B80`, dark `#116C64`, background `#F7F9FA`, accent `#E3F3F0`, vitals red `#DC2626`).
  - **Admin Dashboard:** *Premium Healthcare SaaS* (Clean white surfaces, deep navy text `#0F172A`, teal accents `#0D9488`, responsive sidebar and tables).
- **Light & Dark Mode Support:** Every screen across all three applications supports both Light and Dark appearance themes.
- **Clean Architecture:** All data access is mediated through typed asynchronous repository interfaces (`IDoctorRepository`, `IAppointmentRepository`, `IPatientRepository`, etc.) so that Phase 2 Firebase/backend services can replace mock repositories without altering screen components.

---

## 2. Monorepo Architecture

```
careconnect/
├── apps/
│   ├── patient/                # CareConnect Patient Mobile & Web App (Expo Router)
│   ├── doctor/                 # CareConnect Doctor Mobile & Web App (Expo Router)
│   └── admin/                  # CareConnect Admin Web Dashboard (Next.js 14)
├── packages/
│   ├── types/                  # Shared TypeScript interfaces & repository contracts
│   ├── ui/                     # Design tokens, color palettes & light/dark themes
│   └── config/                 # Mock datasets & stateful singleton repositories
├── docs/
│   ├── ARCHITECTURE.md         # Monorepo architecture & repository patterns
│   └── TESTING_REPORT.md       # Comprehensive testing & QA report (100% green)
├── package.json                # Monorepo scripts & Turborepo configuration
├── pnpm-workspace.yaml         # pnpm workspace definition
└── turbo.json                  # Turborepo task pipeline
```

---

## 3. Quick Start & Run Commands

### Prerequisites
- Node.js `v18+` or `v20+`
- `pnpm` `v9+` (`corepack enable` or `npm install -g pnpm`)

### Installation
```bash
# Clone the repository and install all workspace dependencies
pnpm install
```

### Running the Applications

#### 1. CareConnect Patient Application
```bash
# Starts the Patient app (Press 'w' in terminal for Web, 'a' for Android, 'i' for iOS)
pnpm dev:patient
```

#### 2. CareConnect Doctor Application
```bash
# Starts the Doctor clinical app (Press 'w' in terminal for Web, 'a' for Android, 'i' for iOS)
pnpm dev:doctor
```

#### 3. CareConnect Admin Dashboard
```bash
# Starts the Next.js Admin web console at http://localhost:3000
pnpm dev:admin
```

#### 4. Run Everything Concurrently via Turborepo
```bash
pnpm dev
```

### Quality Assurance & Type Checking
```bash
# Type check all 6 packages and apps across the monorepo
pnpm type-check

# Build all applications for production
pnpm build
```

---

## 4. Completed Screen & Feature Inventory

### CareConnect Patient (16 Screens / Features)
1. **Patient Home Dashboard (`/`):** Greeting ("Good morning, Aryan"), patient avatar, notification badge, search bar with symptom matching, hero banner, 8 specialities grid, upcoming appointment card, recommended doctors, and quick actions.
2. **Doctor Discovery (`/doctors`):** Real-time doctor search, horizontal speciality pills, language filter, fee slider (≤ ₹500, ₹800, ₹1000, ₹1200), sort by fee/rating, and doctor cards with demo profile badges.
3. **Speciality Directory (`/specialities`):** 12 medical specialities with icons, doctor counts, symptom tags, and direct filter routing.
4. **Doctor Profile (`/doctor/[id]`):** Profile photo, credentials, rating, experience, bio, practice areas, clinic details, and booking CTA.
5. **Appointment Booking Flow (`/booking/[id]`):** Virtual Video vs In-Clinic mode selector, interactive calendar, time slots, patient/family member selector, reason input, fee breakdown (₹800 + ₹49 platform fee), and duplicate-booking prevention.
6. **Booking Confirmation (`/booking-confirmation`):** Success illustration, generated reference code (`CC-BK-XXXXX`), demo disclaimer, and navigation buttons.
7. **My Appointments (`/appointments`):** Tabs for Upcoming, Completed, Cancelled; reschedule modal with slot selector, and instant cancellation.
8. **Appointment Details (`/appointment/[id]`):** Detailed consultation view, booking reference, physician info, reason for visit, and status actions.
9. **Teleconsultation Room (`/consultation/[id]`):** Simulated video consultation with doctor video feed, patient self PiP, running timer (`04:00+`), microphone toggle, camera toggle, and in-call chat panel.
10. **Medical Records (`/records`):** 4 category tabs (Overview, Prescriptions, Lab Reports, Vitals & History), vitals cards, and report download preview modal.
11. **Prescription Viewer (`/prescription/[id]`):** Digital prescription preview with diagnosis, medication regimen table (dosage/frequency/duration), follow-up date, and prominent "SAMPLE / NOT VALID FOR MEDICAL USE" watermark.
12. **Family Health (`/family`):** Family member list (Sunita, Rajesh, Rhea), guardian consent badges, and "Add Family Member" modal with local state persistence.
13. **Notifications (`/notifications`):** Appointment reminders, booking confirmations, unread filtering, and tap-to-mark-as-read interaction.
14. **Patient Profile (`/profile`):** Aryan Jaiswal profile card, demographic tags, contact details, edit profile modal with local state persistence, and navigation shortcuts.
15. **Settings (`/settings`):** Dark Mode switch, Senior Accessibility Mode (large touch targets & scaled text), English/Hindi toggle, and notification toggles.
16. **Support (`/support`):** Interactive FAQs accordion, support contact details, and issue submission form with validation and feedback alerts.

### CareConnect Doctor (14 Screens / Features)
1. **Doctor Dashboard (`/`):** "Good morning, Dr. Meera" header, availability status toggle (Active/Offline), 4 metric cards, today's schedule timeline, and clinical quick actions.
2. **Appointment Management (`/appointments`):** Status tabs (All, Upcoming, Completed, Cancelled), patient cards, search filter, and quick actions ("Launch Room", "Clinical Notes", "Mark Completed").
3. **Appointment Calendar (`/calendar`):** Daily and weekly view switch, 6-day week strip, time slots breakdown, and visual distinction between Booked, Available, and Break periods.
4. **Appointment Details (`/appointment/[id]`):** Patient clinical snapshot, reported complaint, symptoms tags, telehealth consent indicator, and status override actions.
5. **Patient Directory (`/patients`):** Patient list (Aryan, Sunita, Aarav, Kavita), allergy warning badges (Penicillin, Sulfa drugs, Shellfish), and direct clinical chart access.
6. **Patient Details (`/patient/[id]`):** Demographic profile, allergy alerts, past consultation history, previous prescriptions, and emergency contact details.
7. **Consultation Room (`/consultation/[id]`):** Doctor teleconsultation UI: patient video feed, doctor camera preview, vitals overlay, chief complaint banner, in-call chat, and "End & Rx" action.
8. **Consultation Notes (`/consultation-notes/[id]`):** Chief complaint, clinical examination observations, ICD-10 diagnosis documentation, treatment plan draft, and "Save Notes" action.
9. **Prescription Composer (`/prescription-composer/[id]`):** Dynamic medication entries (Add Drug / Remove Drug), dosage, frequency, duration, special instructions, and digital prescription preview modal with sample watermark.
10. **Messages (`/messages`):** Patient conversation threads (Aryan, Sunita), active chat modal, message input with send action updating local thread, and timestamps.
11. **Availability Management (`/availability`):** Working days toggle (Mon-Sat), start/end time inputs, slot duration picker (15, 20, 30, 45 mins), consultation fee input, and video/clinic switches updating application state.
12. **Doctor Profile (`/profile`):** Dr. Meera Patel credentials, MCI registration number, practice details, fee editor modal, and quick navigation links.
13. **Earnings (`/earnings`):** Today's earnings (₹4,800), monthly earnings (₹1,24,800), transaction settlement ledger, and payout account details.
14. **Settings (`/settings`):** Clinical dark theme toggle, appointment booking push alerts switch, 10-minute call reminders switch, and telemedicine compliance indicators.

### CareConnect Admin (9 Screens / Features)
1. **Overview (`/`):** 6 key KPI cards, monthly consultation SVG bar chart, doctor growth bars, recent bookings table, and real-time audit stream.
2. **Doctor Management (`/doctors`):** Doctor directory table, search, speciality filter dropdown, status filter (All, Verified, Pending), and inspect doctor modal with credentials.
3. **Doctor Verification (`/doctors/verification`):** Pending applications queue, candidate profile, simulated medical degree & council certificates with digital preview stamps, audit notes input, and interactive "Approve Credentials" / "Reject" actions updating state and appending audit logs.
4. **Patient Management (`/patients`):** Patient registry table, search, clinical tags, interactive account status toggle (Active / Suspended), and patient dossier modal.
5. **Appointment Management (`/appointments`):** Full appointments ledger, status tabs, search filter, fee breakdown details, and administrative status override actions (Mark Completed / Cancel).
6. **Support Desk (`/support`):** Tickets list with priority badges, category chips, conversation thread view, and reply box with "Send Response & Resolve" action.
7. **Analytics (`/analytics`):** Macro metrics, consultation volume by speciality breakdown, doctor specialty percentages, and monthly GMV projection chart.
8. **Platform Settings (`/settings`):** Platform branding inputs, session timeout threshold, slot buffer time, platform fee input, support SLA target, and save feedback toast.
9. **Audit Logs (`/audit-logs`):** Administrative audit table with timestamps, actor roles, events (`DOCTOR_VERIFIED`, `APPOINTMENT_SCHEDULED`, etc.), resource IDs, and origin IPs.

---

## 5. Limitations & Future Integrations (Phase 2)

Phase 1 focuses on frontend UI/UX completeness, navigation, and local reactive state. The following components are architected for Phase 2 integration:
- **Authentication:** Firebase Auth / OAuth with phone OTP and biometric sign-in.
- **Backend Database:** Cloud Firestore collections mapping directly to `IDoctorRepository`, `IAppointmentRepository`, etc.
- **Live Video Streaming:** WebRTC or Twilio Video SDK for actual peer-to-peer audio/video streaming in the consultation rooms.
- **Payment Processing:** Razorpay / Stripe gateway integration for real-time consultation fee settlement.
- **Digital Signatures:** Cryptographic signing of prescriptions complying with national telemedicine guidelines.
- **Cloud Document Storage:** Cloud Storage for patient medical records and lab PDF attachments.
