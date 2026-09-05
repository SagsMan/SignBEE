import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Platform, StyleSheet, Text, TouchableOpacity } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import InputField from "@/components/InputField";
import PrimaryButton from "@/components/PrimaryButton";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function ResetPasswordScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email?: string }>();
  const { completePasswordReset } = useApp();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top + 12;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom + 16;

  const handleSubmit = async () => {
    const nextErrors: Record<string, string> = {};
    if (password.length < 6) nextErrors.password = "Use at least 6 characters.";
    if (password !== confirmation) nextErrors.confirmation = "Passwords do not match.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    await completePasswordReset(email || "");
    setLoading(false);
    router.replace("/password-changed");
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
      <Text style={[styles.title, { color: colors.navyDark }]}>
        Create a new password
      </Text>
      <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
        Choose a password you have not used before.
      </Text>
      <Text style={[styles.dependencyNote, { color: colors.mutedForeground }]}>
        This local preview validates the reset flow. A live authentication
        service is still required to update a remote account password.
      </Text>
      <InputField
        label="New password"
        placeholder="••••••••••••••••"
        value={password}
        onChangeText={value => {
          setPassword(value);
          setErrors({});
        }}
        error={errors.password}
        isPassword
        autoComplete="new-password"
      />
      <InputField
        label="Confirm new password"
        placeholder="••••••••••••••••"
        value={confirmation}
        onChangeText={value => {
          setConfirmation(value);
          setErrors({});
        }}
        error={errors.confirmation}
        isPassword
        autoComplete="new-password"
      />
      <PrimaryButton
        title="Reset password"
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
  backBtn: { width: 40, height: 40, justifyContent: "center", marginBottom: 42 },
  title: { fontSize: 26, fontFamily: "Inter_700Bold", marginBottom: 12 },
  subtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 22,
    marginBottom: 28,
  },
  dependencyNote: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
    marginBottom: 20,
  },
  cta: { marginTop: 8 },
});