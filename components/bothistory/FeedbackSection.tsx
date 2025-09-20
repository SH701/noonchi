"use client";
import { useAuth } from "@/lib/UserContext";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Feedback = {
  overallEvaluation: string;
  politenessScore: number;
  naturalnessScore: number;
};

export default function FeedbackSection({ id }: { id: number | string }) {
  const { accessToken } = useAuth();
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!accessToken) return;
    fetch(`https://noonchi.ai.kr/api/conversations/${id}/feedback`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => res.json())
      .then((data) => setFeedback(data))
      .catch((err) => console.error("Feedback fetch error:", err));
  }, [id, accessToken]);

  if (!feedback) return null;

  const viewfeedback = () => {
    router.push(`/main/custom/chatroom/${id}/result`);
  };

  const handleDeleteChat = async (conversationId: string | number) => {
    try {
      const res = await fetch(
        `https://noonchi.ai.kr/api/conversations/${conversationId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to delete chat");
      }
    } catch (err) {
      console.error("Delete chat error:", err);
      Alert.alert("Error", "Failed to delete chat");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.feedbackCard}>
        <Text style={styles.feedbackText}>{feedback.overallEvaluation}</Text>
      </View>

      <View style={styles.scoresContainer}>
        <View style={styles.scoreItem}>
          <View style={styles.scoreHeader}>
            <Text style={styles.scoreLabel}>Politeness</Text>
            <Text style={styles.scoreValue}>{feedback.politenessScore} %</Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${feedback.politenessScore}%` },
              ]}
            />
          </View>
        </View>

        <View style={styles.scoreItem}>
          <View style={styles.scoreHeader}>
            <Text style={styles.scoreLabel}>Naturalness</Text>
            <Text style={styles.scoreValue}>{feedback.naturalnessScore} %</Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${feedback.naturalnessScore}%` },
              ]}
            />
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.viewButton} onPress={viewfeedback}>
          <Text style={styles.buttonText}>View Feedback</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteChat(id)}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    backgroundColor: "#F3F4F6",
  },
  feedbackCard: {
    backgroundColor: "white",
    marginVertical: 10,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  feedbackText: {
    fontSize: 14,
    color: "#374151",
  },
  scoresContainer: {
    gap: 8,
  },
  scoreItem: {
    marginBottom: 8,
  },
  scoreHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  scoreLabel: {
    fontSize: 14,
    color: "#374151",
  },
  scoreValue: {
    fontSize: 14,
    color: "#374151",
  },
  progressBar: {
    width: "100%",
    height: 8,
    backgroundColor: "#dbeafe",
    borderRadius: 4,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#60a5fa",
    borderRadius: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    marginTop: 24,
    paddingBottom: 8,
  },
  viewButton: {
    paddingHorizontal: 16,
    minWidth: 120,
    height: 36,
    backgroundColor: "#2563eb",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButton: {
    paddingHorizontal: 16,
    minWidth: 80,
    height: 36,
    backgroundColor: "#d1d5db",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 12,
    color: "white",
  },
});
