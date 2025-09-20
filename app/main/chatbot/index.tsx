import FeedbackSection from "@/components/bothistory/FeedbackSection";
import PersonaSlider from "@/components/bothistory/PersonaSlider";
import SearchBar from "@/components/bothistory/SearchBar";
import PersonaDetailModal from "@/components/persona/PersonaDetailModal";
import { useAuth } from "@/lib/UserContext";
import { useRouter } from "expo-router";
import { ChevronDown, ChevronUp } from "lucide-react-native";
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
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<Filter | null>(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedPersonaId, setSelectedPersonaId] = useState<
    number | string | null
  >(null);
  const [openChatId, setOpenChatId] = useState<number | string | null>(null);

  const filterMap: Record<Filter, string> = {
    done: "ENDED",
    "in-progress": "ACTIVE",
  };

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

  const sortedHistory = useMemo(() => {
    return [...history].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sort === "asc" ? dateA - dateB : dateB - dateA;
    });
  }, [history, sort]);

  const handleOpenChat = (id: string | number) => {
    router.push(`/main/custom/chatroom/${id}`);
  };

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
        <SearchBar
          value={searchValue}
          onChange={setSearchValue}
          isOpen={isSearchOpen}
          onSubmit={() => {}}
          onToggle={() => setIsSearchOpen((prev) => !prev)}
        />
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
      <View style={styles.filterBar}>
        {/* 왼쪽 버튼 */}
        <View style={styles.filterButtons}>
          <TouchableOpacity
            onPress={() =>
              setSelectedFilter(selectedFilter === "done" ? null : "done")
            }
            style={[
              styles.filterBtn,
              selectedFilter === "done" && styles.filterBtnActive,
            ]}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === "done" && styles.filterTextActive,
              ]}
            >
              Done
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              setSelectedFilter(
                selectedFilter === "in-progress" ? null : "in-progress"
              )
            }
            style={[
              styles.filterBtn,
              selectedFilter === "in-progress" && styles.filterBtnActive,
            ]}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === "in-progress" && styles.filterTextActive,
              ]}
            >
              In progress
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ position: "relative" }}>
          {/* 오른쪽 정렬 토글 */}
          <TouchableOpacity
            onPress={() => setOpen(!open)}
            style={styles.sortToggle}
          >
            <Text style={styles.sortToggleText}>
              {sort === "asc" ? "Oldest activity" : "Latest activity"}
            </Text>
            <ChevronDown size={16} color="#111" />
          </TouchableOpacity>
        </View>

        {/* 드롭다운 */}
        {open && (
          <View style={styles.dropdown}>
            <TouchableOpacity
              onPress={() => {
                setSort("desc");
                setOpen(false);
              }}
              style={[
                styles.dropdownItem,
                sort === "desc" && styles.dropdownItemActive,
              ]}
            >
              <Text
                style={[
                  styles.dropdownText,
                  sort === "desc" && styles.dropdownTextActive,
                ]}
              >
                Latest activity
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setSort("asc");
                setOpen(false);
              }}
              style={[
                styles.dropdownItem,
                sort === "asc" && styles.dropdownItemActive,
              ]}
            >
              <Text
                style={[
                  styles.dropdownText,
                  sort === "asc" && styles.dropdownTextActive,
                ]}
              >
                Oldest activity
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
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
        <ScrollView contentContainerStyle={{paddingBottom: 90 }}>
          {sortedHistory.map((chat) => {
            const isOpen = openChatId === chat.conversationId;
            return (
              <View key={chat.conversationId} style={styles.chatItem}>
                {/* 상단 row */}
                <View style={styles.chatHeader}>
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

                  <View style={{ flex: 1 }}>
                    <Text style={styles.chatName}>
                      {chat.aiPersona?.name ?? "Unknown"}
                    </Text>
                    <Text style={styles.chatDesc} numberOfLines={1}>
                      {chat.situation ?? chat.aiPersona?.description ?? ""}
                    </Text>
                  </View>

                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={styles.chatDate}>
                      {new Date(chat.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        setOpenChatId(isOpen ? null : chat.conversationId)
                      }
                    >
                      {isOpen ? (
                        <ChevronUp size={20} color="#111" />
                      ) : (
                        <ChevronDown size={20} color="#111" />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>

                {/* 아래쪽 actions */}
                {isOpen && chat.status === "ACTIVE" && (
                  <View style={styles.actions}>
                    <TouchableOpacity
                      onPress={() => handleOpenChat(chat.conversationId)}
                      style={[styles.actionBtn, { backgroundColor: "#2563eb" }]}
                    >
                      <Text style={[styles.actionText, { color: "#fff" }]}>
                        Open Chat
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDeleteChat(chat.conversationId)}
                      style={[styles.actionBtn, { backgroundColor: "#e5e7eb" }]}
                    >
                      <Text style={[styles.actionText, { color: "#374151" }]}>
                        Delete
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
                {isOpen && chat.status === "ENDED" && (
                  <View style={styles.actions}>
                    <FeedbackSection id={chat.conversationId} />
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb", paddingTop: 60 },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerTitle: { fontSize: 20, fontWeight: "bold" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  chatItem: {
    flexDirection: "column", // 세로 정렬
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
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
  filterBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#f9fafb",
  },

  filterButtons: {
    flexDirection: "row",
    gap: 8,
  },

  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#fff",
  },
  filterBtnActive: {
    backgroundColor: "#374151",
  },
  filterText: {
    fontSize: 13,
    color: "#6b7280",
  },
  filterTextActive: {
    color: "#fff",
    fontWeight: "600",
  },

  sortToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  sortToggleText: {
    fontSize: 13,
    color: "#111",
  },
  dropdown: {
    position: "absolute",
    top: 40,
    right: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    zIndex: 10,
    width: 140,
  },
  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  dropdownItemActive: {
    backgroundColor: "#f3f4f6",
  },
  dropdownText: {
    fontSize: 12,
    color: "#374151",
    textAlign: "center",
  },
  dropdownTextActive: {
    fontWeight: "600",
    color: "#2563eb",
  },
  chatName: { fontSize: 16, fontWeight: "600" },
  chatDesc: { fontSize: 13, color: "#6b7280" },
  chatDate: { fontSize: 12, color: "#9ca3af", marginBottom: 4 },
  actions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    paddingVertical: 12,
    backgroundColor: "#f3f4f6",
  },
  actionBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  actionText: { fontSize: 14, fontWeight: "500" },
});
