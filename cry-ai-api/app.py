from flask import Flask, request, jsonify
from features_extraction import extract_features
import joblib
import datetime
from datetime import timezone
import os
import sys
import base64
from flask_cors import CORS
import numpy as np
import soundfile as sf
from pydub import AudioSegment
import tempfile

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Use the new compatible model
model = joblib.load("CryMLClassifier_random_forest_new.pkl")  # new model file

# Map numerical predictions to human-readable cry types
cry_types = ['hunger', 'tiredness', 'discomfort', 'needs attention', 'burping']

# Function to check if ffmpeg is available
def is_ffmpeg_available():
    import shutil
    return shutil.which('ffmpeg') is not None

# Print ffmpeg status at startup
print(f"FFmpeg available: {is_ffmpeg_available()}")

# Function to convert webm to wav
def convert_webm_to_wav(webm_path):
    try:
        # Check if ffmpeg is installed
        if not is_ffmpeg_available():
            print("Warning: FFmpeg not found. Cannot convert WEBM to WAV.")
            return webm_path
            
        # Create a temporary wav file
        wav_path = os.path.splitext(webm_path)[0] + '.wav'
        
        # Use pydub to convert (requires ffmpeg)
        try:
            sound = AudioSegment.from_file(webm_path)
            sound.export(wav_path, format="wav")
            print(f"Converted {webm_path} to {wav_path}")
            return wav_path
        except Exception as e:
            print(f"Pydub conversion failed: {str(e)}")
            return webm_path  # Return original path if conversion fails
    except Exception as e:
        print(f"Error in webm conversion: {str(e)}")
        return webm_path

@app.route("/predict-type", methods=["POST"])
def predict_type():
    try:
        if 'audio' not in request.files:
            print("No audio file in request")
            return jsonify({
                "error": "No audio file provided",
                "cry_type": "unknown",
                "confidence": 0.5,
                "timestamp": str(datetime.datetime.now(timezone.utc))
            }), 400
        
        file = request.files['audio']
        if not file.filename:
            print("Empty filename received")
            
        # Get file extension and content type for better debugging
        file_extension = os.path.splitext(file.filename)[1].lower() if file.filename else '.unknown'
        content_type = file.content_type if hasattr(file, 'content_type') else 'unknown'
        
        print(f"Received file: {file.filename}, extension: {file_extension}, content-type: {content_type}")
        
        # Determine file path based on format
        if file_extension == '.webm' or content_type == 'audio/webm':
            path = "temp.webm"
            # Save the original webm file
            file.save(path)
            print(f"Saved WEBM file: {path}, size: {os.path.getsize(path)} bytes")
            
            # Try to convert webm to wav for better processing
            wav_path = convert_webm_to_wav(path)
            final_path = wav_path
            
            if wav_path == path and not is_ffmpeg_available():
                print("WARNING: FFmpeg not available - WEBM processing may fail")
                print("Please install FFmpeg using the provided install_ffmpeg.bat script")
        else:
            # For wav files or unknown types, save directly
            path = "temp.wav"
            file.save(path)
            final_path = path
            print(f"Saved WAV file: {path}, size: {os.path.getsize(path)} bytes")

        # Log file information
        file_size = os.path.getsize(final_path)
        print(f"Processing audio file: {file.filename}, size: {file_size} bytes, path: {final_path}")

        try:
            # Try to extract features
            features = extract_features(final_path)
            features = features.reshape(1, -1)
            
            # If features are all zeros (error case), use default prediction
            if np.sum(features) == 0:
                print("Warning: Zero features detected, using default prediction")
                prediction = "discomfort"  # Default prediction
                confidence = 0.31  # Low confidence
            else:
                # Get numerical prediction and convert to cry type string
                prediction_idx = model.predict(features)[0]
                prediction = cry_types[prediction_idx]
                confidence = float(max(model.predict_proba(features)[0]))
                print(f"Prediction: {prediction}, Confidence: {confidence}")
        except Exception as e:
            print(f"Error in prediction: {str(e)}")
            prediction = "discomfort"  # Default prediction on error
            confidence = 0.31  # Low confidence

        return jsonify({
            "cry_type": prediction,
            "confidence": round(confidence, 3),
            "timestamp": str(datetime.datetime.now(timezone.utc))
        })
    except Exception as e:
        print(f"Error in prediction: {str(e)}")
        return jsonify({
            "error": str(e),
            "cry_type": "unknown",
            "confidence": 0.5,
            "timestamp": str(datetime.datetime.now(timezone.utc))
        }), 500

@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "ok",
        "timestamp": str(datetime.datetime.now(timezone.utc))
    })

@app.route("/check-ffmpeg", methods=["GET"])
def check_ffmpeg():
    # Check if ffmpeg is installed
    ffmpeg_available = is_ffmpeg_available()
    
    # Get ffmpeg version if available
    ffmpeg_version = "Not installed"
    if ffmpeg_available:
        try:
            import subprocess
            version_output = subprocess.check_output(['ffmpeg', '-version'], stderr=subprocess.STDOUT)
            ffmpeg_version = version_output.decode('utf-8').split('\n')[0]
        except Exception as e:
            ffmpeg_version = f"Error getting version: {str(e)}"
    
    return jsonify({
        "ffmpeg_available": ffmpeg_available,
        "ffmpeg_version": ffmpeg_version,
        "timestamp": str(datetime.datetime.now(timezone.utc))
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
