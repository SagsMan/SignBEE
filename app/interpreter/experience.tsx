import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BackButton } from "@/components/interpreter/InterpreterShared";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function InterpreterExperienceScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { interpreterProfile, updateInterpreterProfile } = useApp();
  const [years, setYears] = useState(String(interpreterProfile.experienceYears));
  const [specialties, setSpecialties] = useState(interpreterProfile.specialties.join(", "));
  const [loading, setLoading] = useState(false);

  const save = async () => {
    const parsedYears = Number(years);
    if (!Number.isFinite(parsedYears) || parsedYears < 0) {
      Alert.alert("Check years", "Enter a valid number of years.");
      return;
    }
    setLoading(true);
    await updateInterpreterProfile({
      experienceYears: Math.floor(parsedYears),
      specialties: specialties.split(",").map(item => item.trim()).filter(Boolean),
    });
    setLoading(false);
    router.back();
  };

  return (
    <KeyboardAwareScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 28 }]}
      keyboardShouldPersistTaps="handled"
      bottomOffset={70}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <BackButton />
        <Text style={[styles.title, { color: colors.navyDark }]}>Experience</Text>
        <View style={styles.spacer} />
      </View>
      <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Help clients find the right interpreter for the setting they need.</Text>
      <Field label="Years of interpreting experience" value={years} onChangeText={setYears} placeholder="e.g. 5" keyboardType="number-pad" colors={colors} />
      <Field label="Areas of specialization" value={specialties} onChangeText={setSpecialties} placeholder="Medical, education, legal" multiline colors={colors} />
      <Text style={[styles.hint, { color: colors.mutedForeground }]}>Separate specializations with commas.</Text>
      <TouchableOpacity style={[styles.saveButton, { backgroundColor: colors.navyDark }]} onPress={save} disabled={loading}>
        <Feather name="save" size={17} color={colors.primary} />
        <Text style={[styles.saveText, { color: colors.primary }]}>{loading ? "Saving..." : "Save experience"}</Text>
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  );
}

function Field({ label, value, onChangeText, placeholder, keyboardType, multiline, colors }: { label: string; value: string; onChangeText: (value: string) => void; placeholder: string; keyboardType?: "number-pad"; multiline?: boolean; colors: ReturnType<typeof useColors> }) {
  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: colors.foreground }]}>{label}</Text>
      <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={colors.mutedForeground} keyboardType={keyboardType} multiline={multiline} textAlignVertical={multiline ? "top" : "center"} style={[styles.input, multiline && styles.textArea, { color: colors.foreground, borderColor: colors.border }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 15 },
  spacer: { width: 40 },
  title: { fontSize: 21, fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 13, lineHeight: 19, fontFamily: "Inter_400Regular", marginBottom: 25 },
  field: { marginBottom: 16 },
  label: { fontSize: 13, fontFamily: "Inter_600SemiBold", marginBottom: 8 },
  input: { minHeight: 50, borderWidth: 1, borderRadius: 13, paddingHorizontal: 14, fontSize: 14, fontFamily: "Inter_400Regular" },
  textArea: { minHeight: 120, paddingTop: 13 },
  hint: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: -6 },
  saveButton: { borderRadius: 13, paddingVertical: 15, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8, marginTop: 26 },
  saveText: { fontSize: 14, fontFamily: "Inter_700Bold" },
});