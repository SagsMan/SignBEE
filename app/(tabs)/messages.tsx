import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Conversation, useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function MessagesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { conversations, unreadMessageCount, unreadNotificationCount } = useApp();
  const topPad = Platform.OS === "web" ? 20 : insets.top;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 16 }]}>
        <View>
          <Text style={[styles.title, { color: colors.navyDark }]}>Messages</Text>
          {unreadMessageCount > 0 ? (
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
              {unreadMessageCount} unread message{unreadMessageCount === 1 ? "" : "s"}
            </Text>
          ) : null}
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.iconBtn, { backgroundColor: colors.muted }]}
            onPress={() => router.push("/notification-center")}
            accessibilityLabel="Open notifications"
          >
            <Feather name="bell" size={18} color={colors.navyDark} />
            {unreadNotificationCount > 0 ? (
              <View style={[styles.notificationDot, { backgroundColor: colors.destructive }]} />
            ) : null}
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={conversations}
        keyExtractor={item => item.id}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: insets.bottom + 100 },
          conversations.length === 0 && styles.emptyList,
        ]}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => (
          <View style={[styles.separator, { backgroundColor: colors.border }]} />
        )}
        renderItem={({ item }) => (
          <ConversationRow
            conversation={item}
            colors={colors}
            onPress={() =>
              router.push({
                pathname: "/conversation/[id]",
                params: { id: item.id },
              })
            }
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="message-circle" size={44} color={colors.border} />
            <Text style={[styles.emptyTitle, { color: colors.navyDark }]}>
              No messages yet
            </Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Conversations with interpreters will appear here after you connect.
            </Text>
          </View>
        }
      />
    </View>
  );
}

export function ConversationRow({
  conversation,
  colors,
  onPress,
}: {
  conversation: Conversation;
  colors: ReturnType<typeof useColors>;
  onPress: () => void;
}) {
  const avatarSource =
    conversation.participantAvatar === "male"
      ? require("@/assets/images/interpreter_male.png")
      : require("@/assets/images/interpreter_female.png");
  const lastMessageTime = conversation.lastMessageAt
    ? formatRelativeTime(conversation.lastMessageAt)
    : "";

  return (
    <TouchableOpacity style={styles.messageRow} activeOpacity={0.7} onPress={onPress}>
      <Image source={avatarSource} style={styles.avatar} />
      <View style={styles.messageInfo}>
        <View style={styles.messageTop}>
          <Text
            style={[
              styles.msgName,
              {
                color: colors.foreground,
                fontFamily:
                  conversation.unreadCount > 0
                    ? "Inter_700Bold"
                    : "Inter_600SemiBold",
              },
            ]}
          >
            {conversation.participantName}
          </Text>
          <Text style={[styles.msgTime, { color: colors.mutedForeground }]}>
            {lastMessageTime}
          </Text>
        </View>
        <View style={styles.messageBottom}>
          <Text
            style={[
              styles.msgPreview,
              {
                color:
                  conversation.unreadCount > 0
                    ? colors.foreground
                    : colors.mutedForeground,
                fontFamily:
                  conversation.unreadCount > 0
                    ? "Inter_500Medium"
                    : "Inter_400Regular",
              },
            ]}
            numberOfLines={1}
          >
            {conversation.lastMessage || "Start a conversation"}
          </Text>
          {conversation.unreadCount > 0 ? (
            <View style={[styles.badge, { backgroundColor: colors.navyDark }]}>
              <Text style={styles.badgeText}>{conversation.unreadCount}</Text>
            </View>
          ) : null}
        </View>
      </View>
      <Feather name="chevron-right" size={17} color={colors.border} />
    </TouchableOpacity>
  );
}

function formatRelativeTime(timestamp: string) {
  const difference = Math.max(0, Date.now() - new Date(timestamp).getTime());
  const minutes = Math.floor(difference / 60_000);
  if (minutes < 1) return "Now";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "Yesterday" : `${days}d`;
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
  subtitle: { fontSize: 11, marginTop: 4 },
  headerActions: { flexDirection: "row", gap: 8 },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  notificationDot: {
    position: "absolute",
    top: 9,
    right: 10,
    width: 7,
    height: 7,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
  list: { paddingHorizontal: 20, paddingTop: 4 },
  emptyList: { flex: 1 },
  separator: { height: 1, marginLeft: 74 },
  messageRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    gap: 12,
  },
  avatar: { width: 52, height: 52, borderRadius: 26 },
  messageInfo: { flex: 1 },
  messageTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    gap: 8,
  },
  msgName: { fontSize: 15 },
  msgTime: { fontSize: 11 },
  messageBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  msgPreview: { fontSize: 12, flex: 1, marginRight: 8 },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontFamily: "Inter_700Bold",
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    gap: 12,
  },
  emptyTitle: { fontSize: 18, fontFamily: "Inter_600SemiBold" },
  emptyText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    maxWidth: 270,
  },
});