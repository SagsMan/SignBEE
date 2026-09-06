import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import {
  InterpreterCard,
  InterpreterScreen,
  SectionLabel,
  StatTile,
  StatusPill,
} from "@/components/interpreter/InterpreterShared";

export default function InterpreterProfileScreen() {
  const colors = useColors();
  const router = useRouter();
  const { user, interpreterProfile, interpreterEarnings, logout } = useApp();

  const verifiedCredentials = interpreterProfile.credentials.filter(item => item.status === "verified").length;
  const availableEarnings = interpreterEarnings
    .filter(item => item.status === "available" || item.status === "paid")
    .reduce((total, item) => total + item.amount, 0);

  const handleLogout = () => {
    Alert.alert("Log out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/login");
        },
      },
    ]);
  };

  return (
    <InterpreterScreen
      title="Profile"
      subtitle="Keep your professional information current for clients."
      action={
        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: colors.muted }]}
          onPress={() => router.push("/interpreter/edit-profile")}
          accessibilityLabel="Edit profile"
        >
          <Feather name="edit-2" size={17} color={colors.navyDark} />
        </TouchableOpacity>
      }
    >
      <InterpreterCard>
        <View style={styles.profileHeader}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={[styles.avatarText, { color: colors.navyDark }]}>
              {(interpreterProfile.name || user?.name || "I").charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.profileCopy}>
            <Text style={[styles.name, { color: colors.navyDark }]}>{interpreterProfile.name || user?.name}</Text>
            <Text style={[styles.email, { color: colors.mutedForeground }]}>{user?.email}</Text>
            <View style={styles.profileMeta}>
              <StatusPill
                label={interpreterProfile.availability.isAvailableNow ? "Available now" : "Offline"}
                tone={interpreterProfile.availability.isAvailableNow ? "success" : "neutral"}
              />
              {interpreterProfile.rating > 0 ? (
                <Text style={[styles.rating, { color: colors.mutedForeground }]}>
                  {interpreterProfile.rating.toFixed(1)} rating · {interpreterProfile.reviews} reviews
                </Text>
              ) : null}
            </View>
          </View>
        </View>
        <Text style={[styles.bio, { color: colors.foreground }]}>{interpreterProfile.bio}</Text>
      </InterpreterCard>

      <View style={styles.statsRow}>
        <StatTile label="Experience" value={`${interpreterProfile.experienceYears} yrs`} icon="award" />
        <StatTile label="Credentials" value={String(verifiedCredentials)} icon="shield" accent={colors.success} />
        <StatTile label="Earnings" value={`₦${Math.round(availableEarnings / 1000)}k`} icon="trending-up" accent={colors.star} />
      </View>

      <SectionLabel>Professional details</SectionLabel>
      <ProfileLink icon="message-circle" label="Sign languages" value={`${interpreterProfile.languages.length} language${interpreterProfile.languages.length === 1 ? "" : "s"}`} onPress={() => router.push("/interpreter/languages")} />
      <ProfileLink icon="briefcase" label="Experience & specializations" value={interpreterProfile.specialties.length ? interpreterProfile.specialties.slice(0, 2).join(" · ") : "Add your experience"} onPress={() => router.push("/interpreter/experience")} />
      <ProfileLink icon="file-text" label="Credentials" value={`${interpreterProfile.credentials.length} added · ${verifiedCredentials} verified`} onPress={() => router.push("/interpreter/credentials")} />
      <ProfileLink icon="calendar" label="Availability" value={interpreterProfile.availability.isAvailableNow ? "Available now" : "Schedule only"} onPress={() => router.push("/interpreter/availability")} />
      <ProfileLink icon="sliders" label="Preferences" value="Job types, locations & alerts" onPress={() => router.push("/interpreter/preferences")} />

      <SectionLabel>Account</SectionLabel>
      <ProfileLink icon="bell" label="Notifications" value="View your latest updates" onPress={() => router.push("/notification-center")} />
      <ProfileLink icon="credit-card" label="Earnings" value="History and payment status" onPress={() => router.push("/interpreter/earnings")} />
      <TouchableOpacity style={[styles.logout, { borderColor: colors.destructive }]} onPress={handleLogout}>
        <Feather name="log-out" size={17} color={colors.destructive} />
        <Text style={[styles.logoutText, { color: colors.destructive }]}>Log out</Text>
      </TouchableOpacity>
    </InterpreterScreen>
  );
}

function ProfileLink({ icon, label, value, onPress }: { icon: string; label: string; value: string; onPress: () => void }) {
  const colors = useColors();
  return (
    <TouchableOpacity style={[styles.link, { borderColor: colors.border }]} onPress={onPress} activeOpacity={0.75}>
      <View style={[styles.linkIcon, { backgroundColor: colors.muted }]}>
        <Feather name={icon as any} size={17} color={colors.navyDark} />
      </View>
      <View style={styles.linkCopy}>
        <Text style={[styles.linkLabel, { color: colors.foreground }]}>{label}</Text>
        <Text style={[styles.linkValue, { color: colors.mutedForeground }]}>{value}</Text>
      </View>
      <Feather name="chevron-right" size={17} color={colors.mutedForeground} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  iconButton: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  profileHeader: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 66, height: 66, borderRadius: 22, alignItems: "center", justifyContent: "center", marginRight: 14 },
  avatarText: { fontSize: 27, fontFamily: "Inter_700Bold" },
  profileCopy: { flex: 1 },
  name: { fontSize: 18, fontFamily: "Inter_700Bold", marginBottom: 3 },
  email: { fontSize: 11, fontFamily: "Inter_400Regular", marginBottom: 8 },
  profileMeta: { flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" },
  rating: { fontSize: 11, fontFamily: "Inter_400Regular" },
  bio: { fontSize: 13, lineHeight: 19, fontFamily: "Inter_400Regular", marginTop: 15 },
  statsRow: { flexDirection: "row", gap: 9, marginHorizontal: 20, marginBottom: 20 },
  link: { marginHorizontal: 20, minHeight: 67, borderWidth: 1, borderRadius: 16, paddingHorizontal: 14, marginBottom: 9, flexDirection: "row", alignItems: "center" },
  linkIcon: { width: 36, height: 36, borderRadius: 11, alignItems: "center", justifyContent: "center", marginRight: 12 },
  linkCopy: { flex: 1 },
  linkLabel: { fontSize: 13, fontFamily: "Inter_600SemiBold", marginBottom: 4 },
  linkValue: { fontSize: 11, fontFamily: "Inter_400Regular" },
  logout: { marginHorizontal: 20, marginTop: 10, borderWidth: 1, borderRadius: 13, paddingVertical: 13, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8 },
  logoutText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
});