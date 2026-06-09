import * as Haptics from "expo-haptics";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

import { useColors } from "@/hooks/useColors";

interface Props {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "outline" | "ghost";
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function PrimaryButton({
  title,
  onPress,
  loading,
  disabled,
  variant = "primary",
  style,
  textStyle,
}: Props) {
  const colors = useColors();

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const bgColor =
    variant === "primary"
      ? colors.primary
      : "transparent";

  const txtColor =
    variant === "primary" ? colors.navyDark : colors.foreground;

  return (
    <TouchableOpacity
      style={[
        styles.btn,
        {
          backgroundColor: bgColor,
          borderWidth: variant === "outline" ? 1.5 : 0,
          borderColor: variant === "outline" ? colors.border : "transparent",
          opacity: disabled || loading ? 0.6 : 1,
        },
        style,
      ]}
      onPress={handlePress}
      activeOpacity={0.8}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={txtColor} size="small" />
      ) : (
        <Text style={[styles.text, { color: txtColor }, textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: 54,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  text: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
});
