import { useAuth } from "@/lib/Token";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Loading from "../etc/Loading";
export const dynamic = "force-dynamic";

export default function SignupStep2() {
  const router = useRouter();

  const { setAccessToken } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState<"MALE" | "FEMALE">("MALE");
  const [, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const canSubmit = name.trim() !== "" && birthDate !== "";

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedEmail = (await AsyncStorage.getItem("signupEmail")) || "";
        const storedPassword =
          (await AsyncStorage.getItem("signupPassword")) || "";

        setEmail(storedEmail);
        setPassword(storedPassword);
      } catch (err) {
        console.error("Failed to load signup data:", err);
      }
    };

    loadData();
  }, []);

  const parseJsonSafe = async (res: Response) => {
    const ct = res.headers.get("content-type") || "";
    return ct.includes("application/json") ? res.json() : {};
  };

  const handleSignup = async () => {
    if (!canSubmit) return;
    setError(null);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          nickname: name,
          gender,
          birthDate,
        }),
      });

      const data = await parseJsonSafe(res);
      if (!res.ok) {
        setError(data?.message || "Signup failed");
        return;
      }

      const token = data?.accessToken;
      if (!token) {
        setError("토큰이 없습니다. 관리자에게 문의하세요.");
        return;
      }

      setAccessToken(token);
      localStorage.setItem("accessToken", token);

      // ✅ 로딩 표시 후 1.5초 뒤 이동
      setLoading(true);
      setTimeout(() => {
        router.push("/after");
      }, 1500);
    } catch {
      setError("Something went wrong");
    }
  };

  // ✅ 로딩 중일 때 화면
  if (loading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Enter your details</Text>
        <Text style={styles.subtitle}>
          Enter it exactly as shown on your ID
        </Text>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            placeholderTextColor="#9ca3af"
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* Birth date */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Birth date</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#9ca3af"
            value={birthDate}
            onChangeText={(text) => {
              let v = text.replace(/\D/g, ""); // 숫자만 추출
              if (v.length > 4) v = v.slice(0, 4) + "-" + v.slice(4);
              if (v.length > 7) v = v.slice(0, 7) + "-" + v.slice(7);
              setBirthDate(v);
            }}
            keyboardType="numeric"
          />
        </View>

        {/* Gender toggle */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Gender</Text>
          <View style={styles.genderContainer}>
            {(["MALE", "FEMALE"] as const).map((g) => (
              <TouchableOpacity
                key={g}
                style={[
                  styles.genderButton,
                  gender === g
                    ? styles.selectedGender
                    : styles.unselectedGender,
                ]}
                onPress={() => setGender(g)}
              >
                <Text
                  style={[
                    styles.genderText,
                    gender === g
                      ? styles.selectedGenderText
                      : styles.unselectedGenderText,
                  ]}
                >
                  {g === "MALE" ? "Male" : "Female"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Footer Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            canSubmit ? styles.enabledButton : styles.disabledButton,
          ]}
          onPress={handleSignup}
          disabled={!canSubmit}
        >
          <Text
            style={[
              styles.submitButtonText,
              canSubmit ? styles.enabledButtonText : styles.disabledButtonText,
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
    paddingTop: 40,
    width: "100%",
    alignSelf: "center",
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingTop: 32,
    backgroundColor: "white",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1f2937",
    textAlign: "left",
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "normal",
    color: "#6b7280",
    textAlign: "left",
    marginTop: 8,
    lineHeight: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  inputGroup: {
    marginBottom: 24,
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
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    backgroundColor: "#f9fafb",
    fontSize: 16,
  },
  genderContainer: {
    flexDirection: "row",
    gap: 16,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedGender: {
    backgroundColor: "#eff6ff",
    borderColor: "#2563eb",
  },
  unselectedGender: {
    backgroundColor: "white",
    borderColor: "#e5e7eb",
  },
  genderText: {
    fontSize: 16,
    fontWeight: "500",
  },
  selectedGenderText: {
    color: "#2563eb",
  },
  unselectedGenderText: {
    color: "#374151",
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  submitButton: {
    width: "100%",
    maxHeight: 52,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  enabledButton: {
    backgroundColor: "#2563eb",
  },
  disabledButton: {
    backgroundColor: "#d1d5db",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  enabledButtonText: {
    color: "white",
  },
  disabledButtonText: {
    color: "#6b7280",
  },
});
