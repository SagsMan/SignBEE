import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
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

const TIMES = [
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
];

function getDateOptions() {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + index);
    return {
      value: date.toISOString().slice(0, 10),
      dayLabel:
        index === 0
          ? "Today"
          : index === 1
            ? "Tomorrow"
            : date.toLocaleDateString("en-US", { weekday: "short" }),
      dateLabel: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    };
  });
}

export default function RescheduleScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { bookings, rescheduleBooking } = useApp();
  const booking = bookings.find(item => item.id === id);
  const dateOptions = useMemo(() => getDateOptions(), []);
  const [selectedDate, setSelectedDate] = useState(dateOptions[0]);
  const [selectedTime, setSelectedTime] = useState(
    TIMES.includes(booking?.time || "") ? booking?.time || TIMES[0] : TIMES[0],
  );
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

  const saveReschedule = async () => {
    setSaving(true);
    try {
      await rescheduleBooking(
        booking.id,
        `${selectedDate.dayLabel}, ${selectedDate.dateLabel}`,
        selectedTime,
      );
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
          Reschedule appointment
        </Text>
        <View style={styles.iconButton} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 100 },
        ]}
      >
        <Text style={[styles.title, { color: colors.navyDark }]}>
          Choose a new time
        </Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Select a date and time that works for you. Your interpreter will see
          the updated appointment.
        </Text>

        <Text style={[styles.label, { color: colors.foreground }]}>Date</Text>
        <View style={styles.dateGrid}>
          {dateOptions.map(option => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.dateCard,
                {
                  backgroundColor:
                    selectedDate.value === option.value
                      ? colors.navyDark
                      : colors.muted,
                },
              ]}
              onPress={() => setSelectedDate(option)}
            >
              <Text
                style={[
                  styles.dateDay,
                  {
                    color:
                      selectedDate.value === option.value
                        ? colors.primary
                        : colors.mutedForeground,
                  },
                ]}
              >
                {option.dayLabel}
              </Text>
              <Text
                style={[
                  styles.dateValue,
                  {
                    color:
                      selectedDate.value === option.value
                        ? "#FFFFFF"
                        : colors.foreground,
                  },
                ]}
              >
                {option.dateLabel}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.label, { color: colors.foreground }]}>Time</Text>
        <View style={styles.timeGrid}>
          {TIMES.map(time => (
            <TouchableOpacity
              key={time}
              style={[
                styles.timeChip,
                {
                  backgroundColor:
                    selectedTime === time ? colors.navyDark : colors.muted,
                },
              ]}
              onPress={() => setSelectedTime(time)}
            >
              <Text
                style={[
                  styles.timeText,
                  { color: selectedTime === time ? "#FFFFFF" : colors.foreground },
                ]}
              >
                {time}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View
        style={[
          styles.bottomBar,
          {
            paddingBottom: insets.bottom + 12,
            backgroundColor: colors.background,
            borderTopColor: colors.border,
          },
        ]}
      >
        <PrimaryButton
          title="Save new time"
          onPress={saveReschedule}
          loading={saving}
        />
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
  content: { paddingHorizontal: 20 },
  title: { fontSize: 24, fontFamily: "Inter_700Bold", marginTop: 12 },
  subtitle: { fontSize: 13, lineHeight: 20, fontFamily: "Inter_400Regular", marginTop: 7, marginBottom: 26 },
  label: { fontSize: 14, fontFamily: "Inter_600SemiBold", marginBottom: 10 },
  dateGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 26 },
  dateCard: { width: "31%", minHeight: 62, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  dateDay: { fontSize: 11, fontFamily: "Inter_500Medium", marginBottom: 5 },
  dateValue: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  timeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  timeChip: { borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11 },
  timeText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  bottomBar: { position: "absolute", bottom: 0, left: 0, right: 0, paddingHorizontal: 20, paddingTop: 14, borderTopWidth: 1 },
});