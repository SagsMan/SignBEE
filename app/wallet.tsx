import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Transaction, useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function WalletScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { walletBalance, availableBalance, pendingBalance, transactions } = useApp();
  const topPad = Platform.OS === "web" ? 20 : insets.top;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 6 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.navyDark }]}>Wallet</Text>
        <TouchableOpacity onPress={() => router.push("/payment-pin")} style={styles.iconButton}>
          <Feather name="lock" size={19} color={colors.foreground} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={transactions.slice(0, 4)}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 30 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <View style={[styles.balanceCard, { backgroundColor: colors.navyDark }]}>
              <View style={styles.balanceTop}>
                <Text style={[styles.balanceLabel, { color: "#FFFFFF" }]}>Total wallet balance</Text>
                <Feather name="credit-card" size={20} color={colors.primary} />
              </View>
              <Text style={[styles.balance, { color: colors.primary }]}>₦{walletBalance.toLocaleString()}</Text>
              <View style={styles.balanceMetaRow}>
                <View>
                  <Text style={[styles.metaLabel, { color: "#FFFFFF" }]}>Available</Text>
                  <Text style={[styles.metaValue, { color: "#FFFFFF" }]}>₦{availableBalance.toLocaleString()}</Text>
                </View>
                <View>
                  <Text style={[styles.metaLabel, { color: "#FFFFFF" }]}>Pending</Text>
                  <Text style={[styles.metaValue, { color: "#FFFFFF" }]}>₦{pendingBalance.toLocaleString()}</Text>
                </View>
              </View>
            </View>
            <View style={styles.actionGrid}>
              <WalletAction icon="plus-circle" label="Add funds" onPress={() => router.push("/add-funds")} colors={colors} />
              <WalletAction icon="repeat" label="Top-up" onPress={() => router.push("/top-up")} colors={colors} />
              <WalletAction icon="arrow-up-right" label="Withdraw" onPress={() => router.push("/withdraw")} colors={colors} />
            </View>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.navyDark }]}>Recent transactions</Text>
              {transactions.length > 0 ? (
                <TouchableOpacity onPress={() => router.push("/transactions")}>
                  <Text style={[styles.seeAll, { color: colors.mutedForeground }]}>See all</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={[styles.empty, { borderColor: colors.border }]}>
            <Feather name="credit-card" size={32} color={colors.border} />
            <Text style={[styles.emptyTitle, { color: colors.navyDark }]}>Your wallet is empty</Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Add funds to pay for bookings and manage your balance.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TransactionRow
            transaction={item}
            colors={colors}
            onPress={() => router.push({ pathname: "/transaction/[id]", params: { id: item.id } })}
          />
        )}
      />
    </View>
  );
}

function WalletAction({
  icon,
  label,
  onPress,
  colors,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  onPress: () => void;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <TouchableOpacity style={[styles.action, { borderColor: colors.border }]} onPress={onPress}>
      <View style={[styles.actionIcon, { backgroundColor: colors.greenLight }]}>
        <Feather name={icon} size={18} color={colors.navyDark} />
      </View>
      <Text style={[styles.actionText, { color: colors.foreground }]}>{label}</Text>
    </TouchableOpacity>
  );
}

export function TransactionRow({
  transaction,
  colors,
  onPress,
}: {
  transaction: Transaction;
  colors: ReturnType<typeof useColors>;
  onPress: () => void;
}) {
  const isCredit = transaction.type === "top_up";
  const icon = transaction.type === "payment" ? "shopping-bag" : transaction.type === "withdrawal" ? "arrow-up-right" : "plus";
  return (
    <TouchableOpacity style={styles.transaction} onPress={onPress}>
      <View style={[styles.transactionIcon, { backgroundColor: isCredit ? colors.greenLight : colors.muted }]}>
        <Feather name={icon} size={17} color={colors.navyDark} />
      </View>
      <View style={styles.transactionCopy}>
        <Text style={[styles.transactionTitle, { color: colors.foreground }]}>
          {transaction.description}
        </Text>
        <Text style={[styles.transactionMeta, { color: colors.mutedForeground }]}>
          {new Date(transaction.date).toLocaleDateString()} · {transaction.status}
        </Text>
      </View>
      <Text style={[styles.transactionAmount, { color: isCredit ? colors.success : colors.foreground }]}>
        {isCredit ? "+" : "-"}₦{transaction.amount.toLocaleString()}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 16 },
  iconButton: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 21, fontFamily: "Inter_700Bold" },
  balanceCard: { borderRadius: 20, padding: 20, marginBottom: 16 },
  balanceTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  balanceLabel: { fontSize: 12 },
  balance: { fontSize: 32, fontFamily: "Inter_700Bold", marginVertical: 18 },
  balanceMetaRow: { flexDirection: "row", gap: 48 },
  metaLabel: { fontSize: 11, opacity: 0.7, marginBottom: 4 },
  metaValue: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  actionGrid: { flexDirection: "row", gap: 9, marginBottom: 26 },
  action: { flex: 1, borderWidth: 1, borderRadius: 14, paddingVertical: 11, alignItems: "center", gap: 7 },
  actionIcon: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center" },
  actionText: { fontSize: 11, fontFamily: "Inter_500Medium" },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontFamily: "Inter_700Bold" },
  seeAll: { fontSize: 12, fontFamily: "Inter_500Medium" },
  empty: { minHeight: 170, borderWidth: 1, borderRadius: 15, alignItems: "center", justifyContent: "center", padding: 24, gap: 9 },
  emptyTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  emptyText: { fontSize: 12, lineHeight: 18, textAlign: "center", maxWidth: 250 },
  transaction: { minHeight: 69, flexDirection: "row", alignItems: "center", gap: 11, borderBottomWidth: 1, borderBottomColor: "#EBEBEB" },
  transactionIcon: { width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  transactionCopy: { flex: 1 },
  transactionTitle: { fontSize: 13, fontFamily: "Inter_600SemiBold", marginBottom: 4 },
  transactionMeta: { fontSize: 10 },
  transactionAmount: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
});