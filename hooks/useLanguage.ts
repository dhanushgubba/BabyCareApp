import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Language = 'en' | 'hi' | 'ta' | 'te' | 'bn';

interface Translations {
  [key: string]: string;
}

const translations: Record<Language, Translations> = {
  en: {
    // Main screens
    analyzeTitle: 'Understand Your Baby',
    analyzeSubtitle: 'AI-powered cry analysis to help you respond with confidence',
    historyTitle: 'Cry History',
    historySubtitle: 'Track patterns and understand your baby better',
    insightsTitle: 'Smart Insights',
    insightsSubtitle: 'Discover patterns and get personalized recommendations',
    settingsTitle: 'Settings',
    settingsSubtitle: 'Customize your experience',
    
    // Recording
    recordingText: 'Listening to your baby...',
    tapToStart: 'Tap to start recording',
    tapToStop: 'Tap to stop recording',
    
    // Tips
    tipsTitle: 'Recording Tips',
    tip1: 'Hold your phone close to your baby (within 3 feet)',
    tip2: 'Ensure minimal background noise',
    tip3: 'Record for at least 10-15 seconds for best results',
    
    // Emotions
    hungry: 'Hungry',
    tired: 'Tired',
    uncomfortable: 'Uncomfortable',
    needsAttention: 'Needs Attention',
    
    // History
    filterAll: 'All',
    filterToday: 'Today',
    filterWeek: 'This Week',
    filterBy: 'Filter by:',
    recentAnalyses: 'Recent Analyses',
    analyses: 'analyses',
    noHistoryYet: 'No history yet',
    startAnalyzing: 'Start recording to see your baby\'s cry patterns',
    
    // Insights
    primaryNeedTitle: 'Primary Need',
    primaryNeedDesc: 'Most common emotion detected',
    peakTimeTitle: 'Peak Time',
    peakTimeDesc: 'When your baby cries most',
    weeklyTrendTitle: 'Weekly Trend',
    weeklyTrendDesc: 'Change from last week',
    responseTimeTitle: 'Response Time',
    responseTimeDesc: 'Average time to comfort',
    weeklyPatterns: 'Weekly Patterns',
    keyInsights: 'Key Insights',
    
    // Recommendations
    feedingTip: 'Feeding Schedule',
    feedingTipDesc: 'Consider establishing regular feeding times',
    sleepTip: 'Sleep Routine',
    sleepTipDesc: 'Create a calming bedtime routine',
    comfortTip: 'Comfort Techniques',
    comfortTipDesc: 'Try swaddling or gentle rocking',
    appSettings: 'App Settings',
    supportHelp: 'Support & Help',
    language: 'Language',
    notifications: 'Notifications',
    soundFeedback: 'Sound Feedback',
    nightMode: 'Night Mode',
    help: 'Help & Support',
    rateApp: 'Rate App',
    privacy: 'Privacy Policy',
    babyProfile: 'Baby Profile',
    ageMonths: '8 months old',
    appVersion: 'Version 1.0.0',
    madeWithLove: 'Made with ❤️ for parents',
    
    // Journey Planner
    journeyTitle: '1000-Day Journey',
    journeySubtitle: 'Personalized guidance based on MoHFW guidelines',
    overviewTab: 'Overview',
    milestonesTab: 'Milestones',
    nutritionTab: 'Nutrition',
    alertsTab: 'Alerts',
    comingUpThisWeek: 'Coming Up This Week',
    allCaughtUp: 'You\'re all caught up!',
    noUpcomingMilestones: 'No upcoming milestones this week',
    nutritionGuidelines: 'Nutrition Guidelines',
    guidelinesFor: 'Guidelines for',
    mohfwGuidelines: 'These recommendations follow MoHFW guidelines and are customized for your region.',
    allMilestones: 'All Milestones',
    milestonesCompleted: 'completed',
    alertsNotifications: 'Alerts & Notifications',
    allGood: 'All good!',
    noAlertsNow: 'No alerts at this time',
    journeyProgress: '1000-Day Journey Progress',
    daysRemaining: 'days remaining',
    completion: 'Completion',
    milestonesCompletedDesc: 'Milestones completed',
    upcoming: 'Upcoming',
    vaccinationsThisMonth: 'Vaccinations this month',
    overdue: 'Overdue',
    itemsNeedAttention: 'Items need attention',
    phase: 'Phase',
    currentPhase: 'Current development phase',
    pregnancy: 'Pregnancy',
    newborn: 'Newborn',
    infant: 'Infant',
    toddler: 'Toddler',
    atBirth: 'At birth',
    dueAt: 'Due at',
    overduNeedsAttention: 'Overdue - needs attention',
    completedOn: 'Completed on',
    urgent: 'URGENT',
    actionRequired: 'ACTION REQUIRED',
    takeAction: 'Take Action',
    viewDetails: 'View Details',
    recommendations: 'Recommendations',
    indianContext: 'Indian Context',
    stateSpecificGuidelines: 'State-specific guidelines available for:',
    criticalAlertsNeed: 'critical alerts need attention',
    view: 'View',
  },
  hi: {
    // Main screens
    analyzeTitle: 'अपने बच्चे को समझें',
    analyzeSubtitle: 'AI-संचालित रोना विश्लेषण आपको आत्मविश्वास के साथ जवाब देने में मदद करता है',
    historyTitle: 'रोने का इतिहास',
    historySubtitle: 'पैटर्न ट्रैक करें और अपने बच्चे को बेहतर समझें',
    insightsTitle: 'स्मार्ट अंतर्दृष्टि',
    insightsSubtitle: 'पैटर्न खोजें और व्यक्तिगत सुझाव प्राप्त करें',
    settingsTitle: 'सेटिंग्स',
    settingsSubtitle: 'अपने अनुभव को अनुकूलित करें',
    
    // Recording
    recordingText: 'आपके बच्चे को सुन रहा है...',
    tapToStart: 'रिकॉर्डिंग शुरू करने के लिए टैप करें',
    tapToStop: 'रिकॉर्डिंग रोकने के लिए टैप करें',
    
    // Tips
    tipsTitle: 'रिकॉर्डिंग टिप्स',
    tip1: 'अपना फोन बच्चे के पास रखें (3 फीट के भीतर)',
    tip2: 'न्यूनतम पृष्ठभूमि शोर सुनिश्चित करें',
    tip3: 'सर्वोत्तम परिणामों के लिए कम से कम 10-15 सेकंड रिकॉर्ड करें',
    
    // Emotions
    hungry: 'भूखा',
    tired: 'थका हुआ',
    uncomfortable: 'असहज',
    needsAttention: 'ध्यान चाहिए',
    
    // History
    filterAll: 'सभी',
    filterToday: 'आज',
    filterWeek: 'इस सप्ताह',
    filterBy: 'फ़िल्टर करें:',
    recentAnalyses: 'हाल के विश्लेषण',
    analyses: 'विश्लेषण',
    noHistoryYet: 'अभी तक कोई इतिहास नहीं',
    startAnalyzing: 'अपने बच्चे के रोने के पैटर्न देखने के लिए रिकॉर्डिंग शुरू करें',
    
    // Settings
    appSettings: 'ऐप सेटिंग्स',
    supportHelp: 'सहायता और मदद',
    language: 'भाषा',
    notifications: 'सूचनाएं',
    soundFeedback: 'ध्वनि प्रतिक्रिया',
    nightMode: 'नाइट मोड',
    help: 'सहायता और समर्थन',
    rateApp: 'ऐप को रेट करें',
    privacy: 'गोपनीयता नीति',
    babyProfile: 'बच्चे की प्रोफ़ाइल',
    ageMonths: '8 महीने का',
    appVersion: 'संस्करण 1.0.0',
    madeWithLove: 'माता-पिता के लिए ❤️ के साथ बनाया गया',
  },
  ta: {
    analyzeTitle: 'உங்கள் குழந்தையைப் புரிந்து கொள்ளுங்கள்',
    analyzeSubtitle: 'நம்பிக்கையுடன் பதிலளிக்க AI-இயங்கும் அழுகை பகுப்பாய்வு',
    recordingText: 'உங்கள் குழந்தையின் சத்தத்தைக் கேட்கிறது...',
    tapToStart: 'பதிவு செய்ய தொடவும்',
    tapToStop: 'பதிவை நிறுத்த தொடவும்',
    hungry: 'பசியாக',
    tired: 'சோர்வாக',
    uncomfortable: 'அசௌகரியமாக',
    needsAttention: 'கவனம் தேவை',
    language: 'மொழி',
    babyProfile: 'குழந்தையின் விவரம்',
    ageMonths: '8 மாதங்கள் வயது',
  },
  te: {
    analyzeTitle: 'మీ శిశువును అర్థం చేసుకోండి',
    analyzeSubtitle: 'విశ్వాసంతో ప్రతిస్పందించడానికి AI-శక్తితో కూడిన ఏడుపు విశ్లేషణ',
    recordingText: 'మీ శిశువు చేసే శబ్దాన్ని వింటోంది...',
    tapToStart: 'రికార్డింగ్ ప్రారంభించడానికి నొక్కండి',
    tapToStop: 'రికార్డింగ్ ఆపడానికి నొక్కండి',
    hungry: 'ఆకలిగా',
    tired: 'అలసిపోయి',
    uncomfortable: 'అసౌకర్యంగా',
    needsAttention: 'దృష్టి అవసరం',
    language: 'భాష',
    babyProfile: 'శిశువు ప్రొఫైల్',
    ageMonths: '8 నెలల వయస్సు',
  },
  bn: {
    analyzeTitle: 'আপনার শিশুকে বুঝুন',
    analyzeSubtitle: 'আত্মবিশ্বাসের সাথে সাড়া দিতে AI-চালিত কান্নার বিশ্লেষণ',
    recordingText: 'আপনার শিশুর কথা শুনছে...',
    tapToStart: 'রেকর্ডিং শুরু করতে ট্যাপ করুন',
    tapToStop: 'রেকর্ডিং বন্ধ করতে ট্যাপ করুন',
    hungry: 'ক্ষুধার্ত',
    tired: 'ক্লান্ত',
    uncomfortable: 'অস্বস্তিকর',
    needsAttention: 'মনোযোগ প্রয়োজন',
    language: 'ভাষা',
    babyProfile: 'শিশুর প্রোফাইল',
    ageMonths: '৮ মাস বয়সী',
  },
};

const availableLanguages: Record<Language, string> = {
  en: 'English',
  hi: 'हिंदी',
  ta: 'தமிழ்',
  te: 'తెలుగు',
  bn: 'বাংলা',
};

export function useLanguage() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');

  useEffect(() => {
    loadSavedLanguage();
  }, []);

  const loadSavedLanguage = async () => {
    try {
      if (Platform.OS !== 'web') {
        const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
        if (savedLanguage && translations[savedLanguage as Language]) {
          setCurrentLanguage(savedLanguage as Language);
        }
      }
    } catch (error) {
      console.log('Error loading saved language:', error);
    }
  };

  const setLanguage = async (language: Language) => {
    try {
      setCurrentLanguage(language);
      if (Platform.OS !== 'web') {
        await AsyncStorage.setItem('selectedLanguage', language);
      }
    } catch (error) {
      console.log('Error saving language:', error);
    }
  };

  const t = translations[currentLanguage];

  return {
    currentLanguage,
    setLanguage,
    t,
    availableLanguages,
  };
}