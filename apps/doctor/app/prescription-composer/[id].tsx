import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Plus,
  Trash2,
  FileCheck,
  Eye,
  Calendar,
  AlertTriangle,
  X,
  Check,
} from 'lucide-react-native';
import { useDoctor } from '../../src/context/DoctorContext';
import { Medication } from '@careconnect/types';

export default function DoctorPrescriptionComposerScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme, appointments, doctor, savePrescription } = useDoctor();

  const appointment =
    appointments.find((a) => a.id === id || a.bookingReference === id) || appointments[0];

  const [diagnosis, setDiagnosis] = useState('Stage 1 Hypertension & Sinus Tachycardia');
  const [clinicalNotes, setClinicalNotes] = useState(
    'Lifestyle management, 30 min daily brisk walk, restrict dietary sodium to <2g/day.'
  );
  const [followUpDate, setFollowUpDate] = useState('2026-12-10');

  const [medications, setMedications] = useState<Medication[]>([
    {
      id: 'med-01',
      name: 'Telmisartan 40mg',
      dosage: '1 tablet',
      frequency: 'Once daily (Morning after breakfast)',
      duration: '30 days',
      instructions: 'Take with full glass of water. Monitor morning BP.',
    },
    {
      id: 'med-02',
      name: 'CoQ10 + Omega-3 Softgel',
      dosage: '1 capsule',
      frequency: 'Once daily (Night after dinner)',
      duration: '30 days',
      instructions: 'Do not crush or chew.',
    },
  ]);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAddMedication = () => {
    const newMed: Medication = {
      id: `med-${Date.now()}`,
      name: '',
      dosage: '1 tablet',
      frequency: 'Once daily',
      duration: '14 days',
      instructions: '',
    };
    setMedications((prev) => [...prev, newMed]);
  };

  const handleRemoveMedication = (medId: string) => {
    if (medications.length <= 1) {
      Alert.alert('Required', 'A prescription must contain at least one medication entry.');
      return;
    }
    setMedications((prev) => prev.filter((m) => m.id !== medId));
  };

  const handleUpdateMed = (medId: string, field: keyof Medication, val: string) => {
    setMedications((prev) =>
      prev.map((m) => (m.id === medId ? { ...m, [field]: val } : m))
    );
  };

  const handleSaveDraft = async () => {
    await savePrescription({
      appointmentId: appointment.id,
      patientId: appointment.patientId,
      patientName: appointment.patientName,
      patientAge: appointment.patientAge,
      patientGender: appointment.patientGender,
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorSpeciality: doctor.specialityName,
      doctorRegistration: doctor.registrationNumber,
      clinicAddress: doctor.clinicAddress,
      date: new Date().toISOString().split('T')[0],
      diagnosis,
      clinicalNotes,
      medications,
      followUpDate,
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      Alert.alert('Prescription Recorded', 'Local draft prescription saved successfully.');
    }, 800);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* HEADER PATIENT SNAPSHOT */}
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.patientTop}>
            <View>
              <Text style={[styles.patientName, { color: theme.text }]}>{appointment.patientName}</Text>
              <Text style={[styles.patientSub, { color: theme.mutedText }]}>
                {appointment.patientAge}y, {appointment.patientGender} • Ref: {appointment.bookingReference}
              </Text>
            </View>
            <View style={styles.sampleStamp}>
              <Text style={styles.sampleStampText}>SAMPLE / DEMO DRAFT</Text>
            </View>
          </View>
        </View>

        {/* DIAGNOSIS & CLINICAL NOTES */}
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Clinical Diagnosis</Text>
          <TextInput
            value={diagnosis}
            onChangeText={setDiagnosis}
            style={[styles.input, { color: theme.text, borderColor: theme.border }]}
          />

          <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 8 }]}>Doctor Clinical Advice</Text>
          <TextInput
            value={clinicalNotes}
            onChangeText={setClinicalNotes}
            multiline
            style={[styles.textArea, { color: theme.text, borderColor: theme.border }]}
          />
        </View>

        {/* MEDICATIONS LIST */}
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.medsHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Medications ({medications.length})
            </Text>
            <TouchableOpacity
              style={[styles.addMedBtn, { backgroundColor: theme.primary }]}
              onPress={handleAddMedication}
            >
              <Plus size={14} color="#FFFFFF" />
              <Text style={styles.addMedBtnText}>Add Drug</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.medsList}>
            {medications.map((med, index) => (
              <View
                key={med.id}
                style={[styles.medEntry, { backgroundColor: theme.background, borderColor: theme.border }]}
              >
                <View style={styles.medEntryHeader}>
                  <Text style={[styles.medEntryNum, { color: theme.primaryDark || theme.primary }]}>
                    #{index + 1} Medication
                  </Text>
                  <TouchableOpacity onPress={() => handleRemoveMedication(med.id)}>
                    <Trash2 size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: theme.mutedText }]}>Medicine Name & Strength</Text>
                  <TextInput
                    value={med.name}
                    onChangeText={(val) => handleUpdateMed(med.id, 'name', val)}
                    placeholder="e.g. Amlodipine 5mg"
                    placeholderTextColor={theme.mutedText}
                    style={[styles.input, { color: theme.text, borderColor: theme.border }]}
                  />
                </View>

                <View style={styles.rowInputs}>
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={[styles.label, { color: theme.mutedText }]}>Dosage</Text>
                    <TextInput
                      value={med.dosage}
                      onChangeText={(val) => handleUpdateMed(med.id, 'dosage', val)}
                      style={[styles.input, { color: theme.text, borderColor: theme.border }]}
                    />
                  </View>
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={[styles.label, { color: theme.mutedText }]}>Duration</Text>
                    <TextInput
                      value={med.duration}
                      onChangeText={(val) => handleUpdateMed(med.id, 'duration', val)}
                      style={[styles.input, { color: theme.text, borderColor: theme.border }]}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: theme.mutedText }]}>Frequency & Timing</Text>
                  <TextInput
                    value={med.frequency}
                    onChangeText={(val) => handleUpdateMed(med.id, 'frequency', val)}
                    placeholder="e.g. 1-0-1 (After Meals)"
                    placeholderTextColor={theme.mutedText}
                    style={[styles.input, { color: theme.text, borderColor: theme.border }]}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: theme.mutedText }]}>Special Patient Instructions</Text>
                  <TextInput
                    value={med.instructions}
                    onChangeText={(val) => handleUpdateMed(med.id, 'instructions', val)}
                    placeholder="Take with warm water"
                    placeholderTextColor={theme.mutedText}
                    style={[styles.input, { color: theme.text, borderColor: theme.border }]}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* FOLLOW-UP DATE */}
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Recommended Review / Follow-Up</Text>
          <TextInput
            value={followUpDate}
            onChangeText={setFollowUpDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={theme.mutedText}
            style={[styles.input, { color: theme.text, borderColor: theme.border }]}
          />
        </View>
      </ScrollView>

      {/* FOOTER ACTIONS */}
      <View style={[styles.footerBar, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
        <TouchableOpacity
          style={[styles.previewBtn, { borderColor: theme.border }]}
          onPress={() => setPreviewOpen(true)}
        >
          <Eye size={16} color={theme.text} />
          <Text style={[styles.previewBtnText, { color: theme.text }]}>Preview Rx</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: theme.primary }]}
          onPress={handleSaveDraft}
        >
          <FileCheck size={16} color="#FFFFFF" />
          <Text style={styles.saveBtnText}>
            {savedSuccess ? 'Prescription Saved!' : 'Save Digital Prescription'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* DIGITAL PREVIEW MODAL */}
      <Modal visible={previewOpen} animationType="slide">
        <View style={[styles.modalCanvas, { backgroundColor: theme.background }]}>
          <View style={[styles.modalHeader, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
            <Text style={[styles.modalHeaderTitle, { color: theme.text }]}>Prescription Preview (Demo)</Text>
            <TouchableOpacity onPress={() => setPreviewOpen(false)}>
              <X size={22} color={theme.text} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.rxPreviewContent}>
            <View style={styles.watermarkStrip}>
              <AlertTriangle size={16} color="#DC2626" />
              <Text style={styles.watermarkStripText}>
                SAMPLE DEMONSTRATION • NOT VALID FOR MEDICAL DISPENSATION
              </Text>
            </View>

            <View style={[styles.rxCardPreview, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <View style={[styles.rxDocHeader, { borderBottomColor: theme.border }]}>
                <View>
                  <Text style={[styles.docPreviewName, { color: theme.text }]}>{doctor.name}</Text>
                  <Text style={[styles.docPreviewSpec, { color: theme.primaryDark || theme.primary }]}>
                    {doctor.specialityName} • {doctor.qualification}
                  </Text>
                  <Text style={[styles.docPreviewReg, { color: theme.mutedText }]}>
                    Reg: {doctor.registrationNumber} ({doctor.registrationCouncil})
                  </Text>
                </View>
                <Text style={[styles.rxSymbol, { color: theme.primaryDark || theme.primary }]}>℞</Text>
              </View>

              <View style={[styles.patDetailsBox, { backgroundColor: theme.background }]}>
                <Text style={[styles.patBoxText, { color: theme.text }]}>
                  Patient: <Text style={{ fontWeight: '700' }}>{appointment.patientName}</Text> ({appointment.patientAge}y, {appointment.patientGender})
                </Text>
                <Text style={[styles.patBoxDate, { color: theme.mutedText }]}>
                  Date: {new Date().toLocaleDateString()}
                </Text>
              </View>

              <View style={styles.rxSection}>
                <Text style={[styles.rxSectionTitle, { color: theme.mutedText }]}>Diagnosis:</Text>
                <Text style={[styles.rxSectionVal, { color: theme.text }]}>{diagnosis}</Text>
              </View>

              <View style={styles.rxSection}>
                <Text style={[styles.rxSectionTitle, { color: theme.mutedText }]}>Prescribed Medications:</Text>
                {medications.map((m, idx) => (
                  <View key={m.id} style={[styles.previewMedRow, { borderColor: theme.border }]}>
                    <Text style={[styles.prevMedName, { color: theme.text }]}>
                      {idx + 1}. {m.name || 'Medication Name'} ({m.dosage})
                    </Text>
                    <Text style={[styles.prevMedMeta, { color: theme.mutedText }]}>
                      Frequency: {m.frequency} • Duration: {m.duration}
                    </Text>
                    {m.instructions ? (
                      <Text style={[styles.prevMedInst, { color: theme.mutedText }]}>
                        Instructions: {m.instructions}
                      </Text>
                    ) : null}
                  </View>
                ))}
              </View>

              {followUpDate ? (
                <View style={[styles.prevFollowUp, { backgroundColor: theme.accent || '#E3F3F0' }]}>
                  <Calendar size={14} color={theme.primaryDark || '#116C64'} />
                  <Text style={[styles.prevFollowUpText, { color: theme.primaryDark || '#116C64' }]}>
                    Review on: {followUpDate}
                  </Text>
                </View>
              ) : null}
            </View>
          </ScrollView>

          <View style={[styles.modalFooter, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
            <TouchableOpacity
              style={[styles.closePreviewBtn, { backgroundColor: theme.primary }]}
              onPress={() => setPreviewOpen(false)}
            >
              <Text style={styles.closePreviewBtnText}>Close Preview</Text>
            </TouchableOpacity>
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
    gap: 14,
    paddingBottom: 90,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 10,
  },
  patientTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  patientName: {
    fontSize: 16,
    fontWeight: '700',
  },
  patientSub: {
    fontSize: 12,
  },
  sampleStamp: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  sampleStampText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#991B1B',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 13,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  medsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addMedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addMedBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  medsList: {
    gap: 12,
  },
  medEntry: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  medEntryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  medEntryNum: {
    fontSize: 12,
    fontWeight: '700',
  },
  inputGroup: {
    gap: 4,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 10,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
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
  previewBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  previewBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
  saveBtn: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 10,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  modalCanvas: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  modalHeaderTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  rxPreviewContent: {
    padding: 16,
    gap: 14,
  },
  watermarkStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEE2E2',
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center',
  },
  watermarkStripText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#991B1B',
  },
  rxCardPreview: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 14,
  },
  rxDocHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  docPreviewName: {
    fontSize: 16,
    fontWeight: '800',
  },
  docPreviewSpec: {
    fontSize: 12,
    fontWeight: '600',
  },
  docPreviewReg: {
    fontSize: 11,
  },
  rxSymbol: {
    fontSize: 32,
    fontWeight: '300',
  },
  patDetailsBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    borderRadius: 8,
  },
  patBoxText: {
    fontSize: 12,
  },
  patBoxDate: {
    fontSize: 11,
  },
  rxSection: {
    gap: 6,
  },
  rxSectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  rxSectionVal: {
    fontSize: 13,
  },
  previewMedRow: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    gap: 2,
    marginTop: 4,
  },
  prevMedName: {
    fontSize: 13,
    fontWeight: '700',
  },
  prevMedMeta: {
    fontSize: 11,
  },
  prevMedInst: {
    fontSize: 11,
    fontStyle: 'italic',
  },
  prevFollowUp: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 8,
    borderRadius: 6,
  },
  prevFollowUpText: {
    fontSize: 12,
    fontWeight: '700',
  },
  modalFooter: {
    padding: 14,
    borderTopWidth: 1,
  },
  closePreviewBtn: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  closePreviewBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
