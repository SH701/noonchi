import React, { useEffect, useRef } from "react";
import { Animated, Easing, Image, StyleSheet, Text, View } from "react-native";

export default function Loading() {
  const circles = [0, 200, 400]; // ms 단위 delay

  return (
    <View style={styles.container}>
      {/* 텍스트 */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>Creating a chat window</Text>
        <Text style={styles.subtitle}>It won`t take long!</Text>
        <Text style={styles.subtitle}>Please wait a moment.</Text>
      </View>

      {/* 애니메이션 원 + 그림자 */}
      <View style={styles.circleRow}>
        {circles.map((delay, idx) => (
          <Circle key={idx} delay={delay} />
        ))}
      </View>
    </View>
  );
}

function Circle({ delay }: { delay: number }) {
  const translateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  const shadowScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        // 0% → 50%
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: -50,
            duration: 400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 0.95,
            duration: 400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(shadowScale, {
            toValue: 0.5,
            duration: 400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        // 50% → 100%
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: 0,
            duration: 400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(shadowScale, {
            toValue: 1,
            duration: 400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    const timeout = setTimeout(() => {
      animation.start();
    }, delay);

    return () => {
      clearTimeout(timeout);
      animation.stop();
    };
  }, [delay]);

  return (
    <View style={styles.circleWrapper}>
      <Animated.View
        style={{
          transform: [{ translateY }, { scale }],
        }}
      >
        <Image
          source={require("../../assets/circle/circle4.png")}
          style={styles.circle}
        />
      </Animated.View>
      <Animated.View
        style={[
          styles.shadow,
          {
            transform: [{ scaleX: shadowScale }],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -150 }, { translateY: -150 }], // 300px width 기준
    width: 300,
  },
  textContainer: {
    marginBottom: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 20,
    color: "#9ca3af",
  },
  circleRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 32,
    height: 100,
    position: "relative",
  },
  circleWrapper: {
    marginTop: 50,
    width: 50,
    alignItems: "center",
    position: "relative",
  },
  circle: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  shadow: {
    position: "absolute",
    top: 45,
    width: 32,
    height: 4,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 4,
  },
});
