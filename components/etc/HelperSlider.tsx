"use client";

import { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";

type Props = {
  onChange: (
    intimacy:
      | "closeIntimacyExpressions"
      | "mediumIntimacyExpressions"
      | "distantIntimacyExpressions",
    formality: "lowFormality" | "mediumFormality" | "highFormality"
  ) => void;
};

// DownArrow Icon
const DownArrowIcon = ({ size = 14, color = "#6b7280" }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
  >
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 14l-7 7m0 0l-7-7m7 7V3"
    />
  </Svg>
);

// UpArrow Icon
const UpArrowIcon = ({ size = 14, color = "#6b7280" }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
  >
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 10l7-7m0 0l7 7m-7-7v18"
    />
  </Svg>
);

const styles = StyleSheet.create({
  tipContainer: {
    justifyContent: "center",
    marginBottom: 4,
  },
  tipImage: {
    width: 266,
    height: 33,
  },
  mainContainer: {
    justifyContent: "center",
  },
  sliderContainer: {
    width: 335,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "white",
  },
  intimacySection: {
    width: 335,
    paddingHorizontal: 24,
    maxWidth: 448,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "#3b82f6",
    backgroundColor: "#eff6ff",
    paddingBottom: 24,
  },
  formalitySection: {
    paddingVertical: 8,
  },
  sectionHeader: {
    paddingVertical: 4,
  },
  sectionTitle: {
    fontFamily: "Pretendard",
    color: "#374151",
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "500",
    lineHeight: 20.8,
  },
  sliderTrack: {
    position: "relative",
    marginBottom: 16,
    marginTop: 16,
    height: 16,
    width: "100%",
  },
  sliderBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#e5e7eb",
    borderRadius: 8,
    height: 16,
    width: "100%",
  },
  sliderTick: {
    position: "absolute",
    top: "50%",
    zIndex: 10,
    transform: [{ translateX: -4 }, { translateY: -4 }],
    width: 8,
    height: 8,
    backgroundColor: "#bfdbfe",
    borderRadius: 4,
  },
  sliderFill: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "#2563eb",
    borderRadius: 8,
    height: 16,
  },
  sliderThumb: {
    position: "absolute",
    top: "50%",
    transform: [{ translateY: -14 }, { translateX: -14 }],
    zIndex: 20,
  },
  labelsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 11,
    color: "#6b7280",
    paddingBottom: 8,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#d1d5db",
  },
  labelItem: {
    flex: 1,
  },
  labelLeft: {
    alignItems: "flex-start",
  },
  labelCenter: {
    alignItems: "center",
  },
  labelRight: {
    alignItems: "flex-end",
  },
  stepContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  stepContainerEnd: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    justifyContent: "flex-end",
  },
  stepText: {
    fontSize: 11,
    color: "#6b7280",
  },
});

const steps = [
  <View key="close" style={styles.stepContainer}>
    <DownArrowIcon />
    <Text style={styles.stepText}>Close</Text>
  </View>,
  <View key="middle" />,
  <View key="distant" style={styles.stepContainerEnd}>
    <Text style={styles.stepText}>Distant</Text>
    <UpArrowIcon />
  </View>,
];

const famSteps = [
  <View key="Low" style={styles.stepContainer}>
    <DownArrowIcon />
    <Text style={styles.stepText}>Low</Text>
  </View>,
  <View key="middle" />,
  <View key="High" style={styles.stepContainerEnd}>
    <Text style={styles.stepText}>High</Text>
    <UpArrowIcon />
  </View>,
];

export default function HelperSlider({ onChange }: Props) {
  const [showInfo, setShowInfo] = useState(true);
  const [level, setLevel] = useState(1);
  const max = steps.length - 1;
  const percent = (level / max) * 100;
  const [fam, setFam] = useState(1);
  const fMax = famSteps.length - 1;
  const fPercent = (fam / fMax) * 100;

  const handleUpdate = (newLevel: number, newFam: number) => {
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

    console.log("HelperSlider update:", {
      newLevel,
      newFam,
      intimacy: intimacyMap[newLevel],
      formality: formalityMap[newFam],
    });
    onChange(intimacyMap[newLevel], formalityMap[newFam]);
  };

  return (
    <>
      {showInfo && (
        <View style={styles.tipContainer}>
          <Image
            source={require("../../assets/etc/tip.png")}
            style={styles.tipImage}
            resizeMode="contain"
          />
        </View>
      )}

      <View style={styles.mainContainer}>
        <View style={styles.sliderContainer}>
          {/* Intimacy Level */}
          <View style={styles.intimacySection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Intimacy Level</Text>
            </View>
            <View style={styles.sliderTrack}>
              <View style={styles.sliderBackground} />
              {steps.map((_, i) => (
                <View
                  key={`lvl-tick-${i}`}
                  style={[
                    styles.sliderTick,
                    {
                      left: `${(i / max) * 100}%`,
                      marginLeft: i === 0 ? 8 : i === fMax ? -8 : -4,
                    },
                  ]}
                />
              ))}
              <View style={[styles.sliderFill, { width: `${percent}%` }]} />
              <View style={[styles.sliderThumb, { left: `${percent}%` }]} />
            </View>

            <View style={styles.labelsContainer}>
              {steps.map((label, i) => (
                <View
                  key={`lvl-label-${i}`}
                  style={[
                    styles.labelItem,
                    i === 0
                      ? styles.labelLeft
                      : i === steps.length - 1
                      ? styles.labelRight
                      : styles.labelCenter,
                  ]}
                >
                  {label}
                </View>
              ))}
            </View>
          </View>

          {/* Formality Level */}
          <View style={styles.formalitySection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Formality Level</Text>
            </View>

            <View style={styles.sliderTrack}>
              <View style={styles.sliderBackground} />
              {famSteps.map((_, i) => (
                <View
                  key={`fam-tick-${i}`}
                  style={[
                    styles.sliderTick,
                    {
                      left: `${(i / fMax) * 100}%`,
                      marginLeft: i === 0 ? 8 : i === fMax ? -8 : -4,
                    },
                  ]}
                />
              ))}
              <View style={[styles.sliderFill, { width: `${fPercent}%` }]} />
              <View style={[styles.sliderThumb, { left: `${fPercent}%` }]} />
            </View>

            <View style={styles.labelsContainer}>
              {famSteps.map((label, i) => (
                <View
                  key={`fam-label-${i}`}
                  style={[
                    styles.labelItem,
                    i === 0
                      ? styles.labelLeft
                      : i === famSteps.length - 1
                      ? styles.labelRight
                      : styles.labelCenter,
                  ]}
                >
                  {label}
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    </>
  );
}
