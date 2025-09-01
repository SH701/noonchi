import LottieAnimation from "@/components/etc/LottieAnimation";
import { loadLottieAnimation, LOTTIE_PATHS } from "@/lib/lottie-loader";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

export default function First() {
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    const loadAnimation = async () => {
      try {
        const animation = await loadLottieAnimation(LOTTIE_PATHS.ON_1);
        if (animation) {
          setAnimationData(animation);
        }
      } catch (err) {
        console.error("로티 로드 중 오류:", err);
      }
    };
    loadAnimation();
  }, []);

  if (!animationData) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.spinner} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.animationContainer}>
        <LottieAnimation
          animationData={animationData}
          style={styles.animation}
          loop={true}
          autoPlay={true}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  animationContainer: {
    width: 375,
    height: 426,
    alignItems: "center",
    justifyContent: "center",
  },
  animation: {
    width: 375,
    height: 426,
  },
  loadingContainer: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  spinner: {
    width: 32,
    height: 32,
    borderWidth: 4,
    borderColor: "#2563eb",
    borderTopColor: "transparent",
    borderRadius: 16,
  },
});
