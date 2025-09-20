import { slides } from "@/lib/setting";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { useRef, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width: screenWidth } = Dimensions.get("window");

export default function Onboard() {
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();

  const handleNext = () => {
    if (currentSlide === 4) {
      router.push("/(auth)/login");
    } else {
      const nextSlide = currentSlide + 1;
      scrollViewRef.current?.scrollTo({
        x: nextSlide * screenWidth,
        animated: true,
      });
      setCurrentSlide(nextSlide);
    }
  };

  const handleSkip = () => {
    const lastSlide = slides.length - 1;
    scrollViewRef.current?.scrollTo({
      x: lastSlide * screenWidth,
      animated: true,
    });
    setCurrentSlide(lastSlide);
  };

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const slideIndex = Math.round(contentOffset / screenWidth);
    setCurrentSlide(slideIndex);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.sliderContainer}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            style={styles.scrollView}
          >
            {slides.map((slide, i) => (
              <View key={slide.id} style={styles.slide}>
                <View
                  style={[
                    styles.slideContent,
                    slide.id !== 1 && slide.id !== 5
                      ? styles.slideContentWithBg
                      : {},
                  ]}
                >
                  {i !== slides.length - 1 && (
                    <TouchableOpacity
                      onPress={handleSkip}
                      style={styles.skipButton}
                    >
                      <Text style={styles.skipButtonText}>Skip</Text>
                    </TouchableOpacity>
                  )}
                  {slide.icon && (
                    <LottieView
                      source={slide.icon}
                      autoPlay
                      loop
                      style={{
                        width: "100%",
                        height: undefined,
                        aspectRatio: 1,
                        alignSelf: "center",
                      }}
                    />
                  )}
                </View>

                <View style={styles.titleContainer}>
                  <Text
                    style={[
                      styles.title,
                      slide.id === 3 ? styles.titleTight : {},
                    ]}
                  >
                    {slide.title}
                  </Text>
                </View>
                <View
                  style={[
                    styles.descriptionContainer,
                    slide.id === 4 ? styles.descriptionContainerWide : {},
                  ]}
                >
                  <Text style={styles.description}>{slide.desc}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* 버튼/로그인 영역 */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
            <Text style={styles.nextButtonText}>
              {currentSlide === slides.length - 1 ? "Continue" : "Next"}
            </Text>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
              <Text style={styles.loginLink}>Log in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    width: "100%",
    height: "100%",
    flexDirection: "column",
    marginHorizontal: "auto",
    position: "relative",
  },
  sliderContainer: {
    flexGrow: 1,
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width: screenWidth,
    flexDirection: "column",
    height: "100%",
  },
  slideContent: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  slideContentWithBg: {
    backgroundColor: "#DBEAFE",
    paddingTop: 40,
  },
  skipButton: {
    position: "absolute",
    top: 60,
    right: 32,
    zIndex: 50,
  },
  skipButtonText: {
    fontSize: 14,
    textDecorationLine: "underline",
    color: "#6b7280",
  },
  titleContainer: {
    width: 274,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  title: {
    marginTop: 80,
    textAlign: "center",
    fontFamily: "Pretendard",
    fontSize: 25,
    fontWeight: "600",
    color: "#111827",
  },
  titleTight: {
    letterSpacing: -0.5,
  },
  descriptionContainer: {
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    alignSelf: "center",
    maxWidth: 300,
  },
  descriptionContainerWide: {
    maxWidth: 350,
  },
  description: {
    color: "#9CA3AF",
    marginTop: 16,
    fontSize: 14,
    lineHeight: 18,
    textAlign: "center",
  },
  buttonContainer: {
    paddingBottom: 40,
  },
  nextButton: {
    width: "100%",
    maxHeight: 52,
    paddingVertical: 12,
    marginHorizontal: "auto",
    backgroundColor: "#2563eb",
  },
  nextButtonText: {
    color: "white",
    fontWeight: "500",
    textAlign: "center",
    fontSize: 18,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  loginText: {
    textAlign: "center",
    fontSize: 14,
    color: "#6b7280",
  },
  loginLink: {
    fontWeight: "500",
    color: "#3b82f6",
    textDecorationLine: "underline",
  },
});
