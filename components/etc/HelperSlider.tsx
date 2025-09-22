import Slider from "@react-native-community/slider";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  steps?: number;
  onChange: (
    intimacy:
      | "closeIntimacyExpressions"
      | "mediumIntimacyExpressions"
      | "distantIntimacyExpressions",
    formality: "lowFormality" | "mediumFormality" | "highFormality"
  ) => void;
};

export default function HelperSlider({ onChange, steps = 3}: Props) {
  const [level, setLevel] = useState(0.5); // intimacy 0~1
  const [fam, setFam] = useState(0.5); // formality 0~1

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

  const getStepValue = (percent: number) => {
    const value = percent * 100;
    if (steps === 3) {
      if (value <= 33) return 0;
      if (value <= 67) return 1;
      return 2;
    }
    const stepSize = 100 / steps;
    return Math.min(steps - 1, Math.floor(value / stepSize));
  };

  const handleUpdate = (intimacyPercent: number, formalityPercent: number) => {
    const stepLevel = getStepValue(intimacyPercent);
    const stepFam = getStepValue(formalityPercent);
    onChange(intimacyMap[stepLevel], formalityMap[stepFam]);
  };

  useEffect(() => {
    handleUpdate(level, fam);
  }, []);
  const renderMarks = () => {
    return Array.from({ length: steps }, (_, i) => {
      const pos = (i / (steps - 1)) * 100;
      let offset = -4; // 기본 중앙 정렬

      if (i === 0) offset = 4; // 왼쪽 tick은 오른쪽으로 밀기
      if (i === steps - 1) offset = -12; // 오른쪽 tick은 왼쪽으로 당기기

      return (
        <View
          key={i}
          style={[styles.mark, { left: `${pos}%`, marginLeft: offset }]}
        />
      );
    });
  };
  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        {/* Intimacy */}
        <View style={styles.sectionBlue}>
          <Text style={styles.sectionTitle}>Intimacy Level</Text>
          <View style={styles.trackContainer}>
            <View style={styles.trackBg} />
            <View style={[styles.trackFill, { width: `${level * 100}%` }]} />
            {renderMarks()}
            <Slider
              value={ level}
              minimumValue={0}
              maximumValue={1}
              step={0.01}
              style={styles.slider}
              minimumTrackTintColor="transparent"
              maximumTrackTintColor="transparent"
              thumbTintColor="#fff"
              onValueChange={setLevel}
              onSlidingComplete={(v) => {
                const step = getStepValue(v);
                const snap = step / (steps - 1);
                setLevel(snap);
                handleUpdate(snap, fam);
              }}
            />
          </View>
          <View style={styles.labelRow}>
            <Text style={styles.labelText}>⬇️ Close</Text>
            <Text style={styles.labelText}>Distant ⬆️</Text>
          </View>
        </View>

        {/* Formality */}
        <View style={styles.sectionBlue}>
          <Text style={styles.sectionTitle}>Formality Level</Text>
          <View style={styles.trackContainer}>
            <View style={styles.trackBg} />
            <View style={[styles.trackFill, { width: `${fam * 100}%` }]} />
            {renderMarks()}
            <Slider
              value={fam}
              minimumValue={0}
              maximumValue={1}
              step={0.01}
              style={styles.slider}
              minimumTrackTintColor="transparent"
              maximumTrackTintColor="transparent"
              thumbTintColor="#fff"
              onValueChange={setLevel}
              onSlidingComplete={(v) => {
                const step = getStepValue(v);
                const snap = step / (steps - 1);
                setFam(snap);
                handleUpdate(level, snap);
              }}
            />
          </View>
          <View style={styles.labelRow}>
            <Text style={styles.labelText}>⬇️ Low</Text>
            <Text style={styles.labelText}>High ⬆️</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: "center", width: "100%" },
  card: {
    width: "100%",
    borderRadius: 12,
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
  trackContainer: {
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
  mark: {
    position: "absolute",
    top: "50%",
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#d3e0f5",
    transform: [{ translateY: -4 }],
  },
  slider: {
    width: "100%",
    height: 40,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  labelText: {
    fontSize: 12,
    color: "#6b7280",
  },
});
