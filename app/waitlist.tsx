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

export default function WaitlistScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { joinWaitlist } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top + 12;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom + 16;

  const handleSubmit = async () => {
    const nextErrors: Record<string, string> = {};
    if (!name.trim()) nextErrors.name = "Enter your name.";
    if (!email.includes("@")) nextErrors.email = "Enter a valid email address.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    await joinWaitlist(name, email);
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
            paddingTop: topPad,
            paddingBottom: bottomPad,
          },
        ]}
      >
        <View style={styles.successContent}>
          <View style={[styles.iconCircle, { backgroundColor: colors.greenLight }]}>
            <Feather name="check" size={34} color={colors.navyDark} />
          </View>
          <Text style={[styles.title, { color: colors.navyDark }]}>
            You’re on the list
          </Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            We saved your interest locally. A live waitlist notification service
            can be connected when the backend is ready.
          </Text>
        </View>
        <PrimaryButton title="Back to login" onPress={() => router.replace("/login")} />
      </View>
    );
  }

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
        Join the SignBee waitlist
      </Text>
      <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
        Leave your details and we’ll keep your place while the full service is
        being prepared.
      </Text>
      <InputField
        label="Full name"
        placeholder="e.g Mariam Ahmad"
        value={name}
        onChangeText={value => {
          setName(value);
          setErrors({});
        }}
        error={errors.name}
        autoCapitalize="words"
      />
      <InputField
        label="Email address"
        placeholder="e.g example@gmail.com"
        value={email}
        onChangeText={value => {
          setEmail(value);
          setErrors({});
        }}
        error={errors.email}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />
      <PrimaryButton
        title="Join waitlist"
        onPress={handleSubmit}
        loading={loading}
        style={styles.cta}
      />
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24 },
  content: { flexGrow: 1 },
  backBtn: { width: 40, height: 40, justifyContent: "center", marginBottom: 42 },
  title: { fontSize: 26, fontFamily: "Inter_700Bold", marginBottom: 12 },
  subtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 22,
    marginBottom: 30,
  },
  cta: { marginTop: 8 },
  successContent: { flex: 1, alignItems: "center", justifyContent: "center" },
  iconCircle: {
    width: 82,
    height: 82,
    borderRadius: 41,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
});