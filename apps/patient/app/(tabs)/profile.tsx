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
  User,
  Phone,
  Mail,
  MapPin,
  Globe,
  Heart,
  ShieldCheck,
  Settings,
  HelpCircle,
  Users,
  Edit2,
  ChevronRight,
  X,
  Check,
} from 'lucide-react-native';
import { usePatient } from '../../src/context/PatientContext';

export default function PatientProfileScreen() {
  const router = useRouter();
  const { theme, patient, updatePatientProfile, seniorMode } = usePatient();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [name, setName] = useState(patient.name);
  const [phone, setPhone] = useState(patient.phone);
  const [city, setCity] = useState(patient.city);
  const [preferredLanguage, setPreferredLanguage] = useState(patient.preferredLanguage);

  const handleSaveProfile = async () => {
    await updatePatientProfile({ name, phone, city, preferredLanguage });
    setEditModalOpen(false);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. PROFILE HEADER CARD */}
      <View style={[styles.profileCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={styles.avatarRow}>
          <Image source={{ uri: patient.avatarUrl }} style={styles.avatarLarge} />
          <View style={styles.headerDetails}>
            <View style={styles.nameAndBadge}>
              <Text style={[styles.userName, { color: theme.text, fontSize: seniorMode ? 22 : 18 }]}>
                {patient.name}
              </Text>
              <View style={styles.demoBadge}>
                <ShieldCheck size={12} color="#059669" />
                <Text style={styles.demoBadgeText}>Demo Patient</Text>
              </View>
            </View>
            <Text style={[styles.userDemographics, { color: theme.mutedText }]}>
              {patient.age} years • {patient.gender} • Blood Group: {patient.bloodGroup}
            </Text>
            <Text style={[styles.userCity, { color: theme.mutedText }]}>
              <MapPin size={12} color={theme.mutedText} /> {patient.city}, India
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.editBtn, { borderColor: theme.border, backgroundColor: theme.background }]}
          onPress={() => setEditModalOpen(true)}
        >
          <Edit2 size={14} color={theme.text} />
          <Text style={[styles.editBtnText, { color: theme.text }]}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* 2. CONTACT & PERSONAL DETAILS */}
      <View style={[styles.infoSection, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Contact Information</Text>

        <View style={styles.infoRow}>
          <Phone size={16} color={theme.mutedText} />
          <View style={styles.infoTexts}>
            <Text style={[styles.infoLabel, { color: theme.mutedText }]}>Phone Number</Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>{patient.phone}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Mail size={16} color={theme.mutedText} />
          <View style={styles.infoTexts}>
            <Text style={[styles.infoLabel, { color: theme.mutedText }]}>Email Address</Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>{patient.email}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Globe size={16} color={theme.mutedText} />
          <View style={styles.infoTexts}>
            <Text style={[styles.infoLabel, { color: theme.mutedText }]}>Preferred Language</Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>{patient.preferredLanguage}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Heart size={16} color="#EF4444" />
          <View style={styles.infoTexts}>
            <Text style={[styles.infoLabel, { color: theme.mutedText }]}>Emergency Contact</Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>
              {patient.emergencyContact.name} ({patient.emergencyContact.relationship}) — {patient.emergencyContact.phone}
            </Text>
          </View>
        </View>
      </View>

      {/* 3. QUICK NAVIGATION LINKS */}
      <View style={[styles.menuSection, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/family')}
          activeOpacity={0.7}
        >
          <View style={[styles.menuIconWrap, { backgroundColor: theme.mint || '#E7F4ED' }]}>
            <Users size={18} color={theme.primaryDark || '#347C65'} />
          </View>
          <View style={styles.menuTexts}>
            <Text style={[styles.menuTitle, { color: theme.text }]}>Family Health Management</Text>
            <Text style={[styles.menuSub, { color: theme.mutedText }]}>Manage 3 dependents and records</Text>
          </View>
          <ChevronRight size={18} color={theme.mutedText} />
        </TouchableOpacity>

        <View style={[styles.menuDivider, { backgroundColor: theme.border }]} />

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/settings')}
          activeOpacity={0.7}
        >
          <View style={[styles.menuIconWrap, { backgroundColor: '#F1F5F9' }]}>
            <Settings size={18} color="#475569" />
          </View>
          <View style={styles.menuTexts}>
            <Text style={[styles.menuTitle, { color: theme.text }]}>App Settings & Appearance</Text>
            <Text style={[styles.menuSub, { color: theme.mutedText }]}>Dark mode, accessibility & senior font</Text>
          </View>
          <ChevronRight size={18} color={theme.mutedText} />
        </TouchableOpacity>

        <View style={[styles.menuDivider, { backgroundColor: theme.border }]} />

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/support')}
          activeOpacity={0.7}
        >
          <View style={[styles.menuIconWrap, { backgroundColor: '#FEF3C7' }]}>
            <HelpCircle size={18} color="#B45309" />
          </View>
          <View style={styles.menuTexts}>
            <Text style={[styles.menuTitle, { color: theme.text }]}>Help, FAQs & Support</Text>
            <Text style={[styles.menuSub, { color: theme.mutedText }]}>Common queries & feedback</Text>
          </View>
          <ChevronRight size={18} color={theme.mutedText} />
        </TouchableOpacity>
      </View>

      {/* 4. FOOTER NOTE */}
      <View style={styles.footerWrap}>
        <Text style={[styles.footerText, { color: theme.mutedText }]}>
          CareConnect v1.0.0-demo • Phase 1 Prototype
        </Text>
        <Text style={[styles.footerSub, { color: theme.mutedText }]}>
          Logged in as Demonstration Patient profile
        </Text>
      </View>

      {/* EDIT PROFILE MODAL */}
      <Modal visible={editModalOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: theme.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Edit Profile (Local State)</Text>
              <TouchableOpacity onPress={() => setEditModalOpen(false)}>
                <X size={20} color={theme.mutedText} />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.inputLabel, { color: theme.mutedText }]}>Full Name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                style={[styles.inputField, { color: theme.text, borderColor: theme.border }]}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.inputLabel, { color: theme.mutedText }]}>Phone</Text>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                style={[styles.inputField, { color: theme.text, borderColor: theme.border }]}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.inputLabel, { color: theme.mutedText }]}>City</Text>
              <TextInput
                value={city}
                onChangeText={setCity}
                style={[styles.inputField, { color: theme.text, borderColor: theme.border }]}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.inputLabel, { color: theme.mutedText }]}>Preferred Language</Text>
              <TextInput
                value={preferredLanguage}
                onChangeText={setPreferredLanguage}
                style={[styles.inputField, { color: theme.text, borderColor: theme.border }]}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.cancelBtn, { borderColor: theme.border }]}
                onPress={() => setEditModalOpen(false)}
              >
                <Text style={[styles.cancelBtnText, { color: theme.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveBtn, { backgroundColor: theme.primary }]}
                onPress={handleSaveProfile}
              >
                <Check size={16} color="#FFFFFF" />
                <Text style={styles.saveBtnText}>Save Changes</Text>
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
    padding: 18,
    gap: 14,
  },
  avatarRow: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
  },
  avatarLarge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: '#58A88D',
  },
  headerDetails: {
    flex: 1,
    gap: 4,
  },
  nameAndBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  userName: {
    fontWeight: '700',
  },
  demoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  demoBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#065F46',
  },
  userDemographics: {
    fontSize: 12,
  },
  userCity: {
    fontSize: 12,
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
    fontSize: 13,
    fontWeight: '600',
  },
  infoSection: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 14,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  infoTexts: {
    flex: 1,
    gap: 2,
  },
  infoLabel: {
    fontSize: 11,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  menuSection: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    gap: 12,
  },
  menuIconWrap: {
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
  menuDivider: {
    height: 1,
    marginHorizontal: 10,
  },
  footerWrap: {
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  footerText: {
    fontSize: 11,
    fontWeight: '600',
  },
  footerSub: {
    fontSize: 11,
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
  inputLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  inputField: {
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
    fontSize: 13,
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
    fontSize: 13,
  },
});
