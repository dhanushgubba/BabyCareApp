import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface AudioRecorderProps {
  isRecording: boolean;
}

const { width } = Dimensions.get('window');

export function AudioRecorder({ isRecording }: AudioRecorderProps) {
  const waveHeight1 = useSharedValue(20);
  const waveHeight2 = useSharedValue(30);
  const waveHeight3 = useSharedValue(25);
  const waveHeight4 = useSharedValue(35);
  const waveHeight5 = useSharedValue(15);

  useEffect(() => {
    if (isRecording) {
      waveHeight1.value = withRepeat(
        withTiming(Math.random() * 40 + 20, { 
          duration: 300,
          easing: Easing.inOut(Easing.ease)
        }),
        -1,
        true
      );
      waveHeight2.value = withRepeat(
        withTiming(Math.random() * 50 + 25, { 
          duration: 400,
          easing: Easing.inOut(Easing.ease)
        }),
        -1,
        true
      );
      waveHeight3.value = withRepeat(
        withTiming(Math.random() * 45 + 30, { 
          duration: 350,
          easing: Easing.inOut(Easing.ease)
        }),
        -1,
        true
      );
      waveHeight4.value = withRepeat(
        withTiming(Math.random() * 55 + 20, { 
          duration: 450,
          easing: Easing.inOut(Easing.ease)
        }),
        -1,
        true
      );
      waveHeight5.value = withRepeat(
        withTiming(Math.random() * 35 + 15, { 
          duration: 320,
          easing: Easing.inOut(Easing.ease)
        }),
        -1,
        true
      );
    } else {
      waveHeight1.value = withTiming(20, { duration: 300 });
      waveHeight2.value = withTiming(30, { duration: 300 });
      waveHeight3.value = withTiming(25, { duration: 300 });
      waveHeight4.value = withTiming(35, { duration: 300 });
      waveHeight5.value = withTiming(15, { duration: 300 });
    }
  }, [isRecording]);

  const wave1Style = useAnimatedStyle(() => ({
    height: waveHeight1.value,
  }));

  const wave2Style = useAnimatedStyle(() => ({
    height: waveHeight2.value,
  }));

  const wave3Style = useAnimatedStyle(() => ({
    height: waveHeight3.value,
  }));

  const wave4Style = useAnimatedStyle(() => ({
    height: waveHeight4.value,
  }));

  const wave5Style = useAnimatedStyle(() => ({
    height: waveHeight5.value,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.waveform}>
        <Animated.View style={[styles.wave, wave1Style]} />
        <Animated.View style={[styles.wave, wave2Style]} />
        <Animated.View style={[styles.wave, wave3Style]} />
        <Animated.View style={[styles.wave, wave4Style]} />
        <Animated.View style={[styles.wave, wave5Style]} />
        <Animated.View style={[styles.wave, wave4Style]} />
        <Animated.View style={[styles.wave, wave3Style]} />
        <Animated.View style={[styles.wave, wave2Style]} />
        <Animated.View style={[styles.wave, wave1Style]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  waveform: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    gap: 4,
  },
  wave: {
    width: 3,
    backgroundColor: '#6366F1',
    borderRadius: 2,
    minHeight: 10,
  },
});