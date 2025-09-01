import { ReactNode } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface SettingItemProps {
  icon: ReactNode;
  title: string;
  description: string;
  onClick?: () => void;
}

export function SettingItem({
  icon,
  title,
  description,
  onClick,
}: SettingItemProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onClick}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>{icon}</View>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  iconContainer: {
    flexShrink: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#d1d5db",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flexDirection: "column",
  },
  title: {
    fontWeight: "500",
  },
  description: {
    fontSize: 12,
    color: "#6b7280",
  },
});
