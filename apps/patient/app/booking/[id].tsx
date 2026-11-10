import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  Check,
  ShieldCheck,
  User,
  Info,
  ChevronRight,
} from 'lucide-react-native';
import { usePatient } from '../../src/context/PatientContext';

export default function AppointmentBookingScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme, doctors, patient, familyMembers, bookAppointment, seniorMode } = usePatient();

  const doctor = doctors.find((d) => d.id === id) || doctors[0];

  const datesList = [
    { label: 'Today', day: '10 Nov', date: '2026-11-10' },
    { label: 'Tomorrow', day: '11 Nov', date: '2026-11-11' },
    { label: 'Thu', day: '12 Nov', date: '2026-11-12' },
    { label: 'Fri', day: '13 Nov', date: '2026-11-13' },
    { label: 'Sat', day: '14 Nov', date: '2026-11-14' },
    { label: 'Mon', day: '16 Nov', date: '2026-11-16' },
  ];

  const timeSlots = [
    { time: '09:30 AM', period: 'Morning' },
    { time: '10:30 AM', period: 'Morning' },
    { time: '11:45 AM', period: 'Morning' },
    { time: '02:30 PM', period: 'Afternoon' },
    { time: '04:00 PM', period: 'Afternoon' },
    { time: '05:30 PM', period: 'Evening' },
    { time: '06:45 PM', period: 'Evening' },
  ];

  const [selectedDate, setSelectedDate] = useState(datesList[1].date);
  const [selectedTime, setSelectedTime] = useState(timeSlots[1].time);
  const [selectedMode, setSelectedMode] = useState<'video' | 'in-person'>('video');
  const [selectedPatientName, setSelectedPatientName] = useState(patient.name);
  const [reason, setReason] = useState('Routine review and health guidance');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const platformFee = 49;
  const totalFee = doctor.consultationFee + platformFee;

  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    try {
      const newBooking = await bookAppointment(
        doctor.id,
        selectedDate,
        selectedTime,
        selectedMode,
        selectedPatientName,
        reason
      );

      // Navigate to confirmation screen
      router.replace({
        pathname: '/booking-confirmation',
        params: {
          bookingRef: newBooking.bookingReference,
          doctorName: doctor.name,
          doctorSpeciality: doctor.specialityName,
          doctorAvatar: doctor.avatarUrl,
          date: selectedDate,
          time: selectedTime,
          mode: selectedMode,
          fee: totalFee.toString(),
          patientName: selectedPatientName,
        },
      });
    } catch (err: any) {
      Alert.alert('Booking Error', err.message || 'Slot could not be reserved.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* DOCTOR MINI SUMMARY */}
        <View style={[styles.doctorHeader, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Image source={{ uri: doctor.avatarUrl }} style={styles.docAvatar} />
          <View style={styles.docTexts}>
            <Text style={[styles.docName, { color: theme.text, fontSize: seniorMode ? 17 : 15 }]}>
              {doctor.name}
            </Text>
            <Text style={[styles.docSpec, { color: theme.primaryDark || theme.primary }]}>
              {doctor.specialityName}
            </Text>
            <Text style={[styles.docExp, { color: theme.mutedText }]}>
              {doctor.experienceYears} yrs exp • {doctor.city}
            </Text>
          </View>
        </View>

        {/* 1. CONSULTATION MODE */}
        <View style={[styles.sectionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>1. Consultation Mode</Text>
          <View style={styles.modeOptions}>
            <TouchableOpacity
              style={[
                styles.modeOption,
                {
                  backgroundColor: selectedMode === 'video' ? (theme.mint || '#E7F4ED') : theme.background,
                  borderColor: selectedMode === 'video' ? (theme.primaryDark || '#347C65') : theme.border,
                },
              ]}
              onPress={() => setSelectedMode('video')}
            >
              <Video size={20} color={selectedMode === 'video' ? (theme.primaryDark || '#347C65') : theme.text} />
              <View style={styles.modeOptionTexts}>
                <Text
                  style={[
                    styles.modeOptionTitle,
                    { color: selectedMode === 'video' ? (theme.primaryDark || '#347C65') : theme.text },
                  ]}
                >
                  Video Consultation
                </Text>
                <Text style={[styles.modeOptionSub, { color: theme.mutedText }]}>High quality virtual room</Text>
              </View>
              {selectedMode === 'video' && <Check size={18} color={theme.primaryDark || '#347C65'} />}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modeOption,
                {
                  backgroundColor: selectedMode === 'in-person' ? (theme.mint || '#E7F4ED') : theme.background,
                  borderColor: selectedMode === 'in-person' ? (theme.primaryDark || '#347C65') : theme.border,
                },
              ]}
              onPress={() => setSelectedMode('in-person')}
            >
              <MapPin size={20} color={selectedMode === 'in-person' ? (theme.primaryDark || '#347C65') : theme.text} />
              <View style={styles.modeOptionTexts}>
                <Text
                  style={[
                    styles.modeOptionTitle,
                    { color: selectedMode === 'in-person' ? (theme.primaryDark || '#347C65') : theme.text },
                  ]}
                >
                  In-Clinic Consultation
                </Text>
                <Text style={[styles.modeOptionSub, { color: theme.mutedText }]} numberOfLines={1}>
                  {doctor.clinicAddress}
                </Text>
              </View>
              {selectedMode === 'in-person' && <Check size={18} color={theme.primaryDark || '#347C65'} />}
            </TouchableOpacity>
          </View>
        </View>

        {/* 2. SELECT DATE */}
        <View style={[styles.sectionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>2. Select Consultation Date</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.datesScroll}>
            {datesList.map((d) => {
              const isSelected = selectedDate === d.date;
              return (
                <TouchableOpacity
                  key={d.date}
                  style={[
                    styles.dateBox,
                    {
                      backgroundColor: isSelected ? (theme.primaryDark || '#347C65') : theme.background,
                      borderColor: theme.border,
                    },
                  ]}
                  onPress={() => setSelectedDate(d.date)}
                >
                  <Text style={[styles.dateBoxLabel, { color: isSelected ? '#FFFFFF' : theme.mutedText }]}>
                    {d.label}
                  </Text>
                  <Text style={[styles.dateBoxDay, { color: isSelected ? '#FFFFFF' : theme.text }]}>
                    {d.day}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* 3. SELECT TIME SLOT */}
        <View style={[styles.sectionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>3. Available Time Slots</Text>
          <View style={styles.slotsGrid}>
            {timeSlots.map((s) => {
              const isSelected = selectedTime === s.time;
              return (
                <TouchableOpacity
                  key={s.time}
                  style={[
                    styles.timeSlotPill,
                    {
                      backgroundColor: isSelected ? (theme.primaryDark || '#347C65') : theme.background,
                      borderColor: theme.border,
                    },
                  ]}
                  onPress={() => setSelectedTime(s.time)}
                >
                  <Clock size={12} color={isSelected ? '#FFFFFF' : theme.mutedText} />
                  <Text style={[styles.timeSlotText, { color: isSelected ? '#FFFFFF' : theme.text }]}>
                    {s.time}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 4. PATIENT PROFILE SELECTION */}
        <View style={[styles.sectionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>4. Consultation For</Text>
          <View style={styles.patientChipsRow}>
            <TouchableOpacity
              style={[
                styles.patientChip,
                {
                  backgroundColor: selectedPatientName === patient.name ? (theme.mint || '#E7F4ED') : theme.background,
                  borderColor: selectedPatientName === patient.name ? (theme.primaryDark || '#347C65') : theme.border,
                },
              ]}
              onPress={() => setSelectedPatientName(patient.name)}
            >
              <User size={14} color={selectedPatientName === patient.name ? (theme.primaryDark || '#347C65') : theme.text} />
              <Text
                style={[
                  styles.patientChipText,
                  { color: selectedPatientName === patient.name ? (theme.primaryDark || '#347C65') : theme.text },
                ]}
              >
                Myself ({patient.name.split(' ')[0]})
              </Text>
            </TouchableOpacity>

            {familyMembers.map((fam) => (
              <TouchableOpacity
                key={fam.id}
                style={[
                  styles.patientChip,
                  {
                    backgroundColor: selectedPatientName === fam.name ? (theme.mint || '#E7F4ED') : theme.background,
                    borderColor: selectedPatientName === fam.name ? (theme.primaryDark || '#347C65') : theme.border,
                  },
                ]}
                onPress={() => setSelectedPatientName(fam.name)}
              >
                <User size={14} color={selectedPatientName === fam.name ? (theme.primaryDark || '#347C65') : theme.text} />
                <Text
                  style={[
                    styles.patientChipText,
                    { color: selectedPatientName === fam.name ? (theme.primaryDark || '#347C65') : theme.text },
                  ]}
                >
                  {fam.name} ({fam.relationship})
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.reasonWrap}>
            <Text style={[styles.reasonLabel, { color: theme.mutedText }]}>Chief Complaint / Symptoms:</Text>
            <TextInput
              value={reason}
              onChangeText={setReason}
              placeholder="Describe your symptoms or reason for visit..."
              placeholderTextColor={theme.mutedText}
              style={[styles.reasonInput, { color: theme.text, borderColor: theme.border }]}
              multiline
            />
          </View>
        </View>

        {/* 5. SUMMARY & FEE BREAKDOWN */}
        <View style={[styles.sectionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>5. Fee Breakdown</Text>
          <View style={styles.feeBreakdown}>
            <View style={styles.feeRow}>
              <Text style={[styles.feeRowLabel, { color: theme.mutedText }]}>Doctor Consultation Fee</Text>
              <Text style={[styles.feeRowVal, { color: theme.text }]}>₹{doctor.consultationFee}</Text>
            </View>
            <View style={styles.feeRow}>
              <Text style={[styles.feeRowLabel, { color: theme.mutedText }]}>CareConnect Platform Fee</Text>
              <Text style={[styles.feeRowVal, { color: theme.text }]}>₹{platformFee}</Text>
            </View>
            <View style={[styles.feeDivider, { backgroundColor: theme.border }]} />
            <View style={styles.feeRow}>
              <Text style={[styles.feeTotalLabel, { color: theme.text }]}>Total Payable (Demo)</Text>
              <Text style={[styles.feeTotalVal, { color: theme.primaryDark || theme.primary }]}>₹{totalFee}</Text>
            </View>
          </View>

          <View style={[styles.demoNoteBox, { backgroundColor: theme.background }]}>
            <Info size={14} color={theme.mutedText} />
            <Text style={[styles.demoNoteText, { color: theme.mutedText }]}>
              No payment processing in Phase 1 prototype. Slot is reserved instantly in local demo state.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* STICKY BOTTOM CONFIRMATION BUTTON */}
      <View style={[styles.bottomBar, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
        <View>
          <Text style={[styles.bottomTotal, { color: theme.text }]}>₹{totalFee}</Text>
          <Text style={[styles.bottomSub, { color: theme.mutedText }]}>
            {selectedDate} • {selectedTime}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.confirmBtn, { backgroundColor: theme.primary }]}
          onPress={handleConfirmBooking}
          disabled={isSubmitting}
        >
          <Text style={styles.confirmBtnText}>
            {isSubmitting ? 'Confirming...' : 'Confirm Appointment'}
          </Text>
          <ChevronRight size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 14,
    paddingBottom: 110,
  },
  doctorHeader: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  docAvatar: {
    width: 60,
    height: 60,
    borderRadius: 14,
  },
  docTexts: {
    flex: 1,
    gap: 2,
  },
  docName: {
    fontWeight: '700',
  },
  docSpec: {
    fontSize: 12,
    fontWeight: '600',
  },
  docExp: {
    fontSize: 11,
  },
  sectionCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  modeOptions: {
    gap: 8,
  },
  modeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  modeOptionTexts: {
    flex: 1,
  },
  modeOptionTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  modeOptionSub: {
    fontSize: 11,
  },
  datesScroll: {
    gap: 8,
  },
  dateBox: {
    width: 68,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    gap: 4,
  },
  dateBoxLabel: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  dateBoxDay: {
    fontSize: 13,
    fontWeight: '700',
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeSlotPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  timeSlotText: {
    fontSize: 12,
    fontWeight: '600',
  },
  patientChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  patientChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  patientChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  reasonWrap: {
    gap: 6,
    marginTop: 4,
  },
  reasonLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  reasonInput: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    fontSize: 13,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  feeBreakdown: {
    gap: 8,
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  feeRowLabel: {
    fontSize: 12,
  },
  feeRowVal: {
    fontSize: 13,
    fontWeight: '600',
  },
  feeDivider: {
    height: 1,
  },
  feeTotalLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  feeTotalVal: {
    fontSize: 16,
    fontWeight: '800',
  },
  demoNoteBox: {
    flexDirection: 'row',
    gap: 8,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  demoNoteText: {
    fontSize: 11,
    flex: 1,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomTotal: {
    fontSize: 18,
    fontWeight: '800',
  },
  bottomSub: {
    fontSize: 11,
  },
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});
