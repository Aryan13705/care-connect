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
  User,
  AlertTriangle,
  Heart,
  Droplet,
  FileText,
  Calendar,
  ShieldCheck,
  ChevronRight,
  Stethoscope,
} from 'lucide-react-native';
import { useDoctor } from '../../src/context/DoctorContext';

export default function DoctorPatientDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme, patients, prescriptions } = useDoctor();

  const patient = patients.find((p) => p.id === id) || patients[0];
  const patientPrescriptions = prescriptions.filter((p) => p.patientId === patient.id || p.patientName === patient.name);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. PATIENT HEADER */}
      <View style={[styles.headerCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={styles.topRow}>
          <Image source={{ uri: patient.avatarUrl }} style={styles.avatar} />
          <View style={styles.headerTexts}>
            <View style={styles.demoTag}>
              <ShieldCheck size={11} color="#059669" />
              <Text style={styles.demoTagText}>Demo Patient Registry</Text>
            </View>
            <Text style={[styles.patientName, { color: theme.text }]}>{patient.name}</Text>
            <Text style={[styles.patientSub, { color: theme.mutedText }]}>
              {patient.age} yrs • {patient.gender} • Blood Group: {patient.bloodGroup}
            </Text>
            <Text style={[styles.patientContact, { color: theme.mutedText }]}>
              {patient.phone} • {patient.city}
            </Text>
          </View>
        </View>

        <View style={styles.consentIndicator}>
          <ShieldCheck size={14} color="#059669" />
          <Text style={styles.consentText}>
            Medical records access authorized by patient under CareConnect Terms.
          </Text>
        </View>
      </View>

      {/* 2. CLINICAL ALERTS & CONDITIONS */}
      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>Clinical Alerts & Vitals</Text>

        <View style={styles.vitalsRow}>
          <View style={[styles.vitalBox, { backgroundColor: theme.background, borderColor: theme.border }]}>
            <Droplet size={16} color="#DC2626" />
            <Text style={[styles.vitalVal, { color: theme.text }]}>{patient.bloodGroup}</Text>
            <Text style={[styles.vitalLabel, { color: theme.mutedText }]}>Blood Group</Text>
          </View>
          <View style={[styles.vitalBox, { backgroundColor: theme.background, borderColor: theme.border }]}>
            <Heart size={16} color="#E11D48" />
            <Text style={[styles.vitalVal, { color: theme.text }]}>120/80</Text>
            <Text style={[styles.vitalLabel, { color: theme.mutedText }]}>Avg BP</Text>
          </View>
        </View>

        {patient.allergies.length > 0 && (
          <View style={styles.alertGroup}>
            <Text style={[styles.alertGroupLabel, { color: '#991B1B' }]}>Drug / Clinical Allergies:</Text>
            <View style={styles.tagWrap}>
              {patient.allergies.map((allergy) => (
                <View key={allergy} style={styles.allergyTag}>
                  <AlertTriangle size={12} color="#DC2626" />
                  <Text style={styles.allergyText}>{allergy}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.alertGroup}>
          <Text style={[styles.alertGroupLabel, { color: theme.mutedText }]}>Chronic Conditions:</Text>
          <View style={styles.tagWrap}>
            {patient.chronicConditions.map((cond) => (
              <View key={cond} style={[styles.condTag, { backgroundColor: theme.accent || '#E3F3F0' }]}>
                <Text style={[styles.condText, { color: theme.primaryDark || '#116C64' }]}>{cond}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* 3. PREVIOUS CONSULTATIONS & RX */}
      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>Prescriptions & Consultation History</Text>

        {patientPrescriptions.length === 0 ? (
          <Text style={[styles.emptyNote, { color: theme.mutedText }]}>
            No previous consultation records on file for this patient.
          </Text>
        ) : (
          patientPrescriptions.map((p) => (
            <View
              key={p.id}
              style={[styles.historyItem, { backgroundColor: theme.background, borderColor: theme.border }]}
            >
              <View style={styles.historyTop}>
                <View style={styles.historyHeaderInfo}>
                  <Stethoscope size={14} color={theme.primaryDark || '#116C64'} />
                  <Text style={[styles.historyDoc, { color: theme.text }]}>{p.doctorName}</Text>
                </View>
                <Text style={[styles.historyDate, { color: theme.mutedText }]}>{p.date}</Text>
              </View>

              <Text style={[styles.historyDiagnosis, { color: theme.text }]}>
                Diagnosis: <Text style={{ fontWeight: 'normal' }}>{p.diagnosis}</Text>
              </Text>

              <View style={styles.medsCountBadge}>
                <Text style={styles.medsCountText}>
                  {p.medications.length} Prescribed Medications (Sample)
                </Text>
              </View>
            </View>
          ))
        )}
      </View>

      {/* 4. EMERGENCY CONTACT */}
      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>Emergency Contact Details</Text>
        <Text style={[styles.contactName, { color: theme.text }]}>
          {patient.emergencyContact.name} ({patient.emergencyContact.relationship})
        </Text>
        <Text style={[styles.contactPhone, { color: theme.primaryDark || theme.primary }]}>
          {patient.emergencyContact.phone}
        </Text>
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
    gap: 14,
    paddingBottom: 40,
  },
  headerCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  topRow: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#168B80',
  },
  headerTexts: {
    flex: 1,
    gap: 2,
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
  patientName: {
    fontSize: 17,
    fontWeight: '700',
  },
  patientSub: {
    fontSize: 12,
  },
  patientContact: {
    fontSize: 11,
  },
  consentIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    padding: 8,
    borderRadius: 8,
  },
  consentText: {
    fontSize: 11,
    color: '#065F46',
    flex: 1,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  vitalsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  vitalBox: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    gap: 2,
  },
  vitalVal: {
    fontSize: 14,
    fontWeight: '800',
  },
  vitalLabel: {
    fontSize: 10,
  },
  alertGroup: {
    gap: 6,
  },
  alertGroupLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  allergyTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  allergyText: {
    color: '#991B1B',
    fontSize: 11,
    fontWeight: '700',
  },
  condTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  condText: {
    fontSize: 11,
    fontWeight: '600',
  },
  emptyNote: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  historyItem: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    gap: 6,
  },
  historyTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyHeaderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  historyDoc: {
    fontSize: 13,
    fontWeight: '700',
  },
  historyDate: {
    fontSize: 11,
  },
  historyDiagnosis: {
    fontSize: 12,
    fontWeight: '600',
  },
  medsCountBadge: {
    backgroundColor: '#F1F5F9',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  medsCountText: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },
  contactName: {
    fontSize: 13,
    fontWeight: '700',
  },
  contactPhone: {
    fontSize: 13,
    fontWeight: '600',
  },
});
