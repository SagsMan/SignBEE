import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { AccountScreen, BackButton } from "@/components/account/AccountShared";
import { useColors } from "@/hooks/useColors";

const sections = [
  ["About this document", "This is placeholder content for the SignBEE demo. Official terms should be supplied and reviewed by the SignBEE team before production use."],
  ["Using SignBEE", "SignBEE helps clients discover and book sign language interpretation services. Users are responsible for keeping account information accurate and using the service lawfully."],
  ["Bookings and payments", "Booking availability, prices, cancellations, and payment processing are shown in the app experience. This prototype does not create real financial obligations or process production payments."],
  ["Interpreter information", "Interpreter profiles and credentials shown in this local demo are illustrative. Official verification and service agreements require a production backend."],
  ["Changes", "SignBEE may update these terms when the production service is launched. The current screen is not a legal acceptance record."],
];

export default function TermsScreen() {
  const colors = useColors();
  return (
    <AccountScreen title="Terms & conditions" subtitle="Demo legal content for the current prototype." action={<BackButton />}>
      <View style={[styles.notice, { backgroundColor: colors.greenLight }]}>
        <Feather name="info" size={18} color={colors.navyDark} />
        <Text style={[styles.noticeText, { color: colors.navyDark }]}>Placeholder content — replace with approved legal text before launch.</Text>
      </View>
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