import React, { useEffect, useState } from 'react';
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
const NUM_WAVES = 9; // Total number of wave bars

export function AudioRecorder({ isRecording }: AudioRecorderProps) {
  // Create an array of shared values for the wave heights
  const waveHeights = Array(NUM_WAVES)
    .fill(0)
    .map((_, i) => {
      // Stagger the initial heights for a nicer visualization
      const baseHeight = 15 + (i % 3) * 10;
      return useSharedValue(baseHeight);
    });

  // Store and measure audio levels
  const [audioLevel, setAudioLevel] = useState(0);
  const metering = useSharedValue(0);

  useEffect(() => {
    if (isRecording) {
      // Simulate audio levels since expo-av doesn't fully support metering yet
      const simulateAudioMeter = () => {
        const interval = setInterval(() => {
          // Generate random audio levels that look somewhat realistic
          const randomLevel = Math.random() * 0.5 + 0.2; // Values between 0.2 and 0.7
          setAudioLevel(randomLevel);
          metering.value = randomLevel;

          // Adjust wave heights based on simulated level
          waveHeights.forEach((waveHeight, index) => {
            const baseHeight = 15 + (index % 3) * 10;
            const newHeight = baseHeight + randomLevel * 30;
            waveHeight.value = withTiming(newHeight, {
              duration: 100,
              easing: Easing.out(Easing.ease),
            });
          });
        }, 150);

        // Return cleanup function
        return () => {
          clearInterval(interval);
        };
      };

      const cleanupSimulation = simulateAudioMeter();
      return () => {
        if (cleanupSimulation) {
          cleanupSimulation();
        }
      };
    } else {
      // Reset wave heights when not recording
      waveHeights.forEach((waveHeight, index) => {
        const baseHeight = 15 + (index % 3) * 10;
        waveHeight.value = withTiming(baseHeight, { duration: 300 });
      });
    }
  }, [isRecording]);

  // Create animated styles for each wave
  const waveStyles = waveHeights.map((waveHeight) =>
    useAnimatedStyle(() => ({
      height: waveHeight.value,
    }))
  );

  return (
    <View style={styles.container}>
      <View style={styles.waveform}>
        {waveStyles.map((style, index) => (
          <Animated.View key={index} style={[styles.wave, style]} />
        ))}
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