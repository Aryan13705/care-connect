import {
  Doctor,
  Patient,
  FamilyMember,
  Appointment,
  AppointmentStatus,
  Prescription,
  MedicalRecord,
  NotificationItem,
  SupportTicket,
  TicketStatus,
  VerificationStatus,
  DocumentCategory,
  IDoctorRepository,
  IAppointmentRepository,
  IPatientRepository,
  IMedicalRecordRepository,
  INotificationRepository,
  ISupportRepository,
} from '@careconnect/types';

import {
  MOCK_DOCTORS,
  MOCK_PATIENT,
  MOCK_FAMILY_MEMBERS,
  MOCK_APPOINTMENTS,
  MOCK_PRESCRIPTIONS,
  MOCK_MEDICAL_RECORDS,
  MOCK_NOTIFICATIONS,
  MOCK_SUPPORT_TICKETS,
} from './mockData';

// In-Memory Stateful Singletons for Phase 1 Demo
class MockDoctorRepository implements IDoctorRepository {
  private doctors: Doctor[] = [...MOCK_DOCTORS];

  async getAll(): Promise<Doctor[]> {
    return [...this.doctors];
  }

  async getById(id: string): Promise<Doctor | null> {
    const doc = this.doctors.find((d) => d.id === id);
    return doc ? { ...doc } : null;
  }

  async search(
    query: string,
    filters?: {
      specialityId?: string;
      maxFee?: number;
      minExperience?: number;
      language?: string;
      availabilityDay?: string;
      sortBy?: 'recommended' | 'fee_asc' | 'fee_desc' | 'rating_desc' | 'experience_desc';
    }
  ): Promise<Doctor[]> {
    const q = query.trim().toLowerCase();
    let results = this.doctors.filter((d) => {
      const matchesQuery =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.specialityName.toLowerCase().includes(q) ||
        d.areasOfPractice.some((a) => a.toLowerCase().includes(q)) ||
        d.clinicAddress.toLowerCase().includes(q);

      const matchesSpeciality =
        !filters?.specialityId || filters.specialityId === 'all' || d.specialityId === filters.specialityId;

      const matchesFee = !filters?.maxFee || d.consultationFee <= filters.maxFee;

      const matchesExp = !filters?.minExperience || d.experienceYears >= filters.minExperience;

      const matchesLang =
        !filters?.language || filters.language === 'all' || d.languages.includes(filters.language);

      const matchesDay =
        !filters?.availabilityDay ||
        filters.availabilityDay === 'all' ||
        d.availableDays.includes(filters.availabilityDay);

      return matchesQuery && matchesSpeciality && matchesFee && matchesExp && matchesLang && matchesDay;
    });

    if (filters?.sortBy) {
      if (filters.sortBy === 'fee_asc') {
        results.sort((a, b) => a.consultationFee - b.consultationFee);
      } else if (filters.sortBy === 'fee_desc') {
        results.sort((a, b) => b.consultationFee - a.consultationFee);
      } else if (filters.sortBy === 'rating_desc') {
        results.sort((a, b) => b.rating - a.rating);
      } else if (filters.sortBy === 'experience_desc') {
        results.sort((a, b) => b.experienceYears - a.experienceYears);
      }
    }

    return [...results];
  }

  async updateVerification(id: string, status: VerificationStatus, _notes?: string): Promise<Doctor> {
    const index = this.doctors.findIndex((d) => d.id === id);
    if (index === -1) {
      throw new Error(`Doctor with ID ${id} not found`);
    }
    this.doctors[index] = {
      ...this.doctors[index],
      verificationStatus: status,
    };
    return { ...this.doctors[index] };
  }
}

class MockAppointmentRepository implements IAppointmentRepository {
  private appointments: Appointment[] = [...MOCK_APPOINTMENTS];

  async getAll(): Promise<Appointment[]> {
    return [...this.appointments];
  }

  async getByPatientId(patientId: string): Promise<Appointment[]> {
    return this.appointments.filter((a) => a.patientId === patientId);
  }

  async getByDoctorId(doctorId: string): Promise<Appointment[]> {
    return this.appointments.filter((a) => a.doctorId === doctorId);
  }

  async getById(id: string): Promise<Appointment | null> {
    const apt = this.appointments.find((a) => a.id === id || a.bookingReference === id);
    return apt ? { ...apt } : null;
  }

  async isSlotBooked(doctorId: string, date: string, time: string): Promise<boolean> {
    return this.appointments.some(
      (a) =>
        a.doctorId === doctorId &&
        a.date === date &&
        a.time === time &&
        a.status !== 'cancelled'
    );
  }

  async create(
    data: Omit<Appointment, 'id' | 'bookingReference' | 'createdAt' | 'isDemoBooking'>
  ): Promise<Appointment> {
    const isBooked = await this.isSlotBooked(data.doctorId, data.date, data.time);
    if (isBooked) {
      throw new Error(`The selected slot (${data.date} at ${data.time}) is already booked for this doctor.`);
    }

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const newAppointment: Appointment = {
      ...data,
      id: `apt-${Date.now()}`,
      bookingReference: `CC-BK-${randomSuffix}`,
      createdAt: new Date().toISOString(),
      isDemoBooking: true,
    };

    this.appointments.unshift(newAppointment);
    return { ...newAppointment };
  }

  async updateStatus(id: string, status: AppointmentStatus): Promise<Appointment> {
    const index = this.appointments.findIndex((a) => a.id === id || a.bookingReference === id);
    if (index === -1) {
      throw new Error(`Appointment with ID ${id} not found`);
    }
    this.appointments[index] = {
      ...this.appointments[index],
      status,
    };
    return { ...this.appointments[index] };
  }

  async reschedule(id: string, newDate: string, newTime: string): Promise<Appointment> {
    const index = this.appointments.findIndex((a) => a.id === id || a.bookingReference === id);
    if (index === -1) {
      throw new Error(`Appointment with ID ${id} not found`);
    }

    const isBooked = await this.isSlotBooked(this.appointments[index].doctorId, newDate, newTime);
    if (isBooked) {
      throw new Error(`The requested slot (${newDate} at ${newTime}) is unavailable.`);
    }

    this.appointments[index] = {
      ...this.appointments[index],
      date: newDate,
      time: newTime,
      status: 'upcoming',
    };
    return { ...this.appointments[index] };
  }

  async cancel(id: string, _reason?: string): Promise<Appointment> {
    return this.updateStatus(id, 'cancelled');
  }
}

class MockPatientRepository implements IPatientRepository {
  private patient: Patient = { ...MOCK_PATIENT };
  private family: FamilyMember[] = [...MOCK_FAMILY_MEMBERS];

  async getProfile(id: string): Promise<Patient | null> {
    if (this.patient.id === id) {
      return { ...this.patient };
    }
    return null;
  }

  async updateProfile(id: string, updates: Partial<Patient>): Promise<Patient> {
    if (this.patient.id !== id) {
      throw new Error(`Patient ${id} not found`);
    }
    this.patient = { ...this.patient, ...updates };
    return { ...this.patient };
  }

  async getFamilyMembers(patientId: string): Promise<FamilyMember[]> {
    return this.family.filter((f) => f.patientId === patientId);
  }

  async addFamilyMember(member: Omit<FamilyMember, 'id'>): Promise<FamilyMember> {
    const newMember: FamilyMember = {
      ...member,
      id: `fam-${Date.now()}`,
    };
    this.family.push(newMember);
    return { ...newMember };
  }

  async deleteFamilyMember(id: string): Promise<boolean> {
    const initialLen = this.family.length;
    this.family = this.family.filter((f) => f.id !== id);
    return this.family.length < initialLen;
  }
}

class MockMedicalRecordRepository implements IMedicalRecordRepository {
  private records: MedicalRecord[] = [...MOCK_MEDICAL_RECORDS];
  private prescriptions: Prescription[] = [...MOCK_PRESCRIPTIONS];

  async getByPatientId(patientId: string, category?: DocumentCategory): Promise<MedicalRecord[]> {
    return this.records.filter((r) => r.patientId === patientId && (!category || r.category === category));
  }

  async getById(id: string): Promise<MedicalRecord | null> {
    const record = this.records.find((r) => r.id === id);
    return record ? { ...record } : null;
  }

  async getPrescriptionsByPatientId(patientId: string): Promise<Prescription[]> {
    return this.prescriptions.filter((p) => p.patientId === patientId);
  }

  async getPrescriptionById(id: string): Promise<Prescription | null> {
    const presc = this.prescriptions.find((p) => p.id === id || p.appointmentId === id);
    return presc ? { ...presc } : null;
  }

  async savePrescriptionDraft(prescription: Omit<Prescription, 'id' | 'isSampleOnly'>): Promise<Prescription> {
    const newPresc: Prescription = {
      ...prescription,
      id: `presc-${Date.now()}`,
      isSampleOnly: true,
    };
    this.prescriptions.unshift(newPresc);
    return { ...newPresc };
  }
}

class MockNotificationRepository implements INotificationRepository {
  private notifications: NotificationItem[] = [...MOCK_NOTIFICATIONS];

  async getByUserId(userId: string): Promise<NotificationItem[]> {
    return this.notifications.filter((n) => n.userId === userId);
  }

  async markAsRead(notificationId: string): Promise<void> {
    const notif = this.notifications.find((n) => n.id === notificationId);
    if (notif) {
      notif.read = true;
    }
  }

  async markAllAsRead(userId: string): Promise<void> {
    this.notifications.forEach((n) => {
      if (n.userId === userId) {
        n.read = true;
      }
    });
  }
}

class MockSupportRepository implements ISupportRepository {
  private tickets: SupportTicket[] = [...MOCK_SUPPORT_TICKETS];

  async getAllTickets(): Promise<SupportTicket[]> {
    return [...this.tickets];
  }

  async getTicketById(id: string): Promise<SupportTicket | null> {
    const t = this.tickets.find((tick) => tick.id === id || tick.ticketNumber === id);
    return t ? { ...t } : null;
  }

  async createTicket(
    ticket: Omit<SupportTicket, 'id' | 'ticketNumber' | 'createdAt' | 'updatedAt' | 'responses'>
  ): Promise<SupportTicket> {
    const newTicket: SupportTicket = {
      ...ticket,
      id: `tick-${Date.now()}`,
      ticketNumber: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      responses: [],
    };
    this.tickets.unshift(newTicket);
    return { ...newTicket };
  }

  async addResponse(ticketId: string, sender: string, role: 'user' | 'admin', message: string): Promise<SupportTicket> {
    const index = this.tickets.findIndex((t) => t.id === ticketId || t.ticketNumber === ticketId);
    if (index === -1) {
      throw new Error(`Ticket ${ticketId} not found`);
    }
    const newResp = {
      id: `resp-${Date.now()}`,
      sender,
      role,
      message,
      timestamp: new Date().toLocaleString(),
    };
    this.tickets[index].responses.push(newResp);
    this.tickets[index].updatedAt = new Date().toISOString();
    return { ...this.tickets[index] };
  }

  async updateTicketStatus(ticketId: string, status: TicketStatus): Promise<SupportTicket> {
    const index = this.tickets.findIndex((t) => t.id === ticketId || t.ticketNumber === ticketId);
    if (index === -1) {
      throw new Error(`Ticket ${ticketId} not found`);
    }
    this.tickets[index].status = status;
    this.tickets[index].updatedAt = new Date().toISOString();
    return { ...this.tickets[index] };
  }
}

// Export Singleton Repository Instances
export const doctorRepository = new MockDoctorRepository();
export const appointmentRepository = new MockAppointmentRepository();
export const patientRepository = new MockPatientRepository();
export const medicalRecordRepository = new MockMedicalRecordRepository();
export const notificationRepository = new MockNotificationRepository();
export const supportRepository = new MockSupportRepository();
