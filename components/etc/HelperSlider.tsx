import React, { useRef, useState } from "react";
import { PanResponder, Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  onChange: (
    intimacy:
      | "closeIntimacyExpressions"
      | "mediumIntimacyExpressions"
      | "distantIntimacyExpressions",
    formality: "lowFormality" | "mediumFormality" | "highFormality"
  ) => void;
};

export default function HelperSlider({ onChange }: Props) {
  const [level, setLevel] = useState(1);
  const [fam, setFam] = useState(1);

  const max = 2;
  const sliderWidth = 280; // 실제 트랙 너비
  const thumbSize = 28;

  const intimacyMap = [
    "closeIntimacyExpressions",
    "mediumIntimacyExpressions",
    "distantIntimacyExpressions",
  ] as const;

  const formalityMap = [
    "lowFormality",
    "mediumFormality",
    "highFormality",
  ] as const;

  const handleUpdate = (newLevel: number, newFam: number) => {
    onChange(intimacyMap[newLevel], formalityMap[newFam]);
  };

  // 공통 PanResponder
  const createResponder = (
    type: "intimacy" | "formality",
    value: number,
    setValue: React.Dispatch<React.SetStateAction<number>>
  ) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        let newX = Math.min(Math.max(0, gesture.moveX - 40), sliderWidth);
        const newValue = Math.round((newX / sliderWidth) * max);
        if (newValue !== value) {
          setValue(newValue);
          if (type === "intimacy") handleUpdate(newValue, fam);
          else handleUpdate(level, newValue);
        }
      },
    });

  const intimacyResponder = useRef(
    createResponder("intimacy", level, setLevel)
  ).current;
  const formalityResponder = useRef(
    createResponder("formality", fam, setFam)
  ).current;

  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        {/* Intimacy */}
        <View style={styles.sectionBlue}>
          <Text style={styles.sectionTitle}>Intimacy Level</Text>
          <View style={styles.track}>
            <View style={styles.trackBg} />
            <View
              style={[styles.trackFill, { width: (level / max) * sliderWidth }]}
            />
            <View
              {...intimacyResponder.panHandlers}
              style={[
                styles.thumb,
                { left: (level / max) * sliderWidth - thumbSize / 2 },
              ]}
            />
            {[0, 1, 2].map((i) => (
              <Pressable
                key={`intimacy-${i}`}
                style={[
                  styles.tick,
                  {
                    left: `${(i / max) * 100}%`,
                    marginLeft: i === 0 ? 4 : i === max ? -12 : -2,
                  },
                ]}
                onPress={() => {
                  setLevel(i);
                  handleUpdate(i, fam);
                }}
              />
            ))}
          </View>
          <View style={styles.labelRow}>
            <Text style={styles.labelText}>Close</Text>
            <Text style={styles.labelText}>Distant</Text>
          </View>
        </View>

        {/* Formality */}
        <View style={styles.sectionBlue}>
          <Text style={styles.sectionTitle}>Formality Level</Text>
          <View style={styles.track}>
            <View style={styles.trackBg} />
            <View
              style={[styles.trackFill, { width: (fam / max) * sliderWidth }]}
            />
            <View
              {...formalityResponder.panHandlers}
              style={[
                styles.thumb,
                { left: (fam / max) * sliderWidth - thumbSize / 2 },
              ]}
            />
            {[0, 1, 2].map((i) => (
              <Pressable
                key={`fam-${i}`}
                style={[
                  styles.tick,
                  {
                    left: `${(i / max) * 100}%`,
                    marginLeft: i === 0 ? 4 : i === max ? -12 : -2,
                  },
                ]}
                onPress={() => {
                  setFam(i);
                  handleUpdate(level, i);
                }}
              />
            ))}
          </View>
          <View style={styles.labelRow}>
            <Text style={styles.labelText}>Low</Text>
            <Text style={styles.labelText}>High</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: "center" },
  card: {
    width: 335,
    borderRadius: 12,
    backgroundColor: "white",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#60A5FA",
  },
  sectionBlue: {
    padding: 16,
    backgroundColor: "#EFF6FF",
    borderBottomWidth: 1,
    borderColor: "#d1d5db",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
  },
  track: {
    height: 16,
    borderRadius: 8,
    marginBottom: 12,
    justifyContent: "center",
  },
  trackBg: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 16,
    backgroundColor: "#e5e7eb",
    borderRadius: 8,
  },
  trackFill: {
    position: "absolute",
    left: 0,
    height: 16,
    backgroundColor: "#2563eb",
    borderRadius: 8,
  },
  thumb: {
    position: "absolute",
    top: "50%",
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#2563eb",
    transform: [{ translateY: -14 }],
    zIndex: 10,
  },
  tick: {
    position: "absolute",
    top: "50%",
    width: 20, // ✅ 터치영역 크게
    height: 40,
    backgroundColor: "transparent", // 안 보이게
    transform: [{ translateY: -20 }],
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  labelText: {
    fontSize: 12,
    color: "#6b7280",
  },
});
