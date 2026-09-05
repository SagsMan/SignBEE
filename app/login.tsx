import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import InputField from "@/components/InputField";
import PrimaryButton from "@/components/PrimaryButton";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function LoginScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { login } = useApp();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const topPad = Platform.OS === "web" ? 67 : insets.top + 12;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom + 16;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!email.includes("@")) e.email = "Enter a valid email";
    if (password.length < 4) e.password = "Enter your password";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await login(email, password);
      router.replace("/(tabs)");
    } catch {
      Alert.alert("Error", "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/register")}>
          <View style={[styles.registerBtn, { borderColor: colors.border }]}>
            <Text
              style={[styles.registerBtnText, { color: colors.foreground }]}
            >
              Register
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <Text style={[styles.title, { color: colors.navyDark }]}>Log in</Text>

      <InputField
        label="Email address"
        placeholder="e.g example@gmail.com"
        value={email}
        onChangeText={setEmail}
        error={errors.email}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />
      <InputField
        label="Password"
        placeholder="••••••••••••••••"
        value={password}
        onChangeText={setPassword}
        error={errors.password}
        isPassword
        autoComplete="current-password"
      />

      <TouchableOpacity
        style={styles.forgotBtn}
        onPress={() => router.push("/forgot-password")}
      >
        <Text style={[styles.forgotText, { color: colors.navyDark }]}>
          Forgot password?
        </Text>
      </TouchableOpacity>

      <PrimaryButton
        title="Log in"
        onPress={handleLogin}
        loading={loading}
        style={styles.cta}
      />

      <Text style={[styles.orText, { color: colors.mutedForeground }]}>
        Or continue with
      </Text>

      <View style={styles.socialRow}>
        <TouchableOpacity
          style={[styles.socialBtn, { borderColor: colors.border }]}
          activeOpacity={0.8}
        >
          <Text style={{ fontSize: 20 }}>G</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.socialBtn, { borderColor: colors.border }]}
          activeOpacity={0.8}
        >
          <Feather name="aperture" size={22} color={colors.foreground} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.waitlistBtn}
        onPress={() => router.push("/waitlist")}
      >
        <Text style={[styles.waitlistText, { color: colors.navyDark }]}>
          Join the SignBee waitlist
        </Text>
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 24 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },
  backBtn: { width: 40, height: 40, justifyContent: "center" },
  registerBtn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  registerBtnText: { fontSize: 14, fontFamily: "Inter_500Medium" },
  title: { fontSize: 26, fontFamily: "Inter_700Bold", marginBottom: 28 },
  forgotBtn: { alignSelf: "flex-end", marginTop: -8, marginBottom: 20 },
  forgotText: { fontSize: 14, fontFamily: "Inter_500Medium" },
  cta: { marginBottom: 24 },
  orText: {
    textAlign: "center",
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    marginBottom: 20,
  },
  socialRow: { flexDirection: "row", justifyContent: "center", gap: 16 },
  socialBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  waitlistBtn: { alignItems: "center", marginTop: 24, padding: 8 },
  waitlistText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
});
