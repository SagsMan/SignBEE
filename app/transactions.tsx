import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Transaction } from "@/context/AppContext";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { TransactionRow } from "./wallet";

export default function TransactionsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { transactions } = useApp();
  const topPad = Platform.OS === "web" ? 20 : insets.top;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 6 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.navyDark }]}>Transactions</Text>
        <View style={styles.iconButton} />
      </View>
      <FlatList
        data={transactions}
        keyExtractor={item => item.id}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 28 }, transactions.length === 0 && styles.emptyList]}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="file-text" size={42} color={colors.border} />
            <Text style={[styles.emptyTitle, { color: colors.navyDark }]}>No transactions yet</Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>Your payments, top-ups, and withdrawals will appear here.</Text>
          </View>
        }
        renderItem={({ item }: { item: Transaction }) => (
          <TransactionRow transaction={item} colors={colors} onPress={() => router.push({ pathname: "/transaction/[id]", params: { id: item.id } })} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 18 },
  iconButton: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 21, fontFamily: "Inter_700Bold" },
  list: { paddingHorizontal: 20 },
  emptyList: { flex: 1 },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 30, gap: 10 },
  emptyTitle: { fontSize: 17, fontFamily: "Inter_600SemiBold" },
  emptyText: { fontSize: 13, lineHeight: 19, textAlign: "center" },
});