import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

import { useColors } from "@/hooks/useColors";

interface Props extends TextInputProps {
  label: string;
  placeholder?: string;
  isPassword?: boolean;
  containerStyle?: ViewStyle;
  error?: string;
}

export default function InputField({
  label,
  placeholder,
  isPassword,
  containerStyle,
  error,
  ...rest
}: Props) {
  const colors = useColors();
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.label, { color: colors.foreground }]}>{label}</Text>
      <View
        style={[
          styles.inputWrap,
          {
            borderColor: focused ? colors.primary : colors.border,
            backgroundColor: colors.background,
          },
        ]}
      >
        <TextInput
          style={[styles.input, { color: colors.foreground }]}
          placeholder={placeholder}
          placeholderTextColor={colors.mutedForeground}
          secureTextEntry={isPassword && !showPassword}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...rest}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(v => !v)}
            style={styles.eyeBtn}
          >
            <Feather
              name={showPassword ? "eye" : "eye-off"}
              size={18}
              color={colors.mutedForeground}
            />
          </TouchableOpacity>
        )}
      </View>
      {error ? (
        <Text style={[styles.error, { color: colors.destructive }]}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { fontSize: 14, fontFamily: "Inter_500Medium", marginBottom: 8 },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
  },
  input: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular" },
  eyeBtn: { padding: 4 },
  error: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 4 },
});
