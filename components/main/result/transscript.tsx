"use client";

import { useAuth } from "@/lib/UserContext";
import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import HonorificBox from "./honorificbox";

type ChatMsg = {
  messageId: number;
  role: "USER" | "AI";
  content: string;
  feedback?: string;
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
  const [sliderValue, setSliderValue] = useState<Record<string, number>>({});
  const [translated, setTranslated] = useState<string | null>(null);
  const [feedbacks, setFeedbacks] = useState<
    Record<number, { explain: string; appropriateExpression: string }>
  >({});
  const [open, setOpen] = useState<number | null>(null);
  const [openHonoricif, setOpenHonorific] = useState<number | null>(null);
  const [honorificResults, setHonorificResults] = useState<Record<string, any>>(
    {}
  );

  const handleFeedback = async (messageId: string) => {
    try {
      const res = await fetch(`/api/messages/${messageId}/feedback`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Feedback API failed: ${res.status} - ${errorText}`);
      }

      const feedbackData = await res.json();

      setFeedbacks((prev) => ({
        ...prev,
        [Number(messageId)]: {
          explain: feedbackData.explain,
          appropriateExpression: feedbackData.appropriateExpression,
        },
      }));
    } catch (error) {
      console.error("피드백 처리 중 오류 발생:", error);
    }
  };

  const handleHonorific = async (messageId: string) => {
    try {
      const res = await fetch(
        `/api/messages/${messageId}/honorific-variations`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error(`Honorific API failed: ${res.status}`);
      }

      const data = await res.json();
      setHonorificResults((prev) => ({
        ...prev,
        [messageId]: data,
      }));
      setSliderValue((prev) => ({
        ...prev,
        [messageId]: 1,
      }));
    } catch (error) {
      console.error("존댓말 처리 중 오류 발생:", error);
    }
  };

  const handleTranslate = async (messageId: string) => {
    try {
      if (translated) {
        setTranslated(null);
        return;
      }

      const res = await fetch(`/api/messages/${messageId}/translate`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) throw new Error(`Translation API failed: ${res.status}`);

      const data = await res.text();
      setTranslated(data);
    } catch (err) {
      console.error("Translation error:", err);
    }
  };

  const handleTTS = async (messageId: string) => {
    try {
      if (!messageId) return;

      const res = await fetch(`/api/messages/${messageId}/tts`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) {
        throw new Error(`TTS 요청 실패: ${res.status}`);
      }

      const audioUrl = await res.text();

      const audio = new Audio(audioUrl);
      audio.play();

      return audioUrl;
    } catch (err) {
      console.error("handleTTS error:", err);
    }
  };

  const showFeedbackButton = (m: ChatMsg) => {
    if (m.role !== "USER") return false;
    if (
      m.politenessScore === undefined ||
      m.naturalnessScore === undefined ||
      m.politenessScore < 0 ||
      m.naturalnessScore < 0
    ) {
      return false;
    }
    const avg = (m.politenessScore + m.naturalnessScore) / 2;
    return avg <= 80;
  };

  return (
    <View style={styles.container}>
      {messages.map((m) =>
        m.role === "AI" ? (
          <View key={m.messageId} style={styles.aiMessageContainer}>
            {/* AI 메시지 스타일 */}
            <View style={styles.aiMessageBox}>
              <Text style={styles.aiName}>{aiName}</Text>
              <Text style={styles.aiContent}>{m.content}</Text>
              <View style={styles.aiActions}>
                <TouchableOpacity
                  onPress={() => handleTTS(String(m.messageId))}
                  style={styles.actionButton}
                >
                  <Image
                    source={require("../../../assets/etc/volume_up.svg")}
                    style={styles.actionIcon}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleTranslate(String(m.messageId))}
                  style={styles.actionButton}
                >
                  <Image
                    source={require("../../../assets/etc/language.svg")}
                    style={styles.actionIcon}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            </View>
            {translated && (
              <View style={styles.translationBox}>
                <Text style={styles.translationText}>{translated}</Text>
              </View>
            )}
            {openHonoricif === m.messageId && (
              <HonorificBox
                messageId={m.messageId}
                honorificResults={honorificResults}
                sliderValue={sliderValue}
                setSliderValue={setSliderValue}
                style={{ marginTop: -28 }}
              />
            )}
          </View>
        ) : (
          <View key={m.messageId} style={styles.userMessageContainer}>
            <View style={styles.userMessageWrapper}>
              <View style={styles.userMessageRow}>
                <View style={styles.feedbackButtonContainer}>
                  {showFeedbackButton(m) && (
                    <TouchableOpacity
                      onPress={() => {
                        handleFeedback(String(m.messageId));
                        setOpen((prev) =>
                          prev === m.messageId ? null : m.messageId
                        );
                      }}
                      style={styles.feedbackButton}
                    >
                      <Text style={styles.feedbackButtonText}>i</Text>
                    </TouchableOpacity>
                  )}
                </View>
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

                    {/* Honorific Slider 버튼 */}
                    <View style={styles.honorificButtonContainer}>
                      <TouchableOpacity
                        onPress={() => {
                          handleHonorific(String(m.messageId));
                          setOpenHonorific((prev) =>
                            prev === m.messageId ? null : m.messageId
                          );
                        }}
                        style={styles.honorificButton}
                      >
                        <Text style={styles.honorificButtonText}>
                          Honorific Slider
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* 피드백 표시 - 메시지 바로 아래 붙임 */}
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

                  {/* 존댓말 슬라이더 */}
                  {openHonoricif === m.messageId && (
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
    marginTop: -24,
  },
  translationText: {
    color: "#e5e7eb",
    fontFamily: "Pretendard",
    fontSize: 14,
    lineHeight: 20,
  },
  userMessageContainer: {
    flexDirection: "column",
    width: "100%",
  },
  userMessageWrapper: {
    justifyContent: "flex-end",
    width: "100%",
    marginTop: 12,
  },
  userMessageRow: {
    flexDirection: "row",
    gap: 8,
    width: 240,
  },
  feedbackButtonContainer: {
    width: 18,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    height: 74,
  },
  feedbackButton: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: "#ef4444",
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "rgba(0,0,0,0.1)",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
    padding: 12,
    borderRadius: 12,
    shadowColor: "rgba(0,0,0,0.1)",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    zIndex: 30,
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
    justifyContent: "flex-end",
    marginTop: 8,
  },
  honorificButton: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 12,
    borderRadius: 4,
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
    elevation: 2,
    marginTop: -24,
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
