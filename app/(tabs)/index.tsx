import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import InterpreterCard from "@/components/InterpreterCard";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const FILTERS = ["All", "Virtual", "In-person", "Available Now"];

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, interpreters } = useApp();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [favorites, setFavorites] = useState<string[]>([]);

  const topPad = Platform.OS === "web" ? 20 : insets.top;

  const filtered = interpreters.filter(i => {
    const matchSearch =
      !search ||
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.languages.some(l => l.toLowerCase().includes(search.toLowerCase()));
    const matchFilter =
      filter === "All" ||
      (filter === "Virtual" && i.type.includes("Virtual")) ||
      (filter === "In-person" && i.type.includes("In-person")) ||
      filter === "Available Now";
    return matchSearch && matchFilter;
  });

  const toggleFav = (id: string) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id],
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: topPad + 16, paddingBottom: insets.bottom + 100 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.topRow}>
        <View>
          <Text style={[styles.greeting, { color: colors.mutedForeground }]}>
            👋 Welcome back,
          </Text>
          <Text style={[styles.name, { color: colors.navyDark }]}>
            {user?.name || "there"}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.notifBtn, { backgroundColor: colors.muted }]}
        >
          <Feather name="bell" size={20} color={colors.navyDark} />
        </TouchableOpacity>
      </View>

      <View style={[styles.searchBox, { backgroundColor: colors.muted }]}>
        <Feather name="search" size={16} color={colors.mutedForeground} />
        <TextInput
          style={[styles.searchInput, { color: colors.foreground }]}
          placeholder="Search interpreters..."
          placeholderTextColor={colors.mutedForeground}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Feather name="x" size={14} color={colors.mutedForeground} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContent}
      >
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f}
            style={[
              styles.filterChip,
              {
                backgroundColor: filter === f ? colors.navyDark : colors.muted,
                borderColor: filter === f ? colors.navyDark : colors.border,
              },
            ]}
            onPress={() => setFilter(f)}
          >
            <Text
              style={[
                styles.filterText,
                {
                  color:
                    filter === f ? "#FFFFFF" : colors.mutedForeground,
                },
              ]}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.navyDark }]}>
          {filter === "All" ? "All Interpreters" : filter + " Interpreters"}
        </Text>
        <Text style={[styles.count, { color: colors.mutedForeground }]}>
          {filtered.length} available
        </Text>
      </View>

      {filtered.length === 0 ? (
        <View style={styles.empty}>
          <Feather name="users" size={40} color={colors.border} />
          <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
            No interpreters found
          </Text>
        </View>
      ) : (
        filtered.map(interpreter => (
          <InterpreterCard
            key={interpreter.id}
            interpreter={interpreter}
            onPress={() => router.push(`/interpreter/${interpreter.id}`)}
            onFavorite={() => toggleFav(interpreter.id)}
            isFavorite={favorites.includes(interpreter.id)}
          />
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20 },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  greeting: { fontSize: 13, fontFamily: "Inter_400Regular" },
  name: { fontSize: 22, fontFamily: "Inter_700Bold", marginTop: 2 },
  notifBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    gap: 10,
    marginBottom: 16,
  },
  searchInput: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular" },
  filterScroll: { marginBottom: 20 },
  filterContent: { gap: 8, paddingRight: 8 },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 17, fontFamily: "Inter_700Bold" },
  count: { fontSize: 13, fontFamily: "Inter_400Regular" },
  empty: { alignItems: "center", marginTop: 60, gap: 12 },
  emptyText: { fontSize: 15, fontFamily: "Inter_400Regular" },
});
