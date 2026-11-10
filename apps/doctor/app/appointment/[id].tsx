import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  FileEdit,
  FileText,
  ShieldCheck,
  User,
  AlertTriangle,
  ChevronRight,
  Check,
} from 'lucide-react-native';
import { useDoctor } from '../../src/context/DoctorContext';

export default function DoctorAppointmentDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme, appointments, updateAppointmentStatus } = useDoctor();

  const appointment =
    appointments.find((a) => a.id === id || a.bookingReference === id) || appointments[0];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* HEADER SUMMARY CARD */}
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.headerTop}>
            <View>
              <Text style={[styles.refLabel, { color: theme.mutedText }]}>Consultation Reference</Text>
              <Text style={[styles.refVal, { color: theme.text }]}>{appointment.bookingReference}</Text>
            </View>

            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    appointment.status === 'upcoming'
                      ? '#D1FAE5'
                      : appointment.status === 'completed'
                      ? '#E0E7FF'
                      : '#FEE2E2',
                },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  {
                    color:
                      appointment.status === 'upcoming'
                        ? '#065F46'
                        : appointment.status === 'completed'
                        ? '#3730A3'
                        : '#991B1B',
                  },
                ]}
              >
                {appointment.status.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        {/* PATIENT DEMOGRAPHICS & CLINICAL ALERTS */}
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Patient Clinical Profile</Text>

          <View style={styles.patientRow}>
            <View style={styles.patientTexts}>
              <Text style={[styles.patientName, { color: theme.text }]}>{appointment.patientName}</Text>
              <Text style={[styles.patientSub, { color: theme.mutedText }]}>
                {appointment.patientAge} years • {appointment.patientGender}
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.chartBtn, { backgroundColor: theme.accent || '#E3F3F0' }]}
              onPress={() => router.push(`/patient/${appointment.patientId}`)}
            >
              <Text style={[styles.chartBtnText, { color: theme.primaryDark || '#116C64' }]}>
                Full History
              </Text>
              <ChevronRight size={14} color={theme.primaryDark || '#116C64'} />
            </TouchableOpacity>
          </View>

          <View style={styles.consentAlert}>
            <ShieldCheck size={14} color="#059669" />
            <Text style={styles.consentAlertText}>
              Patient digital consent confirmed for this telemedicine session.
            </Text>
          </View>
        </View>

        {/* SCHEDULE & MODE */}
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Appointment Schedule</Text>

          <View style={styles.metaGrid}>
            <View style={styles.metaRow}>
              <Calendar size={16} color={theme.primaryDark || '#116C64'} />
              <View>
                <Text style={[styles.metaLabel, { color: theme.mutedText }]}>Date</Text>
                <Text style={[styles.metaVal, { color: theme.text }]}>{appointment.date}</Text>
              </View>
            </View>

            <View style={styles.metaRow}>
              <Clock size={16} color={theme.primaryDark || '#116C64'} />
              <View>
                <Text style={[styles.metaLabel, { color: theme.mutedText }]}>Slot</Text>
                <Text style={[styles.metaVal, { color: theme.text }]}>{appointment.time}</Text>
              </View>
            </View>

            <View style={styles.metaRow}>
              {appointment.mode === 'video' ? <Video size={16} color="#168B80" /> : <MapPin size={16} color="#168B80" />}
              <View>
                <Text style={[styles.metaLabel, { color: theme.mutedText }]}>Consultation Mode</Text>
                <Text style={[styles.metaVal, { color: theme.text }]}>
                  {appointment.mode === 'video' ? 'Virtual Telehealth Video' : 'In-Clinic OPD'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* REPORTED REASON FOR VISIT */}
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Patient-Reported Complaint</Text>
          <Text style={[styles.complaintText, { color: theme.text }]}>{appointment.reasonForVisit}</Text>

          {appointment.symptoms && (
            <View style={styles.symptomsWrap}>
              {appointment.symptoms.map((s) => (
                <View key={s} style={[styles.symptomPill, { backgroundColor: theme.background }]}>
                  <Text style={[styles.symptomPillText, { color: theme.text }]}>{s}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* FOOTER ACTIONS DOCK */}
      <View style={[styles.footerDock, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
        {appointment.status === 'upcoming' && (
          <>
            {appointment.mode === 'video' ? (
              <TouchableOpacity
                style={[styles.primaryAction, { backgroundColor: theme.primary }]}
                onPress={() => router.push(`/consultation/${appointment.id}`)}
              >
                <Video size={16} color="#FFFFFF" />
                <Text style={styles.primaryActionText}>Launch Room</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.primaryAction, { backgroundColor: theme.primary }]}
                onPress={() => router.push(`/consultation-notes/${appointment.id}`)}
              >
                <FileEdit size={16} color="#FFFFFF" />
                <Text style={styles.primaryActionText}>Consultation Notes</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.secondaryAction, { borderColor: theme.border }]}
              onPress={() => router.push(`/prescription-composer/${appointment.id}`)}
            >
              <FileText size={16} color={theme.text} />
              <Text style={[styles.secondaryActionText, { color: theme.text }]}>Prescription</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.completeAction, { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' }]}
              onPress={() => updateAppointmentStatus(appointment.id, 'completed')}
            >
              <Check size={16} color="#059669" />
            </TouchableOpacity>
          </>
        )}

        {appointment.status === 'completed' && (
          <TouchableOpacity
            style={[styles.primaryAction, { backgroundColor: theme.primary }]}
            onPress={() => router.push(`/prescription-composer/${appointment.id}`)}
          >
            <FileText size={16} color="#FFFFFF" />
            <Text style={styles.primaryActionText}>Edit / Review Prescription</Text>
          </TouchableOpacity>
        )}
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
    paddingBottom: 90,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  refLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
  },
  refVal: {
    fontSize: 15,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  patientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  patientTexts: {
    gap: 2,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '700',
  },
  patientSub: {
    fontSize: 12,
  },
  chartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  chartBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  consentAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    padding: 8,
    borderRadius: 8,
  },
  consentAlertText: {
    fontSize: 11,
    color: '#065F46',
    fontWeight: '500',
    flex: 1,
  },
  metaGrid: {
    gap: 10,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  metaLabel: {
    fontSize: 10,
  },
  metaVal: {
    fontSize: 13,
    fontWeight: '600',
  },
  complaintText: {
    fontSize: 13,
    lineHeight: 18,
  },
  symptomsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  symptomPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  symptomPillText: {
    fontSize: 11,
  },
  footerDock: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    padding: 14,
    flexDirection: 'row',
    gap: 8,
  },
  primaryAction: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 10,
  },
  primaryActionText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  secondaryAction: {
    flex: 1.5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  secondaryActionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  completeAction: {
    width: 44,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
