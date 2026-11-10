import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  ChevronRight,
  Search,
  FileEdit,
  Check,
  FileText,
} from 'lucide-react-native';
import { useDoctor } from '../../src/context/DoctorContext';
import { AppointmentStatus } from '@careconnect/types';

export default function DoctorAppointmentsScreen() {
  const router = useRouter();
  const { theme, appointments, updateAppointmentStatus } = useDoctor();

  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = appointments.filter((a) => {
    const matchesTab = activeTab === 'all' ? true : a.status === activeTab;
    const matchesQuery =
      !searchQuery ||
      a.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.bookingReference.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesQuery;
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* SEARCH BAR */}
      <View style={[styles.searchBox, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <Search size={16} color={theme.mutedText} />
        <TextInput
          placeholder="Search by patient name or reference..."
          placeholderTextColor={theme.mutedText}
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={[styles.searchInput, { color: theme.text }]}
        />
      </View>

      {/* FILTER TABS */}
      <View style={[styles.tabBar, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        {[
          { id: 'all', label: 'All' },
          { id: 'upcoming', label: 'Upcoming' },
          { id: 'completed', label: 'Completed' },
          { id: 'cancelled', label: 'Cancelled' },
        ].map((tab) => {
          const count =
            tab.id === 'all'
              ? appointments.length
              : appointments.filter((a) => a.status === tab.id).length;
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tabBtn,
                isActive && { borderBottomColor: theme.primaryDark || theme.primary, borderBottomWidth: 3 },
              ]}
              onPress={() => setActiveTab(tab.id as any)}
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
                {tab.label} ({count})
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* APPOINTMENT LIST */}
      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Calendar size={44} color={theme.mutedText} />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>No appointments found</Text>
            <Text style={[styles.emptySub, { color: theme.mutedText }]}>
              There are no {activeTab !== 'all' ? activeTab : ''} consultations matching your filter.
            </Text>
          </View>
        ) : (
          filtered.map((apt) => (
            <View
              key={apt.id}
              style={[styles.aptCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
            >
              <View style={styles.cardHeader}>
                <View style={styles.refGroup}>
                  <Text style={[styles.refCode, { color: theme.mutedText }]}>{apt.bookingReference}</Text>
                  <View style={styles.demoTag}>
                    <Text style={styles.demoTagText}>Demo</Text>
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

              <View style={styles.patientRow}>
                <View style={styles.patientTexts}>
                  <Text style={[styles.patientName, { color: theme.text }]}>{apt.patientName}</Text>
                  <Text style={[styles.patientDemographics, { color: theme.mutedText }]}>
                    {apt.patientAge} years • {apt.patientGender}
                  </Text>
                  <View style={styles.modeRow}>
                    {apt.mode === 'video' ? <Video size={13} color="#168B80" /> : <MapPin size={13} color="#168B80" />}
                    <Text style={styles.modeLabel}>
                      {apt.mode === 'video' ? 'Virtual Video Consult' : 'Clinic OPD Consult'}
                    </Text>
                  </View>
                </View>

                <View style={[styles.timeScheduleBox, { backgroundColor: theme.background }]}>
                  <Text style={[styles.dateVal, { color: theme.text }]}>{apt.date}</Text>
                  <Text style={[styles.timeVal, { color: theme.primaryDark || theme.primary }]}>{apt.time}</Text>
                </View>
              </View>

              <Text style={[styles.reasonSnippet, { color: theme.mutedText }]} numberOfLines={1}>
                <Text style={{ fontWeight: '600', color: theme.text }}>Complaint: </Text>
                {apt.reasonForVisit}
              </Text>

              {/* ACTION BUTTONS */}
              <View style={styles.actionsRow}>
                {apt.status === 'upcoming' && (
                  <>
                    {apt.mode === 'video' && (
                      <TouchableOpacity
                        style={[styles.primaryBtn, { backgroundColor: theme.primary }]}
                        onPress={() => router.push(`/consultation/${apt.id}`)}
                      >
                        <Video size={14} color="#FFFFFF" />
                        <Text style={styles.primaryBtnText}>Start Consultation</Text>
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity
                      style={[styles.actionOutlineBtn, { borderColor: theme.border }]}
                      onPress={() => router.push(`/consultation-notes/${apt.id}`)}
                    >
                      <FileEdit size={14} color={theme.text} />
                      <Text style={[styles.actionOutlineText, { color: theme.text }]}>Clinical Notes</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.markDoneBtn, { borderColor: '#A7F3D0', backgroundColor: '#ECFDF5' }]}
                      onPress={() => updateAppointmentStatus(apt.id, 'completed')}
                    >
                      <Check size={14} color="#059669" />
                      <Text style={styles.markDoneText}>Complete</Text>
                    </TouchableOpacity>
                  </>
                )}

                {apt.status === 'completed' && (
                  <TouchableOpacity
                    style={[styles.primaryBtn, { backgroundColor: theme.primary }]}
                    onPress={() => router.push(`/prescription-composer/${apt.id}`)}
                  >
                    <FileText size={14} color="#FFFFFF" />
                    <Text style={styles.primaryBtnText}>Prescription Draft</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={[styles.detailsBtn, { borderColor: theme.border }]}
                  onPress={() => router.push(`/appointment/${apt.id}`)}
                >
                  <ChevronRight size={18} color={theme.text} />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    paddingVertical: 0,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 12,
  },
  listContent: {
    padding: 16,
    gap: 12,
    paddingBottom: 40,
  },
  aptCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  refGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  refCode: {
    fontSize: 11,
    fontFamily: 'monospace',
    fontWeight: '600',
  },
  demoTag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  demoTagText: {
    fontSize: 9,
    color: '#64748B',
    fontWeight: '700',
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
  patientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  patientTexts: {
    gap: 2,
    flex: 1,
  },
  patientName: {
    fontSize: 15,
    fontWeight: '700',
  },
  patientDemographics: {
    fontSize: 12,
  },
  modeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  modeLabel: {
    fontSize: 11,
    color: '#168B80',
    fontWeight: '600',
  },
  timeScheduleBox: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'flex-end',
  },
  dateVal: {
    fontSize: 11,
  },
  timeVal: {
    fontSize: 12,
    fontWeight: '700',
  },
  reasonSnippet: {
    fontSize: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
  },
  primaryBtn: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 8,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  actionOutlineBtn: {
    flex: 1.5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  actionOutlineText: {
    fontSize: 12,
    fontWeight: '600',
  },
  markDoneBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  markDoneText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  detailsBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    paddingVertical: 60,
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  emptySub: {
    fontSize: 12,
    textAlign: 'center',
  },
});
