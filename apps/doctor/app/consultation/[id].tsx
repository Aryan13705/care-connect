import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  PhoneOff,
  MessageSquare,
  FileEdit,
  ShieldCheck,
  Send,
  X,
  Heart,
  Droplet,
} from 'lucide-react-native';
import { useDoctor } from '../../src/context/DoctorContext';

export default function DoctorConsultationRoomScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme, appointments, doctor } = useDoctor();

  const appointment =
    appointments.find((a) => a.id === id || a.bookingReference === id) || appointments[0];

  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [seconds, setSeconds] = useState(380); // 06:20

  const [messages, setMessages] = useState<Array<{ sender: string; text: string; time: string; isDoctor: boolean }>>([
    {
      sender: doctor.name,
      text: 'Hello Aryan, I have opened your previous ECG and lipid panel. Please sit comfortably.',
      time: '10:31 AM',
      isDoctor: true,
    },
    {
      sender: appointment.patientName,
      text: 'Thank you Dr. Meera, ready whenever you are.',
      time: '10:32 AM',
      isDoctor: false,
    },
  ]);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const formatTimer = (tot: number) => {
    const m = Math.floor(tot / 60);
    const s = tot % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSend = () => {
    if (!messageInput.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        sender: doctor.name,
        text: messageInput.trim(),
        time: 'Just now',
        isDoctor: true,
      },
    ]);
    setMessageInput('');
  };

  const handleEndSession = () => {
    // Navigate doctor directly to consultation notes
    router.replace(`/consultation-notes/${appointment.id}`);
  };

  return (
    <View style={styles.container}>
      {/* 1. TOP CLINICAL BAR */}
      <View style={styles.topBar}>
        <View style={styles.statusPill}>
          <View style={styles.greenDot} />
          <Text style={styles.statusPillText}>Clinical Telehealth Room</Text>
          <Text style={styles.timerText}>{formatTimer(seconds)}</Text>
        </View>

        <View style={styles.vitalsSummary}>
          <Text style={styles.vitalsText}>
            Patient: {appointment.patientName} ({appointment.patientAge}y) • BP: 120/80
          </Text>
        </View>
      </View>

      {/* 2. MAIN VIDEO FEED (PATIENT FEED) */}
      <View style={styles.videoStage}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=600&h=800&fit=crop&crop=face' }}
          style={styles.patientVideoFeed}
        />

        {/* OVERLAY COMPLAINT */}
        <View style={styles.complaintOverlay}>
          <Text style={styles.complaintTitle}>Chief Complaint (Reported):</Text>
          <Text style={styles.complaintDesc}>{appointment.reasonForVisit}</Text>
        </View>

        {/* DOCTOR PiP SELF-VIEW */}
        <View style={styles.doctorPip}>
          {isVideoOn ? (
            <Image source={{ uri: doctor.avatarUrl }} style={styles.doctorPipImg} />
          ) : (
            <View style={styles.pipOff}>
              <Text style={styles.pipOffText}>Cam Off</Text>
            </View>
          )}
          <View style={styles.pipLabel}>
            <Text style={styles.pipLabelText}>Dr. Meera (You)</Text>
          </View>
        </View>
      </View>

      {/* 3. IN-CALL CHAT DRAWER */}
      {chatOpen && (
        <View style={styles.chatDrawer}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatHeaderTitle}>In-Consultation Patient Chat</Text>
            <TouchableOpacity onPress={() => setChatOpen(false)}>
              <X size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.chatScroll} contentContainerStyle={styles.chatContent}>
            {messages.map((m, idx) => (
              <View
                key={idx}
                style={[styles.bubble, m.isDoctor ? styles.bubbleDoc : styles.bubblePat]}
              >
                <Text style={styles.bubbleSender}>{m.sender}</Text>
                <Text style={styles.bubbleText}>{m.text}</Text>
              </View>
            ))}
          </ScrollView>

          <View style={styles.chatInputRow}>
            <TextInput
              value={messageInput}
              onChangeText={setMessageInput}
              placeholder="Type clinical instruction..."
              placeholderTextColor="#94A3B8"
              style={styles.chatInput}
            />
            <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
              <Send size={15} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* 4. CLINICAL CONTROLS DOCK */}
      <View style={styles.controlsDock}>
        <TouchableOpacity
          style={[styles.btn, !isMicOn && styles.btnOff]}
          onPress={() => setIsMicOn((prev) => !prev)}
        >
          {isMicOn ? <Mic size={20} color="#FFFFFF" /> : <MicOff size={20} color="#EF4444" />}
          <Text style={styles.btnLabel}>{isMicOn ? 'Mute' : 'Unmute'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, !isVideoOn && styles.btnOff]}
          onPress={() => setIsVideoOn((prev) => !prev)}
        >
          {isVideoOn ? <VideoIcon size={20} color="#FFFFFF" /> : <VideoOff size={20} color="#EF4444" />}
          <Text style={styles.btnLabel}>{isVideoOn ? 'Stop Cam' : 'Start Cam'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, chatOpen && styles.btnActive]}
          onPress={() => setChatOpen((prev) => !prev)}
        >
          <MessageSquare size={20} color="#FFFFFF" />
          <Text style={styles.btnLabel}>Chat</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btn}
          onPress={() => router.push(`/consultation-notes/${appointment.id}`)}
        >
          <FileEdit size={20} color="#38BDF8" />
          <Text style={styles.btnLabel}>Notes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn, styles.endBtn]} onPress={handleEndSession}>
          <PhoneOff size={20} color="#FFFFFF" />
          <Text style={styles.btnLabel}>End & Rx</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  topBar: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  statusPillText: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '700',
  },
  timerText: {
    color: '#94A3B8',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  vitalsSummary: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  vitalsText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
  },
  videoStage: {
    flex: 1,
    margin: 12,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#1E293B',
  },
  patientVideoFeed: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  complaintOverlay: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 130,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 10,
    gap: 2,
  },
  complaintTitle: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  complaintDesc: {
    color: '#FFFFFF',
    fontSize: 12,
    lineHeight: 16,
  },
  doctorPip: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 100,
    height: 140,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#14B8A6',
    overflow: 'hidden',
    backgroundColor: '#0F172A',
  },
  doctorPipImg: {
    width: '100%',
    height: '100%',
  },
  pipOff: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pipOffText: {
    color: '#94A3B8',
    fontSize: 10,
  },
  pipLabel: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  pipLabelText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '600',
  },
  chatDrawer: {
    position: 'absolute',
    bottom: 96,
    left: 12,
    right: 12,
    height: 250,
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    padding: 12,
    gap: 8,
    zIndex: 20,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    paddingBottom: 6,
  },
  chatHeaderTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  chatScroll: {
    flex: 1,
  },
  chatContent: {
    gap: 8,
  },
  bubble: {
    padding: 8,
    borderRadius: 10,
    maxWidth: '85%',
    gap: 2,
  },
  bubbleDoc: {
    alignSelf: 'flex-end',
    backgroundColor: '#0D9488',
  },
  bubblePat: {
    alignSelf: 'flex-start',
    backgroundColor: '#334155',
  },
  bubbleSender: {
    fontSize: 9,
    fontWeight: '700',
    color: '#E2E8F0',
  },
  bubbleText: {
    fontSize: 12,
    color: '#FFFFFF',
  },
  chatInputRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  chatInput: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    color: '#FFFFFF',
    fontSize: 12,
  },
  sendBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#0D9488',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlsDock: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: '#0F172A',
  },
  btn: {
    alignItems: 'center',
    gap: 4,
    padding: 8,
    borderRadius: 10,
    backgroundColor: '#1E293B',
    minWidth: 58,
  },
  btnOff: {
    backgroundColor: '#334155',
  },
  btnActive: {
    backgroundColor: '#0D9488',
  },
  endBtn: {
    backgroundColor: '#DC2626',
  },
  btnLabel: {
    color: '#E2E8F0',
    fontSize: 10,
    fontWeight: '600',
  },
});
