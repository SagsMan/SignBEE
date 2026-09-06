import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppNotification, NotificationType, useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function NotificationCenterScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { notifications, unreadNotificationCount, markNotificationRead, markAllNotificationsRead } = useApp();
  const topPad = Platform.OS === "web" ? 20 : insets.top;

  const openNotification = async (notification: AppNotification) => {
    await markNotificationRead(notification.id);
    if (notification.target === "conversation" && notification.relatedId) {
      router.push({ pathname: "/conversation/[id]", params: { id: notification.relatedId } });
    } else if (notification.target === "booking" && notification.relatedId) {
      router.push({ pathname: "/appointment/[id]", params: { id: notification.relatedId } });
    } else if (notification.target === "transaction" && notification.relatedId) {
      router.push({ pathname: "/transaction/[id]", params: { id: notification.relatedId } });
    } else if (notification.target === "call") {
      router.push("/incoming-call");
    } else if (notification.target === "wallet") {
      router.push("/wallet");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 6 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <View style={styles.headerCopy}>
          <Text style={[styles.title, { color: colors.navyDark }]}>Notifications</Text>
          {unreadNotificationCount > 0 ? (
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
              {unreadNotificationCount} unread
            </Text>
          ) : null}
        </View>
        {unreadNotificationCount > 0 ? (
          <TouchableOpacity onPress={() => void markAllNotificationsRead()} style={styles.markButton}>
            <Text style={[styles.markText, { color: colors.navyDark }]}>Mark all read</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.markButton} />
        )}
      </View>

      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: insets.bottom + 28 },
          notifications.length === 0 && styles.emptyList,
        ]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <NotificationRow
            notification={item}
            colors={colors}
            onPress={() => void openNotification(item)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="bell-off" size={42} color={colors.border} />
            <Text style={[styles.emptyTitle, { color: colors.navyDark }]}>You&apos;re all caught up</Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              New booking, payment, and message updates will appear here.
            </Text>
          </View>
        }
      />
    </View>
  );
}

export function NotificationRow({
  notification,
  colors,
  onPress,
}: {
  notification: AppNotification;
  colors: ReturnType<typeof useColors>;
  onPress: () => void;
}) {
  const icon = getNotificationIcon(notification.type);
  return (
    <TouchableOpacity
      style={[
        styles.notificationRow,
        {
          backgroundColor: notification.isRead ? colors.background : colors.greenLight,
          borderColor: notification.isRead ? colors.border : colors.greenLight,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={[styles.notificationIcon, { backgroundColor: notification.isRead ? colors.muted : colors.primary }]}>
        <Feather name={icon} size={18} color={colors.navyDark} />
      </View>
      <View style={styles.notificationCopy}>
        <View style={styles.notificationHeading}>
          <Text style={[styles.notificationTitle, { color: colors.foreground }]}>{notification.title}</Text>
          {!notification.isRead ? <View style={[styles.unreadDot, { backgroundColor: colors.navyDark }]} /> : null}
        </View>
        <Text style={[styles.notificationBody, { color: colors.mutedForeground }]}>{notification.body}</Text>
        <Text style={[styles.notificationTime, { color: colors.mutedForeground }]}>{formatNotificationTime(notification.timestamp)}</Text>
      </View>
      <Feather name="chevron-right" size={17} color={colors.border} />
    </TouchableOpacity>
  );
}

function getNotificationIcon(type: NotificationType): keyof typeof Feather.glyphMap {
  if (type === "message") return "message-circle";
  if (type === "booking") return "calendar";
  if (type === "payment") return "credit-card";
  if (type === "call") return "phone";
  return "bell";
}

function formatNotificationTime(timestamp: string) {
  const difference = Math.max(0, Date.now() - new Date(timestamp).getTime());
  const minutes = Math.floor(difference / 60_000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return new Date(timestamp).toLocaleDateString();
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingBottom: 18, gap: 8 },
  iconButton: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  headerCopy: { flex: 1 },
  title: { fontSize: 22, fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 11, marginTop: 4 },
  markButton: { minWidth: 74, alignItems: "flex-end" },
  markText: { fontSize: 11, fontFamily: "Inter_600SemiBold", textAlign: "right" },
  list: { paddingHorizontal: 20, gap: 10 },
  emptyList: { flex: 1 },
  notificationRow: { minHeight: 88, borderWidth: 1, borderRadius: 15, padding: 12, flexDirection: "row", alignItems: "flex-start", gap: 11 },
  notificationIcon: { width: 39, height: 39, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  notificationCopy: { flex: 1 },
  notificationHeading: { flexDirection: "row", alignItems: "center", gap: 7, marginBottom: 4 },
  notificationTitle: { flex: 1, fontSize: 13, fontFamily: "Inter_600SemiBold" },
  unreadDot: { width: 7, height: 7, borderRadius: 4 },
  notificationBody: { fontSize: 11, lineHeight: 16 },
  notificationTime: { fontSize: 10, marginTop: 7 },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 30, gap: 10 },
  emptyTitle: { fontSize: 17, fontFamily: "Inter_600SemiBold" },
  emptyText: { fontSize: 13, lineHeight: 19, textAlign: "center" },
});