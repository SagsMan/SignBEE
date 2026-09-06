import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BackButton, InterpreterCard, InterpreterScreen } from "@/components/interpreter/InterpreterShared";
import { SignLanguage, useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const PROFICIENCIES: SignLanguage["proficiency"][] = ["Native", "Fluent", "Professional", "Conversational"];

export default function InterpreterLanguagesScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { interpreterProfile, updateInterpreterLanguages } = useApp();
  const [languages, setLanguages] = useState<SignLanguage[]>(interpreterProfile.languages);
  const [loading, setLoading] = useState(false);

  const update = (id: string, data: Partial<SignLanguage>) => {
    setLanguages(current => current.map(item => item.id === id ? { ...item, ...data } : item));
  };
  const addLanguage = () => {
    setLanguages(current => [
      ...current,
      { id: `language-${Date.now()}`, name: "", proficiency: "Professional", yearsExperience: 1, isPrimary: current.length === 0 },
    ]);
  };
  const removeLanguage = (id: string) => {
    setLanguages(current => {
      const next = current.filter(item => item.id !== id);
      return next.length && !next.some(item => item.isPrimary) ? next.map((item, index) => ({ ...item, isPrimary: index === 0 })) : next;
    });
  };
  const save = async () => {
    const cleaned = languages.filter(item => item.name.trim());
    if (!cleaned.length) {
      Alert.alert("Add a language", "Add at least one sign language before saving.");
      return;
    }
    setLoading(true);
    await updateInterpreterLanguages(cleaned);
    setLoading(false);
    router.back();
  };

  return (
    <InterpreterScreen title="Sign languages" subtitle="Show clients how you communicate and where you bring the most confidence." action={<BackButton />}>
      <KeyboardAwareScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 110 }}
        keyboardShouldPersistTaps="handled"
        bottomOffset={70}
        showsVerticalScrollIndicator={false}
      >
        {languages.map((language, index) => (
          <InterpreterCard key={language.id}>
            <View style={styles.rowHeader}>
              <Text style={[styles.cardTitle, { color: colors.navyDark }]}>Language {index + 1}</Text>
              <TouchableOpacity onPress={() => removeLanguage(language.id)} accessibilityLabel={`Remove language ${index + 1}`}>
                <Feather name="trash-2" size={17} color={colors.destructive} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.label, { color: colors.foreground }]}>Language name</Text>
            <TextInput
              value={language.name}
              onChangeText={name => update(language.id, { name })}
              placeholder="e.g. NSL, ASL, BSL"
              placeholderTextColor={colors.mutedForeground}
              style={[styles.input, { color: colors.foreground, borderColor: colors.border }]}
            />
            <Text style={[styles.label, { color: colors.foreground }]}>Proficiency</Text>
            <View style={styles.chips}>
              {PROFICIENCIES.map(proficiency => {
                const active = language.proficiency === proficiency;
                return (
                  <TouchableOpacity key={proficiency} onPress={() => update(language.id, { proficiency })} style={[styles.chip, { borderColor: active ? colors.navyDark : colors.border, backgroundColor: active ? colors.navyDark : colors.background }]}>
                    <Text style={[styles.chipText, { color: active ? colors.primary : colors.foreground }]}>{proficiency}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <Text style={[styles.label, { color: colors.foreground }]}>Years of experience</Text>
            <TextInput
              value={String(language.yearsExperience)}
              onChangeText={value => update(language.id, { yearsExperience: Math.max(0, Number(value.replace(/[^0-9]/g, "")) || 0) })}
              keyboardType="number-pad"
              style={[styles.input, { color: colors.foreground, borderColor: colors.border }]}
            />
            <TouchableOpacity onPress={() => setLanguages(current => current.map(item => ({ ...item, isPrimary: item.id === language.id })))} style={styles.primaryRow}>
              <View style={[styles.radio, { borderColor: language.isPrimary ? colors.navyDark : colors.border }]}>
                {language.isPrimary ? <View style={[styles.radioDot, { backgroundColor: colors.navyDark }]} /> : null}
              </View>
              <Text style={[styles.primaryText, { color: colors.foreground }]}>Primary language</Text>
            </TouchableOpacity>
          </InterpreterCard>
        ))}
        <TouchableOpacity style={[styles.addButton, { borderColor: colors.border }]} onPress={addLanguage}>
          <Feather name="plus" size={17} color={colors.navyDark} />
          <Text style={[styles.addText, { color: colors.navyDark }]}>Add another language</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.saveButton, { backgroundColor: colors.navyDark }]} onPress={save} disabled={loading}>
          <Text style={[styles.saveText, { color: colors.primary }]}>{loading ? "Saving..." : "Save languages"}</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </InterpreterScreen>
  );
}

const styles = StyleSheet.create({
  rowHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 17 },
  cardTitle: { fontSize: 15, fontFamily: "Inter_700Bold" },
  label: { fontSize: 12, fontFamily: "Inter_600SemiBold", marginBottom: 7, marginTop: 3 },
  input: { borderWidth: 1, borderRadius: 12, minHeight: 47, paddingHorizontal: 13, fontSize: 13, fontFamily: "Inter_400Regular", marginBottom: 15 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 7, marginBottom: 15 },
  chip: { borderWidth: 1, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 8 },
  chipText: { fontSize: 11, fontFamily: "Inter_500Medium" },
  primaryRow: { flexDirection: "row", alignItems: "center", gap: 9, marginTop: 1 },
  radio: { width: 19, height: 19, borderRadius: 10, borderWidth: 1.5, alignItems: "center", justifyContent: "center" },
  radioDot: { width: 9, height: 9, borderRadius: 5 },
  primaryText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  addButton: { marginHorizontal: 20, borderWidth: 1, borderRadius: 13, borderStyle: "dashed", paddingVertical: 13, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 7 },
  addText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  saveButton: { marginHorizontal: 20, borderRadius: 13, paddingVertical: 15, alignItems: "center", marginTop: 12 },
  saveText: { fontSize: 14, fontFamily: "Inter_700Bold" },
});