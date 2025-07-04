import numpy as np
import os
import warnings
import soundfile as sf  # A more compatible audio library that doesn't depend on numba

# Try to import librosa, but have a fallback if it fails
try:
    import librosa
    LIBROSA_AVAILABLE = True
except ImportError:
    print("Librosa not available, using basic audio processing")
    LIBROSA_AVAILABLE = False

def extract_features(file_path):
    try:
        # Check if file exists
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"Audio file not found at {file_path}")
        
        # Print file info
        print(f"Processing file: {file_path}, size: {os.path.getsize(file_path)} bytes")
        
        # First try using soundfile which is more compatible
        try:
            # Load audio file with soundfile
            data, sample_rate = sf.read(file_path)
            print(f"Successfully loaded audio with soundfile: {len(data)} samples, {sample_rate} Hz")
            
            # If librosa is available, use it for feature extraction
            if LIBROSA_AVAILABLE:
                try:
                    # Convert to mono if stereo
                    if len(data.shape) > 1 and data.shape[1] > 1:
                        data = np.mean(data, axis=1)
                    
                    # Create librosa style features
                    with warnings.catch_warnings():
                        warnings.simplefilter("ignore")
                        mfcc = librosa.feature.mfcc(y=data, sr=sample_rate, n_mfcc=40)
                        chroma = librosa.feature.chroma_stft(y=data, sr=sample_rate)
                        spectral_contrast = librosa.feature.spectral_contrast(y=data, sr=sample_rate)
                        zero_crossing_rate = librosa.feature.zero_crossing_rate(data)
                    
                    # Combine features
                    mfcc_feature = np.mean(mfcc.T, axis=0)
                    chroma_feature = np.mean(chroma.T, axis=0)
                    contrast_feature = np.mean(spectral_contrast.T, axis=0)
                    zcr_feature = np.mean(zero_crossing_rate.T, axis=0)
                    
                    combined_features = np.concatenate([mfcc_feature, chroma_feature, contrast_feature, zcr_feature])
                    return combined_features
                    
                except Exception as e:
                    print(f"Librosa feature extraction error: {str(e)}, falling back to basic features")
            
            # Simple feature extraction without librosa
            # Basic time-domain features
            features = []
            # Mean and standard deviation
            features.append(np.mean(data))
            features.append(np.std(data))
            # Zero crossing rate (simple implementation)
            zero_crossings = np.sum(np.abs(np.diff(np.signbit(data))))
            features.append(zero_crossings / len(data))
            # Energy
            features.append(np.sum(data**2) / len(data))
            
            # Pad to match the expected feature size
            pad_size = 60 - len(features)  # We expected 60 features
            padding = np.zeros(pad_size)
            return np.concatenate([np.array(features), padding])
            
        except Exception as e:
            print(f"Error processing with soundfile: {str(e)}")
        
        # If soundfile fails, try librosa as fallback
        if LIBROSA_AVAILABLE:
            try:
                # Suppress warnings from librosa
                with warnings.catch_warnings():
                    warnings.simplefilter("ignore")
                    y, sr = librosa.load(file_path, sr=22050, mono=True, res_type='kaiser_fast')
                    print("Successfully loaded audio with librosa")
                    
                    # Check if audio is too short
                    if len(y) < sr * 0.5:  # less than 0.5 seconds
                        print("Audio is too short, using default features")
                        return np.zeros(60)  # Return 60 features
            except Exception as e:
                print(f"Error loading audio with librosa: {str(e)}")
                return np.zeros(60)  # Return 60 features
        else:
            # Return default features if neither method works
            return np.zeros(60)  # Return 60 features
            
        # Extract MFCC features
        mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=40)
        
        # Add some more acoustic features for better classification
        chroma = librosa.feature.chroma_stft(y=y, sr=sr)
        spectral_contrast = librosa.feature.spectral_contrast(y=y, sr=sr)
        zero_crossing_rate = librosa.feature.zero_crossing_rate(y)
        
        # Combine all features
        mfcc_feature = np.mean(mfcc.T, axis=0)
        chroma_feature = np.mean(chroma.T, axis=0)
        spectral_contrast_feature = np.mean(spectral_contrast.T, axis=0)
        zcr_feature = np.mean(zero_crossing_rate.T, axis=0)
        
        # Concatenate all features
        combined_features = np.concatenate([
            mfcc_feature, 
            chroma_feature, 
            spectral_contrast_feature, 
            zcr_feature
        ])
        
        return combined_features
        
    except Exception as e:
        print(f"Error extracting features: {str(e)}")
        # Return a default feature vector of appropriate size
        # The size should match what the model expects
        return np.zeros(40 + 12 + 7 + 1)  # mfcc + chroma + contrast + zcr
