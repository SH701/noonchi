/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import LottieAnimation from '@/components/etc/LottieAnimation';
import { loadLottieAnimation, LOTTIE_PATHS } from '@/lib/lottie-loader';

export default function Fourth() {
  const [frameAnimation, setFrameAnimation] = useState<any>(null);
  const [innerAnimation, setInnerAnimation] = useState<any>(null);

  useEffect(() => {
    const loadAnimations = async () => {
      try {
        // 프레임 애니메이션 로드
        const frame = await loadLottieAnimation(LOTTIE_PATHS.ON_4);
        if (frame) {
          setFrameAnimation(frame);
        }

        // 내부 애니메이션 로드
        const inner = await loadLottieAnimation(LOTTIE_PATHS.ON_4_1);
        if (inner) {
          setInnerAnimation(inner);
        }
      } catch (err) {
        console.error('로티 로드 중 오류:', err);
      }
    };
    loadAnimations();
  }, []);

  if (!frameAnimation || !innerAnimation) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.spinner} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.animationContainer}>
        {/* 프레임 애니메이션 (배경) */}
        <View style={styles.frameAnimation}>
          <LottieAnimation
            animationData={frameAnimation}
            style={styles.frameAnimationStyle}
            loop={true}
            autoPlay={true}
          />
        </View>
        
        {/* 내부 애니메이션 (흰 박스 중앙에 배치) */}
        <View style={styles.innerAnimation}>
          <LottieAnimation
            animationData={innerAnimation}
            style={styles.innerAnimationStyle}
            loop={true}
            autoPlay={true}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  animationContainer: {
    width: 375,
    height: 426,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  frameAnimation: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  frameAnimationStyle: {
    width: '100%',
    height: '100%',
  },
  innerAnimation: {
    position: 'absolute',
    left: '50%',
    top: '65%',
    width: 200,
    height: 200,
    transform: [{ translateX: -100 }],
  },
  innerAnimationStyle: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    width: 32,
    height: 32,
    borderWidth: 4,
    borderColor: '#2563eb',
    borderTopColor: 'transparent',
    borderRadius: 16,
  },
}); 