import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { InterpreterPreferences, useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { BackButton, InterpreterScreen } from "@/components/interpreter/InterpreterShared";

export default function InterpreterPreferencesScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { interpreterProfile, updateInterpreterPreferences } = useApp();
  const [preferences, setPreferences] = useState<InterpreterPreferences>(interpreterProfile.preferences);
  const [locations, setLocations] = useState(interpreterProfile.preferences.preferredLocations.join(", "));
  const [loading, setLoading] = useState(false);

  const toggleJobType = (type: "Virtual" | "In-person") => {
    setPreferences(current => ({
      ...current,
      jobTypes: current.jobTypes.includes(type) ? current.jobTypes.filter(item => item !== type) : [...current.jobTypes, type],
    }));
  };
  const update = (data: Partial<InterpreterPreferences>) => setPreferences(current => ({ ...current, ...data }));
  const save = async () => {
    if (!preferences.jobTypes.length) {
      Alert.alert("Choose a job type", "Select at least one way you want to work.");
      return;
    }
    setLoading(true);
    await updateInterpreterPreferences({ ...preferences, preferredLocations: locations.split(",").map(item => item.trim()).filter(Boolean) });
    setLoading(false);
    router.back();
  };

  return (
    <InterpreterScreen title="Preferences" subtitle="Set the kind of work and updates you want to receive." action={<BackButton />}>
      <KeyboardAwareScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 110 }} keyboardShouldPersistTaps="handled" bottomOffset={70}>
        <View style={[styles.section, { borderColor: colors.border, backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.navyDark }]}>Preferred job types</Text>
          <Text style={[styles.sectionText, { color: colors.mutedForeground }]}>Clients will see the formats you accept.</Text>
          <View style={styles.typeRow}>
            {(["Virtual", "In-person"] as const).map(type => {
              const active = preferences.jobTypes.includes(type);
              return (
                <TouchableOpacity key={type} onPress={() => toggleJobType(type)} style={[styles.typeChip, { borderColor: active ? colors.navyDark : colors.border, backgroundColor: active ? colors.navyDark : colors.background }]}>
                  <Feather name={type === "Virtual" ? "video" : "map-pin"} size={16} color={active ? colors.primary : colors.foreground} />
                  <Text style={[styles.typeText, { color: active ? colors.primary : colors.foreground }]}>{type}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <Text style={[styles.label, { color: colors.foreground }]}>Preferred locations</Text>
          <TextInput value={locations} onChangeText={setLocations} placeholder="Lagos, Abuja, Remote" placeholderTextColor={colors.mutedForeground} style={[styles.input, { color: colors.foreground, borderColor: colors.border }]} />
          <Text style={[styles.hint, { color: colors.mutedForeground }]}>Separate locations with commas. Leave blank if you accept work anywhere.</Text>
        </View>
        <View style={[styles.section, { borderColor: colors.border, backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.navyDark }]}>Work preferences</Text>
          <PreferenceRow label="Accept urgent requests" description="Allow clients to find you for short-notice jobs." value={preferences.acceptsUrgentJobs} onValueChange={value => update({ acceptsUrgentJobs: value })} colors={colors} />
          <PreferenceRow label="Email notifications" description="Receive updates about job requests and status changes." value={preferences.emailNotifications} onValueChange={value => update({ emailNotifications: value })} colors={colors} />
          <PreferenceRow label="Push notifications" description="Show timely alerts on this device." value={preferences.pushNotifications} onValueChange={value => update({ pushNotifications: value })} colors={colors} />
        </View>
        <TouchableOpacity style={[styles.saveButton, { backgroundColor: colors.navyDark }]} onPress={save} disabled={loading}>
          <Text style={[styles.saveText, { color: colors.primary }]}>{loading ? "Saving..." : "Save preferences"}</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </InterpreterScreen>
  );
}

function PreferenceRow({ label, description, value, onValueChange, colors }: { label: string; description: string; value: boolean; onValueChange: (value: boolean) => void; colors: ReturnType<typeof useColors> }) {
  return (
    <View style={styles.preferenceRow}>
      <View style={styles.preferenceCopy}>
        <Text style={[styles.preferenceLabel, { color: colors.foreground }]}>{label}</Text>
        <Text style={[styles.preferenceDescription, { color: colors.mutedForeground }]}>{description}</Text>
      </View>
      <Switch value={value} onValueChange={onValueChange} trackColor={{ false: colors.border, true: colors.primary }} thumbColor={value ? colors.navyDark : colors.mutedForeground} />
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginHorizontal: 20, borderWidth: 1, borderRadius: 18, padding: 16, marginBottom: 13 },
  sectionTitle: { fontSize: 15, fontFamily: "Inter_700Bold", marginBottom: 5 },
  sectionText: { fontSize: 12, lineHeight: 18, fontFamily: "Inter_400Regular", marginBottom: 15 },
  typeRow: { flexDirection: "row", gap: 8, marginBottom: 18 },
  typeChip: { flex: 1, minHeight: 48, borderWidth: 1, borderRadius: 12, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7 },
  typeText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  label: { fontSize: 12, fontFamily: "Inter_600SemiBold", marginBottom: 7 },
  input: { minHeight: 47, borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, fontSize: 13, fontFamily: "Inter_400Regular" },
  hint: { fontSize: 10, lineHeight: 15, fontFamily: "Inter_400Regular", marginTop: 6 },
  preferenceRow: { flexDirection: "row", alignItems: "center", paddingVertical: 12, borderTopWidth: 1, borderTopColor: "#00000010" },
  preferenceCopy: { flex: 1, paddingRight: 10 },
  preferenceLabel: { fontSize: 13, fontFamily: "Inter_600SemiBold", marginBottom: 3 },
  preferenceDescription: { fontSize: 11, lineHeight: 16, fontFamily: "Inter_400Regular" },
  saveButton: { marginHorizontal: 20, borderRadius: 13, paddingVertical: 15, alignItems: "center", marginTop: 3 },
  saveText: { fontSize: 14, fontFamily: "Inter_700Bold" },
});