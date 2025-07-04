import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import { useLanguage } from './useLanguage';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import { Platform } from 'react-native';

// API URL - replace with your actual server address when deploying
// For web browser testing, use localhost
const API_URL = 'http://localhost:5000'; 

// For iOS simulator, use 'http://127.0.0.1:5000'
// For a physical iOS device, use your computer's IP address (e.g., 'http://192.168.31.79:5000')
// For Android emulator, use 'http://10.0.2.2:5000'

export interface CryAnalysisResult {
  id: string;
  timestamp: Date;
  emotions: {
    hungry: number;
    tired: number;
    uncomfortable: number;
    needsAttention: number;
  };
  confidence: number;
  duration: number;
  recommendation: string;
  cry_type?: string; // Added to support the ML model response
}

export function useCryAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastResult, setLastResult] = useState<CryAnalysisResult | null>(null);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const { currentLanguage } = useLanguage();

  // Function to start recording
  const startRecording = async () => {
    try {
      // Request permissions
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        console.error('Audio recording permission not granted');
        return false;
      }

      // Set audio mode (different for web vs native)
      if (Platform.OS !== 'web') {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
      }

      // Create and start recording
      const newRecording = new Audio.Recording();
      // Configure different recording formats based on platform
      const recordingOptions = {
        android: {
          extension: '.wav',
          outputFormat: Audio.AndroidOutputFormat.DEFAULT,
          audioEncoder: Audio.AndroidAudioEncoder.DEFAULT,
          sampleRate: 22050, // Match the ML model's sample rate
          numberOfChannels: 1, // Mono for better processing
          bitRate: 128000,
        },
        ios: {
          extension: '.wav',
          audioQuality: Audio.IOSAudioQuality.HIGH,
          sampleRate: 22050,
          numberOfChannels: 1,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        web: {
          mimeType: 'audio/webm', // Use webm for web browsers which is widely supported
          bitsPerSecond: 128000,
          echoCancellation: true,
          noiseSuppression: true,
        },
      };
      
      try {
        await newRecording.prepareToRecordAsync(recordingOptions);
        await newRecording.startAsync();
        setRecording(newRecording);
        setStartTime(new Date());
        return true;
      } catch (recordError) {
        console.error('Error starting recording:', recordError);
        
        // If specific format fails on web, try with default options
        if (Platform.OS === 'web') {
          console.log('Trying with default web recording options');
          try {
            await newRecording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
            await newRecording.startAsync();
            setRecording(newRecording);
            setStartTime(new Date());
            return true;
          } catch (fallbackError) {
            console.error('Failed with fallback recording options:', fallbackError);
            return false;
          }
        }
        return false;
      }
    } catch (error) {
      console.error('Failed to start recording:', error);
      return false;
    }
  };

  // Function to stop recording and analyze
  const stopRecordingAndAnalyze = async () => {
    if (!recording) {
      console.error('No active recording found');
      return null;
    }

    try {
      // Calculate duration
      const endTime = new Date();
      const duration = startTime ? (endTime.getTime() - startTime.getTime()) / 1000 : 0;
      setRecordingDuration(duration);
      
      // Stop recording
      await recording.stopAndUnloadAsync();
      
      // Get recording URI
      const uri = recording.getURI();
      console.log('Recording URI:', uri);
      setRecordingUri(uri);
      setRecording(null);
      
      if (uri) {
        // Start analysis
        return await analyzeAudio(uri, duration);
      } else {
        console.error('Recording URI is null');
        
        // On web, we might need a fallback approach if URI is null
        if (Platform.OS === 'web') {
          console.log('Web platform detected, trying fallback audio analysis');
          // For web, we can use a mock result when real analysis fails
          return await mockAnalyzeAudio(duration);
        }
        
        return null;
      }
    } catch (error) {
      console.error('Error stopping recording:', error);
      setRecording(null);
      
      // Fallback to mock analysis if we're on web
      if (Platform.OS === 'web') {
        console.log('Error in web recording, using mock analysis');
        const estimatedDuration = startTime 
          ? (new Date().getTime() - startTime.getTime()) / 1000 
          : 5; // Default to 5 seconds if no start time
        return await mockAnalyzeAudio(estimatedDuration);
      }
      
      return null;
    }
  };
  
  // Mock analysis function for fallbacks
  const mockAnalyzeAudio = async (duration: number): Promise<CryAnalysisResult> => {
    console.log('Using web demo mode with duration:', duration);
    setIsAnalyzing(true);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // For web demo, make it clear this is a demonstration result
    const emotions = { 
      uncomfortable: 70,
      hungry: 15, 
      needsAttention: 10, 
      tired: 5 
    };
    
    // Try to get a real analysis from the API even in demo mode
    let apiResponse = null;
    try {
      // Create form data for API request with a default audio file
      const formData = new FormData();
      
      if (recordingUri) {
        // For web, add detailed debugging
        console.log("Web demo mode - attempting to send recording:", recordingUri);
        
        try {
          // Try to fetch the blob from the URI
          const response = await fetch(recordingUri);
          const blob = await response.blob();
          
          // Create a more descriptive filename with proper extension
          formData.append('audio', blob, `audio-${Date.now()}.webm`);
          console.log("Successfully created blob from URI");
        } catch (blobError) {
          console.error('Error creating blob from URI:', blobError);
          formData.append('audio', {
            uri: recordingUri,
            name: 'audio.webm',
            type: 'audio/webm'
          } as any);
        }
      } else {
        console.log("No recording URI available for API call");
        formData.append('audio', {
          uri: 'temp.wav',
          name: 'audio.webm',
          type: 'audio/webm'
        } as any);
      }
      
      // Call the Flask API
      apiResponse = await axios.post(`${API_URL}/predict-type`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 10000,
      });
      console.log('Got API response in web demo mode:', apiResponse.data);
    } catch (err) {
      console.log('API call failed in web demo mode:', err);
    }
    
    // Web-specific recommendation that makes it clear this is a demo
    let recommendation = "This is a web demonstration with limited accuracy. For reliable analysis, please use the mobile app version.";
    
    // If we got a valid API response
    if (apiResponse && apiResponse.data && apiResponse.data.cry_type) {
      const apiCryType = apiResponse.data.cry_type;
      recommendation += ` Based on our analysis, your baby might be showing signs of ${apiCryType}.`;
      
      if (apiCryType === 'hunger') {
        recommendation += " Check if it's feeding time.";
      } else if (apiCryType === 'discomfort' || apiCryType === 'burping') {
        recommendation += " Try checking their diaper, clothing, or if they need burping.";
      } else if (apiCryType === 'tiredness') {
        recommendation += " Consider creating a calm environment for sleep.";
      } else if (apiCryType === 'needs attention') {
        recommendation += " Some gentle interaction or cuddling might help.";
      }
    } else {
      recommendation += " Your baby might be uncomfortable - check diaper, clothing, or room temperature.";
    }
    
    const result: CryAnalysisResult = {
      id: Date.now().toString(),
      timestamp: new Date(),
      emotions: apiResponse?.data?.cry_type ? mapCryTypeToEmotions(apiResponse.data.cry_type) : emotions,
      confidence: apiResponse?.data?.confidence || 0.81, // Use API confidence if available, otherwise fixed value
      duration,
      recommendation,
      cry_type: apiResponse?.data?.cry_type || 'discomfort',
    };
    
    // Save to history
    try {
      const historyJson = await AsyncStorage.getItem('cryHistory');
      const history = historyJson ? JSON.parse(historyJson) : [];
      history.unshift(result);
      await AsyncStorage.setItem('cryHistory', JSON.stringify(history.slice(0, 100)));
    } catch (e) {
      console.error('Failed to save to history', e);
    }
    
    setLastResult(result);
    setIsAnalyzing(false);
    
    return result;
  };

  // Map cry type to emotion distribution
  const mapCryTypeToEmotions = (cryType: string): { hungry: number; tired: number; uncomfortable: number; needsAttention: number } => {
    switch (cryType.toLowerCase()) {
      case 'hunger':
        return { hungry: 75, tired: 10, uncomfortable: 5, needsAttention: 10 };
      case 'tiredness':
      case 'sleepy':
        return { hungry: 10, tired: 70, uncomfortable: 10, needsAttention: 10 };
      case 'pain':
      case 'discomfort':
        return { hungry: 5, tired: 5, uncomfortable: 80, needsAttention: 10 };
      case 'needs attention':
      case 'lonely':
        return { hungry: 10, tired: 10, uncomfortable: 10, needsAttention: 70 };
      case 'burping':
        return { hungry: 15, tired: 5, uncomfortable: 70, needsAttention: 10 };
      default:
        // Balanced distribution for unknown types
        return { hungry: 25, tired: 25, uncomfortable: 25, needsAttention: 25 };
    }
  };

  // Map cry type to recommendation
  const getRecommendation = (cryType: string): string => {
    switch (cryType.toLowerCase()) {
      case 'hunger':
        return 'Your baby seems hungry. Try feeding or checking if it\'s time for the next meal.';
      case 'tiredness':
      case 'sleepy':
        return 'Your baby appears tired. Consider creating a calm environment for sleep.';
      case 'pain':
      case 'discomfort':
        return 'Your baby seems uncomfortable. Check diaper, clothing, or room temperature.';
      case 'needs attention':
      case 'lonely':
        return 'Your baby wants attention and comfort. Try gentle interaction or cuddling.';
      case 'burping':
        return 'Your baby might need burping. Try holding them upright and gently patting their back.';
      default:
        return 'Consider checking all basic needs: hunger, comfort, sleep, and interaction.';
    }
  };

  const analyzeAudio = useCallback(async (audioUri: string, duration: number): Promise<CryAnalysisResult> => {
    setIsAnalyzing(true);
    
    try {
      // Platform-specific handling
      const isWeb = Platform.OS === 'web';
      
      // Create form data for API request
      const formData = new FormData();
      
      if (isWeb) {
        // For web, we need to handle the file differently since FileSystem is not available
        console.log('Web platform detected, using direct URI approach');
        
        // In web, the audioUri might be a Blob object or a data URL
        // We need to use it directly without FileSystem operations
        const fileExtension = '.webm';
        
        // Check if audioUri is a string or an object
        if (typeof audioUri === 'string') {
          // If it's a string URI or data URL, we need to fetch it and create a file
          try {
            const response = await fetch(audioUri);
            const blob = await response.blob();
            formData.append('audio', blob, `audio${fileExtension}`);
          } catch (fetchError) {
            console.error('Error fetching audio blob:', fetchError);
            // Try to use the URI directly as a last resort
            formData.append('audio', {
              uri: audioUri,
              name: `audio${fileExtension}`,
              type: 'audio/webm'
            } as any);
          }
        } else {
          // If it's already a blob or file object (possible in some web implementations)
          formData.append('audio', audioUri, `audio${fileExtension}`);
        }
      } else {
        // For native platforms, use the original approach with FileSystem
        const fileInfo = await FileSystem.getInfoAsync(audioUri);
        console.log('Native platform, file info:', fileInfo);
        
        // Check file extension to determine format
        const isWebm = audioUri.toLowerCase().endsWith('.webm');
        const fileExtension = isWebm ? '.webm' : '.wav';
        
        formData.append('audio', {
          uri: audioUri,
          name: `audio${fileExtension}`,
          type: isWebm ? 'audio/webm' : 'audio/wav'
        } as any);
      }

      console.log('Sending audio to API:', audioUri);
      
      // Call the Flask API
      const response = await axios.post(`${API_URL}/predict-type`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 10000, // 10-second timeout
      });
      
      console.log('API Response:', response.data);
      
      // Process response
      const { cry_type, confidence, timestamp } = response.data;
      
      // Map cry type to emotions
      const emotions = mapCryTypeToEmotions(cry_type);
      
      // Generate recommendation based on cry type
      const recommendation = getRecommendation(cry_type);
      
      const result: CryAnalysisResult = {
        id: Date.now().toString(),
        timestamp: new Date(timestamp),
        emotions,
        confidence: confidence,
        duration,
        recommendation,
        cry_type,
      };

      // Save to history
      try {
        const historyJson = await AsyncStorage.getItem('cryHistory');
        const history = historyJson ? JSON.parse(historyJson) : [];
        history.unshift(result);
        await AsyncStorage.setItem('cryHistory', JSON.stringify(history.slice(0, 100)));
      } catch (e) {
        console.error('Failed to save to history', e);
      }

      setLastResult(result);
      setIsAnalyzing(false);
      
      return result;
    } catch (error) {
      console.error('Error analyzing audio:', error);
      
      // Fallback to mock data if API fails
      const mockResult: CryAnalysisResult = {
        id: Date.now().toString(),
        timestamp: new Date(),
        emotions: { hungry: 35, tired: 25, uncomfortable: 20, needsAttention: 20 },
        confidence: 0.7,
        duration,
        recommendation: "We couldn't analyze the cry pattern accurately. Try again with a clearer recording.",
      };
      
      setLastResult(mockResult);
      setIsAnalyzing(false);
      
      return mockResult;
    }
  }, []);

  // For compatibility with existing code - accepts just a URI
  const analyzeAudioFile = useCallback(async (uri: string): Promise<CryAnalysisResult> => {
    return await analyzeAudio(uri, 0);
  }, [analyzeAudio]);

  return {
    analyzeAudio: analyzeAudioFile,
    analyzeAudioFile,
    isAnalyzing,
    lastResult,
    modelLoaded: true,
    startRecording,
    stopRecordingAndAnalyze,
    recordingUri,
  };
}
