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
import { AudioRecorder } from '@/components/AudioRecorder';
import { EmotionResults } from '@/components/EmotionResults';
import { LanguageSelector } from '@/components/LanguageSelector';

const { width, height } = Dimensions.get('window');

export default function AnalyzeScreen() {
  const { t, currentLanguage } = useLanguage();
  const { analyzeAudio, isAnalyzing, lastResult } = useCryAnalysis();
  const [isRecording, setIsRecording] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
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
    setIsRecording(true);
    setShowResults(false);
  };

  const handleStopRecording = async () => {
    setIsRecording(false);
    await analyzeAudio();
    setShowResults(true);
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
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
});