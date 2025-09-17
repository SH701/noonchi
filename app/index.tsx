import Onboard from "@/components/onboard/onboard";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useAuth } from "../lib/UserContext";

export default function OnboardScreen() {
  const { accessToken, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading) {
      setTimeout(() => {
        if (accessToken) {
          router.replace("/main");
        } else {
          router.replace("/(auth)/login");
        }
      }, 1500);
    }
  }, [accessToken, loading]);
  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#3b82f6" />
      ) : (
        <Onboard />
      )}
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
