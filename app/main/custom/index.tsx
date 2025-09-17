import { useAuth } from "@/lib/UserContext";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
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

type Role = "BOSS" | "GF_PARENTS" | "CLERK";
type SituationValue = string;
const avatarPresets = [
  require("../../../assets/avatars/avatar1.png"),
  require("../../../assets/avatars/avatar2.png"),
  require("../../../assets/avatars/avatar3.png"),
  require("../../../assets/avatars/avatar4.png"),
  require("../../../assets/avatars/avatar5.png"),
  require("../../../assets/avatars/avatar6.png"),
];
const situationOptions = {
  BOSS: [
    { value: "BOSS1", label: "Apologizing for a mistake at work." },
    { value: "BOSS2", label: "Requesting half-day or annual leave" },
    { value: "BOSS3", label: "Requesting feedback on work" },
  ],
  GF_PARENTS: [
    { value: "GF_PARENTS1", label: "Meeting for the first time" },
    { value: "GF_PARENTS2", label: "Conversation over dinner" },
    { value: "GF_PARENTS3", label: "Apologizing for breaking a picture frame" },
  ],
  CLERK: [
    { value: "CLERK1", label: "Negotiate prices" },
    { value: "CLERK2", label: "Ask about the origin of the product" },
    { value: "CLERK3", label: "Complaining about incorrect food orders" },
  ],
} as const;

export default function PersonaAndRoom() {
  const { accessToken } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("Noonchi");
  const [gender, setGender] = useState<"MALE" | "FEMALE" | "NONE">("NONE");
  const [relationship, setRelationship] = useState<Role>("BOSS");
  const [description, setDescription] = useState<SituationValue>(
    situationOptions.BOSS[0].value
  );
  const [profileImageUrl, setProfileImageUrl] = useState<string>("");
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  // 역할 변경되면 첫 상황 선택
  useEffect(() => {
    setDescription(situationOptions[relationship][0].value);
  }, [relationship]);

  // RN 이미지 업로드 → expo-image-picker 사용
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled) {
      const file = result.assets[0];
      try {
        // presigned URL 요청
        const res = await fetch(
          "https://noonchi.ai.kr/api/files/presigned-url",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              fileType: file.mimeType || "image/jpeg",
              fileExtension: file.uri.split(".").pop(),
            }),
          }
        );
        const { url } = await res.json();

        // S3 업로드
        await fetch(url, {
          method: "PUT",
          headers: { "Content-Type": file.mimeType || "image/jpeg" },
          body: await fetch(file.uri).then((r) => r.blob()),
        });

        setProfileImageUrl(url.split("?")[0]);
      } catch (err) {
        Alert.alert("업로드 실패", String(err));
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const safeName = name.trim() === "" ? "Noonchi" : name;
      const safeProfileImage =
        profileImageUrl || "https://noonchi.ai.kr/default-avatar.png";

      // 1. Persona 생성
      const personaRes = await fetch("https://noonchi.ai.kr/api/personas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          name: safeName,
          gender,
          age: 20,
          relationship,
          description,
          profileImageUrl: safeProfileImage,
        }),
      });
      const persona = await personaRes.json();

      // 2. Conversation 생성
      const convoRes = await fetch("https://noonchi.ai.kr/api/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          personaId: persona.personaId,
          situation: description,
        }),
      });
      const convo = await convoRes.json();

      router.push(`/main/custom/chatroom/${convo.conversationId}` as any);
    } catch (err) {
      Alert.alert("생성 실패", String(err));
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} scrollEnabled={false}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.push("/main")}
          style={styles.backBtn}
        >
          <Text style={{ fontSize: 18 }}>{"←"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Honorific Helper</Text>
        <View style={{ width: 32 }} />
      </View>
      <Text style={styles.title}>Set up your conversation partner</Text>

      {/* 프로필 이미지 */}
      <TouchableOpacity
        onPress={() => setShowAvatarModal(true)}
        style={styles.avatarBox}
      >
        {profileImageUrl ? (
          <Image source={{ uri: profileImageUrl }} style={styles.avatar} />
        ) : (
          <Text style={{ color: "#9ca3af" }}>+</Text>
        )}
      </TouchableOpacity>
      {showAvatarModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={{ fontWeight: "600", marginBottom: 30, fontSize: 20 }}>
              Select Avatar
            </Text>

            {/* 기본 아바타 리스트 */}
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {avatarPresets.map((img, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => {
                    setProfileImageUrl(Image.resolveAssetSource(img).uri);
                    setShowAvatarModal(false);
                  }}
                  style={{
                    flexBasis: "33.33%", // ✅ 한 줄에 3칸
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <Image
                    source={img}
                    style={{ width: 70, height: 70, borderRadius: 40 }}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* 내 사진 업로드 */}
            <TouchableOpacity
              onPress={async () => {
                setShowAvatarModal(false);
                await pickImage();
              }}
              style={styles.uploadBtn}
            >
              <Text style={{ color: "white" }}>Upload My Photo</Text>
            </TouchableOpacity>

            {/* 닫기 */}
            <TouchableOpacity
              onPress={() => setShowAvatarModal(false)}
              style={{ marginTop: 12 }}
            >
              <Text style={{ color: "#6b7280" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Name */}
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Enter name"
        style={styles.input}
      />

      {/* Gender 선택 */}
      <View style={styles.row}>
        {["MALE", "FEMALE", "NONE"].map((v) => (
          <TouchableOpacity
            key={v}
            onPress={() => setGender(v as any)}
            style={[styles.option, gender === v && styles.optionSelected]}
          >
            <Text style={[gender === v && styles.optionTextSelected]}>{v}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Role 선택 */}
      <View>
        {(["BOSS", "GF_PARENTS", "CLERK"] as Role[]).map((role) => (
          <TouchableOpacity
            key={role}
            onPress={() => setRelationship(role)}
            style={[
              styles.option,
              relationship === role && styles.optionSelected,
            ]}
          >
            <Text style={[relationship === role && styles.optionTextSelected]}>
              {role}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Situation 선택 */}
      <View>
        {situationOptions[relationship].map(({ value, label }) => (
          <TouchableOpacity
            key={value}
            onPress={() => setDescription(value)}
            style={[
              styles.option,
              description === value && styles.optionSelected,
            ]}
          >
            <Text style={[description === value && styles.optionTextSelected]}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Submit */}
      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={{ color: "white" }}>Start Chatting</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingTop: 50, paddingBottom: 100 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  backBtn: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  avatarBox: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: "#d1d5db",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    alignSelf: "center",
  },
  avatar: { width: "100%", height: "100%", borderRadius: 48 },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  row: { flexDirection: "row", gap: 8, marginBottom: 20 },
  option: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#d1d5db",
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 14,
  },
  optionSelected: {
    borderColor: "#3b82f6",
    backgroundColor: "#dbeafe",
  },
  optionTextSelected: {
    color: "#3b82f6",
    fontWeight: "500",
  },
  submitBtn: {
    marginTop: 20,
    backgroundColor: "#3b82f6",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20,
    backdropFilter: "14",
  },
  modalBox: {
    width: "80%",
    height: "40%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  uploadBtn: {
    width: "70%",
    alignItems: "center",
    marginTop: 20,
    backgroundColor: "#3b82f6",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
});
