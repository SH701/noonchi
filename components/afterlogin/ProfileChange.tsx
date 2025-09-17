import { useAuth } from "@/lib/UserContext";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect } from "react";
import {
  Alert,
  Image,
  ImageSourcePropType,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const FACES: ImageSourcePropType[] = [
  require("../../assets/characters/character1.png"),
  require("../../assets/characters/character2.png"),
  require("../../assets/characters/character3.png"),
  require("../../assets/characters/character4.png"),
];

export default function ProfileChange() {
  const {
    accessToken,
    selectedFace,
    setSelectedFace,
    profileImageUrl,
    setProfileImageUrl,
  } = useAuth();

  const handleFaceSelect = (idx: number) => {
    setSelectedFace(idx);
    setProfileImageUrl(FACES[idx]);
  };

  const handleCircleClick = async () => {
    try {
      // 권한 요청
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission needed",
            "Please grant permission to access your photo library"
          );
          return;
        }
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await handleFileUpload(result.assets[0]);
      }
    } catch (error) {
      console.error("Image picker error:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  useEffect(() => {
    if (
      profileImageUrl &&
      typeof profileImageUrl === "string" &&
      !profileImageUrl.startsWith("http")
    ) {
      const idx = FACES.findIndex((p) => p === profileImageUrl);
      setSelectedFace(idx !== -1 ? idx : null);
    } else {
      setSelectedFace(null);
    }
  }, [profileImageUrl]);

  const handleFileUpload = async (asset: ImagePicker.ImagePickerAsset) => {
    try {
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

      if (!presignRes.ok) {
        const text = await presignRes.text();
        throw new Error(`Presign failed: ${presignRes.status} ${text}`);
      }

      const { url: uploadUrl } = await presignRes.json();

      // 2. 파일 → blob 변환 후 업로드
      const fileRes = await fetch(asset.uri);
      const blob = await fileRes.blob();

      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": "image/jpeg" },
        body: blob,
      });

      if (!uploadRes.ok) {
        const text = await uploadRes.text();
        throw new Error(`Upload failed: ${uploadRes.status} ${text}`);
      }

      const publicUrl = uploadUrl.split("?")[0];

      setProfileImageUrl(publicUrl);
      setSelectedFace(null);

      if (accessToken) {
        await fetch("https://noonchi.ai.kr/api/users/me/profile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ profileImageUrl: publicUrl }),
        });
      }
    } catch (err: any) {
      console.error("File upload error", err);
      Alert.alert("Upload Error", "Failed to upload image");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Please select a profile</Text>

      <TouchableOpacity
        onPress={handleCircleClick}
        style={styles.profileImageContainer}
        accessibilityLabel="프로필 이미지 업로드"
      >
        {selectedFace !== null ? (
          <Image
            source={FACES[selectedFace]}
            style={styles.profileImage}
            resizeMode="cover"
          />
        ) : typeof profileImageUrl === "string" ? (
          <Image
            source={{ uri: profileImageUrl }}
            style={styles.profileImage}
            resizeMode="cover"
          />
        ) : profileImageUrl ? (
          <Image
            source={profileImageUrl}
            style={styles.profileImage}
            resizeMode="cover"
          />
        ) : (
          <Text style={styles.uploadText}>Click to upload</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.subtitle}>Pick your favorite one!</Text>

      {/* ✅ 로컬 아바타 그리드 */}
      <View style={styles.avatarGrid}>
        {FACES.map((src, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => handleFaceSelect(idx)}
            style={[
              styles.avatarButton,
              selectedFace === idx
                ? styles.selectedAvatar
                : styles.unselectedAvatar,
            ]}
            accessibilityLabel={`choose avatar ${idx + 1}`}
          >
            <Image source={src} style={styles.avatarImage} resizeMode="cover" />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 32,
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  profileImageContainer: {
    width: 152,
    height: 152,
    borderRadius: 76,
    backgroundColor: "#f3f4f6",
    borderWidth: 2,
    borderColor: "#3b82f6",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  profileImage: {
    width: 152,
    height: 152,
  },
  uploadText: {
    color: "#9ca3af",
    textAlign: "center",
  },
  subtitle: {
    color: "#374151",
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 18,
    paddingTop: 56,
    textAlign: "center",
  },
  avatarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 16,
    gap: 16,
  },
  avatarButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  selectedAvatar: {
    borderColor: "#2563eb",
  },
  unselectedAvatar: {
    borderColor: "#d1d5db",
  },
  avatarImage: {
    width: 48,
    height: 48,
  },
});
