import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import {
  Clock,
  Calendar,
  Sliders,
  DollarSign,
  Video,
  MapPin,
  Check,
  ShieldCheck,
} from 'lucide-react-native';
import { useDoctor } from '../src/context/DoctorContext';

export default function AvailabilityManagementScreen() {
  const { theme, availability, updateAvailability, doctor, updateDoctorProfile } = useDoctor();

  const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const [workingDays, setWorkingDays] = useState<string[]>(availability.workingDays);
  const [startTime, setStartTime] = useState(availability.startTime);
  const [endTime, setEndTime] = useState(availability.endTime);
  const [slotDuration, setSlotDuration] = useState<number>(availability.slotDurationMinutes);
  const [fee, setFee] = useState<string>(availability.consultationFee.toString());
  const [videoEnabled, setVideoEnabled] = useState(availability.videoEnabled);
  const [inPersonEnabled, setInPersonEnabled] = useState(availability.inPersonEnabled);
  const [saved, setSaved] = useState(false);

  const toggleDay = (day: string) => {
    if (workingDays.includes(day)) {
      if (workingDays.length <= 1) {
        Alert.alert('Required', 'You must be available at least one day per week.');
        return;
      }
      setWorkingDays(workingDays.filter((d) => d !== day));
    } else {
      setWorkingDays([...workingDays, day]);
    }
  };

  const handleSave = () => {
    const numFee = parseInt(fee) || 800;
    updateAvailability({
      workingDays,
      startTime,
      endTime,
      slotDurationMinutes: slotDuration,
      consultationFee: numFee,
      videoEnabled,
      inPersonEnabled,
    });
    updateDoctorProfile({
      consultationFee: numFee,
      availableDays: workingDays,
      slotDurationMinutes: slotDuration,
    });

    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      Alert.alert('Availability Updated', 'Your consultation schedule and fees are now active in the Patient app!');
    }, 800);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* HEADER NOTICE */}
        <View style={[styles.headerBanner, { backgroundColor: theme.accent || '#E3F3F0', borderColor: theme.border }]}>
          <ShieldCheck size={18} color={theme.primaryDark || '#116C64'} />
          <Text style={[styles.headerBannerText, { color: theme.primaryDark || '#116C64' }]}>
            Configuring slots automatically schedules patient booking intervals in local demonstration mode.
          </Text>
        </View>

        {/* 1. WORKING DAYS */}
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>1. Working Days</Text>
          <Text style={[styles.cardSubtitle, { color: theme.mutedText }]}>
            Select the days patients can schedule appointments with you.
          </Text>

          <View style={styles.daysGrid}>
            {allDays.map((day) => {
              const isSelected = workingDays.includes(day);
              return (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dayChip,
                    {
                      backgroundColor: isSelected ? (theme.primaryDark || '#116C64') : theme.background,
                      borderColor: theme.border,
                    },
                  ]}
                  onPress={() => toggleDay(day)}
                >
                  <Text
                    style={[
                      styles.dayChipText,
                      { color: isSelected ? '#FFFFFF' : theme.text },
                    ]}
                  >
                    {day.slice(0, 3)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 2. HOURS & DURATION */}
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>2. Consultation Hours & Slot Duration</Text>

          <View style={styles.hoursRow}>
            <View style={[styles.hourInputWrap, { flex: 1 }]}>
              <Text style={[styles.inputLabel, { color: theme.mutedText }]}>Start Time</Text>
              <TextInput
                value={startTime}
                onChangeText={setStartTime}
                style={[styles.input, { color: theme.text, borderColor: theme.border }]}
              />
            </View>

            <View style={[styles.hourInputWrap, { flex: 1 }]}>
              <Text style={[styles.inputLabel, { color: theme.mutedText }]}>End Time</Text>
              <TextInput
                value={endTime}
                onChangeText={setEndTime}
                style={[styles.input, { color: theme.text, borderColor: theme.border }]}
              />
            </View>
          </View>

          <View style={styles.durationGroup}>
            <Text style={[styles.inputLabel, { color: theme.mutedText }]}>Slot Duration</Text>
            <View style={styles.durationsRow}>
              {[15, 20, 30, 45].map((dur) => (
                <TouchableOpacity
                  key={dur}
                  style={[
                    styles.durPill,
                    {
                      backgroundColor: slotDuration === dur ? (theme.primaryDark || '#116C64') : theme.background,
                      borderColor: theme.border,
                    },
                  ]}
                  onPress={() => setSlotDuration(dur)}
                >
                  <Text
                    style={[
                      styles.durPillText,
                      { color: slotDuration === dur ? '#FFFFFF' : theme.text },
                    ]}
                  >
                    {dur} mins
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* 3. CONSULTATION FEE */}
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>3. Consultation Fee</Text>
          <Text style={[styles.cardSubtitle, { color: theme.mutedText }]}>
            Standard charge displayed to patients on the CareConnect directory.
          </Text>

          <View style={styles.feeInputWrap}>
            <Text style={[styles.currencyPrefix, { color: theme.text }]}>₹</Text>
            <TextInput
              value={fee}
              onChangeText={setFee}
              keyboardType="numeric"
              style={[styles.feeInput, { color: theme.text, borderColor: theme.border }]}
            />
            <Text style={[styles.feeSuffix, { color: theme.mutedText }]}>INR per consultation</Text>
          </View>
        </View>

        {/* 4. MODALITIES */}
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>4. Consultation Channels</Text>

          <View style={styles.channelRow}>
            <View style={styles.channelTextGroup}>
              <Video size={16} color={theme.text} />
              <Text style={[styles.channelLabel, { color: theme.text }]}>Virtual Video Telehealth</Text>
            </View>
            <Switch
              value={videoEnabled}
              onValueChange={setVideoEnabled}
              trackColor={{ false: '#CBD5E1', true: theme.primary }}
            />
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <View style={styles.channelRow}>
            <View style={styles.channelTextGroup}>
              <MapPin size={16} color={theme.text} />
              <Text style={[styles.channelLabel, { color: theme.text }]}>In-Clinic In-Person Visits</Text>
            </View>
            <Switch
              value={inPersonEnabled}
              onValueChange={setInPersonEnabled}
              trackColor={{ false: '#CBD5E1', true: theme.primary }}
            />
          </View>
        </View>
      </ScrollView>

      {/* SAVE BUTTON DOCK */}
      <View style={[styles.saveDock, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: theme.primary }]}
          onPress={handleSave}
        >
          <Check size={18} color="#FFFFFF" />
          <Text style={styles.saveBtnText}>
            {saved ? 'Changes Saved!' : 'Save Availability Settings'}
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
  headerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  headerBannerText: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
    lineHeight: 16,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  cardSubtitle: {
    fontSize: 12,
    lineHeight: 16,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  dayChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  dayChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  hoursRow: {
    flexDirection: 'row',
    gap: 12,
  },
  hourInputWrap: {
    gap: 4,
  },
  inputLabel: {
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
  durationGroup: {
    gap: 6,
    marginTop: 4,
  },
  durationsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  durPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  durPillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  feeInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  currencyPrefix: {
    fontSize: 20,
    fontWeight: '700',
  },
  feeInput: {
    width: 120,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    fontWeight: '700',
  },
  feeSuffix: {
    fontSize: 12,
  },
  channelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  channelTextGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  channelLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  divider: {
    height: 1,
  },
  saveDock: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    padding: 14,
  },
  saveBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});
