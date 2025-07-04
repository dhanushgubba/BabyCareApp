# AI-Powered Baby Cry Emotion Detector

## Overview
This mobile application analyzes baby cries to determine their emotional state and probable needs. Using TensorFlow Lite for on-device machine learning, it can work offline while supporting multiple regional Indian languages for better accessibility.

## Features
- **AI-Powered Cry Analysis**: Identifies why your baby is crying (hungry, tired, uncomfortable, needs attention)
- **Real-Time Feedback**: Provides immediate insights with confidence scores
- **Offline Operation**: Works without internet for reliable use anywhere
- **Multilingual Support**: Available in English, Hindi, Tamil, Telugu, and Bengali
- **History Tracking**: Records and displays patterns over time
- **Smart Insights**: Provides pattern recognition and personalized recommendations
- **Privacy-Focused**: Processes audio on-device with optional cloud backup

## Technical Details

### Frontend
- **React Native** with Expo for cross-platform mobile development
- **TensorFlow.js** for on-device ML inference
- **Reanimated** for smooth animations and UI interactions
- **AsyncStorage** for local data persistence

### Backend
- **MongoDB** for cloud storage and synchronization
- **Express.js** for API development
- **Node.js** server for backend processing
- **JWT** for secure authentication

### Machine Learning
- **TensorFlow** for model training and optimization
- **TensorFlow Lite** for on-device inference
- Trained on labeled cry audio samples from diverse demographics

## Getting Started

### Prerequisites
- Node.js 14+ and npm
- React Native development environment
- MongoDB (for backend development)

### Installation
1. Clone the repository
   ```
   git clone https://github.com/yourusername/baby-cry-detector.git
   ```

2. Install dependencies
   ```
   cd baby-cry-detector
   npm install
   ```

3. Start the development server
   ```
   npm run dev
   ```

4. (Optional) Start the backend server
   ```
   cd server
   npm install
   npm start
   ```

## Usage
1. Open the app and grant microphone permissions
2. Place your phone near your crying baby
3. Tap the microphone button to start recording
4. The app will analyze the cry and display the results
5. View history and insights in their respective tabs

## Privacy and Data
- Audio is processed on-device by default
- No audio is uploaded to servers unless explicitly opted in
- Historical data is stored locally with optional cloud backup
- All data transmission is encrypted

## Why This Matters
- Helps new parents understand their baby's needs
- Reduces stress and anxiety for caregivers
- Supports parents with language or literacy barriers
- Provides valuable insights for pediatric care

## Roadmap
- Add video analysis for complementary emotional cues
- Expand language support to more regional languages
- Develop wearable integration for continuous monitoring
- Create API for pediatrician integration
