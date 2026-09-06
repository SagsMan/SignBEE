import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import PrimaryButton from "@/components/PrimaryButton";
import { PaymentMethodType, useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const AMOUNTS = [5000, 10000, 20000, 50000];

export default function AddFundsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { mode = "add_funds" } = useLocalSearchParams<{ mode?: "add_funds" | "top_up" }>();
  const { selectedPaymentMethod, setSelectedPaymentMethod } = useApp();
  const [amount, setAmount] = useState("");
  const topPad = Platform.OS === "web" ? 20 : insets.top;
  const isTopUp = mode === "top_up";

  const continueToPayment = async () => {
    const numericAmount = Number(amount.replace(/,/g, ""));
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      Alert.alert("Enter an amount", "Choose an amount or enter a value greater than zero.");
      return;
    }
    if (!selectedPaymentMethod) {
      Alert.alert("Choose a payment method", "Select card payment or bank transfer to continue.");
      return;
    }
    await setSelectedPaymentMethod(selectedPaymentMethod);
    router.push(
      selectedPaymentMethod === "card"
        ? { pathname: "/card-payment", params: { source: mode, amount: String(numericAmount) } }
        : { pathname: "/bank-transfer", params: { source: mode, amount: String(numericAmount) } },
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 6 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.navyDark }]}>
          {isTopUp ? "Top-up wallet" : "Add funds"}
        </Text>
        <View style={styles.iconButton} />
      </View>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 110 }]} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: colors.navyDark }]}>
          {isTopUp ? "How much do you want to top-up?" : "Add money to your wallet"}
        </Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Choose an amount, then select how you would like to fund your local demo wallet.
        </Text>
        <Text style={[styles.label, { color: colors.foreground }]}>Amount</Text>
        <View style={[styles.amountInput, { borderColor: colors.border }]}>
          <Text style={[styles.currency, { color: colors.mutedForeground }]}>₦</Text>
          <TextInput
            style={[styles.input, { color: colors.foreground }]}
            value={amount}
            onChangeText={value => setAmount(value.replace(/[^\d]/g, ""))}
            placeholder="0"
            placeholderTextColor={colors.mutedForeground}
            keyboardType="number-pad"
          />
        </View>
        <View style={styles.amountGrid}>
          {AMOUNTS.map(value => (
            <TouchableOpacity
              key={value}
              style={[styles.amountChip, { backgroundColor: Number(amount) === value ? colors.navyDark : colors.muted }]}
              onPress={() => setAmount(String(value))}
            >
              <Text style={[styles.amountChipText, { color: Number(amount) === value ? "#FFFFFF" : colors.foreground }]}>
                ₦{value.toLocaleString()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Payment method</Text>
        <Method
          icon="credit-card"
          title="Card payment"
          description="Use a saved or new card"
          method="card"
          selected={selectedPaymentMethod === "card"}
          onPress={() => setSelectedPaymentMethod("card")}
          colors={colors}
        />
        <Method
          icon="briefcase"
          title="Bank transfer"
          description="Follow transfer instructions"
          method="bank_transfer"
          selected={selectedPaymentMethod === "bank_transfer"}
          onPress={() => setSelectedPaymentMethod("bank_transfer")}
          colors={colors}
        />
        <View style={[styles.note, { backgroundColor: colors.muted }]}>
          <Feather name="info" size={16} color={colors.mutedForeground} />
          <Text style={[styles.noteText, { color: colors.mutedForeground }]}>
            Demo mode: successful funding updates this device&apos;s wallet and transaction history only.
          </Text>
        </View>
      </ScrollView>
      <View style={[styles.bottomBar, { paddingBottom: Platform.OS === "web" ? 24 : insets.bottom + 12, backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <PrimaryButton title="Continue" onPress={continueToPayment} />
      </View>
    </View>
  );
}

function Method({
  icon,
  title,
  description,
  method,
  selected,
  onPress,
  colors,
}: {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  description: string;
  method: PaymentMethodType;
  selected: boolean;
  onPress: () => void;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <TouchableOpacity style={[styles.method, { borderColor: selected ? colors.navyDark : colors.border, backgroundColor: selected ? colors.greenLight : colors.background }]} onPress={onPress}>
      <View style={[styles.methodIcon, { backgroundColor: colors.muted }]}>
        <Feather name={icon} size={18} color={colors.navyDark} />
      </View>
      <View style={styles.methodCopy}>
        <Text style={[styles.methodTitle, { color: colors.foreground }]}>{title}</Text>
        <Text style={[styles.methodDescription, { color: colors.mutedForeground }]}>{description}</Text>
      </View>
      <View style={[styles.radio, { borderColor: selected ? colors.navyDark : colors.border }]}>
        {selected ? <View style={[styles.dot, { backgroundColor: colors.navyDark }]} /> : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 16 },
  iconButton: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 17, fontFamily: "Inter_700Bold" },
  content: { paddingHorizontal: 20 },
  title: { fontSize: 24, fontFamily: "Inter_700Bold", marginBottom: 6 },
  subtitle: { fontSize: 13, lineHeight: 20, marginBottom: 22 },
  label: { fontSize: 13, fontFamily: "Inter_500Medium", marginBottom: 8 },
  amountInput: { height: 58, borderWidth: 1.5, borderRadius: 13, paddingHorizontal: 15, flexDirection: "row", alignItems: "center", marginBottom: 12 },
  currency: { fontSize: 22, fontFamily: "Inter_600SemiBold", marginRight: 8 },
  input: { flex: 1, fontSize: 24, fontFamily: "Inter_700Bold" },
  amountGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 28 },
  amountChip: { borderRadius: 18, paddingHorizontal: 14, paddingVertical: 9 },
  amountChipText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  sectionTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold", marginBottom: 10 },
  method: { minHeight: 70, borderWidth: 1.5, borderRadius: 14, padding: 11, flexDirection: "row", alignItems: "center", gap: 11, marginBottom: 10 },
  methodIcon: { width: 40, height: 40, borderRadius: 11, alignItems: "center", justifyContent: "center" },
  methodCopy: { flex: 1 },
  methodTitle: { fontSize: 13, fontFamily: "Inter_600SemiBold", marginBottom: 4 },
  methodDescription: { fontSize: 11 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, alignItems: "center", justifyContent: "center" },
  dot: { width: 10, height: 10, borderRadius: 5 },
  note: { borderRadius: 12, padding: 12, flexDirection: "row", gap: 8, alignItems: "flex-start", marginTop: 10 },
  noteText: { flex: 1, fontSize: 11, lineHeight: 17 },
  bottomBar: { position: "absolute", bottom: 0, left: 0, right: 0, paddingHorizontal: 20, paddingTop: 14, borderTopWidth: 1 },
});