import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { TrendingUp, Calendar, Clock, Target, Award } from 'lucide-react-native';

interface JourneyStatsProps {
  stats: {
    totalMilestones: number;
    completedMilestones: number;
    overdueMilestones: number;
    upcomingVaccinations: number;
    completionPercentage: number;
    currentPhase: 'pregnancy' | 'newborn' | 'infant' | 'toddler';
    daysCompleted: number;
    daysRemaining: number;
  };
}

const { width } = Dimensions.get('window');

export function JourneyStats({ stats }: JourneyStatsProps) {
  const phaseColors = {
    pregnancy: '#8B5CF6',
    newborn: '#EC4899',
    infant: '#06B6D4',
    toddler: '#10B981',
  };

  const phaseLabels = {
    pregnancy: 'Pregnancy',
    newborn: 'Newborn',
    infant: 'Infant',
    toddler: 'Toddler',
  };

  const progressPercentage = (stats.daysCompleted / 1000) * 100;

  const statCards = [
    {
      icon: Target,
      label: 'Completion',
      value: `${Math.round(stats.completionPercentage)}%`,
      color: '#6366F1',
      description: 'Milestones completed',
    },
    {
      icon: Calendar,
      label: 'Upcoming',
      value: stats.upcomingVaccinations.toString(),
      color: '#8B5CF6',
      description: 'Vaccinations this month',
    },
    {
      icon: Clock,
      label: 'Overdue',
      value: stats.overdueMilestones.toString(),
      color: stats.overdueMilestones > 0 ? '#EF4444' : '#10B981',
      description: 'Items need attention',
    },
    {
      icon: Award,
      label: 'Phase',
      value: phaseLabels[stats.currentPhase],
      color: phaseColors[stats.currentPhase],
      description: 'Current development phase',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>1000-Day Journey Progress</Text>
          <Text style={styles.progressPercentage}>
            {Math.round(progressPercentage)}%
          </Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progressPercentage}%` }]} />
        </View>
        <View style={styles.progressLabels}>
          <Text style={styles.progressLabel}>
            Day {stats.daysCompleted}
          </Text>
          <Text style={styles.progressLabel}>
            {stats.daysRemaining} days remaining
          </Text>
        </View>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {statCards.map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
              <stat.icon size={20} color={stat.color} />
            </View>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
            <Text style={styles.statDescription}>{stat.description}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  progressSection: {
    marginBottom: 24,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#1E293B',
  },
  progressPercentage: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#6366F1',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#6366F1',
    borderRadius: 4,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: (width - 88) / 2, // Account for padding and gap
    alignItems: 'center',
    paddingVertical: 16,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#1E293B',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
    marginBottom: 2,
  },
  statDescription: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
  },
});
