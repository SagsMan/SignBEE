import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

interface MockMessage {
  id: string;
  name: string;
  preview: string;
  time: string;
  unread: number;
}

export default function MessagesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { interpreters } = useApp();

  const topPad = Platform.OS === "web" ? 20 : insets.top;

  const mockMessages: MockMessage[] = interpreters.slice(0, 3).map((i, idx) => ({
    id: i.id,
    name: i.name,
    preview: idx === 0
      ? "Hello! I'm available for your booking tomorrow."
      : idx === 1
        ? "Thanks for booking. Looking forward to working with you!"
        : "Please let me know if you have any special requirements.",
    time: idx === 0 ? "2m ago" : idx === 1 ? "1h ago" : "Yesterday",
    unread: idx === 0 ? 2 : 0,
  }));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 16 }]}>
        <Text style={[styles.title, { color: colors.navyDark }]}>Messages</Text>
        <TouchableOpacity
          style={[styles.iconBtn, { backgroundColor: colors.muted }]}
        >
          <Feather name="edit" size={18} color={colors.navyDark} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={mockMessages}
        keyExtractor={item => item.id}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => (
          <View
            style={[styles.separator, { backgroundColor: colors.border }]}
          />
        )}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.messageRow} activeOpacity={0.7}>
            <View
              style={[styles.avatar, { backgroundColor: colors.greenLight }]}
            >
              <Text style={[styles.avatarText, { color: colors.navyDark }]}>
                {item.name.charAt(0)}
              </Text>
            </View>
            <View style={styles.messageInfo}>
              <View style={styles.messageTop}>
                <Text style={[styles.msgName, { color: colors.foreground }]}>
                  {item.name}
                </Text>
                <Text style={[styles.msgTime, { color: colors.mutedForeground }]}>
                  {item.time}
                </Text>
              </View>
              <View style={styles.messageBottom}>
                <Text
                  style={[styles.msgPreview, { color: colors.mutedForeground }]}
                  numberOfLines={1}
                >
                  {item.preview}
                </Text>
                {item.unread > 0 && (
                  <View
                    style={[
                      styles.badge,
                      { backgroundColor: colors.navyDark },
                    ]}
                  >
                    <Text style={styles.badgeText}>{item.unread}</Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="message-circle" size={44} color={colors.border} />
            <Text style={[styles.emptyTitle, { color: colors.navyDark }]}>
              No messages yet
            </Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Start a conversation with an interpreter after booking.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  title: { fontSize: 24, fontFamily: "Inter_700Bold" },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  list: { paddingHorizontal: 20, paddingTop: 4 },
  separator: { height: 1, marginLeft: 74 },
  messageRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    gap: 14,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 20, fontFamily: "Inter_700Bold" },
  messageInfo: { flex: 1 },
  messageTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  msgName: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  msgTime: { fontSize: 12, fontFamily: "Inter_400Regular" },
  messageBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  msgPreview: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    flex: 1,
    marginRight: 8,
  },
  badge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontFamily: "Inter_700Bold",
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    gap: 12,
  },
  emptyTitle: { fontSize: 18, fontFamily: "Inter_600SemiBold" },
  emptyText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    maxWidth: 260,
  },
});
