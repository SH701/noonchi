"use client";

import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { ImageSourcePropType } from "react-native";

export type Level = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
export type Interest = string;

interface UserContextType {
  koreanLevel: Level;
  selectedFace: number | null;
  profileImageUrl: string | ImageSourcePropType | null;
  interests: Interest[];
  accessToken: string | null;
  isLoading: boolean;
  setKoreanLevel: (v: Level) => void;
  setSelectedFace: (i: number | null) => void;
  setProfileImageUrl: (url: string | ImageSourcePropType | null) => void;
  setInterests: (v: Interest[]) => void;
  setAccessToken: (token: string | null) => Promise<void>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [koreanLevel, setKoreanLevel] = useState<Level>("BEGINNER");
  const [selectedFace, setSelectedFace] = useState<number | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<
    string | ImageSourcePropType | null
  >(null);
  const [interests, setInterests] = useState<Interest[]>([]);
  const [accessToken, _setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 앱 시작 시 토큰 불러오기
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem("accessToken");
        if (saved) {
          _setAccessToken(saved);
        }
      } catch (err) {
        console.error("Failed to load token:", err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // 토큰 저장/삭제
  const setAccessToken = async (token: string | null) => {
    try {
      if (token) {
        await AsyncStorage.setItem("accessToken", token);
        _setAccessToken(token);
      } else {
        await AsyncStorage.removeItem("accessToken");
        _setAccessToken(null);
      }
    } catch (err) {
      console.error("Failed to save token:", err);
    }
  };

  // 로그아웃 함수
  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(["accessToken"]);
      _setAccessToken(null);
      // 다른 사용자 데이터도 초기화
      setKoreanLevel("BEGINNER");
      setSelectedFace(null);
      setProfileImageUrl(null);
      setInterests([]);
    } catch (err) {
      console.error("Failed to logout:", err);
    }
  };

  return (
    <UserContext.Provider
      value={{
        koreanLevel,
        setKoreanLevel,
        selectedFace,
        setSelectedFace,
        profileImageUrl,
        setProfileImageUrl,
        interests,
        setInterests,
        accessToken,
        setAccessToken,
        isLoading,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
