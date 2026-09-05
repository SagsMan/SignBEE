import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import InputField from "@/components/InputField";
import PrimaryButton from "@/components/PrimaryButton";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function ForgotPasswordScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { requestPasswordReset } = useApp();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top + 12;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom + 16;

  const handleSubmit = async () => {
    if (!email.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }
    setLoading(true);
    const requested = await requestPasswordReset(email);
    setLoading(false);
    if (!requested) {
      setError("Enter a valid email address.");
      return;
    }
    router.replace({ pathname: "/reset-password", params: { email } });
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
          <Feather name="lock" size={28} color={colors.navyDark} />
        </View>
        <Text style={[styles.title, { color: colors.navyDark }]}>
          Forgot password?
        </Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Enter your email to start the password reset flow.
        </Text>
      </View>

      <InputField
        label="Email address"
        placeholder="e.g example@gmail.com"
        value={email}
        onChangeText={value => {
          setEmail(value);
          setError("");
        }}
        error={error}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />
      <View
        style={[
          styles.infoCard,
          { backgroundColor: colors.muted, borderColor: colors.border },
        ]}
      >
        <Feather name="info" size={18} color={colors.navyDark} />
        <Text style={[styles.infoText, { color: colors.foreground }]}>
          A live email provider is not connected yet. This local flow opens the
          reset form directly so it can be tested end to end.
        </Text>
      </View>
      <PrimaryButton
        title="Continue"
        onPress={handleSubmit}
        loading={loading}
        style={styles.cta}
      />
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
  },
  infoCard: {
    flexDirection: "row",
    gap: 10,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 4,
  },
  infoText: { flex: 1, fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18 },
  cta: { marginTop: 24 },
});