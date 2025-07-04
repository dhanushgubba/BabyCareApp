import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useCryAnalysis } from './useCryAnalysis';

export function useWebCompatibility() {
  const originalHook = useCryAnalysis();
  
  // If we're not on web, return the original hook
  if (Platform.OS !== 'web') {
    return originalHook;
  }
  
  // Web-specific modifications and overrides
  return {
    ...originalHook,
    
    // Add any web-specific overrides here
    startRecording: async () => {
      // Show a message indicating web limitations
      console.log('Running in web demonstration mode - limited functionality');
      // We could show an alert, but it might be annoying
      // alert('Web demo mode: For full functionality, please use the mobile app.');
      
      // Make sure browser supports audio recording
      if (!navigator?.mediaDevices?.getUserMedia) {
        console.error('This browser does not support audio recording');
        alert('Your browser does not support audio recording. Please use Chrome, Edge, or Firefox.');
        return false;
      }
      
      // Request browser permissions explicitly before using the expo-av implementation
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        return await originalHook.startRecording();
      } catch (err) {
        console.error('Browser denied permission for audio recording:', err);
        alert('Please allow microphone access to use this feature.');
        return false;
      }
    },
    
    // Override the model loaded status to indicate web demo mode
    modelLoaded: true,
    
    // We could add more web-specific overrides here if needed
  };
}
