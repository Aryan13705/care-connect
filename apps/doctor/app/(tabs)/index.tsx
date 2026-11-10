import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  Video,
  MapPin,
  ChevronRight,
  TrendingUp,
  FileEdit,
  Sliders,
  Bell,
  ShieldCheck,
} from 'lucide-react-native';
import { useDoctor } from '../../src/context/DoctorContext';

export default function DoctorDashboardScreen() {
  const router = useRouter();
  const { theme, doctor, appointments, availability, updateAvailability } = useDoctor();

  const todayAppointments = appointments.filter((a) => a.status === 'upcoming');
  const completedAppointments = appointments.filter((a) => a.status === 'completed');

  const toggleAvailability = () => {
    updateAvailability({ videoEnabled: !availability.videoEnabled });
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. CLINICAL HEADER */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.profileTrigger}
          onPress={() => router.push('/(tabs)/profile')}
          activeOpacity={0.8}
        >
          <Image source={{ uri: doctor.avatarUrl }} style={styles.avatar} />
          <View>
            <View style={styles.demoTag}>
              <ShieldCheck size={11} color="#059669" />
              <Text style={styles.demoTagText}>Verified Clinical Workspace</Text>
            </View>
            <Text style={[styles.greetingTitle, { color: theme.text }]}>
              Good morning, {doctor.name.split(' ')[1]}
            </Text>
            <Text style={[styles.doctorSpeciality, { color: theme.mutedText }]}>
              {doctor.title}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
          onPress={() => router.push('/(tabs)/messages')}
        >
          <Bell size={20} color={theme.text} />
          <View style={[styles.badge, { backgroundColor: theme.danger || '#EF4444' }]}>
            <Text style={styles.badgeText}>2</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* 2. AVAILABILITY STATUS TOGGLE */}
      <View style={[styles.statusCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={styles.statusLeft}>
          <View
            style={[
              styles.pulseDot,
              { backgroundColor: availability.videoEnabled ? '#10B981' : '#F59E0B' },
            ]}
          />
          <View>
            <Text style={[styles.statusTitle, { color: theme.text }]}>
              {availability.videoEnabled ? 'Accepting Telehealth Consultations' : 'Telehealth Paused'}
            </Text>
            <Text style={[styles.statusSub, { color: theme.mutedText }]}>
              Working Hours: {availability.startTime} - {availability.endTime}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.toggleBtn,
            {
              backgroundColor: availability.videoEnabled ? (theme.primaryDark || '#116C64') : theme.background,
              borderColor: theme.border,
            },
          ]}
          onPress={toggleAvailability}
        >
          <Text
            style={[
              styles.toggleBtnText,
              { color: availability.videoEnabled ? '#FFFFFF' : theme.text },
            ]}
          >
            {availability.videoEnabled ? 'Active' : 'Offline'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 3. CLINICAL METRICS GRID */}
      <View style={styles.metricsGrid}>
        <View style={[styles.metricCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={[styles.metricIconWrap, { backgroundColor: theme.accent || '#E3F3F0' }]}>
            <Calendar size={18} color={theme.primaryDark || '#116C64'} />
          </View>
          <Text style={[styles.metricNumber, { color: theme.text }]}>{todayAppointments.length + 3}</Text>
          <Text style={[styles.metricLabel, { color: theme.mutedText }]}>Today's Schedule</Text>
        </View>

        <View style={[styles.metricCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={[styles.metricIconWrap, { backgroundColor: '#EEF2FF' }]}>
            <Users size={18} color="#4338CA" />
          </View>
          <Text style={[styles.metricNumber, { color: theme.text }]}>142</Text>
          <Text style={[styles.metricLabel, { color: theme.mutedText }]}>Total Patients</Text>
        </View>

        <View style={[styles.metricCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={[styles.metricIconWrap, { backgroundColor: '#ECFDF5' }]}>
            <CheckCircle2 size={18} color="#059669" />
          </View>
          <Text style={[styles.metricNumber, { color: theme.text }]}>{completedAppointments.length + 12}</Text>
          <Text style={[styles.metricLabel, { color: theme.mutedText }]}>Completed</Text>
        </View>

        <View style={[styles.metricCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={[styles.metricIconWrap, { backgroundColor: '#FFFBEB' }]}>
            <Clock size={18} color="#D97706" />
          </View>
          <Text style={[styles.metricNumber, { color: theme.text }]}>{todayAppointments.length}</Text>
          <Text style={[styles.metricLabel, { color: theme.mutedText }]}>Upcoming</Text>
        </View>
      </View>

      {/* 4. QUICK ACTIONS */}
      <View style={styles.sectionWrap}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Clinical Actions</Text>
        <View style={styles.quickActionsRow}>
          <TouchableOpacity
            style={[styles.quickAction, { backgroundColor: theme.surface, borderColor: theme.border }]}
            onPress={() => router.push('/calendar')}
          >
            <Calendar size={20} color={theme.primaryDark || '#116C64'} />
            <Text style={[styles.quickActionText, { color: theme.text }]}>Calendar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickAction, { backgroundColor: theme.surface, borderColor: theme.border }]}
            onPress={() => router.push('/availability')}
          >
            <Sliders size={20} color={theme.primaryDark || '#116C64'} />
            <Text style={[styles.quickActionText, { color: theme.text }]}>Slots & Fee</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickAction, { backgroundColor: theme.surface, borderColor: theme.border }]}
            onPress={() => router.push('/(tabs)/patients')}
          >
            <Users size={20} color={theme.primaryDark || '#116C64'} />
            <Text style={[styles.quickActionText, { color: theme.text }]}>Patients</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickAction, { backgroundColor: theme.surface, borderColor: theme.border }]}
            onPress={() => router.push('/earnings')}
          >
            <TrendingUp size={20} color={theme.primaryDark || '#116C64'} />
            <Text style={[styles.quickActionText, { color: theme.text }]}>Earnings</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 5. TODAY'S SCHEDULE TIMELINE */}
      <View style={styles.sectionWrap}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Today's Appointments</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/appointments')}>
            <Text style={[styles.seeAllText, { color: theme.primaryDark || theme.primary }]}>View all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.scheduleList}>
          {todayAppointments.map((apt) => (
            <View
              key={apt.id}
              style={[styles.appointmentItem, { backgroundColor: theme.surface, borderColor: theme.border }]}
            >
              <View style={styles.aptTimeCol}>
                <Text style={[styles.aptTimeVal, { color: theme.text }]}>{apt.time}</Text>
                <View style={styles.modeIndicator}>
                  {apt.mode === 'video' ? <Video size={12} color="#168B80" /> : <MapPin size={12} color="#168B80" />}
                  <Text style={styles.modeIndicatorText}>
                    {apt.mode === 'video' ? 'Video' : 'Clinic'}
                  </Text>
                </View>
              </View>

              <View style={styles.aptPatientInfo}>
                <Text style={[styles.patientName, { color: theme.text }]}>{apt.patientName}</Text>
                <Text style={[styles.patientDetails, { color: theme.mutedText }]}>
                  {apt.patientAge}y, {apt.patientGender} • Ref: {apt.bookingReference}
                </Text>
                <Text style={[styles.patientReason, { color: theme.mutedText }]} numberOfLines={1}>
                  "{apt.reasonForVisit}"
                </Text>
              </View>

              <View style={styles.aptActions}>
                {apt.mode === 'video' ? (
                  <TouchableOpacity
                    style={[styles.startConsultBtn, { backgroundColor: theme.primary }]}
                    onPress={() => router.push(`/consultation/${apt.id}`)}
                  >
                    <Video size={13} color="#FFFFFF" />
                    <Text style={styles.startConsultText}>Launch Room</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[styles.startConsultBtn, { backgroundColor: theme.primary }]}
                    onPress={() => router.push(`/consultation-notes/${apt.id}`)}
                  >
                    <FileEdit size={13} color="#FFFFFF" />
                    <Text style={styles.startConsultText}>Add Notes</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={[styles.detailsLink, { borderColor: theme.border }]}
                  onPress={() => router.push(`/appointment/${apt.id}`)}
                >
                  <ChevronRight size={16} color={theme.text} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  profileTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#168B80',
  },
  demoTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  demoTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
  },
  greetingTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  doctorSpeciality: {
    fontSize: 12,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 14,
    height: 14,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '800',
  },
  statusCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  pulseDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  statusSub: {
    fontSize: 11,
  },
  toggleBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  toggleBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metricCard: {
    width: '48%',
    flexGrow: 1,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 4,
  },
  metricIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  metricNumber: {
    fontSize: 20,
    fontWeight: '800',
  },
  metricLabel: {
    fontSize: 11,
  },
  sectionWrap: {
    gap: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '600',
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  quickAction: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    gap: 6,
  },
  quickActionText: {
    fontSize: 11,
    fontWeight: '600',
  },
  scheduleList: {
    gap: 10,
  },
  appointmentItem: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
    alignItems: 'center',
  },
  aptTimeCol: {
    alignItems: 'center',
    gap: 4,
    minWidth: 64,
  },
  aptTimeVal: {
    fontSize: 12,
    fontWeight: '700',
  },
  modeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  modeIndicatorText: {
    fontSize: 10,
    color: '#168B80',
    fontWeight: '600',
  },
  aptPatientInfo: {
    flex: 1,
    gap: 2,
  },
  patientName: {
    fontSize: 14,
    fontWeight: '700',
  },
  patientDetails: {
    fontSize: 11,
  },
  patientReason: {
    fontSize: 11,
    fontStyle: 'italic',
  },
  aptActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  startConsultBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  startConsultText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  detailsLink: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
