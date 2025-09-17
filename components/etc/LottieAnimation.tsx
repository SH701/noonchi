import LottieView from "lottie-react-native";
import { useRef } from "react";
import { ViewStyle } from "react-native";

interface LottieAnimationProps {
  animationData: any;
  loop?: boolean;
  autoPlay?: boolean;
  style?: ViewStyle;
  onAnimationFinish?: () => void;
  speed?: number;
}

export default function LottieAnimation({
  animationData,
  loop = true,
  autoPlay = true,
  style,
  onAnimationFinish,
  speed = 1,
}: LottieAnimationProps) {
  const lottieRef = useRef<LottieView>(null);

  return (
    <LottieView
      ref={lottieRef}
      source={animationData}
      loop={loop}
      autoPlay={autoPlay}
      style={style}
      onAnimationFinish={onAnimationFinish}
      speed={speed}
    />
  );
}
