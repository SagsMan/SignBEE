import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Booking } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

interface Props {
  booking: Booking;
  onPress?: () => void;
  onCancel?: () => void;
}

const STATUS_COLORS: Record<string, string> = {
  upcoming: "#3B82F6",
  ongoing: "#F59E0B",
  completed: "#22C55E",
  cancelled: "#EF4444",
};

export default function BookingCard({ booking, onPress, onCancel }: Props) {
  const colors = useColors();
  const statusColor = STATUS_COLORS[booking.status] || colors.mutedForeground;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: colors.background, borderColor: colors.border },
      ]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.header}>
        <View style={styles.nameRow}>
          <View style={[styles.avatar, { backgroundColor: colors.muted }]}>
            <Feather name="user" size={20} color={colors.mutedForeground} />
          </View>
          <View>
            <Text style={[styles.name, { color: colors.foreground }]}>
              {booking.interpreterName}
            </Text>
            <Text style={[styles.lang, { color: colors.mutedForeground }]}>
              {booking.language} | {booking.type}
            </Text>
          </View>
        </View>
        <View
          style={[styles.badge, { backgroundColor: statusColor + "20" }]}
        >
          <Text style={[styles.badgeText, { color: statusColor }]}>
            {booking.isRescheduled
              ? "Rescheduled"
              : booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </Text>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      <View style={styles.details}>
        <View style={styles.detail}>
          <Feather name="calendar" size={14} color={colors.mutedForeground} />
          <Text style={[styles.detailText, { color: colors.foreground }]}>
            {booking.date}
          </Text>
        </View>
        <View style={styles.detail}>
          <Feather name="clock" size={14} color={colors.mutedForeground} />
          <Text style={[styles.detailText, { color: colors.foreground }]}>
            {booking.time} · {booking.duration}
          </Text>
        </View>
        {booking.location ? (
          <View style={styles.detail}>
            <Feather name="map-pin" size={14} color={colors.mutedForeground} />
            <Text
              style={[styles.detailText, { color: colors.foreground }]}
              numberOfLines={1}
            >
              {booking.location}
            </Text>
          </View>
        ) : null}
      </View>

      {booking.status === "upcoming" && onCancel && (
        <TouchableOpacity
          style={[styles.cancelBtn, { borderColor: colors.destructive }]}
          onPress={event => {
            event.stopPropagation();
            onCancel();
          }}
        >
          <Text style={[styles.cancelText, { color: colors.destructive }]}>
            Cancel Booking
          </Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  name: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  lang: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 1 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  divider: { height: 1, marginBottom: 12 },
  details: { gap: 6 },
  detail: { flexDirection: "row", alignItems: "center", gap: 6 },
  detailText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    flex: 1,
  },
  cancelBtn: {
    marginTop: 12,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  cancelText: { fontSize: 13, fontFamily: "Inter_500Medium" },
});
