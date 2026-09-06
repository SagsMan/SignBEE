import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function TransactionDetailsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { transactions } = useApp();
  const transaction = transactions.find(item => item.id === id);
  const topPad = Platform.OS === "web" ? 20 : insets.top;

  if (!transaction) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, paddingTop: topPad + 12 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <View style={styles.notFound}>
          <Text style={[styles.notFoundTitle, { color: colors.navyDark }]}>Transaction not found</Text>
          <Text style={[styles.notFoundText, { color: colors.mutedForeground }]}>This transaction may have been cleared from this device.</Text>
        </View>
      </View>
    );
  }

  const isCredit = transaction.type === "top_up";
  const icon = transaction.type === "payment" ? "shopping-bag" : transaction.type === "withdrawal" ? "arrow-up-right" : "plus";

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 6 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.navyDark }]}>Transaction details</Text>
        <View style={styles.iconButton} />
      </View>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 30 }]} showsVerticalScrollIndicator={false}>
        <View style={[styles.iconCircle, { backgroundColor: isCredit ? colors.greenLight : colors.muted }]}>
          <Feather name={icon} size={24} color={colors.navyDark} />
        </View>
        <Text style={[styles.amount, { color: colors.navyDark }]}>
          {isCredit ? "+" : "-"}₦{transaction.amount.toLocaleString()}
        </Text>
        <Text style={[styles.description, { color: colors.mutedForeground }]}>{transaction.description}</Text>
        <View style={[styles.status, { backgroundColor: transaction.status === "success" ? colors.greenLight : colors.muted }]}>
          <Feather name={transaction.status === "success" ? "check-circle" : "clock"} size={15} color={colors.navyDark} />
          <Text style={[styles.statusText, { color: colors.navyDark }]}>{transaction.status}</Text>
        </View>
        <View style={[styles.details, { borderColor: colors.border }]}>
          <Row label="Reference" value={transaction.reference} colors={colors} />
          <Row label="Date" value={new Date(transaction.date).toLocaleString()} colors={colors} />
          <Row label="Type" value={transaction.type.replace("_", " ")} colors={colors} />
          {transaction.paymentMethod ? <Row label="Payment method" value={transaction.paymentMethod === "bank_transfer" ? "Bank transfer" : "Card"} colors={colors} /> : null}
          {transaction.destination ? <Row label="Destination" value={transaction.destination} colors={colors} /> : null}
        </View>
        <View style={[styles.note, { backgroundColor: colors.muted }]}>
          <Feather name="info" size={15} color={colors.mutedForeground} />
          <Text style={[styles.noteText, { color: colors.mutedForeground }]}>Transaction records are stored locally on this device for the demo.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

function Row({ label, value, colors }: { label: string; value: string; colors: ReturnType<typeof useColors> }) {
  return (
    <View style={styles.row}>
      <Text style={[styles.label, { color: colors.mutedForeground }]}>{label}</Text>
      <Text style={[styles.value, { color: colors.foreground }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 18 },
  iconButton: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 17, fontFamily: "Inter_700Bold" },
  content: { paddingHorizontal: 20, alignItems: "center" },
  iconCircle: { width: 70, height: 70, borderRadius: 35, alignItems: "center", justifyContent: "center", marginTop: 25, marginBottom: 18 },
  amount: { fontSize: 30, fontFamily: "Inter_700Bold", marginBottom: 7 },
  description: { fontSize: 13, marginBottom: 13 },
  status: { flexDirection: "row", alignItems: "center", gap: 6, borderRadius: 18, paddingHorizontal: 12, paddingVertical: 7, marginBottom: 25 },
  statusText: { fontSize: 11, fontFamily: "Inter_600SemiBold", textTransform: "capitalize" },
  details: { width: "100%", borderWidth: 1, borderRadius: 15, paddingHorizontal: 16 },
  row: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "#EBEBEB", width: "100%" },
  label: { fontSize: 11, marginBottom: 4 },
  value: { fontSize: 13, fontFamily: "Inter_500Medium" },
  note: { width: "100%", borderRadius: 12, padding: 12, flexDirection: "row", gap: 8, marginTop: 14 },
  noteText: { flex: 1, fontSize: 11, lineHeight: 17 },
  notFound: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 30 },
  notFoundTitle: { fontSize: 18, fontFamily: "Inter_600SemiBold", marginBottom: 7 },
  notFoundText: { fontSize: 13, textAlign: "center", lineHeight: 18 },
});