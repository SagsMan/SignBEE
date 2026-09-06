import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { AccountCard, AccountScreen, BackButton } from "@/components/account/AccountShared";
import { EmptyState } from "@/components/interpreter/InterpreterShared";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function AddressesScreen() {
  const colors = useColors();
  const router = useRouter();
  const { addresses, removeAddress, setDefaultAddress } = useApp();

  const deleteAddress = (id: string) => {
    Alert.alert("Remove address?", "This address will be removed from your saved locations.", [
      { text: "Keep", style: "cancel" },
      { text: "Remove", style: "destructive", onPress: () => removeAddress(id) },
    ]);
  };

  return (
    <AccountScreen title="Addresses" subtitle="Save locations for faster in-person bookings." action={<BackButton />}>
      {addresses.length === 0 ? (
        <EmptyState icon="map-pin" title="No saved addresses" description="Add a home, work, or other address to use when booking an in-person interpreter." />
      ) : (
        addresses.map(address => (
          <AccountCard key={address.id}>
            <View style={styles.header}>
              <View style={[styles.icon, { backgroundColor: colors.greenLight }]}>
                <Feather name={address.label === "Work" ? "briefcase" : "home"} size={18} color={colors.navyDark} />
              </View>
              <View style={styles.copy}>
                <View style={styles.titleRow}>
                  <Text style={[styles.label, { color: colors.navyDark }]}>{address.label}</Text>
                  {address.isDefault ? <Text style={[styles.defaultBadge, { color: colors.success }]}>Default</Text> : null}
                </View>
                <Text style={[styles.address, { color: colors.foreground }]}>{address.address}</Text>
                <Text style={[styles.meta, { color: colors.mutedForeground }]}>{address.city}, {address.state}, {address.country}{address.postalCode ? ` · ${address.postalCode}` : ""}</Text>
              </View>
            </View>
            <View style={[styles.actions, { borderTopColor: colors.border }]}>
              {!address.isDefault ? <TouchableOpacity onPress={() => setDefaultAddress(address.id)}><Text style={[styles.actionText, { color: colors.navyDark }]}>Make default</Text></TouchableOpacity> : <View />}
              <View style={styles.actionGroup}>
                <TouchableOpacity onPress={() => router.push({ pathname: "/add-address", params: { id: address.id } })}><Text style={[styles.actionText, { color: colors.navyDark }]}>Edit</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => deleteAddress(address.id)}><Text style={[styles.actionText, { color: colors.destructive }]}>Remove</Text></TouchableOpacity>
              </View>
            </View>
          </AccountCard>
        ))
      )}
      <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.navyDark }]} onPress={() => router.push("/add-address")}>
        <Feather name="plus" size={17} color={colors.primary} />
        <Text style={[styles.addText, { color: colors.primary }]}>Add address</Text>
      </TouchableOpacity>
    </AccountScreen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row" },
  icon: { width: 42, height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center", marginRight: 11 },
  copy: { flex: 1 },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 5 },
  label: { fontSize: 14, fontFamily: "Inter_700Bold" },
  defaultBadge: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  address: { fontSize: 13, lineHeight: 18, fontFamily: "Inter_500Medium", marginBottom: 3 },
  meta: { fontSize: 11, fontFamily: "Inter_400Regular" },
  actions: { borderTopWidth: 1, marginTop: 14, paddingTop: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  actionGroup: { flexDirection: "row", gap: 18 },
  actionText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  addButton: { marginHorizontal: 20, borderRadius: 13, paddingVertical: 14, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8 },
  addText: { fontSize: 13, fontFamily: "Inter_700Bold" },
});