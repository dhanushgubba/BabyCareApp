from flask import Flask, request, jsonify
from features_extraction import extract_features
import joblib
import datetime

app = Flask(__name__)
model = joblib.load("CryMLClassifier_random_forest.pkl")  # model file

@app.route("/predict-type", methods=["POST"])
def predict_type():
    file = request.files['audio']
    path = "temp.wav"
    file.save(path)

    features = extract_features(path)
    features = features.reshape(1, -1)

    prediction = model.predict(features)[0]
    confidence = max(model.predict_proba(features)[0])

    return jsonify({
        "cry_type": prediction,
        "confidence": round(confidence, 3),
        "timestamp": str(datetime.datetime.utcnow())
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
