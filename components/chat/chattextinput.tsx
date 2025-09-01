"use client";

import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ChatTextInput() {
  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require("../../assets/circle/circle4.png")}
          style={styles.circleImage}
          resizeMode="contain"
        />
        <Text style={styles.text}>Enter a phrase you want to make polite!</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 340,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 8,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: "#bfdbfe",
    backgroundColor: "white",
    height: 52,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  circleImage: {
    width: 28,
    height: 28,
  },
  text: {
    color: "#6b7280",
    fontSize: 14,
  },
});
