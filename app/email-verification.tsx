import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import InputField from "@/components/InputField";
import PrimaryButton from "@/components/PrimaryButton";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function EmailVerificationScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string }>();
  const { user, pendingVerificationEmail, verifyEmail } = useApp();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  const email = params.email || pendingVerificationEmail || user?.email || "";
  const topPad = Platform.OS === "web" ? 67 : insets.top + 12;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom + 16;

  const handleVerify = async () => {
    if (code.trim() !== "123456") {
      setError("Enter the six-digit code shown on the previous screen.");
      return;
    }
    setLoading(true);
    setError("");
    const verified = await verifyEmail(email);
    setLoading(false);
    if (!verified) {
      setError("We could not match this email to the pending account.");
      return;
    }
    router.replace("/location-permission");
  };

  return (
    <KeyboardAwareScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: topPad, paddingBottom: bottomPad },
      ]}
      keyboardShouldPersistTaps="handled"
      bottomOffset={20}
      showsVerticalScrollIndicator={false}
    >
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Feather name="arrow-left" size={22} color={colors.foreground} />
      </TouchableOpacity>
      <View style={styles.header}>
        <View style={[styles.iconCircle, { backgroundColor: colors.greenLight }]}>
          <Feather name="mail" size={28} color={colors.navyDark} />
        </View>
        <Text style={[styles.title, { color: colors.navyDark }]}>
          Check your email
        </Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Enter the verification code for {email || "your email address"}.
        </Text>
      </View>

      <InputField
        label="Verification code"
        placeholder="123456"
        value={code}
        onChangeText={value => {
          setCode(value.replace(/[^0-9]/g, "").slice(0, 6));
          setError("");
        }}
        error={error}
        keyboardType="number-pad"
        autoCapitalize="none"
        autoComplete="one-time-code"
        maxLength={6}
      />

      <PrimaryButton
        title="Verify email"
        onPress={handleVerify}
        loading={loading}
        style={styles.cta}
      />

      <TouchableOpacity
        style={styles.resendBtn}
        onPress={() => setNotice("A resend action is ready for the email service integration.")}
      >
        <Text style={[styles.resendText, { color: colors.navyDark }]}>
          Resend code
        </Text>
      </TouchableOpacity>
      {notice ? (
        <Text style={[styles.notice, { color: colors.mutedForeground }]}>
          {notice}
        </Text>
      ) : null}
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 24 },
  backBtn: { width: 40, height: 40, justifyContent: "center", marginBottom: 36 },
  header: { alignItems: "center", marginBottom: 32 },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  title: { fontSize: 26, fontFamily: "Inter_700Bold", marginBottom: 12 },
  subtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 330,
  },
  cta: { marginTop: 8 },
  resendBtn: { alignItems: "center", padding: 14 },
  resendText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  notice: { fontSize: 12, fontFamily: "Inter_400Regular", textAlign: "center" },
});