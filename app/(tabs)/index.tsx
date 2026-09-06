import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import InterpreterCard from "@/components/InterpreterCard";
import InterpreterDashboardScreen from "@/components/interpreter/InterpreterDashboardScreen";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const {
    user,
    interpreters,
    bookings,
    favoriteInterpreterIds,
    toggleFavorite,
    walletBalance,
    availableBalance,
    unreadNotificationCount,
  } = useApp();

  const [search, setSearch] = useState("");
  const [bookingType, setBookingType] = useState<"In-person" | "Virtual">(
    "In-person",
  );

  const topPad = Platform.OS === "web" ? 20 : insets.top;
  const topInterpreters = [...interpreters]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 2);
  const upcomingBookings = bookings
    .filter(booking => booking.status === "upcoming")
    .slice(0, 2);

  const openInterpreterSearch = () => {
    router.push({
      pathname: "/interpreters",
      params: { type: bookingType, search: search.trim() },
    });
  };

  if (user?.role === "interpreter") {
    return <InterpreterDashboardScreen />;
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: topPad + 16, paddingBottom: insets.bottom + 100 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.topRow}>
        <View style={styles.greetingRow}>
          <Image
            source={require("@/assets/images/interpreter_female.png")}
            style={styles.userAvatar}
          />
          <View>
            <Text style={[styles.greeting, { color: colors.primary }]}>
              Hi {user?.name || "there"}!
            </Text>
            <Text style={[styles.subtitle, { color: colors.foreground }]}>
              Let’s break barriers together.
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.notifBtn, { backgroundColor: colors.muted }]}
          onPress={() => router.push("/notification-center")}
        >
          <Feather name="bell" size={20} color={colors.navyDark} />
          {unreadNotificationCount > 0 ? (
            <View style={[styles.notificationDot, { backgroundColor: colors.destructive }]} />
          ) : null}
        </TouchableOpacity>
      </View>

      <View style={[styles.modeSwitch, { backgroundColor: colors.muted }]}>
        {(["In-person", "Virtual"] as const).map(type => (
          <TouchableOpacity
            key={type}
            style={[
              styles.modeButton,
              bookingType === type && {
                backgroundColor: colors.background,
                borderBottomColor: colors.primary,
              },
            ]}
            onPress={() => setBookingType(type)}
          >
            <Text
              style={[
                styles.modeText,
                {
                  color:
                    bookingType === type
                      ? colors.navyDark
                      : colors.mutedForeground,
                },
              ]}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View
        style={[
          styles.searchBox,
          { backgroundColor: colors.background, borderColor: colors.border },
        ]}
      >
        <Feather name="search" size={16} color={colors.mutedForeground} />
        <TextInput
          style={[styles.searchInput, { color: colors.foreground }]}
          placeholder="Search by name, location, languages"
          placeholderTextColor={colors.mutedForeground}
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={openInterpreterSearch}
          returnKeyType="search"
        />
        <TouchableOpacity
          onPress={openInterpreterSearch}
          accessibilityLabel="Open interpreter filters"
        >
          <Feather name="sliders" size={17} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={[styles.heroCard, { backgroundColor: colors.greenLight }]}>
        <View style={styles.heroCopy}>
          <Text style={[styles.heroTitle, { color: colors.navyDark }]}>
            Book for Any Occasion!
          </Text>
          <Text style={[styles.heroText, { color: colors.mutedForeground }]}>
            Whether it&apos;s a medical emergency or a last-minute meeting find
            and book virtually or in person.
          </Text>
          <TouchableOpacity
            style={[styles.heroButton, { backgroundColor: colors.navyDark }]}
            onPress={() => router.push("/booking")}
          >
            <Text style={[styles.heroButtonText, { color: colors.primary }]}>
              Book Now
            </Text>
          </TouchableOpacity>
        </View>
        <Image
          source={require("@/assets/images/interpreter_female.png")}
          style={styles.heroImage}
        />
      </View>

      <TouchableOpacity
        style={[styles.walletCard, { backgroundColor: colors.navyDark }]}
        onPress={() => router.push("/wallet")}
      >
        <View style={styles.walletCopy}>
          <Text style={[styles.walletEyebrow, { color: colors.primary }]}>SignBee wallet</Text>
          <Text style={[styles.walletBalance, { color: "#FFFFFF" }]}>
            ₦{walletBalance.toLocaleString()}
          </Text>
          <Text style={[styles.walletMeta, { color: "#FFFFFF" }]}>
            ₦{availableBalance.toLocaleString()} available
          </Text>
        </View>
        <View style={[styles.walletIcon, { backgroundColor: colors.primary }]}>
          <Feather name="arrow-up-right" size={20} color={colors.navyDark} />
        </View>
      </TouchableOpacity>

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.navyDark }]}>
          Upcoming Bookings
        </Text>
        {upcomingBookings.length > 0 && (
          <TouchableOpacity onPress={() => router.push("/(tabs)/bookings")}>
            <Text style={[styles.seeAll, { color: colors.mutedForeground }]}>
              See all
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {upcomingBookings.length === 0 ? (
        <TouchableOpacity
          style={[styles.emptyBooking, { borderColor: colors.border }]}
          onPress={() => router.push("/booking")}
        >
          <Feather name="clock" size={28} color={colors.mutedForeground} />
          <Text
            style={[styles.emptyBookingTitle, { color: colors.mutedForeground }]}
          >
            No upcoming bookings
          </Text>
          <Text style={[styles.emptyBookingLink, { color: colors.primary }]}>
            Book your first interpreter
          </Text>
        </TouchableOpacity>
      ) : (
        upcomingBookings.map(booking => (
          <TouchableOpacity
            key={booking.id}
            style={[styles.upcomingCard, { borderColor: colors.border }]}
            onPress={() => router.push("/(tabs)/bookings")}
          >
            <View
              style={[
                styles.bookingThumb,
                { backgroundColor: colors.greenLight },
              ]}
            >
              <Feather
                name={booking.type === "Virtual" ? "video" : "map-pin"}
                size={22}
                color={colors.navyDark}
              />
            </View>
            <View style={styles.bookingCopy}>
              <Text style={[styles.bookingTitle, { color: colors.foreground }]}>
                {booking.purpose} appointment
              </Text>
              <Text
                style={[styles.bookingMeta, { color: colors.mutedForeground }]}
              >
                {booking.date}, {booking.time} · {booking.language}
              </Text>
            </View>
            <Feather
              name="arrow-right"
              size={18}
              color={colors.mutedForeground}
            />
          </TouchableOpacity>
        ))
      )}

      <View style={[styles.sectionHeader, { marginTop: 22 }]}>
        <Text style={[styles.sectionTitle, { color: colors.navyDark }]}>
          Top Interpreters
        </Text>
        <TouchableOpacity onPress={() => router.push("/interpreters")}>
          <Text style={[styles.seeAll, { color: colors.mutedForeground }]}>
            See all
          </Text>
        </TouchableOpacity>
      </View>

      {topInterpreters.map(interpreter => (
        <InterpreterCard
          key={interpreter.id}
          interpreter={interpreter}
          onPress={() => router.push(`/interpreter/${interpreter.id}`)}
          onFavorite={() => toggleFavorite(interpreter.id)}
          isFavorite={favoriteInterpreterIds.includes(interpreter.id)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20 },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  greetingRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  userAvatar: { width: 40, height: 40, borderRadius: 20 },
  greeting: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  subtitle: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 2 },
  notifBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  notificationDot: {
    position: "absolute",
    top: 8,
    right: 9,
    width: 7,
    height: 7,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
  modeSwitch: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 4,
    marginBottom: 12,
  },
  modeButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 9,
    borderRadius: 9,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  modeText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    height: 48,
    gap: 10,
    marginBottom: 16,
  },
  searchInput: { flex: 1, fontSize: 13, fontFamily: "Inter_400Regular" },
  heroCard: {
    minHeight: 141,
    borderRadius: 14,
    overflow: "hidden",
    flexDirection: "row",
    marginBottom: 28,
  },
  heroCopy: { flex: 1, padding: 16, zIndex: 1 },
  heroTitle: { fontSize: 15, fontFamily: "Inter_700Bold", marginBottom: 6 },
  heroText: { fontSize: 10, lineHeight: 14, maxWidth: 182 },
  heroButton: {
    alignSelf: "flex-start",
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 8,
    marginTop: 10,
  },
  heroButtonText: { fontSize: 12, fontFamily: "Inter_700Bold" },
  heroImage: {
    width: 145,
    height: 165,
    resizeMode: "cover",
    alignSelf: "flex-end",
    marginRight: -8,
    marginBottom: -22,
  },
  walletCard: {
    minHeight: 106,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 26,
  },
  walletCopy: { flex: 1 },
  walletEyebrow: { fontSize: 11, fontFamily: "Inter_600SemiBold", marginBottom: 6 },
  walletBalance: { fontSize: 24, fontFamily: "Inter_700Bold", marginBottom: 4 },
  walletMeta: { fontSize: 11, opacity: 0.75 },
  walletIcon: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 17, fontFamily: "Inter_700Bold" },
  seeAll: { fontSize: 13, fontFamily: "Inter_500Medium" },
  emptyBooking: {
    minHeight: 150,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 16,
  },
  emptyBookingTitle: { fontSize: 14, fontFamily: "Inter_400Regular" },
  emptyBookingLink: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  upcomingCard: {
    minHeight: 96,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 12,
    gap: 12,
  },
  bookingThumb: {
    width: 76,
    height: 64,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  bookingCopy: { flex: 1 },
  bookingTitle: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 5,
  },
  bookingMeta: { fontSize: 12, fontFamily: "Inter_400Regular" },
});