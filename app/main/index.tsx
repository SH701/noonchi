"use client";

import Logo from "@/components/etc/Logo";
import Slider from "@/components/main/slider";
import { useAuth } from "@/lib/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import MainCharacter from "../../assets/characters/main.svg";

// ChevronRightIcon component
const ChevronRightIcon = ({ size = 16, color = "#3b82f6" }) => (
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
      d="M9 5l7 7-7 7"
    />
  </Svg>
);

type Profile = {
  id: number;
  email: string;
  nickname: string;
  gender: string;
  birthDate: string;
  role: string;
  provider: string;
  koreanLevel: string;
  profileImageUrl: string;
  interests: string[];
};

export default function Main() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { accessToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!accessToken) {
      setError("로그인이 필요합니다");
      return;
    }

    fetch("https://noonchi.ai.kr/api/users/me", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then(async (res) => {
        const text = await res.text();
        if (!text) {
          throw new Error("서버에서 빈 응답을 받았습니다");
        }
        let data;
        try {
          data = JSON.parse(text);
        } catch (parseError) {
          console.error("JSON 파싱 에러:", parseError);
          throw new Error(`서버 응답을 파싱할 수 없습니다: ${text}`);
        }

        if (!res.ok) {
          throw new Error(data.message || `Error ${res.status}`);
        }

        setProfile(data);
      })
      .catch((err) => {
        console.error("API 요청 에러:", err);
        setError(err.message);
      });
  }, [accessToken]);

  const handleStartConversation = () => {
    router.push("/main/custom");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{
          position: "absolute",
          top: 100,
          right: 20,
          backgroundColor: "red",
          padding: 10,
          zIndex: 999,
        }}
        onPress={async () => {
          await AsyncStorage.clear();
          console.log("AsyncStorage cleared");
          router.replace("/login");
        }}
      >
        <Text style={{ color: "white" }}>Clear Storage</Text>
      </TouchableOpacity>
      <View style={styles.content}>
        <View style={styles.welcomeSection}>
          <View>
            <Logo style={styles.logo} />
          </View>
          <View style={styles.welcomeContent}>
            <View style={styles.welcomeHeader}>
              <View style={styles.welcomeText}>
                <Text style={styles.greeting}>
                  Hi, {profile?.nickname || "비었음"}!
                </Text>
                <Text style={styles.subtitle}>
                  Start a conversation{"\n"}
                  with your partner
                </Text>
              </View>
              <MainCharacter style={styles.characterImage} />
            </View>
            <TouchableOpacity
              style={styles.startButton}
              onPress={handleStartConversation}
            >
              <Text style={styles.startButtonText}>Start Conversation</Text>
              <ChevronRightIcon />
            </TouchableOpacity>
          </View>
        </View>

        {/* 슬라이더 섹션 */}
        <View style={styles.sliderSection}>
          <Slider />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eff6ff", // tailwind: bg-blue-50
  },
  content: {
    flex: 1,
  },
  welcomeSection: {
    flex: 0.35,
    paddingHorizontal: 16,
    paddingTop: 58,
    backgroundColor: "#3B6BF0", // 블루 배경
  },
  logo: {
    width: 112,
    height: 23,
  },
  welcomeContent: {
    flexDirection: "column",
  },
  welcomeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  welcomeText: {
    flexShrink: 1,
    paddingRight: 12,
  },
  greeting: {
    fontWeight: "700",
    color: "white",
    fontSize: 28,
    marginBottom: 8,
  },
  subtitle: {
    color: "white",
    fontSize: 18,
    lineHeight: 22,
  },
  characterImage: {
    width: 135,
    height: 115,
  },
  startButton: {
    marginTop: 20,
    height: 52,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4, // Android shadow
  },
  startButtonText: {
    fontWeight: "600",
    color: "#3b82f6",
    fontSize: 15,
    marginRight: 6, // 아이콘과 간격
  },
  sliderSection: {
    flex: 0.65,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
});
