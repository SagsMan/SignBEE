import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { AccountCard, AccountScreen, BackButton } from "@/components/account/AccountShared";
import { EmptyState, formatCurrency, StatusPill } from "@/components/interpreter/InterpreterShared";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function RewardsScreen() {
  const colors = useColors();
  const { rewards } = useApp();
  const balance = rewards.filter(reward => reward.status === "earned").reduce((sum, reward) => sum + reward.amount, 0);
  return (
    <AccountScreen title="Rewards" subtitle="See your earned rewards and local demo activity." action={<BackButton />}>
      <View style={[styles.hero, { backgroundColor: colors.navyDark }]}>
        <View style={[styles.heroIcon, { backgroundColor: colors.primary }]}><Feather name="gift" size={21} color={colors.navyDark} /></View>
        <View><Text style={[styles.heroLabel, { color: colors.primary }]}>Rewards balance</Text><Text style={[styles.heroAmount, { color: "#FFFFFF" }]}>{formatCurrency(balance)}</Text></View>
      </View>
      <AccountCard>
        <Text style={[styles.cardTitle, { color: colors.navyDark }]}>How rewards work</Text>
        <Text style={[styles.cardText, { color: colors.mutedForeground }]}>Rewards shown here are local demo values. Real earning, redemption, and payout processing require a connected rewards service.</Text>
      </AccountCard>
      <Text style={[styles.sectionTitle, { color: colors.navyDark }]}>Reward history</Text>
      {rewards.length === 0 ? <EmptyState icon="gift" title="No rewards yet" description="Earned rewards will appear here when the rewards program is connected." /> : rewards.map(reward => <View key={reward.id} style={[styles.rewardRow, { backgroundColor: colors.card, borderColor: colors.border }]}><View style={[styles.rewardIcon, { backgroundColor: colors.greenLight }]}><Feather name={reward.status === "redeemed" ? "check" : "gift"} size={16} color={colors.navyDark} /></View><View style={styles.copy}><Text style={[styles.rewardTitle, { color: colors.foreground }]}>{reward.title}</Text><Text style={[styles.rewardDescription, { color: colors.mutedForeground }]}>{reward.description}</Text><Text style={[styles.rewardDate, { color: colors.mutedForeground }]}>{new Date(reward.date).toLocaleDateString()}</Text></View><View style={styles.amount}><Text style={[styles.amountText, { color: colors.navyDark }]}>{formatCurrency(reward.amount)}</Text><StatusPill label={reward.status === "earned" ? "Earned" : "Redeemed"} tone={reward.status === "earned" ? "success" : "neutral"} /></View></View>)}
    </AccountScreen>
  );
}

const styles = StyleSheet.create({
  hero: { marginHorizontal: 20, borderRadius: 20, padding: 18, flexDirection: "row", alignItems: "center", marginBottom: 14 },
  heroIcon: { width: 43, height: 43, borderRadius: 15, alignItems: "center", justifyContent: "center", marginRight: 12 },
  heroLabel: { fontSize: 11, fontFamily: "Inter_600SemiBold", marginBottom: 5 },
  heroAmount: { fontSize: 27, fontFamily: "Inter_700Bold" },
  cardTitle: { fontSize: 15, fontFamily: "Inter_700Bold", marginBottom: 7 },
  cardText: { fontSize: 12, lineHeight: 19, fontFamily: "Inter_400Regular" },
  sectionTitle: { marginHorizontal: 20, fontSize: 17, fontFamily: "Inter_700Bold", marginTop: 6, marginBottom: 12 },
  rewardRow: { marginHorizontal: 20, borderWidth: 1, borderRadius: 16, padding: 13, marginBottom: 9, flexDirection: "row", alignItems: "center" },
  rewardIcon: { width: 37, height: 37, borderRadius: 12, alignItems: "center", justifyContent: "center", marginRight: 11 },
  copy: { flex: 1, paddingRight: 8 },
  rewardTitle: { fontSize: 13, fontFamily: "Inter_600SemiBold", marginBottom: 3 },
  rewardDescription: { fontSize: 10, lineHeight: 15, fontFamily: "Inter_400Regular", marginBottom: 4 },
  rewardDate: { fontSize: 10, fontFamily: "Inter_400Regular" },
  amount: { alignItems: "flex-end", gap: 6 },
  amountText: { fontSize: 12, fontFamily: "Inter_700Bold" },
});