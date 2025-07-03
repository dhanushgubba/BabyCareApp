import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, Clock, TrendingUp, Baby } from 'lucide-react-native';
import { useLanguage } from '@/hooks/useLanguage';
import { useCryHistory } from '@/hooks/useCryHistory';
import { HistoryCard } from '@/components/HistoryCard';
import { PatternInsights } from '@/components/PatternInsights';

export default function HistoryScreen() {
  const { t } = useLanguage();
  const { history, patterns } = useCryHistory();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'today' | 'week'>('all');

  const filters = [
    { key: 'all', label: t.filterAll },
    { key: 'today', label: t.filterToday },
    { key: 'week', label: t.filterWeek },
  ];

  const getFilteredHistory = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    switch (selectedFilter) {
      case 'today':
        return history.filter(item => new Date(item.timestamp) >= today);
      case 'week':
        return history.filter(item => new Date(item.timestamp) >= weekAgo);
      default:
        return history;
    }
  };

  const filteredHistory = getFilteredHistory();

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#F8FAFC', '#EEF2FF']}
        style={styles.background}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <Text style={styles.title}>{t.historyTitle}</Text>
            <Text style={styles.subtitle}>{t.historySubtitle}</Text>
          </View>

          <PatternInsights patterns={patterns} />

          <View style={styles.filtersContainer}>
            <Text style={styles.filterTitle}>{t.filterBy}</Text>
            <View style={styles.filters}>
              {filters.map((filter) => (
                <TouchableOpacity
                  key={filter.key}
                  style={[
                    styles.filterButton,
                    selectedFilter === filter.key && styles.filterButtonActive
                  ]}
                  onPress={() => setSelectedFilter(filter.key as any)}
                >
                  <Text
                    style={[
                      styles.filterText,
                      selectedFilter === filter.key && styles.filterTextActive
                    ]}
                  >
                    {filter.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.historyContainer}>
            <View style={styles.historyHeader}>
              <Text style={styles.historyTitle}>{t.recentAnalyses}</Text>
              <Text style={styles.historyCount}>
                {filteredHistory.length} {t.analyses}
              </Text>
            </View>

            {filteredHistory.length === 0 ? (
              <View style={styles.emptyState}>
                <Baby size={48} color="#9CA3AF" />
                <Text style={styles.emptyText}>{t.noHistoryYet}</Text>
                <Text style={styles.emptySubtext}>{t.startAnalyzing}</Text>
              </View>
            ) : (
              <FlatList
                data={filteredHistory}
                renderItem={({ item }) => <HistoryCard item={item} />}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
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
  filtersContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  filterTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#1E293B',
    marginBottom: 12,
  },
  filters: {
    flexDirection: 'row',
    gap: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterButtonActive: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  historyContainer: {
    paddingHorizontal: 24,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  historyTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#1E293B',
  },
  historyCount: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#64748B',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginTop: 8,
    textAlign: 'center',
  },
});