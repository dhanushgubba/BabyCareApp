import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { 
  CheckCircle, 
  Circle, 
  Clock, 
  Syringe, 
  Baby, 
  Utensils, 
  Stethoscope,
  Target,
  AlertTriangle 
} from 'lucide-react-native';

interface MilestoneCardProps {
  milestone: {
    id: string;
    category: 'development' | 'vaccination' | 'nutrition' | 'checkup' | 'growth';
    title: string;
    description: string;
    ageInDays: number;
    isCompleted: boolean;
    isOverdue: boolean;
    priority: 'low' | 'medium' | 'high' | 'critical';
    source: 'mohfw' | 'who' | 'iap';
    completedDate?: Date;
    notes?: string;
  };
  onComplete: (milestoneId: string, notes?: string) => void;
  compact?: boolean;
}

const categoryIcons = {
  development: Baby,
  vaccination: Syringe,
  nutrition: Utensils,
  checkup: Stethoscope,
  growth: Target,
};

const categoryColors = {
  development: '#10B981',
  vaccination: '#6366F1',
  nutrition: '#F59E0B',
  checkup: '#8B5CF6',
  growth: '#06B6D4',
};

const priorityColors = {
  low: '#64748B',
  medium: '#F59E0B',
  high: '#EF4444',
  critical: '#DC2626',
};

const sourceLabels = {
  mohfw: 'MoHFW',
  who: 'WHO',
  iap: 'IAP',
};

export function MilestoneCard({ milestone, onComplete, compact = false }: MilestoneCardProps) {
  const CategoryIcon = categoryIcons[milestone.category];
  const categoryColor = categoryColors[milestone.category];
  const priorityColor = priorityColors[milestone.priority];

  const formatAge = (ageInDays: number) => {
    if (ageInDays === 0) return 'At birth';
    if (ageInDays < 7) return `${ageInDays} day${ageInDays === 1 ? '' : 's'}`;
    if (ageInDays < 30) {
      const weeks = Math.floor(ageInDays / 7);
      const days = ageInDays % 7;
      return days === 0 ? `${weeks} week${weeks === 1 ? '' : 's'}` : `${weeks}w ${days}d`;
    }
    const months = Math.floor(ageInDays / 30);
    const days = ageInDays % 30;
    return days === 0 ? `${months} month${months === 1 ? '' : 's'}` : `${months}m ${days}d`;
  };

  const handleComplete = () => {
    if (!milestone.isCompleted) {
      onComplete(milestone.id);
    }
  };

  const getStatusIcon = () => {
    if (milestone.isCompleted) {
      return <CheckCircle size={20} color="#10B981" />;
    }
    if (milestone.isOverdue) {
      return <AlertTriangle size={20} color="#EF4444" />;
    }
    return <Circle size={20} color="#9CA3AF" />;
  };

  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        milestone.isOverdue && styles.overdueContainer,
        milestone.isCompleted && styles.completedContainer
      ]}
      onPress={handleComplete}
      disabled={milestone.isCompleted}
    >
      <View style={styles.header}>
        <View style={styles.leftSection}>
          <View style={[styles.iconContainer, { backgroundColor: categoryColor + '20' }]}>
            <CategoryIcon size={16} color={categoryColor} />
          </View>
          <View style={styles.titleSection}>
            <Text style={[
              styles.title,
              milestone.isCompleted && styles.completedText
            ]}>
              {milestone.title}
            </Text>
            <Text style={styles.age}>
              Due at {formatAge(milestone.ageInDays)} • {sourceLabels[milestone.source]}
            </Text>
          </View>
        </View>
        
        <View style={styles.rightSection}>
          {getStatusIcon()}
          <View style={[
            styles.priorityIndicator,
            { backgroundColor: priorityColor }
          ]} />
        </View>
      </View>

      {!compact && (
        <View style={styles.body}>
          <Text style={[
            styles.description,
            milestone.isCompleted && styles.completedText
          ]}>
            {milestone.description}
          </Text>
          
          {milestone.isOverdue && (
            <View style={styles.overdueWarning}>
              <Clock size={14} color="#EF4444" />
              <Text style={styles.overdueText}>Overdue - needs attention</Text>
            </View>
          )}

          {milestone.completedDate && (
            <View style={styles.completedInfo}>
              <Text style={styles.completedDate}>
                Completed on {milestone.completedDate.toLocaleDateString()}
              </Text>
              {milestone.notes && (
                <Text style={styles.notes}>Note: {milestone.notes}</Text>
              )}
            </View>
          )}
        </View>
      )}

      <View style={styles.footer}>
        <View style={styles.categoryBadge}>
          <Text style={[styles.categoryText, { color: categoryColor }]}>
            {milestone.category.charAt(0).toUpperCase() + milestone.category.slice(1)}
          </Text>
        </View>
        
        {milestone.priority === 'critical' && (
          <View style={styles.urgentBadge}>
            <Text style={styles.urgentText}>URGENT</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  overdueContainer: {
    borderLeftColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  completedContainer: {
    borderLeftColor: '#10B981',
    opacity: 0.7,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  leftSection: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  titleSection: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#1E293B',
    marginBottom: 2,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#64748B',
  },
  age: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  rightSection: {
    alignItems: 'center',
    gap: 8,
  },
  priorityIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  body: {
    marginTop: 8,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#475569',
    lineHeight: 20,
    marginBottom: 8,
  },
  overdueWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  overdueText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#EF4444',
  },
  completedInfo: {
    marginTop: 8,
  },
  completedDate: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#10B981',
  },
  notes: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#F8FAFC',
  },
  categoryText: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  urgentBadge: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  urgentText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});
