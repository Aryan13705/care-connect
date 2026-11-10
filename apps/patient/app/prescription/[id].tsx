import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Download,
  Share2,
  Stethoscope,
  Calendar,
  AlertTriangle,
  FileCheck,
  Building,
} from 'lucide-react-native';
import { usePatient } from '../../src/context/PatientContext';

export default function PrescriptionViewerScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme, prescriptions, patient, seniorMode } = usePatient();

  const prescription =
    prescriptions.find((p) => p.id === id || p.appointmentId === id) || prescriptions[0];

  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    setDownloaded(true);
    Alert.alert('Prescription Downloaded (Demo)', 'Sample PDF saved to your mock downloads directory.');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* WATERMARK BANNER */}
        <View style={styles.watermarkBanner}>
          <AlertTriangle size={18} color="#B91C1C" />
          <Text style={styles.watermarkBannerText}>
            SAMPLE / NOT VALID FOR MEDICAL DISPENSATION
          </Text>
        </View>

        {/* PRESCRIPTION DOCUMENT CANVAS */}
        <View style={[styles.rxCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          {/* Header */}
          <View style={[styles.rxHeader, { borderBottomColor: theme.border }]}>
            <View style={styles.doctorRxInfo}>
              <Text style={[styles.rxDocName, { color: theme.text, fontSize: seniorMode ? 20 : 17 }]}>
                {prescription.doctorName}
              </Text>
              <Text style={[styles.rxDocSpec, { color: theme.primaryDark || theme.primary }]}>
                {prescription.doctorSpeciality}
              </Text>
              <Text style={[styles.rxDocReg, { color: theme.mutedText }]}>
                Reg No: {prescription.doctorRegistration}
              </Text>
              <Text style={[styles.rxClinic, { color: theme.mutedText }]}>
                {prescription.clinicAddress}
              </Text>
            </View>

            <View style={styles.rxSymbolBox}>
              <Text style={[styles.rxSymbol, { color: theme.primaryDark || theme.primary }]}>℞</Text>
            </View>
          </View>

          {/* Patient Details Row */}
          <View style={[styles.patientDetailsRow, { backgroundColor: theme.background, borderColor: theme.border }]}>
            <View style={styles.detailCol}>
              <Text style={[styles.detailColLabel, { color: theme.mutedText }]}>Patient Name</Text>
              <Text style={[styles.detailColVal, { color: theme.text }]}>{prescription.patientName}</Text>
            </View>
            <View style={styles.detailCol}>
              <Text style={[styles.detailColLabel, { color: theme.mutedText }]}>Age / Gender</Text>
              <Text style={[styles.detailColVal, { color: theme.text }]}>
                {prescription.patientAge} yrs / {prescription.patientGender}
              </Text>
            </View>
            <View style={styles.detailCol}>
              <Text style={[styles.detailColLabel, { color: theme.mutedText }]}>Date</Text>
              <Text style={[styles.detailColVal, { color: theme.text }]}>{prescription.date}</Text>
            </View>
          </View>

          {/* Clinical Impression / Diagnosis */}
          <View style={styles.sectionBlock}>
            <Text style={[styles.blockLabel, { color: theme.mutedText }]}>Diagnosis / Clinical Impression:</Text>
            <Text style={[styles.blockContent, { color: theme.text }]}>{prescription.diagnosis}</Text>
          </View>

          {/* Notes */}
          <View style={styles.sectionBlock}>
            <Text style={[styles.blockLabel, { color: theme.mutedText }]}>Physician Clinical Instructions:</Text>
            <Text style={[styles.blockContent, { color: theme.text }]}>{prescription.clinicalNotes}</Text>
          </View>

          {/* Medications Table */}
          <View style={styles.medsBlock}>
            <Text style={[styles.medsTableTitle, { color: theme.text }]}>Medication Regimen</Text>

            {prescription.medications.map((med, index) => (
              <View
                key={med.id}
                style={[styles.medItemCard, { backgroundColor: theme.background, borderColor: theme.border }]}
              >
                <View style={styles.medHeaderRow}>
                  <Text style={[styles.medIndex, { color: theme.primaryDark || theme.primary }]}>
                    #{index + 1}
                  </Text>
                  <Text style={[styles.medName, { color: theme.text }]}>{med.name}</Text>
                  <Text style={[styles.medDosage, { color: theme.primaryDark || theme.primary }]}>
                    {med.dosage}
                  </Text>
                </View>

                <View style={styles.medMetaRow}>
                  <Text style={[styles.medMetaText, { color: theme.mutedText }]}>
                    Frequency: <Text style={{ color: theme.text, fontWeight: '600' }}>{med.frequency}</Text>
                  </Text>
                  <Text style={[styles.medMetaText, { color: theme.mutedText }]}>
                    Duration: <Text style={{ color: theme.text, fontWeight: '600' }}>{med.duration}</Text>
                  </Text>
                </View>

                {med.instructions ? (
                  <Text style={[styles.medInstruction, { color: theme.mutedText }]}>
                    Notes: {med.instructions}
                  </Text>
                ) : null}
              </View>
            ))}
          </View>

          {/* Follow-up Date */}
          {prescription.followUpDate && (
            <View style={[styles.followUpBox, { backgroundColor: theme.mint || '#E7F4ED' }]}>
              <Calendar size={16} color={theme.primaryDark || '#347C65'} />
              <Text style={[styles.followUpText, { color: theme.primaryDark || '#347C65' }]}>
                Recommended Clinical Follow-Up: {prescription.followUpDate}
              </Text>
            </View>
          )}

          {/* Digital Signature Placeholder */}
          <View style={styles.signBlock}>
            <View style={styles.signLine} />
            <Text style={[styles.signDoc, { color: theme.text }]}>{prescription.doctorName}</Text>
            <Text style={[styles.signCouncil, { color: theme.mutedText }]}>
              Digitally Generated via CareConnect Platform
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* FOOTER ACTIONS */}
      <View style={[styles.footerDock, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
        <TouchableOpacity
          style={[styles.downloadBtn, { backgroundColor: theme.primary }]}
          onPress={handleDownload}
        >
          <Download size={18} color="#FFFFFF" />
          <Text style={styles.downloadBtnText}>
            {downloaded ? 'Saved to Files (Demo)' : 'Download PDF Copy'}
          </Text>
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
  watermarkBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 12,
    justifyContent: 'center',
  },
  watermarkBannerText: {
    color: '#991B1B',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  rxCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
    gap: 16,
  },
  rxHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    paddingBottom: 14,
  },
  doctorRxInfo: {
    flex: 1,
    gap: 2,
  },
  rxDocName: {
    fontWeight: '800',
  },
  rxDocSpec: {
    fontSize: 13,
    fontWeight: '700',
  },
  rxDocReg: {
    fontSize: 11,
  },
  rxClinic: {
    fontSize: 11,
  },
  rxSymbolBox: {
    paddingHorizontal: 8,
  },
  rxSymbol: {
    fontSize: 36,
    fontWeight: '300',
    fontStyle: 'italic',
  },
  patientDetailsRow: {
    flexDirection: 'row',
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  detailCol: {
    gap: 2,
  },
  detailColLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
  },
  detailColVal: {
    fontSize: 12,
    fontWeight: '700',
  },
  sectionBlock: {
    gap: 4,
  },
  blockLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  blockContent: {
    fontSize: 13,
    lineHeight: 18,
  },
  medsBlock: {
    gap: 10,
  },
  medsTableTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  medItemCard: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    gap: 6,
  },
  medHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  medIndex: {
    fontSize: 12,
    fontWeight: '800',
  },
  medName: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
  },
  medDosage: {
    fontSize: 12,
    fontWeight: '700',
  },
  medMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  medMetaText: {
    fontSize: 11,
  },
  medInstruction: {
    fontSize: 11,
    fontStyle: 'italic',
  },
  followUpBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 10,
  },
  followUpText: {
    fontSize: 12,
    fontWeight: '700',
  },
  signBlock: {
    alignItems: 'flex-end',
    marginTop: 10,
    gap: 2,
  },
  signLine: {
    width: 140,
    height: 1,
    backgroundColor: '#CBD5E1',
    marginBottom: 4,
  },
  signDoc: {
    fontSize: 12,
    fontWeight: '700',
  },
  signCouncil: {
    fontSize: 10,
  },
  footerDock: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    padding: 14,
  },
  downloadBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
  },
  downloadBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});
