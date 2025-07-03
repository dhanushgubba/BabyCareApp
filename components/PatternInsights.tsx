import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { TrendingUp, Clock, Target } from 'lucide-react-native';

interface PatternInsightsProps {
  patterns: {
    mostCommonEmotion: string;
    peakTime: string;
    weeklyIncrease: number;
    avgResponseTime: string;
  };
}

const { width } = Dimensions.get('window');

export function PatternInsights({ patterns }: PatternInsightsProps) {
  const insights = [
    {
      icon: Target,
      label: 'Most Common',
      value: patterns.mostCommonEmotion,
      color: '#6366F1',
    },
    {
      icon: Clock,
      label: 'Peak Time',
      value: patterns.peakTime,
      color: '#8B5CF6',
    },
    {
      icon: TrendingUp,
      label: 'Weekly Change',
      value: `+${patterns.weeklyIncrease}%`,
      color: '#10B981',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weekly Patterns</Text>
      <View style={styles.insightsRow}>
        {insights.map((insight, index) => (
          <View key={index} style={styles.insightCard}>
            <View style={[styles.iconContainer, { backgroundColor: insight.color + '20' }]}>
              <insight.icon size={16} color={insight.color} />
            </View>
            <Text style={styles.insightValue}>{insight.value}</Text>
            <Text style={styles.insightLabel}>{insight.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#1E293B',
    marginBottom: 16,
  },
  insightsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  insightCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  insightValue: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#1E293B',
    textAlign: 'center',
  },
  insightLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
  },
});