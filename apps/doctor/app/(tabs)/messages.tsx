import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
} from 'react-native';
import {
  Search,
  Send,
  Paperclip,
  CheckCheck,
  ShieldCheck,
  X,
} from 'lucide-react-native';
import { useDoctor, ChatThread } from '../../src/context/DoctorContext';

export default function DoctorMessagesScreen() {
  const { theme, chatThreads, sendMessageToThread } = useDoctor();

  const [activeThread, setActiveThread] = useState<ChatThread | null>(null);
  const [inputText, setInputText] = useState('');

  const currentThread = activeThread
    ? chatThreads.find((t) => t.id === activeThread.id) || activeThread
    : null;

  const handleSend = () => {
    if (!inputText.trim() || !currentThread) return;
    sendMessageToThread(currentThread.id, inputText);
    setInputText('');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* THREADS LIST */}
      <View style={[styles.headerBanner, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <View style={styles.demoTag}>
          <ShieldCheck size={12} color="#059669" />
          <Text style={styles.demoTagText}>Demo Patient Inquiries</Text>
        </View>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Patient Communications</Text>
      </View>

      <ScrollView contentContainerStyle={styles.threadsList} showsVerticalScrollIndicator={false}>
        {chatThreads.map((thread) => (
          <TouchableOpacity
            key={thread.id}
            style={[styles.threadCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
            onPress={() => setActiveThread(thread)}
            activeOpacity={0.8}
          >
            <Image source={{ uri: thread.patientAvatar }} style={styles.threadAvatar} />
            <View style={styles.threadDetails}>
              <View style={styles.threadTop}>
                <Text style={[styles.threadName, { color: theme.text }]}>{thread.patientName}</Text>
                <Text style={[styles.threadTime, { color: theme.mutedText }]}>{thread.lastTimestamp}</Text>
              </View>
              <Text style={[styles.threadSnippet, { color: theme.mutedText }]} numberOfLines={1}>
                {thread.lastMessage}
              </Text>
            </View>
            {thread.unreadCount > 0 && (
              <View style={[styles.unreadBadge, { backgroundColor: theme.primary }]}>
                <Text style={styles.unreadBadgeText}>{thread.unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* CHAT THREAD MODAL */}
      <Modal visible={!!currentThread} animationType="slide">
        {currentThread && (
          <View style={[styles.chatModalContainer, { backgroundColor: theme.background }]}>
            {/* CHAT HEADER */}
            <View style={[styles.chatTopBar, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
              <View style={styles.chatTopInfo}>
                <Image source={{ uri: currentThread.patientAvatar }} style={styles.chatHeaderAvatar} />
                <View>
                  <Text style={[styles.chatHeaderName, { color: theme.text }]}>{currentThread.patientName}</Text>
                  <Text style={[styles.chatHeaderSub, { color: theme.mutedText }]}>CareConnect Patient</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setActiveThread(null)}>
                <X size={22} color={theme.text} />
              </TouchableOpacity>
            </View>

            {/* MESSAGES SCROLL */}
            <ScrollView contentContainerStyle={styles.messagesScroll} showsVerticalScrollIndicator={false}>
              <View style={styles.chatWatermark}>
                <Text style={styles.watermarkText}>
                  DEMO CONVERSATION • Secure in-platform healthcare channel
                </Text>
              </View>

              {currentThread.messages.map((m) => (
                <View
                  key={m.id}
                  style={[
                    styles.msgBubble,
                    m.isDoctor
                      ? [styles.docBubble, { backgroundColor: theme.primary }]
                      : [styles.patientBubble, { backgroundColor: theme.surface, borderColor: theme.border }],
                  ]}
                >
                  <Text style={[styles.msgText, { color: m.isDoctor ? '#FFFFFF' : theme.text }]}>
                    {m.text}
                  </Text>
                  <View style={styles.msgFooter}>
                    <Text
                      style={[
                        styles.msgTime,
                        { color: m.isDoctor ? 'rgba(255,255,255,0.7)' : theme.mutedText },
                      ]}
                    >
                      {m.timestamp}
                    </Text>
                    {m.isDoctor && <CheckCheck size={12} color="#FFFFFF" />}
                  </View>
                </View>
              ))}
            </ScrollView>

            {/* INPUT DOCK */}
            <View style={[styles.inputDock, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
              <TouchableOpacity style={styles.attachBtn}>
                <Paperclip size={18} color={theme.mutedText} />
              </TouchableOpacity>

              <TextInput
                value={inputText}
                onChangeText={setInputText}
                placeholder="Type response to patient..."
                placeholderTextColor={theme.mutedText}
                style={[styles.chatInput, { color: theme.text, backgroundColor: theme.background }]}
              />

              <TouchableOpacity
                style={[styles.sendBtn, { backgroundColor: theme.primary }]}
                onPress={handleSend}
              >
                <Send size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBanner: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 4,
  },
  demoTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  demoTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  threadsList: {
    padding: 16,
    gap: 10,
    paddingBottom: 40,
  },
  threadCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  threadAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  threadDetails: {
    flex: 1,
    gap: 3,
  },
  threadTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  threadName: {
    fontSize: 15,
    fontWeight: '700',
  },
  threadTime: {
    fontSize: 11,
  },
  threadSnippet: {
    fontSize: 12,
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  chatModalContainer: {
    flex: 1,
  },
  chatTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  chatTopInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  chatHeaderAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  chatHeaderName: {
    fontSize: 14,
    fontWeight: '700',
  },
  chatHeaderSub: {
    fontSize: 11,
  },
  messagesScroll: {
    padding: 16,
    gap: 12,
    paddingBottom: 20,
  },
  chatWatermark: {
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 6,
  },
  watermarkText: {
    fontSize: 9,
    color: '#64748B',
    fontWeight: '600',
  },
  msgBubble: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 14,
    gap: 4,
  },
  docBubble: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 2,
  },
  patientBubble: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 2,
    borderWidth: 1,
  },
  msgText: {
    fontSize: 13,
    lineHeight: 18,
  },
  msgFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-end',
  },
  msgTime: {
    fontSize: 9,
  },
  inputDock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  attachBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatInput: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 13,
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
