import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Bell,
  Search,
  Calendar,
  FileText,
  Users,
  Video,
  MapPin,
  ChevronRight,
  Star,
  Sparkles,
  Stethoscope,
  HeartPulse,
  Brain,
  Baby,
  Bone,
  Flower2,
  Ear,
  ShieldCheck,
} from 'lucide-react-native';
import { usePatient } from '../../src/context/PatientContext';

export default function PatientHomeScreen() {
  const router = useRouter();
  const { theme, patient, doctors, specialities, appointments, notifications, seniorMode } = usePatient();
  const [searchQuery, setSearchQuery] = useState('');

  const unreadNotifications = notifications.filter((n) => !n.read).length;
  const upcomingAppointment = appointments.find((a) => a.status === 'upcoming');
  const topSpecialities = specialities.slice(0, 8);
  const recommendedDoctors = doctors.slice(0, 4);

  const getSpecialityIcon = (name: string, color: string) => {
    switch (name.toLowerCase()) {
      case 'general physician':
        return <Stethoscope size={24} color={color} />;
      case 'cardiology':
        return <HeartPulse size={24} color={color} />;
      case 'dermatology':
        return <Sparkles size={24} color={color} />;
      case 'neurology':
        return <Brain size={24} color={color} />;
      case 'paediatrics':
        return <Baby size={24} color={color} />;
      case 'orthopaedics':
        return <Bone size={24} color={color} />;
      case 'gynaecology & obstetrics':
      case 'gynaecology':
        return <Flower2 size={24} color={color} />;
      case 'ear, nose & throat (ent)':
      case 'ent':
        return <Ear size={24} color={color} />;
      default:
        return <Stethoscope size={24} color={color} />;
    }
  };

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. HEADER SECTION */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.profileTrigger}
          onPress={() => router.push('/(tabs)/profile')}
          activeOpacity={0.8}
        >
          <Image source={{ uri: patient.avatarUrl }} style={styles.avatar} />
          <View>
            <Text style={[styles.greetingSub, { color: theme.mutedText, fontSize: seniorMode ? 14 : 12 }]}>
              {formattedDate}
            </Text>
            <Text style={[styles.greetingTitle, { color: theme.text, fontSize: seniorMode ? 22 : 18 }]}>
              Good morning, {patient.name.split(' ')[0]} 👋
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
          onPress={() => router.push('/notifications')}
          activeOpacity={0.7}
        >
          <Bell size={20} color={theme.text} />
          {unreadNotifications > 0 && (
            <View style={[styles.badge, { backgroundColor: theme.danger || '#EF4444' }]}>
              <Text style={styles.badgeText}>{unreadNotifications}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* 2. SEARCH & DISCOVERY BAR */}
      <View style={[styles.searchBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Search size={20} color={theme.mutedText} style={styles.searchIcon} />
        <TextInput
          placeholder="Search doctors, specialities, or symptoms..."
          placeholderTextColor={theme.mutedText}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={() => router.push({ pathname: '/(tabs)/doctors', params: { query: searchQuery } })}
          style={[styles.searchInput, { color: theme.text, fontSize: seniorMode ? 16 : 14 }]}
        />
      </View>

      {/* 3. HERO BANNER */}
      <View style={[styles.heroCard, { backgroundColor: theme.mint || '#E7F4ED', borderColor: theme.border }]}>
        <View style={styles.heroTextContent}>
          <View style={styles.demoPill}>
            <ShieldCheck size={12} color="#347C65" />
            <Text style={styles.demoPillText}>CareConnect Health Demo</Text>
          </View>
          <Text style={[styles.heroHeading, { fontSize: seniorMode ? 22 : 19 }]}>
            Your health deserves{'\n'}the best care.
          </Text>
          <Text style={styles.heroSubtitle}>
            Connect with verified specialists for instant video consults or clinic visits.
          </Text>
          <TouchableOpacity
            style={[styles.heroCTA, { backgroundColor: theme.primaryDark || '#347C65' }]}
            onPress={() => router.push('/(tabs)/doctors')}
            activeOpacity={0.8}
          >
            <Text style={styles.heroCTAText}>Find a Doctor</Text>
            <ChevronRight size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 4. UPCOMING APPOINTMENT (If any) */}
      {upcomingAppointment && (
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text, fontSize: seniorMode ? 20 : 17 }]}>
              Upcoming Consultation
            </Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/appointments')}>
              <Text style={[styles.seeAllText, { color: theme.primaryDark || theme.primary }]}>View all</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.appointmentCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.aptTopRow}>
              <Image source={{ uri: upcomingAppointment.doctorAvatar }} style={styles.docAvatar} />
              <View style={styles.docInfo}>
                <Text style={[styles.docName, { color: theme.text }]}>{upcomingAppointment.doctorName}</Text>
                <Text style={[styles.docSpeciality, { color: theme.mutedText }]}>
                  {upcomingAppointment.doctorSpeciality}
                </Text>
                <View style={styles.modeTag}>
                  {upcomingAppointment.mode === 'video' ? (
                    <Video size={13} color="#168B80" />
                  ) : (
                    <MapPin size={13} color="#168B80" />
                  )}
                  <Text style={styles.modeTagText}>
                    {upcomingAppointment.mode === 'video' ? 'Video Consultation' : 'In-Clinic Visit'}
                  </Text>
                </View>
              </View>
            </View>

            <View style={[styles.aptMetaRow, { backgroundColor: theme.background, borderColor: theme.border }]}>
              <View style={styles.metaItem}>
                <Calendar size={15} color={theme.mutedText} />
                <Text style={[styles.metaText, { color: theme.text }]}>{upcomingAppointment.date}</Text>
              </View>
              <View style={styles.metaDivider} />
              <View style={styles.metaItem}>
                <Text style={[styles.metaText, { color: theme.text }]}>{upcomingAppointment.time}</Text>
              </View>
            </View>

            <View style={styles.aptActionRow}>
              {upcomingAppointment.mode === 'video' && (
                <TouchableOpacity
                  style={[styles.joinBtn, { backgroundColor: theme.primary }]}
                  onPress={() => router.push(`/consultation/${upcomingAppointment.id}`)}
                  activeOpacity={0.8}
                >
                  <Video size={16} color="#FFFFFF" />
                  <Text style={styles.joinBtnText}>Join Room (Demo)</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.detailsBtn, { borderColor: theme.border, backgroundColor: theme.surface }]}
                onPress={() => router.push(`/appointment/${upcomingAppointment.id}`)}
                activeOpacity={0.7}
              >
                <Text style={[styles.detailsBtnText, { color: theme.text }]}>Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* 5. QUICK ACTIONS */}
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, { color: theme.text, fontSize: seniorMode ? 20 : 17 }]}>
          Quick Actions
        </Text>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity
            style={[styles.quickActionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
            onPress={() => router.push('/(tabs)/doctors')}
            activeOpacity={0.8}
          >
            <View style={[styles.qaIconWrap, { backgroundColor: theme.mint || '#E7F4ED' }]}>
              <Stethoscope size={22} color={theme.primaryDark || '#347C65'} />
            </View>
            <Text style={[styles.qaTitle, { color: theme.text }]}>Book Consult</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickActionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
            onPress={() => router.push('/(tabs)/records')}
            activeOpacity={0.8}
          >
            <View style={[styles.qaIconWrap, { backgroundColor: theme.cream || '#F8F2E8' }]}>
              <FileText size={22} color="#B45309" />
            </View>
            <Text style={[styles.qaTitle, { color: theme.text }]}>Medical Records</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickActionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
            onPress={() => router.push('/family')}
            activeOpacity={0.8}
          >
            <View style={[styles.qaIconWrap, { backgroundColor: theme.peach || '#FBE9DF' }]}>
              <Users size={22} color="#C2410C" />
            </View>
            <Text style={[styles.qaTitle, { color: theme.text }]}>Family Health</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickActionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
            onPress={() => router.push('/(tabs)/appointments')}
            activeOpacity={0.8}
          >
            <View style={[styles.qaIconWrap, { backgroundColor: '#EEF2FF' }]}>
              <Calendar size={22} color="#4338CA" />
            </View>
            <Text style={[styles.qaTitle, { color: theme.text }]}>Appointments</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 6. SPECIALITIES DIRECTORY */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text, fontSize: seniorMode ? 20 : 17 }]}>
            Explore Specialities
          </Text>
          <TouchableOpacity onPress={() => router.push('/specialities')}>
            <Text style={[styles.seeAllText, { color: theme.primaryDark || theme.primary }]}>View all (12)</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.specialityGrid}>
          {topSpecialities.map((spec) => (
            <TouchableOpacity
              key={spec.id}
              style={[styles.specialityCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
              onPress={() => router.push({ pathname: '/(tabs)/doctors', params: { specialityId: spec.id } })}
              activeOpacity={0.7}
            >
              <View style={[styles.specIconWrap, { backgroundColor: theme.background }]}>
                {getSpecialityIcon(spec.name, spec.accentColor)}
              </View>
              <Text style={[styles.specName, { color: theme.text }]} numberOfLines={1}>
                {spec.name}
              </Text>
              <Text style={[styles.specCount, { color: theme.mutedText }]}>
                {spec.doctorCount} Doctors
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 7. RECOMMENDED DOCTORS */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text, fontSize: seniorMode ? 20 : 17 }]}>
            Recommended Specialists
          </Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/doctors')}>
            <Text style={[styles.seeAllText, { color: theme.primaryDark || theme.primary }]}>See all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.recommendedList}>
          {recommendedDoctors.map((doc) => (
            <TouchableOpacity
              key={doc.id}
              style={[styles.docCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
              onPress={() => router.push(`/doctor/${doc.id}`)}
              activeOpacity={0.8}
            >
              <Image source={{ uri: doc.avatarUrl }} style={styles.recDocAvatar} />
              <View style={styles.recDocDetails}>
                <View style={styles.docHeaderRow}>
                  <Text style={[styles.recDocName, { color: theme.text }]}>{doc.name}</Text>
                  <View style={styles.ratingBadge}>
                    <Star size={12} color="#F59E0B" fill="#F59E0B" />
                    <Text style={styles.ratingText}>{doc.rating}</Text>
                  </View>
                </View>
                <Text style={[styles.recDocSpeciality, { color: theme.mutedText }]}>
                  {doc.specialityName} • {doc.experienceYears} yrs exp
                </Text>
                <Text style={[styles.recDocClinic, { color: theme.mutedText }]} numberOfLines={1}>
                  {doc.clinicAddress}
                </Text>
                <View style={styles.docFooterRow}>
                  <Text style={[styles.feeText, { color: theme.text }]}>
                    ₹{doc.consultationFee}{' '}
                    <Text style={[styles.feeSub, { color: theme.mutedText }]}>consultation</Text>
                  </Text>
                  <TouchableOpacity
                    style={[styles.quickBookBtn, { backgroundColor: theme.primary }]}
                    onPress={() => router.push(`/booking/${doc.id}`)}
                  >
                    <Text style={styles.quickBookBtnText}>Book Now</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
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
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  profileTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#58A88D',
  },
  greetingSub: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '500',
  },
  greetingTitle: {
    fontWeight: '700',
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: 'bold',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 0,
  },
  heroCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  heroTextContent: {
    gap: 8,
  },
  demoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#D1EAE0',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  demoPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#347C65',
  },
  heroHeading: {
    fontWeight: '800',
    color: '#1C3E33',
    lineHeight: 26,
  },
  heroSubtitle: {
    fontSize: 13,
    color: '#4B6359',
    lineHeight: 18,
    marginBottom: 6,
  },
  heroCTA: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  heroCTAText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontWeight: '700',
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '600',
  },
  appointmentCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 14,
  },
  aptTopRow: {
    flexDirection: 'row',
    gap: 12,
  },
  docAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  docInfo: {
    flex: 1,
    gap: 2,
  },
  docName: {
    fontSize: 16,
    fontWeight: '700',
  },
  docSpeciality: {
    fontSize: 13,
  },
  modeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  modeTagText: {
    fontSize: 12,
    color: '#168B80',
    fontWeight: '600',
  },
  aptMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaDivider: {
    width: 1,
    height: 14,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 12,
  },
  metaText: {
    fontSize: 13,
    fontWeight: '600',
  },
  aptActionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  joinBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  joinBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  detailsBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
  },
  detailsBtnText: {
    fontWeight: '600',
    fontSize: 13,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  quickActionCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
  },
  qaIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qaTitle: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  specialityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  specialityCard: {
    width: '48%',
    flexGrow: 1,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    gap: 6,
  },
  specIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  specName: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  specCount: {
    fontSize: 11,
  },
  recommendedList: {
    gap: 12,
  },
  docCard: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  recDocAvatar: {
    width: 68,
    height: 68,
    borderRadius: 14,
  },
  recDocDetails: {
    flex: 1,
    gap: 3,
  },
  docHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recDocName: {
    fontSize: 15,
    fontWeight: '700',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
  },
  recDocSpeciality: {
    fontSize: 12,
  },
  recDocClinic: {
    fontSize: 11,
  },
  docFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  feeText: {
    fontSize: 14,
    fontWeight: '800',
  },
  feeSub: {
    fontSize: 11,
    fontWeight: 'normal',
  },
  quickBookBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  quickBookBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
