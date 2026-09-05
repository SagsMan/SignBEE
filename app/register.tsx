import { Feather } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Alert, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import InputField from "@/components/InputField";
import PrimaryButton from "@/components/PrimaryButton";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function RegisterScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { role } = useLocalSearchParams<{
    role?: "individual" | "interpreter";
  }>();
  const { register } = useApp();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const topPad = Platform.OS === "web" ? 67 : insets.top + 12;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom + 16;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required";
    if (!email.includes("@")) e.email = "Enter a valid email";
    if (phone.length < 8) e.phone = "Enter a valid phone number";
    if (password.length < 6) e.password = "Password must be at least 6 characters";
    if (!agreed) e.agreed = "You must agree to the terms";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await register(name, email, phone, password, role || "individual");
      router.replace({
        pathname: "/verify-account",
        params: { email },
      });
    } catch {
      Alert.alert("Error", "Registration failed. Please try again.");
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
        <TouchableOpacity onPress={() => router.push("/login")}>
          <View style={[styles.loginBtn, { borderColor: colors.border }]}>
            <Text style={[styles.loginBtnText, { color: colors.foreground }]}>
              Log in
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <Text style={[styles.title, { color: colors.navyDark }]}>Sign up</Text>

      <InputField
        label="Full name"
        placeholder="e.g Mariam Ahmad"
        value={name}
        onChangeText={setName}
        error={errors.name}
        autoCapitalize="words"
        autoComplete="name"
      />
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
        label="Phone no."
        placeholder="e.g +2349133942931"
        value={phone}
        onChangeText={setPhone}
        error={errors.phone}
        keyboardType="phone-pad"
        autoComplete="tel"
      />
      <InputField
        label="Password"
        placeholder="••••••••••••••••"
        value={password}
        onChangeText={setPassword}
        error={errors.password}
        isPassword
        autoComplete="new-password"
      />

      <TouchableOpacity
        style={styles.termsRow}
        onPress={() => setAgreed(v => !v)}
        activeOpacity={0.8}
      >
        <View
          style={[
            styles.checkbox,
            {
              backgroundColor: agreed ? colors.navyDark : "transparent",
              borderColor: agreed ? colors.navyDark : colors.border,
            },
          ]}
        >
          {agreed && <Feather name="check" size={12} color="#FFFFFF" />}
        </View>
        <Text style={[styles.termsText, { color: colors.foreground }]}>
          Agree to our{" "}
          <Text style={{ color: colors.navyDark, fontFamily: "Inter_600SemiBold" }}>
            Terms & Conditions
          </Text>
        </Text>
      </TouchableOpacity>
      {errors.agreed ? (
        <Text style={[styles.errorText, { color: colors.destructive }]}>
          {errors.agreed}
        </Text>
      ) : null}

      <PrimaryButton
        title="Continue"
        onPress={handleRegister}
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
          <Feather name="smartphone" size={22} color={colors.foreground} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.waitlistBtn}
        onPress={() => router.push("/waitlist")}
      >
        <Text style={[styles.waitlistText, { color: colors.navyDark }]}>
          Join the SignBee waitlist instead
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
  loginBtn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  loginBtnText: { fontSize: 14, fontFamily: "Inter_500Medium" },
  title: { fontSize: 26, fontFamily: "Inter_700Bold", marginBottom: 28 },
  termsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  termsText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    flex: 1,
  },
  errorText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginBottom: 8,
  },
  cta: { marginTop: 20, marginBottom: 24 },
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
