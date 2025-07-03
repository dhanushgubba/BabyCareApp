import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { Video as LucideIcon } from 'lucide-react-native';

interface SettingsRowProps {
  icon: LucideIcon;
  title: string;
  value?: string;
  rightElement?: React.ReactNode;
  onPress?: () => void;
  isLast?: boolean;
}

export function SettingsRow({ 
  icon: IconComponent, 
  title, 
  value, 
  rightElement,
  onPress,
  isLast = false
}: SettingsRowProps) {
  return (
    <TouchableOpacity 
      style={[styles.container, !isLast && styles.borderBottom]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.leftContent}>
        <View style={styles.iconContainer}>
          <IconComponent size={20} color="#6366F1" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          {value && <Text style={styles.value}>{value}</Text>}
        </View>
      </View>
      
      {rightElement || (onPress && <ChevronRight size={20} color="#9CA3AF" />)}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1E293B',
  },
  value: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginTop: 2,
  },
});