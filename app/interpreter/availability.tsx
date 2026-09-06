import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AvailabilitySlot, useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { BackButton, InterpreterScreen } from "@/components/interpreter/InterpreterShared";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function InterpreterAvailabilityScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { interpreterProfile, updateInterpreterAvailability } = useApp();
  const [isAvailableNow, setIsAvailableNow] = useState(interpreterProfile.availability.isAvailableNow);
  const [slots, setSlots] = useState<AvailabilitySlot[]>(interpreterProfile.availability.slots);
  const [loading, setLoading] = useState(false);

  const addSlot = () => {
    setSlots(current => [
      ...current,
      { id: `slot-${Date.now()}`, day: DAYS[current.length % DAYS.length], start: "09:00", end: "17:00" },
    ]);
  };
  const updateSlot = (id: string, data: Partial<AvailabilitySlot>) => {
    setSlots(current => current.map(slot => slot.id === id ? { ...slot, ...data } : slot));
  };
  const save = async () => {
    if (slots.some(slot => !slot.day || !slot.start || !slot.end)) {
      Alert.alert("Check your schedule", "Each availability slot needs a day, start time, and end time.");
      return;
    }
    setLoading(true);
    await updateInterpreterAvailability({ ...interpreterProfile.availability, isAvailableNow, slots });
    setLoading(false);
    router.back();
  };

  return (
    <InterpreterScreen title="Availability" subtitle="Let clients know when you can take interpretation work." action={<BackButton />}>
      <KeyboardAwareScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 110 }} keyboardShouldPersistTaps="handled" bottomOffset={70} showsVerticalScrollIndicator={false}>
        <View style={[styles.liveCard, { backgroundColor: colors.navyDark }]}>
          <View style={[styles.liveIcon, { backgroundColor: colors.primary }]}>
            <Feather name="radio" size={19} color={colors.navyDark} />
          </View>
          <View style={styles.liveCopy}>
            <Text style={[styles.liveTitle, { color: "#FFFFFF" }]}>{isAvailableNow ? "Available now" : "Not available now"}</Text>
            <Text style={[styles.liveText, { color: "#FFFFFF" }]}>Clients can use this status when discovering interpreters.</Text>
          </View>
          <TouchableOpacity onPress={() => setIsAvailableNow(value => !value)} style={[styles.toggle, { backgroundColor: isAvailableNow ? colors.primary : colors.muted }]} accessibilityLabel="Toggle available now">
            <View style={[styles.knob, { backgroundColor: isAvailableNow ? colors.navyDark : colors.mutedForeground, transform: [{ translateX: isAvailableNow ? 9 : -9 }] }]} />
          </TouchableOpacity>
        </View>
        <Text style={[styles.sectionTitle, { color: colors.navyDark }]}>Weekly schedule</Text>
        <Text style={[styles.sectionText, { color: colors.mutedForeground }]}>Add the windows you normally accept bookings.</Text>
        {slots.length === 0 ? (
          <View style={[styles.noSlots, { borderColor: colors.border }]}>
            <Feather name="calendar" size={23} color={colors.mutedForeground} />
            <Text style={[styles.noSlotsText, { color: colors.mutedForeground }]}>No schedule added yet</Text>
          </View>
        ) : null}
        {slots.map(slot => (
          <View key={slot.id} style={[styles.slot, { borderColor: colors.border, backgroundColor: colors.card }]}>
            <View style={styles.slotTop}>
              <TouchableOpacity style={[styles.dayPicker, { borderColor: colors.border }]} onPress={() => updateSlot(slot.id, { day: DAYS[(DAYS.indexOf(slot.day) + 1) % DAYS.length] })}>
                <Text style={[styles.dayText, { color: colors.foreground }]}>{slot.day}</Text>
                <Feather name="chevron-down" size={14} color={colors.mutedForeground} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setSlots(current => current.filter(item => item.id !== slot.id))}>
                <Feather name="trash-2" size={16} color={colors.destructive} />
              </TouchableOpacity>
            </View>
            <View style={styles.timeRow}>
              <TimeField value={slot.start} onChangeText={start => updateSlot(slot.id, { start })} colors={colors} />
              <Text style={[styles.toText, { color: colors.mutedForeground }]}>to</Text>
              <TimeField value={slot.end} onChangeText={end => updateSlot(slot.id, { end })} colors={colors} />
            </View>
          </View>
        ))}
        <TouchableOpacity style={[styles.addButton, { borderColor: colors.border }]} onPress={addSlot}>
          <Feather name="plus" size={17} color={colors.navyDark} />
          <Text style={[styles.addText, { color: colors.navyDark }]}>Add availability window</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.saveButton, { backgroundColor: colors.navyDark }]} onPress={save} disabled={loading}>
          <Text style={[styles.saveText, { color: colors.primary }]}>{loading ? "Saving..." : "Save availability"}</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </InterpreterScreen>
  );
}

function TimeField({ value, onChangeText, colors }: { value: string; onChangeText: (value: string) => void; colors: ReturnType<typeof useColors> }) {
  return <TextInput value={value} onChangeText={onChangeText} placeholder="09:00" placeholderTextColor={colors.mutedForeground} style={[styles.timeInput, { color: colors.foreground, borderColor: colors.border }]} />;
}

const styles = StyleSheet.create({
  liveCard: { marginHorizontal: 20, borderRadius: 19, padding: 16, flexDirection: "row", alignItems: "center", marginBottom: 23 },
  liveIcon: { width: 41, height: 41, borderRadius: 14, alignItems: "center", justifyContent: "center", marginRight: 11 },
  liveCopy: { flex: 1, paddingRight: 5 },
  liveTitle: { fontSize: 15, fontFamily: "Inter_700Bold", marginBottom: 3 },
  liveText: { fontSize: 11, lineHeight: 16, fontFamily: "Inter_400Regular", opacity: 0.8 },
  toggle: { width: 42, height: 25, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  knob: { width: 17, height: 17, borderRadius: 9 },
  sectionTitle: { marginHorizontal: 20, fontSize: 17, fontFamily: "Inter_700Bold" },
  sectionText: { marginHorizontal: 20, fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 5, marginBottom: 15 },
  noSlots: { marginHorizontal: 20, minHeight: 110, borderWidth: 1, borderRadius: 16, alignItems: "center", justifyContent: "center", gap: 8 },
  noSlotsText: { fontSize: 12, fontFamily: "Inter_400Regular" },
  slot: { marginHorizontal: 20, borderWidth: 1, borderRadius: 16, padding: 13, marginBottom: 10 },
  slotTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 11 },
  dayPicker: { borderWidth: 1, borderRadius: 10, minHeight: 38, paddingHorizontal: 11, flex: 1, marginRight: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  dayText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  timeRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  timeInput: { flex: 1, borderWidth: 1, borderRadius: 10, minHeight: 42, paddingHorizontal: 11, fontSize: 12, fontFamily: "Inter_400Regular" },
  toText: { fontSize: 12, fontFamily: "Inter_400Regular" },
  addButton: { marginHorizontal: 20, borderWidth: 1, borderStyle: "dashed", borderRadius: 13, paddingVertical: 13, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 7, marginTop: 2 },
  addText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  saveButton: { marginHorizontal: 20, borderRadius: 13, paddingVertical: 15, alignItems: "center", marginTop: 12 },
  saveText: { fontSize: 14, fontFamily: "Inter_700Bold" },
});