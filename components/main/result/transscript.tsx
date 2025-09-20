"use client";

import { useAuth } from "@/lib/UserContext";
import { Audio } from "expo-av";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Language from "../../../assets/etc/language.svg";
import Volume from "../../../assets/etc/volume_up.svg";
import HonorificBox from "./honorificbox";

type ChatMsg = {
  messageId: number;
  role: "USER" | "AI";
  content: string;
  feedback?: { explain: string; appropriateExpression: string };
  politenessScore?: number;
  naturalnessScore?: number;
};

export default function Transcript({
  messages,
  aiName,
}: {
  messages: ChatMsg[];
  aiName: string;
}) {
  const { accessToken } = useAuth();

  // 로딩 상태
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [sliderValue, setSliderValue] = useState<Record<string, number>>({});
  const [translated, setTranslated] = useState<Record<string, string | null>>(
    {}
  );
  const [feedbacks, setFeedbacks] = useState<
    Record<number, { explain: string; appropriateExpression: string }>
  >({});
  const [open, setOpen] = useState<number | null>(null);
  const [openHonorific, setOpenHonorific] = useState<number | null>(null);
  const [honorificResults, setHonorificResults] = useState<Record<string, any>>(
    {}
  );

  /** Feedback */
  const handleFeedback = async (messageId: string) => {
    setLoading((prev) => ({ ...prev, [messageId]: true }));
    try {
      const res = await fetch(
        `https://noonchi.ai.kr/api/messages/${messageId}/feedback`,
        { method: "POST", headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (!res.ok) throw new Error(`Feedback API failed: ${res.status}`);
      const feedbackData = await res.json();
      setFeedbacks((prev) => ({
        ...prev,
        [Number(messageId)]: {
          explain: feedbackData.explain,
          appropriateExpression: feedbackData.appropriateExpression,
        },
      }));
    } catch (err) {
      console.error("피드백 오류:", err);
    } finally {
      setLoading((prev) => ({ ...prev, [messageId]: false }));
    }
  };

  /** Honorific */
  const handleHonorific = async (messageId: string) => {
    setLoading((prev) => ({ ...prev, [messageId]: true }));
    try {
      const res = await fetch(
        `https://noonchi.ai.kr/api/messages/${messageId}/honorific-variations`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (!res.ok) throw new Error(`Honorific API failed: ${res.status}`);
      const data = await res.json();
      setHonorificResults((prev) => ({ ...prev, [messageId]: data }));
      setSliderValue((prev) => ({ ...prev, [messageId]: 1 }));
    } catch (err) {
      console.error("존댓말 오류:", err);
    } finally {
      setLoading((prev) => ({ ...prev, [messageId]: false }));
    }
  };

  /** Translate */
  const handleTranslate = async (messageId: string) => {
    setLoading((prev) => ({ ...prev, [messageId]: true }));
    try {
      if (translated[messageId]) {
        setTranslated((prev) => ({ ...prev, [messageId]: null }));
        return;
      }
      const res = await fetch(
        `https://noonchi.ai.kr/api/messages/${messageId}/translate`,
        { method: "PUT", headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (!res.ok) throw new Error(`Translate API failed: ${res.status}`);
      const data = await res.text();
      setTranslated((prev) => ({ ...prev, [messageId]: data }));
    } catch (err) {
      console.error("번역 오류:", err);
    } finally {
      setLoading((prev) => ({ ...prev, [messageId]: false }));
    }
  };

  /** TTS */
  const handleTTS = async (messageId: string) => {
    setLoading((prev) => ({ ...prev, [messageId]: true }));
    try {
      const res = await fetch(
        `https://noonchi.ai.kr/api/messages/${messageId}/tts`,
        { method: "PUT", headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (!res.ok) throw new Error(`TTS API failed: ${res.status}`);
      const audioUrl = await res.text();
      const { sound } = await Audio.Sound.createAsync({ uri: audioUrl });
      await sound.playAsync();
    } catch (err) {
      console.error("TTS 오류:", err);
    } finally {
      setLoading((prev) => ({ ...prev, [messageId]: false }));
    }
  };

  // i 버튼 조건
  const showFeedbackButton = (m: ChatMsg) => {
    if (m.role !== "USER") return false;
    if ((m.politenessScore ?? -1) < 0 || (m.naturalnessScore ?? -1) < 0)
      return false;
    const avg = (m.politenessScore! + m.naturalnessScore!) / 2;
    return avg <= 80;
  };

  // iOS 무음 모드에서도 재생
  useEffect(() => {
    const init = async () => {
      await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
    };
    init();
  }, []);

  return (
    <View style={styles.container}>
      {messages.map((m) =>
        m.role === "AI" ? (
          <View key={m.messageId} style={styles.aiMessageContainer}>
            <View style={styles.aiMessageBox}>
              <Text style={styles.aiName}>{aiName}</Text>
              <Text style={styles.aiContent}>{m.content}</Text>
              <View style={styles.aiActions}>
                <TouchableOpacity
                  onPress={() => handleTTS(String(m.messageId))}
                  disabled={loading[m.messageId]}
                  style={styles.actionButton}
                >
                  {loading[m.messageId] ? (
                    <ActivityIndicator size="small" color="#3b82f6" />
                  ) : (
                    <Volume style={styles.actionIcon} />
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleTranslate(String(m.messageId))}
                  disabled={loading[m.messageId]}
                  style={styles.actionButton}
                >
                  {loading[m.messageId] ? (
                    <ActivityIndicator size="small" color="#3b82f6" />
                  ) : (
                    <Language style={styles.actionIcon} />
                  )}
                </TouchableOpacity>
              </View>
            </View>
            {translated[m.messageId] && (
              <View style={styles.translationBox}>
                <Text style={styles.translationText}>
                  {translated[m.messageId]}
                </Text>
              </View>
            )}
          </View>
        ) : (
          <View key={m.messageId} style={styles.userMessageContainer}>
            <View style={styles.userMessageRow}>
              {showFeedbackButton(m) && (
                <TouchableOpacity
                  onPress={() => {
                    handleFeedback(String(m.messageId));
                    setOpen((prev) =>
                      prev === m.messageId ? null : m.messageId
                    );
                  }}
                  disabled={loading[m.messageId]}
                  style={[
                    styles.feedbackButton,
                    loading[m.messageId] && { borderWidth: 0 },
                  ]}
                >
                  {loading[m.messageId] ? (
                    <ActivityIndicator size="small" color="#ef4444" />
                  ) : (
                    <Text style={styles.feedbackButtonText}>i</Text>
                  )}
                </TouchableOpacity>
              )}
              <View style={styles.userMessageContent}>
                <View
                  style={[
                    styles.userMessageBox,
                    showFeedbackButton(m)
                      ? styles.userMessageBoxWithFeedback
                      : styles.userMessageBoxNormal,
                  ]}
                >
                  <Text style={styles.userContent}>{m.content}</Text>
                  <View style={styles.honorificButtonContainer}>
                    <TouchableOpacity
                      onPress={() => handleHonorific(String(m.messageId))}
                      disabled={loading[m.messageId]}
                      style={styles.honorificButton}
                    >
                      {loading[m.messageId] ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <Text style={styles.honorificButtonText}>
                          Honorific Slider
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
                {open === m.messageId && (
                  <View style={styles.feedbackBox}>
                    <Text style={styles.appropriateExpression}>
                      {feedbacks[m.messageId]?.appropriateExpression}
                    </Text>
                    <Text style={styles.feedbackExplain}>
                      {feedbacks[m.messageId]?.explain}
                    </Text>
                  </View>
                )}
                {openHonorific === m.messageId && (
                  <HonorificBox
                    messageId={m.messageId}
                    honorificResults={honorificResults}
                    sliderValue={sliderValue}
                    setSliderValue={setSliderValue}
                  />
                )}
              </View>
            </View>
          </View>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  aiMessageContainer: {
    flexDirection: "column",
    justifyContent: "flex-start",
    gap: 16,
  },
  aiMessageBox: {
    width: 240,
    backgroundColor: "#f9fafb",
    marginVertical: 12,
    marginHorizontal: 18,
    padding: 12,
    borderRadius: 12,
    shadowColor: "rgba(0,0,0,0.1)",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#e5e7eb",

    zIndex: 20,
  },
  aiName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: 8,
    fontFamily: "Pretendard",
  },
  aiContent: {
    fontSize: 14,
    fontFamily: "Pretendard",
    lineHeight: 20,

    color: "#111827",
  },
  aiActions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#9ca3af",
    paddingTop: 8,
  },
  actionButton: {
    cursor: "pointer",
  },
  actionIcon: {
    width: 20,
    height: 20,
  },
  translationBox: {
    padding: 16,
    backgroundColor: "#4b5563",
    shadowColor: "rgba(0,0,0,0.1)",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    width: 240,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    marginTop: -40,
    marginLeft: 18,
  },
  translationText: {
    color: "#e5e7eb",
    fontFamily: "Pretendard",
    fontSize: 14,
    lineHeight: 20,
  },
  userMessageContainer: {
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    width: "100%",
  },
  userMessageWrapper: {
    justifyContent: "flex-end",
    width: "100%",
    marginTop: 12,
  },
  userMessageRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
    maxWidth: "80%",
  },
  feedbackButton: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: "#ef4444",
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "flex-end",
    shadowColor: "rgba(0,0,0,0.1)",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginLeft: 25,
    elevation: 2,
    backgroundColor: "transparent",
  },
  feedbackButtonText: {
    color: "#ef4444",
    fontSize: 12,
    fontWeight: "bold",
    lineHeight: 12,
  },
  userMessageContent: {
    flexDirection: "column",
    flex: 1,
  },
  userMessageBox: {
    backgroundColor: "white",
    marginHorizontal: 18,
    padding: 12,
    borderRadius: 12,
    shadowColor: "rgba(0,0,0,0.1)",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    zIndex: 30,
    width: 240,
    alignSelf: "flex-end",
  },
  userMessageBoxNormal: {
    borderColor: "#e5e7eb",
  },
  userMessageBoxWithFeedback: {
    borderColor: "#ef4444",
  },
  userContent: {
    fontSize: 14,
    fontFamily: "Pretendard",
    lineHeight: 20,
    color: "black",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#9ca3af",
  },
  honorificButtonContainer: {
    alignItems: "flex-end",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  honorificButton: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 4,
    paddingVertical: 4,
    marginTop: 8,
    borderRadius: 9999,
  },
  honorificButtonText: {
    color: "white",
    fontSize: 12,
    fontFamily: "Pretendard",
  },
  feedbackBox: {
    padding: 16,
    backgroundColor: "#4b5563",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    shadowColor: "rgba(0,0,0,0.1)",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    width: 239,
    elevation: 2,
    marginTop: -24,
    marginLeft: 6,
  },
  appropriateExpression: {
    color: "white",
    fontFamily: "Pretendard",
    fontSize: 14,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#9ca3af",
    paddingTop: 16,
  },
  feedbackExplain: {
    color: "#e5e7eb",
    fontFamily: "Pretendard",
    fontSize: 14,
    paddingTop: 8,
  },
});
