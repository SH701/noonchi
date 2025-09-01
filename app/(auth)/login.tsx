import { useAuth } from "@/lib/UserContext";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginPage() {
  const { setAccessToken } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleLogin = async () => {
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }
      setAccessToken(data.accessToken);

      const meRes = await fetch("/api/users/me", {
        headers: { Authorization: `Bearer ${data.accessToken}` },
      });
      const me = await meRes.json();

      if (
        me.koreanLevel === null ||
        me.koreanLevel === "null" ||
        me.koreanLevel === undefined
      ) {
        // Navigate to after page
        console.log("Navigate to after page");
      } else {
        setLoading(true);
        setTimeout(() => {
          // Navigate to main page
          console.log("Navigate to main page");
        }, 1500);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 상단 로고 */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/etc/logo_login.svg")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* 로그인 폼 */}
      <View style={styles.formContainer}>
        <View style={styles.formContent}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="example@gmail.com"
              placeholderTextColor="#9ca3af"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#9ca3af"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Sign in</Text>
          </TouchableOpacity>

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>First time here? </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
              <Text style={styles.signupLink}>Create an account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 128,
  },
  logo: {
    width: 200,
    height: 42,
  },
  formContainer: {
    flex: 1,
    justifyContent: "flex-start",
    marginTop: 42,
  },
  formContent: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 4,
  },
  input: {
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    backgroundColor: "#f9fafb",
    fontSize: 16,
  },
  errorText: {
    fontSize: 14,
    color: "#ef4444",
    textAlign: "center",
    marginBottom: 16,
  },
  loginButton: {
    width: "100%",
    paddingVertical: 12,
    backgroundColor: "#2563eb",
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signupText: {
    fontSize: 14,
    color: "#6b7280",
  },
  signupLink: {
    fontSize: 14,
    fontWeight: "500",
    color: "#3b82f6",
  },
});
