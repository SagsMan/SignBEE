import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import InterpreterProfileScreen from "@/components/interpreter/InterpreterProfileScreen";
import { useColors } from "@/hooks/useColors";

interface MenuItem {
  icon: string;
  label: string;
  onPress: () => void;
  danger?: boolean;
}

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, bookings, logout } = useApp();

  const topPad = Platform.OS === "web" ? 20 : insets.top;

  if (user?.role === "interpreter") {
    return <InterpreterProfileScreen />;
  }

  const stats = {
    total: bookings.length,
    upcoming: bookings.filter(b => b.status === "upcoming").length,
    completed: bookings.filter(b => b.status === "completed").length,
  };

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/login");
        },
      },
    ]);
  };

  const menuItems: MenuItem[] = [
    {
      icon: "user",
      label: "Edit Profile",
      onPress: () =>
        Alert.alert(
          "Coming Soon",
          "Profile editing will be available in the next update.",
        ),
    },
    {
      icon: "bell",
      label: "Notifications",
      onPress: () => router.push("/notification-center"),
    },
    {
      icon: "lock",
      label: "Privacy & Security",
      onPress: () =>
        Alert.alert("Privacy", "Privacy settings coming soon."),
    },
    {
      icon: "credit-card",
      label: "Wallet & Payments",
      onPress: () => router.push("/wallet"),
    },
    {
      icon: "help-circle",
      label: "Help & Support",
      onPress: () =>
        Alert.alert("Support", "Contact us at support@signbee.app"),
    },
    {
      icon: "info",
      label: "About SignBee",
      onPress: () =>
        Alert.alert("SignBee v1.0.0", "Connecting deaf individuals with certified sign language interpreters."),
    },
    {
      icon: "log-out",
      label: "Log Out",
      onPress: handleLogout,
      danger: true,
    },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: topPad + 16, paddingBottom: insets.bottom + 100 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.pageTitle, { color: colors.navyDark }]}>
        Profile
      </Text>

      <View
        style={[
          styles.profileCard,
          { backgroundColor: colors.greenLight, borderColor: colors.border },
        ]}
      >
        <View
          style={[styles.avatar, { backgroundColor: colors.primary }]}
        >
          <Text style={[styles.avatarText, { color: colors.navyDark }]}>
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </Text>
        </View>
        <View>
          <Text style={[styles.userName, { color: colors.navyDark }]}>
            {user?.name || "User"}
          </Text>
          <Text style={[styles.userEmail, { color: colors.mutedForeground }]}>
            {user?.email || ""}
          </Text>
          <View
            style={[
              styles.roleBadge,
              { backgroundColor: colors.navyDark + "15" },
            ]}
          >
            <Text style={[styles.roleText, { color: colors.navyDark }]}>
              Individual
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.statsRow}>
        <StatCard
          label="Total"
          value={stats.total}
          colors={colors}
          accent={colors.navyDark}
        />
        <StatCard
          label="Upcoming"
          value={stats.upcoming}
          colors={colors}
          accent="#3B82F6"
        />
        <StatCard
          label="Completed"
          value={stats.completed}
          colors={colors}
          accent="#22C55E"
        />
      </View>

      <View
        style={[styles.menuCard, { borderColor: colors.border }]}
      >
        {menuItems.map((item, index) => (
          <React.Fragment key={item.label}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.menuIcon,
                  {
                    backgroundColor: item.danger
                      ? colors.destructive + "15"
                      : colors.muted,
                  },
                ]}
              >
                <Feather
                  name={item.icon as any}
                  size={18}
                  color={item.danger ? colors.destructive : colors.navyDark}
                />
              </View>
              <Text
                style={[
                  styles.menuLabel,
                  {
                    color: item.danger
                      ? colors.destructive
                      : colors.foreground,
                  },
                ]}
              >
                {item.label}
              </Text>
              {!item.danger && (
                <Feather
                  name="chevron-right"
                  size={16}
                  color={colors.mutedForeground}
                />
              )}
            </TouchableOpacity>
            {index < menuItems.length - 1 && (
              <View
                style={[
                  styles.menuDivider,
                  { backgroundColor: colors.border },
                ]}
              />
            )}
          </React.Fragment>
        ))}
      </View>
    </ScrollView>
  );
}

function StatCard({
  label,
  value,
  colors,
  accent,
}: {
  label: string;
  value: number;
  colors: ReturnType<typeof useColors>;
  accent: string;
}) {
  return (
    <View
      style={[
        styles.statCard,
        { backgroundColor: colors.muted, borderColor: colors.border },
      ]}
    >
      <Text style={[styles.statValue, { color: accent }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20 },
  pageTitle: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    marginBottom: 20,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 20,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 26, fontFamily: "Inter_700Bold" },
  userName: { fontSize: 18, fontFamily: "Inter_700Bold", marginBottom: 2 },
  userEmail: { fontSize: 13, fontFamily: "Inter_400Regular", marginBottom: 8 },
  roleBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  roleText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  statValue: { fontSize: 24, fontFamily: "Inter_700Bold" },
  statLabel: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 4 },
  menuCard: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 14,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  menuLabel: { flex: 1, fontSize: 15, fontFamily: "Inter_500Medium" },
  menuDivider: { height: 1, marginHorizontal: 16 },
});
