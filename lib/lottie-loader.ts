// 로티 파일을 동적으로 로드하는 함수
export const loadLottieAnimation = async (path: string) => {
  try {
    // .lottie 파일인 경우 직접 반환 (lottie-react가 처리)
    if (path.endsWith(".lottie")) {
      return path;
    }

    // .json 파일인 경우 JSON으로 파싱
    const response = await fetch(path);
    const animationData = await response.json();
    return animationData;
  } catch (error) {
    console.error("로티 파일 로드 실패:", error);
    return null;
  }
};

export const LOTTIE_PATHS = {
  LOADING: require("../assets/lottie/loading.json"),
  EYE_MOVEMENT: require("../assets/lottie/eye-movement2.json"),
  ON_1: require("../assets/lottie/On_1.json"),
  ON_2: require("../assets/lottie/On_2.json"),
  ON_3: require("../assets/lottie/On_3.json"),
  ON_4: require("../assets/lottie/On_4.json"),
  ON_4_1: require("../assets/lottie/On_4-1.json"),
  ON_5: require("../assets/lottie/On_5.json"),
} as const;
