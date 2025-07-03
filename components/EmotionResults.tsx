import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { CryAnalysisResult } from '@/hooks/useCryAnalysis';
import { Language } from '@/hooks/useLanguage';
import { EmotionCard } from './EmotionCard';

interface EmotionResultsProps {
  result: CryAnalysisResult;
  language: Language;
}

const { width } = Dimensions.get('window');

export function EmotionResults({ result, language }: EmotionResultsProps) {
  const fadeIn = useSharedValue(0);
  const slideUp = useSharedValue(30);

  React.useEffect(() => {
    fadeIn.value = withDelay(200, withTiming(1, { duration: 600 }));
    slideUp.value = withDelay(200, withTiming(0, { duration: 600 }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeIn.value,
    transform: [{ translateY: slideUp.value }],
  }));

  const emotions = [
    { key: 'hungry', value: result.emotions.hungry, color: '#F59E0B' },
    { key: 'tired', value: result.emotions.tired, color: '#8B5CF6' },
    { key: 'uncomfortable', value: result.emotions.uncomfortable, color: '#EF4444' },
    { key: 'needsAttention', value: result.emotions.needsAttention, color: '#10B981' },
  ];

  const sortedEmotions = emotions.sort((a, b) => b.value - a.value);

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={styles.header}>
        <Text style={styles.title}>Analysis Results</Text>
        <Text style={styles.confidence}>
          {Math.round(result.confidence * 100)}% confidence
        </Text>
      </View>

      <View style={styles.emotionsGrid}>
        {sortedEmotions.map((emotion, index) => (
          <EmotionCard
            key={emotion.key}
            emotion={emotion.key}
            percentage={emotion.value}
            color={emotion.color}
            delay={index * 100}
          />
        ))}
      </View>

      <View style={styles.recommendation}>
        <Text style={styles.recommendationTitle}>Recommendation</Text>
        <Text style={styles.recommendationText}>{result.recommendation}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    color: '#1E293B',
  },
  confidence: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    marginTop: 4,
  },
  emotionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  recommendation: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  recommendationTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#1E293B',
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    lineHeight: 20,
  },
});