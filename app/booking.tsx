import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Image,
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
type Step = 1 | 2;

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
const TIMES = [
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
];

function getDateOptions() {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + index);
    const value = date.toISOString().slice(0, 10);
    const dayLabel =
      index === 0
        ? "Today"
        : index === 1
          ? "Tomorrow"
          : date.toLocaleDateString("en-US", { weekday: "short" });
    const dateLabel = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    return { value, dayLabel, dateLabel };
  });
}

export default function BookingScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { interpreterId, type } = useLocalSearchParams<{
    interpreterId?: string;
    type?: string;
  }>();
  const { interpreters, setBookingDraft } = useApp();
  const interpreter = interpreters.find(item => item.id === interpreterId);
  const dateOptions = useMemo(() => getDateOptions(), []);

  const [step, setStep] = useState<Step>(1);
  const [bookingType, setBookingType] = useState<BookingType>(
    type === "Virtual" ? "Virtual" : "In-person",
  );
  const [location, setLocation] = useState("");
  const [venue, setVenue] = useState(VENUES[0]);
  const [meetingLink, setMeetingLink] = useState("");
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [selectedDate, setSelectedDate] = useState(dateOptions[0]);
  const [selectedTime, setSelectedTime] = useState(TIMES[0]);
  const [duration, setDuration] = useState(DURATIONS[1]);
  const [purpose, setPurpose] = useState(PURPOSES[0]);
  const [notes, setNotes] = useState("");
  const [imageUri, setImageUri] = useState<string>();
  const [isSaving, setIsSaving] = useState(false);

  const topPad = Platform.OS === "web" ? 20 : insets.top;
  const bottomPad = Platform.OS === "web" ? 24 : insets.bottom + 12;

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) setImageUri(result.assets[0]?.uri);
  };

  const continueToReview = () => {
    if (!interpreter) {
      Alert.alert(
        "Choose an interpreter",
        "Select an interpreter before reviewing your booking.",
        [
          { text: "Choose interpreter", onPress: () => router.push("/interpreters") },
          { text: "Not now", style: "cancel" },
        ],
      );
      return;
    }
    if (bookingType === "In-person" && !location.trim()) {
      Alert.alert("Missing location", "Add a location for this in-person booking.");
      return;
    }
    if (bookingType === "Virtual" && !meetingLink.trim()) {
      Alert.alert("Missing meeting link", "Add the meeting link for this virtual booking.");
      return;
    }
    setStep(2);
  };

  const continueToPayment = async () => {
    if (!interpreter) return;
    setIsSaving(true);
    try {
      await setBookingDraft({
        interpreterId: interpreter.id,
        interpreterName: interpreter.name,
        interpreterAvatar: interpreter.avatar,
        type: bookingType,
        language,
        date: `${selectedDate.dayLabel}, ${selectedDate.dateLabel}`,
        time: selectedTime,
        duration,
        location: bookingType === "In-person" ? location.trim() : undefined,
        venue: bookingType === "Virtual" ? venue : undefined,
        link: bookingType === "Virtual" ? meetingLink.trim() : undefined,
        purpose,
        notes: notes.trim(),
        imageUri,
        status: "pending",
        interpreterStatus: "pending",
        rate: interpreter.rate,
        paymentStatus: "pending",
      });
      router.push("/payment-method");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.topBar, { paddingTop: topPad + 4 }]}>
        <TouchableOpacity onPress={() => (step === 2 ? setStep(1) : router.back())} style={styles.iconButton}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <View style={styles.progress}>
          {[1, 2].map(item => (
            <View
              key={item}
              style={[
                styles.progressSegment,
                {
                  backgroundColor:
                    item <= step ? colors.primary : colors.border,
                },
              ]}
            />
          ))}
        </View>
        <Text style={[styles.stepText, { color: colors.mutedForeground }]}>
          {step}/2
        </Text>
      </View>

      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: bottomPad + 92 },
        ]}
        keyboardShouldPersistTaps="handled"
        bottomOffset={20}
      >
        {step === 1 ? (
          <>
            <Text style={[styles.title, { color: colors.navyDark }]}>
              Booking details
            </Text>
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
              Tell us what you need and we&apos;ll help you find the right interpreter.
            </Text>

            {interpreter ? (
              <View
                style={[
                  styles.interpreterSummary,
                  { backgroundColor: colors.greenLight },
                ]}
              >
                <Image
                  source={
                    interpreter.avatar === "male"
                      ? require("@/assets/images/interpreter_male.png")
                      : require("@/assets/images/interpreter_female.png")
                  }
                  style={styles.interpreterAvatar}
                />
                <View style={styles.interpreterSummaryCopy}>
                  <Text style={[styles.summaryName, { color: colors.navyDark }]}>
                    {interpreter.name}
                  </Text>
                  <Text style={[styles.summaryMeta, { color: colors.mutedForeground }]}>
                    {interpreter.languages.join(", ")} · ₦{interpreter.rate.toLocaleString()}/hr
                  </Text>
                </View>
                <TouchableOpacity onPress={() => router.push("/interpreters")}>
                  <Text style={[styles.changeText, { color: colors.navyDark }]}>
                    Change
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.chooseInterpreter, { borderColor: colors.border }]}
                onPress={() => router.push("/interpreters")}
              >
                <View style={[styles.chooseIcon, { backgroundColor: colors.greenLight }]}>
                  <Feather name="users" size={20} color={colors.navyDark} />
                </View>
                <View style={styles.interpreterSummaryCopy}>
                  <Text style={[styles.summaryName, { color: colors.navyDark }]}>
                    Choose an interpreter
                  </Text>
                  <Text style={[styles.summaryMeta, { color: colors.mutedForeground }]}>
                    Browse available interpreters first
                  </Text>
                </View>
                <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
              </TouchableOpacity>
            )}

            <View style={[styles.typeSwitch, { backgroundColor: colors.muted }]}>
              {(["In-person", "Virtual"] as BookingType[]).map(item => (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.typeButton,
                    bookingType === item && { backgroundColor: colors.background },
                  ]}
                  onPress={() => setBookingType(item)}
                >
                  <Text
                    style={[
                      styles.typeText,
                      {
                        color:
                          bookingType === item
                            ? colors.navyDark
                            : colors.mutedForeground,
                      },
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {bookingType === "In-person" ? (
              <TextField
                label="Location *"
                placeholder="e.g. Nafdac Office, Ilorin"
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
                <TextField
                  label="Meeting link *"
                  placeholder="https://meet.google.com/..."
                  value={meetingLink}
                  onChangeText={setMeetingLink}
                  colors={colors}
                />
              </>
            )}

            <SelectField
              label="Sign language *"
              options={LANGUAGES}
              value={language}
              onSelect={setLanguage}
              colors={colors}
            />

            <Text style={[styles.fieldLabel, { color: colors.foreground }]}>
              Choose date *
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.dateRow}
            >
              {dateOptions.map(option => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.dateCard,
                    {
                      backgroundColor:
                        selectedDate.value === option.value
                          ? colors.navyDark
                          : colors.muted,
                    },
                  ]}
                  onPress={() => setSelectedDate(option)}
                >
                  <Text
                    style={[
                      styles.dateDay,
                      {
                        color:
                          selectedDate.value === option.value
                            ? colors.primary
                            : colors.mutedForeground,
                      },
                    ]}
                  >
                    {option.dayLabel}
                  </Text>
                  <Text
                    style={[
                      styles.dateValue,
                      {
                        color:
                          selectedDate.value === option.value
                            ? "#FFFFFF"
                            : colors.foreground,
                      },
                    ]}
                  >
                    {option.dateLabel}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={[styles.fieldLabel, { color: colors.foreground }]}>
              Choose time *
            </Text>
            <View style={styles.timeGrid}>
              {TIMES.map(time => (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.timeChip,
                    {
                      backgroundColor:
                        selectedTime === time ? colors.navyDark : colors.muted,
                    },
                  ]}
                  onPress={() => setSelectedTime(time)}
                >
                  <Text
                    style={[
                      styles.timeText,
                      {
                        color:
                          selectedTime === time ? "#FFFFFF" : colors.foreground,
                      },
                    ]}
                  >
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <SelectField
              label="Duration *"
              options={DURATIONS}
              value={duration}
              onSelect={setDuration}
              colors={colors}
            />

            <Text style={[styles.fieldLabel, { color: colors.foreground }]}>
              Service purpose *
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.purposeRow}
            >
              {PURPOSES.map(item => (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.purposeChip,
                    {
                      backgroundColor:
                        purpose === item ? colors.navyDark : colors.muted,
                    },
                  ]}
                  onPress={() => setPurpose(item)}
                >
                  <Text
                    style={[
                      styles.purposeText,
                      { color: purpose === item ? "#FFFFFF" : colors.foreground },
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={[styles.fieldLabel, { color: colors.foreground }]}>
              Additional notes (optional)
            </Text>
            <TextInput
              style={[
                styles.notesInput,
                { borderColor: colors.border, color: colors.foreground },
              ]}
              placeholder="Tell the interpreter anything they should know."
              placeholderTextColor={colors.mutedForeground}
              multiline
              textAlignVertical="top"
              value={notes}
              onChangeText={setNotes}
            />

            <TouchableOpacity
              style={[styles.attachmentButton, { borderColor: colors.border }]}
              onPress={pickImage}
            >
              <Feather name="paperclip" size={18} color={colors.navyDark} />
              <Text style={[styles.attachmentText, { color: colors.navyDark }]}>
                {imageUri ? "Change attached image" : "Attach an image (optional)"}
              </Text>
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.attachmentThumb} />
              ) : null}
            </TouchableOpacity>
          </>
        ) : (
          <ReviewStep
            interpreter={interpreter}
            bookingType={bookingType}
            location={location}
            venue={venue}
            meetingLink={meetingLink}
            language={language}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            duration={duration}
            purpose={purpose}
            notes={notes}
            imageUri={imageUri}
            colors={colors}
          />
        )}
      </KeyboardAwareScrollView>

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
        <PrimaryButton
          title={step === 1 ? "Review booking" : "Continue to payment"}
          onPress={step === 1 ? continueToReview : continueToPayment}
          loading={isSaving}
        />
      </View>
    </View>
  );
}

function ReviewStep({
  interpreter,
  bookingType,
  location,
  venue,
  meetingLink,
  language,
  selectedDate,
  selectedTime,
  duration,
  purpose,
  notes,
  imageUri,
  colors,
}: {
  interpreter?: ReturnType<typeof useApp>["interpreters"][number];
  bookingType: BookingType;
  location: string;
  venue: string;
  meetingLink: string;
  language: string;
  selectedDate: { dayLabel: string; dateLabel: string };
  selectedTime: string;
  duration: string;
  purpose: string;
  notes: string;
  imageUri?: string;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <>
      <Text style={[styles.title, { color: colors.navyDark }]}>
        Review booking
      </Text>
      <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
        Check the details before confirming your appointment.
      </Text>
      <View style={[styles.reviewPanel, { backgroundColor: colors.background }]}>
        <Text style={[styles.reviewHeading, { color: colors.foreground }]}>
          Interpreter
        </Text>
        <Text style={[styles.reviewValue, { color: colors.navyDark }]}>
          {interpreter?.name || "Not selected"}
        </Text>
        <ReviewRow label="Service" value={purpose} colors={colors} />
        <ReviewRow
          label="Format"
          value={bookingType === "Virtual" ? `${venue} · ${meetingLink}` : location}
          colors={colors}
        />
        <ReviewRow label="Language" value={language} colors={colors} />
        <ReviewRow
          label="Date"
          value={`${selectedDate.dayLabel}, ${selectedDate.dateLabel}`}
          colors={colors}
        />
        <ReviewRow label="Time" value={`${selectedTime} · ${duration}`} colors={colors} />
        {notes ? <ReviewRow label="Notes" value={notes} colors={colors} /> : null}
        {imageUri ? (
          <View style={styles.reviewAttachment}>
            <Text style={[styles.reviewLabel, { color: colors.mutedForeground }]}>
              Attachment
            </Text>
            <Image source={{ uri: imageUri }} style={styles.reviewImage} />
          </View>
        ) : null}
        <View style={[styles.rateRow, { borderTopColor: colors.border }]}>
          <Text style={[styles.rateLabel, { color: colors.mutedForeground }]}>
            Estimated interpreter rate
          </Text>
          <Text style={[styles.rateValue, { color: colors.navyDark }]}>
            ₦{interpreter?.rate.toLocaleString() || "0"}/hr
          </Text>
        </View>
      </View>
    </>
  );
}

function ReviewRow({
  label,
  value,
  colors,
}: {
  label: string;
  value: string;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={styles.reviewRow}>
      <Text style={[styles.reviewLabel, { color: colors.mutedForeground }]}>
        {label}
      </Text>
      <Text style={[styles.reviewValue, { color: colors.foreground }]}>{value}</Text>
    </View>
  );
}

function TextField({
  label,
  placeholder,
  value,
  onChangeText,
  colors,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={styles.field}>
      <Text style={[styles.fieldLabel, { color: colors.foreground }]}>{label}</Text>
      <TextInput
        style={[styles.input, { borderColor: colors.border, color: colors.foreground }]}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

function SelectField({
  label,
  options,
  value,
  onSelect,
  colors,
}: {
  label: string;
  options: string[];
  value: string;
  onSelect: (value: string) => void;
  colors: ReturnType<typeof useColors>;
}) {
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.field}>
      <Text style={[styles.fieldLabel, { color: colors.foreground }]}>{label}</Text>
      <TouchableOpacity
        style={[styles.input, styles.selectInput, { borderColor: colors.border }]}
        onPress={() => setOpen(openState => !openState)}
      >
        <Text style={[styles.inputText, { color: colors.foreground }]}>{value}</Text>
        <Feather
          name={open ? "chevron-up" : "chevron-down"}
          size={17}
          color={colors.mutedForeground}
        />
      </TouchableOpacity>
      {open ? (
        <View style={[styles.dropdown, { backgroundColor: colors.background, borderColor: colors.border }]}>
          {options.map(option => (
            <TouchableOpacity
              key={option}
              style={[styles.dropdownItem, { borderBottomColor: colors.border }]}
              onPress={() => {
                onSelect(option);
                setOpen(false);
              }}
            >
              <Text style={[styles.dropdownText, { color: colors.foreground }]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : null}
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
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  progress: { flex: 1, flexDirection: "row", gap: 5 },
  progressSegment: { flex: 1, height: 5, borderRadius: 3 },
  stepText: { width: 28, fontSize: 12, textAlign: "right" },
  content: { paddingHorizontal: 20 },
  title: { fontSize: 24, fontFamily: "Inter_700Bold", marginBottom: 6 },
  subtitle: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
    marginBottom: 20,
  },
  interpreterSummary: {
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 20,
  },
  chooseInterpreter: {
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 20,
  },
  chooseIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  interpreterAvatar: { width: 52, height: 52, borderRadius: 26, marginRight: 12 },
  interpreterSummaryCopy: { flex: 1 },
  summaryName: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  summaryMeta: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 4 },
  changeText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  typeSwitch: {
    flexDirection: "row",
    padding: 4,
    borderRadius: 12,
    marginBottom: 20,
  },
  typeButton: { flex: 1, alignItems: "center", paddingVertical: 10, borderRadius: 9 },
  typeText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  field: { marginBottom: 16 },
  fieldLabel: { fontSize: 13, fontFamily: "Inter_500Medium", marginBottom: 8 },
  input: {
    minHeight: 50,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  selectInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  inputText: { fontSize: 13, fontFamily: "Inter_400Regular" },
  dropdown: {
    borderWidth: 1,
    borderRadius: 12,
    marginTop: 4,
    overflow: "hidden",
  },
  dropdownItem: { paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1 },
  dropdownText: { fontSize: 13, fontFamily: "Inter_400Regular" },
  dateRow: { gap: 8, paddingBottom: 18 },
  dateCard: {
    width: 78,
    borderRadius: 12,
    alignItems: "center",
    paddingVertical: 10,
  },
  dateDay: { fontSize: 11, fontFamily: "Inter_500Medium", marginBottom: 6 },
  dateValue: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  timeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 18,
  },
  timeChip: { borderRadius: 10, paddingHorizontal: 13, paddingVertical: 10 },
  timeText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  purposeRow: { gap: 8, paddingBottom: 18 },
  purposeChip: { borderRadius: 18, paddingHorizontal: 15, paddingVertical: 9 },
  purposeText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  notesInput: {
    minHeight: 92,
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 12,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    marginBottom: 14,
  },
  attachmentButton: {
    minHeight: 52,
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  attachmentText: { flex: 1, fontSize: 13, fontFamily: "Inter_500Medium" },
  attachmentThumb: { width: 38, height: 38, borderRadius: 7 },
  reviewPanel: { borderRadius: 16, padding: 18, marginBottom: 20 },
  reviewHeading: { fontSize: 12, fontFamily: "Inter_500Medium", marginBottom: 5 },
  reviewRow: { paddingVertical: 12, borderBottomWidth: 0 },
  reviewLabel: { fontSize: 11, fontFamily: "Inter_400Regular", marginBottom: 4 },
  reviewValue: { fontSize: 14, fontFamily: "Inter_600SemiBold", lineHeight: 20 },
  reviewAttachment: { marginTop: 12 },
  reviewImage: { width: 88, height: 70, borderRadius: 8, marginTop: 6 },
  rateRow: {
    borderTopWidth: 1,
    marginTop: 10,
    paddingTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rateLabel: { fontSize: 12, fontFamily: "Inter_400Regular" },
  rateValue: { fontSize: 16, fontFamily: "Inter_700Bold" },
  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 14,
    borderTopWidth: 1,
  },
});