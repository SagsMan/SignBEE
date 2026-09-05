import { Feather } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import PrimaryButton from "@/components/PrimaryButton";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function LocationPermissionScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { setLocationPermission } = useApp();
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");

  const topPad = Platform.OS === "web" ? 67 : insets.top + 12;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom + 16;

  const continueToApp = () => router.replace("/(tabs)");

  const requestLocation = async () => {
    setLoading(true);
    setNotice("");
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === Location.PermissionStatus.GRANTED) {
        await setLocationPermission("granted");
        continueToApp();
      } else {
        await setLocationPermission("denied");
        setNotice(
          "Location was not granted. You can continue and choose an interpreter manually.",
        );
      }
    } catch {
      await setLocationPermission("denied");
      setNotice("Location permission is unavailable on this device. You can continue without it.");
    } finally {
      setLoading(false);
    }
  };

  const skipLocation = async () => {
    await setLocationPermission("skipped");
    continueToApp();
  };

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
          <Feather name="map-pin" size={32} color={colors.navyDark} />
        </View>
        <Text style={[styles.title, { color: colors.navyDark }]}>
          Find interpreters near you
        </Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Allow location access to help SignBee show nearby interpreters. You
          can continue without sharing your location.
        </Text>
        {notice ? (
          <Text style={[styles.notice, { color: colors.destructive }]}>{notice}</Text>
        ) : null}
      </View>
      <View style={styles.footer}>
        <PrimaryButton
          title="Allow location"
          onPress={requestLocation}
          loading={loading}
        />
        <PrimaryButton
          title="Continue without location"
          onPress={skipLocation}
          variant="ghost"
          disabled={loading}
        />
      </View>
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
  title: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    maxWidth: 330,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 22,
    textAlign: "center",
  },
  notice: {
    maxWidth: 330,
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    lineHeight: 18,
    textAlign: "center",
    marginTop: 20,
  },
  footer: { width: "100%" },
});