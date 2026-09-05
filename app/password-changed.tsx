import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import PrimaryButton from "@/components/PrimaryButton";
import { useColors } from "@/hooks/useColors";

export default function PasswordChangedScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
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
      <View style={styles.content}>
        <View style={[styles.iconCircle, { backgroundColor: colors.greenLight }]}>
          <Feather name="check" size={34} color={colors.navyDark} />
        </View>
        <Text style={[styles.title, { color: colors.navyDark }]}>
          Password changed
        </Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          The local password reset flow is complete. Connect an authentication
          service before using this state for a live account.
        </Text>
      </View>
      <PrimaryButton title="Back to login" onPress={() => router.replace("/login")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24 },
  content: { flex: 1, alignItems: "center", justifyContent: "center" },
  iconCircle: {
    width: 82,
    height: 82,
    borderRadius: 41,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  title: { fontSize: 26, fontFamily: "Inter_700Bold", marginBottom: 12 },
  subtitle: {
    maxWidth: 330,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 22,
    textAlign: "center",
  },
});