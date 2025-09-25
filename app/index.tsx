import Onboard from "@/components/onboard/onboard";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useAuth } from "../lib/UserContext";

export default function OnboardScreen() {
  const { accessToken, user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && accessToken && user) {
      router.push("/main");
    }
  }, [isLoading, accessToken, user]);

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  // 인증된 사용자는 로딩 화면 유지 (곧 main으로 이동)
  if (accessToken && user) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  // 미인증 사용자는 온보드 화면 표시
  return (
    <View style={styles.container}>
      <Onboard />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
