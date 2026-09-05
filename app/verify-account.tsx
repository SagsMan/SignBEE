import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import PrimaryButton from "@/components/PrimaryButton";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function VerifyAccountScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string }>();
  const { user, pendingVerificationEmail } = useApp();

  const email = useMemo(
    () => params.email || pendingVerificationEmail || user?.email || "",
    [params.email, pendingVerificationEmail, user?.email],
  );
  const topPad = Platform.OS === "web" ? 67 : insets.top + 12;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom + 16;

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
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Feather name="arrow-left" size={22} color={colors.foreground} />
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={[styles.iconCircle, { backgroundColor: colors.greenLight }]}>
          <Feather name="shield" size={30} color={colors.navyDark} />
        </View>
        <Text style={[styles.title, { color: colors.navyDark }]}>
          Verify your account
        </Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          We need to verify your email before you can use SignBee. We’ll guide
          you through the verification step for:
        </Text>
        <Text style={[styles.email, { color: colors.foreground }]}>
          {email || "your email address"}
        </Text>

        <View
          style={[
            styles.infoCard,
            { backgroundColor: colors.muted, borderColor: colors.border },
          ]}
        >
          <Feather name="info" size={18} color={colors.navyDark} />
          <Text style={[styles.infoText, { color: colors.foreground }]}>
            Email delivery is not connected yet. In this local preview, the
            verification code is 123456.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <PrimaryButton
          title="Continue to verification"
          onPress={() =>
            router.push({
              pathname: "/email-verification",
              params: { email },
            })
          }
        />
        <TouchableOpacity
          style={styles.waitlistBtn}
          onPress={() => {
            router.push("/waitlist");
          }}
        >
          <Text style={[styles.waitlistText, { color: colors.navyDark }]}>
            Join the waitlist instead
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24 },
  backBtn: { width: 40, height: 40, justifyContent: "center" },
  content: { flex: 1, justifyContent: "center", alignItems: "center" },
  iconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
    marginBottom: 14,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 330,
  },
  email: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    marginTop: 10,
    textAlign: "center",
  },
  infoCard: {
    flexDirection: "row",
    gap: 10,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 28,
    maxWidth: 340,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
  },
  footer: { width: "100%" },
  waitlistBtn: { alignItems: "center", padding: 14 },
  waitlistText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
});