'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Doctor,
  Patient,
  Appointment,
  AppointmentStatus,
  SupportTicket,
  AuditLogEntry,
  PlatformAnalytics,
  VerificationStatus,
  TicketStatus,
} from '@careconnect/types';
import {
  MOCK_DOCTORS,
  MOCK_PATIENT,
  MOCK_APPOINTMENTS,
  MOCK_SUPPORT_TICKETS,
  MOCK_AUDIT_LOGS,
  MOCK_ANALYTICS,
  doctorRepository,
  appointmentRepository,
  supportRepository,
} from '@careconnect/config';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AdminContextType {
  isDark: boolean;
  toggleTheme: () => void;
  doctors: Doctor[];
  patients: Patient[];
  appointments: Appointment[];
  tickets: SupportTicket[];
  auditLogs: AuditLogEntry[];
  analytics: PlatformAnalytics;
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  approveDoctor: (id: string, notes?: string) => Promise<void>;
  rejectDoctor: (id: string, notes?: string) => Promise<void>;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => Promise<void>;
  respondToTicket: (ticketId: string, replyMessage: string) => Promise<void>;
  updateTicketStatus: (ticketId: string, status: TicketStatus) => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([...MOCK_DOCTORS]);
  const [patients] = useState<Patient[]>([
    { ...MOCK_PATIENT },
    {
      id: 'patient-sunita-02',
      name: 'Sunita Sharma',
      age: 52,
      gender: 'Female',
      phone: '+91 98111 22334',
      email: 'sunita.sharma@demo.in',
      preferredLanguage: 'Hindi',
      city: 'Bangalore',
      emergencyContact: { name: 'Amit Sharma', relationship: 'Son', phone: '+91 98111 22335' },
      bloodGroup: 'B+',
      allergies: ['Sulfa drugs'],
      chronicConditions: ['Hypertension'],
      isDemoProfile: true,
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face',
    },
    {
      id: 'patient-aarav-03',
      name: 'Aarav Gupta',
      age: 34,
      gender: 'Male',
      phone: '+91 97222 33445',
      email: 'aarav.gupta@demo.in',
      preferredLanguage: 'English',
      city: 'Bangalore',
      emergencyContact: { name: 'Pooja Gupta', relationship: 'Spouse', phone: '+91 97222 33446' },
      bloodGroup: 'A+',
      allergies: ['Shellfish'],
      chronicConditions: ['Dyslipidemia'],
      isDemoProfile: true,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    },
    {
      id: 'patient-kavita-04',
      name: 'Kavita Nair',
      age: 29,
      gender: 'Female',
      phone: '+91 96333 44556',
      email: 'kavita.nair@demo.in',
      preferredLanguage: 'Malayalam',
      city: 'Bangalore',
      emergencyContact: { name: 'Suresh Nair', relationship: 'Father', phone: '+91 96333 44557' },
      bloodGroup: 'O-',
      allergies: ['None'],
      chronicConditions: ['Sinus Tachycardia'],
      isDemoProfile: true,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
    },
  ]);
  const [appointments, setAppointments] = useState<Appointment[]>([...MOCK_APPOINTMENTS]);
  const [tickets, setTickets] = useState<SupportTicket[]>([...MOCK_SUPPORT_TICKETS]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([...MOCK_AUDIT_LOGS]);
  const [analytics] = useState<PlatformAnalytics>(MOCK_ANALYTICS);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const approveDoctor = async (id: string, notes?: string) => {
    await doctorRepository.updateVerification(id, 'verified', notes);
    setDoctors((prev) =>
      prev.map((d) => (d.id === id ? { ...d, verificationStatus: 'verified' } : d))
    );

    const doc = doctors.find((d) => d.id === id);
    const newLog: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      actorName: 'Platform Administrator',
      actorRole: 'Admin',
      action: 'DOCTOR_VERIFIED',
      resourceType: 'Doctor',
      resourceId: id,
      details: `Approved verification credentials for ${doc?.name || id}. Notes: ${notes || 'Verified'}`,
      ipAddress: '192.168.1.100',
      status: 'success',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
    showToast(`Doctor credentials for ${doc?.name || 'Practitioner'} approved!`, 'success');
  };

  const rejectDoctor = async (id: string, notes?: string) => {
    await doctorRepository.updateVerification(id, 'rejected', notes);
    setDoctors((prev) =>
      prev.map((d) => (d.id === id ? { ...d, verificationStatus: 'rejected' } : d))
    );

    const doc = doctors.find((d) => d.id === id);
    const newLog: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      actorName: 'Platform Administrator',
      actorRole: 'Admin',
      action: 'DOCTOR_REJECTED',
      resourceType: 'Doctor',
      resourceId: id,
      details: `Rejected application for ${doc?.name || id}. Reason: ${notes || 'Deficient documentation'}`,
      ipAddress: '192.168.1.100',
      status: 'warning',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
    showToast(`Doctor verification rejected for ${doc?.name || 'Practitioner'}.`, 'info');
  };

  const updateAppointmentStatus = async (id: string, status: AppointmentStatus) => {
    await appointmentRepository.updateStatus(id, status);
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
    showToast(`Appointment status updated to ${status}.`, 'info');
  };

  const respondToTicket = async (ticketId: string, replyMessage: string) => {
    const updated = await supportRepository.addResponse(
      ticketId,
      'Support Team (Admin)',
      'admin',
      replyMessage
    );
    await supportRepository.updateTicketStatus(ticketId, 'resolved');
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...updated, status: 'resolved' } : t))
    );
    showToast('Support response sent to user and ticket resolved.', 'success');
  };

  const updateTicketStatus = async (ticketId: string, status: TicketStatus) => {
    const updated = await supportRepository.updateTicketStatus(ticketId, status);
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? updated : t))
    );
    showToast(`Ticket status updated to ${status}.`, 'info');
  };

  return (
    <AdminContext.Provider
      value={{
        isDark,
        toggleTheme,
        doctors,
        patients,
        appointments,
        tickets,
        auditLogs,
        analytics,
        toasts,
        showToast,
        removeToast,
        approveDoctor,
        rejectDoctor,
        updateAppointmentStatus,
        respondToTicket,
        updateTicketStatus,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within an AdminProvider');
  return ctx;
}
