import { Feather } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Interpreter } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

interface Props {
  interpreter: Interpreter;
  onPress: () => void;
  onFavorite?: () => void;
  isFavorite?: boolean;
  compact?: boolean;
}

export default function InterpreterCard({
  interpreter,
  onPress,
  onFavorite,
  isFavorite,
  compact,
}: Props) {
  const colors = useColors();
  const avatarSource =
    interpreter.avatar === "male"
      ? require("@/assets/images/interpreter_male.png")
      : require("@/assets/images/interpreter_female.png");

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: colors.background, borderColor: colors.border },
      ]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Image
        source={avatarSource}
        style={[styles.avatar, compact && styles.compactAvatar]}
      />

      <View style={styles.info}>
        <Text
          style={[styles.name, { color: colors.foreground }]}
          numberOfLines={1}
        >
          {interpreter.name}
        </Text>
        <Text style={[styles.lang, { color: colors.mutedForeground }]}>
          {interpreter.languages.join(", ")} | {interpreter.type}
        </Text>
        <View style={styles.meta}>
          <Feather name="star" size={12} color={colors.primary} fill={colors.primary} />
          <Text style={[styles.rating, { color: colors.foreground }]}>
            {" "}
            {interpreter.rating}{" "}
          </Text>
          <Text style={[styles.avail, { color: colors.mutedForeground }]}>
            {interpreter.isAvailable ? "Available now" : interpreter.availability}
          </Text>
          <Text style={[styles.rate, { color: colors.foreground }]}>
            {" "}₦{interpreter.rate.toLocaleString()}/hr
          </Text>
        </View>
      </View>

      {onFavorite && (
        <TouchableOpacity onPress={onFavorite} style={styles.fav}>
          <Feather
            name="heart"
            size={18}
            color={isFavorite ? colors.primary : colors.mutedForeground}
            fill={isFavorite ? colors.primary : "transparent"}
          />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
    overflow: "hidden",
  },
  compactAvatar: { width: 48, height: 48, borderRadius: 24 },
  info: { flex: 1 },
  name: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 2,
  },
  lang: { fontSize: 12, fontFamily: "Inter_400Regular", marginBottom: 4 },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  rating: { fontSize: 12, fontFamily: "Inter_500Medium" },
  avail: { fontSize: 12, fontFamily: "Inter_400Regular" },
  rate: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  fav: { padding: 4 },
});
