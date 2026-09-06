import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import PrimaryButton from "@/components/PrimaryButton";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const REASONS = [
  "Plans changed",
  "Found another interpreter",
  "Need a different time",
  "Other",
];

export default function CancelBookingScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { bookings, cancelBooking } = useApp();
  const booking = bookings.find(item => item.id === id);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [saving, setSaving] = useState(false);
  const topPad = Platform.OS === "web" ? 20 : insets.top;

  if (!booking) {
    return (
      <View style={[styles.notFound, { backgroundColor: colors.background, paddingTop: topPad }]}>
        <Text style={[styles.notFoundText, { color: colors.mutedForeground }]}>
          Appointment not found
        </Text>
      </View>
    );
  }

  const confirmCancellation = async () => {
    if (!reason) {
      Alert.alert("Choose a reason", "Select a reason for cancelling this booking.");
      return;
    }
    setSaving(true);
    try {
      await cancelBooking(booking.id, details.trim() || reason);
      router.replace({
        pathname: "/appointment/[id]",
        params: { id: booking.id },
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 4 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>
          Cancel booking
        </Text>
        <View style={styles.iconButton} />
      </View>

      <View style={styles.content}>
        <View style={[styles.warningIcon, { backgroundColor: "#FFF4E5" }]}>
          <Feather name="alert-triangle" size={28} color="#D97706" />
        </View>
        <Text style={[styles.title, { color: colors.navyDark }]}>
          Cancel this appointment?
        </Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          This will move the appointment to your Cancelled bookings. You can
          still create a new booking whenever you&apos;re ready.
        </Text>

        <Text style={[styles.label, { color: colors.foreground }]}>
          Why are you cancelling?
        </Text>
        <View style={styles.reasonList}>
          {REASONS.map(item => (
            <TouchableOpacity
              key={item}
              style={[
                styles.reasonOption,
                {
                  borderColor: reason === item ? colors.primary : colors.border,
                  backgroundColor:
                    reason === item ? colors.greenLight : colors.background,
                },
              ]}
              onPress={() => setReason(item)}
            >
              <View
                style={[
                  styles.radio,
                  { borderColor: reason === item ? colors.navyDark : colors.border },
                ]}
              >
                {reason === item ? (
                  <View style={[styles.radioDot, { backgroundColor: colors.navyDark }]} />
                ) : null}
              </View>
              <Text style={[styles.reasonText, { color: colors.foreground }]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          style={[styles.detailsInput, { borderColor: colors.border, color: colors.foreground }]}
          placeholder="Add a note (optional)"
          placeholderTextColor={colors.mutedForeground}
          value={details}
          onChangeText={setDetails}
          multiline
          textAlignVertical="top"
        />
      </View>

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12, borderTopColor: colors.border, backgroundColor: colors.background }]}>
        <PrimaryButton
          title="Confirm cancellation"
          onPress={confirmCancellation}
          loading={saving}
          style={{ backgroundColor: colors.destructive }}
        />
        <TouchableOpacity style={styles.keepButton} onPress={() => router.back()}>
          <Text style={[styles.keepText, { color: colors.navyDark }]}>
            Keep appointment
          </Text>
        </TouchableOpacity>
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  iconButton: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 17, fontFamily: "Inter_600SemiBold" },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 24 },
  warningIcon: { width: 60, height: 60, borderRadius: 30, alignItems: "center", justifyContent: "center", alignSelf: "center", marginBottom: 18 },
  title: { fontSize: 23, fontFamily: "Inter_700Bold", textAlign: "center" },
  subtitle: { fontSize: 13, lineHeight: 20, fontFamily: "Inter_400Regular", textAlign: "center", marginTop: 9, marginBottom: 28 },
  label: { fontSize: 14, fontFamily: "Inter_600SemiBold", marginBottom: 10 },
  reasonList: { gap: 9 },
  reasonOption: { minHeight: 48, borderWidth: 1, borderRadius: 12, flexDirection: "row", alignItems: "center", paddingHorizontal: 13, gap: 10 },
  radio: { width: 19, height: 19, borderRadius: 10, borderWidth: 1.5, alignItems: "center", justifyContent: "center" },
  radioDot: { width: 9, height: 9, borderRadius: 5 },
  reasonText: { fontSize: 13, fontFamily: "Inter_400Regular" },
  detailsInput: { minHeight: 78, borderWidth: 1, borderRadius: 12, padding: 12, fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 18 },
  bottomBar: { paddingHorizontal: 20, paddingTop: 14, borderTopWidth: 1 },
  keepButton: { alignItems: "center", padding: 12 },
  keepText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
});