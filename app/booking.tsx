import { Feather } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import PrimaryButton from "@/components/PrimaryButton";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

type BookingType = "In-person" | "Virtual";

const PURPOSES = [
  "Medical",
  "Concert",
  "Religion",
  "Business",
  "Education",
  "Legal",
  "Other",
];
const LANGUAGES = ["ASL", "BSL", "NSL", "PSL", "MSL", "ISL"];
const DURATIONS = ["30 mins", "1 hour", "2 hours", "3 hours", "4 hours", "All day"];
const VENUES = ["Zoom", "Google Meet", "Microsoft Teams", "Webex", "Other"];

export default function BookingScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { interpreterId } = useLocalSearchParams<{ interpreterId: string }>();
  const { interpreters, addBooking } = useApp();

  const interpreter = interpreters.find(i => i.id === interpreterId);

  const [bookingType, setBookingType] = useState<BookingType>("In-person");
  const [location, setLocation] = useState("");
  const [venue, setVenue] = useState(VENUES[0]);
  const [meetingLink, setMeetingLink] = useState("");
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState(DURATIONS[1]);
  const [purpose, setPurpose] = useState(PURPOSES[0]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom + 16;

  const handleSubmit = async () => {
    if (!date || !time) {
      Alert.alert("Missing Info", "Please enter date and time.");
      return;
    }
    if (bookingType === "In-person" && !location) {
      Alert.alert("Missing Info", "Please enter a location.");
      return;
    }
    if (bookingType === "Virtual" && !meetingLink) {
      Alert.alert("Missing Info", "Please enter a meeting link.");
      return;
    }

    setLoading(true);
    try {
      await addBooking({
        interpreterId: interpreterId || "",
        interpreterName: interpreter?.name || "Unknown",
        type: bookingType,
        language,
        date,
        time,
        duration,
        location: bookingType === "In-person" ? location : undefined,
        venue: bookingType === "Virtual" ? venue : undefined,
        link: bookingType === "Virtual" ? meetingLink : undefined,
        purpose,
        notes,
        status: "upcoming",
        rate: interpreter?.rate || 0,
      });
      Alert.alert("Success!", "Your booking has been confirmed.", [
        {
          text: "View Bookings",
          onPress: () => router.replace("/(tabs)/bookings"),
        },
      ]);
    } catch {
      Alert.alert("Error", "Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.topBar, { paddingTop: topPad + 12 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <View style={styles.progressBar}>
          <View
            style={[styles.progressFill, { backgroundColor: colors.navyDark }]}
          />
          <View
            style={[
              styles.progressEmpty,
              { backgroundColor: colors.border },
            ]}
          />
        </View>
      </View>

      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: bottomPad + 80 },
        ]}
        keyboardShouldPersistTaps="handled"
        bottomOffset={20}
      >
        <View style={[styles.typeSwitch, { backgroundColor: colors.muted }]}>
          {(["In-person", "Virtual"] as BookingType[]).map(t => (
            <TouchableOpacity
              key={t}
              style={[
                styles.typeBtn,
                bookingType === t && { backgroundColor: colors.background },
              ]}
              onPress={() => setBookingType(t)}
            >
              <Text
                style={[
                  styles.typeBtnText,
                  {
                    color:
                      bookingType === t
                        ? colors.navyDark
                        : colors.mutedForeground,
                  },
                  bookingType === t && { fontFamily: "Inter_600SemiBold" },
                ]}
              >
                {t}
              </Text>
              {bookingType === t && (
                <View
                  style={[
                    styles.typeUnderline,
                    { backgroundColor: colors.primary },
                  ]}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {bookingType === "In-person" ? (
          <DropdownField
            label="Location *"
            placeholder="e.g Nafdac Office Ilorin, Kwara."
            value={location}
            onChangeText={setLocation}
            colors={colors}
          />
        ) : (
          <>
            <SelectField
              label="Venue *"
              options={VENUES}
              value={venue}
              onSelect={setVenue}
              colors={colors}
            />
            <DropdownField
              label="Link *"
              placeholder="e.g https://meet.google.com/abc-xyz"
              value={meetingLink}
              onChangeText={setMeetingLink}
              colors={colors}
            />
          </>
        )}

        <SelectField
          label="Select Language *"
          options={LANGUAGES}
          value={language}
          onSelect={setLanguage}
          colors={colors}
        />

        <View style={styles.row}>
          <DropdownField
            label="Choose Date *"
            placeholder="DD/MM/YY"
            value={date}
            onChangeText={setDate}
            colors={colors}
            containerStyle={{ flex: 1, marginRight: 8 }}
            icon="calendar"
          />
          <DropdownField
            label="Time *"
            placeholder="00:00"
            value={time}
            onChangeText={setTime}
            colors={colors}
            containerStyle={{ flex: 1 }}
            icon="clock"
          />
        </View>

        <SelectField
          label="Duration *"
          options={DURATIONS}
          value={duration}
          onSelect={setDuration}
          colors={colors}
        />

        <View
          style={[styles.noticeBadge, { backgroundColor: colors.greenLight }]}
        >
          <View
            style={[
              styles.noticeIcon,
              { backgroundColor: colors.primary + "40" },
            ]}
          >
            <Feather name="alert-circle" size={16} color={colors.navyDark} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.noticeTitle, { color: colors.navyDark }]}>
              Important notice
            </Text>
            <Text
              style={[styles.noticeText, { color: colors.mutedForeground }]}
            >
              Urgent tasks may incur additional charges.
            </Text>
          </View>
        </View>

        <View style={styles.purposeSection}>
          <Text style={[styles.fieldLabel, { color: colors.foreground }]}>
            Service Purpose *
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.purposeScroll}
          >
            {PURPOSES.map(p => (
              <TouchableOpacity
                key={p}
                style={[
                  styles.purposeChip,
                  {
                    backgroundColor:
                      purpose === p ? colors.navyDark : colors.muted,
                    borderColor:
                      purpose === p ? colors.navyDark : colors.border,
                  },
                ]}
                onPress={() => setPurpose(p)}
              >
                <Text
                  style={[
                    styles.purposeChipText,
                    {
                      color:
                        purpose === p ? "#FFFFFF" : colors.mutedForeground,
                    },
                  ]}
                >
                  {p}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.notesSection}>
          <Text style={[styles.fieldLabel, { color: colors.foreground }]}>
            Additional Notes (Optional)
          </Text>
          <View style={[styles.notesWrap, { borderColor: colors.border }]}>
            <TextInput
              style={[styles.notesInput, { color: colors.foreground }]}
              placeholder="e.g Interpreter should arrive 15 minutes early for setup."
              placeholderTextColor={colors.mutedForeground}
              multiline
              numberOfLines={4}
              value={notes}
              onChangeText={setNotes}
              textAlignVertical="top"
            />
          </View>
        </View>
      </KeyboardAwareScrollView>

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
        <PrimaryButton
          title="Find Interpreters"
          onPress={handleSubmit}
          loading={loading}
        />
      </View>
    </View>
  );
}

interface DropdownFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  colors: ReturnType<typeof useColors>;
  containerStyle?: object;
  icon?: string;
}

function DropdownField({
  label,
  placeholder,
  value,
  onChangeText,
  colors,
  containerStyle,
  icon,
}: DropdownFieldProps) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={[{ marginBottom: 16 }, containerStyle]}>
      <Text style={[styles.fieldLabel, { color: colors.foreground }]}>
        {label}
      </Text>
      <View
        style={[
          styles.inputWrap,
          { borderColor: focused ? colors.primary : colors.border },
        ]}
      >
        <TextInput
          style={[styles.inputText, { color: colors.foreground, flex: 1 }]}
          placeholder={placeholder}
          placeholderTextColor={colors.mutedForeground}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {icon && (
          <Feather
            name={icon as any}
            size={16}
            color={colors.mutedForeground}
          />
        )}
      </View>
    </View>
  );
}

interface SelectFieldProps {
  label: string;
  options: string[];
  value: string;
  onSelect: (v: string) => void;
  colors: ReturnType<typeof useColors>;
}

function SelectField({
  label,
  options,
  value,
  onSelect,
  colors,
}: SelectFieldProps) {
  const [open, setOpen] = useState(false);
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={[styles.fieldLabel, { color: colors.foreground }]}>
        {label}
      </Text>
      <TouchableOpacity
        style={[styles.inputWrap, { borderColor: colors.border }]}
        onPress={() => setOpen(o => !o)}
        activeOpacity={0.8}
      >
        <Text
          style={[styles.inputText, { color: colors.foreground, flex: 1 }]}
        >
          {value}
        </Text>
        <Feather
          name={open ? "chevron-up" : "chevron-down"}
          size={16}
          color={colors.mutedForeground}
        />
      </TouchableOpacity>
      {open && (
        <View
          style={[
            styles.dropdown,
            {
              backgroundColor: colors.background,
              borderColor: colors.border,
            },
          ]}
        >
          {options.map(o => (
            <TouchableOpacity
              key={o}
              style={[
                styles.dropdownItem,
                { borderBottomColor: colors.border },
              ]}
              onPress={() => {
                onSelect(o);
                setOpen(false);
              }}
            >
              <Text
                style={[
                  styles.dropdownItemText,
                  {
                    color: o === value ? colors.navyDark : colors.foreground,
                  },
                ]}
              >
                {o}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 16,
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  progressBar: { flex: 1, flexDirection: "row", gap: 4, height: 4 },
  progressFill: { flex: 1, borderRadius: 2 },
  progressEmpty: { flex: 1, borderRadius: 2 },
  content: { paddingHorizontal: 20 },
  typeSwitch: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  typeBtnText: { fontSize: 14, fontFamily: "Inter_500Medium" },
  typeUnderline: {
    position: "absolute",
    bottom: 4,
    width: "50%",
    height: 2,
    borderRadius: 1,
  },
  row: { flexDirection: "row" },
  fieldLabel: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    marginBottom: 8,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 50,
  },
  inputText: { fontSize: 13, fontFamily: "Inter_400Regular" },
  noticeBadge: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    gap: 10,
    marginBottom: 20,
  },
  noticeIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  noticeTitle: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  noticeText: { fontSize: 11, fontFamily: "Inter_400Regular" },
  purposeSection: { marginBottom: 20 },
  purposeScroll: { marginTop: 0 },
  purposeChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  purposeChipText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  notesSection: { marginBottom: 20 },
  notesWrap: { borderWidth: 1.5, borderRadius: 12, padding: 12 },
  notesInput: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    minHeight: 80,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  dropdown: {
    borderWidth: 1,
    borderRadius: 12,
    marginTop: 4,
    overflow: "hidden",
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  dropdownItemText: { fontSize: 13, fontFamily: "Inter_400Regular" },
});
