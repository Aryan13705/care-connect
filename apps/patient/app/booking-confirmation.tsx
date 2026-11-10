import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  CheckCircle,
  Calendar,
  Clock,
  Video,
  MapPin,
  ShieldCheck,
  Home,
  FileText,
  ChevronRight,
} from 'lucide-react-native';
import { usePatient } from '../src/context/PatientContext';

export default function BookingConfirmationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    bookingRef: string;
    doctorName: string;
    doctorSpeciality: string;
    doctorAvatar: string;
    date: string;
    time: string;
    mode: string;
    fee: string;
    patientName: string;
  }>();
  const { theme, seniorMode } = usePatient();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* SUCCESS ANIMATION BADGE */}
      <View style={styles.successHeader}>
        <View style={[styles.successIconCircle, { backgroundColor: theme.mint || '#E7F4ED' }]}>
          <CheckCircle size={56} color={theme.primaryDark || '#347C65'} />
        </View>
        <Text style={[styles.successTitle, { color: theme.text, fontSize: seniorMode ? 24 : 20 }]}>
          Appointment Scheduled!
        </Text>
        <Text style={[styles.successSubtitle, { color: theme.mutedText }]}>
          Your consultation request has been reserved in local demo state.
        </Text>

        <View style={styles.bookingRefCard}>
          <Text style={styles.bookingRefLabel}>Booking Reference</Text>
          <Text style={[styles.bookingRefValue, { color: theme.primaryDark || theme.primary }]}>
            {params.bookingRef || 'CC-BK-DEMO'}
          </Text>
        </View>
      </View>

      {/* DEMO NOTICE BANNER */}
      <View style={[styles.noticeBanner, { backgroundColor: theme.cream || '#F8F2E8', borderColor: theme.border }]}>
        <ShieldCheck size={16} color="#B45309" />
        <Text style={styles.noticeText}>
          Prototype Demonstration: This is a simulated booking for UI/UX testing. No real doctor visit or payment has been triggered.
        </Text>
      </View>

      {/* APPOINTMENT SUMMARY CARD */}
      <View style={[styles.summaryCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.cardHeading, { color: theme.text }]}>Consultation Summary</Text>

        <View style={styles.doctorSnippet}>
          <Image source={{ uri: params.doctorAvatar }} style={styles.docAvatar} />
          <View style={styles.docTexts}>
            <Text style={[styles.docName, { color: theme.text }]}>{params.doctorName}</Text>
            <Text style={[styles.docSpec, { color: theme.primaryDark || theme.primary }]}>
              {params.doctorSpeciality}
            </Text>
          </View>
        </View>

        <View style={[styles.detailRow, { borderBottomColor: theme.border }]}>
          <View style={styles.detailItem}>
            <Calendar size={15} color={theme.mutedText} />
            <View>
              <Text style={[styles.detailLabel, { color: theme.mutedText }]}>Date</Text>
              <Text style={[styles.detailVal, { color: theme.text }]}>{params.date}</Text>
            </View>
          </View>
          <View style={styles.detailItem}>
            <Clock size={15} color={theme.mutedText} />
            <View>
              <Text style={[styles.detailLabel, { color: theme.mutedText }]}>Time Slot</Text>
              <Text style={[styles.detailVal, { color: theme.text }]}>{params.time}</Text>
            </View>
          </View>
        </View>

        <View style={[styles.detailRow, { borderBottomColor: theme.border }]}>
          <View style={styles.detailItem}>
            {params.mode === 'video' ? <Video size={15} color="#168B80" /> : <MapPin size={15} color="#168B80" />}
            <View>
              <Text style={[styles.detailLabel, { color: theme.mutedText }]}>Consultation Type</Text>
              <Text style={[styles.detailVal, { color: theme.text }]}>
                {params.mode === 'video' ? 'Virtual Video Room' : 'In-Clinic Appointment'}
              </Text>
            </View>
          </View>
          <View style={styles.detailItem}>
            <View>
              <Text style={[styles.detailLabel, { color: theme.mutedText }]}>Patient</Text>
              <Text style={[styles.detailVal, { color: theme.text }]}>{params.patientName}</Text>
            </View>
          </View>
        </View>

        <View style={styles.feeSummaryRow}>
          <Text style={[styles.feeLabel, { color: theme.mutedText }]}>Total Fee (Demo Reserved)</Text>
          <Text style={[styles.feeAmount, { color: theme.text }]}>₹{params.fee}</Text>
        </View>
      </View>

      {/* ACTION BUTTONS */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.primaryActionBtn, { backgroundColor: theme.primary }]}
          onPress={() => router.replace('/(tabs)/appointments')}
          activeOpacity={0.8}
        >
          <FileText size={18} color="#FFFFFF" />
          <Text style={styles.primaryActionBtnText}>View My Appointments</Text>
          <ChevronRight size={18} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.secondaryActionBtn, { borderColor: theme.border, backgroundColor: theme.surface }]}
          onPress={() => router.replace('/(tabs)/')}
          activeOpacity={0.8}
        >
          <Home size={18} color={theme.text} />
          <Text style={[styles.secondaryActionBtnText, { color: theme.text }]}>Back to Home Dashboard</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    gap: 16,
    paddingTop: 40,
    paddingBottom: 40,
  },
  successHeader: {
    alignItems: 'center',
    gap: 8,
  },
  successIconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  successTitle: {
    fontWeight: '800',
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 20,
  },
  bookingRefCard: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    gap: 2,
    marginTop: 8,
  },
  bookingRefLabel: {
    fontSize: 11,
    color: '#64748B',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  bookingRefValue: {
    fontSize: 16,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  noticeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  noticeText: {
    flex: 1,
    fontSize: 11,
    color: '#92400E',
    lineHeight: 16,
  },
  summaryCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 14,
  },
  cardHeading: {
    fontSize: 15,
    fontWeight: '700',
  },
  doctorSnippet: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  docAvatar: {
    width: 52,
    height: 52,
    borderRadius: 12,
  },
  docTexts: {
    flex: 1,
    gap: 2,
  },
  docName: {
    fontSize: 15,
    fontWeight: '700',
  },
  docSpec: {
    fontSize: 12,
    fontWeight: '600',
  },
  detailRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingBottom: 12,
    gap: 16,
  },
  detailItem: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
  detailLabel: {
    fontSize: 11,
  },
  detailVal: {
    fontSize: 13,
    fontWeight: '600',
  },
  feeSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  feeLabel: {
    fontSize: 13,
  },
  feeAmount: {
    fontSize: 16,
    fontWeight: '800',
  },
  actionButtons: {
    gap: 10,
    marginTop: 8,
  },
  primaryActionBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  primaryActionBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  secondaryActionBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  secondaryActionBtnText: {
    fontWeight: '600',
    fontSize: 14,
  },
});
