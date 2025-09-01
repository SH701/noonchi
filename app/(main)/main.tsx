"use client";

import Logo from "@/components/etc/Logo";
import Slider from "@/components/main/slider";
import { useAuth } from "@/lib/UserContext";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";

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

  useEffect(() => {
    if (!accessToken) {
      setError("로그인이 필요합니다");
      return;
    }
    fetch("/api/users/me", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || `Error ${res.status}`);
        setProfile(data);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      });
  }, [accessToken]);

  const handleStartConversation = () => {
    console.log("Navigate to custom conversation");
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 메인 콘텐츠 */}
      <View style={styles.content}>
        {/* 환영 섹션 - 전체 너비 */}
        <View style={styles.welcomeSection}>
          <View style={styles.logoContainer}>
            <Logo />
          </View>
          <View style={styles.welcomeContent}>
            <View style={styles.welcomeHeader}>
              <View style={styles.welcomeText}>
                <Text style={styles.greeting}>
                  Hi, {profile?.nickname || "Noonchi"}!
                </Text>
                <Text style={styles.subtitle}>
                  Start a conversation{"\n"}
                  with your partner
                </Text>
              </View>
              <Image
                source={require("../../assets/characters/main.svg")}
                style={styles.characterImage}
                resizeMode="contain"
              />
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eff6ff",
  },
  content: {
    flex: 1,
    paddingBottom: 153, // Tab bar height + safe area
  },
  welcomeSection: {
    width: "100%",
    paddingHorizontal: 28,
    paddingVertical: 24,
    backgroundColor: "#3B6BF0",
  },
  logoContainer: {
    marginBottom: 8,
  },
  welcomeContent: {
    flexDirection: "column",
    gap: 8,
  },
  welcomeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 32,
  },
  welcomeText: {
    flexDirection: "column",
    gap: 16,
  },
  greeting: {
    fontWeight: "bold",
    color: "white",
    fontSize: 24,
    lineHeight: 31.2,
    paddingTop: 12,
  },
  subtitle: {
    color: "white",
    lineHeight: 20.8,
  },
  characterImage: {
    width: 135,
    height: 109,
  },
  startButton: {
    marginTop: 4,
    height: 52,
    paddingHorizontal: 20,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "white",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  startButtonText: {
    fontWeight: "600",
    color: "#3b82f6",
    fontSize: 14,
  },
  sliderSection: {
    paddingHorizontal: 16,
  },
});
