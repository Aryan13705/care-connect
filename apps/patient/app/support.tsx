import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import {
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Mail,
  Phone,
  Send,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react-native';
import { usePatient } from '../src/context/PatientContext';

export default function SupportScreen() {
  const { theme, seniorMode } = usePatient();

  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState<'Telehealth' | 'Booking' | 'Records' | 'Other'>('Booking');
  const [ticketMessage, setTicketMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const faqs = [
    {
      q: 'How does a video consultation work on CareConnect?',
      a: 'Once your appointment slot arrives, navigate to Appointments and tap "Enter Video Room". You will be placed in a virtual consultation room where you can communicate with your doctor, share clinical concerns, and receive digital care summaries.',
    },
    {
      q: 'Is my prescription valid for purchasing medicine?',
      a: 'In Phase 1, all prescriptions shown are demonstration samples for UI/UX testing and carry a "SAMPLE" watermark. In Phase 2, verified digital signatures complying with telemedicine regulations will be integrated.',
    },
    {
      q: 'Can I book consultations for my family members?',
      a: 'Yes! Go to the Family Health tab or select a family member during step 4 of the appointment booking flow.',
    },
    {
      q: 'How do I cancel or reschedule an upcoming appointment?',
      a: 'Go to Appointments, find the scheduled consultation card, and tap "Reschedule" to pick a new date/time or "Cancel" to free up the slot.',
    },
  ];

  const handleSubmitTicket = () => {
    if (!ticketSubject.trim() || !ticketMessage.trim()) {
      Alert.alert('Required Fields', 'Please enter a subject and message.');
      return;
    }
    setSubmitted(true);
    setTimeout(() => {
      setTicketSubject('');
      setTicketMessage('');
      setSubmitted(false);
      Alert.alert('Demo Ticket Received', 'Our support team will review your feedback in the Admin dashboard!');
    }, 1000);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. FAQS ACCORDION */}
      <View style={[styles.sectionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={styles.sectionHeader}>
          <HelpCircle size={20} color={theme.primaryDark || '#347C65'} />
          <Text style={[styles.sectionTitle, { color: theme.text, fontSize: seniorMode ? 18 : 16 }]}>
            Frequently Asked Questions
          </Text>
        </View>

        <View style={styles.faqsList}>
          {faqs.map((faq, index) => {
            const isExpanded = expandedFaq === index;
            return (
              <TouchableOpacity
                key={index}
                style={[styles.faqItem, { backgroundColor: theme.background, borderColor: theme.border }]}
                onPress={() => setExpandedFaq(isExpanded ? null : index)}
                activeOpacity={0.8}
              >
                <View style={styles.faqQuestionRow}>
                  <Text style={[styles.faqQuestion, { color: theme.text, fontSize: seniorMode ? 15 : 13 }]}>
                    {faq.q}
                  </Text>
                  {isExpanded ? (
                    <ChevronUp size={16} color={theme.mutedText} />
                  ) : (
                    <ChevronDown size={16} color={theme.mutedText} />
                  )}
                </View>
                {isExpanded && (
                  <Text style={[styles.faqAnswer, { color: theme.mutedText }]}>{faq.a}</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* 2. DIRECT CONTACT INFO */}
      <View style={[styles.sectionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Direct Support Channels</Text>

        <View style={styles.contactRow}>
          <Mail size={16} color={theme.primaryDark || '#347C65'} />
          <View>
            <Text style={[styles.contactLabel, { color: theme.mutedText }]}>Email Assistance</Text>
            <Text style={[styles.contactVal, { color: theme.text }]}>support@careconnect.demo</Text>
          </View>
        </View>

        <View style={styles.contactRow}>
          <Phone size={16} color={theme.primaryDark || '#347C65'} />
          <View>
            <Text style={[styles.contactLabel, { color: theme.mutedText }]}>Toll-Free Patient Helpline</Text>
            <Text style={[styles.contactVal, { color: theme.text }]}>1800-200-CARE (Mon-Sat 8am-8pm)</Text>
          </View>
        </View>
      </View>

      {/* 3. REPORT AN ISSUE / FEEDBACK FORM */}
      <View style={[styles.sectionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Report an Issue or Send Feedback</Text>

        <View style={styles.formGroup}>
          <Text style={[styles.inputLabel, { color: theme.mutedText }]}>Category</Text>
          <View style={styles.categoryChips}>
            {(['Booking', 'Telehealth', 'Records', 'Other'] as const).map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.catChip,
                  {
                    backgroundColor: ticketCategory === cat ? (theme.primaryDark || '#347C65') : theme.background,
                    borderColor: theme.border,
                  },
                ]}
                onPress={() => setTicketCategory(cat)}
              >
                <Text
                  style={[
                    styles.catChipText,
                    { color: ticketCategory === cat ? '#FFFFFF' : theme.text },
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.inputLabel, { color: theme.mutedText }]}>Subject</Text>
          <TextInput
            value={ticketSubject}
            onChangeText={setTicketSubject}
            placeholder="Brief summary of your query..."
            placeholderTextColor={theme.mutedText}
            style={[styles.input, { color: theme.text, borderColor: theme.border }]}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.inputLabel, { color: theme.mutedText }]}>Message / Details</Text>
          <TextInput
            value={ticketMessage}
            onChangeText={setTicketMessage}
            placeholder="Describe your issue or suggestions in detail..."
            placeholderTextColor={theme.mutedText}
            style={[styles.input, styles.textArea, { color: theme.text, borderColor: theme.border }]}
            multiline
          />
        </View>

        <TouchableOpacity
          style={[styles.submitBtn, { backgroundColor: theme.primary }]}
          onPress={handleSubmitTicket}
          disabled={submitted}
        >
          {submitted ? (
            <CheckCircle2 size={16} color="#FFFFFF" />
          ) : (
            <Send size={16} color="#FFFFFF" />
          )}
          <Text style={styles.submitBtnText}>
            {submitted ? 'Submitting Feedback...' : 'Submit Support Request'}
          </Text>
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  faqsList: {
    gap: 8,
  },
  faqItem: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  faqQuestionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  faqQuestion: {
    fontWeight: '600',
    flex: 1,
  },
  faqAnswer: {
    fontSize: 12,
    lineHeight: 17,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  contactLabel: {
    fontSize: 11,
  },
  contactVal: {
    fontSize: 13,
    fontWeight: '600',
  },
  formGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  categoryChips: {
    flexDirection: 'row',
    gap: 8,
  },
  catChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  catChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  submitBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 4,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});
