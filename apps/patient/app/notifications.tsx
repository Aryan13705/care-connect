import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Bell,
  Calendar,
  CheckCircle2,
  FileText,
  Info,
  Check,
} from 'lucide-react-native';
import { usePatient } from '../src/context/PatientContext';

export default function NotificationsScreen() {
  const router = useRouter();
  const { theme, notifications, markNotificationRead, seniorMode } = usePatient();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filtered = notifications.filter((n) => (filter === 'unread' ? !n.read : true));

  const getIcon = (type: string) => {
    switch (type) {
      case 'reminder':
        return <Calendar size={18} color="#D97706" />;
      case 'booking':
        return <CheckCircle2 size={18} color="#059669" />;
      case 'followup':
        return <FileText size={18} color="#2563EB" />;
      default:
        return <Info size={18} color="#7C3AED" />;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* FILTER TABS */}
      <View style={[styles.filterBar, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <View style={styles.tabsGroup}>
          <TouchableOpacity
            style={[
              styles.tab,
              {
                backgroundColor: filter === 'all' ? (theme.primaryDark || '#347C65') : theme.background,
                borderColor: theme.border,
              },
            ]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.tabText, { color: filter === 'all' ? '#FFFFFF' : theme.text }]}>
              All Notifications ({notifications.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tab,
              {
                backgroundColor: filter === 'unread' ? (theme.primaryDark || '#347C65') : theme.background,
                borderColor: theme.border,
              },
            ]}
            onPress={() => setFilter('unread')}
          >
            <Text style={[styles.tabText, { color: filter === 'unread' ? '#FFFFFF' : theme.text }]}>
              Unread ({notifications.filter((n) => !n.read).length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Bell size={44} color={theme.mutedText} />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>No notifications</Text>
            <Text style={[styles.emptySub, { color: theme.mutedText }]}>
              You have reviewed all your updates and appointment notices.
            </Text>
          </View>
        ) : (
          filtered.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.notifCard,
                {
                  backgroundColor: item.read ? theme.surface : (theme.mint || '#E7F4ED'),
                  borderColor: theme.border,
                },
              ]}
              onPress={() => markNotificationRead(item.id)}
              activeOpacity={0.8}
            >
              <View style={[styles.iconWrap, { backgroundColor: theme.surface }]}>
                {getIcon(item.type)}
              </View>

              <View style={styles.textWrap}>
                <View style={styles.titleRow}>
                  <Text style={[styles.notifTitle, { color: theme.text, fontSize: seniorMode ? 16 : 14 }]}>
                    {item.title}
                  </Text>
                  {!item.read && <View style={[styles.unreadDot, { backgroundColor: theme.primary }]} />}
                </View>

                <Text style={[styles.notifMsg, { color: theme.mutedText }]}>{item.message}</Text>
                <Text style={[styles.timestamp, { color: theme.mutedText }]}>{item.timestamp}</Text>
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
  filterBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  tabsGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
    gap: 10,
    paddingBottom: 40,
  },
  notifCard: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textWrap: {
    flex: 1,
    gap: 3,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  notifTitle: {
    fontWeight: '700',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  notifMsg: {
    fontSize: 12,
    lineHeight: 16,
  },
  timestamp: {
    fontSize: 10,
    marginTop: 2,
  },
  emptyState: {
    paddingVertical: 60,
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  emptySub: {
    fontSize: 12,
    textAlign: 'center',
  },
});
