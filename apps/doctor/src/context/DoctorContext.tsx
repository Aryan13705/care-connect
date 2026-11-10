import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Doctor,
  Patient,
  Appointment,
  AppointmentStatus,
  Prescription,
  DoctorAvailability,
} from '@careconnect/types';
import {
  DOCTOR_LIGHT_THEME,
  DOCTOR_DARK_THEME,
  ThemeColors,
} from '@careconnect/ui';
import {
  MOCK_DOCTORS,
  MOCK_PATIENT,
  MOCK_APPOINTMENTS,
  MOCK_PRESCRIPTIONS,
  appointmentRepository,
  doctorRepository,
  medicalRecordRepository,
  DEMO_IDS,
} from '@careconnect/config';

export interface DoctorEarnings {
  todayEarnings: number;
  monthlyEarnings: number;
  completedConsultationsCount: number;
  transactions: Array<{
    id: string;
    patientName: string;
    date: string;
    amount: number;
    mode: 'video' | 'in-person';
    status: 'Settled' | 'Pending';
  }>;
}

export interface ChatThread {
  id: string;
  patientId: string;
  patientName: string;
  patientAvatar: string;
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
  messages: Array<{
    id: string;
    sender: string;
    text: string;
    timestamp: string;
    isDoctor: boolean;
  }>;
}

interface DoctorContextType {
  theme: ThemeColors;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  doctor: Doctor;
  updateDoctorProfile: (updates: Partial<Doctor>) => void;
  appointments: Appointment[];
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => Promise<void>;
  patients: Patient[];
  prescriptions: Prescription[];
  savePrescription: (prescription: Omit<Prescription, 'id' | 'isSampleOnly'>) => Promise<Prescription>;
  availability: DoctorAvailability;
  updateAvailability: (updates: Partial<DoctorAvailability>) => void;
  earnings: DoctorEarnings;
  chatThreads: ChatThread[];
  sendMessageToThread: (threadId: string, text: string) => void;
}

const DoctorContext = createContext<DoctorContextType | undefined>(undefined);

export function DoctorProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [doctor, setDoctor] = useState<Doctor>(() => {
    return MOCK_DOCTORS.find((d) => d.id === DEMO_IDS.doctorId) || MOCK_DOCTORS[0];
  });

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([...MOCK_PRESCRIPTIONS]);

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
      chronicConditions: ['Hypertension', 'Osteoarthritis'],
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
      chronicConditions: ['Elevated LDL Cholesterol'],
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
      allergies: ['None known'],
      chronicConditions: ['Mild Tachycardia episodes'],
      isDemoProfile: true,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
    },
  ]);

  const [availability, setAvailability] = useState<DoctorAvailability>({
    doctorId: doctor.id,
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    startTime: '09:00 AM',
    endTime: '06:00 PM',
    slotDurationMinutes: 30,
    breakStart: '01:00 PM',
    breakEnd: '02:00 PM',
    consultationFee: doctor.consultationFee,
    videoEnabled: true,
    inPersonEnabled: true,
  });

  const [earnings, setEarnings] = useState<DoctorEarnings>({
    todayEarnings: 4800,
    monthlyEarnings: 124800,
    completedConsultationsCount: 156,
    transactions: [
      {
        id: 'txn-01',
        patientName: 'Aryan Jaiswal',
        date: '10 Nov 2026',
        amount: 800,
        mode: 'video',
        status: 'Settled',
      },
      {
        id: 'txn-02',
        patientName: 'Sunita Sharma',
        date: '10 Nov 2026',
        amount: 800,
        mode: 'in-person',
        status: 'Settled',
      },
      {
        id: 'txn-03',
        patientName: 'Aarav Gupta',
        date: '09 Nov 2026',
        amount: 800,
        mode: 'video',
        status: 'Settled',
      },
      {
        id: 'txn-04',
        patientName: 'Kavita Nair',
        date: '08 Nov 2026',
        amount: 800,
        mode: 'video',
        status: 'Pending',
      },
    ],
  });

  const [chatThreads, setChatThreads] = useState<ChatThread[]>([
    {
      id: 'thread-01',
      patientId: 'patient-aryan-01',
      patientName: 'Aryan Jaiswal',
      patientAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face',
      lastMessage: 'Thank you doctor, I have updated my daily blood pressure log.',
      lastTimestamp: '10:30 AM',
      unreadCount: 1,
      messages: [
        {
          id: 'm1',
          sender: 'Dr. Meera Patel',
          text: 'Hello Aryan, please ensure you check resting pulse before taking the CoQ10 capsule.',
          timestamp: '09:15 AM',
          isDoctor: true,
        },
        {
          id: 'm2',
          sender: 'Aryan Jaiswal',
          text: 'Thank you doctor, I have updated my daily blood pressure log.',
          timestamp: '10:30 AM',
          isDoctor: false,
        },
      ],
    },
    {
      id: 'thread-02',
      patientId: 'patient-sunita-02',
      patientName: 'Sunita Sharma',
      patientAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face',
      lastMessage: 'Can I reschedule tomorrow afternoon consultation to Friday?',
      lastTimestamp: 'Yesterday',
      unreadCount: 0,
      messages: [
        {
          id: 'm3',
          sender: 'Sunita Sharma',
          text: 'Can I reschedule tomorrow afternoon consultation to Friday?',
          timestamp: 'Yesterday 04:12 PM',
          isDoctor: false,
        },
      ],
    },
  ]);

  useEffect(() => {
    async function initDoctorData() {
      const allApts = await appointmentRepository.getAll();
      setAppointments(allApts);
    }
    initDoctorData();
  }, []);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);
  const theme = isDarkMode ? DOCTOR_DARK_THEME : DOCTOR_LIGHT_THEME;

  const updateDoctorProfile = (updates: Partial<Doctor>) => {
    setDoctor((prev) => ({ ...prev, ...updates }));
  };

  const updateAppointmentStatus = async (id: string, status: AppointmentStatus) => {
    const updated = await appointmentRepository.updateStatus(id, status);
    setAppointments((prev) => prev.map((a) => (a.id === id ? updated : a)));
  };

  const savePrescription = async (prescriptionData: Omit<Prescription, 'id' | 'isSampleOnly'>) => {
    const saved = await medicalRecordRepository.savePrescriptionDraft(prescriptionData);
    setPrescriptions((prev) => [saved, ...prev]);
    return saved;
  };

  const updateAvailability = (updates: Partial<DoctorAvailability>) => {
    setAvailability((prev) => ({ ...prev, ...updates }));
  };

  const sendMessageToThread = (threadId: string, text: string) => {
    if (!text.trim()) return;
    setChatThreads((prev) =>
      prev.map((thread) => {
        if (thread.id === threadId) {
          const newMsg = {
            id: `msg-${Date.now()}`,
            sender: doctor.name,
            text: text.trim(),
            timestamp: 'Just now',
            isDoctor: true,
          };
          return {
            ...thread,
            lastMessage: text.trim(),
            lastTimestamp: 'Just now',
            messages: [...thread.messages, newMsg],
          };
        }
        return thread;
      })
    );
  };

  return (
    <DoctorContext.Provider
      value={{
        theme,
        isDarkMode,
        toggleDarkMode,
        doctor,
        updateDoctorProfile,
        appointments,
        updateAppointmentStatus,
        patients,
        prescriptions,
        savePrescription,
        availability,
        updateAvailability,
        earnings,
        chatThreads,
        sendMessageToThread,
      }}
    >
      {children}
    </DoctorContext.Provider>
  );
}

export function useDoctor() {
  const context = useContext(DoctorContext);
  if (!context) {
    throw new Error('useDoctor must be used within a DoctorProvider');
  }
  return context;
}
