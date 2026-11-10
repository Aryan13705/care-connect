import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Stethoscope,
  HeartPulse,
  Sparkles,
  Brain,
  Bone,
  Baby,
  Flower2,
  Ear,
  SmilePlus,
  Eye,
  Smile,
  Wind,
  ChevronRight,
} from 'lucide-react-native';
import { usePatient } from '../src/context/PatientContext';

export default function SpecialitiesDirectoryScreen() {
  const router = useRouter();
  const { theme, specialities, seniorMode } = usePatient();

  const getIcon = (name: string, color: string) => {
    switch (name.toLowerCase()) {
      case 'general physician':
        return <Stethoscope size={28} color={color} />;
      case 'cardiology':
        return <HeartPulse size={28} color={color} />;
      case 'dermatology':
        return <Sparkles size={28} color={color} />;
      case 'neurology':
        return <Brain size={28} color={color} />;
      case 'orthopaedics':
        return <Bone size={28} color={color} />;
      case 'paediatrics':
        return <Baby size={28} color={color} />;
      case 'gynaecology & obstetrics':
      case 'gynaecology':
        return <Flower2 size={28} color={color} />;
      case 'ear, nose & throat (ent)':
      case 'ent':
        return <Ear size={28} color={color} />;
      case 'psychiatry & mental health':
      case 'psychiatry':
        return <SmilePlus size={28} color={color} />;
      case 'ophthalmology':
        return <Eye size={28} color={color} />;
      case 'dentistry':
        return <Smile size={28} color={color} />;
      case 'pulmonology':
        return <Wind size={28} color={color} />;
      default:
        return <Stethoscope size={28} color={color} />;
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text, fontSize: seniorMode ? 24 : 20 }]}>
          Medical Specialities Directory
        </Text>
        <Text style={[styles.subtitle, { color: theme.mutedText }]}>
          Select a medical domain to find specialized consultants and review practice areas.
        </Text>
      </View>

      <View style={styles.grid}>
        {specialities.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}
            onPress={() => router.push({ pathname: '/(tabs)/doctors', params: { specialityId: item.id } })}
            activeOpacity={0.8}
          >
            <View style={styles.cardTop}>
              <View style={[styles.iconWrap, { backgroundColor: theme.background }]}>
                {getIcon(item.name, item.accentColor)}
              </View>
              <View style={styles.cardHeaderInfo}>
                <Text style={[styles.specName, { color: theme.text, fontSize: seniorMode ? 17 : 15 }]}>
                  {item.name}
                </Text>
                <Text style={[styles.docCount, { color: theme.primaryDark || theme.primary }]}>
                  {item.doctorCount} Sample Doctors
                </Text>
              </View>
              <ChevronRight size={18} color={theme.mutedText} />
            </View>

            <Text style={[styles.description, { color: theme.mutedText }]}>{item.description}</Text>

            <View style={styles.symptomsRow}>
              {item.commonSymptoms.slice(0, 3).map((sym) => (
                <View key={sym} style={[styles.symBadge, { backgroundColor: theme.background }]}>
                  <Text style={[styles.symText, { color: theme.text }]}>{sym}</Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>
        ))}
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
  header: {
    gap: 4,
  },
  title: {
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  grid: {
    gap: 12,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardHeaderInfo: {
    flex: 1,
    gap: 2,
  },
  specName: {
    fontWeight: '700',
  },
  docCount: {
    fontSize: 12,
    fontWeight: '600',
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
  },
  symptomsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  symBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  symText: {
    fontSize: 11,
    fontWeight: '500',
  },
});
