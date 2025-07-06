import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Calendar, 
  Baby, 
  Syringe, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Heart,
  Target,
  TrendingUp,
  Bell,
  MapPin,
  Utensils,
  Shield,
  Settings,
  Edit3
} from 'lucide-react-native';
import { useLanguage } from '@/hooks/useLanguage';
import { useJourneyPlanner } from '../../hooks/useJourneyPlanner';
import { JourneyStats } from '../../components/JourneyStats';
import { MilestoneCard } from '../../components/MilestoneCard';
import { AlertCard } from '../../components/AlertCard';
import { NutritionCard } from '../../components/NutritionCard';
import { BabyProfileSetup } from '../../components/BabyProfileSetup';

const { width } = Dimensions.get('window');

export default function JourneyScreen() {
  const { t } = useLanguage();
  const {
    babyProfile,
    alerts,
    getUpcomingMilestones,
    getCurrentNutritionGuidelines,
    getJourneyStats,
    completeMilestone,
    dismissAlert,
    markAlertAsRead,
    updateBabyProfile,
  } = useJourneyPlanner();

  const [selectedTab, setSelectedTab] = useState<'overview' | 'milestones' | 'nutrition' | 'alerts'>('overview');
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  
  const upcomingMilestones = getUpcomingMilestones(30);
  const currentNutrition = getCurrentNutritionGuidelines();
  const journeyStats = getJourneyStats();
  const criticalAlerts = alerts.filter(alert => !alert.isRead && alert.priority === 'critical');

  const tabs = [
    { key: 'overview', label: 'Overview', icon: Target },
    { key: 'milestones', label: 'Milestones', icon: CheckCircle },
    { key: 'nutrition', label: 'Nutrition', icon: Utensils },
    { key: 'alerts', label: 'Alerts', icon: Bell },
  ];

  const formatBabyAge = () => {
    const today = new Date();
    const ageInDays = Math.floor((today.getTime() - babyProfile.birthDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (ageInDays < 0) {
      const daysToGo = Math.abs(ageInDays);
      return `${daysToGo} days to go`;
    }
    
    const months = Math.floor(ageInDays / 30);
    const days = ageInDays % 30;
    
    if (months === 0) {
      return `${days} days old`;
    } else if (days === 0) {
      return `${months} ${months === 1 ? 'month' : 'months'} old`;
    } else {
      return `${months}m ${days}d old`;
    }
  };

  const renderOverview = () => (
    <View>
      {/* Critical Alerts Banner */}
      {criticalAlerts.length > 0 && (
        <View style={styles.criticalAlertsBanner}>
          <AlertTriangle size={20} color="#EF4444" />
          <Text style={styles.criticalAlertsText}>
            {criticalAlerts.length} critical alert{criticalAlerts.length > 1 ? 's' : ''} need attention
          </Text>
          <TouchableOpacity onPress={() => setSelectedTab('alerts')}>
            <Text style={styles.viewAlertsButton}>View</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Journey Progress */}
      <JourneyStats stats={journeyStats} />

      {/* Upcoming This Week */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Coming Up This Week</Text>
        {upcomingMilestones.slice(0, 3).map((milestone) => (
          <MilestoneCard 
            key={milestone.id} 
            milestone={milestone} 
            onComplete={completeMilestone}
            compact={true}
          />
        ))}
        {upcomingMilestones.length === 0 && (
          <View style={styles.emptyState}>
            <CheckCircle size={32} color="#10B981" />
            <Text style={styles.emptyStateText}>You're all caught up!</Text>
            <Text style={styles.emptyStateSubtext}>No upcoming milestones this week</Text>
          </View>
        )}
      </View>

      {/* Current Nutrition Guidelines */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nutrition Guidelines</Text>
        {currentNutrition.map((guideline) => (
          <NutritionCard key={guideline.id} guideline={guideline} />
        ))}
      </View>

      {/* State-Specific Info */}
      <View style={styles.stateInfoCard}>
        <View style={styles.stateInfoHeader}>
          <MapPin size={16} color="#6366F1" />
          <Text style={styles.stateInfoTitle}>
            Guidelines for {babyProfile.state || 'India'}
          </Text>
        </View>
        <Text style={styles.stateInfoText}>
          These recommendations follow MoHFW guidelines and are customized for your region.
        </Text>
      </View>
    </View>
  );

  const renderMilestones = () => (
    <View>
      <View style={styles.milestonesHeader}>
        <Text style={styles.milestonesTitle}>All Milestones</Text>
        <Text style={styles.milestonesSubtitle}>
          {journeyStats.completedMilestones} of {journeyStats.totalMilestones} completed
        </Text>
      </View>
      
      {upcomingMilestones.map((milestone) => (
        <MilestoneCard 
          key={milestone.id} 
          milestone={milestone} 
          onComplete={completeMilestone}
          compact={false}
        />
      ))}
    </View>
  );

  const renderNutrition = () => (
    <View>
      <Text style={styles.sectionTitle}>Current Nutrition Guidelines</Text>
      {currentNutrition.map((guideline) => (
        <NutritionCard key={guideline.id} guideline={guideline} detailed={true} />
      ))}
    </View>
  );

  const renderAlerts = () => (
    <View>
      <Text style={styles.sectionTitle}>
        Alerts & Notifications ({alerts.length})
      </Text>
      {alerts.length === 0 ? (
        <View style={styles.emptyState}>
          <Shield size={32} color="#10B981" />
          <Text style={styles.emptyStateText}>All good!</Text>
          <Text style={styles.emptyStateSubtext}>No alerts at this time</Text>
        </View>
      ) : (
        alerts.map((alert) => (
          <AlertCard 
            key={alert.id} 
            alert={alert} 
            onDismiss={dismissAlert}
            onMarkAsRead={markAlertAsRead}
          />
        ))
      )}
    </View>
  );

  const renderContent = () => {
    switch (selectedTab) {
      case 'milestones':
        return renderMilestones();
      case 'nutrition':
        return renderNutrition();
      case 'alerts':
        return renderAlerts();
      default:
        return renderOverview();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#F8FAFC', '#EEF2FF']}
        style={styles.background}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.title}>1000-Day Journey</Text>
              <Text style={styles.subtitle}>
                {babyProfile.name} • {formatBabyAge()}
              </Text>
            </View>
            <View style={styles.headerActions}>
              <View style={styles.journeyProgress}>
                <Text style={styles.journeyDays}>
                  Day {journeyStats.daysCompleted}
                </Text>
                <Text style={styles.journeyTotal}>of 1000</Text>
              </View>
              <TouchableOpacity 
                style={styles.editButton}
                onPress={() => setShowProfileSetup(true)}
              >
                <Edit3 size={18} color="#6366F1" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabs}
          >
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.tab,
                  selectedTab === tab.key && styles.tabActive
                ]}
                onPress={() => setSelectedTab(tab.key as any)}
              >
                <tab.icon 
                  size={18} 
                  color={selectedTab === tab.key ? '#6366F1' : '#9CA3AF'} 
                />
                <Text style={[
                  styles.tabText,
                  selectedTab === tab.key && styles.tabTextActive
                ]}>
                  {tab.label}
                </Text>
                {tab.key === 'alerts' && alerts.filter(a => !a.isRead).length > 0 && (
                  <View style={styles.alertBadge}>
                    <Text style={styles.alertBadgeText}>
                      {alerts.filter(a => !a.isRead).length}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Content */}
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {renderContent()}
          <View style={styles.bottomSpacing} />
        </ScrollView>

        <BabyProfileSetup
          visible={showProfileSetup}
          onClose={() => setShowProfileSetup(false)}
          onSave={updateBabyProfile}
          initialProfile={babyProfile}
        />
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
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#1E293B',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginTop: 4,
  },
  journeyProgress: {
    alignItems: 'flex-end',
  },
  journeyDays: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#6366F1',
  },
  journeyTotal: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
  },
  tabsContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  tabs: {
    flexDirection: 'row',
    gap: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  tabActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#6366F1',
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#6366F1',
  },
  alertBadge: {
    backgroundColor: '#EF4444',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 4,
  },
  alertBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  criticalAlertsBanner: {
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  criticalAlertsText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#DC2626',
    marginLeft: 8,
  },
  viewAlertsButton: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#DC2626',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#1E293B',
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#64748B',
    marginTop: 12,
  },
  emptyStateSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginTop: 4,
  },
  stateInfoCard: {
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  stateInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stateInfoTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#1E293B',
    marginLeft: 8,
  },
  stateInfoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    lineHeight: 20,
  },
  milestonesHeader: {
    marginBottom: 24,
  },
  milestonesTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#1E293B',
  },
  milestonesSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginTop: 4,
  },
  bottomSpacing: {
    height: 40,
  },
});
