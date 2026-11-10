import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Star,
  Award,
  Globe,
  MapPin,
  Clock,
  ShieldCheck,
  Video,
  Building,
  CheckCircle2,
  Calendar,
} from 'lucide-react-native';
import { usePatient } from '../../src/context/PatientContext';

export default function DoctorProfileScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme, doctors, seniorMode } = usePatient();

  const doctor = doctors.find((d) => d.id === id) || doctors[0];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* DOCTOR HEADER CARD */}
        <View style={[styles.profileHeaderCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.topRow}>
            <Image source={{ uri: doctor.avatarUrl }} style={styles.avatarLarge} />
            <View style={styles.headerInfo}>
              <View style={styles.demoPill}>
                <ShieldCheck size={12} color="#059669" />
                <Text style={styles.demoPillText}>Demo Profile</Text>
              </View>
              <Text style={[styles.doctorName, { color: theme.text, fontSize: seniorMode ? 22 : 18 }]}>
                {doctor.name}
              </Text>
              <Text style={[styles.doctorTitle, { color: theme.primaryDark || theme.primary }]}>
                {doctor.title}
              </Text>
              <Text style={[styles.doctorQual, { color: theme.mutedText }]}>{doctor.qualification}</Text>

              <View style={styles.ratingRow}>
                <Star size={14} color="#F59E0B" fill="#F59E0B" />
                <Text style={styles.ratingVal}>{doctor.rating}</Text>
                <Text style={[styles.reviewCount, { color: theme.mutedText }]}>
                  ({doctor.reviewCount} patient reviews)
                </Text>
              </View>
            </View>
          </View>

          {/* Quick Metrics Bar */}
          <View style={[styles.metricsBar, { backgroundColor: theme.background, borderColor: theme.border }]}>
            <View style={styles.metricItem}>
              <Award size={18} color={theme.primaryDark || '#347C65'} />
              <Text style={[styles.metricVal, { color: theme.text }]}>{doctor.experienceYears}+ yrs</Text>
              <Text style={[styles.metricSub, { color: theme.mutedText }]}>Experience</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Globe size={18} color={theme.primaryDark || '#347C65'} />
              <Text style={[styles.metricVal, { color: theme.text }]} numberOfLines={1}>
                {doctor.languages.slice(0, 2).join(', ')}
              </Text>
              <Text style={[styles.metricSub, { color: theme.mutedText }]}>Languages</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Clock size={18} color={theme.primaryDark || '#347C65'} />
              <Text style={[styles.metricVal, { color: theme.text }]}>{doctor.slotDurationMinutes} min</Text>
              <Text style={[styles.metricSub, { color: theme.mutedText }]}>Duration</Text>
            </View>
          </View>
        </View>

        {/* DEMO NOTICE BANNER */}
        <View style={[styles.noticeCard, { backgroundColor: theme.cream || '#F8F2E8', borderColor: theme.border }]}>
          <ShieldCheck size={16} color="#B45309" />
          <Text style={styles.noticeText}>
            Demonstration Profile: Fictional medical specialist created for CareConnect UI evaluation.
          </Text>
        </View>

        {/* ABOUT SECTION */}
        <View style={[styles.contentCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>About Doctor</Text>
          <Text style={[styles.bioText, { color: theme.mutedText }]}>{doctor.bio}</Text>
        </View>

        {/* PRACTICE AREAS */}
        <View style={[styles.contentCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Areas of Clinical Practice</Text>
          <View style={styles.tagsGrid}>
            {doctor.areasOfPractice.map((area) => (
              <View key={area} style={[styles.tag, { backgroundColor: theme.mint || '#E7F4ED' }]}>
                <CheckCircle2 size={13} color={theme.primaryDark || '#347C65'} />
                <Text style={[styles.tagText, { color: theme.primaryDark || '#347C65' }]}>{area}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* CLINIC & REGISTRATION */}
        <View style={[styles.contentCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Clinic & Council Credentials</Text>
          <View style={styles.credRow}>
            <Building size={16} color={theme.mutedText} />
            <View style={styles.credTexts}>
              <Text style={[styles.credLabel, { color: theme.mutedText }]}>Clinic Facility</Text>
              <Text style={[styles.credVal, { color: theme.text }]}>{doctor.clinicAddress}</Text>
            </View>
          </View>
          <View style={styles.credRow}>
            <ShieldCheck size={16} color={theme.mutedText} />
            <View style={styles.credTexts}>
              <Text style={[styles.credLabel, { color: theme.mutedText }]}>Medical Registration</Text>
              <Text style={[styles.credVal, { color: theme.text }]}>
                {doctor.registrationNumber} ({doctor.registrationCouncil})
              </Text>
            </View>
          </View>
        </View>

        {/* AVAILABLE MODES */}
        <View style={[styles.contentCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Consultation Modes</Text>
          <View style={styles.modesRow}>
            <View style={[styles.modeBox, { backgroundColor: theme.background, borderColor: theme.border }]}>
              <Video size={20} color="#168B80" />
              <Text style={[styles.modeTitle, { color: theme.text }]}>Video Teleconsult</Text>
              <Text style={[styles.modeSub, { color: theme.mutedText }]}>High definition online room</Text>
            </View>
            <View style={[styles.modeBox, { backgroundColor: theme.background, borderColor: theme.border }]}>
              <MapPin size={20} color="#168B80" />
              <Text style={[styles.modeTitle, { color: theme.text }]}>In-Person Visit</Text>
              <Text style={[styles.modeSub, { color: theme.mutedText }]}>Walk into clinic suite</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* STICKY BOTTOM BOOKING ACTION */}
      <View style={[styles.bottomBar, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
        <View>
          <Text style={[styles.feeVal, { color: theme.text }]}>₹{doctor.consultationFee}</Text>
          <Text style={[styles.feeSub, { color: theme.mutedText }]}>per consultation slot</Text>
        </View>

        <TouchableOpacity
          style={[styles.bookCTA, { backgroundColor: theme.primary }]}
          onPress={() => router.push(`/booking/${doctor.id}`)}
          activeOpacity={0.8}
        >
          <Calendar size={18} color="#FFFFFF" />
          <Text style={styles.bookCTAText}>Book Appointment</Text>
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
    paddingBottom: 100,
  },
  profileHeaderCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 14,
  },
  topRow: {
    flexDirection: 'row',
    gap: 14,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 18,
  },
  headerInfo: {
    flex: 1,
    gap: 2,
  },
  demoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  demoPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#065F46',
  },
  doctorName: {
    fontWeight: '700',
  },
  doctorTitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  doctorQual: {
    fontSize: 11,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  ratingVal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B45309',
  },
  reviewCount: {
    fontSize: 11,
  },
  metricsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  metricVal: {
    fontSize: 13,
    fontWeight: '700',
  },
  metricSub: {
    fontSize: 10,
  },
  metricDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#CBD5E1',
  },
  noticeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  noticeText: {
    flex: 1,
    fontSize: 11,
    color: '#92400E',
    lineHeight: 15,
  },
  contentCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  bioText: {
    fontSize: 13,
    lineHeight: 19,
  },
  tagsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  credRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  credTexts: {
    flex: 1,
    gap: 2,
  },
  credLabel: {
    fontSize: 11,
  },
  credVal: {
    fontSize: 13,
    fontWeight: '600',
  },
  modesRow: {
    flexDirection: 'row',
    gap: 10,
  },
  modeBox: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
  },
  modeTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  modeSub: {
    fontSize: 10,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  feeVal: {
    fontSize: 18,
    fontWeight: '800',
  },
  feeSub: {
    fontSize: 11,
  },
  bookCTA: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  bookCTAText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
