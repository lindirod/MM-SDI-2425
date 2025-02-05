from flask import Flask, request, jsonify
from transformers import pipeline
from flask_cors import CORS  # Import CORS

app = Flask(__name__)
CORS(app)

# Load the pre-trained emotion detection model
emotion_classifier = pipeline('text-classification', model="SamLowe/roberta-base-go_emotions", return_all_scores=True)

# Map emotions to colors
emotion_to_color = {
    "admiration": "#FFC300",   # Yellow
    "amusement": "#FF5733",    # Orange-red
    "anger": "#C70039",        # Deep red
    "annoyance": "#900C3F",    # Maroon
    "approval": "#DAF7A6",     # Light green
    "caring": "#85C1E9",       # Sky blue
    "confusion": "#BB8FCE",    # Lavender
    "curiosity": "#48C9B0",    # Teal
    "desire": "#F1948A",       # Soft pink
    "disappointment": "#6C3483",  # Dark purple
    "disapproval": "#7D3C98",  # Purple
    "disgust": "#117A65",      # Deep teal
    "embarrassment": "#D98880",# Blush
    "excitement": "#F7DC6F",   # Bright yellow
    "fear": "#34495E",         # Dark blue-gray
    "gratitude": "#52BE80",    # Green
    "grief": "#1B2631",        # Charcoal
    "joy": "#F9E79F",          # Pale yellow
    "love": "#F1948A",         # Pink-red
    "nervousness": "#5D6D7E",  # Gray-blue
    "optimism": "#ABEBC6",     # Mint green
    "pride": "#F4D03F",        # Golden yellow
    "realization": "#B2BABB",  # Neutral gray
    "relief": "#82E0AA",       # Soft green
    "remorse": "#7B241C",      # Brown-red
    "sadness": "#5DADE2",      # Soft blue
    "surprise": "#F5B041",     # Orange
    "neutral": "#D5DBDB"       # Light gray
}

# Map emotions to music
emotion_to_music = {
    "admiration": "music/admiration.mp3",   
    "amusement": "music/amusement.mp3",    
    "anger": "music/anger.mp3",       
    "annoyance": "music/annoyance.mp3",    
    "approval": "music/approval.mp3",     
    "caring": "music/caring.mp3",       
    "confusion": "music/confusion.mp3",    
    "curiosity": "music/curiosity.mp3",    
    "desire": "music/desire.mp3",       
    "disappointment": "music/disappointment.mp3",  
    "disapproval": "music/disapproval.mp3",  
    "disgust": "music/disgust.mp3",      
    "embarrassment": "music/embarrassment.mp3",
    "excitement": "music/excitement.mp3",   
    "fear": "music/fear.mp3",         
    "gratitude": "music/gratitude.mp3",   
    "grief": "music/grief.mp3",        
    "joy": "music/joy.mp3",          
    "love": "music/love.mp3",         
    "nervousness": "music/nervousness.mp3",  
    "optimism": "music/optimism.mp3",     
    "pride": "music/pride.mp3",        
    "realization": "music/realization.mp3",  
    "relief": "music/relief.mp3",       
    "remorse": "music/remorse.mp3",      
    "sadness": "music/sadness.mp3",      
    "surprise": "music/surprise.mp3",     
    "neutral": "music/neutral.mp3"       
}

@app.route('/analyze', methods=['POST'])
def analyze_emotion():
    data = request.json
    sentence = data.get('sentence', '')

    # Perform emotion analysis
    results = emotion_classifier(sentence)
    if not results:
        return jsonify({'error': 'No emotions detected'}), 400

    # Pick the highest-scoring emotion
    highest_emotion = max(results[0], key=lambda x: x['score'])
    emotion = highest_emotion['label']
    color = emotion_to_color.get(emotion, "#FFFFFF")  # Default to white if not found
    music = emotion_to_music.get(emotion, "music/neutral.mp3") # Default to neutral music if not found
    print(highest_emotion)
    print(color)

    return jsonify({'emotion': emotion, 'color': color, 'music': music})

if __name__ == '__main__':
    app.run(debug=True)
