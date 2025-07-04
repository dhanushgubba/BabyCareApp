# BabyCare App - Web Demo Mode

## Understanding the Web Demo Mode Limitations

The BabyCare app supports running in web browsers with limited functionality through our "Web Demo Mode". This document explains the warnings you might see and how to address them.

## Common Warning Messages

### 1. Pydub/FFmpeg Warnings

```
Couldn't find ffmpeg or avconv - defaulting to ffmpeg, but may not work
Pydub conversion failed: [WinError 2] The system cannot find the file specified
```

**Cause:** The web version sends audio in WEBM format, which needs to be converted to WAV for analysis. This conversion requires FFmpeg.

**Solution:** Install FFmpeg on your server by running:
```
cd cry-ai-api
.\setup_ffmpeg_and_start.bat
```

### 2. Expo-AV Deprecation Warning

```
[expo-av]: Expo AV has been deprecated and will be removed in SDK 54. Use the `expo-audio` and `expo-video` packages to replace the required functionality.
```

**Cause:** The expo-av library used for audio recording is being deprecated.

**Solution:** We've already prepared for migration to expo-audio. See `docs/expo-av-migration.md` for details.

### 3. Style Props Warnings

```
"shadow*" style props are deprecated. Use "boxShadow".
props.pointerEvents is deprecated. Use style.pointerEvents
```

**Cause:** React Native is deprecating certain style properties.

**Solution:** We've updated our own components, but third-party libraries might still use these props.

## Understanding the Web Demo Mode

When running in a web browser, the BabyCare app operates in "Web Demo Mode" with the following limitations:

1. **Audio Processing:** Web browsers have limited audio recording capabilities and send audio in WEBM format, which may not be ideal for our ML model.

2. **Mock Results:** When real analysis fails, we provide realistic mock results to demonstrate the app's functionality.

3. **Banner Notification:** A banner at the top of the app clearly indicates when you're in web demo mode.

For the full experience and accurate cry analysis, please use the native mobile app on iOS or Android.

## Additional Resources

- **FFmpeg Setup:** `cry-ai-api/setup_ffmpeg_and_start.bat`
- **API Documentation:** `cry-ai-api/README.md`
- **Warnings Details:** `docs/WARNINGS.md`

## Development Notes

When contributing to the BabyCare app, please be aware of:

1. **Web Compatibility:** All audio recording functions should check for Platform.OS === 'web' and provide appropriate fallbacks.

2. **FFmpeg Dependency:** The backend requires FFmpeg for audio format conversion. Always document this requirement.

3. **Expo AV Migration:** We're preparing to migrate to expo-audio for future SDK compatibility.
