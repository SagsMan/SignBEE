import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AccountCard, BackButton, FormField, SaveButton } from "@/components/account/AccountShared";
import { SupportRequest, useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const CATEGORIES: SupportRequest["category"][] = ["General help", "Booking", "Payment", "Account", "Report a problem"];

export default function ContactSupportScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { submitSupportRequest } = useApp();
  const [category, setCategory] = useState<SupportRequest["category"]>("General help");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!subject.trim() || message.trim().length < 10) {
      Alert.alert("Add more detail", "Enter a subject and a message of at least 10 characters.");
      return;
    }
    setLoading(true);
    await submitSupportRequest({ category, subject: subject.trim(), message: message.trim() });
    setLoading(false);
    Alert.alert("Request saved", "Your support request was saved locally on this device. It was not sent to a support team.", [{ text: "Done", onPress: () => router.back() }]);
  };

  return (
    <KeyboardAwareScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={[styles.content, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 30 }]} keyboardShouldPersistTaps="handled" bottomOffset={70}>
      <View style={styles.header}><BackButton /><Text style={[styles.title, { color: colors.navyDark }]}>Contact support</Text><View style={styles.spacer} /></View>
      <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Tell us what you need help with and keep a local copy of your request.</Text>
      <AccountCard>
        <Text style={[styles.label, { color: colors.foreground }]}>What do you need help with?</Text>
        <View style={styles.categories}>
          {CATEGORIES.map(item => (
            <TouchableOpacity key={item} onPress={() => setCategory(item)} style={[styles.category, { borderColor: category === item ? colors.navyDark : colors.border, backgroundColor: category === item ? colors.navyDark : colors.card }]}>
              <Text style={[styles.categoryText, { color: category === item ? colors.primary : colors.foreground }]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <FormField label="Subject" value={subject} onChangeText={setSubject} placeholder="Briefly describe the issue" />
        <FormField label="Message" value={message} onChangeText={setMessage} placeholder="Add the details we should know" multiline />
      </AccountCard>
      <Text style={[styles.note, { color: colors.mutedForeground }]}>No support backend is connected in this demo, so submitting stores the request locally only.</Text>
      <SaveButton label="Save support request" loading={loading} onPress={submit} />
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  spacer: { width: 40 },
  title: { fontSize: 21, fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 13, lineHeight: 19, fontFamily: "Inter_400Regular", marginBottom: 20 },
  label: { fontSize: 12, fontFamily: "Inter_600SemiBold", marginBottom: 10 },
  categories: { flexDirection: "row", flexWrap: "wrap", gap: 7, marginBottom: 19 },
  category: { borderWidth: 1, borderRadius: 18, paddingHorizontal: 10, paddingVertical: 8 },
  categoryText: { fontSize: 11, fontFamily: "Inter_500Medium" },
  note: { marginHorizontal: 20, fontSize: 11, lineHeight: 17, fontFamily: "Inter_400Regular", marginBottom: 14 },
});