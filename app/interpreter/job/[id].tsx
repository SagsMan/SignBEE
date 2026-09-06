import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { BackButton, formatCurrency, InterpreterCard, InterpreterScreen, StatusPill } from "@/components/interpreter/InterpreterShared";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function InterpreterJobDetailsScreen() {
  const colors = useColors();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const {
    bookings,
    interpreterProfile,
    acceptInterpreterJob,
    declineInterpreterJob,
    completeInterpreterJob,
  } = useApp();
  const booking = bookings.find(item => item.id === id && item.interpreterId === interpreterProfile.id);

  if (!booking) {
    return (
      <InterpreterScreen title="Job details" action={<BackButton />}>
        <View style={styles.notFound}>
          <Feather name="search" size={30} color={colors.mutedForeground} />
          <Text style={[styles.notFoundTitle, { color: colors.navyDark }]}>Job not found</Text>
          <Text style={[styles.notFoundText, { color: colors.mutedForeground }]}>This booking may have been removed or is no longer assigned to you.</Text>
        </View>
      </InterpreterScreen>
    );
  }

  const isPending = booking.interpreterStatus === "pending" || !booking.interpreterStatus;
  const isAccepted = booking.interpreterStatus === "accepted" && booking.status !== "completed";
  const statusLabel = booking.status === "completed" ? "Completed" : isPending ? "Pending response" : isAccepted ? "Confirmed" : "Cancelled";
  const statusTone = booking.status === "completed" ? "success" : isPending ? "warning" : isAccepted ? "success" : "danger";

  const handleAccept = async () => {
    setLoading(true);
    try {
      await acceptInterpreterJob(booking.id);
      Alert.alert("Job accepted", "The client booking is now confirmed.", [{ text: "View jobs", onPress: () => router.replace("/interpreter/jobs") }]);
    } catch {
      Alert.alert("Unable to accept", "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = () => {
    Alert.alert("Decline this job?", "The client will no longer see this booking as available.", [
      { text: "Keep job", style: "cancel" },
      {
        text: "Decline",
        style: "destructive",
        onPress: async () => {
          await declineInterpreterJob(booking.id);
          router.replace("/interpreter/jobs");
        },
      },
    ]);
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      await completeInterpreterJob(booking.id);
      Alert.alert("Job completed", "The earning is now available in your earnings history.", [{ text: "Done", onPress: () => router.replace("/interpreter/jobs") }]);
    } catch {
      Alert.alert("Unable to complete", "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <InterpreterScreen title="Job details" action={<BackButton />}>
      <InterpreterCard>
        <View style={styles.detailHeader}>
          <View style={[styles.clientAvatar, { backgroundColor: colors.greenLight }]}>
            <Text style={[styles.clientInitial, { color: colors.navyDark }]}>{(booking.clientName || "C").charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.headerCopy}>
            <Text style={[styles.clientName, { color: colors.navyDark }]}>{booking.clientName || "SignBee client"}</Text>
            <Text style={[styles.service, { color: colors.mutedForeground }]}>{booking.purpose || "Interpretation booking"}</Text>
          </View>
          <StatusPill label={statusLabel} tone={statusTone} />
        </View>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <DetailRow icon="calendar" label="Date" value={booking.date} />
        <DetailRow icon="clock" label="Time & duration" value={`${booking.time} · ${booking.duration}`} />
        <DetailRow icon={booking.type === "Virtual" ? "video" : "map-pin"} label="Location" value={booking.type === "Virtual" ? booking.venue || "Remote session" : booking.location || "Location to be confirmed"} />
        <DetailRow icon="message-circle" label="Service" value={`${booking.language} · ${booking.type}`} />
      </InterpreterCard>

      {booking.notes ? (
        <InterpreterCard>
          <Text style={[styles.sectionLabel, { color: colors.navyDark }]}>Client notes</Text>
          <Text style={[styles.notes, { color: colors.foreground }]}>{booking.notes}</Text>
        </InterpreterCard>
      ) : null}

      <InterpreterCard>
        <Text style={[styles.sectionLabel, { color: colors.navyDark }]}>Payment</Text>
        <View style={styles.paymentRow}>
          <Text style={[styles.paymentLabel, { color: colors.mutedForeground }]}>Booking rate</Text>
          <Text style={[styles.paymentValue, { color: colors.navyDark }]}>{formatCurrency(booking.rate)}</Text>
        </View>
        <View style={styles.paymentRow}>
          <Text style={[styles.paymentLabel, { color: colors.mutedForeground }]}>Payment status</Text>
          <Text style={[styles.paymentValue, { color: colors.foreground }]}>{booking.paymentStatus === "paid" ? "Paid by client" : "Demo payment pending"}</Text>
        </View>
      </InterpreterCard>

      {isPending ? (
        <View style={styles.actions}>
          <TouchableOpacity style={[styles.secondaryButton, { borderColor: colors.destructive }]} onPress={handleDecline} disabled={loading}>
            <Text style={[styles.secondaryText, { color: colors.destructive }]}>Decline</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.primaryButton, { backgroundColor: colors.navyDark }]} onPress={handleAccept} disabled={loading}>
            <Text style={[styles.primaryText, { color: colors.primary }]}>{loading ? "Saving..." : "Accept job"}</Text>
          </TouchableOpacity>
        </View>
      ) : isAccepted ? (
        <TouchableOpacity style={[styles.fullButton, { backgroundColor: colors.navyDark }]} onPress={handleComplete} disabled={loading}>
          <Feather name="check-circle" size={17} color={colors.primary} />
          <Text style={[styles.primaryText, { color: colors.primary }]}>{loading ? "Saving..." : "Mark as completed"}</Text>
        </TouchableOpacity>
      ) : null}
    </InterpreterScreen>
  );
}

function DetailRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  const colors = useColors();
  return (
    <View style={styles.detailRow}>
      <View style={[styles.detailIcon, { backgroundColor: colors.muted }]}>
        <Feather name={icon as any} size={15} color={colors.navyDark} />
      </View>
      <View style={styles.detailCopy}>
        <Text style={[styles.detailLabel, { color: colors.mutedForeground }]}>{label}</Text>
        <Text style={[styles.detailValue, { color: colors.foreground }]}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  notFound: { margin: 20, minHeight: 260, borderRadius: 18, alignItems: "center", justifyContent: "center", gap: 10 },
  notFoundTitle: { fontSize: 17, fontFamily: "Inter_600SemiBold" },
  notFoundText: { maxWidth: 270, textAlign: "center", fontSize: 13, lineHeight: 19, fontFamily: "Inter_400Regular" },
  detailHeader: { flexDirection: "row", alignItems: "center" },
  clientAvatar: { width: 50, height: 50, borderRadius: 17, alignItems: "center", justifyContent: "center", marginRight: 12 },
  clientInitial: { fontSize: 20, fontFamily: "Inter_700Bold" },
  headerCopy: { flex: 1, paddingRight: 7 },
  clientName: { fontSize: 16, fontFamily: "Inter_700Bold", marginBottom: 4 },
  service: { fontSize: 12, fontFamily: "Inter_400Regular" },
  divider: { height: 1, marginVertical: 16 },
  detailRow: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
  detailIcon: { width: 34, height: 34, borderRadius: 11, alignItems: "center", justifyContent: "center", marginRight: 10 },
  detailCopy: { flex: 1 },
  detailLabel: { fontSize: 10, fontFamily: "Inter_400Regular", marginBottom: 3 },
  detailValue: { fontSize: 13, fontFamily: "Inter_500Medium" },
  sectionLabel: { fontSize: 15, fontFamily: "Inter_700Bold", marginBottom: 10 },
  notes: { fontSize: 13, lineHeight: 20, fontFamily: "Inter_400Regular" },
  paymentRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 },
  paymentLabel: { fontSize: 12, fontFamily: "Inter_400Regular" },
  paymentValue: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  actions: { marginHorizontal: 20, flexDirection: "row", gap: 10, marginTop: 1 },
  secondaryButton: { flex: 1, borderWidth: 1, borderRadius: 13, alignItems: "center", justifyContent: "center", paddingVertical: 14 },
  secondaryText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  primaryButton: { flex: 1, borderRadius: 13, alignItems: "center", justifyContent: "center", paddingVertical: 14 },
  fullButton: { marginHorizontal: 20, borderRadius: 13, paddingVertical: 14, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8 },
  primaryText: { fontSize: 13, fontFamily: "Inter_700Bold" },
});