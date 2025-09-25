import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "../lib/UserContext";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({});

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false, animation: "none" }}>
          <Stack.Screen name="index" options={{ title: "Onboard" }} />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="main" />
          <Stack.Screen name="after" />
        </Stack>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
