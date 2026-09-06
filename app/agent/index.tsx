import { Feather } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

type AgentMode = "In-person" | "Virtual";

export default function AgentRequestScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ type?: string }>();
  const initialMode = params.type === "Virtual" ? "Virtual" : "In-person";
  const [mode, setMode] = useState<AgentMode>(initialMode);
  const [situation, setSituation] = useState("");
  const [location, setLocation] = useState("");
  const [platform, setPlatform] = useState("");
  const [locating, setLocating] = useState(false);

  const destinationLabel = useMemo(
    () => (mode === "In-person" ? "Where are you?" : "Preferred platform"),
    [mode],
  );
  const destinationPlaceholder =
    mode === "In-person"
      ? "e.g. 40 GRA Road, Beside Kwara Hotel"
      : "e.g. Zoom, Google Meet, or WhatsApp Video";
  const canSubmit =
    situation.trim().length > 0 &&
    (mode === "Virtual" || location.trim().length > 0);

  const close = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)");
  };

  const useCurrentLocation = async () => {
    setLocating(true);
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status === "granted") {
        await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setLocation("Current location selected");
      } else {
        setLocation("Current location selected");
      }
    } catch {
      setLocation("Current location selected");
    } finally {
      setLocating(false);
    }
  };

  const submit = () => {
    if (!canSubmit) return;
    router.push({
      pathname: "/agent/matching",
      params: {
        type: mode,
        situation: situation.trim(),
        location: location.trim(),
        platform: platform.trim(),
      },
    });
  };

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + 16,
            paddingBottom: insets.bottom + 28,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.navyDark }]}>
            SignBee Agent
          </Text>
          <TouchableOpacity
            onPress={close}
            style={styles.closeButton}
            accessibilityLabel="Close SignBee Agent"
          >
            <Feather name="x" size={18} color={colors.mutedForeground} />
          </TouchableOpacity>
        </View>

        <View style={[styles.modeSwitch, { backgroundColor: colors.muted }]}>
          {(["In-person", "Virtual"] as const).map(option => (
            <TouchableOpacity
              key={option}
              style={[
                styles.modeButton,
                mode === option && {
                  backgroundColor: colors.background,
                  borderBottomColor: colors.primary,
                },
              ]}
              onPress={() => setMode(option)}
              accessibilityRole="button"
              accessibilityState={{ selected: mode === option }}
            >
              <Text
                style={[
                  styles.modeText,
                  {
                    color:
                      mode === option
                        ? colors.navyDark
                        : colors.mutedForeground,
                  },
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.label, { color: colors.navyDark }]}>
          What&apos;s the situation?
        </Text>
        <TextInput
          style={[
            styles.textArea,
            {
              color: colors.foreground,
              borderColor: colors.border,
              backgroundColor: colors.background,
            },
          ]}
          placeholder="e.g. I need an interpreter urgently. My patient just came in for an emergency consultation and can't communicate..."
          placeholderTextColor={colors.mutedForeground}
          value={situation}
          onChangeText={setSituation}
          multiline
          textAlignVertical="top"
          accessibilityLabel="Describe your situation"
        />

        <Text style={[styles.label, { color: colors.navyDark }]}>
          {destinationLabel}
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              color: colors.foreground,
              borderColor: colors.border,
              backgroundColor: colors.background,
            },
          ]}
          placeholder={destinationPlaceholder}
          placeholderTextColor={colors.mutedForeground}
          value={mode === "In-person" ? location : platform}
          onChangeText={mode === "In-person" ? setLocation : setPlatform}
          accessibilityLabel={destinationLabel}
        />

        {mode === "In-person" && (
          <TouchableOpacity
            style={styles.locationButton}
            onPress={useCurrentLocation}
            disabled={locating}
            accessibilityRole="button"
          >
            {locating ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Feather name="map-pin" size={14} color={colors.primary} />
            )}
            <Text style={[styles.locationText, { color: colors.navyDark }]}>
              {locating ? "Finding your location..." : "Use my current location"}
            </Text>
          </TouchableOpacity>
        )}

        <View style={styles.actions}>
          <TouchableOpacity onPress={close} style={styles.cancelButton}>
            <Text style={[styles.cancelText, { color: colors.navyDark }]}>
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.submitButton,
              {
                backgroundColor: colors.primary,
                opacity: canSubmit ? 1 : 0.45,
              },
            ]}
            onPress={submit}
            disabled={!canSubmit}
          >
            <Text style={[styles.submitText, { color: colors.navyDark }]}>
              Submit
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 20 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  title: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
  closeButton: { padding: 6 },
  modeSwitch: {
    flexDirection: "row",
    borderRadius: 10,
    padding: 3,
    marginBottom: 24,
  },
  modeButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 8,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  modeText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  label: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 8,
  },
  textArea: {
    minHeight: 112,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginBottom: 22,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginBottom: 8,
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    alignSelf: "flex-start",
    paddingVertical: 4,
    marginBottom: 22,
  },
  locationText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 14,
  },
  cancelButton: { paddingVertical: 12, paddingRight: 20 },
  cancelText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  submitButton: {
    minWidth: 76,
    height: 42,
    paddingHorizontal: 18,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  submitText: { fontSize: 12, fontFamily: "Inter_700Bold" },
});