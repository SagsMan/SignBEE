import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BackButton, FormField, SaveButton } from "@/components/account/AccountShared";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function EditProfileScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, updateAccount } = useApp();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [avatar, setAvatar] = useState(user?.avatar);
  const [loading, setLoading] = useState(false);

  const chooseImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Photo permission needed", "Allow photo access to choose a profile image.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]?.uri) setAvatar(result.assets[0].uri);
  };

  const save = async () => {
    if (!name.trim() || !email.trim() || !phone.trim()) {
      Alert.alert("Missing information", "Name, email, and phone number are required.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      Alert.alert("Check your email", "Enter a valid email address.");
      return;
    }
    setLoading(true);
    await updateAccount({ name: name.trim(), email: email.trim(), phone: phone.trim(), avatar });
    setLoading(false);
    Alert.alert("Profile updated", "Your account information has been saved.", [{ text: "Done", onPress: () => router.back() }]);
  };

  const initials = name.split(" ").map(part => part[0]).join("").slice(0, 2).toUpperCase() || "U";

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
        <Text style={[styles.title, { color: colors.navyDark }]}>Edit profile</Text>
        <View style={styles.spacer} />
      </View>
      <View style={styles.photoWrap}>
        {avatar ? <Image source={{ uri: avatar }} style={styles.avatar} /> : <View style={[styles.avatar, { backgroundColor: colors.primary }]}><Text style={[styles.initials, { color: colors.navyDark }]}>{initials}</Text></View>}
        <TouchableOpacity onPress={chooseImage} style={[styles.photoButton, { backgroundColor: colors.navyDark }]}>
          <Feather name="camera" size={15} color={colors.primary} />
          <Text style={[styles.photoText, { color: colors.primary }]}>Change photo</Text>
        </TouchableOpacity>
        <Text style={[styles.photoHint, { color: colors.mutedForeground }]}>Stored locally on this device in the demo app.</Text>
      </View>
      <FormField label="Full name" value={name} onChangeText={setName} placeholder="Your full name" />
      <FormField label="Email address" value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" />
      <FormField label="Phone number" value={phone} onChangeText={setPhone} placeholder="+234 800 000 0000" keyboardType="phone-pad" />
      <SaveButton label="Save changes" loading={loading} onPress={save} />
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 },
  spacer: { width: 40 },
  title: { fontSize: 21, fontFamily: "Inter_700Bold" },
  photoWrap: { alignItems: "center", marginBottom: 26 },
  avatar: { width: 92, height: 92, borderRadius: 31, alignItems: "center", justifyContent: "center", marginBottom: 12 },
  initials: { fontSize: 31, fontFamily: "Inter_700Bold" },
  photoButton: { borderRadius: 12, paddingHorizontal: 13, paddingVertical: 9, flexDirection: "row", alignItems: "center", gap: 7 },
  photoText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  photoHint: { fontSize: 10, fontFamily: "Inter_400Regular", marginTop: 8 },
});