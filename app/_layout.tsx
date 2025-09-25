import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "../lib/UserContext";

SplashScreen.preventAutoHideAsync();

function AppStack() {
  const { accessToken, user, isLoading } = useAuth();

  if (isLoading && accessToken && user) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  const isAuthenticated = accessToken && user;

  // 인증 상태에 따라 다른 스택 구조 렌더링
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        // 인증된 사용자: main을 첫 번째로
        <>
          <Stack.Screen name="main" />
          <Stack.Screen name="index" options={{ title: "Onboard" }} />
        </>
      ) : (
        // 미인증 사용자: index를 첫 번째로
        <>
          <Stack.Screen name="index" options={{ title: "Onboard" }} />
          <Stack.Screen name="main" />
        </>
      )}
      <Stack.Screen name="(auth)" />
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
