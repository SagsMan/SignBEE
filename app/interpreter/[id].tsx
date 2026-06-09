import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import PrimaryButton from "@/components/PrimaryButton";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const REVIEWS = [
  {
    id: "r1",
    author: "Aminat K.",
    rating: 5,
    comment: "Excellent interpreter! Very professional and patient.",
    date: "Nov 2024",
  },
  {
    id: "r2",
    author: "Tunde O.",
    rating: 4,
    comment: "Great experience. Arrived on time and communicated clearly.",
    date: "Oct 2024",
  },
  {
    id: "r3",
    author: "Chioma N.",
    rating: 5,
    comment: "Made the medical appointment much less stressful.",
    date: "Sep 2024",
  },
];

export default function InterpreterDetailScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { interpreters } = useApp();
  const [isFavorite, setIsFavorite] = useState(false);

  const interpreter = interpreters.find(i => i.id === id);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom + 16;

  if (!interpreter) {
    return (
      <View
        style={[
          styles.center,
          { backgroundColor: colors.background, paddingTop: topPad },
        ]}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.notFound, { color: colors.mutedForeground }]}>
          Interpreter not found
        </Text>
      </View>
    );
  }

  const handleBook = () => {
    router.push({
      pathname: "/booking",
      params: { interpreterId: interpreter.id },
    });
  };

  const handleMessage = () => {
    Alert.alert("Messages", "Messaging feature coming soon!");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.topBar, { paddingTop: topPad + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.topBarTitle, { color: colors.foreground }]}>
          Interpreter Profile
        </Text>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => setIsFavorite(v => !v)}
        >
          <Feather
            name="heart"
            size={22}
            color={isFavorite ? colors.primary : colors.foreground}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: bottomPad + 100 },
        ]}
      >
        <View style={styles.heroCard}>
          <View
            style={[styles.avatar, { backgroundColor: colors.greenLight }]}
          >
            <Feather name="user" size={44} color={colors.navyDark} />
          </View>
          <Text style={[styles.interpreterName, { color: colors.navyDark }]}>
            {interpreter.name}
          </Text>
          <Text style={[styles.interpreterType, { color: colors.mutedForeground }]}>
            {interpreter.languages.join(", ")} · {interpreter.type}
          </Text>
          <View style={styles.ratingRow}>
            {[1, 2, 3, 4, 5].map(s => (
              <Feather
                key={s}
                name="star"
                size={18}
                color={s <= Math.round(interpreter.rating) ? colors.star : colors.border}
              />
            ))}
            <Text style={[styles.ratingText, { color: colors.foreground }]}>
              {" "}
              {interpreter.rating} ({interpreter.reviews} reviews)
            </Text>
          </View>
        </View>

        <View style={styles.infoCards}>
          <InfoBadge
            icon="dollar-sign"
            label="Rate"
            value={`$${interpreter.rate}/hr`}
            colors={colors}
          />
          <InfoBadge
            icon="clock"
            label="Available"
            value={interpreter.availability}
            colors={colors}
          />
          {interpreter.location ? (
            <InfoBadge
              icon="map-pin"
              label="Location"
              value={interpreter.location}
              colors={colors}
            />
          ) : null}
        </View>

        <View
          style={[
            styles.section,
            { backgroundColor: colors.muted, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.navyDark }]}>
            About
          </Text>
          <Text style={[styles.bio, { color: colors.foreground }]}>
            {interpreter.bio}
          </Text>
        </View>

        <View style={styles.langSection}>
          <Text style={[styles.sectionTitle, { color: colors.navyDark }]}>
            Languages
          </Text>
          <View style={styles.langChips}>
            {interpreter.languages.map(l => (
              <View
                key={l}
                style={[
                  styles.langChip,
                  { backgroundColor: colors.greenLight },
                ]}
              >
                <Text style={[styles.langChipText, { color: colors.navyDark }]}>
                  {l}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.reviewsSection}>
          <Text style={[styles.sectionTitle, { color: colors.navyDark }]}>
            Reviews
          </Text>
          {REVIEWS.map(r => (
            <View
              key={r.id}
              style={[
                styles.reviewCard,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                },
              ]}
            >
              <View style={styles.reviewHeader}>
                <View
                  style={[
                    styles.reviewAvatar,
                    { backgroundColor: colors.muted },
                  ]}
                >
                  <Text
                    style={[styles.reviewAvatarText, { color: colors.navyDark }]}
                  >
                    {r.author.charAt(0)}
                  </Text>
                </View>
                <View>
                  <Text
                    style={[styles.reviewAuthor, { color: colors.foreground }]}
                  >
                    {r.author}
                  </Text>
                  <Text
                    style={[styles.reviewDate, { color: colors.mutedForeground }]}
                  >
                    {r.date}
                  </Text>
                </View>
                <View style={styles.reviewStars}>
                  {[1, 2, 3, 4, 5].map(s => (
                    <Feather
                      key={s}
                      name="star"
                      size={12}
                      color={s <= r.rating ? colors.star : colors.border}
                    />
                  ))}
                </View>
              </View>
              <Text style={[styles.reviewComment, { color: colors.foreground }]}>
                {r.comment}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View
        style={[
          styles.bottomBar,
          {
            paddingBottom: bottomPad,
            borderTopColor: colors.border,
            backgroundColor: colors.background,
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.msgBtn, { borderColor: colors.navyDark }]}
          onPress={handleMessage}
          activeOpacity={0.8}
        >
          <Feather name="message-circle" size={20} color={colors.navyDark} />
        </TouchableOpacity>
        <PrimaryButton
          title="Book Interpreter"
          onPress={handleBook}
          style={styles.bookBtn}
        />
      </View>
    </View>
  );
}

function InfoBadge({
  icon,
  label,
  value,
  colors,
}: {
  icon: string;
  label: string;
  value: string;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View
      style={[
        styles.infoBadge,
        { backgroundColor: colors.muted, borderColor: colors.border },
      ]}
    >
      <Feather name={icon as any} size={16} color={colors.navyDark} />
      <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>
        {label}
      </Text>
      <Text style={[styles.infoValue, { color: colors.navyDark }]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, paddingHorizontal: 20 },
  backBtn: { width: 40, height: 40, justifyContent: "center" },
  notFound: { fontSize: 16, fontFamily: "Inter_400Regular", marginTop: 24 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  topBarTitle: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
  content: { paddingHorizontal: 20 },
  heroCard: { alignItems: "center", paddingVertical: 24, gap: 8 },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  interpreterName: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
  },
  interpreterType: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  ratingRow: { flexDirection: "row", alignItems: "center" },
  ratingText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  infoCards: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 20 },
  infoBadge: {
    flex: 1,
    minWidth: 100,
    alignItems: "center",
    gap: 4,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  infoLabel: { fontSize: 11, fontFamily: "Inter_400Regular" },
  infoValue: { fontSize: 13, fontFamily: "Inter_600SemiBold", textAlign: "center" },
  section: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    marginBottom: 8,
  },
  bio: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22 },
  langSection: { marginBottom: 20 },
  langChips: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 },
  langChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  langChipText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  reviewsSection: { marginBottom: 20 },
  reviewCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginTop: 10,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  reviewAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  reviewAvatarText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  reviewAuthor: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  reviewDate: { fontSize: 11, fontFamily: "Inter_400Regular" },
  reviewStars: { flexDirection: "row", marginLeft: "auto", gap: 2 },
  reviewComment: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    gap: 12,
  },
  msgBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  bookBtn: { flex: 1 },
});
