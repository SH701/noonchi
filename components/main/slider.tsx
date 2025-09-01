"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";

// ChevronDownIcon
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

// ChevronUpIcon
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
  container: {
    width: 335,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    shadowColor: "rgba(0,0,0,0.1)",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 4,
    marginHorizontal: "auto",
    backgroundColor: "white",
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 12,
  },
  sentenceContainer: {
    width: 296,
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingVertical: 12,
    marginVertical: 8,
    marginBottom: 12,
    borderRadius: 12,
  },
  sentenceContent: {
    fontSize: 16,
    position: "relative",
    textAlign: "center",
    paddingHorizontal: 32,
    paddingVertical: 4,
  },
  phraseText: {
    fontWeight: "600",
  },
  toggleButton: {
    position: "absolute",
    right: 8,
    top: "50%",
    transform: [{ translateY: -10 }],
  },
  explanationContainer: {
    fontSize: 13,
    width: 296,
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#f3f4f6",
    alignItems: "center",
  },
  explanationText: {
    color: "#374151",
    textAlign: "center",
  },
  tipContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  tipImage: {
    width: 266,
    height: 33,
  },
  sliderContainer: {
    width: 335,
    paddingHorizontal: 24,
    maxWidth: 448,
    marginHorizontal: "auto",
    borderRadius: 12,
    paddingBottom: 24,
  },
  sliderSection: {
    paddingTop: 8,
  },
  sliderTitle: {
    fontFamily: "Pretendard",
    color: "#374151",
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "500",
    lineHeight: 20.8,
  },
  sliderTrack: {
    position: "relative",
    marginBottom: 8,
    marginTop: 16,
    height: 16,
    width: "100%",
  },
  sliderBackground: {
    position: "absolute",
    inset: 0,
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
    backgroundColor: "#D0DCEE",
    borderRadius: 4,
  },
  sliderFill: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "#7188AB",
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
    paddingBottom: 16,
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

export default function Slider() {
  const [showInfo, setShowInfo] = useState(true);
  const [showex, setShowex] = useState(false);

  const max = steps.length - 1;
  const [level, setLevel] = useState(1);
  const percent = (level / max) * 100;

  const fMax = famSteps.length - 1;
  const [fam, setFam] = useState(1);
  const fPercent = (fam / fMax) * 100;

  const expressions = {
    ask_eat: [
      [
        {
          phrase: "이거 먹어",
          explanation:
            "Pure casual Korean! Family members use this direct, warm tone. No formality needed when you're super close. 🤗",
        },
        {
          phrase: "이거 먹어봐",
          explanation:
            "Adding `봐` softens it slightly while keeping the close relationship. Perfect for friends in public spaces. ☕",
        },
        {
          phrase: "이거 한 번 먹어봐요",
          explanation:
            "Even with closeness, you show respect for the setting. `한 번` adds gentle suggestion rather than command. 🫱",
        },
      ],
      [
        {
          phrase: "이것 좀 먹어볼래?",
          explanation:
            "Question form (`~볼래?`) makes it a suggestion, not an order. `좀` adds politeness while staying friendly. 🍪",
        },
        {
          phrase: "이것 좀 드세요",
          explanation:
            "Standard workplace politeness. `드세요` shows respect, `좀` keeps it approachable. Safe for most office situations! 💼",
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
            "Top-tier service Korean. Formal but natural — what you'd hear at luxury hotels or formal business meetings. ✨",
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
            "Adding `요` shows basic politeness while maintaining warmth. Perfect for close friends when you want to be slightly more polite. 🌼",
        },
        {
          phrase: "식사 하셨어요?",
          explanation:
            "`식사` is more formal than `밥`, and `하셨어요` shows respect. Great when talking to people you're close to but need to respect. 🙇",
        },
      ],
      // Medium Intimacy
      [
        {
          phrase: "밥은 먹었어?",
          explanation:
            "Adding `은` makes it slightly more structured. Common in relaxed workplace conversations during breaks. 🍵",
        },
        {
          phrase: "점심 드셨어요?",
          explanation:
            "`점심` specifies the meal, `드셨어요` shows workplace-appropriate respect. Standard office small talk. 💼",
        },
        {
          phrase: "식사는 하셨습니까?",
          explanation:
            "Business-level formality. `습니까` ending shows professional respect. Used when checking on clients or partners. 🗝️",
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
            "`진지` is the highest honorific for meal. Reserved for VIP treatment or very formal dining situations. 🍷",
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
            "Adding `내가` (I) takes clear responsibility. Shows sincerity while keeping the casual tone with friends. 🤗",
        },
        {
          phrase: "제가 잘못했어요",
          explanation:
            "`제가` is the humble form of `I`, with polite `어요` ending. Shows respect while maintaining some closeness. 🙏",
        },
      ],
      // Medium Intimacy
      [
        {
          phrase: "내 실수야",
          explanation:
            "`실수` (mistake) sounds more professional than `잘못`. Good for minor work errors in relaxed settings. 😅",
        },
        {
          phrase: "제가 실수했습니다",
          explanation:
            "Standard workplace apology. `실수했습니다` is professional but not overly dramatic. Safe for most office situations. 💼",
        },
        {
          phrase: "저의 잘못입니다",
          explanation:
            "`저의 잘못입니다` is structured and takes clear responsibility. Perfect for formal work apologies. 📖",
        },
      ],
      // High Intimacy
      [
        {
          phrase: "제가 잘못했네요",
          explanation:
            "`네요` ending softens the formality while maintaining respect. Common in service industry apologies. 👜",
        },
        {
          phrase: "저의 실수였습니다",
          explanation:
            "Formal but natural business language. `였습니다` shows the mistake is acknowledged and resolved. 🗂️",
        },
        {
          phrase: "저의 부주의였습니다",
          explanation:
            "`부주의` (carelessness) shows deep responsibility. Used for serious situations requiring maximum respect and accountability. 📄",
        },
      ],
    ],
  } as const;

  const situationKeys = useMemo(
    () => Object.keys(expressions) as (keyof typeof expressions)[],
    []
  );

  const getSeoulParts = () => {
    const fmt = (opt: Intl.DateTimeFormatOptions) =>
      new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul", ...opt });
    const y = Number(fmt({ year: "numeric" }).format(new Date()));
    const m = Number(fmt({ month: "2-digit" }).format(new Date()));
    const d = Number(fmt({ day: "2-digit" }).format(new Date()));
    return { y, m, d };
  };

  const getSeoulDateKey = () => {
    const { y, m, d } = getSeoulParts();
    const mm = String(m).padStart(2, "0");
    const dd = String(d).padStart(2, "0");
    return `${y}-${mm}-${dd}`;
  };

  const hash = (str: string) => {
    let h = 5381;
    for (let i = 0; i < str.length; i++) h = (h << 5) + h + str.charCodeAt(i);
    return Math.abs(h);
  };

  const [situationIdx, setSituationIdx] = useState(
    () => hash(getSeoulDateKey()) % situationKeys.length
  );
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const msUntilNextSeoulMidnight = () => {
    const { y, m, d } = getSeoulParts();
    // KST(UTC+9) 자정 → UTC로는 전날 15:00, 따라서 -9시간
    const nextDayUTC = Date.UTC(y, m - 1, d + 1, -9, 0, 0);
    const nowUTC = Date.now();
    return Math.max(0, nextDayUTC - nowUTC);
  };

  useEffect(() => {
    const schedule = () => {
      const ms = msUntilNextSeoulMidnight();
      timerRef.current = setTimeout(() => {
        const newIdx = hash(getSeoulDateKey()) % situationKeys.length;
        setSituationIdx(newIdx);
        schedule();
      }, ms);
    };
    schedule();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentKey = situationKeys[situationIdx];
  const currentSentence = expressions[currentKey][level][fam];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Today`s honorific expression</Text>

      {/* 오늘의 문장 */}
      <View style={styles.sentenceContainer}>
        <View style={styles.sentenceContent}>
          <Text style={styles.phraseText}>{currentSentence.phrase}</Text>
          <TouchableOpacity
            onPress={() => setShowex((prev) => !prev)}
            style={styles.toggleButton}
          >
            {showex ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </TouchableOpacity>
        </View>
      </View>
      {showex && (
        <View style={styles.explanationContainer}>
          <Text style={styles.explanationText}>
            {currentSentence.explanation}
          </Text>
        </View>
      )}
      {showInfo && (
        <View style={styles.tipContainer}>
          <Image
            source={require("../../assets/etc/tip.png")}
            style={styles.tipImage}
            resizeMode="contain"
          />
        </View>
      )}
      {/* 슬라이더 박스 */}
      <View style={styles.sliderContainer}>
        <View style={styles.sliderSection}>
          <Text style={styles.sliderTitle}>Intimacy Level</Text>
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

        <View style={styles.sliderSection}>
          <Text style={styles.sliderTitle}>Formality Level</Text>
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
  );
}
