import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

export default function AgentMatchingScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{
    type?: string;
    situation?: string;
    location?: string;
    platform?: string;
  }>();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace({
        pathname: "/agent/confirmed",
        params: {
          type: params.type || "In-person",
          situation: params.situation || "",
          location: params.location || "",
          platform: params.platform || "",
        },
      });
    }, 1900);
    return () => clearTimeout(timer);
  }, [params.location, params.platform, params.situation, params.type, router]);

  return (
    <View
      style={[
        styles.screen,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 20,
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.navyDark }]}>
          SignBee Agent
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.closeButton}
          accessibilityLabel="Cancel matching"
        >
          <Feather name="x" size={18} color={colors.mutedForeground} />
        </TouchableOpacity>
      </View>

      <View style={styles.center}>
        <Text style={[styles.heading, { color: colors.navyDark }]}>
          Triaging your request · 6s
        </Text>
        <View
          style={[
            styles.statusCard,
            { backgroundColor: colors.greenLight },
          ]}
        >
          {[
            "Read your request",
            "Filtered for interpreters who are free now",
            "Ranking by distance & fit",
          ].map(item => (
            <View key={item} style={styles.statusRow}>
              <View style={[styles.check, { backgroundColor: colors.primary }]}>
                <Feather name="check" size={11} color={colors.navyDark} />
              </View>
              <Text style={[styles.statusText, { color: colors.navyDark }]}>
                {item}
              </Text>
            </View>
          ))}
        </View>
        <Text style={[styles.helper, { color: colors.mutedForeground }]}>
          Usually matched in under 30 seconds
        </Text>
        <View style={[styles.progressTrack, { backgroundColor: colors.muted }]}>
          <View
            style={[styles.progress, { backgroundColor: colors.primary }]}
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.cancelButton, { backgroundColor: colors.muted }]}
        onPress={() => router.back()}
      >
        <Text style={[styles.cancelText, { color: colors.mutedForeground }]}>
          Cancel
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 20 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
  closeButton: { padding: 6 },
  center: { flex: 1, justifyContent: "center" },
  heading: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 14,
  },
  statusCard: { borderRadius: 12, padding: 14, gap: 13 },
  statusRow: { flexDirection: "row", alignItems: "center", gap: 9 },
  check: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  statusText: { flex: 1, fontSize: 11, fontFamily: "Inter_500Medium" },
  helper: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    marginTop: 20,
    marginBottom: 12,
  },
  progressTrack: { height: 5, borderRadius: 3, overflow: "hidden" },
  progress: { width: "68%", height: "100%", borderRadius: 3 },
  cancelButton: {
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelText: { fontSize: 12, fontFamily: "Inter_500Medium" },
});