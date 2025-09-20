"use client";

import Score from "@/components/main/result/score";
import Section from "@/components/main/result/section";
import Transcript from "@/components/main/result/transscript";
import { Feedback } from "@/lib/types";
import { useAuth } from "@/lib/UserContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Noonchi from "../../../../../assets/characters/Noonchicoach.svg";

// 메시지 타입
type ChatMsg = {
  messageId: number;
  role: "USER" | "AI";
  content: string;
  createdAt: string;
  politenessScore?: number;
  naturalnessScore?: number;
};

// role 정규화
function normalizeRole(role: string): "USER" | "AI" {
  const upper = role.toUpperCase();
  return upper === "USER" ? "USER" : "AI";
}

export default function Result() {
  const [tab, setTab] = useState<"transcript" | "mistakes">("transcript");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [aiName, setAiName] = useState("AI");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { accessToken } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams();
  const conversationId = params?.id as string | undefined;

  // 대화 로그 불러오기
  useEffect(() => {
    if (!conversationId || !accessToken) return;
    (async () => {
      try {
        const res = await fetch(
          `https://noonchi.ai.kr/api/messages?conversationId=${conversationId}&page=1&size=1000`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        if (!res.ok) {
          setError(`대화 정보를 불러올 수 없습니다: ${res.status}`);
          return;
        }
        const data = await res.json();
        const mapped: ChatMsg[] = data.content.map((m: any) => ({
          messageId: m.messageId,
          role: normalizeRole(m.type),
          content: m.content,
          createdAt: m.createdAt,
          politenessScore: m.politenessScore,
          naturalnessScore: m.naturalnessScore,
        }));
        setMessages(mapped);
      } catch (err) {
        setError("네트워크 오류");
      }
    })();
  }, [conversationId, accessToken]);

  // aiPersona 정보 불러오기
  useEffect(() => {
    if (!conversationId || !accessToken) return;
    (async () => {
      try {
        const res = await fetch(
          `https://noonchi.ai.kr/api/conversations/${conversationId}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        if (!res.ok) return;
        const data = await res.json();
        setAiName(data.aiPersona?.name || "AI");
      } catch (err) {
        console.error("aiPersona fetch 실패:", err);
      }
    })();
  }, [conversationId, accessToken]);

  // 피드백 불러오기
  useEffect(() => {
    if (!conversationId || !accessToken) return;
    const loadFeedback = async () => {
      try {
        const res = await fetch(
          `https://noonchi.ai.kr/api/conversations/${conversationId}/feedback`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        if (!res.ok) {
          setError(`Failed to fetch feedback: ${res.status}`);
          return;
        }
        const data: Feedback = await res.json();
        setFeedback(data);
      } catch (err) {
        setError("네트워크 오류");
      } finally {
        setLoading(false);
      }
    };
    loadFeedback();
  }, [conversationId, accessToken]);

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  if (error)
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>{error}</Text>
      </View>
    );
  if (!feedback)
    return (
      <View style={styles.center}>
        <Text>No feedback available</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Hero Section */}
        <View style={styles.hero}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              paddingTop: 40,
            }}
          >
            <Noonchi width={34} height={34} />
            <Text style={styles.heroTitle}>Noonchi coach</Text>
          </View>
          <View style={styles.heroBox}>
            <Text style={styles.heroText}>
              {feedback.overallEvaluation ||
                "You responded appropriately to the situation, but the tone could be more polite."}
            </Text>
            <View style={styles.divider} />
            <Score label="Politeness" value={feedback.politenessScore} />
            <Score label="Naturalness" value={feedback.naturalnessScore} />
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              tab === "transcript" && styles.tabButtonActive,
            ]}
            onPress={() => setTab("transcript")}
          >
            <Text
              style={[
                styles.tabText,
                tab === "transcript" && styles.tabTextActive,
              ]}
            >
              Transcript
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              tab === "mistakes" && styles.tabButtonActive,
            ]}
            onPress={() => setTab("mistakes")}
          >
            <Text
              style={[
                styles.tabText,
                tab === "mistakes" && styles.tabTextActive,
              ]}
            >
              Common Mistakes
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {tab === "transcript" ? (
          <Transcript messages={messages} aiName={aiName} />
        ) : (
          <View style={{paddingHorizontal:16}}>
            <Section
              title="Conversation Summary"
              desc={feedback.summary || ""}
            />
            <Section
              title="What you did well"
              desc={feedback.goodPoints || ""}
            />

            <View style={styles.improveBox}>
              <Text style={styles.improveTitle}>What you can improve</Text>
              <Text style={styles.improveDesc}>
                {feedback.improvementPoints || ""}
              </Text>
              <View style={styles.tryBox}>
                <Text style={styles.tryLabel}>Try</Text>
                <Text style={styles.tryText}>
                  {feedback.improvementExamples || ""}
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Complete Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.completeButton}
          onPress={() => router.push("/main")}
        >
          <Text style={styles.completeText}>Complete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#111827" },
  hero: { padding: 16, backgroundColor: "#EFF6FF" },
  heroTitle: { fontSize: 18, fontWeight: "600", color: "#111827" },
  heroBox: {
    marginTop: 12,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 16,
    padding: 16,
  },
  heroText: { fontSize: 15, color: "#111827", marginBottom: 12 },
  divider: { height: 1, backgroundColor: "#e5e7eb", marginVertical: 8 },
  tabBar: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
  },
  tabButton: { flex: 1, paddingVertical: 12, alignItems: "center" },
  tabButtonActive: { borderBottomWidth: 2, borderColor: "#2563eb" },
  tabText: { fontSize: 14, color: "#6b7280" },
  tabTextActive: { color: "#2563eb", fontWeight: "600" },
  improveBox: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
  },
  improveTitle: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
  improveDesc: { fontSize: 14, color: "#374151", marginBottom: 12 },
  tryBox: { backgroundColor: "#f3f4f6", borderRadius: 12, padding: 12 },
  tryLabel: {
    backgroundColor: "#bfdbfe",
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 12,
    alignSelf: "flex-start",
    marginBottom: 8,
    color: "#1e3a8a",
    fontWeight: "600",
  },
  tryText: { fontSize: 14, color: "#374151" },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "white",
  },
  completeButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  completeText: { color: "white", fontWeight: "600" },
});
