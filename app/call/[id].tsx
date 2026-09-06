import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function ActiveCallScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { incomingCall, clearIncomingCall } = useApp();
  const topPad = Platform.OS === "web" ? 20 : insets.top;

  const endCall = async () => {
    await clearIncomingCall();
    router.back();
  };

  if (!incomingCall || incomingCall.id !== id) {
    return (
      <View style={[styles.empty, { backgroundColor: colors.background, paddingTop: topPad }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>Call is no longer active.</Text>
      </View>
    );
  }

  const isVideo = incomingCall.type === "video";
  const avatarSource =
    incomingCall.callerAvatar === "male"
      ? require("@/assets/images/interpreter_male.png")
      : require("@/assets/images/interpreter_female.png");

  return (
    <View style={[styles.container, { backgroundColor: colors.navyDark, paddingTop: topPad + 14 }]}>
      <View style={styles.topBar}>
        <Text style={[styles.callLabel, { color: "#FFFFFF" }]}>{isVideo ? "Video call" : "Audio call"}</Text>
        <Text style={[styles.timer, { color: "#FFFFFF99" }]}>00:00</Text>
      </View>
      <View style={styles.content}>
        {isVideo ? <View style={[styles.videoPlaceholder, { backgroundColor: "#FFFFFF12" }]}><Feather name="video" size={30} color="#FFFFFF99" /></View> : null}
        <Image source={avatarSource} style={[styles.avatar, isVideo && styles.videoAvatar]} />
        <Text style={[styles.name, { color: "#FFFFFF" }]}>{incomingCall.callerName}</Text>
        <Text style={[styles.status, { color: colors.primary }]}>Connected locally</Text>
        <Text style={[styles.demoText, { color: "#FFFFFF99" }]}>
          Real {isVideo ? "video" : "audio"} calling requires an external calling service.
        </Text>
      </View>
      <View style={[styles.controls, { paddingBottom: Platform.OS === "web" ? 24 : insets.bottom + 20 }]}>
        <CallControl icon="mic-off" label="Mute" colors={colors} />
        {isVideo ? <CallControl icon="video-off" label="Camera" colors={colors} /> : <CallControl icon="volume-2" label="Speaker" colors={colors} />}
        <TouchableOpacity style={[styles.endButton, { backgroundColor: colors.destructive }]} onPress={() => void endCall()}>
          <Feather name="phone-off" size={23} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function CallControl({
  icon,
  label,
  colors,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={styles.control}>
      <View style={[styles.controlButton, { backgroundColor: "#FFFFFF18" }]}>
        <Feather name={icon} size={20} color="#FFFFFF" />
      </View>
      <Text style={[styles.controlLabel, { color: "#FFFFFF99" }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  empty: { flex: 1, paddingHorizontal: 20 },
  backButton: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  emptyText: { textAlign: "center", marginTop: 50, fontSize: 14 },
  topBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 4 },
  callLabel: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  timer: { fontSize: 12 },
  content: { flex: 1, alignItems: "center", justifyContent: "center" },
  avatar: { width: 118, height: 118, borderRadius: 59, borderWidth: 3, borderColor: "#FFFFFF33", marginBottom: 18 },
  videoAvatar: { width: 82, height: 82, borderRadius: 41, position: "absolute", top: 25, right: 5, zIndex: 2 },
  videoPlaceholder: { width: "100%", height: 320, borderRadius: 20, alignItems: "center", justifyContent: "center", marginBottom: 20 },
  name: { fontSize: 24, fontFamily: "Inter_700Bold" },
  status: { fontSize: 12, fontFamily: "Inter_500Medium", marginTop: 7 },
  demoText: { fontSize: 11, textAlign: "center", marginTop: 20, maxWidth: 260 },
  controls: { flexDirection: "row", justifyContent: "center", alignItems: "flex-start", gap: 30 },
  control: { alignItems: "center", gap: 7 },
  controlButton: { width: 50, height: 50, borderRadius: 25, alignItems: "center", justifyContent: "center" },
  controlLabel: { fontSize: 10 },
  endButton: { width: 58, height: 58, borderRadius: 29, alignItems: "center", justifyContent: "center" },
});