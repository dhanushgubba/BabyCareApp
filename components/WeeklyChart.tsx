import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';

interface WeeklyChartProps {
  data: Array<{
    day: string;
    count: number;
  }>;
}

const { width } = Dimensions.get('window');
const chartWidth = width - 48;
const barWidth = (chartWidth - 60) / 7; // 60px for labels and spacing

export function WeeklyChart({ data }: WeeklyChartProps) {
  const maxCount = Math.max(...data.map(d => d.count));

  return (
    <View style={styles.container}>
      <View style={styles.chart}>
        {data.map((item, index) => {
          const barHeight = (item.count / maxCount) * 120;
          
          return (
            <View key={index} style={styles.barContainer}>
              <View style={styles.barSpace}>
                <View 
                  style={[
                    styles.bar, 
                    { 
                      height: barHeight,
                      width: barWidth - 8,
                    }
                  ]} 
                />
                <Text style={styles.count}>{item.count}</Text>
              </View>
              <Text style={styles.dayLabel}>{item.day}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 160,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  barSpace: {
    height: 140,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    backgroundColor: '#6366F1',
    borderRadius: 4,
    marginBottom: 4,
    minHeight: 8,
  },
  count: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  dayLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginTop: 8,
  },
});