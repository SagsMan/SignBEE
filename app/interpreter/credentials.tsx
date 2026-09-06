import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BackButton, InterpreterCard, InterpreterScreen, StatusPill } from "@/components/interpreter/InterpreterShared";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function InterpreterCredentialsScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { interpreterProfile, addInterpreterCredential, removeInterpreterCredential } = useApp();
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [issuer, setIssuer] = useState("");
  const [reference, setReference] = useState("");
  const [saving, setSaving] = useState(false);

  const add = async () => {
    if (!title.trim() || !issuer.trim()) {
      Alert.alert("Missing details", "Add the credential name and issuing organization.");
      return;
    }
    setSaving(true);
    await addInterpreterCredential({ title: title.trim(), issuer: issuer.trim(), reference: reference.trim() || undefined });
    setTitle("");
    setIssuer("");
    setReference("");
    setAdding(false);
    setSaving(false);
  };

  return (
    <InterpreterScreen title="Credentials" subtitle="Add qualifications and certifications. New entries stay pending until a real verification service is connected." action={<BackButton />}>
      {interpreterProfile.credentials.length === 0 && !adding ? (
        <View style={styles.emptyWrap}>
          <Feather name="file-text" size={34} color={colors.mutedForeground} />
          <Text style={[styles.emptyTitle, { color: colors.navyDark }]}>No credentials added</Text>
          <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>Add your first qualification to help clients understand your professional background.</Text>
        </View>
      ) : null}
      {interpreterProfile.credentials.map(credential => (
        <InterpreterCard key={credential.id}>
          <View style={styles.credentialHeader}>
            <View style={[styles.credentialIcon, { backgroundColor: colors.greenLight }]}>
              <Feather name="award" size={18} color={colors.navyDark} />
            </View>
            <View style={styles.copy}>
              <Text style={[styles.credentialTitle, { color: colors.foreground }]}>{credential.title}</Text>
              <Text style={[styles.issuer, { color: colors.mutedForeground }]}>{credential.issuer}</Text>
            </View>
            <TouchableOpacity onPress={() => removeInterpreterCredential(credential.id)} accessibilityLabel={`Remove ${credential.title}`}>
              <Feather name="trash-2" size={17} color={colors.destructive} />
            </TouchableOpacity>
          </View>
          <View style={styles.credentialFooter}>
            <StatusPill label={credential.status === "verified" ? "Verified" : credential.status === "rejected" ? "Needs update" : "Pending review"} tone={credential.status === "verified" ? "success" : credential.status === "rejected" ? "danger" : "warning"} />
            {credential.reference ? (
              <Text style={[styles.reference, { color: colors.mutedForeground }]} numberOfLines={1}>Attachment: {credential.reference}</Text>
            ) : null}
          </View>
        </InterpreterCard>
      ))}
      {adding ? (
        <KeyboardAwareScrollView
          contentContainerStyle={{ paddingBottom: insets.bottom + 110 }}
          keyboardShouldPersistTaps="handled"
          bottomOffset={60}
        >
          <InterpreterCard>
            <Text style={[styles.formTitle, { color: colors.navyDark }]}>Add credential</Text>
            <Field label="Qualification or certification" value={title} onChangeText={setTitle} placeholder="e.g. NISL Certified" colors={colors} />
            <Field label="Issuing organization" value={issuer} onChangeText={setIssuer} placeholder="e.g. Nigerian Institute of Sign Language" colors={colors} />
            <Field label="Attachment reference (optional)" value={reference} onChangeText={setReference} placeholder="Add a file name or reference number" colors={colors} />
            <Text style={[styles.formHint, { color: colors.mutedForeground }]}>This demo stores the credential locally and marks it pending. It does not claim official verification.</Text>
            <View style={styles.formActions}>
              <TouchableOpacity style={[styles.cancelButton, { borderColor: colors.border }]} onPress={() => setAdding(false)}>
                <Text style={[styles.cancelText, { color: colors.foreground }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.saveButton, { backgroundColor: colors.navyDark }]} onPress={add} disabled={saving}>
                <Text style={[styles.saveText, { color: colors.primary }]}>{saving ? "Saving..." : "Add credential"}</Text>
              </TouchableOpacity>
            </View>
          </InterpreterCard>
        </KeyboardAwareScrollView>
      ) : (
        <TouchableOpacity style={[styles.addButton, { borderColor: colors.border }]} onPress={() => setAdding(true)}>
          <Feather name="plus" size={17} color={colors.navyDark} />
          <Text style={[styles.addText, { color: colors.navyDark }]}>Add credential</Text>
        </TouchableOpacity>
      )}
    </InterpreterScreen>
  );
}

function Field({ label, value, onChangeText, placeholder, colors }: { label: string; value: string; onChangeText: (value: string) => void; placeholder: string; colors: ReturnType<typeof useColors> }) {
  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: colors.foreground }]}>{label}</Text>
      <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={colors.mutedForeground} style={[styles.input, { color: colors.foreground, borderColor: colors.border }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  emptyWrap: { marginHorizontal: 20, minHeight: 205, borderRadius: 18, borderWidth: 1, borderColor: "#00000010", alignItems: "center", justifyContent: "center", padding: 25, gap: 9 },
  emptyTitle: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
  emptyText: { maxWidth: 275, textAlign: "center", fontSize: 13, lineHeight: 19, fontFamily: "Inter_400Regular" },
  credentialHeader: { flexDirection: "row", alignItems: "center" },
  credentialIcon: { width: 40, height: 40, borderRadius: 13, alignItems: "center", justifyContent: "center", marginRight: 11 },
  copy: { flex: 1, paddingRight: 8 },
  credentialTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold", marginBottom: 4 },
  issuer: { fontSize: 11, fontFamily: "Inter_400Regular" },
  credentialFooter: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 13 },
  reference: { flex: 1, fontSize: 10, fontFamily: "Inter_400Regular" },
  addButton: { marginHorizontal: 20, borderWidth: 1, borderStyle: "dashed", borderRadius: 13, paddingVertical: 13, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 7 },
  addText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  formTitle: { fontSize: 16, fontFamily: "Inter_700Bold", marginBottom: 18 },
  field: { marginBottom: 15 },
  label: { fontSize: 12, fontFamily: "Inter_600SemiBold", marginBottom: 7 },
  input: { minHeight: 47, borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, fontSize: 13, fontFamily: "Inter_400Regular" },
  formHint: { fontSize: 11, lineHeight: 16, fontFamily: "Inter_400Regular", marginTop: 1 },
  formActions: { flexDirection: "row", gap: 9, marginTop: 18 },
  cancelButton: { flex: 1, borderWidth: 1, borderRadius: 12, alignItems: "center", paddingVertical: 13 },
  cancelText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  saveButton: { flex: 1, borderRadius: 12, alignItems: "center", paddingVertical: 13 },
  saveText: { fontSize: 12, fontFamily: "Inter_700Bold" },
});