import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import PrimaryButton from "@/components/PrimaryButton";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function PaymentSuccessScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { source = "booking", amount = "0", transactionId, bookingId, method } =
    useLocalSearchParams<{
      source?: "booking" | "top_up" | "add_funds";
      amount?: string;
      transactionId?: string;
      bookingId?: string;
      method?: string;
    }>();
  const { transactions, bookingDraft } = useApp();
  const transaction = transactions.find(item => item.id === transactionId);
  const topPad = Platform.OS === "web" ? 20 : insets.top;
  const isBooking = source === "booking";
  const isWithdrawal = method === "withdrawal";

  const continueFlow = () => {
    if (isBooking && bookingId) {
      router.replace({ pathname: "/booking-confirmation", params: { id: bookingId } });
    } else {
      router.replace("/wallet");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: topPad + 12 }]}>
      <TouchableOpacity onPress={continueFlow} style={styles.close}>
        <Feather name="x" size={22} color={colors.foreground} />
      </TouchableOpacity>
      <View style={styles.content}>
        <View style={[styles.successIcon, { backgroundColor: colors.greenLight }]}>
          <Feather name="check" size={42} color={colors.navyDark} />
        </View>
        <Text style={[styles.title, { color: colors.navyDark }]}>
          {isBooking ? "Payment successful" : isWithdrawal ? "Withdrawal recorded" : "Funds added successfully"}
        </Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          {isBooking
            ? "Your payment is recorded and your interpreter booking is confirmed."
            : isWithdrawal
              ? "Your local demo wallet balance has been updated with this withdrawal."
            : "Your local demo wallet balance has been updated."}
        </Text>
        <View style={[styles.summary, { borderColor: colors.border }]}>
          <SummaryRow label="Amount" value={`₦${Number(amount).toLocaleString()}`} colors={colors} strong />
          <SummaryRow
            label="Payment method"
            value={isWithdrawal ? "Wallet withdrawal" : method === "bank_transfer" ? "Bank transfer" : "Card"}
            colors={colors}
          />
          <SummaryRow
            label="Reference"
            value={transaction?.reference || "Recorded locally"}
            colors={colors}
          />
          {isBooking && bookingDraft?.interpreterName ? (
            <SummaryRow label="Interpreter" value={bookingDraft.interpreterName} colors={colors} />
          ) : null}
        </View>
        <View style={[styles.demoTag, { backgroundColor: colors.muted }]}>
          <Feather name="info" size={15} color={colors.mutedForeground} />
          <Text style={[styles.demoText, { color: colors.mutedForeground }]}>
            This is a local demo transaction. Connect a payment provider before accepting real payments.
          </Text>
        </View>
      </View>
      <View style={[styles.bottom, { paddingBottom: Platform.OS === "web" ? 24 : insets.bottom + 12 }]}>
        <PrimaryButton title={isBooking ? "View booking" : "Go to wallet"} onPress={continueFlow} />
      </View>
    </View>
  );
}

function SummaryRow({
  label,
  value,
  colors,
  strong,
}: {
  label: string;
  value: string;
  colors: ReturnType<typeof useColors>;
  strong?: boolean;
}) {
  return (
    <View style={styles.summaryRow}>
      <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>{label}</Text>
      <Text style={[styles.summaryValue, { color: colors.foreground, fontFamily: strong ? "Inter_700Bold" : "Inter_500Medium" }]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  close: { alignSelf: "flex-end", width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  content: { flex: 1, alignItems: "center", justifyContent: "center", paddingBottom: 75 },
  successIcon: { width: 84, height: 84, borderRadius: 42, alignItems: "center", justifyContent: "center", marginBottom: 22 },
  title: { fontSize: 26, fontFamily: "Inter_700Bold", textAlign: "center", marginBottom: 8 },
  subtitle: { fontSize: 13, lineHeight: 20, textAlign: "center", maxWidth: 310, marginBottom: 24 },
  summary: { width: "100%", borderWidth: 1, borderRadius: 16, paddingHorizontal: 16 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", gap: 14, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "#EBEBEB" },
  summaryLabel: { fontSize: 12 },
  summaryValue: { flex: 1, fontSize: 12, textAlign: "right" },
  demoTag: { width: "100%", borderRadius: 12, padding: 12, flexDirection: "row", gap: 8, alignItems: "flex-start", marginTop: 14 },
  demoText: { flex: 1, fontSize: 11, lineHeight: 16 },
  bottom: { paddingTop: 14 },
});