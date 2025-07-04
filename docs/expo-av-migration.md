# Migration Plan: expo-av to expo-audio

## Background

The `expo-av` package is deprecated and will be removed in Expo SDK 54. The recommended replacements are:
- `expo-audio` for audio functionality
- `expo-video` for video functionality

This document outlines the steps needed to migrate from `expo-av` to `expo-audio` for the BabyCare app.

## Current Usage

The app currently uses `expo-av` for:
1. Audio recording in `useCryAnalysis.ts`
2. Audio playback (if any)

## Migration Steps

### 1. Install New Dependencies

```bash
npm install expo-audio
```

### 2. Update useCryAnalysis.ts

Replace the import:
```typescript
// Old
import { Audio } from 'expo-av';

// New
import * as Audio from 'expo-audio';
```

### 3. Update the Recording Logic

The API for `expo-audio` is different from `expo-av`. Here are the key changes:

```typescript
// Old (expo-av)
const newRecording = new Audio.Recording();
await newRecording.prepareToRecordAsync(recordingOptions);
await newRecording.startAsync();

// New (expo-audio)
const recorder = await Audio.createRecorderAsync();
await recorder.startAsync(recordingOptions);
```

### 4. Update Playback Logic (if used)

```typescript
// Old (expo-av)
const sound = new Audio.Sound();
await sound.loadAsync({ uri: audioUri });
await sound.playAsync();

// New (expo-audio)
const player = await Audio.createPlayerAsync({ uri: audioUri });
await player.playAsync();
```

### 5. Update Permission Handling

```typescript
// Old (expo-av)
const permission = await Audio.requestPermissionsAsync();

// New (expo-audio)
const permission = await Audio.requestPermissionsAsync();
// API should be similar, but check the documentation for any changes
```

### 6. Test Thoroughly

- Test recording on all platforms (iOS, Android, web)
- Test with both short and long recordings
- Verify that the recorded audio can be processed correctly by the ML model

### 7. Remove Old Dependencies

Once the migration is complete and tested, remove expo-av:

```bash
npm uninstall expo-av
```

## References

- [Expo Audio Documentation](https://docs.expo.dev/)
- [Expo SDK 54 Migration Guide](https://docs.expo.dev/)
