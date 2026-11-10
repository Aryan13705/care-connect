import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  FileText,
  Download,
  Eye,
  Calendar,
  ShieldAlert,
  ChevronRight,
  Activity,
  Heart,
  Droplet,
  X,
  Stethoscope,
} from 'lucide-react-native';
import { usePatient } from '../../src/context/PatientContext';
import { MedicalRecord, Prescription } from '@careconnect/types';

export default function MedicalRecordsScreen() {
  const router = useRouter();
  const { theme, patient, medicalRecords, prescriptions, seniorMode } = usePatient();

  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'prescriptions' | 'reports'>('overview');
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);

  const labReports = medicalRecords.filter((r) => r.category === 'lab_report');

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* RECORD CATEGORY TABS */}
      <View style={[styles.tabBar, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'prescriptions', label: `Prescriptions (${prescriptions.length})` },
            { id: 'reports', label: `Lab Reports (${labReports.length})` },
            { id: 'history', label: 'Vitals & History' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.tabChip,
                  {
                    backgroundColor: isActive ? (theme.primaryDark || '#347C65') : theme.background,
                    borderColor: theme.border,
                  },
                ]}
                onPress={() => setActiveTab(tab.id as any)}
              >
                <Text
                  style={[
                    styles.tabChipText,
                    {
                      color: isActive ? '#FFFFFF' : theme.text,
                      fontWeight: isActive ? '700' : '500',
                    },
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.contentArea} showsVerticalScrollIndicator={false}>
        {/* DISCLAIMER BANNER */}
        <View style={[styles.disclaimerBox, { backgroundColor: theme.cream || '#F8F2E8', borderColor: theme.border }]}>
          <ShieldAlert size={16} color="#B45309" />
          <Text style={styles.disclaimerText}>
            Phase 1 Demonstration: All medical records & prescription documents are fictional sample files.
          </Text>
        </View>

        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <View style={styles.tabContent}>
            {/* Patient Vitals Quick Cards */}
            <View style={styles.vitalsRow}>
              <View style={[styles.vitalCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Droplet size={18} color="#EF4444" />
                <Text style={[styles.vitalVal, { color: theme.text }]}>{patient.bloodGroup}</Text>
                <Text style={[styles.vitalLabel, { color: theme.mutedText }]}>Blood Group</Text>
              </View>
              <View style={[styles.vitalCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Heart size={18} color="#E11D48" />
                <Text style={[styles.vitalVal, { color: theme.text }]}>120/80</Text>
                <Text style={[styles.vitalLabel, { color: theme.mutedText }]}>Resting BP (Demo)</Text>
              </View>
              <View style={[styles.vitalCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Activity size={18} color="#10B981" />
                <Text style={[styles.vitalVal, { color: theme.text }]}>72 bpm</Text>
                <Text style={[styles.vitalLabel, { color: theme.mutedText }]}>Heart Rate</Text>
              </View>
            </View>

            {/* Health Timeline */}
            <View style={styles.sectionWrap}>
              <Text style={[styles.sectionHeading, { color: theme.text, fontSize: seniorMode ? 19 : 16 }]}>
                Health Record Timeline
              </Text>
              <View style={styles.timeline}>
                {medicalRecords.map((rec, index) => (
                  <TouchableOpacity
                    key={rec.id}
                    style={[styles.recordItem, { backgroundColor: theme.surface, borderColor: theme.border }]}
                    onPress={() => setSelectedRecord(rec)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.recIconWrap}>
                      <FileText size={20} color={theme.primaryDark || '#347C65'} />
                    </View>
                    <View style={styles.recDetails}>
                      <Text style={[styles.recTitle, { color: theme.text }]} numberOfLines={1}>
                        {rec.title}
                      </Text>
                      <Text style={[styles.recDoctor, { color: theme.mutedText }]}>
                        {rec.doctorName} • {rec.facility}
                      </Text>
                      <View style={styles.recMetaRow}>
                        <Calendar size={11} color={theme.mutedText} />
                        <Text style={[styles.recDate, { color: theme.mutedText }]}>{rec.date}</Text>
                        <Text style={[styles.recSize, { color: theme.mutedText }]}>• {rec.fileSize}</Text>
                      </View>
                    </View>
                    <ChevronRight size={18} color={theme.mutedText} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* 2. PRESCRIPTIONS TAB */}
        {activeTab === 'prescriptions' && (
          <View style={styles.tabContent}>
            {prescriptions.map((presc) => (
              <View
                key={presc.id}
                style={[styles.prescCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
              >
                <View style={styles.prescHeader}>
                  <View style={styles.prescDoctorInfo}>
                    <Stethoscope size={18} color={theme.primaryDark || '#347C65'} />
                    <View>
                      <Text style={[styles.prescDocName, { color: theme.text }]}>{presc.doctorName}</Text>
                      <Text style={[styles.prescDocSpec, { color: theme.mutedText }]}>{presc.doctorSpeciality}</Text>
                    </View>
                  </View>
                  <View style={styles.prescSamplePill}>
                    <Text style={styles.prescSampleText}>SAMPLE</Text>
                  </View>
                </View>

                <View style={[styles.prescDiagnosisBox, { backgroundColor: theme.background }]}>
                  <Text style={[styles.diagnosisLabel, { color: theme.mutedText }]}>Clinical Diagnosis:</Text>
                  <Text style={[styles.diagnosisValue, { color: theme.text }]}>{presc.diagnosis}</Text>
                </View>

                <View style={styles.medsSummary}>
                  <Text style={[styles.medsCountText, { color: theme.mutedText }]}>
                    {presc.medications.length} Prescribed Medications:
                  </Text>
                  {presc.medications.map((m) => (
                    <Text key={m.id} style={[styles.medItemText, { color: theme.text }]}>
                      • {m.name} ({m.dosage}) — {m.frequency}
                    </Text>
                  ))}
                </View>

                <View style={styles.prescFooterRow}>
                  <Text style={[styles.prescDateText, { color: theme.mutedText }]}>Issued: {presc.date}</Text>
                  <TouchableOpacity
                    style={[styles.viewPrescBtn, { backgroundColor: theme.primary }]}
                    onPress={() => router.push(`/prescription/${presc.id}`)}
                  >
                    <Eye size={14} color="#FFFFFF" />
                    <Text style={styles.viewPrescBtnText}>Digital View</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* 3. LAB REPORTS TAB */}
        {activeTab === 'reports' && (
          <View style={styles.tabContent}>
            {labReports.map((report) => (
              <TouchableOpacity
                key={report.id}
                style={[styles.reportCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
                onPress={() => setSelectedRecord(report)}
                activeOpacity={0.8}
              >
                <View style={styles.reportTop}>
                  <View style={[styles.fileBadge, { backgroundColor: theme.mint || '#E7F4ED' }]}>
                    <FileText size={22} color={theme.primaryDark || '#347C65'} />
                  </View>
                  <View style={styles.reportTextGroup}>
                    <Text style={[styles.reportTitle, { color: theme.text }]}>{report.title}</Text>
                    <Text style={[styles.reportFacility, { color: theme.mutedText }]}>{report.facility}</Text>
                    <Text style={[styles.reportDate, { color: theme.mutedText }]}>{report.date} • {report.fileSize}</Text>
                  </View>
                </View>

                <View style={[styles.reportSummaryBox, { backgroundColor: theme.background }]}>
                  <Text style={[styles.summaryText, { color: theme.text }]} numberOfLines={2}>
                    {report.summary}
                  </Text>
                </View>

                <View style={styles.reportActionRow}>
                  <TouchableOpacity
                    style={[styles.actionBtn, { borderColor: theme.border }]}
                    onPress={() => setSelectedRecord(report)}
                  >
                    <Eye size={14} color={theme.text} />
                    <Text style={[styles.actionBtnText, { color: theme.text }]}>Preview</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: theme.primary }]}
                    onPress={() => setSelectedRecord(report)}
                  >
                    <Download size={14} color="#FFFFFF" />
                    <Text style={[styles.actionBtnText, { color: '#FFFFFF' }]}>Download (Demo)</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* 4. HISTORY TAB */}
        {activeTab === 'history' && (
          <View style={styles.tabContent}>
            <View style={[styles.historyCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Text style={[styles.historyCardTitle, { color: theme.text }]}>Known Allergies</Text>
              <View style={styles.tagWrap}>
                {patient.allergies.map((allergy) => (
                  <View key={allergy} style={styles.allergyTag}>
                    <Text style={styles.allergyTagText}>{allergy}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={[styles.historyCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Text style={[styles.historyCardTitle, { color: theme.text }]}>Chronic Conditions</Text>
              <View style={styles.tagWrap}>
                {patient.chronicConditions.map((cond) => (
                  <View key={cond} style={styles.conditionTag}>
                    <Text style={styles.conditionTagText}>{cond}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={[styles.historyCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Text style={[styles.historyCardTitle, { color: theme.text }]}>Emergency Contact</Text>
              <Text style={[styles.historyDetail, { color: theme.text }]}>
                {patient.emergencyContact.name} ({patient.emergencyContact.relationship})
              </Text>
              <Text style={[styles.historyDetail, { color: theme.mutedText }]}>
                {patient.emergencyContact.phone}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* RECORD PREVIEW MODAL */}
      <Modal visible={!!selectedRecord} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: theme.surface }]}>
            <View style={styles.modalTop}>
              <Text style={[styles.modalDocTitle, { color: theme.text }]} numberOfLines={1}>
                {selectedRecord?.title}
              </Text>
              <TouchableOpacity onPress={() => setSelectedRecord(null)}>
                <X size={20} color={theme.mutedText} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.sampleStamp}>
                <Text style={styles.sampleStampText}>DEMO MEDICAL REPORT</Text>
              </View>
              <Text style={[styles.modalLabel, { color: theme.mutedText }]}>Ordering Physician:</Text>
              <Text style={[styles.modalValue, { color: theme.text }]}>{selectedRecord?.doctorName}</Text>

              <Text style={[styles.modalLabel, { color: theme.mutedText, marginTop: 8 }]}>Facility:</Text>
              <Text style={[styles.modalValue, { color: theme.text }]}>{selectedRecord?.facility}</Text>

              <Text style={[styles.modalLabel, { color: theme.mutedText, marginTop: 8 }]}>Clinical Summary:</Text>
              <Text style={[styles.modalValue, { color: theme.text, lineHeight: 20 }]}>
                {selectedRecord?.summary}
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.closeModalBtn, { backgroundColor: theme.primary }]}
              onPress={() => setSelectedRecord(null)}
            >
              <Text style={styles.closeModalBtnText}>Close Preview</Text>
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
  tabBar: {
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  tabsScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  tabChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  tabChipText: {
    fontSize: 12,
  },
  contentArea: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  disclaimerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    padding: 12,
    borderRadius: 12,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 11,
    color: '#92400E',
    lineHeight: 15,
  },
  tabContent: {
    gap: 14,
  },
  vitalsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  vitalCard: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    gap: 4,
  },
  vitalVal: {
    fontSize: 15,
    fontWeight: '800',
  },
  vitalLabel: {
    fontSize: 10,
    textAlign: 'center',
  },
  sectionWrap: {
    gap: 10,
  },
  sectionHeading: {
    fontWeight: '700',
  },
  timeline: {
    gap: 10,
  },
  recordItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  recIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recDetails: {
    flex: 1,
    gap: 2,
  },
  recTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  recDoctor: {
    fontSize: 12,
  },
  recMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  recDate: {
    fontSize: 11,
  },
  recSize: {
    fontSize: 11,
  },
  prescCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  prescHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  prescDoctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  prescDocName: {
    fontSize: 14,
    fontWeight: '700',
  },
  prescDocSpec: {
    fontSize: 11,
  },
  prescSamplePill: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  prescSampleText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#B91C1C',
  },
  prescDiagnosisBox: {
    padding: 10,
    borderRadius: 8,
    gap: 2,
  },
  diagnosisLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  diagnosisValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  medsSummary: {
    gap: 4,
  },
  medsCountText: {
    fontSize: 11,
    fontWeight: '600',
  },
  medItemText: {
    fontSize: 12,
  },
  prescFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
  },
  prescDateText: {
    fontSize: 11,
  },
  viewPrescBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  viewPrescBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  reportCard: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 10,
  },
  reportTop: {
    flexDirection: 'row',
    gap: 12,
  },
  fileBadge: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reportTextGroup: {
    flex: 1,
    gap: 2,
  },
  reportTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  reportFacility: {
    fontSize: 12,
  },
  reportDate: {
    fontSize: 11,
  },
  reportSummaryBox: {
    padding: 8,
    borderRadius: 8,
  },
  summaryText: {
    fontSize: 12,
    lineHeight: 16,
  },
  reportActionRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  historyCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
  },
  historyCardTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  allergyTag: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  allergyTagText: {
    color: '#991B1B',
    fontSize: 12,
    fontWeight: '600',
  },
  conditionTag: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  conditionTagText: {
    color: '#92400E',
    fontSize: 12,
    fontWeight: '600',
  },
  historyDetail: {
    fontSize: 13,
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
    borderRadius: 16,
    padding: 20,
    gap: 12,
  },
  modalTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalDocTitle: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  modalBody: {
    gap: 4,
  },
  sampleStamp: {
    alignSelf: 'flex-start',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginBottom: 6,
  },
  sampleStampText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },
  modalLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  modalValue: {
    fontSize: 13,
  },
  closeModalBtn: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 6,
  },
  closeModalBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});
