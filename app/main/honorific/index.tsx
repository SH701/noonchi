"use client";

import HelperSlider from "@/components/etc/HelperSlider";
import { useRecorder } from "@/hooks/useRecorder";
import { useAuth } from "@/lib/UserContext";
import { Audio } from "expo-av";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Volume from "../../../assets/etc/volume_up.svg";

export default function HonorificHelper() {
  const { accessToken } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState("");
  const [result, setResult] = useState("");
  const [explain, setExplain] = useState("");
  const [allResults, setAllResults] = useState<any>(null);

  const { isRecording, startRecording, stopRecording } = useRecorder();
  const [recording, setRecording] = useState(false);

  const [formality, setFormality] = useState<
    "lowFormality" | "mediumFormality" | "highFormality"
  >("mediumFormality");

  const [intimacy, setIntimacy] = useState<
    | "closeIntimacyExpressions"
    | "mediumIntimacyExpressions"
    | "distantIntimacyExpressions"
  >("mediumIntimacyExpressions");

  // 번역 API
  const handleTranslate = async () => {
    try {
      setLoading(true);
      setExplain("");
      const res = await fetch(
        `https://noonchi.ai.kr/api/language/honorific-variations?sourceContent=${encodeURIComponent(
          source
        )}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (!res.ok) {
        console.log("🔑 accessToken:", accessToken);
        const errText = await res.text();
        console.error(
          "❌ Request failed:",
          res.status,
          res.statusText,
          errText
        );
        throw new Error(`Request failed: ${res.status}`);
      }
      const data = await res.json();

      setAllResults(data);
      setExplain(data.explain);

      const selected = data?.[intimacy]?.[formality] ?? "변환 결과 없음";
      setResult(selected);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // TTS
  const handleTTS = async () => {
    try {
      if (!result) return;

      const res = await fetch("https://noonchi.ai.kr/api/language/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ text: result }),
      });

      if (!res.ok) throw new Error("TTS 요청 실패");

      const audioUrl = await res.text();
      const { sound } = await Audio.Sound.createAsync({ uri: audioUrl });
      await sound.playAsync();
    } catch (e) {
      console.error("TTS 에러:", e);
    }
  };

  // STT
  const handleSTT = async (url: string) => {
    const res = await fetch("https://noonchi.ai.kr/api/language/stt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ audioUrl: url }),
    });

    if (!res.ok) throw new Error("STT 요청 실패");
    const text = await res.text();
    setSource(text);
  };

  // 마이크 버튼
  const handleMicClick = async () => {
    if (isRecording) {
      const file = await stopRecording();
      setRecording(false);

      const res = await fetch("https://noonchi.ai.kr/api/files/presigned-url", {
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
        body: file,
      });

      const audioUrl = presignedUrl.split("?")[0];
      await handleSTT(audioUrl);
    } else {
      startRecording();
      setRecording(true);
    }
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
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

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* 입력 영역 */}
        <View style={styles.box}>
          <TextInput
            style={styles.textarea}
            placeholder="Please enter a sentence..."
            multiline
            value={source}
            onChangeText={setSource}
          />
          <TouchableOpacity style={styles.micBtn} onPress={handleMicClick}>
            <Image
              source={
                recording
                  ? require("../../../assets/etc/pause.png")
                  : require("../../../assets/etc/mic.png")
              }
              style={{ width: 20, height: 20 }}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.submitBtn} onPress={handleTranslate}>
            <Text style={{ color: "white" }}>Submit</Text>
          </TouchableOpacity>
          <View style={styles.line}></View>
          <View style={styles.resultbox}>
            {loading ? (
              <ActivityIndicator color="#3b82f6" />
            ) : (
              <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                <TextInput
                  style={[styles.result, { flex: 1 }]} // ✅ flex:1로 텍스트 영역 확장
                  value={result}
                  multiline
                  editable={false}
                />
                <TouchableOpacity onPress={handleTTS} style={{ marginLeft: 8 }}>
                  <Volume style={{ width: 24, height: 24 }} />
                </TouchableOpacity>
              </View>
            )}
          </View>
          <HelperSlider
            onChange={(i, f) => {
              setIntimacy(i);
              setFormality(f);
              if (allResults) {
                const selected = allResults[i]?.[f] ?? "결과 없음";
                setResult(selected);
              }
            }}
          />
        </View>
        {/* Coach */}
        <View style={styles.box}>
          <Text style={{ fontWeight: "600" }}>Noonchi Coach</Text>
          <Text style={{ marginTop: 8 }}>
            {loading
              ? "Loading..."
              : explain || "The conversion has not been run yet."}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB", paddingTop: 60 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F9FAFB",
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
  box: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  textarea: {
    minHeight: 80,
    textAlignVertical: "top",
    fontSize: 16,
    color: "#000000",
  },
  micBtn: {
    position: "absolute",
    right: 16,
    top: 16,
    backgroundColor: "#dbeafe",
    padding: 8,
    borderRadius: 20,
  },
  submitBtn: {
    marginTop: 8,
    alignSelf: "flex-end",
    backgroundColor: "#3b82f6",
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 10,
    borderRadius: 8,
  },
  result: {
    minHeight: 80,
    fontSize: 16,
    color: "#000000",
    paddingVertical: 10,
  },
  resultbox: {},
  line: {
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "#dedede",
  },
});
