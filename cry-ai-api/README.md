# BabyCare App - Backend API Setup

## Prerequisites

Before running the cry analysis API, make sure you have the following installed:

1. Python 3.8 or higher
2. FFmpeg for audio conversion (critical for web compatibility)
3. Required Python packages (specified in requirements.txt)

## Installation Steps

### 1. Install Python Dependencies

```bash
# Navigate to the cry-ai-api directory
cd cry-ai-api

# Install required packages
pip install -r requirements.txt
```

### 2. Install FFmpeg (Required for Web Browser Support)

FFmpeg is required to convert WEBM audio files (from web browsers) to WAV format for processing.

#### Windows:
- Run the included helper script:
  ```
  install_ffmpeg.bat
  ```
  
- Or manually:
  1. Download FFmpeg from [gyan.dev](https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip)
  2. Extract to a folder (e.g., C:\ffmpeg)
  3. Add the bin folder to your system PATH

#### macOS:
```bash
brew install ffmpeg
```

#### Linux:
```bash
sudo apt update
sudo apt install ffmpeg
```

### 3. Verify FFmpeg Installation

```bash
ffmpeg -version
```

This should display the FFmpeg version information.

## Running the API Server

```bash
# Start the server
python app.py
```

The server will start at `http://localhost:5000` by default.

## API Endpoints

- **POST /predict-type**: Analyzes an audio file to predict baby cry type
- **GET /health**: Health check endpoint

## Troubleshooting

### Web Browser Audio Conversion Issues

If you see errors like:
```
Pydub conversion failed: [WinError 2] The system cannot find the file specified
```

This indicates that FFmpeg is not properly installed or not in your PATH. Run the `install_ffmpeg.bat` script or follow the manual installation steps.

### NumPy Version Issues

If you see errors related to NumPy and Numba compatibility:
```
Error loading audio file: Numba needs NumPy 2.2 or less. Got NumPy 2.3.
```

Run:
```bash
pip install numpy==2.2.0
```

### Web Browser Compatibility

The API supports both WAV (from mobile) and WEBM (from web browsers) audio formats. For web demo mode, we use a fallback mechanism when processing fails.
