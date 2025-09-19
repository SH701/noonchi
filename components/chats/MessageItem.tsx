"use client";

import { MyAI } from "@/lib/types";
import { useAuth } from "@/lib/UserContext";
import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import Language from "../../assets/etc/language.svg";
import Volume from "../../assets/etc/volume_up.svg";
import HonorificSlider, { HonorificResults } from "./HonorificSlider";

type MessageItemProps = {
  m: any;
  myAI: MyAI | null;
  isMine: boolean;
  isFeedbackOpen: boolean;
  feedbackOpenId: string | null;
  honorificResults: Record<string, Record<number, HonorificResults>>;
  sliderValues: Record<string, number>;
  handleFeedbacks: (messageId: string) => void;
  handleHonorific: (
    messageId: string,
    content: string,
    aiRole?: string
  ) => Promise<void>;
  setSliderValues: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  messageStatus?: "default" | "error";
};

// Spinner Icon
const SpinnerIcon = ({ size = 16, color = "#6b7280" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle
      cx="12"
      cy="12"
      r="10"
      stroke={color}
      strokeWidth="4"
      opacity={0.25}
    />
    <Path fill={color} opacity={0.75} d="M4 12a8 8 0 018-8v8H4z" />
  </Svg>
);

export default function MessageItem({
  m,
  myAI,
  isMine,
  isFeedbackOpen,
  honorificResults,
  sliderValues,
  handleFeedbacks,
  handleHonorific,
  setSliderValues,
  messageStatus = "default",
}: MessageItemProps) {
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [loadingFeedbacks, setLoadingFeedbacks] = useState<
    Record<string, boolean>
  >({});
  const [translated, setTranslated] = useState<string | null>(null);
  const [loadingTranslate, setLoadingTranslate] = useState<
    Record<string, boolean>
  >({});
  const [loadingTTs, setLoadingTTS] = useState<Record<string, boolean>>({});
  const { accessToken } = useAuth();
  const showFeedbackButton =
    isMine &&
    (m.politenessScore ?? -1) >= 0 &&
    (m.naturalnessScore ?? -1) >= 0 &&
    (m.politenessScore + m.naturalnessScore) / 2 <= 80;

  const handleClick = async () => {
    setLoading((prev) => ({ ...prev, [m.messageId]: true }));
    await handleHonorific(m.messageId, m.content, myAI?.aiRole);
    setLoading((prev) => ({ ...prev, [m.messageId]: false }));
  };
  const handleFeedbackClick = async () => {
    setLoadingFeedbacks((prev) => ({ ...prev, [m.messageId]: true }));
    await handleFeedbacks(m.messageId);
    setLoadingFeedbacks((prev) => ({ ...prev, [m.messageId]: false }));
  };

  const handleTranslate = async (messageId: string) => {
    try {
      if (translated) {
        setTranslated(null);
        return;
      }
      setLoading((prev) => ({ ...prev, [messageId]: true }));

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
    } finally {
      setLoading((prev) => ({ ...prev, [messageId]: false }));
    }
  };
  const handleTranslateClick = async (messageId: string) => {
    setLoadingTranslate((prev) => ({ ...prev, [messageId]: true }));
    try {
      await handleTranslate(messageId);
    } finally {
      setLoadingTranslate((prev) => ({ ...prev, [messageId]: false }));
    }
  };

  const handleTTS = async (messageId: string) => {
    try {
      if (!messageId) return; // ✅ messageId 없으면 실행 안 함

      const res = await fetch(`/api/messages/${messageId}/tts`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken ?? ""}`,
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
  const handleTTsClick = async (messageId: string) => {
    setLoadingTTS((prev) => ({ ...prev, [messageId]: true }));
    try {
      await handleTTS(messageId);
    } finally {
      setLoadingTTS((prev) => ({ ...prev, [messageId]: false }));
    }
  };
  const isLastMessage = m.messageId === m[m.length]?.messageId;

  return (
    <View
      style={[
        styles.container,
        isMine ? styles.containerMine : styles.containerOther,
        isLastMessage ? styles.lastMessage : {},
      ]}
    >
      {/* 상대방 프로필 */}
      {!isMine && (
        <View style={styles.profileContainer}>
          {myAI?.profileImageUrl ? (
            <Image
              source={{ uri: myAI.profileImageUrl }}
              style={styles.profileImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.profilePlaceholder} />
          )}
        </View>
      )}

      {/* i 버튼 (내 메시지일 때만) */}
      {showFeedbackButton && (
        <TouchableOpacity
          onPress={handleFeedbackClick}
          disabled={loadingFeedbacks[m.messageId]}
          style={styles.feedbackButton}
        >
          {loadingFeedbacks[m.messageId] ? (
            <SpinnerIcon size={12} color="#6b7280" />
          ) : (
            <Text style={styles.feedbackButtonText}>i</Text>
          )}
        </TouchableOpacity>
      )}

      {/* 메시지 + 부가 박스 */}
      <View
        style={[
          styles.messageContainer,
          isMine ? styles.messageContainerMine : {},
        ]}
      >
        <Text style={styles.nameText}>{isMine ? "" : myAI?.name ?? "AI"}</Text>

        {/* 메시지 풍선 */}
        <View
          style={[
            styles.messageBubble,
            isMine
              ? messageStatus === "error"
                ? styles.messageBubbleError
                : showFeedbackButton && m.feedback
                ? styles.messageBubbleWithFeedback
                : showFeedbackButton
                ? styles.messageBubbleWithFeedback
                : styles.messageBubbleMine
              : styles.messageBubbleOther,
          ]}
        >
          <View style={styles.messageContent}>
            <View style={styles.messageTextContainer}>
              <Text style={styles.messageText}>{m.content}</Text>
            </View>

            {/* 번역/tts 버튼 (상대 메시지일 때만) */}
            {!isMine && (
              <View style={styles.actionButtons}>
                <View style={styles.actionButtonGroup}>
                  <TouchableOpacity
                    onPress={() => handleTTsClick(m.messageId)}
                    disabled={loadingTTs[m.messageId]}
                    style={styles.actionButton}
                  >
                    {loadingTTs[m.messageId] ? (
                      <SpinnerIcon size={16} color="#6b7280" />
                    ) : (
                      <Volume />
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleTranslateClick(m.messageId)}
                    disabled={loadingTranslate[m.messageId]}
                    style={styles.actionButton}
                  >
                    <Language />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* 존댓말 버튼 (내 메시지일 때만) */}
            {isMine && (
              <View style={styles.honorificButtonContainer}>
                <TouchableOpacity
                  style={styles.honorificButton}
                  onPress={handleClick}
                >
                  <Text style={styles.honorificButtonText}>
                    Honorific Slider
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* 피드백 박스 */}
        {isMine && isFeedbackOpen && m.feedback && (
          <View style={styles.feedbackBox}>
            <Text style={styles.appropriateExpression}>
              {m.feedback.appropriateExpression}
            </Text>
            <Text style={styles.feedbackExplain}>{m.feedback.explain}</Text>
          </View>
        )}

        {/* 번역 결과 */}
        {translated && (
          <View style={styles.translationBox}>
            <Text style={styles.translationText}>{translated}</Text>
          </View>
        )}

        {/* 에러 메시지 */}
        {isMine && messageStatus === "error" && isErrorOpen && (
          <View style={styles.errorBox}>
            <Text style={styles.errorTitle}>Error Details</Text>
            <Text style={styles.errorText}>
              This message contains an error that needs attention.
            </Text>
          </View>
        )}

        {/* 존댓말 로딩 */}
        {loading[m.messageId] && (
          <View style={styles.loadingBox}>
            <View style={styles.loadingContent}>
              <SpinnerIcon size={16} color="white" />
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          </View>
        )}

        {/* 존댓말 결과 */}
        {honorificResults[m.messageId] && !loading[m.messageId] && (
          <HonorificSlider
            results={honorificResults[m.messageId] as HonorificResults}
            value={sliderValues[m.messageId] ?? 1}
            onChange={(newValue) =>
              setSliderValues((prev) => ({
                ...prev,
                [m.messageId]: newValue,
              }))
            }
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 8,
  },
  containerMine: {
    justifyContent: "center",
    alignItems: "flex-start",
  },
  containerOther: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  lastMessage: {
    paddingBottom: 120,
  },
  profileContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    flexShrink: 0,
    marginTop: 4,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  profileImage: {
    width: 40,
    height: 40,
  },
  profilePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#d1d5db",
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
    marginLeft: 52,
    marginTop: 48,
    flexShrink: 0,
  },
  feedbackButtonText: {
    color: "#ef4444",
    fontSize: 12,
    fontWeight: "bold",
    lineHeight: 12,
  },
  messageContainer: {
    maxWidth: "75%",
    flex: 1,
  },
  messageContainerMine: {
    marginLeft: "auto",
  },
  nameText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
    marginBottom: 4,
    fontFamily: "Pretendard",
  },
  messageBubble: {
    position: "relative",
    zIndex: 30,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: "rgba(0,0,0,0.1)",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    width: "100%",
  },
  messageBubbleMine: {
    backgroundColor: "white",
    color: "black",
    borderColor: "#e5e7eb",
  },
  messageBubbleOther: {
    backgroundColor: "#f9fafb",
    borderColor: "#e5e7eb",
  },
  messageBubbleError: {
    borderColor: "#ef4444",
    backgroundColor: "white",
  },
  messageBubbleWithFeedback: {
    borderColor: "#ef4444",
    backgroundColor: "white",
  },
  messageContent: {
    flexDirection: "column",
    gap: 12,
  },
  messageTextContainer: {
    paddingVertical: 8,
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  messageText: {
    color: "black",
    fontSize: 14,
    fontWeight: "normal",
    lineHeight: 18.2,
  },
  actionButtons: {
    justifyContent: "space-between",
    gap: 4,
  },
  actionButtonGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  actionButton: {
    cursor: "pointer",
    alignItems: "center",
    justifyContent: "center",
    width: 24,
    height: 24,
  },
  honorificButtonContainer: {
    alignItems: "flex-end",
    justifyContent: "flex-end",
    gap: 8,
  },
  honorificButton: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    flexShrink: 0,
  },
  honorificButtonText: {
    color: "white",
    fontSize: 12,
    fontFamily: "Pretendard",
  },
  feedbackBox: {
    padding: 16,
    backgroundColor: "#4b5563",
    borderRadius: 12,
    shadowColor: "rgba(0,0,0,0.1)",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginTop: -24,
    width: "100%",
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
  translationBox: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    paddingTop: 28,
    backgroundColor: "#4b5563",
    borderRadius: 12,
    shadowColor: "rgba(0,0,0,0.1)",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginTop: -24,
    zIndex: -10,
    width: "100%",
  },
  translationText: {
    color: "#e5e7eb",
    fontFamily: "Pretendard",
    fontSize: 14,
  },
  errorBox: {
    padding: 16,
    backgroundColor: "#4b5563",
    borderRadius: 12,
    shadowColor: "rgba(0,0,0,0.1)",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginTop: 12,
    width: "100%",
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
    marginBottom: 12,
    fontFamily: "Pretendard",
  },
  errorText: {
    color: "white",
    fontFamily: "Pretendard",
    fontSize: 14,
  },
  loadingBox: {
    marginTop: -24,
    padding: 12,
    borderRadius: 16,
    backgroundColor: "#4b5563",
    color: "white",
    fontSize: 14,
    alignItems: "center",
    gap: 8,
    width: "100%",
  },
  loadingContent: {
    paddingTop: 24,
    flexDirection: "row",
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: "white",
  },
});
