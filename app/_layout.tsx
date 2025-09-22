import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "../lib/UserContext";

SplashScreen.preventAutoHideAsync();

function AppStack() {
  const { accessToken, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (accessToken) {
        router.replace("/main");
      } else {
        router.replace("/");
      }
    }
  }, [isLoading, accessToken]);

  if (isLoading) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "Onboard" }} />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="main" />
      <Stack.Screen name="after" />
    </Stack>
  );
}

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
        <AppStack />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
