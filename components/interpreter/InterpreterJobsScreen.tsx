import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useApp, Booking } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import {
  EmptyState,
  formatCurrency,
  InterpreterCard,
  InterpreterScreen,
  StatusPill,
} from "@/components/interpreter/InterpreterShared";

type FilterKey = "all" | "pending" | "upcoming" | "completed" | "cancelled";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All jobs" },
  { key: "pending", label: "Pending" },
  { key: "upcoming", label: "Upcoming" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

function getTone(job: Booking): "success" | "warning" | "danger" | "neutral" {
  if (job.status === "completed") return "success";
  if (job.status === "cancelled" || job.interpreterStatus === "declined") return "danger";
  if (job.interpreterStatus === "pending") return "warning";
  return "neutral";
}

function getLabel(job: Booking) {
  if (job.interpreterStatus === "pending") return "Pending";
  if (job.interpreterStatus === "declined" || job.status === "cancelled") return "Cancelled";
  if (job.status === "completed") return "Completed";
  if (job.interpreterStatus === "accepted") return "Confirmed";
  return job.status.charAt(0).toUpperCase() + job.status.slice(1);
}

export default function InterpreterJobsScreen() {
  const colors = useColors();
  const router = useRouter();
  const { bookings, interpreterProfile } = useApp();
  const [filter, setFilter] = useState<FilterKey>("all");

  const jobs = useMemo(() => {
    const interpreterJobs = bookings.filter(job => job.interpreterId === interpreterProfile.id);
    return interpreterJobs.filter(job => {
      if (filter === "all") return true;
      if (filter === "pending") return job.interpreterStatus === "pending" || !job.interpreterStatus;
      if (filter === "upcoming") return job.status === "upcoming" && job.interpreterStatus === "accepted";
      if (filter === "completed") return job.status === "completed";
      return job.status === "cancelled" || job.interpreterStatus === "declined";
    });
  }, [bookings, filter, interpreterProfile.id]);

  return (
    <InterpreterScreen title="Jobs" subtitle="Review requests and keep your confirmed work moving.">
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        {FILTERS.map(item => {
          const active = filter === item.key;
          return (
            <TouchableOpacity
              key={item.key}
              style={[
                styles.filter,
                { borderColor: active ? colors.navyDark : colors.border, backgroundColor: active ? colors.navyDark : colors.background },
              ]}
              onPress={() => setFilter(item.key)}
            >
              <Text style={[styles.filterText, { color: active ? colors.primary : colors.foreground }]}>{item.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <Text style={[styles.resultCount, { color: colors.mutedForeground }]}>
        {jobs.length} {jobs.length === 1 ? "job" : "jobs"}
      </Text>

      {jobs.length === 0 ? (
        <EmptyState
          icon={filter === "completed" ? "check-circle" : "briefcase"}
          title={`No ${filter === "all" ? "" : filter} jobs yet`}
          description={
            filter === "pending"
              ? "New requests from clients will appear here."
              : "Jobs will appear here as your SignBee work grows."
          }
        />
      ) : (
        jobs.map(job => (
          <InterpreterCard
            key={job.id}
            onPress={() => router.push({ pathname: "/interpreter/job/[id]", params: { id: job.id } })}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.avatar, { backgroundColor: colors.greenLight }]}>
                <Text style={[styles.avatarText, { color: colors.navyDark }]}>
                  {(job.clientName || "C").charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.copy}>
                <Text style={[styles.clientName, { color: colors.foreground }]}>{job.clientName || "SignBee client"}</Text>
                <Text style={[styles.service, { color: colors.mutedForeground }]}>
                  {job.language} interpretation · {job.type}
                </Text>
              </View>
              <StatusPill label={getLabel(job)} tone={getTone(job)} />
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.details}>
              <View style={styles.detail}>
                <Feather name="calendar" size={14} color={colors.mutedForeground} />
                <Text style={[styles.detailText, { color: colors.foreground }]}>{job.date}</Text>
              </View>
              <View style={styles.detail}>
                <Feather name="clock" size={14} color={colors.mutedForeground} />
                <Text style={[styles.detailText, { color: colors.foreground }]}>{job.time} · {job.duration}</Text>
              </View>
              <View style={styles.detail}>
                <Feather name={job.type === "Virtual" ? "video" : "map-pin"} size={14} color={colors.mutedForeground} />
                <Text style={[styles.detailText, { color: colors.foreground }]} numberOfLines={1}>
                  {job.type === "Virtual" ? job.venue || "Remote session" : job.location || "Location to be confirmed"}
                </Text>
              </View>
            </View>
            <View style={styles.cardFooter}>
              <Text style={[styles.purpose, { color: colors.mutedForeground }]}>{job.purpose || "Interpretation booking"}</Text>
              <Text style={[styles.rate, { color: colors.navyDark }]}>{formatCurrency(job.rate)}</Text>
            </View>
          </InterpreterCard>
        ))
      )}
    </InterpreterScreen>
  );
}

const styles = StyleSheet.create({
  filterRow: { paddingHorizontal: 20, gap: 8, paddingBottom: 17 },
  filter: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20, borderWidth: 1 },
  filterText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  resultCount: { marginHorizontal: 20, fontSize: 12, fontFamily: "Inter_500Medium", marginBottom: 10 },
  cardHeader: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 44, height: 44, borderRadius: 15, alignItems: "center", justifyContent: "center", marginRight: 11 },
  avatarText: { fontSize: 17, fontFamily: "Inter_700Bold" },
  copy: { flex: 1, paddingRight: 7 },
  clientName: { fontSize: 14, fontFamily: "Inter_600SemiBold", marginBottom: 4 },
  service: { fontSize: 11, fontFamily: "Inter_400Regular" },
  divider: { height: 1, marginVertical: 14 },
  details: { gap: 8 },
  detail: { flexDirection: "row", alignItems: "center", gap: 8 },
  detailText: { flex: 1, fontSize: 12, fontFamily: "Inter_400Regular" },
  cardFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 15 },
  purpose: { flex: 1, fontSize: 11, fontFamily: "Inter_400Regular" },
  rate: { fontSize: 13, fontFamily: "Inter_700Bold" },
});