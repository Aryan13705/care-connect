import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  ChevronRight,
  FileText,
  AlertCircle,
  X,
  Check,
} from 'lucide-react-native';
import { usePatient } from '../../src/context/PatientContext';
import { Appointment, AppointmentStatus } from '@careconnect/types';

export default function MyAppointmentsScreen() {
  const router = useRouter();
  const { theme, appointments, cancelAppointment, rescheduleAppointment, seniorMode } = usePatient();
  const [activeTab, setActiveTab] = useState<AppointmentStatus>('upcoming');

  // Reschedule state modal
  const [rescheduleModalApt, setRescheduleModalApt] = useState<Appointment | null>(null);
  const [selectedDate, setSelectedDate] = useState('2026-11-18');
  const [selectedTime, setSelectedTime] = useState('11:00 AM');
  const [rescheduleSuccess, setRescheduleSuccess] = useState(false);

  const filteredAppointments = appointments.filter((a) => a.status === activeTab);

  const availableDates = [
    { label: 'Wed, 18 Nov', val: '2026-11-18' },
    { label: 'Thu, 19 Nov', val: '2026-11-19' },
    { label: 'Fri, 20 Nov', val: '2026-11-20' },
    { label: 'Mon, 23 Nov', val: '2026-11-23' },
  ];

  const availableTimes = ['09:30 AM', '11:00 AM', '02:30 PM', '04:00 PM', '05:30 PM'];

  const handleCancel = (apt: Appointment) => {
    // Directly cancel or show confirmation
    cancelAppointment(apt.id);
  };

  const handleRescheduleSubmit = async () => {
    if (!rescheduleModalApt) return;
    try {
      await rescheduleAppointment(rescheduleModalApt.id, selectedDate, selectedTime);
      setRescheduleSuccess(true);
      setTimeout(() => {
        setRescheduleSuccess(false);
        setRescheduleModalApt(null);
      }, 1200);
    } catch (err: any) {
      Alert.alert('Slot Unavailable', err.message || 'Please choose another slot');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* TABS HEADER */}
      <View style={[styles.tabBar, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        {(['upcoming', 'completed', 'cancelled'] as AppointmentStatus[]).map((tab) => {
          const count = appointments.filter((a) => a.status === tab).length;
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tabBtn,
                isActive && { borderBottomColor: theme.primaryDark || theme.primary, borderBottomWidth: 3 },
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: isActive ? (theme.primaryDark || theme.primary) : theme.mutedText,
                    fontWeight: isActive ? '700' : '500',
                  },
                ]}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)} ({count})
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* APPOINTMENTS LIST */}
      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {filteredAppointments.length === 0 ? (
          <View style={styles.emptyState}>
            <Calendar size={48} color={theme.mutedText} />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>No {activeTab} appointments</Text>
            <Text style={[styles.emptySubtitle, { color: theme.mutedText }]}>
              {activeTab === 'upcoming'
                ? "You don't have any scheduled consultations at the moment."
                : `No ${activeTab} consultation records found.`}
            </Text>
            {activeTab === 'upcoming' && (
              <TouchableOpacity
                style={[styles.bookNowBtn, { backgroundColor: theme.primary }]}
                onPress={() => router.push('/(tabs)/doctors')}
              >
                <Text style={styles.bookNowBtnText}>Find a Specialist</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filteredAppointments.map((apt) => (
            <View
              key={apt.id}
              style={[styles.aptCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
            >
              {/* Reference and Mode Header */}
              <View style={styles.cardHeader}>
                <View style={styles.refWrap}>
                  <Text style={[styles.refText, { color: theme.mutedText }]}>Ref: {apt.bookingReference}</Text>
                  <View style={styles.demoPill}>
                    <Text style={styles.demoPillText}>Demo</Text>
                  </View>
                </View>

                <View
                  style={[
                    styles.statusPill,
                    {
                      backgroundColor:
                        apt.status === 'upcoming'
                          ? '#D1FAE5'
                          : apt.status === 'completed'
                          ? '#E0E7FF'
                          : '#FEE2E2',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusPillText,
                      {
                        color:
                          apt.status === 'upcoming'
                            ? '#065F46'
                            : apt.status === 'completed'
                            ? '#3730A3'
                            : '#991B1B',
                      },
                    ]}
                  >
                    {apt.status.toUpperCase()}
                  </Text>
                </View>
              </View>

              {/* Doctor Details */}
              <View style={styles.doctorRow}>
                <Image source={{ uri: apt.doctorAvatar }} style={styles.docAvatar} />
                <View style={styles.docInfo}>
                  <Text style={[styles.docName, { color: theme.text, fontSize: seniorMode ? 17 : 15 }]}>
                    {apt.doctorName}
                  </Text>
                  <Text style={[styles.docSpec, { color: theme.mutedText }]}>{apt.doctorSpeciality}</Text>
                  <View style={styles.modeRow}>
                    {apt.mode === 'video' ? <Video size={13} color="#168B80" /> : <MapPin size={13} color="#168B80" />}
                    <Text style={styles.modeText}>
                      {apt.mode === 'video' ? 'Video Consultation' : 'In-Clinic Appointment'}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Schedule Box */}
              <View style={[styles.scheduleBox, { backgroundColor: theme.background, borderColor: theme.border }]}>
                <View style={styles.scheduleItem}>
                  <Calendar size={14} color={theme.mutedText} />
                  <Text style={[styles.scheduleText, { color: theme.text }]}>{apt.date}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.scheduleItem}>
                  <Clock size={14} color={theme.mutedText} />
                  <Text style={[styles.scheduleText, { color: theme.text }]}>{apt.time}</Text>
                </View>
              </View>

              {/* Patient Note/Reason */}
              <Text style={[styles.reasonText, { color: theme.mutedText }]} numberOfLines={2}>
                <Text style={{ fontWeight: '600', color: theme.text }}>Reason: </Text>
                {apt.reasonForVisit}
              </Text>

              {/* Action Buttons depending on status */}
              <View style={styles.actionRow}>
                {apt.status === 'upcoming' && (
                  <>
                    {apt.mode === 'video' && (
                      <TouchableOpacity
                        style={[styles.primaryActionBtn, { backgroundColor: theme.primary }]}
                        onPress={() => router.push(`/consultation/${apt.id}`)}
                      >
                        <Video size={15} color="#FFFFFF" />
                        <Text style={styles.primaryActionBtnText}>Enter Room (Demo)</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={[styles.secondaryActionBtn, { borderColor: theme.border, backgroundColor: theme.background }]}
                      onPress={() => setRescheduleModalApt(apt)}
                    >
                      <Text style={[styles.secondaryActionBtnText, { color: theme.text }]}>Reschedule</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.cancelBtn, { borderColor: '#FECACA', backgroundColor: '#FEF2F2' }]}
                      onPress={() => handleCancel(apt)}
                    >
                      <Text style={styles.cancelBtnText}>Cancel</Text>
                    </TouchableOpacity>
                  </>
                )}

                {apt.status === 'completed' && (
                  <>
                    <TouchableOpacity
                      style={[styles.primaryActionBtn, { backgroundColor: theme.primary }]}
                      onPress={() => router.push(`/prescription/${apt.id}`)}
                    >
                      <FileText size={15} color="#FFFFFF" />
                      <Text style={styles.primaryActionBtnText}>View Prescription</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.secondaryActionBtn, { borderColor: theme.border, backgroundColor: theme.background }]}
                      onPress={() => router.push(`/appointment/${apt.id}`)}
                    >
                      <Text style={[styles.secondaryActionBtnText, { color: theme.text }]}>Summary</Text>
                    </TouchableOpacity>
                  </>
                )}

                {apt.status === 'cancelled' && (
                  <TouchableOpacity
                    style={[styles.primaryActionBtn, { backgroundColor: theme.primary }]}
                    onPress={() => router.push(`/booking/${apt.doctorId}`)}
                  >
                    <Text style={styles.primaryActionBtnText}>Book Again</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={[styles.viewDetailsIconBtn, { borderColor: theme.border }]}
                  onPress={() => router.push(`/appointment/${apt.id}`)}
                >
                  <ChevronRight size={18} color={theme.text} />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* RESCHEDULE MODAL */}
      <Modal visible={!!rescheduleModalApt} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Reschedule Appointment</Text>
              <TouchableOpacity onPress={() => setRescheduleModalApt(null)}>
                <X size={20} color={theme.mutedText} />
              </TouchableOpacity>
            </View>

            {rescheduleSuccess ? (
              <View style={styles.rescheduleSuccessBox}>
                <Check size={40} color="#059669" />
                <Text style={styles.successTitle}>Rescheduled Successfully!</Text>
                <Text style={[styles.successSub, { color: theme.mutedText }]}>
                  New slot: {selectedDate} at {selectedTime}
                </Text>
              </View>
            ) : (
              <>
                <Text style={[styles.sectionSubtitle, { color: theme.mutedText }]}>
                  Select new date for {rescheduleModalApt?.doctorName}:
                </Text>
                <View style={styles.dateSelector}>
                  {availableDates.map((d) => (
                    <TouchableOpacity
                      key={d.val}
                      style={[
                        styles.dateChip,
                        {
                          backgroundColor: selectedDate === d.val ? theme.primary : theme.background,
                          borderColor: theme.border,
                        },
                      ]}
                      onPress={() => setSelectedDate(d.val)}
                    >
                      <Text
                        style={[
                          styles.dateChipText,
                          { color: selectedDate === d.val ? '#FFFFFF' : theme.text },
                        ]}
                      >
                        {d.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={[styles.sectionSubtitle, { color: theme.mutedText, marginTop: 12 }]}>
                  Select new time:
                </Text>
                <View style={styles.timeSelector}>
                  {availableTimes.map((t) => (
                    <TouchableOpacity
                      key={t}
                      style={[
                        styles.timeChip,
                        {
                          backgroundColor: selectedTime === t ? theme.primaryDark || '#347C65' : theme.background,
                          borderColor: theme.border,
                        },
                      ]}
                      onPress={() => setSelectedTime(t)}
                    >
                      <Text
                        style={[
                          styles.timeChipText,
                          { color: selectedTime === t ? '#FFFFFF' : theme.text },
                        ]}
                      >
                        {t}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={styles.modalFooter}>
                  <TouchableOpacity
                    style={[styles.modalCancelBtn, { borderColor: theme.border }]}
                    onPress={() => setRescheduleModalApt(null)}
                  >
                    <Text style={[styles.modalCancelText, { color: theme.text }]}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalConfirmBtn, { backgroundColor: theme.primary }]}
                    onPress={handleRescheduleSubmit}
                  >
                    <Text style={styles.modalConfirmText}>Confirm Reschedule</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 13,
  },
  listContent: {
    padding: 16,
    gap: 14,
    paddingBottom: 40,
  },
  aptCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  refWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  refText: {
    fontSize: 11,
    fontFamily: 'monospace',
    fontWeight: '600',
  },
  demoPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  demoPillText: {
    fontSize: 9,
    color: '#64748B',
    fontWeight: '600',
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '700',
  },
  doctorRow: {
    flexDirection: 'row',
    gap: 12,
  },
  docAvatar: {
    width: 54,
    height: 54,
    borderRadius: 14,
  },
  docInfo: {
    flex: 1,
    gap: 2,
  },
  docName: {
    fontWeight: '700',
  },
  docSpec: {
    fontSize: 12,
  },
  modeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  modeText: {
    fontSize: 11,
    color: '#168B80',
    fontWeight: '600',
  },
  scheduleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  divider: {
    width: 1,
    height: 12,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 12,
  },
  scheduleText: {
    fontSize: 12,
    fontWeight: '600',
  },
  reasonText: {
    fontSize: 12,
    lineHeight: 16,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
  },
  primaryActionBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 8,
  },
  primaryActionBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  secondaryActionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 8,
    borderWidth: 1,
  },
  secondaryActionBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cancelBtn: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 8,
    borderWidth: 1,
  },
  cancelBtnText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '600',
  },
  viewDetailsIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    paddingVertical: 60,
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  bookNowBtn: {
    marginTop: 12,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  bookNowBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    gap: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  sectionSubtitle: {
    fontSize: 12,
    fontWeight: '600',
  },
  dateSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dateChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
  },
  dateChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  timeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
  },
  timeChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 13,
    fontWeight: '600',
  },
  modalConfirmBtn: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalConfirmText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  rescheduleSuccessBox: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 8,
  },
  successTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#059669',
  },
  successSub: {
    fontSize: 12,
  },
});
