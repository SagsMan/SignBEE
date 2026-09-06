import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import PrimaryButton from "@/components/PrimaryButton";
import { PaymentMethodType, useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function PaymentMethodScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const {
    bookingDraft,
    savedCards,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
  } = useApp();
  const [selectedCardId, setSelectedCardId] = useState<string | null>(
    savedCards[0]?.id || null,
  );

  const topPad = Platform.OS === "web" ? 20 : insets.top;
  const amount = bookingDraft?.rate || 0;

  const chooseMethod = (method: PaymentMethodType) => {
    setSelectedPaymentMethod(method);
  };

  const continueToPayment = async () => {
    if (!bookingDraft) {
      Alert.alert("No booking selected", "Return to booking and choose an interpreter first.");
      router.replace("/booking");
      return;
    }
    if (!selectedPaymentMethod) {
      Alert.alert("Choose a payment method", "Select card payment or bank transfer to continue.");
      return;
    }
    await setSelectedPaymentMethod(selectedPaymentMethod);
    router.push(
      selectedPaymentMethod === "card"
        ? {
            pathname: "/card-payment",
            params: selectedCardId ? { savedCardId: selectedCardId } : undefined,
          }
        : "/bank-transfer",
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 6 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.navyDark }]}>
          Payment method
        </Text>
        <View style={styles.iconButton} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 110 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: colors.navyDark }]}>
          Choose how to pay
        </Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Your payment is handled locally for this demo. No money will be moved.
        </Text>

        <View style={[styles.amountCard, { backgroundColor: colors.greenLight }]}>
          <Text style={[styles.amountLabel, { color: colors.mutedForeground }]}>
            Amount due
          </Text>
          <Text style={[styles.amount, { color: colors.navyDark }]}>
            ₦{amount.toLocaleString()}
          </Text>
          <Text style={[styles.amountMeta, { color: colors.mutedForeground }]}>
            {bookingDraft?.interpreterName || "Interpreter booking"}
          </Text>
        </View>

        <Text style={[styles.sectionLabel, { color: colors.foreground }]}>
          Payment options
        </Text>
        <PaymentOption
          icon="credit-card"
          title="Card payment"
          description="Pay securely with a debit or credit card"
          selected={selectedPaymentMethod === "card"}
          onPress={() => chooseMethod("card")}
          colors={colors}
        />
        <PaymentOption
          icon="briefcase"
          title="Bank transfer"
          description="Get transfer instructions for this payment"
          selected={selectedPaymentMethod === "bank_transfer"}
          onPress={() => chooseMethod("bank_transfer")}
          colors={colors}
        />

        {savedCards.length > 0 ? (
          <>
            <View style={styles.savedHeader}>
              <Text style={[styles.sectionLabel, { color: colors.foreground }]}>
                Saved cards
              </Text>
              <Text style={[styles.savedHint, { color: colors.mutedForeground }]}>
                Select a card
              </Text>
            </View>
            {savedCards.map(card => (
              <TouchableOpacity
                key={card.id}
                style={[
                  styles.cardRow,
                  {
                    backgroundColor: colors.muted,
                    borderColor:
                      selectedCardId === card.id && selectedPaymentMethod === "card"
                        ? colors.navyDark
                        : colors.border,
                  },
                ]}
                onPress={() => {
                  setSelectedCardId(card.id);
                  chooseMethod("card");
                }}
              >
                <View style={[styles.cardIcon, { backgroundColor: colors.navyDark }]}>
                  <Feather name="credit-card" size={18} color={colors.primary} />
                </View>
                <View style={styles.cardCopy}>
                  <Text style={[styles.cardName, { color: colors.foreground }]}>
                    {card.brand} •••• {card.last4}
                  </Text>
                  <Text style={[styles.cardMeta, { color: colors.mutedForeground }]}>
                    Expires {card.expiry}
                  </Text>
                </View>
                <View
                  style={[
                    styles.radio,
                    {
                      borderColor:
                        selectedCardId === card.id && selectedPaymentMethod === "card"
                          ? colors.navyDark
                          : colors.border,
                    },
                  ]}
                >
                  {selectedCardId === card.id && selectedPaymentMethod === "card" ? (
                    <View style={[styles.radioDot, { backgroundColor: colors.navyDark }]} />
                  ) : null}
                </View>
              </TouchableOpacity>
            ))}
          </>
        ) : null}
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
        <PrimaryButton title="Continue" onPress={continueToPayment} />
      </View>
    </View>
  );
}

function PaymentOption({
  icon,
  title,
  description,
  selected,
  onPress,
  colors,
}: {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  description: string;
  selected: boolean;
  onPress: () => void;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <TouchableOpacity
      style={[
        styles.option,
        {
          borderColor: selected ? colors.navyDark : colors.border,
          backgroundColor: selected ? colors.greenLight : colors.background,
        },
      ]}
      onPress={onPress}
    >
      <View style={[styles.optionIcon, { backgroundColor: colors.muted }]}>
        <Feather name={icon} size={19} color={colors.navyDark} />
      </View>
      <View style={styles.optionCopy}>
        <Text style={[styles.optionTitle, { color: colors.foreground }]}>{title}</Text>
        <Text style={[styles.optionDescription, { color: colors.mutedForeground }]}>
          {description}
        </Text>
      </View>
      <View style={[styles.radio, { borderColor: selected ? colors.navyDark : colors.border }]}>
        {selected ? <View style={[styles.radioDot, { backgroundColor: colors.navyDark }]} /> : null}
      </View>
    </TouchableOpacity>
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
  title: { fontSize: 24, fontFamily: "Inter_700Bold", marginBottom: 6 },
  subtitle: { fontSize: 13, lineHeight: 20, marginBottom: 20 },
  amountCard: { borderRadius: 16, padding: 18, marginBottom: 24 },
  amountLabel: { fontSize: 12, marginBottom: 5 },
  amount: { fontSize: 28, fontFamily: "Inter_700Bold" },
  amountMeta: { fontSize: 12, marginTop: 4 },
  sectionLabel: { fontSize: 14, fontFamily: "Inter_600SemiBold", marginBottom: 10 },
  option: {
    minHeight: 76,
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },
  optionIcon: { width: 42, height: 42, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  optionCopy: { flex: 1 },
  optionTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold", marginBottom: 4 },
  optionDescription: { fontSize: 11, lineHeight: 16 },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  radioDot: { width: 10, height: 10, borderRadius: 5 },
  savedHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
  },
  savedHint: { fontSize: 11, marginBottom: 10 },
  cardRow: {
    minHeight: 72,
    borderWidth: 1,
    borderRadius: 14,
    padding: 11,
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    marginBottom: 10,
  },
  cardIcon: { width: 40, height: 40, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  cardCopy: { flex: 1 },
  cardName: { fontSize: 13, fontFamily: "Inter_600SemiBold", marginBottom: 4 },
  cardMeta: { fontSize: 11 },
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