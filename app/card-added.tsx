import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import PrimaryButton from "@/components/PrimaryButton";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function CardAddedScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { source = "booking", amount = "0", savedCardId } =
    useLocalSearchParams<{
      source?: "booking" | "top_up" | "add_funds";
      amount?: string;
      savedCardId?: string;
    }>();
  const { savedCards } = useApp();
  const card = savedCards.find(item => item.id === savedCardId);
  const topPad = Platform.OS === "web" ? 20 : insets.top;

  const continueToPayment = () => {
    router.replace({
      pathname: "/card-payment",
      params: { source, amount, savedCardId },
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: topPad + 12 }]}>
      <TouchableOpacity onPress={() => router.replace("/(tabs)")} style={styles.close}>
        <Feather name="x" size={22} color={colors.foreground} />
      </TouchableOpacity>
      <View style={styles.content}>
        <View style={[styles.successIcon, { backgroundColor: colors.greenLight }]}>
          <Feather name="check" size={40} color={colors.navyDark} />
        </View>
        <Text style={[styles.title, { color: colors.navyDark }]}>Card added</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Your card has been saved for faster payments. Only masked card details are kept.
        </Text>
        {card ? (
          <View style={[styles.card, { backgroundColor: colors.navyDark }]}>
            <View style={styles.cardTop}>
              <Text style={[styles.brand, { color: colors.primary }]}>{card.brand}</Text>
              <Feather name="credit-card" size={22} color={colors.primary} />
            </View>
            <Text style={[styles.masked, { color: "#FFFFFF" }]}>
              ••••  ••••  ••••  {card.last4}
            </Text>
            <View style={styles.cardBottom}>
              <Text style={[styles.cardMeta, { color: "#FFFFFF" }]}>{card.holderName}</Text>
              <Text style={[styles.cardMeta, { color: "#FFFFFF" }]}>{card.expiry}</Text>
            </View>
          </View>
        ) : null}
      </View>
      <View style={[styles.bottom, { paddingBottom: Platform.OS === "web" ? 24 : insets.bottom + 12 }]}>
        <PrimaryButton title={`Continue to payment · ₦${Number(amount).toLocaleString()}`} onPress={continueToPayment} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  close: { alignSelf: "flex-end", width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  content: { flex: 1, alignItems: "center", justifyContent: "center", paddingBottom: 90 },
  successIcon: { width: 78, height: 78, borderRadius: 39, alignItems: "center", justifyContent: "center", marginBottom: 22 },
  title: { fontSize: 28, fontFamily: "Inter_700Bold", marginBottom: 8 },
  subtitle: { fontSize: 13, lineHeight: 20, textAlign: "center", maxWidth: 300, marginBottom: 26 },
  card: { width: "100%", maxWidth: 360, minHeight: 190, borderRadius: 18, padding: 20, justifyContent: "space-between" },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  brand: { fontSize: 16, fontFamily: "Inter_700Bold" },
  masked: { fontSize: 20, letterSpacing: 2, fontFamily: "Inter_600SemiBold" },
  cardBottom: { flexDirection: "row", justifyContent: "space-between" },
  cardMeta: { fontSize: 11, fontFamily: "Inter_500Medium" },
  bottom: { paddingTop: 14 },
});