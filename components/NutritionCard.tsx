import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { 
  Utensils, 
  Heart, 
  Milk, 
  Apple, 
  Info,
  MapPin,
  ChevronRight
} from 'lucide-react-native';

interface NutritionCardProps {
  guideline: {
    id: string;
    ageRangeStart: number;
    ageRangeEnd: number;
    category: 'breastfeeding' | 'complementary' | 'supplements' | 'avoid';
    title: string;
    description: string;
    recommendations: string[];
    indianContext?: string;
    stateSpecific?: string[];
  };
  detailed?: boolean;
}

const categoryIcons = {
  breastfeeding: Milk,
  complementary: Utensils,
  supplements: Heart,
  avoid: Info,
};

const categoryColors = {
  breastfeeding: '#EC4899',
  complementary: '#F59E0B',
  supplements: '#10B981',
  avoid: '#EF4444',
};

export function NutritionCard({ guideline, detailed = false }: NutritionCardProps) {
  const CategoryIcon = categoryIcons[guideline.category];
  const categoryColor = categoryColors[guideline.category];

  const formatAgeRange = (startDays: number, endDays: number) => {
    const formatAge = (days: number) => {
      if (days === 0) return 'Birth';
      if (days < 30) return `${days} days`;
      if (days < 365) {
        const months = Math.floor(days / 30);
        return `${months} month${months === 1 ? '' : 's'}`;
      }
      const years = Math.floor(days / 365);
      const remainingDays = days % 365;
      const months = Math.floor(remainingDays / 30);
      return months > 0 ? `${years}y ${months}m` : `${years} year${years === 1 ? '' : 's'}`;
    };

    return `${formatAge(startDays)} - ${formatAge(endDays)}`;
  };

  return (
    <View style={[styles.container, { borderLeftColor: categoryColor }]}>
      <View style={styles.header}>
        <View style={styles.leftSection}>
          <View style={[styles.iconContainer, { backgroundColor: categoryColor + '20' }]}>
            <CategoryIcon size={18} color={categoryColor} />
          </View>
          <View style={styles.titleSection}>
            <Text style={styles.title}>{guideline.title}</Text>
            <Text style={styles.ageRange}>
              Age: {formatAgeRange(guideline.ageRangeStart, guideline.ageRangeEnd)}
            </Text>
          </View>
        </View>
        
        <View style={styles.categoryBadge}>
          <Text style={[styles.categoryText, { color: categoryColor }]}>
            {guideline.category}
          </Text>
        </View>
      </View>

      <Text style={styles.description}>{guideline.description}</Text>

      {detailed && (
        <View style={styles.detailedSection}>
          <View style={styles.recommendationsSection}>
            <Text style={styles.sectionTitle}>Recommendations:</Text>
            {guideline.recommendations.map((recommendation, index) => (
              <View key={index} style={styles.recommendationItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.recommendationText}>{recommendation}</Text>
              </View>
            ))}
          </View>

          {guideline.indianContext && (
            <View style={styles.indianContextSection}>
              <View style={styles.contextHeader}>
                <MapPin size={14} color="#F59E0B" />
                <Text style={styles.contextTitle}>Indian Context</Text>
              </View>
              <Text style={styles.contextText}>{guideline.indianContext}</Text>
            </View>
          )}

          {guideline.stateSpecific && guideline.stateSpecific.length > 0 && (
            <View style={styles.stateSpecificSection}>
              <Text style={styles.stateSpecificTitle}>
                State-specific guidelines available for:
              </Text>
              <Text style={styles.stateSpecificText}>
                {guideline.stateSpecific.join(', ')}
              </Text>
            </View>
          )}
        </View>
      )}

      {!detailed && (
        <TouchableOpacity style={styles.expandButton}>
          <Text style={styles.expandText}>View Details</Text>
          <ChevronRight size={16} color="#6366F1" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
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
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  leftSection: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
  ageRange: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#F8FAFC',
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#475569',
    lineHeight: 20,
    marginBottom: 12,
  },
  detailedSection: {
    marginTop: 8,
  },
  recommendationsSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#1E293B',
    marginBottom: 8,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  bullet: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#6366F1',
    marginRight: 8,
    lineHeight: 20,
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#475569',
    lineHeight: 20,
  },
  indianContextSection: {
    backgroundColor: '#FFFBEB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  contextHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  contextTitle: {
    fontSize: 13,
    fontFamily: 'Poppins-SemiBold',
    color: '#92400E',
    marginLeft: 6,
  },
  contextText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#92400E',
    lineHeight: 18,
  },
  stateSpecificSection: {
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    padding: 12,
  },
  stateSpecificTitle: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#0369A1',
    marginBottom: 4,
  },
  stateSpecificText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#0369A1',
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    marginTop: 8,
  },
  expandText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6366F1',
    marginRight: 4,
  },
});
