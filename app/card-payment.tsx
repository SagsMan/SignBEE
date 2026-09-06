import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import PrimaryButton from "@/components/PrimaryButton";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

function formatCardNumber(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, "$1 ");
}

function detectBrand(number: string) {
  if (/^4/.test(number)) return "Visa" as const;
  if (/^(5[1-5]|2[2-7])/.test(number)) return "Mastercard" as const;
  if (/^(506|507|650)/.test(number)) return "Verve" as const;
  return "Card" as const;
}

function isValidCardNumber(value: string) {
  const digits = value.replace(/\s/g, "");
  if (!/^\d{16}$/.test(digits)) return false;
  let sum = 0;
  let shouldDouble = false;
  for (let index = digits.length - 1; index >= 0; index -= 1) {
    let digit = Number(digits[index]);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

export default function CardPaymentScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { source = "booking", amount: amountParam, savedCardId } =
    useLocalSearchParams<{
      source?: "booking" | "top_up" | "add_funds";
      amount?: string;
      savedCardId?: string;
    }>();
  const {
    bookingDraft,
    savedCards,
    completeBookingPayment,
    addWalletFunds,
    addSavedCard,
  } = useApp();
  const savedCard = savedCards.find(card => card.id === savedCardId);
  const amount = bookingDraft?.rate || Number(amountParam) || 0;
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [holderName, setHolderName] = useState("");
  const [saveCard, setSaveCard] = useState(true);
  const [loading, setLoading] = useState(false);

  const brand = useMemo(
    () => detectBrand(cardNumber.replace(/\s/g, "")),
    [cardNumber],
  );
  const topPad = Platform.OS === "web" ? 20 : insets.top;

  const processPayment = async () => {
    if (savedCard) {
      await finishPayment();
      return;
    }
    if (!isValidCardNumber(cardNumber)) {
      Alert.alert("Check card number", "Enter a valid 16-digit card number.");
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      Alert.alert("Check expiry date", "Use the MM/YY format.");
      return;
    }
    if (!/^\d{3,4}$/.test(cvv)) {
      Alert.alert("Check CVV", "Enter the 3 or 4 digit security code.");
      return;
    }
    if (!holderName.trim()) {
      Alert.alert("Cardholder name required", "Enter the name shown on the card.");
      return;
    }
    if (saveCard) {
      setLoading(true);
      try {
        const added = await addSavedCard({
          brand,
          last4: cardNumber.replace(/\s/g, "").slice(-4),
          expiry,
          holderName: holderName.trim(),
        });
        router.replace({
          pathname: "/card-added",
          params: {
            source,
            amount: String(amount),
            savedCardId: added.id,
          },
        });
      } finally {
        setLoading(false);
      }
      return;
    }
    await finishPayment();
  };

  const finishPayment = async () => {
    if (amount <= 0) {
      Alert.alert("Amount unavailable", "Return to the previous screen and try again.");
      return;
    }
    setLoading(true);
    try {
      if (source === "booking") {
        const result = await completeBookingPayment("card");
        router.replace({
          pathname: "/payment-success",
          params: {
            source,
            amount: String(amount),
            transactionId: result.transactionId,
            bookingId: result.bookingId,
            method: "card",
          },
        });
      } else {
        const result = await addWalletFunds(amount, "card");
        router.replace({
          pathname: "/payment-success",
          params: {
            source,
            amount: String(amount),
            transactionId: result.transactionId,
            method: "card",
          },
        });
      }
    } catch (error) {
      Alert.alert(
        "Payment failed",
        error instanceof Error ? error.message : "We could not complete this demo payment.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={[styles.header, { paddingTop: topPad + 6 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.navyDark }]}>
          Card payment
        </Text>
        <View style={styles.iconButton} />
      </View>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 110 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.amountRow, { backgroundColor: colors.greenLight }]}>
          <View>
            <Text style={[styles.amountLabel, { color: colors.mutedForeground }]}>
              Paying
            </Text>
            <Text style={[styles.amount, { color: colors.navyDark }]}>
              ₦{amount.toLocaleString()}
            </Text>
          </View>
          <View style={[styles.lock, { backgroundColor: colors.navyDark }]}>
            <Feather name="lock" size={17} color={colors.primary} />
          </View>
        </View>

        {savedCard ? (
          <View style={[styles.savedCard, { borderColor: colors.navyDark, backgroundColor: colors.muted }]}>
            <View style={[styles.cardIcon, { backgroundColor: colors.navyDark }]}>
              <Feather name="credit-card" size={20} color={colors.primary} />
            </View>
            <View style={styles.savedCopy}>
              <Text style={[styles.savedTitle, { color: colors.foreground }]}>
                {savedCard.brand} •••• {savedCard.last4}
              </Text>
              <Text style={[styles.savedMeta, { color: colors.mutedForeground }]}>
                Expires {savedCard.expiry} · {savedCard.holderName}
              </Text>
            </View>
            <Feather name="check-circle" size={20} color={colors.success} />
          </View>
        ) : (
          <>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Enter card details
            </Text>
            <Field
              label="Card number"
              value={cardNumber}
              placeholder="1234 5678 9012 3456"
              keyboardType="number-pad"
              onChangeText={value => setCardNumber(formatCardNumber(value))}
              colors={colors}
              suffix={cardNumber.length >= 4 ? brand : undefined}
            />
            <View style={styles.splitRow}>
              <View style={styles.splitField}>
                <Field
                  label="Expiry date"
                  value={expiry}
                  placeholder="MM/YY"
                  keyboardType="number-pad"
                  onChangeText={value => {
                    const digits = value.replace(/\D/g, "").slice(0, 4);
                    setExpiry(digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits);
                  }}
                  colors={colors}
                />
              </View>
              <View style={styles.splitField}>
                <Field
                  label="CVV"
                  value={cvv}
                  placeholder="•••"
                  keyboardType="number-pad"
                  secureTextEntry
                  onChangeText={value => setCvv(value.replace(/\D/g, "").slice(0, 4))}
                  colors={colors}
                />
              </View>
            </View>
            <Field
              label="Cardholder name"
              value={holderName}
              placeholder="Name on card"
              autoCapitalize="words"
              onChangeText={setHolderName}
              colors={colors}
            />
            <TouchableOpacity
              style={styles.saveRow}
              onPress={() => setSaveCard(value => !value)}
            >
              <View style={[styles.checkbox, { borderColor: saveCard ? colors.navyDark : colors.border }]}>
                {saveCard ? <Feather name="check" size={13} color={colors.navyDark} /> : null}
              </View>
              <Text style={[styles.saveText, { color: colors.foreground }]}>
                Save this card for future payments
              </Text>
            </TouchableOpacity>
          </>
        )}

        <View style={[styles.demoNote, { backgroundColor: colors.muted }]}>
          <Feather name="info" size={16} color={colors.mutedForeground} />
          <Text style={[styles.demoText, { color: colors.mutedForeground }]}>
            Demo mode: card details are validated locally. Full card numbers and CVV are never saved.
          </Text>
        </View>
      </ScrollView>
      <View
        style={[
          styles.bottomBar,
          {
            paddingBottom: Platform.OS === "web" ? 24 : insets.bottom + 12,
            backgroundColor: colors.background,
            borderTopColor: colors.border,
          },
        ]}
      >
        <PrimaryButton
          title={savedCard ? `Pay ₦${amount.toLocaleString()}` : saveCard ? "Add card" : "Pay now"}
          onPress={processPayment}
          loading={loading}
        />
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
  secureTextEntry,
  autoCapitalize,
  suffix,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChangeText: (value: string) => void;
  colors: ReturnType<typeof useColors>;
  keyboardType?: "number-pad" | "default";
  secureTextEntry?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  suffix?: string;
}) {
  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: colors.foreground }]}>{label}</Text>
      <View style={[styles.inputWrap, { borderColor: colors.border }]}>
        <TextInput
          style={[styles.input, { color: colors.foreground }]}
          value={value}
          placeholder={placeholder}
          placeholderTextColor={colors.mutedForeground}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          autoCapitalize={autoCapitalize}
          maxLength={label === "Card number" ? 19 : undefined}
        />
        {suffix ? <Text style={[styles.suffix, { color: colors.mutedForeground }]}>{suffix}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  iconButton: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 17, fontFamily: "Inter_700Bold" },
  content: { paddingHorizontal: 20 },
  amountRow: {
    borderRadius: 16,
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  amountLabel: { fontSize: 12, marginBottom: 5 },
  amount: { fontSize: 27, fontFamily: "Inter_700Bold" },
  lock: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  sectionTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold", marginBottom: 14 },
  field: { marginBottom: 15 },
  label: { fontSize: 12, fontFamily: "Inter_500Medium", marginBottom: 7 },
  inputWrap: {
    minHeight: 51,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
  },
  input: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular" },
  suffix: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  splitRow: { flexDirection: "row", gap: 12 },
  splitField: { flex: 1 },
  saveRow: { flexDirection: "row", alignItems: "center", gap: 9, marginBottom: 20 },
  checkbox: { width: 20, height: 20, borderWidth: 1.5, borderRadius: 5, alignItems: "center", justifyContent: "center" },
  saveText: { fontSize: 12 },
  demoNote: { borderRadius: 12, padding: 12, flexDirection: "row", gap: 9, alignItems: "flex-start" },
  demoText: { flex: 1, fontSize: 11, lineHeight: 17 },
  savedCard: {
    borderWidth: 1.5,
    borderRadius: 15,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    marginBottom: 20,
  },
  cardIcon: { width: 42, height: 42, borderRadius: 11, alignItems: "center", justifyContent: "center" },
  savedCopy: { flex: 1 },
  savedTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold", marginBottom: 4 },
  savedMeta: { fontSize: 11 },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 14,
    borderTopWidth: 1,
  },
});