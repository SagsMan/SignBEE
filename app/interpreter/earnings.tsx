import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import {
  EmptyState,
  formatCurrency,
  InterpreterCard,
  InterpreterScreen,
  SectionLabel,
  StatTile,
  StatusPill,
} from "@/components/interpreter/InterpreterShared";
import { BackButton } from "@/components/interpreter/InterpreterShared";

export default function InterpreterEarningsScreen() {
  const colors = useColors();
  const { interpreterEarnings } = useApp();
  const available = interpreterEarnings.filter(item => item.status === "available" || item.status === "paid").reduce((sum, item) => sum + item.amount, 0);
  const pending = interpreterEarnings.filter(item => item.status === "pending").reduce((sum, item) => sum + item.amount, 0);
  const total = interpreterEarnings.reduce((sum, item) => sum + item.amount, 0);

  return (
    <InterpreterScreen title="Earnings" subtitle="Track what you have earned from completed interpretation work." action={<BackButton />}>
      <View style={[styles.hero, { backgroundColor: colors.navyDark }]}>
        <Text style={[styles.heroLabel, { color: colors.primary }]}>Total earnings</Text>
        <Text style={[styles.heroAmount, { color: "#FFFFFF" }]}>{formatCurrency(total)}</Text>
        <Text style={[styles.heroHint, { color: "#FFFFFF" }]}>Local demo values based on your shared booking state.</Text>
      </View>
      <View style={styles.statsRow}>
        <StatTile label="Available" value={formatCurrency(available)} icon="check-circle" accent={colors.success} />
        <StatTile label="Pending" value={formatCurrency(pending)} icon="clock" accent={colors.star} />
      </View>
      <SectionLabel>History</SectionLabel>
      {interpreterEarnings.length === 0 ? (
        <EmptyState icon="trending-up" title="No earnings yet" description="When you complete an accepted job, its earning will appear here." />
      ) : (
        interpreterEarnings.map(earning => (
          <InterpreterCard key={earning.id}>
            <View style={styles.row}>
              <View style={[styles.earningIcon, { backgroundColor: colors.greenLight }]}>
                <Feather name={earning.status === "pending" ? "clock" : "arrow-down-left"} size={17} color={colors.navyDark} />
              </View>
              <View style={styles.copy}>
                <Text style={[styles.client, { color: colors.foreground }]}>{earning.clientName}</Text>
                <Text style={[styles.description, { color: colors.mutedForeground }]}>{earning.description}</Text>
                <Text style={[styles.date, { color: colors.mutedForeground }]}>{new Date(earning.date).toLocaleDateString()}</Text>
              </View>
              <View style={styles.amountCopy}>
                <Text style={[styles.amount, { color: colors.navyDark }]}>{formatCurrency(earning.amount)}</Text>
                <StatusPill label={earning.status === "available" ? "Available" : earning.status === "paid" ? "Paid" : "Pending"} tone={earning.status === "pending" ? "warning" : "success"} />
              </View>
            </View>
          </InterpreterCard>
        ))
      )}
    </InterpreterScreen>
  );
}

const styles = StyleSheet.create({
  hero: { marginHorizontal: 20, borderRadius: 20, padding: 18, marginBottom: 14 },
  heroLabel: { fontSize: 11, fontFamily: "Inter_600SemiBold", marginBottom: 6 },
  heroAmount: { fontSize: 29, fontFamily: "Inter_700Bold", marginBottom: 6 },
  heroHint: { fontSize: 11, lineHeight: 16, fontFamily: "Inter_400Regular", opacity: 0.72 },
  statsRow: { flexDirection: "row", gap: 9, marginHorizontal: 20, marginBottom: 20 },
  row: { flexDirection: "row", alignItems: "center" },
  earningIcon: { width: 41, height: 41, borderRadius: 13, alignItems: "center", justifyContent: "center", marginRight: 11 },
  copy: { flex: 1, paddingRight: 8 },
  client: { fontSize: 14, fontFamily: "Inter_600SemiBold", marginBottom: 4 },
  description: { fontSize: 11, fontFamily: "Inter_400Regular", marginBottom: 5 },
  date: { fontSize: 10, fontFamily: "Inter_400Regular" },
  amountCopy: { alignItems: "flex-end", gap: 7 },
  amount: { fontSize: 13, fontFamily: "Inter_700Bold" },
});