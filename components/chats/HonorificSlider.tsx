"use client";

import Slider from "@react-native-community/slider";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";

export type HonorificResults = {
  lowFormality: string;
  mediumFormality: string;
  highFormality: string;
};

type HonorificSliderProps = {
  results: HonorificResults;
  value: number;
  onChange: (newValue: number) => void;
};

// DownArrow Icon
const DownArrowIcon = () => (
  <Svg width={8} height={8} viewBox="0 0 24 24" fill="none" stroke="#6b7280">
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 14l-7 7m0 0l-7-7m7 7V3"
    />
  </Svg>
);

// UpArrow Icon
const UpArrowIcon = () => (
  <Svg width={8} height={8} viewBox="0 0 24 24" fill="none" stroke="#6b7280">
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 10l7-7m0 0l7 7m-7-7v18"
    />
  </Svg>
);

export default function HonorificSlider({
  results,
  value,
  onChange,
}: HonorificSliderProps) {
  const mapped = [
    results.lowFormality,
    results.mediumFormality,
    results.highFormality,
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.resultText}>{mapped[value]}</Text>

      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={100} 
          step={1} 
          value={value}
          onValueChange={(v) => {
            let mappedValue = 0;
            if (v <= 33) mappedValue = 0; 
            else if (v <= 67) mappedValue = 1; 
            else mappedValue = 2; 
            onChange(mappedValue);
          }}
          minimumTrackTintColor="#3b82f6"
          maximumTrackTintColor="#d1d5db"
          thumbTintColor="#2563eb"
        />
        <View style={styles.labelsContainer}>
          <View style={styles.labelItem}>
            <View style={styles.arrowContainer}>
              <DownArrowIcon />
            </View>
            <Text style={styles.labelText}>Casual</Text>
          </View>
          <View style={styles.labelItem}>
            <Text style={styles.labelText}>Official</Text>
            <View style={styles.arrowContainer}>
              <UpArrowIcon />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#4b5563",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    marginTop: -20,
    zIndex: -10,
  },
  resultText: {
    marginBottom: 12,
    color: "white",
    fontSize: 14,
    marginTop: 12,
  },
  sliderContainer: {
    position: "relative",
  },
  slider: {
    width: "100%",
    height: 6,
    marginVertical: 6,
  },
  thumb: {
    backgroundColor: "#3B82F6",
    height: 20,
    borderRadius: 10,
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  labelsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  labelItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  arrowContainer: {
    width: 16,
    height: 16,
    backgroundColor: "#9ca3af",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  labelText: {
    fontSize: 12,
    color: "white",
  },
});
