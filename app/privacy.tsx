import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { AccountScreen, BackButton } from "@/components/account/AccountShared";
import { useColors } from "@/hooks/useColors";

const sections = [
  ["About this document", "This is placeholder privacy content for the SignBEE demo. Approved privacy and data-retention language should replace it before production."],
  ["Information in the demo", "The local prototype stores account, booking, address, support, and preference data on the device using AsyncStorage so the experience can be tested across screens."],
  ["Photos and permissions", "If you choose a profile photo, the demo stores the selected local image URI. You can deny photo access and continue without an image."],
  ["Sharing and security", "Do not enter real passwords, payment card numbers, PINs, or other sensitive secrets into this prototype. A production privacy and security review is required."],
  ["Your choices", "You can edit profile information, remove saved addresses, and log out from the app. Logout clears the current local session data."],
];

export default function PrivacyScreen() {
  const colors = useColors();
  return (
    <AccountScreen title="Privacy policy" subtitle="Demo privacy content for the current prototype." action={<BackButton />}>
      <View style={[styles.notice, { backgroundColor: colors.greenLight }]}><Feather name="lock" size={18} color={colors.navyDark} /><Text style={[styles.noticeText, { color: colors.navyDark }]}>Placeholder content — replace with approved privacy text before launch.</Text></View>
      <Text style={[styles.updated, { color: colors.mutedForeground }]}>Last updated: September 2026</Text>
      {sections.map(([heading, body]) => <View key={heading} style={styles.section}><Text style={[styles.heading, { color: colors.navyDark }]}>{heading}</Text><Text style={[styles.body, { color: colors.foreground }]}>{body}</Text></View>)}
    </AccountScreen>
  );
}

const styles = StyleSheet.create({
  notice: { marginHorizontal: 20, borderRadius: 15, padding: 14, flexDirection: "row", alignItems: "center", gap: 9, marginBottom: 16 },
  noticeText: { flex: 1, fontSize: 11, lineHeight: 16, fontFamily: "Inter_600SemiBold" },
  updated: { marginHorizontal: 20, fontSize: 11, fontFamily: "Inter_400Regular", marginBottom: 18 },
  section: { marginHorizontal: 20, marginBottom: 18 },
  heading: { fontSize: 15, fontFamily: "Inter_700Bold", marginBottom: 7 },
  body: { fontSize: 13, lineHeight: 21, fontFamily: "Inter_400Regular" },
});