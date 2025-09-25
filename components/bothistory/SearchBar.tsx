"use client";

import { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";
type Props = {
  value: string;
  onChange: (v: string) => void;
  onSubmit?: (v: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  placeholder?: string;
  className?: string;
};

// MagnifyingGlassIcon
const MagnifyingGlassIcon = ({ size = 24, color = "#374151" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// XMarkIcon
const XMarkIcon = ({ size = 16, color = "#6b7280" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M18 6L6 18M6 6L18 18"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default function SearchBar({
  value,
  onChange,
  onSubmit,
  isOpen,
  onToggle,
  placeholder = "Search...",
  className = "",
}: Props) {
  const inputRef = useRef<TextInput>(null);
  const animatedWidth = useRef(new Animated.Value(0)).current;
  const animatedOpacity = useRef(new Animated.Value(0)).current;
  const screenWidth = Dimensions.get("window").width;
  // 열릴 때 자동 포커스
  useEffect(() => {
    if (isOpen) {
      onChange("");
      Animated.parallel([
        Animated.timing(animatedWidth, {
          toValue: screenWidth * 0.4,
          duration: 250,
          useNativeDriver: false,
        }),
        Animated.timing(animatedOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: false,
        }),
      ]).start();

      const id = requestAnimationFrame(() => inputRef.current?.focus());
      return () => cancelAnimationFrame(id);
    } else {
      Animated.parallel([
        Animated.timing(animatedWidth, {
          toValue: 0,
          duration: 250,
          useNativeDriver: false,
        }),
        Animated.timing(animatedOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [isOpen]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.searchContainer,
          {
            width: animatedWidth,
            opacity: animatedOpacity,
          },
        ]}
      >
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={onChange}
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          onSubmitEditing={(e) => onSubmit?.(e.nativeEvent.text)}
          accessibilityLabel="search"
        />
        {/* 입력값 지우기 */}
        {value && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => onChange("")}
            accessibilityLabel="clear"
          >
            <XMarkIcon />
          </TouchableOpacity>
        )}
      </Animated.View>

      {/* 토글 버튼 (돋보기) */}
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={onToggle}
        accessibilityLabel={isOpen ? "close search" : "open search"}
      >
        <MagnifyingGlassIcon />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  searchContainer: {
    position: "relative",
    overflow: "hidden",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 4,
    paddingLeft: 12,
    paddingRight: 28,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: "white",
  },
  clearButton: {
    position: "absolute",
    right: 6,
    top: "50%",
    transform: [{ translateY: -8 }],
    padding: 4,
    borderRadius: 4,
  },
  toggleButton: {
    padding: 6,
    borderRadius: 4,
  },
});
