import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  Search,
  Filter,
  Star,
  Clock,
  Globe,
  Award,
  ShieldCheck,
  ChevronDown,
  X,
} from 'lucide-react-native';
import { usePatient } from '../../src/context/PatientContext';

export default function DoctorDiscoveryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ query?: string; specialityId?: string }>();
  const { theme, doctors, specialities, seniorMode } = usePatient();

  const [searchQuery, setSearchQuery] = useState(params.query || '');
  const [selectedSpeciality, setSelectedSpeciality] = useState(params.specialityId || 'all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [maxFee, setMaxFee] = useState<number>(1200);
  const [sortBy, setSortBy] = useState<'recommended' | 'fee_asc' | 'rating_desc'>('recommended');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  const languagesList = ['all', 'English', 'Hindi', 'Gujarati', 'Tamil', 'Kannada', 'Bengali'];

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        doc.name.toLowerCase().includes(q) ||
        doc.specialityName.toLowerCase().includes(q) ||
        doc.areasOfPractice.some((a) => a.toLowerCase().includes(q)) ||
        doc.clinicAddress.toLowerCase().includes(q);

      const matchesSpeciality =
        selectedSpeciality === 'all' || doc.specialityId === selectedSpeciality;

      const matchesLanguage =
        selectedLanguage === 'all' || doc.languages.includes(selectedLanguage);

      const matchesFee = doc.consultationFee <= maxFee;

      return matchesSearch && matchesSpeciality && matchesLanguage && matchesFee;
    }).sort((a, b) => {
      if (sortBy === 'fee_asc') return a.consultationFee - b.consultationFee;
      if (sortBy === 'rating_desc') return b.rating - a.rating;
      return b.reviewCount - a.reviewCount;
    });
  }, [doctors, searchQuery, selectedSpeciality, selectedLanguage, maxFee, sortBy]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* SEARCH AND FILTER BAR */}
      <View style={[styles.searchHeader, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <View style={[styles.searchBox, { backgroundColor: theme.background, borderColor: theme.border }]}>
          <Search size={18} color={theme.mutedText} style={styles.searchIcon} />
          <TextInput
            placeholder="Search doctors, skills, conditions..."
            placeholderTextColor={theme.mutedText}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[styles.searchInput, { color: theme.text, fontSize: seniorMode ? 16 : 14 }]}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={18} color={theme.mutedText} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.filterToggleBtn,
            { backgroundColor: showFilterDrawer ? (theme.mint || '#E7F4ED') : theme.background, borderColor: theme.border },
          ]}
          onPress={() => setShowFilterDrawer((prev) => !prev)}
        >
          <Filter size={18} color={showFilterDrawer ? theme.primaryDark || '#347C65' : theme.text} />
        </TouchableOpacity>
      </View>

      {/* FILTER DRAWER / EXPANDABLE CONTROLS */}
      {showFilterDrawer && (
        <View style={[styles.filterDrawer, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
          <View style={styles.filterRow}>
            <Text style={[styles.filterLabel, { color: theme.mutedText }]}>Max Fee: ₹{maxFee}</Text>
            <View style={styles.feeChips}>
              {[500, 800, 1000, 1200].map((fee) => (
                <TouchableOpacity
                  key={fee}
                  style={[
                    styles.feeChip,
                    {
                      backgroundColor: maxFee === fee ? theme.primary : theme.background,
                      borderColor: theme.border,
                    },
                  ]}
                  onPress={() => setMaxFee(fee)}
                >
                  <Text
                    style={[
                      styles.feeChipText,
                      { color: maxFee === fee ? '#FFFFFF' : theme.text },
                    ]}
                  >
                    ≤ ₹{fee}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.filterRow}>
            <Text style={[styles.filterLabel, { color: theme.mutedText }]}>Language:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.langChips}>
              {languagesList.map((lang) => (
                <TouchableOpacity
                  key={lang}
                  style={[
                    styles.langChip,
                    {
                      backgroundColor: selectedLanguage === lang ? (theme.mint || '#E7F4ED') : theme.background,
                      borderColor: selectedLanguage === lang ? (theme.primaryDark || '#347C65') : theme.border,
                    },
                  ]}
                  onPress={() => setSelectedLanguage(lang)}
                >
                  <Text
                    style={[
                      styles.langChipText,
                      {
                        color: selectedLanguage === lang ? (theme.primaryDark || '#347C65') : theme.text,
                        fontWeight: selectedLanguage === lang ? '700' : '500',
                      },
                    ]}
                  >
                    {lang === 'all' ? 'All Languages' : lang}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.filterRow}>
            <Text style={[styles.filterLabel, { color: theme.mutedText }]}>Sort By:</Text>
            <View style={styles.sortChips}>
              {[
                { id: 'recommended', label: 'Recommended' },
                { id: 'fee_asc', label: 'Lowest Fee' },
                { id: 'rating_desc', label: 'Top Rated' },
              ].map((s) => (
                <TouchableOpacity
                  key={s.id}
                  style={[
                    styles.sortChip,
                    {
                      backgroundColor: sortBy === s.id ? (theme.primaryDark || '#347C65') : theme.background,
                      borderColor: theme.border,
                    },
                  ]}
                  onPress={() => setSortBy(s.id as any)}
                >
                  <Text
                    style={[
                      styles.sortChipText,
                      { color: sortBy === s.id ? '#FFFFFF' : theme.text },
                    ]}
                  >
                    {s.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* SPECIALITIES HORIZONTAL PILLS */}
      <View style={[styles.specialityPillsBar, { backgroundColor: theme.surface }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillsScroll}>
          <TouchableOpacity
            style={[
              styles.specPill,
              {
                backgroundColor: selectedSpeciality === 'all' ? (theme.primaryDark || '#347C65') : theme.background,
                borderColor: theme.border,
              },
            ]}
            onPress={() => setSelectedSpeciality('all')}
          >
            <Text
              style={[
                styles.specPillText,
                { color: selectedSpeciality === 'all' ? '#FFFFFF' : theme.text },
              ]}
            >
              All Specialities
            </Text>
          </TouchableOpacity>

          {specialities.map((s) => (
            <TouchableOpacity
              key={s.id}
              style={[
                styles.specPill,
                {
                  backgroundColor: selectedSpeciality === s.id ? (theme.primaryDark || '#347C65') : theme.background,
                  borderColor: theme.border,
                },
              ]}
              onPress={() => setSelectedSpeciality(s.id)}
            >
              <Text
                style={[
                  styles.specPillText,
                  { color: selectedSpeciality === s.id ? '#FFFFFF' : theme.text },
                ]}
              >
                {s.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* RESULTS COUNT & DEMO NOTICE */}
      <View style={styles.resultsInfoRow}>
        <Text style={[styles.resultsCountText, { color: theme.mutedText }]}>
          Found {filteredDoctors.length} {filteredDoctors.length === 1 ? 'doctor' : 'doctors'}
        </Text>
        <View style={styles.demoNoticeTag}>
          <ShieldCheck size={12} color="#059669" />
          <Text style={styles.demoNoticeText}>Sample Profiles</Text>
        </View>
      </View>

      {/* DOCTOR CARDS LIST */}
      <ScrollView
        contentContainerStyle={styles.doctorsList}
        showsVerticalScrollIndicator={false}
      >
        {filteredDoctors.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyTitle, { color: theme.text }]}>No doctors found</Text>
            <Text style={[styles.emptySubtitle, { color: theme.mutedText }]}>
              Try adjusting your search query, fee range, or speciality filters.
            </Text>
            <TouchableOpacity
              style={[styles.resetBtn, { backgroundColor: theme.primary }]}
              onPress={() => {
                setSearchQuery('');
                setSelectedSpeciality('all');
                setSelectedLanguage('all');
                setMaxFee(1200);
              }}
            >
              <Text style={styles.resetBtnText}>Reset All Filters</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredDoctors.map((doc) => (
            <TouchableOpacity
              key={doc.id}
              style={[styles.doctorCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
              onPress={() => router.push(`/doctor/${doc.id}`)}
              activeOpacity={0.8}
            >
              <View style={styles.docCardTop}>
                <Image source={{ uri: doc.avatarUrl }} style={styles.doctorImg} />
                <View style={styles.docMainInfo}>
                  <View style={styles.nameRow}>
                    <Text style={[styles.doctorName, { color: theme.text, fontSize: seniorMode ? 17 : 15 }]}>
                      {doc.name}
                    </Text>
                    <View style={styles.ratingBox}>
                      <Star size={12} color="#F59E0B" fill="#F59E0B" />
                      <Text style={styles.ratingVal}>{doc.rating}</Text>
                    </View>
                  </View>

                  <Text style={[styles.doctorSpec, { color: theme.primaryDark || theme.primary }]}>
                    {doc.specialityName}
                  </Text>
                  <Text style={[styles.doctorQual, { color: theme.mutedText }]} numberOfLines={1}>
                    {doc.qualification}
                  </Text>

                  <View style={styles.badgeRow}>
                    <View style={styles.metaBadge}>
                      <Award size={11} color={theme.mutedText} />
                      <Text style={[styles.metaBadgeText, { color: theme.mutedText }]}>
                        {doc.experienceYears}+ years exp
                      </Text>
                    </View>
                    <View style={styles.metaBadge}>
                      <Globe size={11} color={theme.mutedText} />
                      <Text style={[styles.metaBadgeText, { color: theme.mutedText }]}>
                        {doc.languages.slice(0, 2).join(', ')}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Slot availability pill */}
              <View style={[styles.slotRow, { backgroundColor: theme.background, borderColor: theme.border }]}>
                <View style={styles.slotIndicator}>
                  <Clock size={12} color="#168B80" />
                  <Text style={styles.slotText}>Next Slot: {doc.nextAvailableSlot}</Text>
                </View>
                <View style={styles.demoTag}>
                  <Text style={styles.demoTagText}>Demo Profile</Text>
                </View>
              </View>

              {/* Fee and Action Button */}
              <View style={styles.cardBottomRow}>
                <View>
                  <Text style={[styles.feeNumber, { color: theme.text, fontSize: seniorMode ? 18 : 16 }]}>
                    ₹{doc.consultationFee}
                  </Text>
                  <Text style={[styles.feeLabel, { color: theme.mutedText }]}>per consultation</Text>
                </View>
                <TouchableOpacity
                  style={[styles.bookBtn, { backgroundColor: theme.primary }]}
                  onPress={() => router.push(`/booking/${doc.id}`)}
                >
                  <Text style={styles.bookBtnText}>Book Appointment</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 10,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 0,
  },
  filterToggleBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterDrawer: {
    padding: 16,
    borderBottomWidth: 1,
    gap: 12,
  },
  filterRow: {
    gap: 6,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  feeChips: {
    flexDirection: 'row',
    gap: 8,
  },
  feeChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  feeChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  langChips: {
    flexDirection: 'row',
    gap: 8,
  },
  langChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  langChipText: {
    fontSize: 12,
  },
  sortChips: {
    flexDirection: 'row',
    gap: 8,
  },
  sortChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  sortChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  specialityPillsBar: {
    paddingVertical: 10,
  },
  pillsScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  specPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  specPillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  resultsInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  resultsCountText: {
    fontSize: 12,
    fontWeight: '500',
  },
  demoNoticeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  demoNoticeText: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '600',
  },
  doctorsList: {
    padding: 16,
    paddingTop: 8,
    gap: 14,
    paddingBottom: 40,
  },
  doctorCard: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  docCardTop: {
    flexDirection: 'row',
    gap: 12,
  },
  doctorImg: {
    width: 68,
    height: 68,
    borderRadius: 14,
  },
  docMainInfo: {
    flex: 1,
    gap: 2,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  doctorName: {
    fontWeight: '700',
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ratingVal: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
  },
  doctorSpec: {
    fontSize: 13,
    fontWeight: '600',
  },
  doctorQual: {
    fontSize: 11,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  metaBadgeText: {
    fontSize: 11,
  },
  slotRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  slotIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  slotText: {
    fontSize: 11,
    color: '#168B80',
    fontWeight: '600',
  },
  demoTag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  demoTagText: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '500',
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
  },
  feeNumber: {
    fontWeight: '800',
  },
  feeLabel: {
    fontSize: 10,
  },
  bookBtn: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 10,
  },
  bookBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  resetBtn: {
    marginTop: 12,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  resetBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
});
