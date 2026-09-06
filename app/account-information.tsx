import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { AccountCard, AccountRow, AccountScreen, BackButton, SectionTitle } from "@/components/account/AccountShared";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function AccountInformationScreen() {
  const colors = useColors();
  const router = useRouter();
  const { user } = useApp();
  const initials = (user?.name || "U").split(" ").map(part => part[0]).join("").slice(0, 2).toUpperCase();

  return (
    <AccountScreen title="Account information" subtitle="Review the personal details connected to your account." action={<BackButton />}>
      <AccountCard>
        <View style={styles.profileHeader}>
          {user?.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
              <Text style={[styles.initials, { color: colors.navyDark }]}>{initials}</Text>
            </View>
          )}
          <View style={styles.profileCopy}>
            <Text style={[styles.name, { color: colors.navyDark }]}>{user?.name || "Your name"}</Text>
            <Text style={[styles.email, { color: colors.mutedForeground }]}>{user?.email || "No email added"}</Text>
          </View>
          <TouchableOpacity onPress={() => router.push("/edit-profile")} style={[styles.editCircle, { backgroundColor: colors.muted }]}>
            <Feather name="edit-2" size={16} color={colors.navyDark} />
          </TouchableOpacity>
        </View>
      </AccountCard>
      <SectionTitle>Personal details</SectionTitle>
      <AccountRow icon="user" label="Full name" value={user?.name || "Not added"} onPress={() => router.push("/edit-profile")} />
      <AccountRow icon="mail" label="Email address" value={user?.email || "Not added"} onPress={() => router.push("/edit-profile")} />
      <AccountRow icon="phone" label="Phone number" value={user?.phone || "Not added"} onPress={() => router.push("/edit-profile")} />
      <SectionTitle>Account settings</SectionTitle>
      <AccountRow icon="map-pin" label="Addresses" value="Manage saved locations" onPress={() => router.push("/addresses")} />
      <AccountRow icon="lock" label="Password & security" value="Change your password" onPress={() => router.push("/password-security")} />
    </AccountScreen>
  );
}

const styles = StyleSheet.create({
  profileHeader: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 62, height: 62, borderRadius: 21, alignItems: "center", justifyContent: "center", marginRight: 13 },
  initials: { fontSize: 23, fontFamily: "Inter_700Bold" },
  profileCopy: { flex: 1 },
  name: { fontSize: 17, fontFamily: "Inter_700Bold", marginBottom: 4 },
  email: { fontSize: 11, fontFamily: "Inter_400Regular" },
  editCircle: { width: 35, height: 35, borderRadius: 18, alignItems: "center", justifyContent: "center" },
});