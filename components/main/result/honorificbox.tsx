import { StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";

type HonorificBoxProps = {
  style?: object;
  messageId: number;
  honorificResults: Record<string, any>;
  sliderValue: Record<string, number>;
  setSliderValue: React.Dispatch<React.SetStateAction<Record<string, number>>>;
};

const formalityMap = ["lowFormality", "mediumFormality", "highFormality"];

// DownArrow Icon
const DownArrowIcon = ({ size = 8, color = "#6b7280" }) => (
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
const UpArrowIcon = ({ size = 8, color = "#6b7280" }) => (
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

export default function HonorificBox({
  style,
  messageId,
  honorificResults,
  sliderValue,
  setSliderValue,
}: HonorificBoxProps) {
  const value = sliderValue[messageId] ?? 1;
  const resultText = honorificResults[messageId]
    ? honorificResults[messageId][formalityMap[value]]
    : "Loading...";

  return (
    <View style={[styles.container, style]}>
      {/* 결과 문장 */}
      <Text style={styles.resultText}>{resultText}</Text>

      {/* 슬라이더 */}
      <View style={styles.sliderContainer}>
        <View style={styles.sliderTrack}>
          <View
            style={[styles.sliderFill, { width: `${(value / 2) * 100}%` }]}
          />
        </View>
      </View>

      {/* 라벨 */}
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
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#4b5563",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    shadowColor: "rgba(0,0,0,0.1)",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginTop: -16,
    paddingHorizontal: 12,
    paddingTop: 20,
    paddingBottom: 12,
    maxWidth: 240,
  },
  resultText: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
    marginBottom: 12,
  },
  sliderContainer: { width: "100%" },
  sliderTrack: {
    width: "100%",
    height: 8,
    backgroundColor: "#6b7280",
    borderRadius: 4,
    overflow: "hidden",
  },
  sliderFill: {
    height: 8,
    backgroundColor: "#3b82f6",
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
    columnGap: 4, // RN 0.71+ 지원
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
