# CareConnect — System Architecture Documentation
## Phase 1 Frontend Prototype

> **Tagline:** Healthcare, with a human touch.  
> **Version:** 1.0.0-demo  
> **Architecture:** Turborepo + pnpm Workspace Monorepo  

---

## 1. Architectural Philosophy

CareConnect Phase 1 is built as a complete, production-grade frontend monorepo connecting patients, medical practitioners, and platform administrators.

### Core Principles
1. **Direct Demonstration Access:** No authentication, registration gates, or Firebase login blocks exist in Phase 1. Each application boots directly into its role-specific dashboard with realistic, pre-populated fictional profiles.
2. **Clean Separation of Concerns:** Application domain models and repository contracts are isolated in `@careconnect/types`. Shared theme tokens live in `@careconnect/ui`. Mock data and stateful in-memory repositories reside in `@careconnect/config`.
3. **Phase 2 Readiness:** Data access is abstracted behind asynchronous repository interfaces (`IDoctorRepository`, `IAppointmentRepository`, `IPatientRepository`, etc.). In Phase 2, backend Firebase/REST implementations will swap in with zero rewrite of the UI screens.

---

## 2. Monorepo Structure

```
careconnect/
├── apps/
│   ├── patient/                # CareConnect Patient (Expo / React Native / Expo Router)
│   │   ├── app/                # 16 complete screens (5 tabs + 11 stack routes)
│   │   ├── src/context/        # PatientProvider & reactive state hooks
│   │   └── package.json
│   ├── doctor/                 # CareConnect Doctor (Expo / React Native / Expo Router)
│   │   ├── app/                # 14 complete screens (5 tabs + 9 stack routes)
│   │   ├── src/context/        # DoctorProvider & clinical state hooks
│   │   └── package.json
│   └── admin/                  # CareConnect Admin (Next.js 14 App Router / Tailwind CSS)
│       ├── src/app/            # 9 complete screens & analytics views
│       ├── src/components/     # Sidebar, Navbar, Toast notification engine
│       ├── src/context/        # AdminProvider & moderation state
│       └── package.json
├── packages/
│   ├── types/                  # Shared TypeScript interfaces & repository contracts
│   ├── ui/                     # Design tokens, color palettes & light/dark themes
│   └── config/                 # Mock datasets & stateful singleton repositories
├── docs/                       # Technical & Testing documentation
├── package.json                # Root scripts and Turborepo configuration
├── pnpm-workspace.yaml         # pnpm workspace definition
└── turbo.json                  # Turborepo task pipeline
```

---

## 3. Design System & Visual Personalities

CareConnect delivers two distinct mobile visual personalities and a premium web SaaS administration interface:

### A. Patient Mobile Application: "Friendly Human Healthcare"
- **Primary:** `#58A88D`
- **Primary Dark:** `#347C65`
- **Background:** `#FAFBF8` (Dark: `#121A16`)
- **Surface:** `#FFFFFF` (Dark: `#1A2420`)
- **Mint Accent:** `#E7F4ED` (Dark: `#1F332A`)
- **Cream:** `#F8F2E8` (Dark: `#2D271F`)
- **Peach:** `#FBE9DF` (Dark: `#32221D`)
- **Text:** `#26352F` (Dark: `#EAF2EE`)
- **Senior Accessibility Mode:** Dynamic scaling of typography, expanded hit targets (minimum 48dp), and increased contrast ratios.

### B. Doctor Mobile Application: "Clean Clinical Workspace"
- **Primary:** `#168B80`
- **Primary Dark:** `#116C64`
- **Background:** `#F7F9FA` (Dark: `#0E171B`)
- **Surface:** `#FFFFFF` (Dark: `#152228`)
- **Accent:** `#E3F3F0` (Dark: `#183B38`)
- **Text:** `#24343C` (Dark: `#E2E9EC`)
- **Vitals Alert Red:** `#DC2626`
- **Focus:** High density information layout, quick-action clinical buttons, and distraction-free prescription composition.

### C. Admin Web Dashboard: "Premium Healthcare SaaS"
- **Surface:** Pure white `#FFFFFF` / Deep Navy `#0F172A`
- **Sidebar:** Slate `#0F172A`
- **Teal Brand Accent:** `#0D9488` / `#0F766E`
- **Focus:** Responsive desktop/tablet data tables, SVG analytics visualizations, and real-time verification drawers.

---

## 4. Repository Pattern & Phase 2 Integration

All screens interact with service abstractions rather than raw data:

```typescript
// Repository Contract in @careconnect/types
export interface IAppointmentRepository {
  getAll(): Promise<Appointment[]>;
  getByPatientId(patientId: string): Promise<Appointment[]>;
  getByDoctorId(doctorId: string): Promise<Appointment[]>;
  create(data: Omit<Appointment, 'id' | 'bookingReference' | 'createdAt' | 'isDemoBooking'>): Promise<Appointment>;
  updateStatus(id: string, status: AppointmentStatus): Promise<Appointment>;
  reschedule(id: string, newDate: string, newTime: string): Promise<Appointment>;
  cancel(id: string, reason?: string): Promise<Appointment>;
  isSlotBooked(doctorId: string, date: string, time: string): Promise<boolean>;
}
```

In Phase 1, `MockAppointmentRepository` manages in-memory data with duplicate-booking prevention and booking reference generation (`CC-BK-XXXXX`).  
In Phase 2, `FirebaseAppointmentRepository` will implement `IAppointmentRepository` using Cloud Firestore collections without altering UI view components.
