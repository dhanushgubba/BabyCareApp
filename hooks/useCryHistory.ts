import { useState, useEffect } from 'react';
import { CryAnalysisResult } from './useCryAnalysis';

interface CryPatterns {
  mostCommonEmotion: string;
  peakTime: string;
  weeklyIncrease: number;
  avgResponseTime: string;
}

interface WeeklyData {
  day: string;
  count: number;
}

export function useCryHistory() {
  const [history, setHistory] = useState<CryAnalysisResult[]>([]);

  useEffect(() => {
    // Mock historical data
    const mockHistory: CryAnalysisResult[] = [
      {
        id: '1',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        emotions: { hungry: 80, tired: 10, uncomfortable: 5, needsAttention: 5 },
        confidence: 0.89,
        duration: 15,
        recommendation: 'Feeding time - your baby seems very hungry.',
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        emotions: { tired: 75, hungry: 15, uncomfortable: 5, needsAttention: 5 },
        confidence: 0.84,
        duration: 22,
        recommendation: 'Time for a nap - create a calm sleeping environment.',
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        emotions: { uncomfortable: 70, needsAttention: 20, hungry: 5, tired: 5 },
        confidence: 0.81,
        duration: 18,
        recommendation: 'Check diaper or clothing - your baby seems uncomfortable.',
      },
      {
        id: '4',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        emotions: { needsAttention: 65, hungry: 20, tired: 10, uncomfortable: 5 },
        confidence: 0.87,
        duration: 12,
        recommendation: 'Your baby wants interaction and comfort.',
      },
      {
        id: '5',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        emotions: { hungry: 85, tired: 8, uncomfortable: 4, needsAttention: 3 },
        confidence: 0.92,
        duration: 25,
        recommendation: 'Strong hunger signals - feeding needed.',
      },
    ];

    setHistory(mockHistory);
  }, []);

  const patterns: CryPatterns = {
    mostCommonEmotion: 'Hungry',
    peakTime: '7:00 PM',
    weeklyIncrease: 12,
    avgResponseTime: '2.5 min',
  };

  const getWeeklyData = (): WeeklyData[] => {
    return [
      { day: 'Mon', count: 3 },
      { day: 'Tue', count: 5 },
      { day: 'Wed', count: 2 },
      { day: 'Thu', count: 7 },
      { day: 'Fri', count: 4 },
      { day: 'Sat', count: 6 },
      { day: 'Sun', count: 3 },
    ];
  };

  return {
    history,
    patterns,
    getWeeklyData,
  };
}