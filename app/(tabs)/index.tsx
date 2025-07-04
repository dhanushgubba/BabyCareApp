import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Mic, MicOff, Loader } from 'lucide-react-native';
import { useLanguage } from '@/hooks/useLanguage';
import { useCryAnalysis } from '@/hooks/useCryAnalysis';
import { useWebCompatibility } from '@/hooks/useWebCompatibility';
import { AudioRecorder } from '@/components/AudioRecorder';
import { EmotionResults } from '@/components/EmotionResults';
import { LanguageSelector } from '@/components/LanguageSelector';

const { width, height } = Dimensions.get('window');

export default function AnalyzeScreen() {
  const { t, currentLanguage } = useLanguage();
  // Check if we're running on web platform
  const isWebPlatform = Platform.OS === 'web';
  
  // Use the web-compatible version of the hook that provides fallbacks
  const { 
    analyzeAudio, 
    isAnalyzing, 
    lastResult, 
    modelLoaded,
    startRecording,
    stopRecordingAndAnalyze
  } = isWebPlatform ? useWebCompatibility() : useCryAnalysis();
  const [isRecording, setIsRecording] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  
  const pulseScale = useSharedValue(1);
  const recordingOpacity = useSharedValue(0);

  useEffect(() => {
    if (isRecording) {
      pulseScale.value = withRepeat(
        withTiming(1.2, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
      recordingOpacity.value = withTiming(1, { duration: 300 });
    } else {
      pulseScale.value = withTiming(1, { duration: 300 });
      recordingOpacity.value = withTiming(0, { duration: 300 });
    }
  }, [isRecording]);

  const handleStartRecording = async () => {
    const success = await startRecording();
    if (success) {
      setIsRecording(true);
      setShowResults(false);
    } else {
      // Show error or request permissions again
      console.error('Failed to start recording');
    }
  };

  const handleStopRecording = async () => {
    setIsRecording(false);
    const result = await stopRecordingAndAnalyze();
    if (result) {
      setShowResults(true);
    }
  };

  const pulseAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const recordingAnimatedStyle = useAnimatedStyle(() => ({
    opacity: recordingOpacity.value,
  }));

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#F8FAFC', '#EEF2FF']}
        style={styles.background}
      >
        {isWebPlatform && (
          <View style={styles.webBanner}>
            <Text style={styles.webBannerText}>
              Web Demo Mode - Limited Functionality
            </Text>
            <Text style={styles.webBannerSubtext}>
              For full functionality, please use the mobile app
            </Text>
          </View>
        )}
        <View style={styles.header}>
          <Text style={styles.title}>{t.analyzeTitle}</Text>
          <Text style={styles.subtitle}>{t.analyzeSubtitle}</Text>
          <LanguageSelector />
        </View>

        <View style={styles.recordingArea}>
          {isRecording && (
            <Animated.View style={[styles.recordingIndicator, recordingAnimatedStyle]}>
              <Text style={styles.recordingText}>{t.recordingText}</Text>
              <AudioRecorder isRecording={isRecording} />
            </Animated.View>
          )}

          <Animated.View style={[styles.micButton, pulseAnimatedStyle]}>
            <TouchableOpacity
              style={[
                styles.micButtonInner,
                { backgroundColor: isRecording ? '#EF4444' : '#6366F1' }
              ]}
              onPress={isRecording ? handleStopRecording : handleStartRecording}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <Loader size={40} color="white" />
              ) : isRecording ? (
                <MicOff size={40} color="white" />
              ) : (
                <Mic size={40} color="white" />
              )}
            </TouchableOpacity>
          </Animated.View>

          <Text style={styles.instructions}>
            {isRecording ? t.tapToStop : t.tapToStart}
          </Text>
        </View>

        {showResults && lastResult && (
          <EmotionResults result={lastResult} language={currentLanguage} />
        )}

        {!showResults && !isRecording && (
          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>{t.tipsTitle}</Text>
            <View style={styles.tip}>
              <Text style={styles.tipText}>• {t.tip1}</Text>
            </View>
            <View style={styles.tip}>
              <Text style={styles.tipText}>• {t.tip2}</Text>
            </View>
            <View style={styles.tip}>
              <Text style={styles.tipText}>• {t.tip3}</Text>
            </View>
          </View>
        )}
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
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
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
  recordingArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  recordingIndicator: {
    position: 'absolute',
    top: -80,
    alignItems: 'center',
  },
  recordingText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#EF4444',
    marginBottom: 20,
  },
  micButton: {
    marginBottom: 24,
  },
  micButtonInner: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    // Replace deprecated shadow* props with boxShadow
    boxShadow: '0px 8px 12px rgba(0, 0, 0, 0.15)',
    elevation: 8, // Keep elevation for Android
  },
  instructions: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#475569',
    textAlign: 'center',
  },
  tipsContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  tipsTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#1E293B',
    marginBottom: 16,
  },
  tip: {
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    lineHeight: 20,
  },
  webBanner: {
    backgroundColor: '#FFFBEB',
    padding: 8,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#FEF3C7',
  },
  webBannerText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#D97706',
  },
  webBannerSubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#92400E',
    marginTop: 2,
  },
});