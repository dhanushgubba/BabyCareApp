import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Clock, TrendingUp } from 'lucide-react-native';
import { CryAnalysisResult } from '@/hooks/useCryAnalysis';

interface HistoryCardProps {
  item: CryAnalysisResult;
}

export function HistoryCard({ item }: HistoryCardProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const primaryEmotion = Object.entries(item.emotions).reduce((a, b) => 
    item.emotions[a[0] as keyof typeof item.emotions] > item.emotions[b[0] as keyof typeof item.emotions] ? a : b
  );

  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.date}>{formatDate(item.timestamp)}</Text>
          <Text style={styles.time}>{formatTime(item.timestamp)}</Text>
        </View>
        <View style={styles.confidence}>
          <TrendingUp size={14} color="#10B981" />
          <Text style={styles.confidenceText}>
            {Math.round(item.confidence * 100)}%
          </Text>
        </View>
      </View>

      <View style={styles.emotion}>
        <Text style={styles.emotionLabel}>Primary Need:</Text>
        <Text style={styles.emotionValue}>
          {primaryEmotion[0].charAt(0).toUpperCase() + primaryEmotion[0].slice(1)} ({primaryEmotion[1]}%)
        </Text>
      </View>

      <View style={styles.duration}>
        <Clock size={14} color="#64748B" />
        <Text style={styles.durationText}>
          {Math.round(item.duration)}s duration
        </Text>
      </View>
    </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  date: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#1E293B',
  },
  time: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginTop: 2,
  },
  confidence: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  confidenceText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#10B981',
  },
  emotion: {
    marginBottom: 8,
  },
  emotionLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  emotionValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginTop: 2,
  },
  duration: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  durationText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
});