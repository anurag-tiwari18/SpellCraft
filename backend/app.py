from flask import Flask, request, jsonify
from flask_cors import CORS
from spellchecker import SpellChecker

app = Flask(__name__)
CORS(app)

spell = SpellChecker()

@app.route("/")
def home():
    return "SpellCraft API is running!"

@app.route("/correct", methods=["POST"])
def correct_text():
    data = request.get_json()
    text = data.get("text", "")

    words = text.split()
    misspelled = spell.unknown(words)

    corrections = []

    for word in misspelled:
        suggestion = spell.correction(word)

        corrections.append({
            "word": word,
            "suggestion": suggestion
        })

    return jsonify({
        "original": text,
        "corrections": corrections
    })

if __name__ == "__main__":
    app.run(debug=True, port=5000)