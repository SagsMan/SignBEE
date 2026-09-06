import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AppProvider } from "@/context/AppContext";

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="role" />
      <Stack.Screen name="register" />
      <Stack.Screen name="login" />
      <Stack.Screen name="interpreters" />
      <Stack.Screen name="booking-confirmation" />
      <Stack.Screen name="appointment/[id]" />
      <Stack.Screen name="reschedule/[id]" />
      <Stack.Screen name="cancel-booking/[id]" />
      <Stack.Screen name="rating/[id]" />
      <Stack.Screen name="verify-account" />
      <Stack.Screen name="email-verification" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="reset-password" />
      <Stack.Screen name="password-changed" />
      <Stack.Screen name="waitlist" />
      <Stack.Screen name="location-permission" />
      <Stack.Screen name="booking" />
      <Stack.Screen name="payment-method" />
      <Stack.Screen name="card-payment" />
      <Stack.Screen name="card-added" />
      <Stack.Screen name="bank-transfer" />
      <Stack.Screen name="payment-success" />
      <Stack.Screen name="wallet" />
      <Stack.Screen name="add-funds" />
      <Stack.Screen name="top-up" />
      <Stack.Screen name="withdraw" />
      <Stack.Screen name="payment-pin" />
      <Stack.Screen name="transactions" />
      <Stack.Screen name="transaction/[id]" />
      <Stack.Screen name="conversation/[id]" />
      <Stack.Screen name="notification-center" />
      <Stack.Screen name="incoming-call" />
      <Stack.Screen name="call/[id]" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="interpreter/[id]" />
      <Stack.Screen name="interpreter/index" />
      <Stack.Screen name="interpreter/jobs" />
      <Stack.Screen name="interpreter/job/[id]" />
      <Stack.Screen name="interpreter/profile" />
      <Stack.Screen name="interpreter/edit-profile" />
      <Stack.Screen name="interpreter/credentials" />
      <Stack.Screen name="interpreter/languages" />
      <Stack.Screen name="interpreter/experience" />
      <Stack.Screen name="interpreter/availability" />
      <Stack.Screen name="interpreter/preferences" />
      <Stack.Screen name="interpreter/earnings" />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <AppProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <KeyboardProvider>
              <RootLayoutNav />
            </KeyboardProvider>
          </GestureHandlerRootView>
        </AppProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
