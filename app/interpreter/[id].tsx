import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
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

type DetailTab = "About" | "Availability" | "Reviews";

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
  const {
    interpreters,
    favoriteInterpreterIds,
    toggleFavorite,
  } = useApp();
  const [activeTab, setActiveTab] = useState<DetailTab>("About");

  const interpreter = interpreters.find(item => item.id === id);
  const topPad = Platform.OS === "web" ? 20 : insets.top;
  const bottomPad = Platform.OS === "web" ? 24 : insets.bottom + 12;

  if (!interpreter) {
    return (
      <View
        style={[
          styles.notFound,
          { backgroundColor: colors.background, paddingTop: topPad },
        ]}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.notFoundText, { color: colors.mutedForeground }]}>
          Interpreter not found
        </Text>
      </View>
    );
  }

  const isFavorite = favoriteInterpreterIds.includes(interpreter.id);
  const avatarSource =
    interpreter.avatar === "male"
      ? require("@/assets/images/interpreter_male.png")
      : require("@/assets/images/interpreter_female.png");

  return (
    <View style={[styles.container, { backgroundColor: colors.muted }]}>
      <View
        style={[
          styles.heroHeader,
          { backgroundColor: colors.primary, paddingTop: topPad + 4 },
        ]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.headerButton}
          accessibilityLabel="Go back"
        >
          <Feather name="arrow-left" size={22} color={colors.navyDark} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => toggleFavorite(interpreter.id)}
          style={styles.headerButton}
          accessibilityLabel={isFavorite ? "Remove favorite" : "Add favorite"}
        >
          <Feather
            name="heart"
            size={22}
            color={colors.navyDark}
            fill={isFavorite ? colors.navyDark : "transparent"}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: bottomPad + 84 },
        ]}
      >
        <View
          style={[
            styles.profileCard,
            { backgroundColor: colors.background },
          ]}
        >
          <Image source={avatarSource} style={styles.profileImage} />
          <Text style={[styles.profileName, { color: colors.navyDark }]}>
            {interpreter.name}
          </Text>
          <View style={styles.ratingRow}>
            <Feather
              name="star"
              size={16}
              color={colors.star}
              fill={colors.star}
            />
            <Text style={[styles.ratingText, { color: colors.foreground }]}>
              {" "}
              {interpreter.rating.toFixed(1)} ({interpreter.reviews} reviews)
            </Text>
          </View>
          <View style={styles.statRow}>
            <ProfileStat
              label="Hourly Rate"
              value={`₦${interpreter.rate.toLocaleString()}`}
              colors={colors}
            />
            <ProfileStat
              label="Experience"
              value={`${interpreter.experienceYears} years`}
              colors={colors}
            />
            <ProfileStat
              label="Bookings"
              value={`${interpreter.bookingsCount}+`}
              colors={colors}
            />
          </View>
        </View>

        <View
          style={[
            styles.tabs,
            { backgroundColor: colors.background },
          ]}
        >
          {(["About", "Availability", "Reviews"] as DetailTab[]).map(tab => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                activeTab === tab && { backgroundColor: colors.greenLight },
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  {
                    color:
                      activeTab === tab
                        ? colors.navyDark
                        : colors.foreground,
                  },
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === "About" ? (
          <AboutPanel interpreter={interpreter} colors={colors} />
        ) : activeTab === "Availability" ? (
          <AvailabilityPanel interpreter={interpreter} colors={colors} />
        ) : (
          <ReviewsPanel colors={colors} />
        )}
      </ScrollView>

      <View
        style={[
          styles.bottomBar,
          {
            paddingBottom: bottomPad,
            backgroundColor: colors.background,
            borderTopColor: colors.border,
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.messageButton, { borderColor: colors.navyDark }]}
          onPress={() =>
            Alert.alert("Messages", "Messaging will be available in Phase 5.")
          }
          accessibilityLabel="Message interpreter"
        >
          <Feather name="message-circle" size={20} color={colors.navyDark} />
        </TouchableOpacity>
        <PrimaryButton
          title="Book Now"
          onPress={() =>
            router.push({
              pathname: "/booking",
              params: { interpreterId: interpreter.id },
            })
          }
          style={styles.bookButton}
        />
      </View>
    </View>
  );
}

function ProfileStat({
  label,
  value,
  colors,
}: {
  label: string;
  value: string;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={styles.stat}>
      <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
        {label}
      </Text>
      <Text style={[styles.statValue, { color: colors.foreground }]}>
        {value}
      </Text>
    </View>
  );
}

function AboutPanel({
  interpreter,
  colors,
}: {
  interpreter: NonNullable<ReturnType<typeof useApp>["interpreters"]>[number];
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={[styles.panel, { backgroundColor: colors.background }]}>
      <Text style={[styles.panelTitle, { color: colors.foreground }]}>Bio</Text>
      <Text style={[styles.bio, { color: colors.mutedForeground }]}>
        {interpreter.bio}
      </Text>

      <DetailSection
        icon="book-open"
        title="Specialties"
        colors={colors}
        content={
          <View style={styles.chipRow}>
            {interpreter.specialties.map(specialty => (
              <View
                key={specialty}
                style={[styles.chip, { backgroundColor: colors.muted }]}
              >
                <Text style={[styles.chipText, { color: colors.foreground }]}>
                  {specialty}
                </Text>
              </View>
            ))}
          </View>
        }
      />

      <DetailSection
        icon="globe"
        title="Languages"
        colors={colors}
        content={
          <View style={styles.chipColumn}>
            {interpreter.languages.map(language => (
              <View
                key={language}
                style={[styles.languageChip, { backgroundColor: colors.muted }]}
              >
                <Text style={[styles.chipText, { color: colors.foreground }]}>
                  {language}
                </Text>
              </View>
            ))}
          </View>
        }
      />

      <DetailSection
        icon="award"
        title="Certifications"
        colors={colors}
        content={
          <View style={styles.certificationList}>
            {interpreter.certifications.map(certification => (
              <View key={certification} style={styles.certificationRow}>
                <Feather name="check" size={15} color={colors.success} />
                <Text
                  style={[
                    styles.certificationText,
                    { color: colors.foreground },
                  ]}
                >
                  {certification}
                </Text>
              </View>
            ))}
          </View>
        }
      />
    </View>
  );
}

function AvailabilityPanel({
  interpreter,
  colors,
}: {
  interpreter: NonNullable<ReturnType<typeof useApp>["interpreters"]>[number];
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={[styles.panel, { backgroundColor: colors.background }]}>
      <Text style={[styles.panelTitle, { color: colors.foreground }]}>
        Availability
      </Text>
      <View
        style={[
          styles.availabilityBadge,
          {
            backgroundColor: interpreter.isAvailable
              ? colors.greenLight
              : colors.muted,
          },
        ]}
      >
        <View
          style={[
            styles.statusDot,
            {
              backgroundColor: interpreter.isAvailable
                ? colors.success
                : colors.mutedForeground,
            },
          ]}
        />
        <Text style={[styles.availabilityText, { color: colors.foreground }]}>
          {interpreter.isAvailable ? "Available now" : "Currently unavailable"}
        </Text>
      </View>
      <View style={[styles.scheduleCard, { backgroundColor: colors.muted }]}>
        <Feather name="clock" size={18} color={colors.navyDark} />
        <View>
          <Text style={[styles.scheduleLabel, { color: colors.mutedForeground }]}>
            Regular availability
          </Text>
          <Text style={[styles.scheduleValue, { color: colors.foreground }]}>
            {interpreter.availability}
          </Text>
        </View>
      </View>
      <Text style={[styles.availabilityNote, { color: colors.mutedForeground }]}>
        Availability is shown in your local time. Confirm a time during booking.
      </Text>
    </View>
  );
}

function ReviewsPanel({
  colors,
}: {
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={styles.reviewsSection}>
      {REVIEWS.map(review => (
        <View
          key={review.id}
          style={[
            styles.reviewCard,
            { backgroundColor: colors.background, borderColor: colors.border },
          ]}
        >
          <View style={styles.reviewHeader}>
            <View style={[styles.reviewAvatar, { backgroundColor: colors.muted }]}>
              <Text style={[styles.reviewAvatarText, { color: colors.navyDark }]}>
                {review.author.charAt(0)}
              </Text>
            </View>
            <View>
              <Text style={[styles.reviewAuthor, { color: colors.foreground }]}>
                {review.author}
              </Text>
              <Text style={[styles.reviewDate, { color: colors.mutedForeground }]}>
                {review.date}
              </Text>
            </View>
            <View style={styles.reviewStars}>
              {[1, 2, 3, 4, 5].map(star => (
                <Feather
                  key={star}
                  name="star"
                  size={12}
                  color={star <= review.rating ? colors.star : colors.border}
                  fill={star <= review.rating ? colors.star : "transparent"}
                />
              ))}
            </View>
          </View>
          <Text style={[styles.reviewComment, { color: colors.foreground }]}>
            {review.comment}
          </Text>
        </View>
      ))}
    </View>
  );
}

function DetailSection({
  icon,
  title,
  content,
  colors,
}: {
  icon: string;
  title: string;
  content: React.ReactNode;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={styles.detailSection}>
      <View style={styles.sectionLabel}>
        <Feather name={icon as any} size={20} color={colors.success} />
        <Text style={[styles.sectionLabelText, { color: colors.foreground }]}>
          {title}
        </Text>
      </View>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  notFound: { flex: 1, paddingHorizontal: 20 },
  backButton: { width: 40, height: 40, justifyContent: "center" },
  notFoundText: { fontSize: 16, fontFamily: "Inter_400Regular", marginTop: 24 },
  heroHeader: {
    height: 128,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  content: { paddingHorizontal: 20, marginTop: -58 },
  profileCard: {
    borderRadius: 16,
    alignItems: "center",
    paddingTop: 48,
    paddingBottom: 20,
    paddingHorizontal: 14,
  },
  profileImage: {
    position: "absolute",
    top: -48,
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  profileName: {
    fontSize: 21,
    fontFamily: "Inter_700Bold",
    marginBottom: 4,
  },
  ratingRow: { flexDirection: "row", alignItems: "center", marginBottom: 24 },
  ratingText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  statRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
  },
  stat: { alignItems: "center", minWidth: 86 },
  statLabel: { fontSize: 11, fontFamily: "Inter_400Regular", marginBottom: 4 },
  statValue: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  tabs: {
    borderRadius: 14,
    flexDirection: "row",
    padding: 5,
    marginTop: 28,
    marginBottom: 20,
  },
  tab: { flex: 1, borderRadius: 9, alignItems: "center", paddingVertical: 10 },
  tabText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  panel: { borderRadius: 16, padding: 18, marginBottom: 20 },
  panelTitle: { fontSize: 16, fontFamily: "Inter_700Bold", marginBottom: 8 },
  bio: { fontSize: 14, lineHeight: 22, fontFamily: "Inter_400Regular" },
  detailSection: { marginTop: 22 },
  sectionLabel: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 },
  sectionLabelText: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { borderRadius: 18, paddingHorizontal: 14, paddingVertical: 8 },
  chipText: { fontSize: 12, fontFamily: "Inter_400Regular" },
  chipColumn: { gap: 8 },
  languageChip: {
    alignSelf: "flex-start",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  certificationList: { gap: 10 },
  certificationRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  certificationText: { fontSize: 13, fontFamily: "Inter_400Regular" },
  availabilityBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  availabilityText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  scheduleCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 12,
    padding: 14,
  },
  scheduleLabel: { fontSize: 11, fontFamily: "Inter_400Regular" },
  scheduleValue: { fontSize: 14, fontFamily: "Inter_600SemiBold", marginTop: 3 },
  availabilityNote: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: "Inter_400Regular",
    marginTop: 16,
  },
  reviewsSection: { marginBottom: 20 },
  reviewCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
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
    paddingTop: 14,
    borderTopWidth: 1,
    gap: 12,
  },
  messageButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  bookButton: { flex: 1 },
});