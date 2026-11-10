import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  TrendingUp,
  DollarSign,
  CheckCircle,
  Clock,
  Video,
  MapPin,
  ShieldCheck,
  Download,
} from 'lucide-react-native';
import { useDoctor } from '../src/context/DoctorContext';

export default function DoctorEarningsScreen() {
  const { theme, earnings } = useDoctor();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* DEMO NOTICE */}
      <View style={[styles.demoBanner, { backgroundColor: theme.accent || '#E3F3F0', borderColor: theme.border }]}>
        <ShieldCheck size={16} color={theme.primaryDark || '#116C64'} />
        <Text style={[styles.demoBannerText, { color: theme.primaryDark || '#116C64' }]}>
          Sample Financial Analytics: Payout records represent simulated clinical fee disbursements.
        </Text>
      </View>

      {/* METRICS ROW */}
      <View style={styles.metricsRow}>
        <View style={[styles.metricCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.metricLabel, { color: theme.mutedText }]}>Today's Earnings</Text>
          <Text style={[styles.metricVal, { color: theme.text }]}>₹{earnings.todayEarnings}</Text>
          <Text style={[styles.metricSub, { color: '#059669' }]}>+6 consults</Text>
        </View>

        <View style={[styles.metricCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.metricLabel, { color: theme.mutedText }]}>This Month</Text>
          <Text style={[styles.metricVal, { color: theme.text }]}>₹{earnings.monthlyEarnings.toLocaleString()}</Text>
          <Text style={[styles.metricSub, { color: theme.mutedText }]}>{earnings.completedConsultationsCount} total visits</Text>
        </View>
      </View>

      {/* TRANSACTION HISTORY */}
      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Recent Consultation Settlements</Text>
          <TouchableOpacity style={styles.statementBtn}>
            <Download size={13} color={theme.primaryDark || theme.primary} />
            <Text style={[styles.statementBtnText, { color: theme.primaryDark || theme.primary }]}>
              Statement
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.transactionsList}>
          {earnings.transactions.map((txn) => (
            <View
              key={txn.id}
              style={[styles.txnItem, { backgroundColor: theme.background, borderColor: theme.border }]}
            >
              <View style={styles.txnLeft}>
                <View style={styles.txnNameRow}>
                  <Text style={[styles.txnPatient, { color: theme.text }]}>{txn.patientName}</Text>
                  <View style={styles.modeBadge}>
                    {txn.mode === 'video' ? <Video size={11} color="#168B80" /> : <MapPin size={11} color="#168B80" />}
                    <Text style={styles.modeBadgeText}>{txn.mode === 'video' ? 'Video' : 'Clinic'}</Text>
                  </View>
                </View>
                <Text style={[styles.txnDate, { color: theme.mutedText }]}>{txn.date}</Text>
              </View>

              <View style={styles.txnRight}>
                <Text style={[styles.txnAmount, { color: theme.text }]}>+₹{txn.amount}</Text>
                <View
                  style={[
                    styles.statusPill,
                    {
                      backgroundColor: txn.status === 'Settled' ? '#ECFDF5' : '#FFFBEB',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusPillText,
                      { color: txn.status === 'Settled' ? '#059669' : '#D97706' },
                    ]}
                  >
                    {txn.status}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* PAYOUT ACCOUNT DETAILS */}
      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>Connected Settlement Account</Text>
        <Text style={[styles.bankName, { color: theme.text }]}>HDFC Bank • CareConnect Doctor Escrow</Text>
        <Text style={[styles.bankAcct, { color: theme.mutedText }]}>A/C: •••• •••• 4912 (Verified)</Text>
        <Text style={[styles.payoutSchedule, { color: theme.mutedText }]}>
          Auto-disbursement: Weekly on every Monday
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
  demoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  demoBannerText: {
    fontSize: 11,
    flex: 1,
    lineHeight: 16,
    fontWeight: '600',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 4,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  metricVal: {
    fontSize: 22,
    fontWeight: '800',
  },
  metricSub: {
    fontSize: 11,
    fontWeight: '600',
  },
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  statementBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statementBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  transactionsList: {
    gap: 8,
  },
  txnItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  txnLeft: {
    gap: 3,
  },
  txnNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  txnPatient: {
    fontSize: 13,
    fontWeight: '700',
  },
  modeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  modeBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#0369A1',
  },
  txnDate: {
    fontSize: 11,
  },
  txnRight: {
    alignItems: 'flex-end',
    gap: 2,
  },
  txnAmount: {
    fontSize: 14,
    fontWeight: '800',
  },
  statusPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusPillText: {
    fontSize: 9,
    fontWeight: '700',
  },
  bankName: {
    fontSize: 13,
    fontWeight: '700',
  },
  bankAcct: {
    fontSize: 12,
  },
  payoutSchedule: {
    fontSize: 11,
  },
});
