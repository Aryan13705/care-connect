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
  ShieldCheck,
  Send,
  User,
  X,
} from 'lucide-react-native';
import { usePatient } from '../../src/context/PatientContext';

export default function TeleconsultationRoomScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme, appointments, patient } = usePatient();

  const appointment = appointments.find((a) => a.id === id || a.bookingReference === id) || appointments[0];

  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [secondsElapsed, setSecondsElapsed] = useState(240); // 04:00 demo timer

  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string; time: string; isSelf: boolean }>>([
    {
      sender: appointment.doctorName,
      text: 'Good morning Aryan! I have reviewed your previous lab reports. How are you feeling today?',
      time: '10:31 AM',
      isSelf: false,
    },
    {
      sender: 'You',
      text: 'Good morning Doctor. Doing much better, but had a few questions about my morning medication routine.',
      time: '10:32 AM',
      isSelf: true,
    },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      {
        sender: 'You',
        text: messageInput.trim(),
        time: 'Just now',
        isSelf: true,
      },
    ]);
    setMessageInput('');
  };

  return (
    <View style={styles.container}>
      {/* 1. TOP STATUS BAR */}
      <View style={styles.topBar}>
        <View style={styles.statusPill}>
          <View style={styles.activeDot} />
          <Text style={styles.statusPillText}>Connected (Demo)</Text>
          <Text style={styles.timerText}>{formatTimer(secondsElapsed)}</Text>
        </View>

        <View style={styles.demoWatermark}>
          <ShieldCheck size={12} color="#10B981" />
          <Text style={styles.watermarkText}>Simulated Room</Text>
        </View>
      </View>

      {/* 2. MAIN VIDEO FEED (DOCTOR PLACEHOLDER) */}
      <View style={styles.videoStage}>
        <Image source={{ uri: appointment.doctorAvatar }} style={styles.doctorVideoBg} blurRadius={1} />
        <View style={styles.videoOverlay}>
          <View style={styles.doctorNameCard}>
            <Text style={styles.docOverlayName}>{appointment.doctorName}</Text>
            <Text style={styles.docOverlaySpec}>{appointment.doctorSpeciality}</Text>
          </View>
        </View>

        {/* SELF-VIEW PiP (PATIENT) */}
        <View style={styles.selfPipBox}>
          {isVideoOn ? (
            <Image source={{ uri: patient.avatarUrl }} style={styles.selfPipImg} />
          ) : (
            <View style={styles.selfPipPlaceholder}>
              <User size={24} color="#94A3B8" />
              <Text style={styles.cameraOffText}>Camera Off</Text>
            </View>
          )}
          <View style={styles.selfLabel}>
            <Text style={styles.selfLabelText}>You</Text>
          </View>
        </View>
      </View>

      {/* 3. CHAT PANEL (OVERLAY IF OPEN) */}
      {chatOpen && (
        <View style={styles.chatDrawer}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatHeaderTitle}>In-Call Chat (Demo)</Text>
            <TouchableOpacity onPress={() => setChatOpen(false)}>
              <X size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.chatList} contentContainerStyle={styles.chatListContent}>
            {chatMessages.map((msg, index) => (
              <View
                key={index}
                style={[
                  styles.chatBubble,
                  msg.isSelf ? styles.selfBubble : styles.doctorBubble,
                ]}
              >
                <Text style={styles.bubbleSender}>{msg.sender}</Text>
                <Text style={styles.bubbleText}>{msg.text}</Text>
                <Text style={styles.bubbleTime}>{msg.time}</Text>
              </View>
            ))}
          </ScrollView>

          <View style={styles.chatInputRow}>
            <TextInput
              value={messageInput}
              onChangeText={setMessageInput}
              placeholder="Type message to doctor..."
              placeholderTextColor="#94A3B8"
              style={styles.chatTextInput}
            />
            <TouchableOpacity style={styles.sendBtn} onPress={handleSendMessage}>
              <Send size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* 4. BOTTOM CONTROLS DOCK */}
      <View style={styles.controlsDock}>
        <TouchableOpacity
          style={[styles.controlBtn, !isMicOn && styles.controlBtnOff]}
          onPress={() => setIsMicOn((prev) => !prev)}
        >
          {isMicOn ? <Mic size={22} color="#FFFFFF" /> : <MicOff size={22} color="#EF4444" />}
          <Text style={styles.controlBtnLabel}>{isMicOn ? 'Mute' : 'Unmute'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlBtn, !isVideoOn && styles.controlBtnOff]}
          onPress={() => setIsVideoOn((prev) => !prev)}
        >
          {isVideoOn ? <VideoIcon size={22} color="#FFFFFF" /> : <VideoOff size={22} color="#EF4444" />}
          <Text style={styles.controlBtnLabel}>{isVideoOn ? 'Stop Cam' : 'Start Cam'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlBtn, chatOpen && styles.controlBtnActive]}
          onPress={() => setChatOpen((prev) => !prev)}
        >
          <MessageSquare size={22} color="#FFFFFF" />
          <Text style={styles.controlBtnLabel}>Chat</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlBtn, styles.endCallBtn]}
          onPress={() => router.back()}
        >
          <PhoneOff size={22} color="#FFFFFF" />
          <Text style={styles.controlBtnLabel}>End Call</Text>
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
    paddingVertical: 12,
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
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  statusPillText: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '600',
  },
  timerText: {
    color: '#94A3B8',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  demoWatermark: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  watermarkText: {
    color: '#94A3B8',
    fontSize: 11,
  },
  videoStage: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    margin: 12,
    borderRadius: 20,
    overflow: 'hidden',
  },
  doctorVideoBg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  videoOverlay: {
    position: 'absolute',
    bottom: 16,
    left: 16,
  },
  doctorNameCard: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  docOverlayName: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  docOverlaySpec: {
    color: '#94A3B8',
    fontSize: 11,
  },
  selfPipBox: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 100,
    height: 140,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#38BDF8',
    overflow: 'hidden',
    backgroundColor: '#0F172A',
  },
  selfPipImg: {
    width: '100%',
    height: '100%',
  },
  selfPipPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  cameraOffText: {
    color: '#64748B',
    fontSize: 9,
  },
  selfLabel: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  selfLabelText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '600',
  },
  chatDrawer: {
    position: 'absolute',
    bottom: 100,
    left: 12,
    right: 12,
    height: 260,
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
    fontWeight: '700',
    fontSize: 13,
  },
  chatList: {
    flex: 1,
  },
  chatListContent: {
    gap: 8,
  },
  chatBubble: {
    padding: 8,
    borderRadius: 10,
    maxWidth: '85%',
    gap: 2,
  },
  selfBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#0D9488',
  },
  doctorBubble: {
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
    lineHeight: 16,
  },
  bubbleTime: {
    fontSize: 8,
    color: 'rgba(255,255,255,0.7)',
    alignSelf: 'flex-end',
  },
  chatInputRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  chatTextInput: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    color: '#FFFFFF',
    fontSize: 12,
  },
  sendBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#0D9488',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlsDock: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: '#0F172A',
  },
  controlBtn: {
    alignItems: 'center',
    gap: 6,
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#1E293B',
    minWidth: 64,
  },
  controlBtnOff: {
    backgroundColor: '#334155',
  },
  controlBtnActive: {
    backgroundColor: '#0D9488',
  },
  endCallBtn: {
    backgroundColor: '#DC2626',
  },
  controlBtnLabel: {
    color: '#E2E8F0',
    fontSize: 11,
    fontWeight: '600',
  },
});
