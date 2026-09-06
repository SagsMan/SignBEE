import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { ReactNode } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

export function InterpreterScreen({
  title,
  subtitle,
  children,
  action,
  scroll = true,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  action?: ReactNode;
  scroll?: boolean;
}) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const content = (
    <>
      <View style={[styles.header, { paddingTop: (Platform.OS === "web" ? 20 : insets.top) + 16 }]}>
        <View style={styles.headerCopy}>
          <Text style={[styles.title, { color: colors.navyDark }]}>{title}</Text>
          {subtitle ? (
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>{subtitle}</Text>
          ) : null}
        </View>
        {action}
      </View>
      {children}
    </>
  );

  if (!scroll) {
    return <View style={[styles.container, { backgroundColor: colors.background }]}>{content}</View>;
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + 110 }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {content}
    </ScrollView>
  );
}

export function BackButton() {
  const router = useRouter();
  const colors = useColors();
  return (
    <TouchableOpacity onPress={() => router.back()} style={styles.backButton} accessibilityLabel="Go back">
      <Feather name="arrow-left" size={21} color={colors.foreground} />
    </TouchableOpacity>
  );
}

export function InterpreterCard({ children, onPress }: { children: ReactNode; onPress?: () => void }) {
  const colors = useColors();
  const card = (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>{children}</View>
  );
  return onPress ? (
    <TouchableOpacity onPress={onPress} activeOpacity={0.82}>
      {card}
    </TouchableOpacity>
  ) : (
    card
  );
}

export function StatusPill({ label, tone = "neutral" }: { label: string; tone?: "success" | "warning" | "danger" | "neutral" }) {
  const colors = useColors();
  const background = {
    success: colors.success + "20",
    warning: colors.star + "20",
    danger: colors.destructive + "20",
    neutral: colors.muted,
  }[tone];
  const foreground = {
    success: colors.success,
    warning: colors.star,
    danger: colors.destructive,
    neutral: colors.mutedForeground,
  }[tone];
  return (
    <View style={[styles.pill, { backgroundColor: background }]}>
      <Text style={[styles.pillText, { color: foreground }]}>{label}</Text>
    </View>
  );
}

export function StatTile({ label, value, icon, accent }: { label: string; value: string; icon: string; accent?: string }) {
  const colors = useColors();
  return (
    <View style={[styles.statTile, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.statIcon, { backgroundColor: (accent || colors.greenLight) + "35" }]}>
        <Feather name={icon as any} size={16} color={accent || colors.navyDark} />
      </View>
      <Text style={[styles.statValue, { color: colors.navyDark }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{label}</Text>
    </View>
  );
}

export function EmptyState({ icon, title, description, action }: { icon: string; title: string; description: string; action?: ReactNode }) {
  const colors = useColors();
  return (
    <View style={[styles.empty, { borderColor: colors.border }]}>
      <View style={[styles.emptyIcon, { backgroundColor: colors.greenLight }]}>
        <Feather name={icon as any} size={24} color={colors.navyDark} />
      </View>
      <Text style={[styles.emptyTitle, { color: colors.navyDark }]}>{title}</Text>
      <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>{description}</Text>
      {action}
    </View>
  );
}

export function SectionLabel({ children, action }: { children: ReactNode; action?: ReactNode }) {
  const colors = useColors();
  return (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: colors.navyDark }]}>{children}</Text>
      {action}
    </View>
  );
}

export function formatCurrency(value: number) {
  return `₦${value.toLocaleString("en-NG")}`;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 18,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  headerCopy: { flex: 1, paddingRight: 12 },
  title: { fontSize: 25, fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 13, lineHeight: 19, fontFamily: "Inter_400Regular", marginTop: 5 },
  backButton: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  card: { marginHorizontal: 20, marginBottom: 14, borderRadius: 18, borderWidth: 1, padding: 16 },
  pill: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, alignSelf: "flex-start" },
  pillText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  statTile: { flex: 1, minHeight: 118, borderRadius: 16, borderWidth: 1, padding: 13 },
  statIcon: { width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center", marginBottom: 10 },
  statValue: { fontSize: 19, fontFamily: "Inter_700Bold" },
  statLabel: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 4 },
  empty: { marginHorizontal: 20, borderRadius: 18, borderWidth: 1, padding: 28, alignItems: "center", gap: 9 },
  emptyIcon: { width: 54, height: 54, borderRadius: 27, alignItems: "center", justifyContent: "center", marginBottom: 3 },
  emptyTitle: { fontSize: 16, fontFamily: "Inter_600SemiBold", textAlign: "center" },
  emptyText: { fontSize: 13, lineHeight: 19, fontFamily: "Inter_400Regular", textAlign: "center", maxWidth: 285 },
  sectionHeader: { marginHorizontal: 20, marginTop: 8, marginBottom: 11, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  sectionTitle: { fontSize: 17, fontFamily: "Inter_700Bold" },
});