import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import BookingCard from "@/components/BookingCard";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

type StatusFilter = "upcoming" | "ongoing" | "completed" | "cancelled";

const TABS: { key: StatusFilter; label: string }[] = [
  { key: "upcoming", label: "Upcoming" },
  { key: "ongoing", label: "Ongoing" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

export default function BookingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { bookings } = useApp();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<StatusFilter>("upcoming");

  const topPad = Platform.OS === "web" ? 20 : insets.top;

  const filtered = bookings.filter(b => b.status === activeTab);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 16 }]}>
        <Text style={[styles.title, { color: colors.navyDark }]}>
          My Bookings
        </Text>
      </View>

      <View style={[styles.tabRow, { borderBottomColor: colors.border }]}>
        {TABS.map(t => (
          <TouchableOpacity
            key={t.key}
            style={[
              styles.tab,
              activeTab === t.key && {
                borderBottomColor: colors.navyDark,
                borderBottomWidth: 2,
              },
            ]}
            onPress={() => setActiveTab(t.key)}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    activeTab === t.key
                      ? colors.navyDark
                      : colors.mutedForeground,
                  fontFamily:
                    activeTab === t.key
                      ? "Inter_600SemiBold"
                      : "Inter_400Regular",
                },
              ]}
            >
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: insets.bottom + 100 },
          filtered.length === 0 && styles.listEmpty,
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="calendar" size={44} color={colors.border} />
            <Text
              style={[styles.emptyTitle, { color: colors.navyDark }]}
            >
              No {activeTab} bookings
            </Text>
            <Text
              style={[styles.emptyText, { color: colors.mutedForeground }]}
            >
              Your {activeTab} bookings will appear here.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <BookingCard
            booking={item}
            onPress={() =>
              router.push({
                pathname: "/appointment/[id]",
                params: { id: item.id },
              })
            }
            onCancel={
              item.status === "upcoming"
                ? () =>
                    router.push({
                      pathname: "/cancel-booking/[id]",
                      params: { id: item.id },
                    })
                : undefined
            }
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 16 },
  title: { fontSize: 24, fontFamily: "Inter_700Bold" },
  tabRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: "center" },
  tabText: { fontSize: 12 },
  list: { paddingHorizontal: 20, paddingTop: 4 },
  listEmpty: { flex: 1 },
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
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    maxWidth: 260,
  },
});
