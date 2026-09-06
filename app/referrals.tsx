import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, Share, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { AccountCard, AccountScreen, BackButton } from "@/components/account/AccountShared";
import { EmptyState } from "@/components/interpreter/InterpreterShared";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function ReferralsScreen() {
  const colors = useColors();
  const router = useRouter();
  const { referralCode, referralHistory, shareReferral } = useApp();
  const invite = async () => {
    const result = await Share.share({ message: `Join me on SignBEE with my referral code ${referralCode}.` });
    if (result.action === Share.sharedAction) await shareReferral();
  };
  const copyHint = () => Alert.alert("Referral code", `${referralCode}\n\nUse the share button to send this code from your device.`);

  return (
    <AccountScreen title="Referrals" subtitle="Invite someone to try SignBEE. Referral rewards are local demo values." action={<BackButton />}>
      <AccountCard>
        <View style={styles.heroTop}><View style={[styles.icon, { backgroundColor: colors.primary }]}><Feather name="send" size={20} color={colors.navyDark} /></View><View style={styles.copy}><Text style={[styles.heroTitle, { color: colors.navyDark }]}>Invite a friend</Text><Text style={[styles.heroText, { color: colors.mutedForeground }]}>Share your code with someone who could benefit from accessible communication.</Text></View></View>
        <TouchableOpacity onPress={copyHint} style={[styles.code, { backgroundColor: colors.greenLight }]}><Text style={[styles.codeLabel, { color: colors.mutedForeground }]}>Your referral code</Text><Text style={[styles.codeText, { color: colors.navyDark }]}>{referralCode}</Text></TouchableOpacity>
        <TouchableOpacity onPress={invite} style={[styles.shareButton, { backgroundColor: colors.navyDark }]}><Feather name="share-2" size={16} color={colors.primary} /><Text style={[styles.shareText, { color: colors.primary }]}>Share referral code</Text></TouchableOpacity>
      </AccountCard>
      <Text style={[styles.sectionTitle, { color: colors.navyDark }]}>Referral history</Text>
      {referralHistory.length === 0 ? <EmptyState icon="users" title="No invitations yet" description="Your shared invitations will appear here after you use the share action." /> : referralHistory.map(item => <View key={item.id} style={[styles.history, { backgroundColor: colors.card, borderColor: colors.border }]}><View style={[styles.historyIcon, { backgroundColor: colors.muted }]}><Feather name="user" size={16} color={colors.navyDark} /></View><View style={styles.copy}><Text style={[styles.historyName, { color: colors.foreground }]}>{item.name}</Text><Text style={[styles.historyMeta, { color: colors.mutedForeground }]}>{item.status} · {new Date(item.date).toLocaleDateString()}</Text></View><Text style={[styles.reward, { color: colors.success }]}>+₦{item.reward.toLocaleString()}</Text></View>)}
    </AccountScreen>
  );
}

const styles = StyleSheet.create({
  heroTop: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  icon: { width: 44, height: 44, borderRadius: 15, alignItems: "center", justifyContent: "center", marginRight: 11 },
  copy: { flex: 1 },
  heroTitle: { fontSize: 15, fontFamily: "Inter_700Bold", marginBottom: 4 },
  heroText: { fontSize: 11, lineHeight: 16, fontFamily: "Inter_400Regular" },
  code: { borderRadius: 13, padding: 13, marginBottom: 12 },
  codeLabel: { fontSize: 10, fontFamily: "Inter_500Medium", marginBottom: 5 },
  codeText: { fontSize: 19, letterSpacing: 1, fontFamily: "Inter_700Bold" },
  shareButton: { borderRadius: 12, paddingVertical: 13, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8 },
  shareText: { fontSize: 13, fontFamily: "Inter_700Bold" },
  sectionTitle: { marginHorizontal: 20, fontSize: 17, fontFamily: "Inter_700Bold", marginBottom: 12, marginTop: 5 },
  history: { marginHorizontal: 20, borderWidth: 1, borderRadius: 16, padding: 13, marginBottom: 9, flexDirection: "row", alignItems: "center" },
  historyIcon: { width: 37, height: 37, borderRadius: 12, alignItems: "center", justifyContent: "center", marginRight: 11 },
  historyName: { fontSize: 13, fontFamily: "Inter_600SemiBold", marginBottom: 4 },
  historyMeta: { fontSize: 10, fontFamily: "Inter_400Regular" },
  reward: { fontSize: 12, fontFamily: "Inter_700Bold" },
});