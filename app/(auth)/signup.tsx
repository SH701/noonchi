"use client";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";

// ChevronLeftIcon component
const ChevronLeftIcon = ({ size = 24, color = "#6b7280" }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
  >
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 19l-7-7 7-7"
    />
  </Svg>
);

export default function SignupStep1() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [agree, setAgree] = useState(false);
  const router = useRouter();
  const canNext = email.includes("@") && pw.length >= 8 && pw === pw2 && agree;

  const goNext = async () => {
    if (!canNext) return;
    try {
      await AsyncStorage.setItem("signupEmail", email);
      await AsyncStorage.setItem("signupPassword", pw);
      router.push("/(auth)/signup-detail");
    } catch (error) {
    }
  };

  const goBack = () => {
    router.push("/(auth)/login");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <ChevronLeftIcon />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Create account</Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <View style={styles.formContainer}>
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
              value={pw}
              onChangeText={setPw}
              secureTextEntry
            />
            <TextInput
              style={styles.input}
              placeholder="Re-enter your password"
              placeholderTextColor="#9ca3af"
              value={pw2}
              onChangeText={setPw2}
              secureTextEntry
            />
            <Text style={styles.passwordHint}>
              8–16 characters, include letters & numbers
            </Text>
          </View>

          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              style={[styles.checkbox, agree && styles.checkboxChecked]}
              onPress={() => setAgree(!agree)}
            >
              {agree && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
            <View style={styles.termsContainer}>
              <Text style={styles.termsText}>
                Agree with <Text style={styles.link}>Terms of use</Text> and our{" "}
                <Text style={styles.link}>privacy policy</Text>
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Footer Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          disabled={!canNext}
          onPress={goNext}
          style={[
            styles.nextButton,
            canNext ? styles.nextButtonEnabled : styles.nextButtonDisabled,
          ]}
        >
          <Text
            style={[
              styles.nextButtonText,
              canNext
                ? styles.nextButtonTextEnabled
                : styles.nextButtonTextDisabled,
            ]}
          >
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignSelf: "center",
    paddingTop: 40,
    width: "100%",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    position: "absolute",
    left: "50%",
    transform: [{ translateX: -50 }],
    fontSize: 20,
    fontWeight: "600",
    color: "#1f2937",
  },
  content: {
    flex: 1,
  },
  formContainer: {
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  inputGroup: {
    marginBottom: 32,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    fontSize: 16,
    marginBottom: 16,
  },
  passwordHint: {
    fontSize: 14,
    color: "#316CEC",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 32,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 4,
    marginRight: 12,
    marginTop: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
  },
  checkmark: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  termsContainer: {
    flex: 1,
  },
  termsText: {
    fontSize: 13.5,
    color: "#374151",
    lineHeight: 20,
  },
  link: {
    textDecorationLine: "underline",
    color: "#000000",
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  nextButton: {
    width: "100%",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  nextButtonEnabled: {
    backgroundColor: "#2563eb",
  },
  nextButtonDisabled: {
    backgroundColor: "#d1d5db",
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  nextButtonTextEnabled: {
    color: "white",
  },
  nextButtonTextDisabled: {
    color: "#6b7280",
  },
});
