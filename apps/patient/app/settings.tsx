import React from 'react';
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
  Globe,
  Bell,
  Eye,
  Shield,
  HelpCircle,
  Info,
  ChevronRight,
  HeartHandshake,
} from 'lucide-react-native';
import { usePatient } from '../src/context/PatientContext';

export default function SettingsScreen() {
  const router = useRouter();
  const { theme, isDarkMode, toggleDarkMode, seniorMode, setSeniorMode } = usePatient();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [currentLang, setCurrentLang] = React.useState<'English' | 'Hindi'>('English');

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. APPEARANCE & THEME */}
      <View style={[styles.sectionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Appearance & Theme</Text>

        <View style={styles.settingRow}>
          <View style={styles.settingTextGroup}>
            <View style={styles.iconWithLabel}>
              {isDarkMode ? <Moon size={18} color={theme.text} /> : <Sun size={18} color="#D97706" />}
              <Text style={[styles.settingLabel, { color: theme.text }]}>Dark Mode</Text>
            </View>
            <Text style={[styles.settingSub, { color: theme.mutedText }]}>
              {isDarkMode ? 'Night theme active (Eases eye strain)' : 'Light theme active (Friendly mint & cream)'}
            </Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={toggleDarkMode}
            trackColor={{ false: '#CBD5E1', true: theme.primary }}
          />
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        {/* SENIOR ACCESSIBILITY MODE */}
        <View style={styles.settingRow}>
          <View style={styles.settingTextGroup}>
            <View style={styles.iconWithLabel}>
              <Eye size={18} color={theme.primaryDark || '#347C65'} />
              <Text style={[styles.settingLabel, { color: theme.text }]}>Senior Accessibility Mode</Text>
            </View>
            <Text style={[styles.settingSub, { color: theme.mutedText }]}>
              Larger fonts, high contrast badges, and comfortable touch targets
            </Text>
          </View>
          <Switch
            value={seniorMode}
            onValueChange={setSeniorMode}
            trackColor={{ false: '#CBD5E1', true: theme.primary }}
          />
        </View>
      </View>

      {/* 2. LOCALISATION & LANGUAGE */}
      <View style={[styles.sectionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Language & Regional</Text>

        <View style={styles.settingRow}>
          <View style={styles.settingTextGroup}>
            <View style={styles.iconWithLabel}>
              <Globe size={18} color={theme.text} />
              <Text style={[styles.settingLabel, { color: theme.text }]}>Display Language</Text>
            </View>
            <Text style={[styles.settingSub, { color: theme.mutedText }]}>
              English and Hindi localisation ready
            </Text>
          </View>

          <View style={styles.langToggleGroup}>
            <TouchableOpacity
              style={[
                styles.langBtn,
                {
                  backgroundColor: currentLang === 'English' ? (theme.primaryDark || '#347C65') : theme.background,
                  borderColor: theme.border,
                },
              ]}
              onPress={() => setCurrentLang('English')}
            >
              <Text
                style={[
                  styles.langBtnText,
                  { color: currentLang === 'English' ? '#FFFFFF' : theme.text },
                ]}
              >
                EN
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.langBtn,
                {
                  backgroundColor: currentLang === 'Hindi' ? (theme.primaryDark || '#347C65') : theme.background,
                  borderColor: theme.border,
                },
              ]}
              onPress={() => setCurrentLang('Hindi')}
            >
              <Text
                style={[
                  styles.langBtnText,
                  { color: currentLang === 'Hindi' ? '#FFFFFF' : theme.text },
                ]}
              >
                HI (हिंदी)
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* 3. NOTIFICATIONS */}
      <View style={[styles.sectionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Notifications & Reminders</Text>

        <View style={styles.settingRow}>
          <View style={styles.settingTextGroup}>
            <View style={styles.iconWithLabel}>
              <Bell size={18} color={theme.text} />
              <Text style={[styles.settingLabel, { color: theme.text }]}>Consultation Reminders</Text>
            </View>
            <Text style={[styles.settingSub, { color: theme.mutedText }]}>
              Push alerts 15 minutes before your video call
            </Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#CBD5E1', true: theme.primary }}
          />
        </View>
      </View>

      {/* 4. ABOUT & LEGAL */}
      <View style={[styles.sectionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>About & Support</Text>

        <TouchableOpacity
          style={styles.navRow}
          onPress={() => router.push('/support')}
        >
          <View style={styles.iconWithLabel}>
            <HelpCircle size={18} color={theme.text} />
            <Text style={[styles.settingLabel, { color: theme.text }]}>Help Center & FAQs</Text>
          </View>
          <ChevronRight size={18} color={theme.mutedText} />
        </TouchableOpacity>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <View style={styles.navRow}>
          <View style={styles.iconWithLabel}>
            <Shield size={18} color={theme.text} />
            <Text style={[styles.settingLabel, { color: theme.text }]}>Privacy & Local Data Policy</Text>
          </View>
          <Text style={[styles.versionTag, { color: theme.mutedText }]}>Phase 1 Demo</Text>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <View style={styles.aboutRow}>
          <HeartHandshake size={24} color={theme.primaryDark || '#347C65'} />
          <View>
            <Text style={[styles.aboutBrand, { color: theme.text }]}>CareConnect Platform</Text>
            <Text style={[styles.aboutTagline, { color: theme.mutedText }]}>
              Healthcare, with a human touch.
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
  sectionCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
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
  settingTextGroup: {
    flex: 1,
    gap: 2,
  },
  iconWithLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  settingSub: {
    fontSize: 12,
    lineHeight: 16,
  },
  divider: {
    height: 1,
  },
  langToggleGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  langBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  langBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  versionTag: {
    fontSize: 11,
  },
  aboutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 6,
  },
  aboutBrand: {
    fontSize: 14,
    fontWeight: '700',
  },
  aboutTagline: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  aboutVersion: {
    fontSize: 11,
    marginTop: 2,
  },
});
