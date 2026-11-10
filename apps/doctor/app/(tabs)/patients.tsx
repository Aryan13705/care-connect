import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Search,
  User,
  AlertTriangle,
  ChevronRight,
  Calendar,
  FileText,
  ShieldCheck,
} from 'lucide-react-native';
import { useDoctor } from '../../src/context/DoctorContext';

export default function DoctorPatientsScreen() {
  const router = useRouter();
  const { theme, patients } = useDoctor();

  const [searchQuery, setSearchQuery] = useState('');

  const filtered = patients.filter((p) => {
    return (
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.chronicConditions.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* SEARCH HEADER */}
      <View style={[styles.searchBox, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <Search size={16} color={theme.mutedText} />
        <TextInput
          placeholder="Search by patient name, condition..."
          placeholderTextColor={theme.mutedText}
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={[styles.searchInput, { color: theme.text }]}
        />
      </View>

      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerInfo}>
          <Text style={[styles.headerCount, { color: theme.mutedText }]}>
            {filtered.length} Registered Patients
          </Text>
          <View style={styles.demoTag}>
            <ShieldCheck size={11} color="#059669" />
            <Text style={styles.demoTagText}>Demo Patient Registry</Text>
          </View>
        </View>

        {filtered.map((patient) => (
          <TouchableOpacity
            key={patient.id}
            style={[styles.patientCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
            onPress={() => router.push(`/patient/${patient.id}`)}
            activeOpacity={0.8}
          >
            <View style={styles.topRow}>
              <Image source={{ uri: patient.avatarUrl }} style={styles.patientAvatar} />
              <View style={styles.patientMain}>
                <Text style={[styles.patientName, { color: theme.text }]}>{patient.name}</Text>
                <Text style={[styles.demographics, { color: theme.mutedText }]}>
                  {patient.age} yrs • {patient.gender} • Blood: {patient.bloodGroup}
                </Text>
                <Text style={[styles.phoneText, { color: theme.mutedText }]}>{patient.phone}</Text>
              </View>
              <ChevronRight size={18} color={theme.mutedText} />
            </View>

            {/* CHRONIC CONDITIONS & ALLERGIES */}
            <View style={styles.tagsRow}>
              {patient.chronicConditions.map((cond) => (
                <View key={cond} style={[styles.condTag, { backgroundColor: theme.accent || '#E3F3F0' }]}>
                  <Text style={[styles.condTagText, { color: theme.primaryDark || '#116C64' }]}>{cond}</Text>
                </View>
              ))}

              {patient.allergies.map((allergy) => (
                <View key={allergy} style={styles.allergyTag}>
                  <AlertTriangle size={10} color="#DC2626" />
                  <Text style={styles.allergyTagText}>{allergy}</Text>
                </View>
              ))}
            </View>

            <View style={[styles.bottomInfo, { borderTopColor: theme.border }]}>
              <Text style={[styles.lastVisit, { color: theme.mutedText }]}>
                Last Consult: <Text style={{ color: theme.text, fontWeight: '600' }}>10 Nov 2026</Text>
              </Text>
              <TouchableOpacity
                style={[styles.viewProfileBtn, { backgroundColor: theme.primary }]}
                onPress={() => router.push(`/patient/${patient.id}`)}
              >
                <Text style={styles.viewProfileText}>Clinical Chart</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
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
  listContent: {
    padding: 16,
    gap: 12,
    paddingBottom: 40,
  },
  headerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerCount: {
    fontSize: 12,
    fontWeight: '600',
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
  patientCard: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 10,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  patientAvatar: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  patientMain: {
    flex: 1,
    gap: 2,
  },
  patientName: {
    fontSize: 15,
    fontWeight: '700',
  },
  demographics: {
    fontSize: 12,
  },
  phoneText: {
    fontSize: 11,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  condTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  condTagText: {
    fontSize: 11,
    fontWeight: '600',
  },
  allergyTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  allergyTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#991B1B',
  },
  bottomInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: 8,
  },
  lastVisit: {
    fontSize: 11,
  },
  viewProfileBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  viewProfileText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
});
