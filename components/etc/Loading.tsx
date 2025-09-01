import Logo from "@/components/etc/Logo"; 
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3b82f6", // blue-500
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  title: {
    fontSize: 48,
    color: "white",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 24,
    color: "#d1d5db", // gray-300
  },
});

export default function LoadingPage() {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      <Text style={styles.subtitle}>Loading your Noonchi Coach{dots}</Text>
      <Logo style={{ width: 300, height: 80 }} />
    </View>
  );
}

