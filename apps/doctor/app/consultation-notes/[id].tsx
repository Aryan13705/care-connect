import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  FileEdit,
  Save,
  CheckCircle2,
  FileText,
  ShieldCheck,
} from 'lucide-react-native';
import { useDoctor } from '../../src/context/DoctorContext';

export default function DoctorConsultationNotesScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme, appointments } = useDoctor();

  const appointment =
    appointments.find((a) => a.id === id || a.bookingReference === id) || appointments[0];

  const [chiefComplaint, setChiefComplaint] = useState(
    appointment.reasonForVisit || 'Patient reports persistent headache and mild palpitations.'
  );
  const [observations, setObservations] = useState(
    'Heart sounds S1/S2 regular, no murmurs. Pulse 74 bpm. Bilateral lung fields clear. Blood pressure today recorded at 122/82 mmHg.'
  );
  const [diagnosis, setDiagnosis] = useState('Essential Stage 1 Pre-Hypertension (ICD-10 I10)');
  const [treatmentPlan, setTreatmentPlan] = useState(
    '1. Continue lifestyle sodium moderation (<2g/day).\n2. Initiate daily 30-minute brisk walk.\n3. Daily morning BP monitoring log for 14 days.'
  );
  const [followUp, setFollowUp] = useState('Review in 4 weeks or earlier if BP > 140/90.');

  const handleSaveNotes = () => {
    appointment.consultationNotes = `${diagnosis}\nObservations: ${observations}\nPlan: ${treatmentPlan}`;
    Alert.alert('Clinical Notes Saved', 'Consultation draft notes recorded successfully in local repository.');
  };

  const handleProceedToRx = () => {
    appointment.consultationNotes = `${diagnosis}\nObservations: ${observations}\nPlan: ${treatmentPlan}`;
    router.push(`/prescription-composer/${appointment.id}`);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* PATIENT HEADER BANNER */}
        <View style={[styles.patientHeader, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View>
            <Text style={[styles.patientName, { color: theme.text }]}>{appointment.patientName}</Text>
            <Text style={[styles.patientSub, { color: theme.mutedText }]}>
              {appointment.patientAge} yrs • {appointment.patientGender} • Ref: {appointment.bookingReference}
            </Text>
          </View>
          <View style={styles.demoTag}>
            <ShieldCheck size={12} color="#059669" />
            <Text style={styles.demoTagText}>Clinical Documentation</Text>
          </View>
        </View>

        {/* 1. CHIEF COMPLAINT */}
        <View style={[styles.formCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>1. Chief Complaint</Text>
          <TextInput
            value={chiefComplaint}
            onChangeText={setChiefComplaint}
            multiline
            style={[styles.textArea, { color: theme.text, borderColor: theme.border }]}
          />
        </View>

        {/* 2. CLINICAL OBSERVATIONS */}
        <View style={[styles.formCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>2. Examination & Observations</Text>
          <TextInput
            value={observations}
            onChangeText={setObservations}
            multiline
            style={[styles.textArea, { color: theme.text, borderColor: theme.border }]}
          />
        </View>

        {/* 3. DIAGNOSIS (ICD-10 DRAFT) */}
        <View style={[styles.formCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>3. Diagnosis / Assessment (ICD Draft)</Text>
          <TextInput
            value={diagnosis}
            onChangeText={setDiagnosis}
            style={[styles.input, { color: theme.text, borderColor: theme.border }]}
          />
        </View>

        {/* 4. TREATMENT PLAN */}
        <View style={[styles.formCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>4. Non-Pharmacological Treatment Plan</Text>
          <TextInput
            value={treatmentPlan}
            onChangeText={setTreatmentPlan}
            multiline
            style={[styles.textArea, { color: theme.text, borderColor: theme.border }]}
          />
        </View>

        {/* 5. FOLLOW UP RECOMMENDATION */}
        <View style={[styles.formCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>5. Follow-Up Schedule</Text>
          <TextInput
            value={followUp}
            onChangeText={setFollowUp}
            style={[styles.input, { color: theme.text, borderColor: theme.border }]}
          />
        </View>
      </ScrollView>

      {/* FOOTER ACTIONS */}
      <View style={[styles.footerBar, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
        <TouchableOpacity
          style={[styles.saveOutlineBtn, { borderColor: theme.border }]}
          onPress={handleSaveNotes}
        >
          <Save size={16} color={theme.text} />
          <Text style={[styles.saveOutlineText, { color: theme.text }]}>Save Notes Draft</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.proceedBtn, { backgroundColor: theme.primary }]}
          onPress={handleProceedToRx}
        >
          <FileText size={16} color="#FFFFFF" />
          <Text style={styles.proceedBtnText}>Proceed to Prescription</Text>
        </TouchableOpacity>
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
  patientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '700',
  },
  patientSub: {
    fontSize: 12,
  },
  demoTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  demoTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
  },
  formCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
  },
  cardTitle: {
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
    minHeight: 70,
    textAlignVertical: 'top',
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
  saveOutlineBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  saveOutlineText: {
    fontWeight: '600',
    fontSize: 13,
  },
  proceedBtn: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 10,
  },
  proceedBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});
