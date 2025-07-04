# AI-Powered Baby Cry Emotion Detector

## Overview
This mobile application analyzes baby cries to determine their emotional state and probable needs. Using both on-device and API-based machine learning, it can work in real-time while supporting multiple regional Indian languages for better accessibility.

## Features
- **AI-Powered Cry Analysis**: Identifies why your baby is crying (hungry, tired, uncomfortable, needs attention)
- **Real-Time Feedback**: Provides immediate insights with confidence scores
- **Offline & Online Operation**: Works on-device or with the advanced ML API
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
- **Flask API** for advanced cry analysis with Scikit-learn random forest model

## Running the Application

### Prerequisites
- Node.js and npm
- Python 3.8+ (for the cry analysis API)
- Expo CLI (`npm install -g expo-cli`)

### Setup and Running

1. **Install Dependencies**
   ```bash
   npm install
   cd cry-ai-api
   pip install -r requirements.txt
   cd ..
   ```

2. **Start the Development Environment**
   ```bash
   # Run everything (React Native app, Node.js server, and Flask API)
   npm run dev:full
   
   # Or run just the React Native app
   npm run dev:win
   
   # Run just the Flask AI API
   npm run cry-api
   ```

3. **For Windows Users**
   You can also use the batch file in the cry-ai-api folder:
   ```
   cd cry-ai-api
   start_server.bat
   ```

### API Endpoints

- `/predict-type` - POST endpoint that accepts an audio file and returns the predicted cry type
- `/health` - GET endpoint to check if the API is running

### Mobile App Connection

The mobile app connects to the Flask API on `http://10.0.2.2:5000` for Android emulators. For physical devices, update the API_URL in `hooks/useCryAnalysis.ts` to your computer's IP address.

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
