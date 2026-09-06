import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function IncomingCallScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { incomingCall, acceptIncomingCall, declineIncomingCall, clearIncomingCall } = useApp();
  const topPad = Platform.OS === "web" ? 20 : insets.top;

  useEffect(() => {
    if (!incomingCall) router.back();
  }, [incomingCall]);

  if (!incomingCall) return <View style={[styles.container, { backgroundColor: colors.navyDark }]} />;

  const isVideo = incomingCall.type === "video";
  const avatarSource =
    incomingCall.callerAvatar === "male"
      ? require("@/assets/images/interpreter_male.png")
      : require("@/assets/images/interpreter_female.png");

  const accept = async () => {
    const id = await acceptIncomingCall();
    if (id) router.replace({ pathname: "/call/[id]", params: { id } });
  };

  const decline = async () => {
    await declineIncomingCall();
    await clearIncomingCall();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.navyDark, paddingTop: topPad + 26 }]}>
      <View style={styles.callType}>
        <Feather name={isVideo ? "video" : "phone"} size={18} color={colors.primary} />
        <Text style={[styles.callTypeText, { color: "#FFFFFF" }]}>
          Incoming {isVideo ? "video" : "audio"} call
        </Text>
      </View>
      <View style={styles.content}>
        <Image source={avatarSource} style={styles.avatar} />
        <Text style={[styles.callerName, { color: "#FFFFFF" }]}>{incomingCall.callerName}</Text>
        <Text style={[styles.callerRole, { color: "#FFFFFF99" }]}>SignBee interpreter</Text>
        <View style={[styles.demoBadge, { backgroundColor: "#FFFFFF14" }]}>
          <Feather name="info" size={14} color="#FFFFFF99" />
          <Text style={[styles.demoText, { color: "#FFFFFF99" }]}>
            Local demo call state — no audio or video is connected.
          </Text>
        </View>
      </View>
      <View style={[styles.actions, { paddingBottom: Platform.OS === "web" ? 24 : insets.bottom + 22 }]}>
        <View style={styles.actionItem}>
          <TouchableOpacity style={[styles.callButton, { backgroundColor: colors.destructive }]} onPress={() => void decline()}>
            <Feather name="phone-off" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={[styles.actionLabel, { color: "#FFFFFF99" }]}>Decline</Text>
        </View>
        <View style={styles.actionItem}>
          <TouchableOpacity style={[styles.callButton, { backgroundColor: colors.success }]} onPress={() => void accept()}>
            <Feather name={isVideo ? "video" : "phone"} size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={[styles.actionLabel, { color: "#FFFFFF99" }]}>Accept</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  callType: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  callTypeText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  content: { flex: 1, alignItems: "center", justifyContent: "center" },
  avatar: { width: 112, height: 112, borderRadius: 56, marginBottom: 20, borderWidth: 3, borderColor: "#FFFFFF33" },
  callerName: { fontSize: 27, fontFamily: "Inter_700Bold" },
  callerRole: { fontSize: 13, marginTop: 7 },
  demoBadge: { flexDirection: "row", alignItems: "flex-start", gap: 7, borderRadius: 12, padding: 11, marginTop: 25, maxWidth: 280 },
  demoText: { flex: 1, fontSize: 10, lineHeight: 15, textAlign: "center" },
  actions: { flexDirection: "row", justifyContent: "center", gap: 52 },
  actionItem: { alignItems: "center", gap: 8 },
  callButton: { width: 62, height: 62, borderRadius: 31, alignItems: "center", justifyContent: "center" },
  actionLabel: { fontSize: 11 },
});