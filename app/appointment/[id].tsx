import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import PrimaryButton from "@/components/PrimaryButton";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function AppointmentDetailsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { bookings, completeBooking } = useApp();
  const booking = bookings.find(item => item.id === id);
  const topPad = Platform.OS === "web" ? 20 : insets.top;

  if (!booking) {
    return (
      <View style={[styles.notFound, { backgroundColor: colors.background, paddingTop: topPad }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.notFoundText, { color: colors.mutedForeground }]}>
          Appointment not found
        </Text>
      </View>
    );
  }

  const canManage = booking.status === "upcoming" || booking.status === "ongoing";
  const statusColor =
    booking.status === "completed"
      ? colors.success
      : booking.status === "cancelled"
        ? colors.destructive
        : colors.navyDark;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 4 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>
          Appointment details
        </Text>
        <View style={styles.iconButton} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 36 },
        ]}
      >
        <View style={[styles.statusRow, { backgroundColor: colors.muted }]}>
          <View
            style={[styles.statusDot, { backgroundColor: statusColor }]}
          />
          <Text style={[styles.statusText, { color: statusColor }]}>
            {booking.isRescheduled ? "Rescheduled · " : ""}
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </Text>
        </View>

        <View style={[styles.interpreterCard, { backgroundColor: colors.greenLight }]}>
          <Image
            source={
              booking.interpreterAvatar === "male"
                ? require("@/assets/images/interpreter_male.png")
                : require("@/assets/images/interpreter_female.png")
            }
            style={styles.avatar}
          />
          <View style={styles.interpreterCopy}>
            <Text style={[styles.interpreterName, { color: colors.navyDark }]}>
              {booking.interpreterName}
            </Text>
            <Text style={[styles.interpreterMeta, { color: colors.mutedForeground }]}>
              {booking.language} · {booking.type}
            </Text>
          </View>
        </View>

        <View style={[styles.detailsCard, { borderColor: colors.border }]}>
          <DetailRow icon="calendar" label="Date" value={booking.date} colors={colors} />
          <DetailRow
            icon="clock"
            label="Time"
            value={`${booking.time} · ${booking.duration}`}
            colors={colors}
          />
          <DetailRow
            icon={booking.type === "Virtual" ? "video" : "map-pin"}
            label={booking.type === "Virtual" ? "Venue" : "Location"}
            value={
              booking.type === "Virtual"
                ? `${booking.venue || "Virtual"}${booking.link ? ` · ${booking.link}` : ""}`
                : booking.location || "Location not provided"
            }
            colors={colors}
          />
          <DetailRow icon="briefcase" label="Purpose" value={booking.purpose} colors={colors} />
          {booking.notes ? (
            <DetailRow icon="file-text" label="Notes" value={booking.notes} colors={colors} />
          ) : null}
          {booking.cancellationReason ? (
            <DetailRow
              icon="slash"
              label="Cancellation reason"
              value={booking.cancellationReason}
              colors={colors}
            />
          ) : null}
        </View>

        {booking.imageUri ? (
          <View style={styles.attachmentSection}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Booking attachment
            </Text>
            <Image source={{ uri: booking.imageUri }} style={styles.attachment} />
          </View>
        ) : null}

        {booking.rating ? (
          <View style={[styles.ratingSummary, { backgroundColor: colors.muted }]}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Your rating
            </Text>
            <View style={styles.ratingStars}>
              {[1, 2, 3, 4, 5].map(star => (
                <Feather
                  key={star}
                  name="star"
                  size={18}
                  color={star <= booking.rating! ? colors.star : colors.border}
                  fill={star <= booking.rating! ? colors.star : "transparent"}
                />
              ))}
            </View>
            {booking.review ? (
              <Text style={[styles.reviewText, { color: colors.mutedForeground }]}>
                {booking.review}
              </Text>
            ) : null}
          </View>
        ) : null}

        {canManage ? (
          <View style={styles.actions}>
            <PrimaryButton
              title="Reschedule appointment"
              onPress={() =>
                router.push({
                  pathname: "/reschedule/[id]",
                  params: { id: booking.id },
                })
              }
            />
            <TouchableOpacity
              style={[styles.outlineAction, { borderColor: colors.destructive }]}
              onPress={() =>
                router.push({
                  pathname: "/cancel-booking/[id]",
                  params: { id: booking.id },
                })
              }
            >
              <Text style={[styles.outlineText, { color: colors.destructive }]}>
                Cancel booking
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.completeAction}
              onPress={() => completeBooking(booking.id)}
            >
              <Text style={[styles.completeText, { color: colors.mutedForeground }]}>
                Mark as completed
              </Text>
            </TouchableOpacity>
          </View>
        ) : booking.status === "completed" && !booking.rating ? (
          <PrimaryButton
            title="Rate this booking"
            onPress={() =>
              router.push({
                pathname: "/rating/[id]",
                params: { id: booking.id },
              })
            }
          />
        ) : null}
      </ScrollView>
    </View>
  );
}

function DetailRow({
  icon,
  label,
  value,
  colors,
}: {
  icon: string;
  label: string;
  value: string;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={styles.detailRow}>
      <Feather name={icon as any} size={17} color={colors.navyDark} />
      <View style={styles.detailCopy}>
        <Text style={[styles.detailLabel, { color: colors.mutedForeground }]}>
          {label}
        </Text>
        <Text style={[styles.detailValue, { color: colors.foreground }]}>
          {value}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  notFound: { flex: 1, paddingHorizontal: 20 },
  notFoundText: { fontSize: 16, fontFamily: "Inter_400Regular", marginTop: 24 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  iconButton: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 17, fontFamily: "Inter_600SemiBold" },
  content: { paddingHorizontal: 20 },
  statusRow: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  interpreterCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    marginBottom: 18,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: 12,
  },
  interpreterCopy: { flex: 1 },
  interpreterName: { fontSize: 16, fontFamily: "Inter_700Bold" },
  interpreterMeta: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 4 },
  detailsCard: { borderWidth: 1, borderRadius: 16, padding: 16, gap: 16 },
  detailRow: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  detailCopy: { flex: 1 },
  detailLabel: { fontSize: 11, fontFamily: "Inter_400Regular", marginBottom: 3 },
  detailValue: { fontSize: 13, fontFamily: "Inter_500Medium", lineHeight: 19 },
  attachmentSection: { marginTop: 22 },
  sectionTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold", marginBottom: 10 },
  attachment: { width: 120, height: 92, borderRadius: 10 },
  ratingSummary: { borderRadius: 14, padding: 15, marginTop: 22 },
  ratingStars: { flexDirection: "row", gap: 3, marginBottom: 8 },
  reviewText: { fontSize: 13, lineHeight: 19, fontFamily: "Inter_400Regular" },
  actions: { gap: 10, marginTop: 24 },
  outlineAction: {
    minHeight: 52,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  outlineText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  completeAction: { alignItems: "center", padding: 10 },
  completeText: { fontSize: 13, fontFamily: "Inter_500Medium" },
});