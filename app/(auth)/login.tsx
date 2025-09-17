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
import LogoLogin from "../../assets/etc/logo_login.svg";

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
      const res = await fetch("https://noonchi.ai.kr/api/auth/login", {
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

      const meRes = await fetch("https://noonchi.ai.kr/api/users/me", {
        headers: { Authorization: `Bearer ${data.accessToken}` },
      });
      const me = await meRes.json();

      if (
        me.koreanLevel === null ||
        me.koreanLevel === "null" ||
        me.koreanLevel === undefined
      ) {
        router.push("/after");
      } else {
        setLoading(true);
        setTimeout(() => {
          router.push("/main");
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
        <LogoLogin width={200} height={42} />
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
          <View style={styles.dividerContainer}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.line} />
          </View>
          <View>
            <TouchableOpacity style={styles.kakaoButton}>
              <Image
                source={require("../../assets/images/kakao.png")}
                style={styles.icon}
              />
              <Text>Continue With Kakao</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.googleButton}>
              <Image
                source={require("../../assets/images/google.png")}
                style={styles.icon}
              />
              <Text>Continue With Google</Text>
            </TouchableOpacity>
          </View>
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
    paddingTop: 32,
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
    height: 52,
    justifyContent: "center",
    alignContent: "center",
    backgroundColor: "#2563eb",
    borderRadius: 8,
    alignItems: "center",
  },
  kakaoButton: {
    width: "100%",
    paddingVertical: 12,
    height: 52,
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    backgroundColor: "#FEE502",
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
    fontSize: 14,
    position: "relative",
  },
  googleButton: {
    width: "100%",
    paddingVertical: 12,
    height: 52,
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    alignItems: "center",
    marginBottom: 32,
    fontSize: 14,
    position: "relative",
  },
  icon: {
    position: "absolute",
    left: 32,
    width: 18,
    height: 18,
    resizeMode: "contain",
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
    marginTop: 60,
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
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },

  dividerText: {
    marginHorizontal: 12,
    fontSize: 14,
    fontWeight: "500",
    color: "#1F2937",
  },
});
