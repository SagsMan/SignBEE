import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function AgentConfirmedScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ type?: string }>();
  const { interpreters, startConversation } = useApp();
  const matchedInterpreter =
    interpreters.find(interpreter => interpreter.id === "1") ||
    interpreters.find(interpreter => interpreter.isAvailable) ||
    interpreters[0];
  const isVirtual = params.type === "Virtual";

  if (!matchedInterpreter) return null;

  const messageInterpreter = async () => {
    const conversationId = await startConversation({
      participantId: matchedInterpreter.id,
      participantName: matchedInterpreter.name,
      participantAvatar:
        matchedInterpreter.avatar === "male" ? "male" : "female",
      participantRole: "Interpreter",
    });
    router.push({
      pathname: "/conversation/[id]",
      params: { id: conversationId },
    });
  };

  return (
    <View
      style={[
        styles.screen,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top + 42,
          paddingBottom: insets.bottom + 24,
        },
      ]}
    >
      <View style={styles.content}>
        <View style={[styles.successIcon, { backgroundColor: colors.greenLight }]}>
          <Feather name="check" size={24} color={colors.navyDark} />
        </View>
        <Text style={[styles.title, { color: colors.navyDark }]}>
          {isVirtual
            ? `${matchedInterpreter.name.split(" ")[0]} is ready`
            : `${matchedInterpreter.name.split(" ")[0]} is on the way`}
        </Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          {isVirtual ? "Joining your virtual session shortly" : "Arriving in 7 minutes"}
        </Text>

        <View style={[styles.infoCard, { backgroundColor: colors.muted }]}>
          <View style={[styles.infoIcon, { backgroundColor: colors.background }]}>
            <Feather
              name={isVirtual ? "video" : "map-pin"}
              size={16}
              color={colors.navyDark}
            />
          </View>
          <View style={styles.infoCopy}>
            <Text style={[styles.infoTitle, { color: colors.navyDark }]}>
              {isVirtual
                ? "Your virtual session is ready"
                : "Meets you at your selected location"}
            </Text>
            <Text style={[styles.infoText, { color: colors.mutedForeground }]}>
              {isVirtual
                ? "Your SignBee Agent will keep the session details here."
                : "Expected arrival time is shown here."}
            </Text>
          </View>
        </View>

        <View style={[styles.agentCard, { backgroundColor: colors.navyDark }]}>
          <View style={[styles.agentIcon, { backgroundColor: colors.primary }]}>
            <Feather name="headphones" size={18} color={colors.navyDark} />
          </View>
          <View style={styles.agentCopy}>
            <Text style={[styles.agentTitle, { color: "#FFFFFF" }]}>
              SignBee Agent is monitoring.
            </Text>
            <Text style={[styles.agentText, { color: "#FFFFFF" }]}>
              If {matchedInterpreter.name.split(" ")[0]} is delayed, we&apos;ll
              swap you automatically.
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.messageButton, { backgroundColor: colors.primary }]}
          onPress={messageInterpreter}
        >
          <Text style={[styles.messageText, { color: colors.navyDark }]}>
            Message {matchedInterpreter.name.split(" ")[0]}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => router.replace("/(tabs)")}
        >
          <Text style={[styles.homeText, { color: colors.mutedForeground }]}>
            Back to Home
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 20 },
  content: { flex: 1, alignItems: "center" },
  successIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 17,
  },
  title: { fontSize: 18, fontFamily: "Inter_700Bold", textAlign: "center" },
  subtitle: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 6,
    marginBottom: 26,
  },
  infoCard: {
    width: "100%",
    flexDirection: "row",
    borderRadius: 10,
    padding: 12,
    gap: 10,
    marginBottom: 10,
  },
  infoIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  infoCopy: { flex: 1 },
  infoTitle: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  infoText: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
    marginTop: 4,
    lineHeight: 14,
  },
  agentCard: {
    width: "100%",
    flexDirection: "row",
    borderRadius: 10,
    padding: 12,
    gap: 10,
  },
  agentIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  agentCopy: { flex: 1 },
  agentTitle: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  agentText: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
    marginTop: 4,
    lineHeight: 14,
  },
  actions: { width: "100%" },
  messageButton: {
    height: 46,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  messageText: { fontSize: 12, fontFamily: "Inter_700Bold" },
  homeButton: { alignItems: "center", paddingVertical: 16 },
  homeText: { fontSize: 12, fontFamily: "Inter_500Medium" },
});