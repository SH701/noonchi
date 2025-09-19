"use client";

import { SetStateAction, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";

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

const CustomSlider = ({
  value,
  onValueChange,
  min = 0,
  max = 2,
}: {
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
}) => {
  const percent = (value / max) * 100;

  return (
    <View style={styles.sliderContainer}>
      {/* 배경 트랙 */}
      <View style={styles.sliderTrack} />

      {/* 채워진 부분 */}
      <View style={[styles.sliderFill, { width: `${percent}%` }]} />

      {/* 눈금 점들 */}
      {[0, 1, 2].map((step) => (
        <View
          key={step}
          style={[
            styles.sliderTick,
            {
              left: `${(step / max) * 100}%`,
              marginLeft: step === 0 ? 4 : step === max ? -12 : -2,
            },
          ]}
        />
      ))}
      <View
        style={[
          styles.sliderThumb,
          {
            left: `${percent}%`,
            marginLeft: -14,
          },
        ]}
      />

      {/* 터치 영역 */}
      <TouchableOpacity style={styles.sliderTouchArea} activeOpacity={1}>
        {/* 3개의 터치 구역 */}
        <TouchableOpacity
          style={[styles.touchZone, { left: "0%" }]}
          onPress={() => onValueChange(0)}
          activeOpacity={0.7}
        />
        <TouchableOpacity
          style={[styles.touchZone, { left: "33.33%" }]}
          onPress={() => onValueChange(1)}
          activeOpacity={0.7}
        />
        <TouchableOpacity
          style={[styles.touchZone, { left: "66.66%" }]}
          onPress={() => onValueChange(2)}
          activeOpacity={0.7}
        />
      </TouchableOpacity>
    </View>
  );
};

export default function HonorificSlider({
  category = "ask_eat",
}: {
  category?: "ask_eat" | "ask_did_you_eat" | "apology";
}) {
  const [showex, setShowex] = useState(false);
  const [showInfo, setShowInfo] = useState(true);
  const [level, setLevel] = useState(1); // intimacy
  const [fam, setFam] = useState(1); // formality
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

  const currentSentence = expressions[category][level][fam];

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

      {/* tip 이미지 (슬라이드하면 사라짐) */}
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
        <CustomSlider
          value={level}
          onValueChange={(val: SetStateAction<number>) => {
            setLevel(val);
            if (showInfo) setShowInfo(false);
          }}
        />
        <View style={styles.sliderLabels}>
          <Text style={styles.labelText}>Close</Text>
          <Text style={styles.labelText}>Distant</Text>
        </View>
      </View>

      {/* Formality Slider */}
      <View style={styles.sliderBox}>
        <Text style={styles.sliderTitle}>Formality Level</Text>
        <CustomSlider
          value={fam}
          onValueChange={(val: SetStateAction<number>) => {
            setFam(val);
            if (showInfo) setShowInfo(false);
          }}
        />
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
  title: {
    fontSize: 16,
    marginTop: 16,
  },
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
  phraseText: {
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
  },
  toggleButton: {
    position: "absolute",
    right: 8,
    top: 12,
  },
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
  explanationText: {
    color: "#374151",
    textAlign: "center",
    fontSize: 13,
  },
  tipImage: {
    width: 266,
    height: 33,
    marginTop: 12,
  },
  sliderBox: {
    width: "90%",
    marginTop: 6,
  },
  sliderTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  sliderContainer: {
    height: 16,
    position: "relative",
    marginVertical: 12,
  },
  sliderTrack: {
    position: "absolute",
    width: "100%",
    height: 16,
    backgroundColor: "#e5e7eb",
    borderRadius: 8,
  },
  sliderFill: {
    position: "absolute",
    height: 16,
    backgroundColor: "#3b82f6",
    borderRadius: 8,
  },
  sliderTick: {
    position: "absolute",
    width: 8,
    height: 8,
    backgroundColor: "#D0DCEE",
    borderRadius: 4,
    top: 4,
    zIndex: 10,
  },
  sliderThumb: {
    position: "absolute",
    width: 28,
    height: 28,
    backgroundColor: "white",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#000",
    top: -6, // 트랙 중앙에 위치
    marginLeft: -14, // 썸의 중앙을 기준점으로
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 20,
  },
  sliderTouchArea: {
    position: "absolute",
    width: "100%",
    height: 40, // 터치 영역을 더 크게
    top: -12,
    flexDirection: "row",
  },
  touchZone: {
    position: "absolute",
    width: "33.33%",
    height: "100%",
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  labelText: {
    fontSize: 12,
    color: "#6b7280",
  },
});
