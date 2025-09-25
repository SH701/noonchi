import Modal from "@/components/persona/modal";
import { useAuth } from "@/lib/UserContext";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ChatLoading from "../etc/ChatLoading";

type PersonaDetail = {
  id: number | string;
  name: string;
  gender?: string;
  age?: number;
  role?: string; // Boss 등
  description?: string; // Situation 등
  profileImageUrl?: string;
};

const normalizeSrc = (src?: string) =>
  !src ? "" : src.startsWith("http") || src.startsWith("/") ? src : `/${src}`;

export default function PersonaDetailModal({
  open,
  onClose,
  personaId,
  onDeleted,
}: {
  open: boolean;
  onClose: () => void;
  personaId: number | string | null;
  onDeleted: (id: number | string) => void;
}) {
  const { accessToken } = useAuth();
  const [data, setData] = useState<PersonaDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

const handleDelete = async () => {
  if (!personaId || !accessToken) return;
  Alert.alert("Delete AI", "Delete This AI?", [
    { text: "Cancel", style: "cancel" },
    {
      text: "Delete",
      style: "destructive",
      onPress: async () => {
        setDeleting(true);
        try {
          const res = await fetch(
            `https://noonchi.ai.kr/api/personas/${personaId}`,
            {
              method: "DELETE",
              headers: { Authorization: `Bearer ${accessToken}` },
              cache: "no-store",
            }
          );
          if (!res.ok) {
            Alert.alert("Error", "Failed to delete AI.");
            return;
          }
          onDeleted?.(personaId);

          Alert.alert("Success", "AI deleted successfully!", [
            {
              text: "OK",
              onPress: () => {
                onClose?.();
              },
            },
          ]);
        } catch (e) {
          Alert.alert("Error", "Unexpected error occurred.");
          onDeleted?.(personaId);
          onClose?.();
        } finally {
          setDeleting(false);
        }
      },
    },
  ]);
};


  useEffect(() => {
    if (!open || !personaId || !accessToken) return;
    const run = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://noonchi.ai.kr/api/personas/${personaId}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
            cache: "no-store",
          }
        );
        const json = await res.json();
        setData({
          id: json.id ?? personaId,
          name: json.name ?? "Unknown",
          gender: json.gender,
          age: json.age,
          role: json.role ?? json.aiRole,
          description: json.description,
          profileImageUrl: json.profileImageUrl,
        });
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [open, personaId, accessToken]);

  const handleStartChat = async () => {
    if (!accessToken || !data) return;
    try {
      const res = await fetch(`https://noonchi.ai.kr/api/conversations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          personaId: data.id,
          situation: data.description,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(
          `Failed to create conversation: ${res.status} ${errText}`
        );
      }
      const json = await res.json();
      const conversationId =
        json.conversationId ?? json.id ?? json.conversation?.id;

      if (!conversationId) throw new Error("No conversationId in response");

      onClose?.();

      router.push(`/main/custom/chatroom/${conversationId}`);
    } catch (err) {
      console.error("StartChat error:", err);
    } 
  };

  return (
    <Modal open={open} onClose={onClose}>
      {/* 헤더 */}
      <View style={styles.header}>
        {data?.profileImageUrl ? (
          <Image
            source={{ uri: normalizeSrc(data.profileImageUrl) }}
            style={styles.profileImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.profilePlaceholder} />
        )}
        <View style={styles.headerInfo}>
          <Text style={styles.name} numberOfLines={1}>
            {data?.name ?? "..."}
          </Text>
        </View>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>

      {/* 바디 */}
      <View style={styles.body}>
        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : (
          <View style={styles.detailsGrid}>
            {/* Name */}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Name</Text>
              <Text style={styles.detailValue}>{data?.name ?? "-"}</Text>
            </View>

            {/* Gender */}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Gender</Text>
              <Text style={styles.detailValue}>{data?.gender ?? "-"}</Text>
            </View>

            {/* Age */}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Age</Text>
              <Text style={styles.detailValue}>{data?.age ?? "-"}</Text>
            </View>

            {/* AI's role */}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>AI’s role</Text>
              <Text style={styles.detailValue}>{data?.role ?? "-"}</Text>
            </View>
          </View>
        )}
      </View>

      {/* 푸터 */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={handleStartChat}
          style={styles.startChatButton}
        >
          <Text style={styles.startChatButtonText}>Start New chatting</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  profileImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#e5e7eb",
  },
  profilePlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#e5e7eb",
  },
  headerInfo: {
    minWidth: 0,
    flex: 1,
  },
  name: {
    fontWeight: "600",
    fontSize: 18,
  },
  role: {
    fontWeight: "600",
    color: "#6b7280",
    fontSize: 14,
  },
  closeButton: {
    marginLeft: "auto",
    fontSize: 14,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
  },
  closeButtonText: {
    fontSize: 14,
    color: "#374151",
  },
  body: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: 14,
    color: "#6b7280",
  },
  detailsGrid: {
    flexDirection: "column",
    gap: 8,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: "#6b7280",
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  startChatButton: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
  },
  startChatButtonText: {
    color: "white",
    fontWeight: "500",
  },
  deleteButton: {
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButtonText: {
    color: "#374151",
  },
});
