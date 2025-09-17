"use client";

import { useAuth } from "@/lib/UserContext";
import { useRouter } from "expo-router";
import {
  BarChart,
  ChevronRightIcon,
  FileText,
  User,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Profile = {
  id: number;
  email: string;
  nickname: string;
  gender: string;
  birthDate: string;
  role: string;
  provider: string;
  klevel: number;
  sentenceCount: number;
  profileImageUrl: string;
  interests: string[];
};

export default function ProfilePage() {
  const { accessToken } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) {
      setError("로그인이 필요합니다");
      setLoading(false);
      return;
    }

    fetch("https://noonchi.ai.kr/api/users/me", {
      method: "GET",
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
      })
      .finally(() => setLoading(false));
  }, [accessToken]);

  const handleLogout = async () => {
    try {
      await fetch("https://noonchi.ai.kr/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: "" }), // 필요시 로컬 저장소에서 가져오기
      });
    } catch (err) {
      console.error("Logout failed:", err);
    }
    router.replace("/login");
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;
  if (error)
    return (
      <Text style={{ color: "red", textAlign: "center", marginTop: 40 }}>
        Error: {error}
      </Text>
    );
  if (!profile)
    return (
      <Text style={{ textAlign: "center", marginTop: 40 }}>
        No profile data
      </Text>
    );

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* 프로필 */}
        <View style={styles.profileBox}>
          <View style={styles.avatarWrapper}>
            {profile.profileImageUrl ? (
              <Image
                source={{ uri: profile.profileImageUrl }}
                style={styles.avatar}
              />
            ) : (
              <View style={[styles.avatar, { backgroundColor: "#E5E7EB" }]} />
            )}
          </View>

          <TouchableOpacity
            onPress={() => router.push("/profile/edit" as any)}
            style={styles.nameBox}
          >
            <Text style={styles.name}>{profile.nickname}</Text>
            <ChevronRightIcon size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
        {/* 통계 카드 */}
        <View style={styles.card}>
          <View style={styles.cardItem}>
            <Text style={styles.cardLabel}>Studied Sentence</Text>
            <Text style={styles.cardValue}>{profile.sentenceCount}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.cardItem}>
            <Text style={styles.cardLabel}>K-Level</Text>
            <Text style={styles.cardValue}>{profile.klevel}</Text>
          </View>
        </View>
        {/* 메뉴 */}
        <View style={styles.menu}>
          {[
            {
              href: "/profile/manage",
              icon: <User size={20} color="#4B5563" />,
              label: "Manage Account",
            },
            {
              href: "/profile/difficulty",
              icon: <BarChart size={20} color="#4B5563" />,
              label: "Difficulty",
            },
            {
              href: "/terms",
              icon: <FileText size={20} color="#4B5563" />,
              label: "Terms of Service / Licenses",
            },
          ].map(({ href, icon, label }, idx) => (
            <TouchableOpacity
              key={label}
              onPress={() => router.push(href as any)}
              style={[
                styles.menuItem,
                idx !== 2 && {
                  borderBottomWidth: 1,
                  borderBottomColor: "#E5E7EB",
                },
              ]}
            >
              <View style={styles.menuLeft}>
                <View style={styles.iconBox}>{icon}</View>
                <Text style={styles.menuLabel}>{label}</Text>
              </View>
              <ChevronRightIcon size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>
        if (error) return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ color: "red", textAlign: "center", marginBottom: 20 }}>
            Error: {error}
          </Text>
          {/* 에러 상황에서도 로그아웃 버튼 표시 */}
          <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Log out</Text>
          </TouchableOpacity>
        </View>
        );
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    backgroundColor: "#fff",
  },
  headerTitle: { fontSize: 20, fontWeight: "600", color: "#111827" },
  profileBox: { alignItems: "center", paddingVertical: 20 },
  avatarWrapper: { marginBottom: 12 },
  avatar: { width: 120, height: 120, borderRadius: 60 },
  nameBox: { flexDirection: "row", alignItems: "center" },
  name: { fontSize: 20, fontWeight: "600", marginRight: 6 },
  card: {
    flexDirection: "row",
    backgroundColor: "#EFF6FF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    marginHorizontal: 16,
    padding: 20,
    justifyContent: "space-around",
  },
  cardItem: { alignItems: "center", flex: 1 },
  cardLabel: { fontSize: 14, color: "#2563EB", marginBottom: 4 },
  cardValue: { fontSize: 22, fontWeight: "700", color: "#111827" },
  divider: { width: 1, backgroundColor: "#BFDBFE", marginHorizontal: 8 },
  menu: {
    marginTop: 24,
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#fff",
  },
  menuLeft: { flexDirection: "row", alignItems: "center" },
  iconBox: {
    width: 40,
    height: 40,
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuLabel: { fontSize: 16, color: "#111827" },
  logoutBtn: { marginTop: 24, marginHorizontal: 16 },
  logoutText: {
    textAlign: "center",
    fontSize: 16,
    color: "#6B7280",
    textDecorationLine: "underline",
  },
});
