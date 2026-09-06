import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import PrimaryButton from "@/components/PrimaryButton";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function BankTransferScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { source = "booking", amount: amountParam } =
    useLocalSearchParams<{ source?: "booking" | "top_up" | "add_funds"; amount?: string }>();
  const { bookingDraft, completeBookingPayment, addWalletFunds } = useApp();
  const amount = bookingDraft?.rate || Number(amountParam) || 0;
  const [loading, setLoading] = useState(false);
  const topPad = Platform.OS === "web" ? 20 : insets.top;
  const reference = `SBE-${source === "booking" ? "PAY" : "TOP"}-${String(Math.round(amount)).padStart(5, "0")}`;

  const confirmTransfer = async () => {
    if (amount <= 0) {
      Alert.alert("Amount unavailable", "Return to the previous screen and try again.");
      return;
    }
    setLoading(true);
    try {
      if (source === "booking") {
        const result = await completeBookingPayment("bank_transfer");
        router.replace({
          pathname: "/payment-success",
          params: {
            source,
            amount: String(amount),
            transactionId: result.transactionId,
            bookingId: result.bookingId,
            method: "bank_transfer",
          },
        });
      } else {
        const result = await addWalletFunds(amount, "bank_transfer");
        router.replace({
          pathname: "/payment-success",
          params: {
            source,
            amount: String(amount),
            transactionId: result.transactionId,
            method: "bank_transfer",
          },
        });
      }
    } catch (error) {
      Alert.alert(
        "Transfer failed",
        error instanceof Error ? error.message : "We could not complete this demo transfer.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 6 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.navyDark }]}>Bank transfer</Text>
        <View style={styles.iconButton} />
      </View>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 110 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: colors.navyDark }]}>Transfer details</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Use the details below, then confirm when you are ready. This is a local demo and does not move money.
        </Text>
        <View style={[styles.amountCard, { backgroundColor: colors.greenLight }]}>
          <Text style={[styles.amountLabel, { color: colors.mutedForeground }]}>Amount to transfer</Text>
          <Text style={[styles.amount, { color: colors.navyDark }]}>₦{amount.toLocaleString()}</Text>
        </View>
        <View style={[styles.detailsCard, { borderColor: colors.border }]}>
          <Detail label="Bank" value="SignBee Demo Bank" colors={colors} />
          <Detail label="Account name" value="SignBee Wallet" colors={colors} />
          <Detail label="Account number" value="012 345 6789" colors={colors} />
          <Detail label="Payment reference" value={reference} colors={colors} copyable />
        </View>
        <View style={[styles.instructionCard, { backgroundColor: colors.muted }]}>
          <Text style={[styles.instructionTitle, { color: colors.foreground }]}>How it works</Text>
          <Instruction number="1" text="Open your banking app and start a transfer." colors={colors} />
          <Instruction number="2" text={`Transfer exactly ₦${amount.toLocaleString()} using the reference above.`} colors={colors} />
          <Instruction number="3" text="Tap the button below to record this demo payment." colors={colors} />
        </View>
        <View style={styles.pendingNote}>
          <Feather name="clock" size={16} color={colors.mutedForeground} />
          <Text style={[styles.pendingText, { color: colors.mutedForeground }]}>
            Bank transfers may show as pending in a real integration. This demo marks the local state successful after confirmation.
          </Text>
        </View>
      </ScrollView>
      <View style={[styles.bottomBar, { paddingBottom: Platform.OS === "web" ? 24 : insets.bottom + 12, backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <PrimaryButton title="I’ve made the transfer" onPress={confirmTransfer} loading={loading} />
      </View>
    </View>
  );
}

function Detail({
  label,
  value,
  colors,
  copyable,
}: {
  label: string;
  value: string;
  colors: ReturnType<typeof useColors>;
  copyable?: boolean;
}) {
  return (
    <View style={styles.detailRow}>
      <Text style={[styles.detailLabel, { color: colors.mutedForeground }]}>{label}</Text>
      <View style={styles.detailValueRow}>
        <Text style={[styles.detailValue, { color: colors.foreground }]}>{value}</Text>
        {copyable ? <Feather name="copy" size={15} color={colors.mutedForeground} /> : null}
      </View>
    </View>
  );
}

function Instruction({
  number,
  text,
  colors,
}: {
  number: string;
  text: string;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={styles.instructionRow}>
      <View style={[styles.number, { backgroundColor: colors.primary }]}>
        <Text style={[styles.numberText, { color: colors.navyDark }]}>{number}</Text>
      </View>
      <Text style={[styles.instructionText, { color: colors.foreground }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 16 },
  iconButton: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 17, fontFamily: "Inter_700Bold" },
  content: { paddingHorizontal: 20 },
  title: { fontSize: 24, fontFamily: "Inter_700Bold", marginBottom: 6 },
  subtitle: { fontSize: 13, lineHeight: 20, marginBottom: 20 },
  amountCard: { padding: 18, borderRadius: 16, marginBottom: 18 },
  amountLabel: { fontSize: 12, marginBottom: 4 },
  amount: { fontSize: 28, fontFamily: "Inter_700Bold" },
  detailsCard: { borderWidth: 1, borderRadius: 15, paddingHorizontal: 16, marginBottom: 16 },
  detailRow: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "#EBEBEB" },
  detailLabel: { fontSize: 11, marginBottom: 5 },
  detailValueRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 10 },
  detailValue: { flex: 1, fontSize: 14, fontFamily: "Inter_600SemiBold" },
  instructionCard: { borderRadius: 15, padding: 16, marginBottom: 16 },
  instructionTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold", marginBottom: 13 },
  instructionRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 11 },
  number: { width: 23, height: 23, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  numberText: { fontSize: 11, fontFamily: "Inter_700Bold" },
  instructionText: { flex: 1, fontSize: 12, lineHeight: 17 },
  pendingNote: { flexDirection: "row", gap: 8, alignItems: "flex-start" },
  pendingText: { flex: 1, fontSize: 11, lineHeight: 17 },
  bottomBar: { position: "absolute", bottom: 0, left: 0, right: 0, paddingHorizontal: 20, paddingTop: 14, borderTopWidth: 1 },
});