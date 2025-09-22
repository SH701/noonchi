"use client";
import Slider from "@react-native-community/slider";
import { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";

type Props = {
  category: "ask_eat" | "ask_did_you_eat" | "apology";
  steps?: number;
};

const ChevronDownIcon = ({ size = 20, color = "#6b7280" }) => (
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
      d="M19 9l-7 7-7-7"
    />
  </Svg>
);

const ChevronUpIcon = ({ size = 20, color = "#6b7280" }) => (
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
      d="M5 15l7-7 7 7"
    />
  </Svg>
);

export default function MainSlider({ category, steps }: Props) {
  const [showex, setShowex] = useState(false);
  const [showInfo, setShowInfo] = useState(true);
  const [intimacy, setIntimacy] = useState<number>(50);
  const [formality, setFormality] = useState<number>(50);

  const getStep = (value: number): 0 | 1 | 2 => {
    if (value <= 33) return 0;
    if (value <= 67) return 1;
    return 2;
  };

  const expressions = {
    ask_eat: [
      [
        {
          phrase: "이거 먹어",
          explanation:
            "Pure casual Korean! Family members use this direct, warm tone. No formality needed when you’re super close. 🤗",
        },
        {
          phrase: "이거 먹어봐",
          explanation:
            "Adding “봐” softens it slightly while keeping the close relationship. Perfect for friends in public spaces. ☕",
        },
        {
          phrase: "이거 한 번 먹어봐요",
          explanation:
            "Even with closeness, you show respect for the setting. “한 번” adds gentle suggestion rather than command. 🫱",
        },
      ],
      [
        {
          phrase: "이것 좀 먹어볼래?",
          explanation:
            "Question form (“~볼래?”) makes it a suggestion, not an order. “좀” adds politeness while staying friendly. 🍪",
        },
        {
          phrase: "이것 좀 드세요",
          explanation:
            "Standard workplace politeness. “드세요” shows respect, “좀” keeps it approachable. Safe for most office situations! 💼",
        },
        {
          phrase: "이것 한 번 드셔보세요",
          explanation:
            "More formal but still natural. Perfect for semi-formal work gatherings where respect matters. 🍽️",
        },
      ],
      [
        {
          phrase: "이것 좀 드셔보세요",
          explanation:
            "Service industry standard. Polite but approachable — wants to maintain customer friendliness. 🛍️",
        },
        {
          phrase: "이것 드셔보시겠어요?",
          explanation:
            "Professional service tone. The question form gives customer choice while showing proper respect. 🎩",
        },
        {
          phrase: "이것 드시겠습니까?",
          explanation:
            "Top-tier service Korean. Formal but natural — what you’d hear at luxury hotels or formal business meetings. ✨",
        },
      ],
    ],
    ask_did_you_eat: [
      // Low Intimacy
      [
        {
          phrase: "밥 먹었어?",
          explanation:
            "Classic Korean greeting! Shows care in the most casual way. This is how Korean families check on each other. 🐥",
        },
        {
          phrase: "밥 먹었어요?",
          explanation:
            "Adding “요” shows basic politeness while maintaining warmth. Perfect for close friends when you want to be slightly more polite. 🌼",
        },
        {
          phrase: "식사 하셨어요?",
          explanation:
            "“식사” is more formal than “밥”, and “하셨어요” shows respect. Great when talking to people you’re close to but need to respect. 🙇",
        },
      ],
      // Medium Intimacy
      [
        {
          phrase: "밥은 먹었어?",
          explanation:
            "Adding “은” makes it slightly more structured. Common in relaxed workplace conversations during breaks. 🍵",
        },
        {
          phrase: "점심 드셨어요?",
          explanation:
            "“점심” specifies the meal, “드셨어요” shows workplace-appropriate respect. Standard office small talk. 💼",
        },
        {
          phrase: "식사는 하셨습니까?",
          explanation:
            "Business-level formality. “습니까” ending shows professional respect. Used when checking on clients or partners. 🗝️",
        },
      ],
      // High Intimacy
      [
        {
          phrase: "밥 드셨어요?",
          explanation:
            "Casual but respectful service tone. Common in casual restaurants or when vendors check on customers. 🍚",
        },
        {
          phrase: "식사 하셨습니까?",
          explanation:
            "Professional hospitality language. Shows proper respect while maintaining service industry warmth. 🏨",
        },
        {
          phrase: "진지 드셨습니까?",
          explanation:
            "“진지” is the highest honorific for meal. Reserved for VIP treatment or very formal dining situations. 🍷",
        },
      ],
    ],
    apology: [
      // Low Intimacy
      [
        {
          phrase: "잘못했어",
          explanation:
            "Direct admission among family. No extra formality needed — just honest acknowledgment between close people. 💔",
        },
        {
          phrase: "내가 잘못했어",
          explanation:
            "Adding “내가” (I) takes clear responsibility. Shows sincerity while keeping the casual tone with friends. 🤗",
        },
        {
          phrase: "제가 잘못했어요",
          explanation:
            "“제가” is the humble form of “I”, with polite “어요” ending. Shows respect while maintaining some closeness. 🙏",
        },
      ],
      // Medium Intimacy
      [
        {
          phrase: "내 실수야",
          explanation:
            "“실수” (mistake) sounds more professional than “잘못”. Good for minor work errors in relaxed settings. 😅",
        },
        {
          phrase: "제가 실수했습니다",
          explanation:
            "Standard workplace apology. “실수했습니다” is professional but not overly dramatic. Safe for most office situations. 💼",
        },
        {
          phrase: "저의 잘못입니다",
          explanation:
            "“저의 잘못입니다” is structured and takes clear responsibility. Perfect for formal work apologies. 📖",
        },
      ],
      // High Intimacy
      [
        {
          phrase: "제가 잘못했네요",
          explanation:
            "“네요” ending softens the formality while maintaining respect. Common in service industry apologies. 👜",
        },
        {
          phrase: "저의 실수였습니다",
          explanation:
            "Formal but natural business language. “였습니다” shows the mistake is acknowledged and resolved. 🗂️",
        },
        {
          phrase: "저의 부주의였습니다",
          explanation:
            "“부주의” (carelessness) shows deep responsibility. Used for serious situations requiring maximum respect and accountability. 📄",
        },
      ],
    ],
  } as const;

  const currentSentence =
    expressions[category][getStep(intimacy)][getStep(formality)];

  const renderMarks = () => {
    return [0, 50, 100].map((pos, i) => (
      <View
        key={i}
        style={[
          styles.mark,
          { left: `${pos}%`, marginLeft: i === 0 ? 3 : i === 3 ? -12 : -12 },
        ]}
      />
    ));
  };
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ alignItems: "center", paddingBottom: 160 }}
      scrollEnabled={showex}
      bounces={false}
      alwaysBounceVertical={false}
    >
      <Text style={styles.title}>Today`s honorific expression</Text>

      {/* 오늘의 문장 */}
      <View style={styles.sentenceContainer}>
        <Text style={styles.phraseText}>{currentSentence.phrase}</Text>
        <TouchableOpacity
          onPress={() => setShowex((prev) => !prev)}
          style={styles.toggleButton}
        >
          {showex ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </TouchableOpacity>
      </View>

      {showex && (
        <View style={styles.explanationContainer}>
          <Text style={styles.explanationText}>
            {currentSentence.explanation}
          </Text>
        </View>
      )}

      {showInfo && (
        <Image
          source={require("../../assets/etc/tip.png")}
          style={styles.tipImage}
          resizeMode="contain"
        />
      )}

      {/* Intimacy Slider */}
      <View style={styles.sliderBox}>
        <Text style={styles.sliderTitle}>Intimacy Level</Text>
        <View style={styles.trackContainer}>
          <View style={styles.trackBg} />
          <View style={[styles.trackFill, { width: `${intimacy}%` }]} />
          {renderMarks()}
          <Slider
            value={intimacy}
            minimumValue={0}
            maximumValue={100}
            step={1}
            style={styles.slider}
            minimumTrackTintColor="transparent"
            maximumTrackTintColor="transparent"
            thumbTintColor="#fff"
            onValueChange={(val) => {
              setIntimacy(val);
              setShowInfo(false);
            }}
          />
        </View>
        <View style={styles.sliderLabels}>
          <Text style={styles.labelText}>Close</Text>
          <Text style={styles.labelText}>Distant</Text>
        </View>
      </View>

      {/* Formality Slider */}
      <View style={styles.sliderBox}>
        <Text style={styles.sliderTitle}>Formality Level</Text>
        <View style={styles.trackContainer}>
          <View style={styles.trackBg} />
          <View style={[styles.trackFill, { width: `${formality}%` }]} />
          {renderMarks()}
          <Slider
            value={formality}
            minimumValue={0}
            maximumValue={100}
            step={1}
            minimumTrackTintColor="transparent"
            maximumTrackTintColor="transparent"
            thumbTintColor="#fff"
            style={styles.slider}
            onValueChange={(val) => {
              setFormality(val);
              setShowInfo(false);
            }}
          />
        </View>
        <View style={styles.sliderLabels}>
          <Text style={styles.labelText}>Low</Text>
          <Text style={styles.labelText}>High</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 12,
    backgroundColor: "white",
    paddingBottom: 24,
  },
  title: { fontSize: 16, marginTop: 16 },
  sentenceContainer: {
    width: "90%",
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingVertical: 12,
    marginTop: 12,
    marginBottom: 6,
    borderRadius: 12,
    alignItems: "center",
    position: "relative",
  },
  phraseText: { fontWeight: "600", fontSize: 16, textAlign: "center" },
  toggleButton: { position: "absolute", right: 8, top: 12 },
  explanationContainer: {
    width: "90%",
    padding: 12,
    borderRadius: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#f3f4f6",
    alignItems: "center",
  },
  explanationText: { color: "#374151", textAlign: "center", fontSize: 13 },
  tipImage: { width: 266, height: 33, marginTop: 12 },
  sliderBox: { width: "90%", marginTop: 12 },
  sliderTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 12,
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  labelText: { fontSize: 12, color: "#6b7280" },
  mark: {
    position: "absolute",
    top: "50%",
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#d3e0f5",
    transform: [{ translateY: -4 }],
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
  slider: {
    width: "106%",
    height: 40,
    marginLeft: -12,
  },
});
