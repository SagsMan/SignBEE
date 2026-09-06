import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { ReactNode } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

export function AccountScreen({
  title,
  subtitle,
  children,
  action,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + 110 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.header, { paddingTop: (Platform.OS === "web" ? 20 : insets.top) + 14 }]}>
        <View style={styles.headerCopy}>
          <Text style={[styles.title, { color: colors.navyDark }]}>{title}</Text>
          {subtitle ? <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>{subtitle}</Text> : null}
        </View>
        {action}
      </View>
      {children}
    </ScrollView>
  );
}

export function BackButton() {
  const router = useRouter();
  const colors = useColors();
  return (
    <TouchableOpacity style={styles.backButton} onPress={() => router.back()} accessibilityLabel="Go back">
      <Feather name="arrow-left" size={21} color={colors.foreground} />
    </TouchableOpacity>
  );
}

export function AccountCard({ children }: { children: ReactNode }) {
  const colors = useColors();
  return <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>{children}</View>;
}

export function AccountRow({
  icon,
  label,
  value,
  onPress,
  danger = false,
}: {
  icon: string;
  label: string;
  value?: string;
  onPress: () => void;
  danger?: boolean;
}) {
  const colors = useColors();
  return (
    <TouchableOpacity style={[styles.row, { borderColor: colors.border }]} onPress={onPress} activeOpacity={0.75}>
      <View style={[styles.rowIcon, { backgroundColor: danger ? colors.destructive + "15" : colors.muted }]}>
        <Feather name={icon as any} size={17} color={danger ? colors.destructive : colors.navyDark} />
      </View>
      <View style={styles.rowCopy}>
        <Text style={[styles.rowLabel, { color: danger ? colors.destructive : colors.foreground }]}>{label}</Text>
        {value ? <Text style={[styles.rowValue, { color: colors.mutedForeground }]}>{value}</Text> : null}
      </View>
      {!danger ? <Feather name="chevron-right" size={17} color={colors.mutedForeground} /> : null}
    </TouchableOpacity>
  );
}

export function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
  keyboardType,
  secureTextEntry = false,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  multiline?: boolean;
  keyboardType?: "email-address" | "phone-pad" | "number-pad" | "default";
  secureTextEntry?: boolean;
}) {
  const colors = useColors();
  return (
    <View style={styles.field}>
      <Text style={[styles.fieldLabel, { color: colors.foreground }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground}
        multiline={multiline}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        textAlignVertical={multiline ? "top" : "center"}
        style={[styles.input, multiline && styles.textArea, { color: colors.foreground, backgroundColor: colors.card, borderColor: colors.border }]}
      />
    </View>
  );
}

export function SaveButton({ label, loading, onPress }: { label: string; loading?: boolean; onPress: () => void }) {
  const colors = useColors();
  return (
    <TouchableOpacity style={[styles.saveButton, { backgroundColor: colors.navyDark }]} onPress={onPress} disabled={loading}>
      <Text style={[styles.saveText, { color: colors.primary }]}>{loading ? "Saving..." : label}</Text>
    </TouchableOpacity>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  const colors = useColors();
  return <Text style={[styles.sectionTitle, { color: colors.navyDark }]}>{children}</Text>;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 19, flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" },
  headerCopy: { flex: 1, paddingRight: 12 },
  title: { fontSize: 25, fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 13, lineHeight: 19, fontFamily: "Inter_400Regular", marginTop: 5 },
  backButton: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  card: { marginHorizontal: 20, borderRadius: 18, borderWidth: 1, padding: 16, marginBottom: 14 },
  row: { minHeight: 70, marginHorizontal: 20, borderWidth: 1, borderRadius: 16, paddingHorizontal: 14, marginBottom: 9, flexDirection: "row", alignItems: "center" },
  rowIcon: { width: 37, height: 37, borderRadius: 12, alignItems: "center", justifyContent: "center", marginRight: 11 },
  rowCopy: { flex: 1, paddingRight: 8 },
  rowLabel: { fontSize: 13, fontFamily: "Inter_600SemiBold", marginBottom: 4 },
  rowValue: { fontSize: 11, fontFamily: "Inter_400Regular" },
  field: { marginBottom: 17 },
  fieldLabel: { fontSize: 12, fontFamily: "Inter_600SemiBold", marginBottom: 7 },
  input: { minHeight: 49, borderWidth: 1, borderRadius: 13, paddingHorizontal: 13, fontSize: 14, fontFamily: "Inter_400Regular" },
  textArea: { minHeight: 125, paddingTop: 13 },
  saveButton: { marginHorizontal: 20, borderRadius: 13, paddingVertical: 15, alignItems: "center", marginTop: 4 },
  saveText: { fontSize: 14, fontFamily: "Inter_700Bold" },
  sectionTitle: { marginHorizontal: 20, fontSize: 17, fontFamily: "Inter_700Bold", marginBottom: 12 },
});