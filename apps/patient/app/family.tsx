import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Users,
  Plus,
  ShieldCheck,
  Heart,
  Droplet,
  FileText,
  X,
  Check,
  Calendar,
} from 'lucide-react-native';
import { usePatient } from '../src/context/PatientContext';
import { FamilyMember } from '@careconnect/types';

export default function FamilyHealthScreen() {
  const router = useRouter();
  const { theme, familyMembers, addFamilyMember, seniorMode } = usePatient();

  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState<FamilyMember['relationship']>('Mother');
  const [age, setAge] = useState('50');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Female');
  const [bloodGroup, setBloodGroup] = useState('B+');
  const [allergiesText, setAllergiesText] = useState('None');

  const relationships: Array<FamilyMember['relationship']> = [
    'Mother',
    'Father',
    'Spouse',
    'Child',
    'Sibling',
    'Other',
  ];

  const handleAddMember = async () => {
    if (!name.trim()) return;
    await addFamilyMember({
      name: name.trim(),
      relationship,
      age: parseInt(age) || 30,
      gender,
      bloodGroup,
      allergies: allergiesText ? [allergiesText] : [],
      avatarUrl:
        gender === 'Female'
          ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face'
          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    });

    setName('');
    setModalOpen(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* HEADER HERO */}
        <View style={[styles.headerHero, { backgroundColor: theme.mint || '#E7F4ED', borderColor: theme.border }]}>
          <View style={styles.headerHeroTexts}>
            <Text style={[styles.heroHeading, { fontSize: seniorMode ? 22 : 18 }]}>
              Family Health Hub
            </Text>
            <Text style={styles.heroSub}>
              Manage consultations, prescriptions, and health summaries for your dependents in one unified place.
            </Text>
          </View>
        </View>

        {/* LIST OF FAMILY MEMBERS */}
        <View style={styles.membersSection}>
          <View style={styles.sectionTop}>
            <Text style={[styles.sectionHeading, { color: theme.text }]}>
              Dependent Members ({familyMembers.length})
            </Text>
            <TouchableOpacity
              style={[styles.addMemberBtn, { backgroundColor: theme.primary }]}
              onPress={() => setModalOpen(true)}
            >
              <Plus size={16} color="#FFFFFF" />
              <Text style={styles.addMemberBtnText}>Add Member</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.membersList}>
            {familyMembers.map((member) => (
              <View
                key={member.id}
                style={[styles.memberCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
              >
                <View style={styles.memberTop}>
                  <Image source={{ uri: member.avatarUrl }} style={styles.memberAvatar} />
                  <View style={styles.memberTexts}>
                    <View style={styles.memberNameRow}>
                      <Text style={[styles.memberName, { color: theme.text, fontSize: seniorMode ? 17 : 15 }]}>
                        {member.name}
                      </Text>
                      <View style={[styles.relBadge, { backgroundColor: theme.mint || '#E7F4ED' }]}>
                        <Text style={[styles.relBadgeText, { color: theme.primaryDark || '#347C65' }]}>
                          {member.relationship}
                        </Text>
                      </View>
                    </View>

                    <Text style={[styles.memberDemographics, { color: theme.mutedText }]}>
                      {member.age} yrs • {member.gender} • Blood: {member.bloodGroup}
                    </Text>

                    <View style={styles.consentRow}>
                      <ShieldCheck size={13} color="#059669" />
                      <Text style={styles.consentText}>Guardian Consent Active (Demo)</Text>
                    </View>
                  </View>
                </View>

                {member.allergies && member.allergies.length > 0 && (
                  <View style={[styles.allergyBox, { backgroundColor: theme.background }]}>
                    <Text style={[styles.allergyLabel, { color: theme.mutedText }]}>Allergies: </Text>
                    <Text style={[styles.allergyVal, { color: theme.text }]}>{member.allergies.join(', ')}</Text>
                  </View>
                )}

                <View style={styles.memberActionsRow}>
                  <TouchableOpacity
                    style={[styles.bookForBtn, { backgroundColor: theme.primary }]}
                    onPress={() => router.push('/(tabs)/doctors')}
                  >
                    <Calendar size={14} color="#FFFFFF" />
                    <Text style={styles.bookForBtnText}>Book Consultation</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.recordsBtn, { borderColor: theme.border }]}
                    onPress={() => router.push('/(tabs)/records')}
                  >
                    <FileText size={14} color={theme.text} />
                    <Text style={[styles.recordsBtnText, { color: theme.text }]}>Records</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* ADD MEMBER MODAL */}
      <Modal visible={modalOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: theme.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Add Family Member</Text>
              <TouchableOpacity onPress={() => setModalOpen(false)}>
                <X size={20} color={theme.mutedText} />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.mutedText }]}>Full Name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="e.g. Ramesh Jaiswal"
                placeholderTextColor={theme.mutedText}
                style={[styles.input, { color: theme.text, borderColor: theme.border }]}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.mutedText }]}>Relationship</Text>
              <View style={styles.relChipsGrid}>
                {relationships.map((rel) => (
                  <TouchableOpacity
                    key={rel}
                    style={[
                      styles.relChip,
                      {
                        backgroundColor: relationship === rel ? (theme.primaryDark || '#347C65') : theme.background,
                        borderColor: theme.border,
                      },
                    ]}
                    onPress={() => setRelationship(rel)}
                  >
                    <Text
                      style={[
                        styles.relChipText,
                        { color: relationship === rel ? '#FFFFFF' : theme.text },
                      ]}
                    >
                      {rel}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={[styles.label, { color: theme.mutedText }]}>Age</Text>
                <TextInput
                  value={age}
                  onChangeText={setAge}
                  keyboardType="numeric"
                  style={[styles.input, { color: theme.text, borderColor: theme.border }]}
                />
              </View>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={[styles.label, { color: theme.mutedText }]}>Blood Group</Text>
                <TextInput
                  value={bloodGroup}
                  onChangeText={setBloodGroup}
                  style={[styles.input, { color: theme.text, borderColor: theme.border }]}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.mutedText }]}>Allergies (Optional)</Text>
              <TextInput
                value={allergiesText}
                onChangeText={setAllergiesText}
                placeholder="e.g. Penicillin, Pollen"
                placeholderTextColor={theme.mutedText}
                style={[styles.input, { color: theme.text, borderColor: theme.border }]}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalCancel, { borderColor: theme.border }]}
                onPress={() => setModalOpen(false)}
              >
                <Text style={[styles.modalCancelText, { color: theme.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalSave, { backgroundColor: theme.primary }]}
                onPress={handleAddMember}
              >
                <Check size={16} color="#FFFFFF" />
                <Text style={styles.modalSaveText}>Add Member</Text>
              </TouchableOpacity>
            </View>
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
  scrollContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  headerHero: {
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
  },
  headerHeroTexts: {
    gap: 6,
  },
  heroHeading: {
    fontWeight: '800',
    color: '#1C3E33',
  },
  heroSub: {
    fontSize: 13,
    color: '#4B6359',
    lineHeight: 18,
  },
  membersSection: {
    gap: 12,
  },
  sectionTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
  },
  addMemberBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  addMemberBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  membersList: {
    gap: 12,
  },
  memberCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  memberTop: {
    flexDirection: 'row',
    gap: 12,
  },
  memberAvatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  memberTexts: {
    flex: 1,
    gap: 3,
  },
  memberNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  memberName: {
    fontWeight: '700',
  },
  relBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  relBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  memberDemographics: {
    fontSize: 12,
  },
  consentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  consentText: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '600',
  },
  allergyBox: {
    flexDirection: 'row',
    padding: 8,
    borderRadius: 8,
  },
  allergyLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  allergyVal: {
    fontSize: 11,
    fontWeight: '600',
  },
  memberActionsRow: {
    flexDirection: 'row',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
  },
  bookForBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 8,
  },
  bookForBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  recordsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  recordsBtnText: {
    fontWeight: '600',
    fontSize: 12,
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
    gap: 12,
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
  relChipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  relChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  relChipText: {
    fontSize: 11,
    fontWeight: '600',
  },
  formRow: {
    flexDirection: 'row',
    gap: 10,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  modalCancel: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 13,
    fontWeight: '600',
  },
  modalSave: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
  },
  modalSaveText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
