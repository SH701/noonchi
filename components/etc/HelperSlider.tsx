import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
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

// ↓ 아이콘
const DownArrow = ({ size = 14, color = "#6b7280" }) => (
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

// ↑ 아이콘
const UpArrow = ({ size = 14, color = "#6b7280" }) => (
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

export default function HelperSlider({ onChange }: Props) {
  const [level, setLevel] = useState(1); 
  const [fam, setFam] = useState(1); 

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

  const max = 2;
  const percent = (level / max) * 100;
  const fMax = 2;
  const fPercent = (fam / fMax) * 100;

  const handleUpdate = (newLevel: number, newFam: number) => {
    onChange(intimacyMap[newLevel], formalityMap[newFam]);
  };

  return (
    <View style={styles.wrapper}>
      {/* TIP 이미지 */}
      <View style={{ alignItems: "center", marginBottom: 6 }}>
        <Image
          source={require("../../assets/etc/tip.png")}
          style={{ width: 266, height: 33, resizeMode: "contain" }}
        />
      </View>

      <View style={styles.card}>
        {/* Intimacy */}
        <View style={styles.sectionBlue}>
          <Text style={styles.sectionTitle}>Intimacy Level</Text>
          {/* Slider */}
          <View style={styles.track}>
            <View style={styles.trackBg} />
            <View style={[styles.trackFill, { width: `${percent}%` }]} />
            <View
              style={[styles.thumb, { left: `${percent}%`, marginLeft: -14 }]}
            />
            {/* Step ticks */}
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

          {/* Labels */}
          <View style={styles.labelRow}>
            <View style={styles.labelLeft}>
              <DownArrow />
              <Text style={styles.labelText}>Close</Text>
            </View>
            <View style={styles.labelRight}>
              <Text style={styles.labelText}>Distant</Text>
              <UpArrow />
            </View>
          </View>
        </View>

        {/* Formality */}
        <View style={styles.sectionBlue}>
          <Text style={styles.sectionTitle}>Formality Level</Text>

          <View style={styles.track}>
            <View style={styles.trackBg} />
            <View style={[styles.trackFill, { width: `${fPercent}%` }]} />
            <View
              style={[styles.thumb, { left: `${fPercent}%`, marginLeft: -14 }]}
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
                hitSlop={20}
                onPress={() => {
                  setFam(i);
                  handleUpdate(level, i);
                }}
              />
            ))}
          </View>

          <View style={styles.labelRow}>
            <View style={styles.labelLeft}>
              <DownArrow />
              <Text style={styles.labelText}>Low</Text>
            </View>
            <View style={styles.labelRight}>
              <Text style={styles.labelText}>High</Text>
              <UpArrow />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
  },
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
  sectionWhite: {
    padding: 16,
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
    width: 8,
    height: 8,
    backgroundColor: "#BFDBFE",
    borderRadius: 4,
    transform: [{ translateY: -4 }],
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  labelLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  labelRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  labelText: {
    fontSize: 12,
    color: "#6b7280",
  },
});
