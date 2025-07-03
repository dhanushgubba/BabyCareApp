import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Video as LucideIcon } from 'lucide-react-native';

interface InsightCardProps {
  insight: {
    icon: LucideIcon;
    title: string;
    value: string;
    description: string;
    color: string;
  };
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 72) / 2;

export function InsightCard({ insight }: InsightCardProps) {
  const { icon: IconComponent, title, value, description, color } = insight;

  return (
    <View style={[styles.container, { width: cardWidth }]}>
      <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
        <IconComponent size={20} color={color} />
      </View>
      
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
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
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  value: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
    marginBottom: 6,
  },
  description: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    lineHeight: 16,
  },
});