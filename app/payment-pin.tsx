import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import PrimaryButton from "@/components/PrimaryButton";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function PaymentPinScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { paymentPinSet, setPaymentPin, validatePaymentPin } = useApp();
  const [mode, setMode] = useState<"enter" | "setup" | "confirm">(paymentPinSet ? "enter" : "setup");
  const [pin, setPin] = useState("");
  const [confirmedPin, setConfirmedPin] = useState("");
  const [loading, setLoading] = useState(false);
  const topPad = Platform.OS === "web" ? 20 : insets.top;
  const title = mode === "enter" ? "Enter payment PIN" : mode === "setup" ? "Set up payment PIN" : "Confirm payment PIN";

  const submit = async () => {
    if (!/^\d{4}$/.test(pin)) {
      Alert.alert("Invalid PIN", "Your payment PIN must be 4 digits.");
      return;
    }
    setLoading(true);
    try {
      if (mode === "enter") {
        const valid = await validatePaymentPin(pin);
        if (!valid) {
          setPin("");
          Alert.alert("Incorrect PIN", "That PIN does not match. Try again.");
          return;
        }
        Alert.alert("PIN verified", "Your payment PIN is correct.");
        router.back();
      } else if (mode === "setup") {
        setConfirmedPin("");
        setMode("confirm");
      } else {
        if (pin !== confirmedPin) {
          setPin("");
          setConfirmedPin("");
          Alert.alert("PINs do not match", "Enter the same 4 digits in both fields.");
          return;
        }
        const saved = await setPaymentPin(pin);
        if (!saved) return;
        Alert.alert("Payment PIN ready", "Your payment PIN has been set up on this device.", [
          { text: "Done", onPress: () => router.back() },
        ]);
      }
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
        <Text style={[styles.headerTitle, { color: colors.navyDark }]}>Payment PIN</Text>
        <View style={styles.iconButton} />
      </View>
      <View style={styles.content}>
        <View style={[styles.icon, { backgroundColor: colors.greenLight }]}>
          <Feather name="shield" size={29} color={colors.navyDark} />
        </View>
        <Text style={[styles.title, { color: colors.navyDark }]}>{title}</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          {mode === "enter"
            ? "Enter your 4-digit PIN to verify a wallet action."
            : mode === "setup"
              ? "Create a 4-digit PIN to protect wallet withdrawals and payments."
              : "Enter your PIN one more time to confirm it."}
        </Text>
        <TextInput
          style={[styles.pinInput, { borderColor: colors.border, color: colors.navyDark }]}
          value={pin}
          onChangeText={value => setPin(value.replace(/\D/g, "").slice(0, 4))}
          keyboardType="number-pad"
          secureTextEntry
          maxLength={4}
          autoFocus
          placeholder="••••"
          placeholderTextColor={colors.border}
        />
        {mode === "confirm" ? (
          <>
            <Text style={[styles.confirmLabel, { color: colors.foreground }]}>Confirm PIN</Text>
            <TextInput
              style={[styles.pinInput, { borderColor: colors.border, color: colors.navyDark }]}
              value={confirmedPin}
              onChangeText={value => setConfirmedPin(value.replace(/\D/g, "").slice(0, 4))}
              keyboardType="number-pad"
              secureTextEntry
              maxLength={4}
              placeholder="••••"
              placeholderTextColor={colors.border}
            />
          </>
        ) : null}
        {mode === "enter" ? (
          <TouchableOpacity onPress={() => { setPin(""); setMode("setup"); }}>
            <Text style={[styles.changeLink, { color: colors.navyDark }]}>Change payment PIN</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      <View style={[styles.bottom, { paddingBottom: Platform.OS === "web" ? 24 : insets.bottom + 12 }]}>
        <PrimaryButton title={mode === "enter" ? "Verify PIN" : mode === "setup" ? "Continue" : "Save PIN"} onPress={submit} loading={loading} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 16 },
  iconButton: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 17, fontFamily: "Inter_700Bold" },
  content: { flex: 1, alignItems: "center", paddingHorizontal: 20, paddingTop: 56 },
  icon: { width: 68, height: 68, borderRadius: 34, alignItems: "center", justifyContent: "center", marginBottom: 20 },
  title: { fontSize: 25, fontFamily: "Inter_700Bold", textAlign: "center", marginBottom: 8 },
  subtitle: { fontSize: 13, lineHeight: 20, textAlign: "center", maxWidth: 300, marginBottom: 28 },
  pinInput: { width: 190, height: 58, borderWidth: 1.5, borderRadius: 14, textAlign: "center", fontSize: 27, letterSpacing: 10, fontFamily: "Inter_700Bold" },
  confirmLabel: { alignSelf: "center", fontSize: 12, fontFamily: "Inter_500Medium", marginTop: 20, marginBottom: 8 },
  changeLink: { fontSize: 13, fontFamily: "Inter_600SemiBold", marginTop: 22 },
  bottom: { paddingHorizontal: 20, paddingTop: 14 },
});