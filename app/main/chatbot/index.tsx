import PersonaSlider from "@/components/bothistory/PersonaSlider";
import PersonaDetailModal from "@/components/persona/PersonaDetailModal";
import { useAuth } from "@/lib/UserContext";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Conversation = {
  conversationId: number | string;
  aiPersona?: {
    personaId: number | string;
    name: string;
    description?: string;
    profileImageUrl?: string;
  };
  status: "ACTIVE" | "ENDED";
  situation?: string;
  createdAt: string;
};

type Filter = "done" | "in-progress";

export default function ChatHistory() {
  const router = useRouter();
  const { accessToken } = useAuth();

  const [history, setHistory] = useState<Conversation[]>([]);
  const [sort, setSort] = useState<"asc" | "desc">("desc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<Filter | null>(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedPersonaId, setSelectedPersonaId] = useState<
    number | string | null
  >(null);

  const filterMap: Record<Filter, string> = {
    done: "ENDED",
    "in-progress": "ACTIVE",
  };

  // ✅ API 호출
  useEffect(() => {
    if (!accessToken) return;

    const fetchHistory = async () => {
      try {
        setLoading(true);
        let query =
          "/api/conversations?sortBy=CREATED_AT_DESC&page=1&size=1000";
        if (selectedFilter) query += `&status=${filterMap[selectedFilter]}`;

        const API_BASE = "https://noonchi.ai.kr";
        const res = await fetch(`${API_BASE}${query}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!res.ok) throw new Error(`Error ${res.status}`);

        const data = await res.json();
        const conv = Array.isArray(data?.content) ? data.content : [];
        setHistory(conv);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [accessToken, selectedFilter]);

  // ✅ 정렬
  const sortedHistory = useMemo(() => {
    return [...history].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sort === "asc" ? dateA - dateB : dateB - dateA;
    });
  }, [history, sort]);

  // ✅ 채팅 열기
  const handleOpenChat = (id: string | number) => {
    router.push(`/main/custom/chatroom/${id}`);
  };

  // ✅ 채팅 삭제
  const handleDeleteChat = async (id: string | number) => {
    try {
      const API_BASE = "https://noonchi.ai.kr";
      const res = await fetch(`${API_BASE}/api/conversations/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) throw new Error("Delete failed");
      setHistory((prev) => prev.filter((c) => c.conversationId !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chatbot History</Text>
      </View>

      {/* PersonaSlider */}
      <View style={{ padding: 16 }}>
        <PersonaSlider
          onAdd={() => router.push("/main/custom")}
          visibleCount={4}
          itemSize={72}
          onItemClick={(_, it) => {
            if ("isAdd" in it) return;
            setSelectedPersonaId(it.personaId);
            setOpenDetail(true);
          }}
        />
      </View>

      {/* PersonaDetailModal */}
      <PersonaDetailModal
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        personaId={selectedPersonaId}
        onDeleted={(deletedId) => {
          setHistory((prev) =>
            prev.filter((c) => c.aiPersona?.personaId !== deletedId)
          );
          setOpenDetail(false);
        }}
      />

      {/* 로딩 & 에러 */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      ) : error ? (
        <Text style={{ color: "red" }}>{error}</Text>
      ) : history.length === 0 ? (
        <View style={styles.center}>
          <Image
            source={require("../../../assets/circle/circle4.png")}
            style={{ width: 81, height: 81 }}
          />
          <Text style={{ color: "#9ca3af", marginTop: 12 }}>
            No chat history.
          </Text>
          <TouchableOpacity onPress={() => router.push("/main/custom")}>
            <Text style={{ color: "#3b82f6", marginTop: 8 }}>
              Start a conversation →
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={{ flex: 1 }}>
          {sortedHistory.map((chat) => (
            <View key={chat.conversationId} style={styles.chatItem}>
              {/* 아바타 */}
              {chat.aiPersona?.profileImageUrl ? (
                <Image
                  source={{ uri: chat.aiPersona.profileImageUrl }}
                  style={styles.avatar}
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={{ color: "#fff" }}>
                    {chat.aiPersona?.name?.[0] ?? "?"}
                  </Text>
                </View>
              )}

              {/* 정보 */}
              <View style={{ flex: 1 }}>
                <Text style={styles.chatName}>
                  {chat.aiPersona?.name ?? "Unknown"}
                </Text>
                <Text style={styles.chatDesc} numberOfLines={1}>
                  {chat.situation ?? chat.aiPersona?.description ?? ""}
                </Text>
              </View>

              {/* 날짜 */}
              <Text style={styles.chatDate}>
                {new Date(chat.createdAt).toLocaleDateString()}
              </Text>

              {/* 버튼 */}
              <TouchableOpacity
                onPress={() => handleOpenChat(chat.conversationId)}
                style={styles.actionBtn}
              >
                <Text style={styles.actionText}>Open</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDeleteChat(chat.conversationId)}
                style={[styles.actionBtn, { backgroundColor: "#f3f4f6" }]}
              >
                <Text style={[styles.actionText, { color: "#374151" }]}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerTitle: { fontSize: 20, fontWeight: "bold" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  avatar: { width: 48, height: 48, borderRadius: 24, marginRight: 12 },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: "#9ca3af",
    justifyContent: "center",
    alignItems: "center",
  },
  chatName: { fontSize: 16, fontWeight: "600" },
  chatDesc: { fontSize: 13, color: "#6b7280" },
  chatDate: { fontSize: 12, color: "#9ca3af", marginRight: 8 },
  actionBtn: {
    marginLeft: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#2563eb",
    borderRadius: 8,
  },
  actionText: { color: "#fff", fontSize: 12 },
});
