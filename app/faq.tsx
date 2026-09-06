import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { AccountScreen, BackButton } from "@/components/account/AccountShared";
import { EmptyState } from "@/components/interpreter/InterpreterShared";
import { useColors } from "@/hooks/useColors";

const FAQS = [
  { category: "Bookings", question: "How do I book an interpreter?", answer: "Choose an interpreter from discovery, select your session type and time, then confirm the booking using the payment flow." },
  { category: "Bookings", question: "Can I reschedule a booking?", answer: "Open the booking from your Bookings tab and choose Reschedule. The updated time will be saved to your booking history." },
  { category: "Payments", question: "How does the wallet work?", answer: "Your wallet is a local demo balance for this app. You can add funds, review transactions, and request a withdrawal from the Wallet screen." },
  { category: "Account", question: "How do I update my profile?", answer: "Open Profile, choose Account information or Edit profile, update your details, and save the changes." },
  { category: "Interpreters", question: "How are interpreters verified?", answer: "Interpreter credentials are collected for review in the demo experience. A production verification service is required for official verification." },
  { category: "Support", question: "How can I contact SignBEE support?", answer: "Open Help & support, choose Contact support, and save a detailed request locally. A live support backend is not connected in this demo." },
];

export default function FAQScreen() {
  const colors = useColors();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [open, setOpen] = useState<string | null>(null);
  const categories = ["All", ...Array.from(new Set(FAQS.map(item => item.category)))];
  const results = useMemo(() => FAQS.filter(item => (category === "All" || item.category === category) && `${item.question} ${item.answer}`.toLowerCase().includes(query.toLowerCase())), [category, query]);

  return (
    <AccountScreen title="Frequently asked questions" subtitle="Quick answers to common SignBEE questions." action={<BackButton />}>
      <View style={[styles.search, { borderColor: colors.border, backgroundColor: colors.card }]}>
        <Feather name="search" size={17} color={colors.mutedForeground} />
        <TextInput value={query} onChangeText={setQuery} placeholder="Search questions" placeholderTextColor={colors.mutedForeground} style={[styles.searchInput, { color: colors.foreground }]} />
      </View>
      <View style={styles.categoryRow}>
        {categories.map(item => (
          <TouchableOpacity key={item} onPress={() => setCategory(item)} style={[styles.category, { borderColor: category === item ? colors.navyDark : colors.border, backgroundColor: category === item ? colors.navyDark : colors.background }]}>
            <Text style={[styles.categoryText, { color: category === item ? colors.primary : colors.foreground }]}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {results.length === 0 ? <EmptyState icon="search" title="No answers found" description="Try a different search term or category." /> : results.map(item => {
        const expanded = open === item.question;
        return (
          <TouchableOpacity key={item.question} onPress={() => setOpen(expanded ? null : item.question)} style={[styles.question, { borderColor: colors.border, backgroundColor: colors.card }]}>
            <View style={styles.questionHeader}>
              <View style={styles.questionCopy}><Text style={[styles.questionCategory, { color: colors.mutedForeground }]}>{item.category}</Text><Text style={[styles.questionText, { color: colors.foreground }]}>{item.question}</Text></View>
              <Feather name={expanded ? "chevron-up" : "chevron-down"} size={17} color={colors.mutedForeground} />
            </View>
            {expanded ? <Text style={[styles.answer, { color: colors.mutedForeground }]}>{item.answer}</Text> : null}
          </TouchableOpacity>
        );
      })}
    </AccountScreen>
  );
}

const styles = StyleSheet.create({
  search: { marginHorizontal: 20, borderWidth: 1, borderRadius: 13, minHeight: 48, paddingHorizontal: 13, flexDirection: "row", alignItems: "center", gap: 9, marginBottom: 12 },
  searchInput: { flex: 1, fontSize: 13, fontFamily: "Inter_400Regular" },
  categoryRow: { paddingHorizontal: 20, flexDirection: "row", flexWrap: "wrap", gap: 7, marginBottom: 15 },
  category: { borderWidth: 1, borderRadius: 17, paddingHorizontal: 10, paddingVertical: 8 },
  categoryText: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  question: { marginHorizontal: 20, borderWidth: 1, borderRadius: 15, padding: 14, marginBottom: 9 },
  questionHeader: { flexDirection: "row", alignItems: "center" },
  questionCopy: { flex: 1, paddingRight: 10 },
  questionCategory: { fontSize: 10, fontFamily: "Inter_500Medium", marginBottom: 4 },
  questionText: { fontSize: 13, lineHeight: 18, fontFamily: "Inter_600SemiBold" },
  answer: { fontSize: 12, lineHeight: 19, fontFamily: "Inter_400Regular", marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: "#00000010" },
});