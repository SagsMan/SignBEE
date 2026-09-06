import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
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

export default function RatingScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { bookings, rateBooking } = useApp();
  const booking = bookings.find(item => item.id === id);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
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

  const saveRating = async () => {
    if (!rating) return;
    setSaving(true);
    try {
      await rateBooking(booking.id, rating, review.trim());
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
          Rate your booking
        </Text>
        <View style={styles.iconButton} />
      </View>

      <View style={styles.content}>
        <View style={[styles.illustration, { backgroundColor: colors.greenLight }]}>
          <Feather name="star" size={34} color={colors.navyDark} fill={colors.navyDark} />
        </View>
        <Text style={[styles.title, { color: colors.navyDark }]}>
          How was your experience?
        </Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Your feedback helps other clients choose the right interpreter.
        </Text>
        <Text style={[styles.interpreterName, { color: colors.foreground }]}>
          {booking.interpreterName}
        </Text>
        <View style={styles.starRow}>
          {[1, 2, 3, 4, 5].map(value => (
            <TouchableOpacity
              key={value}
              style={styles.starButton}
              onPress={() => setRating(value)}
              accessibilityLabel={`${value} stars`}
            >
              <Feather
                name="star"
                size={34}
                color={value <= rating ? colors.star : colors.border}
                fill={value <= rating ? colors.star : "transparent"}
              />
            </TouchableOpacity>
          ))}
        </View>
        <TextInput
          style={[styles.reviewInput, { borderColor: colors.border, color: colors.foreground }]}
          placeholder="Share a few words (optional)"
          placeholderTextColor={colors.mutedForeground}
          value={review}
          onChangeText={setReview}
          multiline
          textAlignVertical="top"
        />
      </View>

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12, borderTopColor: colors.border, backgroundColor: colors.background }]}>
        <PrimaryButton
          title="Submit rating"
          onPress={saveRating}
          loading={saving}
          disabled={!rating}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  notFound: { flex: 1, paddingHorizontal: 20 },
  notFoundText: { fontSize: 16, fontFamily: "Inter_400Regular", marginTop: 24 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingBottom: 16 },
  iconButton: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 17, fontFamily: "Inter_600SemiBold" },
  content: { flex: 1, alignItems: "center", paddingHorizontal: 20, paddingTop: 54 },
  illustration: { width: 74, height: 74, borderRadius: 37, alignItems: "center", justifyContent: "center", marginBottom: 20 },
  title: { fontSize: 23, fontFamily: "Inter_700Bold", textAlign: "center" },
  subtitle: { fontSize: 13, lineHeight: 20, fontFamily: "Inter_400Regular", textAlign: "center", maxWidth: 300, marginTop: 8 },
  interpreterName: { fontSize: 15, fontFamily: "Inter_600SemiBold", marginTop: 24 },
  starRow: { flexDirection: "row", marginTop: 12, marginBottom: 28 },
  starButton: { padding: 4 },
  reviewInput: { width: "100%", minHeight: 100, borderWidth: 1, borderRadius: 12, padding: 12, fontSize: 13, fontFamily: "Inter_400Regular" },
  bottomBar: { paddingHorizontal: 20, paddingTop: 14, borderTopWidth: 1 },
});