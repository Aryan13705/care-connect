import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  MapPin,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Plus,
} from 'lucide-react-native';
import { useDoctor } from '../src/context/DoctorContext';

export default function AppointmentCalendarScreen() {
  const router = useRouter();
  const { theme, appointments } = useDoctor();

  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
  const [selectedDayIndex, setSelectedDayIndex] = useState(1); // Wed Nov 11

  const weekDays = [
    { name: 'Tue', dateNum: 10, fullDate: '2026-11-10' },
    { name: 'Wed', dateNum: 11, fullDate: '2026-11-11' },
    { name: 'Thu', dateNum: 12, fullDate: '2026-11-12' },
    { name: 'Fri', dateNum: 13, fullDate: '2026-11-13' },
    { name: 'Sat', dateNum: 14, fullDate: '2026-11-14' },
    { name: 'Mon', dateNum: 16, fullDate: '2026-11-16' },
  ];

  const currentSelectedDate = weekDays[selectedDayIndex].fullDate;

  const daySlots = [
    { time: '09:00 AM', status: 'Available' },
    { time: '09:30 AM', status: 'Available' },
    {
      time: '10:30 AM',
      status: 'Booked',
      patientName: 'Aryan Jaiswal',
      mode: 'video',
      reason: 'Routine cardiac health review',
      appointmentId: appointments[0]?.id || 'apt-001',
    },
    { time: '11:30 AM', status: 'Available' },
    { time: '01:00 PM', status: 'Break Period' },
    {
      time: '04:00 PM',
      status: 'Booked',
      patientName: 'Sunita Sharma',
      mode: 'in-person',
      reason: 'Hypertension follow-up',
      appointmentId: appointments[1]?.id || 'apt-002',
    },
    { time: '05:00 PM', status: 'Available' },
    { time: '05:30 PM', status: 'Available' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* HEADER CONTROLS */}
      <View style={[styles.controlHeader, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <View style={styles.viewToggleGroup}>
          <TouchableOpacity
            style={[
              styles.viewToggleBtn,
              {
                backgroundColor: viewMode === 'day' ? (theme.primaryDark || '#116C64') : theme.background,
                borderColor: theme.border,
              },
            ]}
            onPress={() => setViewMode('day')}
          >
            <Text
              style={[
                styles.viewToggleText,
                { color: viewMode === 'day' ? '#FFFFFF' : theme.text },
              ]}
            >
              Day View
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.viewToggleBtn,
              {
                backgroundColor: viewMode === 'week' ? (theme.primaryDark || '#116C64') : theme.background,
                borderColor: theme.border,
              },
            ]}
            onPress={() => setViewMode('week')}
          >
            <Text
              style={[
                styles.viewToggleText,
                { color: viewMode === 'week' ? '#FFFFFF' : theme.text },
              ]}
            >
              Week View
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.monthLabelRow}>
          <Text style={[styles.monthLabel, { color: theme.text }]}>November 2026</Text>
        </View>
      </View>

      {/* WEEK STRIP */}
      <View style={[styles.weekStrip, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        {weekDays.map((d, index) => {
          const isSelected = selectedDayIndex === index;
          return (
            <TouchableOpacity
              key={d.fullDate}
              style={[
                styles.dayPill,
                {
                  backgroundColor: isSelected ? (theme.primaryDark || '#116C64') : theme.background,
                  borderColor: theme.border,
                },
              ]}
              onPress={() => setSelectedDayIndex(index)}
            >
              <Text style={[styles.dayName, { color: isSelected ? '#FFFFFF' : theme.mutedText }]}>
                {d.name}
              </Text>
              <Text style={[styles.dayNum, { color: isSelected ? '#FFFFFF' : theme.text }]}>
                {d.dateNum}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* SLOTS TIMELINE */}
      <ScrollView contentContainerStyle={styles.timelineScroll} showsVerticalScrollIndicator={false}>
        <View style={styles.timelineHeader}>
          <Text style={[styles.timelineDateTitle, { color: theme.text }]}>
            Schedule for {weekDays[selectedDayIndex].name}, {weekDays[selectedDayIndex].dateNum} Nov 2026
          </Text>
          <View style={styles.demoTag}>
            <ShieldCheck size={11} color="#059669" />
            <Text style={styles.demoTagText}>Demo Calendar Engine</Text>
          </View>
        </View>

        <View style={styles.slotsContainer}>
          {daySlots.map((slot, i) => {
            if (slot.status === 'Break Period') {
              return (
                <View key={i} style={[styles.breakCard, { borderColor: theme.border }]}>
                  <Text style={[styles.breakText, { color: theme.mutedText }]}>
                    {slot.time} • Lunch & Clinical Charting Break
                  </Text>
                </View>
              );
            }

            if (slot.status === 'Booked') {
              return (
                <TouchableOpacity
                  key={i}
                  style={[styles.bookedCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
                  onPress={() => router.push(`/appointment/${slot.appointmentId}`)}
                  activeOpacity={0.8}
                >
                  <View style={styles.slotTimeCol}>
                    <Text style={[styles.slotTimeText, { color: theme.text }]}>{slot.time}</Text>
                    <View style={styles.modeTag}>
                      {slot.mode === 'video' ? <Video size={11} color="#168B80" /> : <MapPin size={11} color="#168B80" />}
                      <Text style={styles.modeTagText}>{slot.mode === 'video' ? 'Video' : 'Clinic'}</Text>
                    </View>
                  </View>

                  <View style={[styles.bookedDivider, { backgroundColor: theme.primary }]} />

                  <View style={styles.bookedDetails}>
                    <Text style={[styles.bookedPatient, { color: theme.text }]}>{slot.patientName}</Text>
                    <Text style={[styles.bookedReason, { color: theme.mutedText }]} numberOfLines={1}>
                      {slot.reason}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            }

            return (
              <View
                key={i}
                style={[styles.availableSlotRow, { backgroundColor: theme.surface, borderColor: theme.border }]}
              >
                <View style={styles.availableLeft}>
                  <Clock size={14} color={theme.mutedText} />
                  <Text style={[styles.availableTime, { color: theme.text }]}>{slot.time}</Text>
                </View>
                <View style={styles.availableRight}>
                  <Text style={[styles.openTag, { color: theme.primaryDark || theme.primary }]}>
                    Open Slot
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  controlHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewToggleGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  viewToggleBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  viewToggleText: {
    fontSize: 12,
    fontWeight: '600',
  },
  monthLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  weekStrip: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  dayPill: {
    width: 48,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    gap: 2,
  },
  dayName: {
    fontSize: 10,
    fontWeight: '600',
  },
  dayNum: {
    fontSize: 15,
    fontWeight: '800',
  },
  timelineScroll: {
    padding: 16,
    gap: 12,
    paddingBottom: 40,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timelineDateTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  demoTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  demoTagText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#059669',
  },
  slotsContainer: {
    gap: 10,
  },
  bookedCard: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    gap: 12,
  },
  slotTimeCol: {
    alignItems: 'center',
    gap: 4,
    minWidth: 64,
  },
  slotTimeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  modeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  modeTagText: {
    fontSize: 9,
    color: '#168B80',
    fontWeight: '700',
  },
  bookedDivider: {
    width: 3,
    height: 36,
    borderRadius: 2,
  },
  bookedDetails: {
    flex: 1,
    gap: 2,
  },
  bookedPatient: {
    fontSize: 14,
    fontWeight: '700',
  },
  bookedReason: {
    fontSize: 12,
  },
  breakCard: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  breakText: {
    fontSize: 11,
    fontWeight: '500',
  },
  availableSlotRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  availableLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  availableTime: {
    fontSize: 12,
    fontWeight: '600',
  },
  availableRight: {},
  openTag: {
    fontSize: 11,
    fontWeight: '700',
  },
});
