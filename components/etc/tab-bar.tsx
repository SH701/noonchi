"use client";

import { usePathname, useRouter } from "expo-router";
import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import ChatInputWrapper from "../chat/chatinputwrapper";

// HomeIcon
const HomeIcon = ({ color = "#3b82f6" }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={color}>
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </Svg>
);

// ClockIcon
const ClockIcon = ({ color = "#3b82f6" }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={color}>
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </Svg>
);

// UserIcon
const UserIcon = ({ color = "#3b82f6" }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={color}>
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </Svg>
);

export default function TabBar() {
  const [open, setOpen] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const onClick = () => {
    setOpen((prev) => !prev);
  };

  const navigateTo = (path: string) => {
    router.push(path);
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {pathname === "/main" && (
          <View style={styles.chatSection}>
            {open && (
              <TouchableOpacity style={styles.honorificImage} onPress={onClick}>
                <Image
                  source={require("../../assets/etc/honorific.png")}
                  style={styles.honorificImageStyle}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            )}
            <ChatInputWrapper />
          </View>
        )}

        {/* 하단 탭 */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => navigateTo("/main")}
          >
            <HomeIcon color={pathname === "/main" ? "#3b82f6" : "#d1d5db"} />
            <Text
              style={[
                styles.tabText,
                { color: pathname === "/main" ? "#3b82f6" : "#d1d5db" },
              ]}
            >
              Home
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => navigateTo("/main/chatbot")}
          >
            <ClockIcon
              color={pathname === "/main/chatbot" ? "#3b82f6" : "#d1d5db"}
            />
            <Text
              style={[
                styles.tabText,
                {
                  color: pathname === "/main/chatbot" ? "#3b82f6" : "#d1d5db",
                },
              ]}
            >
              History
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => navigateTo("/main/profile")}
          >
            <UserIcon
              color={
                pathname.startsWith("/main/profile") ? "#3b82f6" : "#d1d5db"
              }
            />
            <Text
              style={[
                styles.tabText,
                {
                  color: pathname.startsWith("/main/profile")
                    ? "#3b82f6"
                    : "#d1d5db",
                },
              ]}
            >
              Profile
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  tabBar: {
    width: "100%",
    backgroundColor: "white",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },
  chatSection: {
    paddingHorizontal: 16,
    position: "relative",
  },
  honorificImage: {
    position: "absolute",
    top: -14,
    left: 26,
    zIndex: 1,
  },
  honorificImageStyle: {
    width: 124,
    height: 33,
  },
  tabContainer: {
    flexDirection: "row",
  },
  tabItem: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 30,
    paddingTop: 15,
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
  },
});
