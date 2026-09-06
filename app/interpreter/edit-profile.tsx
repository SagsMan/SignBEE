import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function EditInterpreterProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { interpreterProfile, updateInterpreterProfile } = useApp();
  const [name, setName] = useState(interpreterProfile.name);
  const [bio, setBio] = useState(interpreterProfile.bio);
  const [loading, setLoading] = useState(false);

  const save = async () => {
    if (!name.trim() || !bio.trim()) {
      Alert.alert("Missing details", "Add your name and a short professional bio.");
      return;
    }
    setLoading(true);
    await updateInterpreterProfile({ name: name.trim(), bio: bio.trim() });
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
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <Feather name="arrow-left" size={21} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.navyDark }]}>Edit profile</Text>
        <View style={styles.iconButton} />
      </View>
      <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>This information is shown to clients when they review your profile.</Text>
      <Field label="Professional name" value={name} onChangeText={setName} placeholder="Your display name" colors={colors} />
      <Field label="Professional bio" value={bio} onChangeText={setBio} placeholder="Tell clients about your interpreting experience" multiline colors={colors} />
      <TouchableOpacity style={[styles.saveButton, { backgroundColor: colors.navyDark }]} onPress={save} disabled={loading}>
        <Text style={[styles.saveText, { color: colors.primary }]}>{loading ? "Saving..." : "Save profile"}</Text>
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  );
}

function Field({ label, value, onChangeText, placeholder, multiline, colors }: { label: string; value: string; onChangeText: (value: string) => void; placeholder: string; multiline?: boolean; colors: ReturnType<typeof useColors> }) {
  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: colors.foreground }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground}
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
        style={[styles.input, multiline && styles.textArea, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.card }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 15 },
  iconButton: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 21, fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 13, lineHeight: 19, fontFamily: "Inter_400Regular", marginBottom: 25 },
  field: { marginBottom: 19 },
  label: { fontSize: 13, fontFamily: "Inter_600SemiBold", marginBottom: 8 },
  input: { minHeight: 50, borderWidth: 1, borderRadius: 13, paddingHorizontal: 14, fontSize: 14, fontFamily: "Inter_400Regular" },
  textArea: { minHeight: 135, paddingTop: 13 },
  saveButton: { borderRadius: 13, paddingVertical: 15, alignItems: "center", marginTop: 8 },
  saveText: { fontSize: 14, fontFamily: "Inter_700Bold" },
});