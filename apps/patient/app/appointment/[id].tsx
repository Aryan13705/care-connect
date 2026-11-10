import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  FileText,
  AlertTriangle,
  Building,
  Phone,
} from 'lucide-react-native';
import { usePatient } from '../../src/context/PatientContext';

export default function AppointmentDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme, appointments, cancelAppointment, seniorMode } = usePatient();

  const appointment = appointments.find((a) => a.id === id || a.bookingReference === id) || appointments[0];

  const handleCancel = () => {
    cancelAppointment(appointment.id);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* STATUS & REFERENCE HEADER */}
        <View style={[styles.headerCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.headerTop}>
            <View>
              <Text style={[styles.refLabel, { color: theme.mutedText }]}>Booking Reference</Text>
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

        {/* DOCTOR CARD */}
        <View style={[styles.sectionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Doctor Information</Text>
          <View style={styles.docRow}>
            <Image source={{ uri: appointment.doctorAvatar }} style={styles.docAvatar} />
            <View style={styles.docTexts}>
              <Text style={[styles.docName, { color: theme.text, fontSize: seniorMode ? 18 : 16 }]}>
                {appointment.doctorName}
              </Text>
              <Text style={[styles.docSpec, { color: theme.primaryDark || theme.primary }]}>
                {appointment.doctorSpeciality}
              </Text>
              <Text style={[styles.docClinic, { color: theme.mutedText }]}>{appointment.doctorClinic}</Text>
            </View>
          </View>
        </View>

        {/* CONSULTATION SCHEDULE */}
        <View style={[styles.sectionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Consultation Schedule</Text>
          <View style={styles.gridInfo}>
            <View style={styles.gridItem}>
              <Calendar size={16} color={theme.primaryDark || '#347C65'} />
              <View>
                <Text style={[styles.gridLabel, { color: theme.mutedText }]}>Scheduled Date</Text>
                <Text style={[styles.gridVal, { color: theme.text }]}>{appointment.date}</Text>
              </View>
            </View>

            <View style={styles.gridItem}>
              <Clock size={16} color={theme.primaryDark || '#347C65'} />
              <View>
                <Text style={[styles.gridLabel, { color: theme.mutedText }]}>Time Slot</Text>
                <Text style={[styles.gridVal, { color: theme.text }]}>{appointment.time}</Text>
              </View>
            </View>

            <View style={styles.gridItem}>
              {appointment.mode === 'video' ? <Video size={16} color="#168B80" /> : <MapPin size={16} color="#168B80" />}
              <View>
                <Text style={[styles.gridLabel, { color: theme.mutedText }]}>Mode</Text>
                <Text style={[styles.gridVal, { color: theme.text }]}>
                  {appointment.mode === 'video' ? 'Virtual Telehealth Video' : 'In-Clinic Outpatient'}
                </Text>
              </View>
            </View>

            <View style={styles.gridItem}>
              <Building size={16} color={theme.primaryDark || '#347C65'} />
              <View>
                <Text style={[styles.gridLabel, { color: theme.mutedText }]}>Patient</Text>
                <Text style={[styles.gridVal, { color: theme.text }]}>
                  {appointment.patientName} ({appointment.patientGender}, {appointment.patientAge}y)
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* REASON FOR VISIT */}
        <View style={[styles.sectionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Reason for Consultation</Text>
          <Text style={[styles.reasonText, { color: theme.text }]}>{appointment.reasonForVisit}</Text>

          {appointment.consultationNotes && (
            <View style={[styles.notesBox, { backgroundColor: theme.background }]}>
              <Text style={[styles.notesHeading, { color: theme.mutedText }]}>Consultation Summary Notes:</Text>
              <Text style={[styles.notesContent, { color: theme.text }]}>{appointment.consultationNotes}</Text>
            </View>
          )}
        </View>

        {/* PAYMENT SUMMARY */}
        <View style={[styles.sectionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Payment & Fee Record</Text>
          <View style={styles.feeLine}>
            <Text style={[styles.feeLineLabel, { color: theme.mutedText }]}>Consultation Fee</Text>
            <Text style={[styles.feeLineVal, { color: theme.text }]}>₹{appointment.consultationFee}</Text>
          </View>
          <View style={styles.feeLine}>
            <Text style={[styles.feeLineLabel, { color: theme.mutedText }]}>Platform Fee (Demo)</Text>
            <Text style={[styles.feeLineVal, { color: theme.text }]}>₹{appointment.platformFee}</Text>
          </View>
          <View style={[styles.feeDivider, { backgroundColor: theme.border }]} />
          <View style={styles.feeLine}>
            <Text style={[styles.feeTotalLabel, { color: theme.text }]}>Total Amount</Text>
            <Text style={[styles.feeTotalVal, { color: theme.primaryDark || theme.primary }]}>₹{appointment.totalFee}</Text>
          </View>
        </View>
      </ScrollView>

      {/* FOOTER ACTIONS */}
      <View style={[styles.footerBar, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
        {appointment.status === 'upcoming' && (
          <>
            {appointment.mode === 'video' && (
              <TouchableOpacity
                style={[styles.enterRoomBtn, { backgroundColor: theme.primary }]}
                onPress={() => router.push(`/consultation/${appointment.id}`)}
              >
                <Video size={16} color="#FFFFFF" />
                <Text style={styles.enterRoomText}>Enter Video Room (Demo)</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.cancelBtn, { borderColor: '#FECACA', backgroundColor: '#FEF2F2' }]}
              onPress={handleCancel}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </>
        )}

        {appointment.status === 'completed' && (
          <TouchableOpacity
            style={[styles.enterRoomBtn, { backgroundColor: theme.primary }]}
            onPress={() => router.push(`/prescription/${appointment.id}`)}
          >
            <FileText size={16} color="#FFFFFF" />
            <Text style={styles.enterRoomText}>Digital Prescription</Text>
          </TouchableOpacity>
        )}

        {appointment.status === 'cancelled' && (
          <TouchableOpacity
            style={[styles.enterRoomBtn, { backgroundColor: theme.primary }]}
            onPress={() => router.push(`/booking/${appointment.doctorId}`)}
          >
            <Calendar size={16} color="#FFFFFF" />
            <Text style={styles.enterRoomText}>Re-book Consultation</Text>
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
  headerCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  refLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
  },
  refVal: {
    fontSize: 16,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  sectionCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  docRow: {
    flexDirection: 'row',
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
    fontSize: 13,
    fontWeight: '600',
  },
  docClinic: {
    fontSize: 11,
  },
  gridInfo: {
    gap: 10,
  },
  gridItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  gridLabel: {
    fontSize: 10,
  },
  gridVal: {
    fontSize: 13,
    fontWeight: '600',
  },
  reasonText: {
    fontSize: 13,
    lineHeight: 18,
  },
  notesBox: {
    padding: 10,
    borderRadius: 8,
    gap: 4,
    marginTop: 4,
  },
  notesHeading: {
    fontSize: 11,
    fontWeight: '600',
  },
  notesContent: {
    fontSize: 13,
    lineHeight: 18,
  },
  feeLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  feeLineLabel: {
    fontSize: 12,
  },
  feeLineVal: {
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
  footerBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    padding: 14,
    flexDirection: 'row',
    gap: 10,
  },
  enterRoomBtn: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 10,
  },
  enterRoomText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  cancelBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  cancelBtnText: {
    color: '#DC2626',
    fontWeight: '600',
    fontSize: 13,
  },
});
