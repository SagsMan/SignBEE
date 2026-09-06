import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import PrimaryButton from "@/components/PrimaryButton";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function BookingConfirmationScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { bookings } = useApp();
  const booking = bookings.find(item => item.id === id);
  const topPad = Platform.OS === "web" ? 20 : insets.top;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: topPad + 12 },
      ]}
    >
      <TouchableOpacity
        onPress={() => router.replace("/(tabs)")}
        style={styles.closeButton}
        accessibilityLabel="Close confirmation"
      >
        <Feather name="x" size={22} color={colors.foreground} />
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={[styles.successIcon, { backgroundColor: colors.greenLight }]}>
          <Feather name="check" size={42} color={colors.navyDark} />
        </View>
        <Text style={[styles.title, { color: colors.navyDark }]}>
          Booking confirmed
        </Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Your interpreter request has been saved. You can review the appointment
          details or find it in My Bookings.
        </Text>

        {booking ? (
          <View style={[styles.summary, { backgroundColor: colors.muted }]}>
            <Text style={[styles.summaryTitle, { color: colors.navyDark }]}>
              {booking.interpreterName}
            </Text>
            <SummaryRow label="Date" value={booking.date} colors={colors} />
            <SummaryRow label="Time" value={`${booking.time} · ${booking.duration}`} colors={colors} />
            <SummaryRow label="Service" value={booking.purpose} colors={colors} />
            <SummaryRow label="Amount paid" value={`₦${booking.rate.toLocaleString()}`} colors={colors} />
            {booking.paymentReference ? (
              <SummaryRow label="Payment reference" value={booking.paymentReference} colors={colors} />
            ) : null}
          </View>
        ) : null}
      </View>

      <View style={[styles.actions, { paddingBottom: insets.bottom + 18 }]}>
        {booking ? (
          <PrimaryButton
            title="View appointment"
            onPress={() =>
              router.replace({
                pathname: "/appointment/[id]",
                params: { id: booking.id },
              })
            }
          />
        ) : null}
        <TouchableOpacity
          style={styles.secondaryAction}
          onPress={() => router.replace("/(tabs)/bookings")}
        >
          <Text style={[styles.secondaryText, { color: colors.navyDark }]}>
            Go to My Bookings
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function SummaryRow({
  label,
  value,
  colors,
}: {
  label: string;
  value: string;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={styles.summaryRow}>
      <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>
        {label}
      </Text>
      <Text style={[styles.summaryValue, { color: colors.foreground }]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
  },
  content: { flex: 1, alignItems: "center", justifyContent: "center" },
  successIcon: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
  },
  title: { fontSize: 25, fontFamily: "Inter_700Bold", textAlign: "center" },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    maxWidth: 320,
    marginTop: 10,
  },
  summary: { width: "100%", borderRadius: 16, padding: 16, marginTop: 28 },
  summaryTitle: { fontSize: 16, fontFamily: "Inter_700Bold", marginBottom: 8 },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    paddingVertical: 6,
  },
  summaryLabel: { fontSize: 12, fontFamily: "Inter_400Regular" },
  summaryValue: {
    flex: 1,
    textAlign: "right",
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
  },
  actions: { gap: 12 },
  secondaryAction: { alignItems: "center", padding: 12 },
  secondaryText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
});