import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Moon,
  Sun,
  Bell,
  Globe,
  Shield,
  HelpCircle,
  Building,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react-native';
import { useDoctor } from '../src/context/DoctorContext';

export default function DoctorSettingsScreen() {
  const router = useRouter();
  const { theme, isDarkMode, toggleDarkMode, doctor } = useDoctor();

  const [bookingAlerts, setBookingAlerts] = useState(true);
  const [telehealthReminders, setTelehealthReminders] = useState(true);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. CLINICAL WORKSPACE THEME */}
      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Clinical Workspace Appearance</Text>

        <View style={styles.settingRow}>
          <View style={styles.settingTexts}>
            <View style={styles.labelRow}>
              {isDarkMode ? <Moon size={18} color={theme.text} /> : <Sun size={18} color="#D97706" />}
              <Text style={[styles.settingLabel, { color: theme.text }]}>Clinical Dark Theme</Text>
            </View>
            <Text style={[styles.settingSub, { color: theme.mutedText }]}>
              {isDarkMode ? 'High contrast dark clinical mode active' : 'Clean daylight clinical workspace active'}
            </Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={toggleDarkMode}
            trackColor={{ false: '#CBD5E1', true: theme.primary }}
          />
        </View>
      </View>

      {/* 2. CLINICAL ALERTS */}
      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Appointment Alerts & Notifications</Text>

        <View style={styles.settingRow}>
          <View style={styles.settingTexts}>
            <View style={styles.labelRow}>
              <Bell size={18} color={theme.text} />
              <Text style={[styles.settingLabel, { color: theme.text }]}>Instant Booking Alerts</Text>
            </View>
            <Text style={[styles.settingSub, { color: theme.mutedText }]}>
              Notified as soon as a patient books an available slot
            </Text>
          </View>
          <Switch
            value={bookingAlerts}
            onValueChange={setBookingAlerts}
            trackColor={{ false: '#CBD5E1', true: theme.primary }}
          />
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <View style={styles.settingRow}>
          <View style={styles.settingTexts}>
            <View style={styles.labelRow}>
              <Bell size={18} color={theme.text} />
              <Text style={[styles.settingLabel, { color: theme.text }]}>10-Minute Call Reminders</Text>
            </View>
            <Text style={[styles.settingSub, { color: theme.mutedText }]}>
              Prompt to launch virtual teleconsultation room
            </Text>
          </View>
          <Switch
            value={telehealthReminders}
            onValueChange={setTelehealthReminders}
            trackColor={{ false: '#CBD5E1', true: theme.primary }}
          />
        </View>
      </View>

      {/* 3. ABOUT & PROTOCOLS */}
      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Clinical Compliance & Protocols</Text>

        <View style={styles.itemRow}>
          <View style={styles.labelRow}>
            <ShieldCheck size={18} color="#059669" />
            <Text style={[styles.settingLabel, { color: theme.text }]}>Telemedicine Practice Guidelines</Text>
          </View>
          <Text style={[styles.badgeText, { color: theme.mutedText }]}>Compliant</Text>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <View style={styles.itemRow}>
          <View style={styles.labelRow}>
            <Shield size={18} color={theme.text} />
            <Text style={[styles.settingLabel, { color: theme.text }]}>Local Data Demonstration Mode</Text>
          </View>
          <Text style={[styles.badgeText, { color: theme.mutedText }]}>Phase 1 Active</Text>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <View style={styles.aboutBlock}>
          <Building size={20} color={theme.primaryDark || '#116C64'} />
          <View>
            <Text style={[styles.aboutBrand, { color: theme.text }]}>CareConnect Doctor Workspace</Text>
            <Text style={[styles.aboutSub, { color: theme.mutedText }]}>
              Logged in as: {doctor.name} ({doctor.registrationNumber})
            </Text>
            <Text style={[styles.aboutVersion, { color: theme.mutedText }]}>
              Version 1.0.0-demo (Build 2026.11)
            </Text>
          </View>
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
    gap: 16,
    paddingBottom: 40,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  settingTexts: {
    flex: 1,
    gap: 2,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  settingSub: {
    fontSize: 11,
    lineHeight: 15,
  },
  divider: {
    height: 1,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  aboutBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 6,
  },
  aboutBrand: {
    fontSize: 13,
    fontWeight: '700',
  },
  aboutSub: {
    fontSize: 11,
  },
  aboutVersion: {
    fontSize: 10,
    marginTop: 2,
  },
});
