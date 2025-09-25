import { HonorificResults } from "@/components/chats/HonorificSlider";
import MessageList from "@/components/chats/MessageList";
import { useRecorder } from "@/hooks/useRecorder";
import { MyAI } from "@/lib/types";
import { useAuth } from "@/lib/UserContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ExitToApp from "../../../../assets/etc/exit_to_app.svg";
import ExitChar from "../../../../assets/etc/exitchar.svg";

type ConversationDetail = {
  conversationId: number;
  userId: number;
  aiPersona: MyAI;
  status: "ACTIVE" | "ENDED";
  situation: string;
  chatNodeId: string;
  createdAt: string;
  endedAt: string | null;
};

type ChatMsg = {
  messageId: string;
  conversationId: number;
  role: "USER" | "AI";
  content: string;
  createdAt: string;
  feedback?: string;
  isLoading?: boolean;
  politenessScore?: number;
  naturalnessScore?: number;
};

type MicState = "idle" | "recording" | "recorded";

export default function Chatroom() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { accessToken } = useAuth();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [myAI, setMyAI] = useState<MyAI | null>(null);
  const canCall = Boolean(accessToken);
  const scrollViewRef = useRef<ScrollView>(null);
  const [feedbackOpenId, setFeedbackOpenId] = useState<string | null>(null);
  const router = useRouter();
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [honorificResults, setHonorificResults] = useState<
    Record<string, HonorificResults>
  >({});
  const [sliderValues, setSliderValues] = useState<Record<string, number>>({});
  const [endModalOpen, setEndModalOpen] = useState(false);
  const [loadingModalOpen, setLoadingModalOpen] = useState(false);
  const { isRecording, startRecording, stopRecording } = useRecorder();
  const [isTyping, setIsTyping] = useState(false);
  const [pendingAudioFile, setPendingAudioFile] = useState<Blob | null>(null);
  const [pendingAudioUrl, setPendingAudioUrl] = useState<string | null>(null);
  const [showVoiceError, setShowVoiceError] = useState(false);
  const [micState, setMicState] = useState<MicState>("idle");

  const voiceErrorOpacity = useRef(new Animated.Value(0)).current;

  const handleKeyboardClick = () => {
    setIsTyping((prev) => !prev);
  };

  // 대화 정보 로드
  useEffect(() => {
    if (!canCall || !id) return;
    (async () => {
      try {
        const res = await fetch(
          `https://noonchi.ai.kr/api/conversations/${id}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        if (!res.ok) {
          const errorText = await res.text();
          console.error("대화 정보 조회 실패:", res.status, errorText);
          return;
        }
        const data: ConversationDetail = await res.json();
        setMyAI(data.aiPersona);
        setConversationId(data.conversationId);
      } catch (err) {
        console.error("대화 정보 조회 오류:", err);
      }
    })();
  }, [accessToken, id, canCall]);

  // 메시지 목록 로드
  const fetchMessages = async () => {
    if (!canCall) return;
    try {
      const res = await fetch(
        `https://noonchi.ai.kr/api/messages?conversationId=${id}&page=1&size=20`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (!res.ok) {
        const errorText = await res.text();
        console.error("메시지 조회 실패:", res.status, errorText);
        return;
      }
      const data = await res.json();
      const list = (data?.content ?? data ?? []) as any[];
      const mapped: ChatMsg[] = list.map((m) => ({
        messageId: String(m.messageId),
        conversationId: m.conversationId,
        role: (m.role ?? m.type) as "USER" | "AI",
        content: m.content ?? "",
        createdAt: m.createdAt ?? new Date().toISOString(),
        politenessScore: m.politenessScore ?? -1,
        naturalnessScore: m.naturalnessScore ?? -1,
      }));
      setMessages(mapped);
      if (!conversationId && list.length > 0 && list[0].conversationId) {
        setConversationId(list[0].conversationId);
      }
    } catch (err) {
      console.error("메시지 조회 오류:", err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [accessToken, id]);

  // 메시지가 업데이트될 때마다 스크롤을 맨 아래로
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
    return () => clearTimeout(timer);
  }, [messages]);

  const showVoiceErrorMessage = () => {
    setShowVoiceError(true);

    // 애니메이션 시작
    Animated.timing(voiceErrorOpacity, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      // 페이드 아웃 애니메이션
      Animated.timing(voiceErrorOpacity, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start(() => {
        setShowVoiceError(false);
      });
    }, 2400);
  };

  // 메시지 전송
  const sendMessage = async (content?: string, audioUrl?: string) => {
    if (!canCall || loading) return;
    if (!conversationId) {
      return;
    }

    if ((!content || !content.trim()) && !audioUrl) return;
    const displayContent = content ?? "";
    const optimistic: ChatMsg = {
      messageId: `user_${Date.now()}`,
      conversationId,
      role: "USER",
      content: displayContent,
      createdAt: new Date().toISOString(),
      politenessScore: -1,
      naturalnessScore: -1,
    };
    setMessages((prev) => [...prev, optimistic]);
    setMessage("");
    setLoading(true);

    try {
      const userRes = await fetch(`https://noonchi.ai.kr/api/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          conversationId,
          content: content ?? "",
          audioUrl,
        }),
      });

      if (userRes.status === 409) {
        if (audioUrl) {
          showVoiceErrorMessage();
        }
        setMessages((prev) =>
          prev.filter((msg) => msg.messageId !== optimistic.messageId)
        );
        return;
      }

      if (!userRes.ok) {
        Alert.alert("오류", "메시지 전송에 실패했습니다.");
        return;
      }

      const userMsgData = await userRes.json();
      if (userMsgData?.messageId) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.messageId === optimistic.messageId
              ? {
                  ...msg,
                  messageId: String(userMsgData.messageId),
                  content:
                    !userMsgData.content ||
                    (!userMsgData.content.trim() && audioUrl)
                      ? "[Voice message]"
                      : userMsgData.content || displayContent,
                  politenessScore: userMsgData.politenessScore ?? -1,
                  naturalnessScore: userMsgData.naturalnessScore ?? -1,
                }
              : msg
          )
        );
      }

      const aiLoadingMsg: ChatMsg = {
        messageId: `ai_loading_${Date.now()}`,
        conversationId,
        role: "AI",
        content: "...",
        createdAt: new Date().toISOString(),
        isLoading: true,
      };
      setMessages((prev) => [...prev, aiLoadingMsg]);

      const aiRes = await fetch(
        `https://noonchi.ai.kr/api/messages/ai-reply?conversationId=${conversationId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (!aiRes.ok) {
        Alert.alert("오류", "AI 응답을 받아오는데 실패했습니다.");
        return;
      }
      const aiData = await aiRes.json();
      if (aiData?.content?.trim()) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.messageId === aiLoadingMsg.messageId
              ? {
                  messageId: String(aiData.messageId ?? `ai_${Date.now()}`),
                  conversationId,
                  role: "AI",
                  content: aiData.content,
                  createdAt: aiData.createdAt ?? new Date().toISOString(),
                  isLoading: false,
                }
              : msg
          )
        );
      }
    } catch (e) {
      console.error("메시지 전송 오류:", e);
      Alert.alert("오류", "메시지 전송 중 오류가 발생했습니다.");
      setMessages((prev) =>
        prev.filter((msg) => msg.messageId !== optimistic.messageId)
      );
    } finally {
      setLoading(false);
    }
  };

  // 대화 종료
  const handleEnd = async () => {
    setEndModalOpen(false);
    setLoadingModalOpen(true);
    try {
      const res = await fetch(
        `https://noonchi.ai.kr/api/conversations/${id}/end`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (!res.ok) {
        setLoadingModalOpen(false);
        Alert.alert("오류", "대화 종료에 실패했습니다.");
        return;
      }
      setLoadingModalOpen(false);
      router.push(`/main/custom/chatroom/${id}/result`);
    } catch (e) {
      setLoadingModalOpen(false);
      Alert.alert("오류", "대화 종료 중 오류가 발생했습니다.");
    }
  };

  const handleFeedbacks = async (messageId: string) => {
    if (!accessToken) {
      return;
    }
    if (feedbackOpenId === messageId) {
      setFeedbackOpenId(null);
      return;
    }
    try {
      const res = await fetch(
        `https://noonchi.ai.kr/api/messages/${messageId}/feedback`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (!res.ok) {
        Alert.alert("오류", "피드백을 가져오는데 실패했습니다.");
        return;
      }

      const feedbackData = await res.json();
      setMessages((prev) =>
        prev.map((msg) =>
          msg.messageId === messageId ? { ...msg, feedback: feedbackData } : msg
        )
      );

      setFeedbackOpenId(messageId);
    } catch (err) {
      console.error("피드백 오류:", err);
    }
  };

  const handleHonorific = async (messageId: string) => {
    if (honorificResults[messageId]) {
      setHonorificResults((prev) => {
        const copy = { ...prev };
        delete copy[messageId];
        return copy;
      });
      setSliderValues((prev) => {
        const copy = { ...prev };
        delete copy[messageId];
        return copy;
      });
      return;
    }

    try {
      const res = await fetch(
        `https://noonchi.ai.kr/api/messages/${messageId}/honorific-variations`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (!res.ok) {
        console.error("존댓말 변환 실패");
        Alert.alert("오류", "존댓말 변환에 실패했습니다.");
        return;
      }
      const data = await res.json();

      setHonorificResults((prev) => ({
        ...prev,
        [messageId]: data,
      }));
      setSliderValues((prev) => ({
        ...prev,
        [messageId]: 1,
      }));
    } catch (err) {
      console.error("handleHonorific error:", err);
    }
  };

  const handleMicClick = async () => {
    if (micState === "idle") {
      try {
        await startRecording();
        setMicState("recording");
      } catch (error) {
        console.error("녹음 시작 오류:", error);
        Alert.alert("오류", "녹음을 시작할 수 없습니다.");
      }
    } else if (micState === "recording") {
      try {
        const file = await stopRecording();
        if (file) {
          setPendingAudioFile(file);
          // React Native에서는 파일 URI를 직접 사용
          setPendingAudioUrl("recorded");
          setMicState("recorded");
        }
      } catch (error) {
        console.error("녹음 중지 오류:", error);
        Alert.alert("오류", "녹음을 중지할 수 없습니다.");
      }
    }
  };

  const handleResetAudio = () => {
    setPendingAudioFile(null);
    setPendingAudioUrl(null);
    setMicState("idle");
  };

  const handleSendAudio = async () => {
    if (!pendingAudioFile) return;

    try {
      const res = await fetch(`https://noonchi.ai.kr/api/files/presigned-url`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          fileType: "audio.wav",
          fileExtension: "wav",
        }),
      });
      if (!res.ok) throw new Error("presigned-url 요청 실패");
      const { url: presignedUrl } = await res.json();

      await fetch(presignedUrl, {
        method: "PUT",
        headers: { "Content-Type": "audio/wav" },
        body: pendingAudioFile,
      });

      const audioUrl = presignedUrl.split("?")[0];
      await sendMessage("", audioUrl);

      handleResetAudio();
    } catch (error) {
      console.error("음성 메시지 전송 오류:", error);
      Alert.alert("오류", "음성 메시지 전송에 실패했습니다.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.push("/main")}
          style={styles.headerButton}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{myAI?.name ?? "..."}</Text>

        <TouchableOpacity
          onPress={() => setEndModalOpen(true)}
          style={styles.headerButton}
        >
          <ExitToApp style={styles.exitIcon} />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <View style={styles.messagesContainer}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.messages}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
        >
          <MessageList
            messages={messages}
            myAI={myAI}
            feedbackOpenId={feedbackOpenId}
            honorificResults={honorificResults}
            sliderValues={sliderValues}
            handleFeedbacks={handleFeedbacks}
            handleHonorific={handleHonorific}
            setSliderValues={setSliderValues}
          />
        </ScrollView>
      </View>

      {/* Voice Error Message */}
      {showVoiceError && (
        <Animated.View
          style={[styles.voiceErrorContainer, { opacity: voiceErrorOpacity }]}
        >
          <Image
            source={require("../../../../assets/etc/voice_error.png")}
            style={styles.voiceErrorImage}
            resizeMode="contain"
          />
        </Animated.View>
      )}

      {/* Input - Fixed at bottom */}
      <View style={styles.inputContainer}>
        {!isTyping ? (
          <View style={styles.voiceInputContainer}>
            {/* Reset/Refresh Button */}
            {micState === "recording" || micState === "recorded" ? (
              <TouchableOpacity
                style={styles.sideButton}
                onPress={handleResetAudio}
              >
                <Image
                  source={require("../../../../assets/chatroom/refresh.png")}
                  style={styles.sideButtonIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            ) : (
              <View style={styles.sideButton} />
            )}

            {/* Center Mic Button */}
            <TouchableOpacity
              onPress={
                micState === "recorded" ? handleSendAudio : handleMicClick
              }
            >
              <Image
                source={
                  micState === "idle"
                    ? require("../../../../assets/chatroom/mic.png")
                    : micState === "recording"
                    ? require("../../../../assets/chatroom/pause.png")
                    : require("../../../../assets/chatroom/send.png")
                }
                style={styles.centerButton}
                resizeMode="contain"
              />
            </TouchableOpacity>

            {/* Keyboard Button */}
            <TouchableOpacity
              style={styles.sideButton}
              onPress={handleKeyboardClick}
            >
              <Image
                source={require("../../../../assets/chatroom/keyboard_alt.png")}
                style={styles.sideButtonIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        ) : (
          /* Typing Section */
          <View style={styles.typingContainer}>
            <TouchableOpacity
              onPress={handleKeyboardClick}
              style={styles.micButtonSmall}
            >
              <Image
                source={require("../../../../assets/chatroom/mic.png")}
                style={styles.micIconSmall}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <TextInput
              style={styles.textInput}
              placeholder="Reply here"
              placeholderTextColor="#9CA3AF"
              value={message}
              onChangeText={setMessage}
              onSubmitEditing={() => {
                const current = message;
                sendMessage(current);
                setMessage(""); 
              }}
              editable={!loading}
            />

            <TouchableOpacity
              onPress={() => sendMessage(message)}
              style={styles.sendButton}
              disabled={loading || !message.trim()}
            >
              <Image
                source={require("../../../../assets/chatroom/up.png")}
                style={[
                  styles.sendIcon,
                  (loading || !message.trim()) && { opacity: 0.5 },
                ]}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* End Modal */}
      <Modal
        visible={endModalOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setEndModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackground}
            activeOpacity={1}
            onPress={() => setEndModalOpen(false)}
          />
          <View style={styles.modalContent}>
            <ExitChar style={styles.exitCharImage} />

            <Text style={styles.modalTitle}>
              Would you like to end the conversation
            </Text>
            <Text style={styles.modalSubtitle}>and receive feedback?</Text>

            <TouchableOpacity style={styles.primaryButton} onPress={handleEnd}>
              <Text style={styles.primaryButtonText}>Get Feedback</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => setEndModalOpen(false)}
            >
              <Text style={styles.secondaryButtonText}>Keep Conversation</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Loading Modal */}
      <Modal visible={loadingModalOpen} transparent={true} animationType="fade">
        <View style={styles.loadingModalOverlay}>
          <View style={styles.loadingModalContent}>
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    maxWidth: 500,
    width: "100%",
    alignSelf: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    ...Platform.select({
      ios: {
        paddingTop: 50,
      },
      android: {
        paddingTop: 20,
      },
    }),
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: {
    fontSize: 24,
    color: "#4b5563",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  exitIcon: {
    width: 24,
    height: 24,
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  messages: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messagesContent: {
    paddingVertical: 16,
  },
  voiceErrorContainer: {
    position: "absolute",
    bottom: 150,
    left: "50%",
    marginLeft: -75, // width의 절반
    zIndex: 40,
    alignItems: "center",
  },
  voiceErrorImage: {
    width: 150,
    height: 60,
  },
  inputContainer: {
    backgroundColor: "#dbeafe", // blue-50
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    minHeight: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  voiceInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 40,
    width: "100%",
  },
  sideButton: {
    width: 60,
    height: 60,
    backgroundColor: "#ffffff",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  sideButtonIcon: {
    width: 24,
    height: 24,
  },
  centerButton: {
    width: 82,
    height: 82,
  },
  typingContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: "#93c5fd", // blue-300
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  micButtonSmall: {
    padding: 8,
  },
  micIconSmall: {
    width: 44,
    height: 44,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 8,
    fontSize: 16,
    color: "#6b7280",
    minHeight: 40,
  },
  sendButton: {
    padding: 12,
    borderRadius: 20,
  },
  sendIcon: {
    width: 28,
    height: 28,
  },
  modalOverlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  modalBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 24,
    width: 320,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  exitCharImage: {
    width: 118,
    height: 94,
    marginVertical: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
    color: "#111827",
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 24,
  },
  primaryButton: {
    width: "100%",
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 8,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    width: "100%",
    backgroundColor: "#f3f4f6",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#6b7280",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingModalContent: {
    backgroundColor: "#ffffff",
    padding: 24,
    borderRadius: 12,
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#111827",
  },
});
