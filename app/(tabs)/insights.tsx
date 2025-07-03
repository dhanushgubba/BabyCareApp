import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, Brain, Clock, TrendingUp, Baby, Moon, Utensils, CircleAlert as AlertCircle } from 'lucide-react-native';
import { useLanguage } from '@/hooks/useLanguage';
import { useCryHistory } from '@/hooks/useCryHistory';
import { InsightCard } from '@/components/InsightCard';
import { WeeklyChart } from '@/components/WeeklyChart';

const { width } = Dimensions.get('window');

export default function InsightsScreen() {
  const { t } = useLanguage();
  const { patterns, getWeeklyData } = useCryHistory();

  const weeklyData = getWeeklyData();

  const insights = [
    {
      id: '1',
      icon: Baby,
      title: t.primaryNeedTitle,
      value: patterns.mostCommonEmotion,
      description: t.primaryNeedDesc,
      color: '#6366F1',
    },
    {
      id: '2',
      icon: Clock,
      title: t.peakTimeTitle,
      value: patterns.peakTime,
      description: t.peakTimeDesc,
      color: '#8B5CF6',
    },
    {
      id: '3',
      icon: TrendingUp,
      title: t.weeklyTrendTitle,
      value: `+${patterns.weeklyIncrease}%`,
      description: t.weeklyTrendDesc,
      color: '#10B981',
    },
    {
      id: '4',
      icon: Heart,
      title: t.responseTimeTitle,
      value: patterns.avgResponseTime,
      description: t.responseTimeDesc,
      color: '#F59E0B',
    },
  ];

  const recommendations = [
    {
      id: '1',
      icon: Utensils,
      title: t.feedingTip,
      description: t.feedingTipDesc,
    },
    {
      id: '2',
      icon: Moon,
      title: t.sleepTip,
      description: t.sleepTipDesc,
    },
    {
      id: '3',
      icon: AlertCircle,
      title: t.comfortTip,
      description: t.comfortTipDesc,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#F8FAFC', '#EEF2FF']}
        style={styles.background}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>{t.insightsTitle}</Text>
            <Text style={styles.subtitle}>{t.insightsSubtitle}</Text>
          </View>

          <View style={styles.chartContainer}>
            <Text style={styles.sectionTitle}>{t.weeklyPatterns}</Text>
            <WeeklyChart data={weeklyData} />
          </View>

          <View style={styles.insightsGrid}>
            <Text style={styles.sectionTitle}>{t.keyInsights}</Text>
            <View style={styles.grid}>
              {insights.map((insight) => (
                <InsightCard key={insight.id} insight={insight} />
              ))}
            </View>
          </View>

          <View style={styles.recommendationsContainer}>
            <Text style={styles.sectionTitle}>{t.recommendations}</Text>
            {recommendations.map((rec) => (
              <View key={rec.id} style={styles.recommendationCard}>
                <View style={styles.recommendationIcon}>
                  <rec.icon size={20} color="#6366F1" />
                </View>
                <View style={styles.recommendationContent}>
                  <Text style={styles.recommendationTitle}>{rec.title}</Text>
                  <Text style={styles.recommendationDescription}>
                    {rec.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#1E293B',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 24,
  },
  chartContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#1E293B',
    marginBottom: 16,
  },
  insightsGrid: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  recommendationsContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  recommendationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  recommendationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#1E293B',
    marginBottom: 4,
  },
  recommendationDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 40,
  },
});