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
import { Baby, Moon, TriangleAlert as AlertTriangle, Heart } from 'lucide-react-native';

interface EmotionCardProps {
  emotion: string;
  percentage: number;
  color: string;
  delay?: number;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 72) / 2; // 24px margin * 2 + 12px gap * 2

const emotionIcons = {
  hungry: Baby,
  tired: Moon,
  uncomfortable: AlertTriangle,
  needsAttention: Heart,
};

const emotionLabels = {
  hungry: 'Hungry',
  tired: 'Tired',
  uncomfortable: 'Uncomfortable',
  needsAttention: 'Needs Attention',
};

export function EmotionCard({ emotion, percentage, color, delay = 0 }: EmotionCardProps) {
  const fadeIn = useSharedValue(0);
  const scale = useSharedValue(0.8);
  const progressWidth = useSharedValue(0);

  React.useEffect(() => {
    fadeIn.value = withDelay(delay, withTiming(1, { duration: 400 }));
    scale.value = withDelay(delay, withTiming(1, { duration: 400 }));
    progressWidth.value = withDelay(delay + 200, withTiming(percentage, { duration: 800 }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeIn.value,
    transform: [{ scale: scale.value }],
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  const IconComponent = emotionIcons[emotion as keyof typeof emotionIcons];
  const label = emotionLabels[emotion as keyof typeof emotionLabels];

  return (
    <Animated.View style={[styles.container, { width: cardWidth }, animatedStyle]}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
          <IconComponent size={20} color={color} />
        </View>
        <Text style={styles.percentage}>{percentage}%</Text>
      </View>
      
      <Text style={styles.label}>{label}</Text>
      
      <View style={styles.progressContainer}>
        <Animated.View 
          style={[
            styles.progressBar, 
            { backgroundColor: color },
            progressStyle
          ]} 
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentage: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#1E293B',
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    marginBottom: 12,
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#F1F5F9',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
});