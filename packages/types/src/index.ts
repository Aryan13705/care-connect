// ==========================================
// CARECONNECT SHARED TYPES & REPOSITORIES
// Phase 1 Frontend Domain Model & Contracts
// ==========================================

export type ConsultationMode = 'video' | 'in-person';

export type AppointmentStatus = 'upcoming' | 'completed' | 'cancelled';

export type VerificationStatus = 'verified' | 'pending' | 'rejected';

export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TicketStatus = 'open' | 'in_progress' | 'resolved';

export type DocumentCategory = 'prescription' | 'lab_report' | 'consultation_summary' | 'imaging';

export interface Doctor {
  id: string;
  name: string;
  title: string;
  specialityId: string;
  specialityName: string;
  qualification: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  consultationFee: number;
  avatarUrl: string;
  bio: string;
  languages: string[];
  clinicAddress: string;
  city: string;
  areasOfPractice: string[];
  isDemoProfile: boolean;
  verificationStatus: VerificationStatus;
  registrationNumber: string;
  registrationCouncil: string;
  nextAvailableSlot: string;
  availableDays: string[];
  slotDurationMinutes: number;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email: string;
  preferredLanguage: string;
  city: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  bloodGroup: string;
  allergies: string[];
  chronicConditions: string[];
  isDemoProfile: boolean;
  avatarUrl: string;
}

export interface FamilyMember {
  id: string;
  patientId: string;
  name: string;
  relationship: 'Mother' | 'Father' | 'Spouse' | 'Child' | 'Sibling' | 'Other';
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  allergies?: string[];
  avatarUrl?: string;
}

export interface TimeSlot {
  id: string;
  time: string; // e.g. "09:30 AM"
  isAvailable: boolean;
}

export interface Appointment {
  id: string;
  bookingReference: string; // e.g. "CC-BK-82914"
  doctorId: string;
  doctorName: string;
  doctorSpeciality: string;
  doctorAvatar: string;
  doctorClinic: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  familyMemberId?: string;
  date: string; // ISO date string YYYY-MM-DD
  time: string; // e.g. "10:30 AM"
  mode: ConsultationMode;
  status: AppointmentStatus;
  consultationFee: number;
  platformFee: number;
  totalFee: number;
  reasonForVisit: string;
  symptoms?: string[];
  consultationNotes?: string;
  prescriptionId?: string;
  createdAt: string;
  isDemoBooking: boolean;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string; // e.g. "500mg"
  frequency: string; // e.g. "1-0-1 (After Food)"
  duration: string; // e.g. "5 days"
  instructions: string; // e.g. "Take with warm water"
}

export interface Prescription {
  id: string;
  appointmentId: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  doctorId: string;
  doctorName: string;
  doctorSpeciality: string;
  doctorRegistration: string;
  clinicAddress: string;
  date: string;
  diagnosis: string;
  clinicalNotes: string;
  medications: Medication[];
  followUpDate?: string;
  isSampleOnly: boolean; // Always true in Phase 1
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  title: string;
  category: DocumentCategory;
  doctorName: string;
  facility: string;
  date: string;
  summary: string;
  fileUrl?: string;
  fileSize?: string;
  prescribedMeds?: string[];
  isDemoRecord: boolean;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'reminder' | 'booking' | 'followup' | 'announcement';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface Speciality {
  id: string;
  name: string;
  iconName: string;
  description: string;
  doctorCount: number;
  commonSymptoms: string[];
  accentColor: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  userId: string;
  userName: string;
  userRole: 'patient' | 'doctor';
  subject: string;
  message: string;
  category: 'booking' | 'payment' | 'telehealth' | 'account' | 'other';
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  responses: Array<{
    id: string;
    sender: string;
    role: 'user' | 'admin';
    message: string;
    timestamp: string;
  }>;
}

export interface DoctorAvailability {
  doctorId: string;
  workingDays: string[]; // ['Monday', 'Tuesday', ...]
  startTime: string; // "09:00"
  endTime: string; // "18:00"
  slotDurationMinutes: number; // 15, 30, 45
  breakStart?: string; // "13:00"
  breakEnd?: string; // "14:00"
  consultationFee: number;
  videoEnabled: boolean;
  inPersonEnabled: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  action: string;
  resourceType: string;
  resourceId: string;
  details: string;
  ipAddress: string;
  status: 'success' | 'warning' | 'info';
}

export interface PlatformAnalytics {
  totalPatients: number;
  totalDoctors: number;
  pendingDoctorVerifications: number;
  totalAppointments: number;
  completedConsultations: number;
  cancelledAppointments: number;
  monthlyRevenueEstimate: number;
  appointmentTrends: Array<{
    date: string;
    appointments: number;
    completed: number;
  }>;
  specialityDistribution: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;
  doctorGrowth: Array<{
    month: string;
    doctors: number;
  }>;
}

// ==========================================
// REPOSITORY INTERFACES (Clean Architecture)
// Ready for Phase 2 Firebase / Backend swap
// ==========================================

export interface IDoctorRepository {
  getAll(): Promise<Doctor[]>;
  getById(id: string): Promise<Doctor | null>;
  search(query: string, filters?: {
    specialityId?: string;
    maxFee?: number;
    minExperience?: number;
    language?: string;
    availabilityDay?: string;
    sortBy?: 'recommended' | 'fee_asc' | 'fee_desc' | 'rating_desc' | 'experience_desc';
  }): Promise<Doctor[]>;
  updateVerification(id: string, status: VerificationStatus, notes?: string): Promise<Doctor>;
}

export interface IAppointmentRepository {
  getAll(): Promise<Appointment[]>;
  getByPatientId(patientId: string): Promise<Appointment[]>;
  getByDoctorId(doctorId: string): Promise<Appointment[]>;
  getById(id: string): Promise<Appointment | null>;
  create(data: Omit<Appointment, 'id' | 'bookingReference' | 'createdAt' | 'isDemoBooking'>): Promise<Appointment>;
  updateStatus(id: string, status: AppointmentStatus): Promise<Appointment>;
  reschedule(id: string, newDate: string, newTime: string): Promise<Appointment>;
  cancel(id: string, reason?: string): Promise<Appointment>;
  isSlotBooked(doctorId: string, date: string, time: string): Promise<boolean>;
}

export interface IPatientRepository {
  getProfile(id: string): Promise<Patient | null>;
  updateProfile(id: string, updates: Partial<Patient>): Promise<Patient>;
  getFamilyMembers(patientId: string): Promise<FamilyMember[]>;
  addFamilyMember(member: Omit<FamilyMember, 'id'>): Promise<FamilyMember>;
  deleteFamilyMember(id: string): Promise<boolean>;
}

export interface IMedicalRecordRepository {
  getByPatientId(patientId: string, category?: DocumentCategory): Promise<MedicalRecord[]>;
  getById(id: string): Promise<MedicalRecord | null>;
  getPrescriptionsByPatientId(patientId: string): Promise<Prescription[]>;
  getPrescriptionById(id: string): Promise<Prescription | null>;
  savePrescriptionDraft(prescription: Omit<Prescription, 'id' | 'isSampleOnly'>): Promise<Prescription>;
}

export interface INotificationRepository {
  getByUserId(userId: string): Promise<NotificationItem[]>;
  markAsRead(notificationId: string): Promise<void>;
  markAllAsRead(userId: string): Promise<void>;
}

export interface ISupportRepository {
  getAllTickets(): Promise<SupportTicket[]>;
  getTicketById(id: string): Promise<SupportTicket | null>;
  createTicket(ticket: Omit<SupportTicket, 'id' | 'ticketNumber' | 'createdAt' | 'updatedAt' | 'responses'>): Promise<SupportTicket>;
  addResponse(ticketId: string, sender: string, role: 'user' | 'admin', message: string): Promise<SupportTicket>;
  updateTicketStatus(ticketId: string, status: TicketStatus): Promise<SupportTicket>;
}
