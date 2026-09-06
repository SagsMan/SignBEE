import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Platform,
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

type Filter = "All" | "Virtual" | "In-person" | "Available Now";
const FILTERS: Filter[] = ["All", "Virtual", "In-person", "Available Now"];

export default function InterpretersScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ type?: string; search?: string }>();
  const { interpreters, favoriteInterpreterIds, toggleFavorite } = useApp();

  const [search, setSearch] = useState(params.search || "");
  const [filter, setFilter] = useState<Filter>(
    params.type === "Virtual" || params.type === "In-person"
      ? params.type
      : "All",
  );

  const filtered = useMemo(
    () =>
      interpreters.filter(interpreter => {
        const query = search.trim().toLowerCase();
        const matchesSearch =
          !query ||
          interpreter.name.toLowerCase().includes(query) ||
          interpreter.location?.toLowerCase().includes(query) ||
          interpreter.languages.some(language =>
            language.toLowerCase().includes(query),
          );
        const matchesFilter =
          filter === "All" ||
          (filter === "Virtual" && interpreter.type.includes("Virtual")) ||
          (filter === "In-person" && interpreter.type.includes("In-person")) ||
          (filter === "Available Now" && interpreter.isAvailable);
        return matchesSearch && matchesFilter;
      }),
    [filter, interpreters, search],
  );

  const topPad = Platform.OS === "web" ? 20 : insets.top;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 10 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.iconButton}
          accessibilityLabel="Go back"
        >
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <View style={styles.headerCopy}>
          <Text style={[styles.title, { color: colors.navyDark }]}>
            Available interpreters
          </Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            Choose the right interpreter for your booking
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.searchBox,
          { borderColor: colors.border, backgroundColor: colors.background },
        ]}
      >
        <Feather name="search" size={17} color={colors.mutedForeground} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search by name, location, languages"
          placeholderTextColor={colors.mutedForeground}
          style={[styles.searchInput, { color: colors.foreground }]}
          returnKeyType="search"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Feather name="x" size={16} color={colors.mutedForeground} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        horizontal
        data={FILTERS}
        keyExtractor={item => item}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContent}
        style={styles.filterList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.filterChip,
              {
                backgroundColor:
                  filter === item ? colors.navyDark : colors.muted,
                borderColor:
                  filter === item ? colors.navyDark : colors.border,
              },
            ]}
            onPress={() => setFilter(item)}
          >
            <Text
              style={[
                styles.filterText,
                {
                  color:
                    filter === item ? "#FFFFFF" : colors.mutedForeground,
                },
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      <View style={styles.resultHeader}>
        <Text style={[styles.resultTitle, { color: colors.navyDark }]}>
          {filter === "All" ? "All interpreters" : filter}
        </Text>
        <Text style={[styles.resultCount, { color: colors.mutedForeground }]}>
          {filtered.length} available
        </Text>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={[
          styles.results,
          { paddingBottom: insets.bottom + 32 },
          filtered.length === 0 && styles.emptyList,
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="users" size={42} color={colors.border} />
            <Text style={[styles.emptyTitle, { color: colors.navyDark }]}>
              No interpreters found
            </Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Try another name, language, or availability filter.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <InterpreterCard
            interpreter={item}
            onPress={() =>
              router.push({
                pathname: "/interpreter/[id]",
                params: {
                  id: item.id,
                  bookingType: filter === "Virtual" ? "Virtual" : "",
                },
              })
            }
            onFavorite={() => toggleFavorite(item.id)}
            isFavorite={favoriteInterpreterIds.includes(item.id)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 18,
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCopy: { flex: 1 },
  title: { fontSize: 21, fontFamily: "Inter_700Bold" },
  subtitle: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 3,
  },
  searchBox: {
    height: 48,
    marginHorizontal: 20,
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
  },
  searchInput: { flex: 1, fontSize: 13, fontFamily: "Inter_400Regular" },
  filterList: { flexGrow: 0, marginTop: 16, marginBottom: 18 },
  filterContent: { paddingHorizontal: 20, gap: 8 },
  filterChip: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  filterText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  resultTitle: { fontSize: 17, fontFamily: "Inter_700Bold" },
  resultCount: { fontSize: 12, fontFamily: "Inter_400Regular" },
  results: { paddingHorizontal: 20 },
  emptyList: { flex: 1 },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingTop: 80,
    paddingHorizontal: 30,
  },
  emptyTitle: { fontSize: 17, fontFamily: "Inter_600SemiBold" },
  emptyText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 19,
  },
});