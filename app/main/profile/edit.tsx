import { useAuth } from "@/lib/UserContext";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { ChevronLeft, X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// ✅ 로컬 아바타 이미지 4개
const FACES = [
  require("@/assets/characters/character1.png"),
  require("@/assets/characters/character2.png"),
  require("@/assets/characters/character3.png"),
  require("@/assets/characters/character4.png"),
];

export default function ProfileEditPage() {
  const {
    accessToken,
    profileImageUrl,
    setProfileImageUrl,
    selectedFace,
    setSelectedFace,
  } = useAuth();
  const router = useRouter();

  const [nickname, setNickname] = useState("");
  const [originalNickname, setOriginalNickname] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!accessToken) return;
    fetch("https://noonchi.ai.kr/api/users/me", {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || `Error ${res.status}`);
        setOriginalNickname(data.nickname);
        setNickname(data.nickname);
        if (data.profileImageUrl) {
          setProfileImageUrl(data.profileImageUrl);
        }
      })
      .catch((err) => console.error("Profile load error:", err));
  }, [accessToken]);

  const handleCircleClick = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "사진 라이브러리 접근 권한이 필요합니다."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const fileRes = await fetch(asset.uri);
        const blob = await fileRes.blob();

        const presignRes = await fetch("/api/files/presigned-url", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            fileType: "image/jpeg",
            fileExtension: "jpg",
          }),
        });
        const { url: uploadUrl } = await presignRes.json();

        const uploadRes = await fetch(uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": "image/jpeg" },
          body: blob,
        });
        if (!uploadRes.ok) throw new Error("Upload failed");

        const publicUrl = uploadUrl.split("?")[0];
        setProfileImageUrl(publicUrl);
        setSelectedFace(null); // 외부 이미지니까 캐릭터 선택 해제
      }
    } catch (err) {
      console.error("Upload error:", err);
      Alert.alert("Error", "이미지 업로드 실패");
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await fetch("https://noonchi.ai.kr/api/users/me/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          nickname,
          profileImageUrl:
            selectedFace !== null ? `face${selectedFace}` : profileImageUrl,
        }),
      });
      router.push("/main/profile");
    } catch (err) {
      console.error("Profile update error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
      </View>

      {/* 프로필 사진 */}
      <View style={styles.center}>
        <TouchableOpacity
          onPress={handleCircleClick}
          style={styles.profileCircle}
        >
          {selectedFace !== null ? (
            <Image source={FACES[selectedFace]} style={styles.profileImage} />
          ) : profileImageUrl ? (
            <Image
              source={{ uri: profileImageUrl as string }}
              style={styles.profileImage}
            />
          ) : (
            <Text style={{ color: "#9ca3af" }}>Upload</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* 닉네임 */}
      <View style={styles.inputGroup}>
        <TextInput
          placeholder={originalNickname || "Enter nickname"}
          value={nickname}
          onChangeText={setNickname}
          style={styles.input}
        />
        {nickname.length > 0 && (
          <TouchableOpacity
            onPress={() => setNickname("")}
            style={styles.clearBtn}
          >
            <X size={20} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      {/* ✅ 아바타 선택 (4개) */}
      <Text style={styles.sectionTitle}>Pick your favorite one!</Text>
      <View style={styles.avatarGrid}>
        {FACES.map((src, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => {
              setSelectedFace(idx);
              setProfileImageUrl(null); // 캐릭터 선택 시 외부 업로드 해제
            }}
            style={[
              styles.avatarBtn,
              selectedFace === idx && styles.avatarSelected,
            ]}
          >
            <Image source={src} style={styles.avatarImg} />
          </TouchableOpacity>
        ))}
      </View>

      {/* 저장 버튼 */}
      <TouchableOpacity
        onPress={handleSubmit}
        disabled={submitting}
        style={[styles.saveBtn, submitting && { opacity: 0.5 }]}
      >
        <Text style={styles.saveBtnText}>
          {submitting ? "Saving..." : "Save Changes"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white", padding: 16, paddingTop: 60 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    marginTop: 20,
  },
  backBtn: { padding: 4 },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
  },
  center: { alignItems: "center", marginBottom: 30 },
  profileCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  profileImage: { width: "100%", height: "100%" },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    marginBottom: 30,
    paddingHorizontal: 12,
  },
  input: { flex: 1, paddingVertical: 10 },
  clearBtn: { padding: 4 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 20,
    textAlign: "center", // 텍스트 자체 가운데 정렬
  },

  avatarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center", // 가로 중앙
    alignItems: "center", // 세로 중앙
    gap: 12,
  },

  avatarBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarSelected: {
    borderColor: "#2563eb",
  },
  avatarImg: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  saveBtn: {
    marginTop: 40,
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    width: "90%",
  },
  saveBtnText: {
    color: "white",
  },
});
