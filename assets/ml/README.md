# TensorFlow.js Demo Model - Baby Cry Analysis App

This is a simplified model for a React Native / Expo app that demonstrates how to:

1. Initialize TensorFlow.js in React Native
2. Create and use a basic model (creating a sequential model in memory)
3. Perform audio analysis with mock data processing

## Usage Notes

For production use, you would:
1. Train a proper TensorFlow model with real baby cry audio data
2. Convert it to TensorFlow.js format using the official converter
3. Bundle it with your app or host it on a server
4. Implement real audio processing algorithms to extract MFCC features from audio

## Why This Example?

This provides a simpler demo that avoids bundling issues while still demonstrating the key concepts of:
- TensorFlow.js initialization
- Model loading & caching
- Basic inference
- Audio processing workflow

## Resources for Building Real Models

- [TensorFlow.js Audio Recognition Tutorial](https://www.tensorflow.org/js/tutorials/transfer/audio_recognizer)
- [TensorFlow Audio Classification](https://www.tensorflow.org/tutorials/audio/simple_audio)
- [React Native TensorFlow.js](https://github.com/tensorflow/tfjs/tree/master/tfjs-react-native)
