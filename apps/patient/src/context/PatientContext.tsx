import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Doctor,
  Patient,
  FamilyMember,
  Appointment,
  Prescription,
  MedicalRecord,
  NotificationItem,
  Speciality,
} from '@careconnect/types';
import {
  PATIENT_LIGHT_THEME,
  PATIENT_DARK_THEME,
  ThemeColors,
} from '@careconnect/ui';
import {
  MOCK_SPECIALITIES,
  doctorRepository,
  appointmentRepository,
  patientRepository,
  medicalRecordRepository,
  notificationRepository,
  DEMO_IDS,
} from '@careconnect/config';

interface PatientContextType {
  theme: ThemeColors;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  patient: Patient;
  updatePatientProfile: (updates: Partial<Patient>) => Promise<void>;
  doctors: Doctor[];
  specialities: Speciality[];
  appointments: Appointment[];
  familyMembers: FamilyMember[];
  medicalRecords: MedicalRecord[];
  prescriptions: Prescription[];
  notifications: NotificationItem[];
  bookAppointment: (
    doctorId: string,
    date: string,
    time: string,
    mode: 'video' | 'in-person',
    patientName: string,
    reason: string
  ) => Promise<Appointment>;
  rescheduleAppointment: (appointmentId: string, newDate: string, newTime: string) => Promise<Appointment>;
  cancelAppointment: (appointmentId: string) => Promise<void>;
  addFamilyMember: (member: Omit<FamilyMember, 'id' | 'patientId'>) => Promise<FamilyMember>;
  markNotificationRead: (id: string) => Promise<void>;
  seniorMode: boolean;
  setSeniorMode: (val: boolean) => void;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export function PatientProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [seniorMode, setSeniorMode] = useState(false);

  const [patient, setPatient] = useState<Patient>({
    id: DEMO_IDS.patientId,
    name: DEMO_IDS.patientName,
    age: 28,
    gender: 'Male',
    phone: '+91 98765 43210',
    email: 'aryan.jaiswal@demo-careconnect.in',
    preferredLanguage: 'English',
    city: 'Bangalore',
    emergencyContact: {
      name: 'Sunita Jaiswal',
      relationship: 'Mother',
      phone: '+91 98765 43211',
    },
    bloodGroup: 'O+',
    allergies: ['Penicillin', 'Dust Mites'],
    chronicConditions: ['Mild Allergic Asthma'],
    isDemoProfile: true,
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face',
  });

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specialities] = useState<Speciality[]>(MOCK_SPECIALITIES);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    async function loadData() {
      const [allDocs, allApts, fams, recs, prescs, notifs] = await Promise.all([
        doctorRepository.getAll(),
        appointmentRepository.getByPatientId(DEMO_IDS.patientId),
        patientRepository.getFamilyMembers(DEMO_IDS.patientId),
        medicalRecordRepository.getByPatientId(DEMO_IDS.patientId),
        medicalRecordRepository.getPrescriptionsByPatientId(DEMO_IDS.patientId),
        notificationRepository.getByUserId(DEMO_IDS.patientId),
      ]);

      setDoctors(allDocs);
      setAppointments(allApts);
      setFamilyMembers(fams);
      setMedicalRecords(recs);
      setPrescriptions(prescs);
      setNotifications(notifs);
    }
    loadData();
  }, []);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);
  const theme = isDarkMode ? PATIENT_DARK_THEME : PATIENT_LIGHT_THEME;

  const updatePatientProfile = async (updates: Partial<Patient>) => {
    const updated = await patientRepository.updateProfile(patient.id, updates);
    setPatient(updated);
  };

  const bookAppointment = async (
    doctorId: string,
    date: string,
    time: string,
    mode: 'video' | 'in-person',
    patientName: string,
    reason: string
  ): Promise<Appointment> => {
    const doctor = doctors.find((d) => d.id === doctorId);
    if (!doctor) throw new Error('Doctor not found');

    const platformFee = 49;
    const consultationFee = doctor.consultationFee;
    const totalFee = consultationFee + platformFee;

    const newApt = await appointmentRepository.create({
      doctorId,
      doctorName: doctor.name,
      doctorSpeciality: doctor.specialityName,
      doctorAvatar: doctor.avatarUrl,
      doctorClinic: doctor.clinicAddress,
      patientId: patient.id,
      patientName,
      patientAge: patient.age,
      patientGender: patient.gender,
      date,
      time,
      mode,
      status: 'upcoming',
      consultationFee,
      platformFee,
      totalFee,
      reasonForVisit: reason || 'General medical consultation',
    });

    setAppointments((prev) => [newApt, ...prev]);

    // Add local notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: patient.id,
      title: 'Appointment Booked (Demo)',
      message: `Your appointment with ${doctor.name} for ${date} at ${time} is confirmed. Ref: ${newApt.bookingReference}`,
      type: 'booking',
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return newApt;
  };

  const rescheduleAppointment = async (
    appointmentId: string,
    newDate: string,
    newTime: string
  ): Promise<Appointment> => {
    const updated = await appointmentRepository.reschedule(appointmentId, newDate, newTime);
    setAppointments((prev) => prev.map((a) => (a.id === appointmentId ? updated : a)));
    return updated;
  };

  const cancelAppointment = async (appointmentId: string): Promise<void> => {
    const updated = await appointmentRepository.cancel(appointmentId);
    setAppointments((prev) => prev.map((a) => (a.id === appointmentId ? updated : a)));
  };

  const addFamilyMember = async (member: Omit<FamilyMember, 'id' | 'patientId'>): Promise<FamilyMember> => {
    const added = await patientRepository.addFamilyMember({
      ...member,
      patientId: patient.id,
    });
    setFamilyMembers((prev) => [...prev, added]);
    return added;
  };

  const markNotificationRead = async (id: string): Promise<void> => {
    await notificationRepository.markAsRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  return (
    <PatientContext.Provider
      value={{
        theme,
        isDarkMode,
        toggleDarkMode,
        patient,
        updatePatientProfile,
        doctors,
        specialities,
        appointments,
        familyMembers,
        medicalRecords,
        prescriptions,
        notifications,
        bookAppointment,
        rescheduleAppointment,
        cancelAppointment,
        addFamilyMember,
        markNotificationRead,
        seniorMode,
        setSeniorMode,
      }}
    >
      {children}
    </PatientContext.Provider>
  );
}

export function usePatient() {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error('usePatient must be used within a PatientProvider');
  }
  return context;
}
