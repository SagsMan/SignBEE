import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import PrimaryButton from "@/components/PrimaryButton";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function WithdrawScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { availableBalance, withdrawWalletFunds, paymentPinSet } = useApp();
  const [amount, setAmount] = useState("");
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);
  const topPad = Platform.OS === "web" ? 20 : insets.top;

  const submit = async () => {
    const value = Number(amount.replace(/,/g, ""));
    if (!Number.isFinite(value) || value <= 0) {
      Alert.alert("Enter an amount", "Enter a withdrawal amount greater than zero.");
      return;
    }
    if (!destination.trim()) {
      Alert.alert("Add destination", "Enter the bank account or destination for this demo withdrawal.");
      return;
    }
    if (!paymentPinSet) {
      Alert.alert("Set up your payment PIN", "Create a payment PIN before withdrawing funds.", [
        { text: "Set up PIN", onPress: () => router.push("/payment-pin") },
        { text: "Cancel", style: "cancel" },
      ]);
      return;
    }
    setLoading(true);
    try {
      const result = await withdrawWalletFunds(value, destination);
      router.replace({
        pathname: "/payment-success",
        params: {
          source: "top_up",
          amount: String(value),
          transactionId: result.transactionId,
          method: "withdrawal",
        },
      });
    } catch (error) {
      Alert.alert("Withdrawal failed", error instanceof Error ? error.message : "We could not complete this demo withdrawal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={[styles.container, { backgroundColor: colors.background }]} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={[styles.header, { paddingTop: topPad + 6 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.navyDark }]}>Withdraw</Text>
        <View style={styles.iconButton} />
      </View>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 110 }]} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: colors.navyDark }]}>Withdraw funds</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Move funds from your local demo wallet to a destination you choose.
        </Text>
        <View style={[styles.balanceCard, { backgroundColor: colors.greenLight }]}>
          <Text style={[styles.balanceLabel, { color: colors.mutedForeground }]}>Available balance</Text>
          <Text style={[styles.balance, { color: colors.navyDark }]}>₦{availableBalance.toLocaleString()}</Text>
        </View>
        <Field label="Amount" value={amount} placeholder="0" onChangeText={value => setAmount(value.replace(/[^\d]/g, ""))} keyboardType="number-pad" colors={colors} prefix="₦" />
        <Field label="Withdrawal destination" value={destination} placeholder="Bank account or wallet details" onChangeText={setDestination} colors={colors} />
        <View style={[styles.note, { backgroundColor: colors.muted }]}>
          <Feather name="shield" size={16} color={colors.mutedForeground} />
          <Text style={[styles.noteText, { color: colors.mutedForeground }]}>
            This local demo records the withdrawal and updates your balance. No banking service is connected.
          </Text>
        </View>
      </ScrollView>
      <View style={[styles.bottomBar, { paddingBottom: Platform.OS === "web" ? 24 : insets.bottom + 12, backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <PrimaryButton title="Review withdrawal" onPress={submit} loading={loading} />
      </View>
    </KeyboardAvoidingView>
  );
}

function Field({
  label,
  value,
  placeholder,
  onChangeText,
  colors,
  keyboardType,
  prefix,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChangeText: (value: string) => void;
  colors: ReturnType<typeof useColors>;
  keyboardType?: "number-pad" | "default";
  prefix?: string;
}) {
  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: colors.foreground }]}>{label}</Text>
      <View style={[styles.inputWrap, { borderColor: colors.border }]}>
        {prefix ? <Text style={[styles.prefix, { color: colors.mutedForeground }]}>{prefix}</Text> : null}
        <TextInput style={[styles.input, { color: colors.foreground }]} value={value} placeholder={placeholder} placeholderTextColor={colors.mutedForeground} onChangeText={onChangeText} keyboardType={keyboardType} />
      </View>
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
  balanceCard: { borderRadius: 15, padding: 16, marginBottom: 22 },
  balanceLabel: { fontSize: 12, marginBottom: 5 },
  balance: { fontSize: 26, fontFamily: "Inter_700Bold" },
  field: { marginBottom: 17 },
  label: { fontSize: 13, fontFamily: "Inter_500Medium", marginBottom: 8 },
  inputWrap: { minHeight: 52, borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 13, flexDirection: "row", alignItems: "center" },
  prefix: { fontSize: 18, fontFamily: "Inter_600SemiBold", marginRight: 8 },
  input: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular" },
  note: { borderRadius: 12, padding: 12, flexDirection: "row", gap: 8, alignItems: "flex-start" },
  noteText: { flex: 1, fontSize: 11, lineHeight: 17 },
  bottomBar: { position: "absolute", bottom: 0, left: 0, right: 0, paddingHorizontal: 20, paddingTop: 14, borderTopWidth: 1 },
});