// hooks/useRecorder.ts
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import { useRef, useState } from "react";

export function useRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const recordingRef = useRef<Audio.Recording | null>(null);

  // 🎤 녹음 시작
  const startRecording = async () => {
    try {
      // 권한 요청
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        throw new Error("Audio recording permission not granted");
      }

      // 오디오 모드 설정
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // 녹음 설정
      const recordingOptions = {
        android: {
          extension: ".m4a",
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        ios: {
          extension: ".m4a",
          outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC,
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        web: {
          mimeType: "audio/webm;codecs=opus",
          bitsPerSecond: 128000,
        },
      };

      const { recording: newRecording } = await Audio.Recording.createAsync(
        recordingOptions
      );

      setRecording(newRecording);
      recordingRef.current = newRecording;
      setIsRecording(true);
    } catch (err) {
      console.error("Failed to start recording", err);
      throw err;
    }
  };

  // ⏹ 녹음 정지 + 파일 URI 반환
  const stopRecording = async (): Promise<string | null> => {
    try {
      if (!recording || !recordingRef.current) {
        return null;
      }

      setIsRecording(false);
      await recording.stopAndUnloadAsync();

      // 오디오 모드 리셋
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      const uri = recording.getURI();
      setRecording(null);
      recordingRef.current = null;

      return uri;
    } catch (err) {
      console.error("Failed to stop recording", err);
      return null;
    }
  };

  // 📁 녹음 파일을 Blob으로 변환 (서버 업로드용)
  const getRecordingBlob = async (uri: string): Promise<Blob | null> => {
    try {
      if (!uri) return null;

      // React Native에서는 파일을 Base64로 읽어서 Blob으로 변환
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (!fileInfo.exists) return null;

      const fileContent = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Base64를 Blob으로 변환
      const byteCharacters = atob(fileContent);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);

      return new Blob([byteArray], { type: "audio/m4a" });
    } catch (err) {
      console.error("Failed to convert recording to blob", err);
      return null;
    }
  };

  // 🗑️ 녹음 파일 삭제
  const deleteRecording = async (uri: string) => {
    try {
      if (uri) {
        await FileSystem.deleteAsync(uri);
      }
    } catch (err) {
      console.error("Failed to delete recording", err);
    }
  };

  return {
    isRecording,
    startRecording,
    stopRecording,
    getRecordingBlob,
    deleteRecording,
  };
}
