/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import ProfileChange from "@/components/afterlogin/ProfileChange";
import Loading from "@/components/etc/Loading";
import { slides } from "@/lib/setting";
import { Interest, Level, useAuth } from "@/lib/UserContext";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const levelImg: Record<Level, string> = {
  BEGINNER: "/circle/circle1.png",
  INTERMEDIATE: "/circle/circle2.png",
  ADVANCED: "/circle/circle3.png",
};

export default function AfterPage() {
  const {
    koreanLevel,
    setKoreanLevel,
    profileImageUrl,
    interests,
    setInterests,
  } = useAuth();
  const { accessToken } = useAuth();
  const [current, setCurrent] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const canSubmit =
    current < 2 || (koreanLevel && profileImageUrl && interests.length > 0);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const onNext = () => {
    if (current < 2) {
      setCurrent(current + 1);
    } else {
      goMain();
    }
  };

  const goMain = async () => {
    setError(null);
    setSubmitting(true);
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
      const res = await fetch("/api/users/me/profile", {
        method: "PUT",
        headers,
        credentials: "include",
        body: JSON.stringify({ koreanLevel, profileImageUrl, interests }),
      });

      const ct = res.headers.get("content-type") || "";
      const data = ct.includes("application/json")
        ? await res.json()
        : await res.text();

      if (!res.ok) {
        setError(
          typeof data === "string"
            ? data
            : data?.message || "설정에 실패했습니다."
        );
        return;
      }

      console.log("Navigate to main");
    } catch (e) {
      console.error(e);
      setError("알 수 없는 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (loading || submitting) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {current === 0 && "Korean Level"}
          {current === 1 && "Profile Image"}
          {current === 2 && "Interests"}
        </Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {current === 0 && (
          <View style={styles.slideContent}>
            <Text style={styles.slideTitle}>What`s your Korean level?</Text>
            <Text style={styles.slideDescription}>
              Choose your current Korean proficiency level
            </Text>
            {/* Korean Level Selection */}
            <View style={styles.levelContainer}>
              {Object.entries(levelImg).map(([level, img]) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.levelOption,
                    koreanLevel === level && styles.levelOptionSelected,
                  ]}
                  onPress={() => setKoreanLevel(level as Level)}
                >
                  <Image
                    source={require("../assets/characters/character1.png")}
                    style={styles.levelImage}
                    resizeMode="contain"
                  />
                  <Text
                    style={[
                      styles.levelText,
                      koreanLevel === level && styles.levelTextSelected,
                    ]}
                  >
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {current === 1 && (
          <View style={styles.slideContent}>
            <Text style={styles.slideTitle}>Choose your profile image</Text>
            <Text style={styles.slideDescription}>
              Select an avatar that represents you
            </Text>
            <ProfileChange />
          </View>
        )}

        {current === 2 && (
          <View style={styles.slideContent}>
            <Text style={styles.slideTitle}>What are your interests?</Text>
            <Text style={styles.slideDescription}>
              Select topics you`re interested in
            </Text>
            {/* Interests Selection */}
            <View style={styles.interestsContainer}>
              {slides[2].options?.map((interest: Interest) => (
                <TouchableOpacity
                  key={interest}
                  style={[
                    styles.interestOption,
                    interests.includes(interest) &&
                      styles.interestOptionSelected,
                  ]}
                  onPress={() => {
                    if (interests.includes(interest)) {
                      setInterests(interests.filter((i) => i !== interest));
                    } else {
                      setInterests([...interests, interest]);
                    }
                  }}
                >
                  <Text
                    style={[
                      styles.interestText,
                      interests.includes(interest) &&
                        styles.interestTextSelected,
                    ]}
                  >
                    {interest}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        {error && <Text style={styles.errorText}>{error}</Text>}
        <TouchableOpacity
          style={[
            styles.nextButton,
            canSubmit ? styles.nextButtonEnabled : styles.nextButtonDisabled,
          ]}
          onPress={onNext}
          disabled={!canSubmit}
        >
          <Text
            style={[
              styles.nextButtonText,
              canSubmit
                ? styles.nextButtonTextEnabled
                : styles.nextButtonTextDisabled,
            ]}
          >
            {current === 2 ? "Complete" : "Next"}
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
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
  },
  content: {
    flex: 1,
  },
  slideContent: {
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  slideTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },
  slideDescription: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 32,
    textAlign: "center",
  },
  levelContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 32,
  },
  levelOption: {
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e5e7eb",
  },
  levelOptionSelected: {
    borderColor: "#2563eb",
    backgroundColor: "#eff6ff",
  },
  levelImage: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  levelText: {
    fontSize: 14,
    color: "#6b7280",
  },
  levelTextSelected: {
    color: "#2563eb",
    fontWeight: "500",
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 32,
  },
  interestOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "white",
  },
  interestOptionSelected: {
    borderColor: "#2563eb",
    backgroundColor: "#2563eb",
  },
  interestText: {
    fontSize: 14,
    color: "#6b7280",
  },
  interestTextSelected: {
    color: "white",
    fontWeight: "500",
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  errorText: {
    color: "#ef4444",
    textAlign: "center",
    marginBottom: 16,
  },
  nextButton: {
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
