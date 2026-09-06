import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AccountCard, BackButton, FormField, SaveButton } from "@/components/account/AccountShared";
import { UserAddress, useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const LABELS: UserAddress["label"][] = ["Home", "Work", "Other"];

export default function AddAddressScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { addresses, addAddress, updateAddress } = useApp();
  const existing = addresses.find(address => address.id === id);
  const [label, setLabel] = useState<UserAddress["label"]>(existing?.label || "Home");
  const [address, setAddress] = useState(existing?.address || "");
  const [city, setCity] = useState(existing?.city || "");
  const [state, setState] = useState(existing?.state || "");
  const [country, setCountry] = useState(existing?.country || "Nigeria");
  const [postalCode, setPostalCode] = useState(existing?.postalCode || "");
  const [isDefault, setIsDefault] = useState(existing?.isDefault || addresses.length === 0);
  const [loading, setLoading] = useState(false);

  const save = async () => {
    if (!address.trim() || !city.trim() || !state.trim() || !country.trim()) {
      Alert.alert("Missing address details", "Address, city, state, and country are required.");
      return;
    }
    setLoading(true);
    const data = { label, address: address.trim(), city: city.trim(), state: state.trim(), country: country.trim(), postalCode: postalCode.trim() || undefined, isDefault };
    if (existing) await updateAddress(existing.id, data);
    else await addAddress(data);
    setLoading(false);
    router.back();
  };

  return (
    <KeyboardAwareScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 30 }]}
      keyboardShouldPersistTaps="handled"
      bottomOffset={70}
    >
      <View style={styles.header}>
        <BackButton />
        <Text style={[styles.title, { color: colors.navyDark }]}>{existing ? "Edit address" : "Add address"}</Text>
        <View style={styles.spacer} />
      </View>
      <AccountCard>
        <Text style={[styles.labelTitle, { color: colors.navyDark }]}>Address label</Text>
        <View style={styles.labels}>
          {LABELS.map(item => (
            <TouchableOpacity key={item} onPress={() => setLabel(item)} style={[styles.labelChip, { borderColor: label === item ? colors.navyDark : colors.border, backgroundColor: label === item ? colors.navyDark : colors.card }]}>
              <Text style={[styles.labelText, { color: label === item ? colors.primary : colors.foreground }]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <FormField label="Street address" value={address} onChangeText={setAddress} placeholder="House number and street" />
        <FormField label="City" value={city} onChangeText={setCity} placeholder="e.g. Lagos" />
        <FormField label="State" value={state} onChangeText={setState} placeholder="e.g. Lagos State" />
        <FormField label="Country" value={country} onChangeText={setCountry} placeholder="e.g. Nigeria" />
        <FormField label="Postal code (optional)" value={postalCode} onChangeText={setPostalCode} placeholder="Postal or ZIP code" keyboardType="number-pad" />
        <TouchableOpacity style={styles.defaultRow} onPress={() => setIsDefault(value => !value)}>
          <View style={[styles.checkbox, { borderColor: isDefault ? colors.navyDark : colors.border, backgroundColor: isDefault ? colors.navyDark : colors.card }]}>
            {isDefault ? <Text style={[styles.check, { color: colors.primary }]}>✓</Text> : null}
          </View>
          <Text style={[styles.defaultText, { color: colors.foreground }]}>Set as default address</Text>
        </TouchableOpacity>
      </AccountCard>
      <SaveButton label={existing ? "Save address" : "Add address"} loading={loading} onPress={save} />
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 18 },
  spacer: { width: 40 },
  title: { fontSize: 21, fontFamily: "Inter_700Bold" },
  labelTitle: { fontSize: 15, fontFamily: "Inter_700Bold", marginBottom: 15 },
  labels: { flexDirection: "row", gap: 8, marginBottom: 20 },
  labelChip: { flex: 1, borderWidth: 1, borderRadius: 11, paddingVertical: 10, alignItems: "center" },
  labelText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  defaultRow: { flexDirection: "row", alignItems: "center", gap: 9, marginTop: -2 },
  checkbox: { width: 20, height: 20, borderRadius: 6, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  check: { fontSize: 14, fontFamily: "Inter_700Bold" },
  defaultText: { fontSize: 12, fontFamily: "Inter_500Medium" },
});