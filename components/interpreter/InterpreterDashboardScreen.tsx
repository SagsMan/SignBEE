import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import {
  EmptyState,
  formatCurrency,
  InterpreterCard,
  InterpreterScreen,
  SectionLabel,
  StatTile,
  StatusPill,
} from "@/components/interpreter/InterpreterShared";

export default function InterpreterDashboardScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    user,
    bookings,
    interpreterProfile,
    interpreterEarnings,
    updateInterpreterAvailability,
    unreadNotificationCount,
  } = useApp();

  const jobs = bookings
    .filter(booking => booking.interpreterId === interpreterProfile.id)
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
  const pendingJobs = jobs.filter(job => (job.interpreterStatus || "pending") === "pending");
  const upcomingJobs = jobs.filter(
    job => job.status === "upcoming" && job.interpreterStatus === "accepted",
  );
  const completedJobs = jobs.filter(job => job.status === "completed");
  const availableEarnings = interpreterEarnings
    .filter(item => item.status === "available" || item.status === "paid")
    .reduce((total, item) => total + item.amount, 0);
  const nextJob = upcomingJobs[0];
  const firstName = (interpreterProfile.name || user?.name || "there").split(" ")[0];

  const toggleAvailability = async () => {
    await updateInterpreterAvailability({
      ...interpreterProfile.availability,
      isAvailableNow: !interpreterProfile.availability.isAvailableNow,
    });
  };

  return (
    <InterpreterScreen
      title={`Welcome back, ${firstName}`}
      subtitle="Keep your profile ready for the next conversation."
      action={
        <TouchableOpacity
          style={[styles.notificationButton, { backgroundColor: colors.muted }]}
          onPress={() => router.push("/notification-center")}
          accessibilityLabel="Open notifications"
        >
          <Feather name="bell" size={19} color={colors.navyDark} />
          {unreadNotificationCount > 0 ? (
            <View style={[styles.notificationDot, { backgroundColor: colors.destructive }]} />
          ) : null}
        </TouchableOpacity>
      }
    >
      <View style={[styles.availabilityCard, { backgroundColor: colors.navyDark }]}>
        <View style={[styles.availabilityIcon, { backgroundColor: colors.primary }]}>
          <Feather name="radio" size={20} color={colors.navyDark} />
        </View>
        <View style={styles.availabilityCopy}>
          <Text style={[styles.availabilityTitle, { color: "#FFFFFF" }]}>
            {interpreterProfile.availability.isAvailableNow ? "You are available" : "You are offline"}
          </Text>
          <Text style={[styles.availabilityText, { color: "#FFFFFF" }]}>
            {interpreterProfile.availability.isAvailableNow
              ? "Clients can find you for new bookings."
              : "Turn on availability when you are ready for work."}
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.availabilityToggle,
            { backgroundColor: interpreterProfile.availability.isAvailableNow ? colors.primary : colors.muted },
          ]}
          onPress={toggleAvailability}
          accessibilityLabel="Toggle availability"
        >
          <View
            style={[
              styles.toggleKnob,
              {
                backgroundColor: interpreterProfile.availability.isAvailableNow
                  ? colors.navyDark
                  : colors.mutedForeground,
                transform: [{ translateX: interpreterProfile.availability.isAvailableNow ? 9 : -9 }],
              },
            ]}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        <StatTile label="Pending jobs" value={String(pendingJobs.length)} icon="inbox" accent={colors.star} />
        <StatTile label="Upcoming" value={String(upcomingJobs.length)} icon="calendar" accent="#3B82F6" />
        <StatTile label="Completed" value={String(completedJobs.length)} icon="check-circle" accent={colors.success} />
      </View>

      <TouchableOpacity
        style={[styles.earningsCard, { backgroundColor: colors.greenLight }]}
        onPress={() => router.push("/interpreter/earnings")}
      >
        <View>
          <Text style={[styles.eyebrow, { color: colors.mutedForeground }]}>Available earnings</Text>
          <Text style={[styles.earningsAmount, { color: colors.navyDark }]}>{formatCurrency(availableEarnings)}</Text>
          <Text style={[styles.earningsMeta, { color: colors.mutedForeground }]}>
            {interpreterEarnings.length} transaction{interpreterEarnings.length === 1 ? "" : "s"} recorded
          </Text>
        </View>
        <View style={[styles.arrowCircle, { backgroundColor: colors.navyDark }]}>
          <Feather name="arrow-up-right" size={18} color={colors.primary} />
        </View>
      </TouchableOpacity>

      <SectionLabel
        action={
          <TouchableOpacity onPress={() => router.push("/interpreter/jobs")}>
            <Text style={[styles.seeAll, { color: colors.mutedForeground }]}>See all</Text>
          </TouchableOpacity>
        }
      >
        Pending requests
      </SectionLabel>
      {pendingJobs.length === 0 ? (
        <EmptyState
          icon="inbox"
          title="No pending requests"
          description="New client bookings will appear here when they are ready for your response."
          action={
            <TouchableOpacity
              style={[styles.outlineButton, { borderColor: colors.border }]}
              onPress={() => router.push("/interpreter/availability")}
            >
              <Text style={[styles.outlineButtonText, { color: colors.navyDark }]}>Manage availability</Text>
            </TouchableOpacity>
          }
        />
      ) : (
        pendingJobs.slice(0, 2).map(job => (
          <InterpreterCard key={job.id} onPress={() => router.push({ pathname: "/interpreter/job/[id]", params: { id: job.id } })}>
            <View style={styles.jobHeader}>
              <View style={[styles.clientAvatar, { backgroundColor: colors.greenLight }]}>
                <Text style={[styles.clientInitial, { color: colors.navyDark }]}>
                  {(job.clientName || "C").charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.jobCopy}>
                <Text style={[styles.jobTitle, { color: colors.foreground }]}>{job.clientName || "New client request"}</Text>
                <Text style={[styles.jobMeta, { color: colors.mutedForeground }]}>
                  {job.language} · {job.type} · {job.duration}
                </Text>
              </View>
              <StatusPill label="Pending" tone="warning" />
            </View>
            <View style={styles.jobFooter}>
              <Text style={[styles.jobDate, { color: colors.foreground }]}>
                {job.date} · {job.time}
              </Text>
              <Text style={[styles.jobRate, { color: colors.navyDark }]}>{formatCurrency(job.rate)}</Text>
            </View>
          </InterpreterCard>
        ))
      )}

      <SectionLabel>Next confirmed job</SectionLabel>
      {nextJob ? (
        <InterpreterCard onPress={() => router.push({ pathname: "/interpreter/job/[id]", params: { id: nextJob.id } })}>
          <View style={styles.jobHeader}>
            <View style={[styles.clientAvatar, { backgroundColor: colors.muted }]}>
              <Feather name={nextJob.type === "Virtual" ? "video" : "map-pin"} size={19} color={colors.navyDark} />
            </View>
            <View style={styles.jobCopy}>
              <Text style={[styles.jobTitle, { color: colors.foreground }]}>{nextJob.clientName || "Confirmed booking"}</Text>
              <Text style={[styles.jobMeta, { color: colors.mutedForeground }]}>{nextJob.language} · {nextJob.type}</Text>
            </View>
            <StatusPill label="Confirmed" tone="success" />
          </View>
          <Text style={[styles.nextJobDate, { color: colors.navyDark }]}>{nextJob.date} · {nextJob.time}</Text>
        </InterpreterCard>
      ) : (
        <EmptyState
          icon="calendar"
          title="Nothing booked yet"
          description="Accepted jobs will show up here with the client and appointment details."
        />
      )}
      <View style={{ height: insets.bottom > 0 ? 2 : 0 }} />
    </InterpreterScreen>
  );
}

const styles = StyleSheet.create({
  notificationButton: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  notificationDot: { position: "absolute", top: 8, right: 9, width: 7, height: 7, borderRadius: 4 },
  availabilityCard: { marginHorizontal: 20, borderRadius: 20, padding: 16, flexDirection: "row", alignItems: "center", marginBottom: 14 },
  availabilityIcon: { width: 42, height: 42, borderRadius: 15, alignItems: "center", justifyContent: "center", marginRight: 12 },
  availabilityCopy: { flex: 1 },
  availabilityTitle: { fontSize: 15, fontFamily: "Inter_700Bold", marginBottom: 3 },
  availabilityText: { fontSize: 11, lineHeight: 16, fontFamily: "Inter_400Regular", opacity: 0.78 },
  availabilityToggle: { width: 42, height: 25, borderRadius: 14, alignItems: "center", justifyContent: "center", flexDirection: "row" },
  toggleKnob: { width: 17, height: 17, borderRadius: 9 },
  statsRow: { flexDirection: "row", gap: 9, marginHorizontal: 20, marginBottom: 14 },
  earningsCard: { marginHorizontal: 20, marginBottom: 21, borderRadius: 18, padding: 17, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  eyebrow: { fontSize: 11, fontFamily: "Inter_500Medium", marginBottom: 4 },
  earningsAmount: { fontSize: 25, fontFamily: "Inter_700Bold", marginBottom: 3 },
  earningsMeta: { fontSize: 11, fontFamily: "Inter_400Regular" },
  arrowCircle: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  seeAll: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  outlineButton: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, marginTop: 6 },
  outlineButtonText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  jobHeader: { flexDirection: "row", alignItems: "center" },
  clientAvatar: { width: 43, height: 43, borderRadius: 15, alignItems: "center", justifyContent: "center", marginRight: 11 },
  clientInitial: { fontSize: 17, fontFamily: "Inter_700Bold" },
  jobCopy: { flex: 1, paddingRight: 7 },
  jobTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold", marginBottom: 4 },
  jobMeta: { fontSize: 11, fontFamily: "Inter_400Regular" },
  jobFooter: { borderTopWidth: 1, borderTopColor: "#00000010", marginTop: 14, paddingTop: 12, flexDirection: "row", justifyContent: "space-between" },
  jobDate: { fontSize: 12, fontFamily: "Inter_500Medium" },
  jobRate: { fontSize: 13, fontFamily: "Inter_700Bold" },
  nextJobDate: { fontSize: 13, fontFamily: "Inter_600SemiBold", marginTop: 14 },
});