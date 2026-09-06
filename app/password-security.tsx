import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BackButton, FormField, SaveButton } from "@/components/account/AccountShared";
import { useColors } from "@/hooks/useColors";

export default function PasswordSecurityScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [loading, setLoading] = useState(false);

  const save = async () => {
    if (!currentPassword || !newPassword || !confirmation) {
      Alert.alert("Complete the form", "Enter your current password, new password, and confirmation.");
      return;
    }
    if (newPassword.length < 8) {
      Alert.alert("Password too short", "Use at least 8 characters for your new password.");
      return;
    }
    if (newPassword !== confirmation) {
      Alert.alert("Passwords do not match", "Check the confirmation and try again.");
      return;
    }
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setLoading(false);
    Alert.alert("Password update requested", "This local demo validated the change without storing any password. Connect the authentication backend to complete a real update.", [{ text: "Done", onPress: () => router.back() }]);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmation("");
  };

  return (
    <KeyboardAwareScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 28 }]}
      keyboardShouldPersistTaps="handled"
      bottomOffset={70}
    >
      <View style={styles.header}>
        <BackButton />
        <Text style={[styles.title, { color: colors.navyDark }]}>Password & security</Text>
        <View style={styles.spacer} />
      </View>
      <View style={[styles.notice, { backgroundColor: colors.greenLight }]}>
        <Feather name="shield" size={20} color={colors.navyDark} />
        <Text style={[styles.noticeText, { color: colors.navyDark }]}>Passwords are never stored in this local demo. A production authentication service is required to apply this change.</Text>
      </View>
      <FormField label="Current password" value={currentPassword} onChangeText={setCurrentPassword} placeholder="Enter current password" secureTextEntry />
      <FormField label="New password" value={newPassword} onChangeText={setNewPassword} placeholder="At least 8 characters" secureTextEntry />
      <FormField label="Confirm new password" value={confirmation} onChangeText={setConfirmation} placeholder="Repeat new password" secureTextEntry />
      <Text style={[styles.requirements, { color: colors.mutedForeground }]}>Use 8 or more characters. Never share your password with anyone.</Text>
      <SaveButton label="Update password" loading={loading} onPress={save} />
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 },
  spacer: { width: 40 },
  title: { fontSize: 20, fontFamily: "Inter_700Bold" },
  notice: { borderRadius: 16, padding: 14, flexDirection: "row", gap: 10, marginBottom: 22 },
  noticeText: { flex: 1, fontSize: 11, lineHeight: 17, fontFamily: "Inter_500Medium" },
  requirements: { fontSize: 11, lineHeight: 17, fontFamily: "Inter_400Regular", marginTop: -5, marginBottom: 22 },
});