import ChatLoading from "@/components/etc/ChatLoading";
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

type Role = "BOSS" | "Girlfriend's PARENTS" | "CLERK";
type SituationValue = string;
const avatarPresets = [
  require("../../../assets/avatars/avatar1.png"),
  require("../../../assets/avatars/avatar2.png"),
  require("../../../assets/avatars/avatar3.png"),
  require("../../../assets/avatars/avatar4.png"),
  require("../../../assets/avatars/avatar5.png"),
  require("../../../assets/avatars/avatar6.png"),
  require("../../../assets/characters/character1.png"),
  require("../../../assets/characters/character2.png"),
  require("../../../assets/characters/character3.png"),
];
const situationOptions = {
  BOSS: [
    { value: "BOSS1", label: "Apologizing for a mistake at work." },
    { value: "BOSS2", label: "Requesting half-day or annual leave" },
    { value: "BOSS3", label: "Requesting feedback on work" },
  ],
  "Girlfriend's PARENTS": [
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
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
      const safeName = name.trim() === "" ? "Noonchi" : name;
      const safeImage =
        profileImageUrl ||
        Image.resolveAssetSource(
          require("../../../assets/characters/character2.png")
        ).uri;
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
          profileImageUrl: safeImage,
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
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return <ChatLoading />;
  }
  return (
    <ScrollView contentContainerStyle={styles.container} scrollEnabled={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
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
          <Image
            source={require("../../../assets/characters/character2.png")}
          />
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
                    flexBasis: "33.33%",
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

      <Text style={styles.des}>Name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Enter name"
        style={styles.input}
      />

      <Text style={styles.des}>Gender</Text>
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

      <Text style={styles.des}>AI`s role</Text>
      <View>
        {(["BOSS", "Girlfriend's PARENTS", "CLERK"] as Role[]).map((role) => (
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

      <Text style={{ marginTop: 10, marginBottom: 6 }}>Situation</Text>
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
  container: { paddingHorizontal: 16, paddingTop: 40, paddingBottom: 100 },
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
    marginBottom: 15,
  },
  row: { flexDirection: "row", gap: 8, marginBottom: 10 },
  option: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#d1d5db",
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
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
    marginTop: 10,
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
    bottom: 40,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20,
    backdropFilter: "14",
  },
  modalBox: {
    width: "80%",
    height: "50%",
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
  des: {
    marginBottom: 6,
    marginLeft: 2,
  },
});
