import { useRouter } from "expo-router";
import React, { useState, useRef } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import PrimaryButton from "@/components/PrimaryButton";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const { width } = Dimensions.get("window");

const SLIDES = [
  {
    id: "1",
    ring: require("@/assets/images/ring_green.png"),
    dot1: require("@/assets/images/dot_green1.png"),
    dot2: require("@/assets/images/dot_green2.png"),
    character: require("@/assets/images/onboard1.png"),
    title: "Build a More Inclusive World",
    subtitle:
      "Connect with certified interpreters and bridge communication gaps instantly.",
  },
  {
    id: "2",
    ring: require("@/assets/images/ring_yellow.png"),
    dot1: require("@/assets/images/dot_yellow1.png"),
    dot2: require("@/assets/images/dot_yellow2.png"),
    character: require("@/assets/images/onboard2.png"),
    title: "Feel Seen and Included",
    subtitle:
      "Easily book interpreters for events, work, or everyday needs with just a few taps.",
  },
  {
    id: "3",
    ring: require("@/assets/images/ring_blue.png"),
    dot1: require("@/assets/images/dot_blue1.png"),
    dot2: require("@/assets/images/dot_blue2.png"),
    character: require("@/assets/images/onboard3.png"),
    title: "Anytime. Anywhere. For Everyone.",
    subtitle:
      "Virtual or in-person — find the right interpreter for every occasion.",
  },
];

export default function OnboardingScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { setHasOnboarded } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const topPad = Platform.OS === "web" ? 20 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      handleSkip();
    }
  };

  const handleSkip = async () => {
    await setHasOnboarded(true);
    router.replace("/role");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.topBar, { paddingTop: topPad + 16 }]}>
        <Text style={[styles.logo, { color: colors.navyDark }]}>SignBee</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        onMomentumScrollEnd={e => {
          const idx = Math.round(
            e.nativeEvent.contentOffset.x / width,
          );
          setCurrentIndex(idx);
        }}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <View style={styles.imageArea}>
              <Image
                source={item.ring}
                style={styles.ring}
                resizeMode="contain"
              />
              <Image
                source={item.dot1}
                style={styles.dot1}
                resizeMode="contain"
              />
              <Image
                source={item.dot2}
                style={styles.dot2}
                resizeMode="contain"
              />
              <Image
                source={item.character}
                style={styles.character}
                resizeMode="contain"
              />
            </View>
            <View style={styles.textArea}>
              <Text style={[styles.title, { color: colors.navyDark }]}>
                {item.title}
              </Text>
              <Text
                style={[styles.subtitle, { color: colors.mutedForeground }]}
              >
                {item.subtitle}
              </Text>
            </View>
          </View>
        )}
      />

      <View style={[styles.footer, { paddingBottom: bottomPad + 16 }]}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    i === currentIndex ? colors.navyDark : colors.border,
                  width: i === currentIndex ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity onPress={handleSkip} style={styles.skipBtn}>
            <Text style={[styles.skipText, { color: colors.mutedForeground }]}>
              Skip
            </Text>
          </TouchableOpacity>
          <PrimaryButton
            title={currentIndex === SLIDES.length - 1 ? "Get Started" : "Next"}
            onPress={handleNext}
            style={styles.nextBtn}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: { alignItems: "center", paddingBottom: 8 },
  logo: { fontSize: 20, fontFamily: "Inter_700Bold" },
  slide: { flex: 1 },
  imageArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  ring: { position: "absolute", width: 230, height: 230 },
  dot1: {
    position: "absolute",
    top: "15%",
    right: "12%",
    width: 26,
    height: 26,
  },
  dot2: {
    position: "absolute",
    bottom: "15%",
    left: "10%",
    width: 34,
    height: 34,
  },
  character: { width: 200, height: 200, zIndex: 1 },
  textArea: {
    paddingHorizontal: 32,
    paddingBottom: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 22,
  },
  footer: { paddingHorizontal: 24, paddingTop: 16 },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    marginBottom: 24,
  },
  dot: { height: 8, borderRadius: 4 },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  skipBtn: { padding: 12 },
  skipText: { fontSize: 15, fontFamily: "Inter_500Medium" },
  nextBtn: { minWidth: 120 },
});
