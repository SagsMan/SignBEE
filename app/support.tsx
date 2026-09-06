import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { AccountRow, AccountScreen, BackButton } from "@/components/account/AccountShared";
import { useApp } from "@/context/AppContext";
import { EmptyState } from "@/components/interpreter/InterpreterShared";
import { useColors } from "@/hooks/useColors";

export default function SupportScreen() {
  const colors = useColors();
  const router = useRouter();
  const { supportRequests } = useApp();
  return (
    <AccountScreen title="Help & support" subtitle="Find answers or send a message about your SignBEE experience." action={<BackButton />}>
      <View style={[styles.hero, { backgroundColor: colors.navyDark }]}>
        <View style={[styles.heroIcon, { backgroundColor: colors.primary }]}><Feather name="help-circle" size={21} color={colors.navyDark} /></View>
        <View style={styles.heroCopy}>
          <Text style={[styles.heroTitle, { color: "#FFFFFF" }]}>How can we help?</Text>
          <Text style={[styles.heroText, { color: "#FFFFFF" }]}>Browse common questions or contact support with more detail.</Text>
        </View>
      </View>
      <AccountRow icon="message-circle" label="Contact support" value="Send a question or report a problem" onPress={() => router.push("/contact-support")} />
      <AccountRow icon="search" label="Frequently asked questions" value="Find quick answers" onPress={() => router.push("/faq")} />
      <Text style={[styles.sectionTitle, { color: colors.navyDark }]}>Your support requests</Text>
      {supportRequests.length === 0 ? (
        <EmptyState icon="inbox" title="No requests yet" description="Messages you save locally will appear here for your reference." />
      ) : (
        supportRequests.slice(0, 3).map(request => (
          <View key={request.id} style={[styles.request, { borderColor: colors.border, backgroundColor: colors.card }]}>
            <View style={styles.requestHeader}>
              <Text style={[styles.requestSubject, { color: colors.foreground }]}>{request.subject}</Text>
              <Text style={[styles.requestStatus, { color: colors.success }]}>Saved locally</Text>
            </View>
            <Text style={[styles.requestMeta, { color: colors.mutedForeground }]}>{request.category} · {new Date(request.createdAt).toLocaleDateString()}</Text>
            <Text style={[styles.requestMessage, { color: colors.foreground }]} numberOfLines={2}>{request.message}</Text>
          </View>
        ))
      )}
    </AccountScreen>
  );
}

const styles = StyleSheet.create({
  hero: { marginHorizontal: 20, borderRadius: 19, padding: 16, flexDirection: "row", alignItems: "center", marginBottom: 16 },
  heroIcon: { width: 43, height: 43, borderRadius: 15, alignItems: "center", justifyContent: "center", marginRight: 12 },
  heroCopy: { flex: 1 },
  heroTitle: { fontSize: 15, fontFamily: "Inter_700Bold", marginBottom: 4 },
  heroText: { fontSize: 11, lineHeight: 16, fontFamily: "Inter_400Regular", opacity: 0.8 },
  sectionTitle: { marginHorizontal: 20, fontSize: 17, fontFamily: "Inter_700Bold", marginTop: 9, marginBottom: 12 },
  request: { marginHorizontal: 20, borderRadius: 16, borderWidth: 1, padding: 14, marginBottom: 9 },
  requestHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8 },
  requestSubject: { flex: 1, fontSize: 13, fontFamily: "Inter_600SemiBold" },
  requestStatus: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  requestMeta: { fontSize: 10, fontFamily: "Inter_400Regular", marginTop: 5 },
  requestMessage: { fontSize: 12, lineHeight: 18, fontFamily: "Inter_400Regular", marginTop: 8 },
});