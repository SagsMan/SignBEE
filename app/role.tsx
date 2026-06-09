import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import PrimaryButton from "@/components/PrimaryButton";
import { useColors } from "@/hooks/useColors";

type Role = "individual" | "interpreter";

export default function RoleScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selected, setSelected] = useState<Role | null>(null);

  const topPad = Platform.OS === "web" ? 67 : insets.top + 24;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom + 16;

  const handleContinue = () => {
    if (!selected) return;
    router.push({ pathname: "/register", params: { role: selected } });
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: topPad,
          paddingBottom: bottomPad,
        },
      ]}
    >
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Feather name="arrow-left" size={22} color={colors.foreground} />
      </TouchableOpacity>

      <Text style={[styles.title, { color: colors.navyDark }]}>
        How do you want to{"\n"}use SignBee?
      </Text>

      <View style={styles.options}>
        <RoleOption
          icon="users"
          label="As an Individual"
          description="Book certified interpreters for your needs"
          selected={selected === "individual"}
          onPress={() => setSelected("individual")}
          colors={colors}
        />
        <RoleOption
          icon="headphones"
          label="As an Interpreter"
          description="Offer your sign language services"
          selected={selected === "interpreter"}
          onPress={() => setSelected("interpreter")}
          colors={colors}
        />
      </View>

      <View style={{ flex: 1 }} />

      <PrimaryButton
        title="Continue"
        onPress={handleContinue}
        disabled={!selected}
        style={styles.cta}
      />
    </View>
  );
}

interface RoleOptionProps {
  icon: string;
  label: string;
  description: string;
  selected: boolean;
  onPress: () => void;
  colors: ReturnType<typeof useColors>;
}

function RoleOption({
  icon,
  label,
  description,
  selected,
  onPress,
  colors,
}: RoleOptionProps) {
  return (
    <TouchableOpacity
      style={[
        styles.option,
        {
          borderColor: selected ? colors.primary : colors.border,
          backgroundColor: selected ? colors.greenLight : colors.background,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View
        style={[
          styles.radio,
          { borderColor: selected ? colors.navyDark : colors.border },
        ]}
      >
        {selected && (
          <View
            style={[styles.radioDot, { backgroundColor: colors.navyDark }]}
          />
        )}
      </View>
      <View style={[styles.iconCircle, { backgroundColor: colors.muted }]}>
        <Feather name={icon as any} size={20} color={colors.navyDark} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.optionLabel, { color: colors.navyDark }]}>
          {label}
        </Text>
        <Text style={[styles.optionDesc, { color: colors.mutedForeground }]}>
          {description}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24 },
  backBtn: {
    marginBottom: 32,
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    lineHeight: 36,
    marginBottom: 32,
  },
  options: { gap: 14 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    gap: 12,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  radioDot: { width: 10, height: 10, borderRadius: 5 },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  optionLabel: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 2,
  },
  optionDesc: { fontSize: 12, fontFamily: "Inter_400Regular" },
  cta: { marginBottom: 8 },
});
