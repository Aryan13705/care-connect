import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Award,
  Globe,
  MapPin,
  ShieldCheck,
  Building,
  Sliders,
  TrendingUp,
  Settings,
  HelpCircle,
  Edit3,
  ChevronRight,
  Check,
  X,
} from 'lucide-react-native';
import { useDoctor } from '../../src/context/DoctorContext';

export default function DoctorProfileScreen() {
  const router = useRouter();
  const { theme, doctor, updateDoctorProfile } = useDoctor();

  const [editOpen, setEditOpen] = useState(false);
  const [feeInput, setFeeInput] = useState(doctor.consultationFee.toString());
  const [clinicInput, setClinicInput] = useState(doctor.clinicAddress);

  const handleSave = () => {
    updateDoctorProfile({
      consultationFee: parseInt(feeInput) || 800,
      clinicAddress: clinicInput,
    });
    setEditOpen(false);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. CLINICAL HEADER CARD */}
      <View style={[styles.profileCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={styles.topRow}>
          <Image source={{ uri: doctor.avatarUrl }} style={styles.doctorAvatar} />
          <View style={styles.headerTexts}>
            <View style={styles.verifiedBadge}>
              <ShieldCheck size={12} color="#059669" />
              <Text style={styles.verifiedText}>Verified Practitioner (Demo)</Text>
            </View>
            <Text style={[styles.doctorName, { color: theme.text }]}>{doctor.name}</Text>
            <Text style={[styles.doctorTitle, { color: theme.primaryDark || theme.primary }]}>
              {doctor.title}
            </Text>
            <Text style={[styles.doctorQual, { color: theme.mutedText }]}>{doctor.qualification}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.editBtn, { borderColor: theme.border, backgroundColor: theme.background }]}
          onPress={() => setEditOpen(true)}
        >
          <Edit3 size={14} color={theme.text} />
          <Text style={[styles.editBtnText, { color: theme.text }]}>Edit Clinical Details</Text>
        </TouchableOpacity>
      </View>

      {/* 2. CREDENTIALS & PRACTICE DETAILS */}
      <View style={[styles.detailsCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Practice Credentials</Text>

        <View style={styles.detailRow}>
          <ShieldCheck size={16} color={theme.primaryDark || '#116C64'} />
          <View style={styles.detailTexts}>
            <Text style={[styles.detailLabel, { color: theme.mutedText }]}>Council Registration</Text>
            <Text style={[styles.detailVal, { color: theme.text }]}>
              {doctor.registrationNumber} • {doctor.registrationCouncil}
            </Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <Building size={16} color={theme.primaryDark || '#116C64'} />
          <View style={styles.detailTexts}>
            <Text style={[styles.detailLabel, { color: theme.mutedText }]}>Primary Clinic Facility</Text>
            <Text style={[styles.detailVal, { color: theme.text }]}>{doctor.clinicAddress}</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <Award size={16} color={theme.primaryDark || '#116C64'} />
          <View style={styles.detailTexts}>
            <Text style={[styles.detailLabel, { color: theme.mutedText }]}>Clinical Experience</Text>
            <Text style={[styles.detailVal, { color: theme.text }]}>{doctor.experienceYears} Years Active Practice</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <Globe size={16} color={theme.primaryDark || '#116C64'} />
          <View style={styles.detailTexts}>
            <Text style={[styles.detailLabel, { color: theme.mutedText }]}>Consultation Languages</Text>
            <Text style={[styles.detailVal, { color: theme.text }]}>{doctor.languages.join(', ')}</Text>
          </View>
        </View>
      </View>

      {/* 3. QUICK NAVIGATION */}
      <View style={[styles.menuCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <TouchableOpacity
          style={styles.menuRow}
          onPress={() => router.push('/availability')}
        >
          <View style={[styles.menuIcon, { backgroundColor: theme.accent || '#E3F3F0' }]}>
            <Sliders size={18} color={theme.primaryDark || '#116C64'} />
          </View>
          <View style={styles.menuTexts}>
            <Text style={[styles.menuTitle, { color: theme.text }]}>Availability & Working Hours</Text>
            <Text style={[styles.menuSub, { color: theme.mutedText }]}>Manage consultation days, slots & fee</Text>
          </View>
          <ChevronRight size={18} color={theme.mutedText} />
        </TouchableOpacity>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <TouchableOpacity
          style={styles.menuRow}
          onPress={() => router.push('/earnings')}
        >
          <View style={[styles.menuIcon, { backgroundColor: '#ECFDF5' }]}>
            <TrendingUp size={18} color="#059669" />
          </View>
          <View style={styles.menuTexts}>
            <Text style={[styles.menuTitle, { color: theme.text }]}>Earnings & Consultation Payouts</Text>
            <Text style={[styles.menuSub, { color: theme.mutedText }]}>View ₹1,24,800 monthly estimate & ledger</Text>
          </View>
          <ChevronRight size={18} color={theme.mutedText} />
        </TouchableOpacity>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <TouchableOpacity
          style={styles.menuRow}
          onPress={() => router.push('/settings')}
        >
          <View style={[styles.menuIcon, { backgroundColor: '#F1F5F9' }]}>
            <Settings size={18} color="#475569" />
          </View>
          <View style={styles.menuTexts}>
            <Text style={[styles.menuTitle, { color: theme.text }]}>Practice Settings & Dark Theme</Text>
            <Text style={[styles.menuSub, { color: theme.mutedText }]}>App preferences & notification toggles</Text>
          </View>
          <ChevronRight size={18} color={theme.mutedText} />
        </TouchableOpacity>
      </View>

      {/* EDIT MODAL */}
      <Modal visible={editOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: theme.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Edit Clinical Details</Text>
              <TouchableOpacity onPress={() => setEditOpen(false)}>
                <X size={20} color={theme.mutedText} />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.mutedText }]}>Consultation Fee (₹)</Text>
              <TextInput
                value={feeInput}
                onChangeText={setFeeInput}
                keyboardType="numeric"
                style={[styles.input, { color: theme.text, borderColor: theme.border }]}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.mutedText }]}>Clinic Address</Text>
              <TextInput
                value={clinicInput}
                onChangeText={setClinicInput}
                style={[styles.input, { color: theme.text, borderColor: theme.border }]}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.cancelBtn, { borderColor: theme.border }]}
                onPress={() => setEditOpen(false)}
              >
                <Text style={[styles.cancelBtnText, { color: theme.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveBtn, { backgroundColor: theme.primary }]}
                onPress={handleSave}
              >
                <Check size={16} color="#FFFFFF" />
                <Text style={styles.saveBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  profileCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 14,
  },
  topRow: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
  },
  doctorAvatar: {
    width: 72,
    height: 72,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#168B80',
  },
  headerTexts: {
    flex: 1,
    gap: 2,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#065F46',
  },
  doctorName: {
    fontSize: 18,
    fontWeight: '800',
  },
  doctorTitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  doctorQual: {
    fontSize: 11,
  },
  editBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
  },
  editBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  detailsCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 14,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  detailTexts: {
    flex: 1,
    gap: 2,
  },
  detailLabel: {
    fontSize: 11,
  },
  detailVal: {
    fontSize: 13,
    fontWeight: '600',
  },
  menuCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 8,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    gap: 12,
  },
  menuIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuTexts: {
    flex: 1,
    gap: 2,
  },
  menuTitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  menuSub: {
    fontSize: 11,
  },
  divider: {
    height: 1,
    marginHorizontal: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalBox: {
    width: '100%',
    borderRadius: 18,
    padding: 20,
    gap: 14,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  formGroup: {
    gap: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  cancelBtnText: {
    fontWeight: '600',
  },
  saveBtn: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
