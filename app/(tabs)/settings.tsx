import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Globe, Bell, Shield, CircleHelp as HelpCircle, Star, Volume2, Moon, ChevronRight } from 'lucide-react-native';
import { useLanguage } from '@/hooks/useLanguage';
import { SettingsRow } from '@/components/SettingsRow';

export default function SettingsScreen() {
  const { t, currentLanguage, setLanguage, availableLanguages } = useLanguage();
  const [notifications, setNotifications] = useState(true);
  const [soundFeedback, setSoundFeedback] = useState(true);
  const [nightMode, setNightMode] = useState(false);

  const settingsGroups = [
    {
      title: t.appSettings,
      items: [
        {
          icon: Globe,
          title: t.language,
          value: availableLanguages[currentLanguage],
          onPress: () => {
            // Language picker would open here
          },
        },
        {
          icon: Bell,
          title: t.notifications,
          rightElement: (
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#D1D5DB', true: '#6366F1' }}
              thumbColor={notifications ? '#FFFFFF' : '#F3F4F6'}
            />
          ),
        },
        {
          icon: Volume2,
          title: t.soundFeedback,
          rightElement: (
            <Switch
              value={soundFeedback}
              onValueChange={setSoundFeedback}
              trackColor={{ false: '#D1D5DB', true: '#6366F1' }}
              thumbColor={soundFeedback ? '#FFFFFF' : '#F3F4F6'}
            />
          ),
        },
        {
          icon: Moon,
          title: t.nightMode,
          rightElement: (
            <Switch
              value={nightMode}
              onValueChange={setNightMode}
              trackColor={{ false: '#D1D5DB', true: '#6366F1' }}
              thumbColor={nightMode ? '#FFFFFF' : '#F3F4F6'}
            />
          ),
        },
      ],
    },
    {
      title: t.supportHelp,
      items: [
        {
          icon: HelpCircle,
          title: t.help,
          onPress: () => {
            // Help screen would open here
          },
        },
        {
          icon: Star,
          title: t.rateApp,
          onPress: () => {
            // App store rating would open here
          },
        },
        {
          icon: Shield,
          title: t.privacy,
          onPress: () => {
            // Privacy policy would open here
          },
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#F8FAFC', '#EEF2FF']}
        style={styles.background}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>{t.settingsTitle}</Text>
            <Text style={styles.subtitle}>{t.settingsSubtitle}</Text>
          </View>

          <View style={styles.profileCard}>
            <View style={styles.profileAvatar}>
              <Text style={styles.profileInitial}>👶</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{t.babyProfile}</Text>
              <Text style={styles.profileAge}>{t.ageMonths}</Text>
            </View>
            <TouchableOpacity>
              <ChevronRight size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {settingsGroups.map((group, groupIndex) => (
            <View key={groupIndex} style={styles.settingsGroup}>
              <Text style={styles.groupTitle}>{group.title}</Text>
              <View style={styles.groupContainer}>
                {group.items.map((item, itemIndex) => (
                  <SettingsRow
                    key={itemIndex}
                    icon={item.icon}
                    title={item.title}
                    value={item.value}
                    rightElement={item.rightElement}
                    onPress={item.onPress}
                    isLast={itemIndex === group.items.length - 1}
                  />
                ))}
              </View>
            </View>
          ))}

          <View style={styles.footer}>
            <Text style={styles.footerText}>{t.appVersion}</Text>
            <Text style={styles.footerSubtext}>{t.madeWithLove}</Text>
          </View>

          <View style={styles.bottomSpacing} />
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
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 24,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  profileAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInitial: {
    fontSize: 24,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#1E293B',
  },
  profileAge: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginTop: 2,
  },
  settingsGroup: {
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  groupTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#1E293B',
    marginBottom: 12,
  },
  groupContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 32,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
  },
  footerSubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#D1D5DB',
    marginTop: 4,
  },
  bottomSpacing: {
    height: 40,
  },
});