import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Image, StyleSheet, View } from "react-native";

import { useApp } from "@/context/AppContext";

export default function SplashScreen() {
  const router = useRouter();
  const { isAuthenticated, hasOnboarded } = useApp();
  const scale = useRef(new Animated.Value(0.7)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      if (isAuthenticated) {
        router.replace("/(tabs)");
      } else if (hasOnboarded) {
        router.replace("/login");
      } else {
        router.replace("/onboarding");
      }
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.content, { opacity, transform: [{ scale }] }]}
      >
        <Image
          source={require("@/assets/images/icon.png")}
          style={styles.icon}
          resizeMode="contain"
        />
      </Animated.View>
      <View style={styles.circleDecor} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#AAFF00",
    alignItems: "center",
    justifyContent: "center",
  },
  content: { alignItems: "center" },
  icon: {
    width: 90,
    height: 90,
    marginBottom: 14,
  },
  circleDecor: {
    position: "absolute",
    bottom: 120,
    left: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.25)",
  },
});
