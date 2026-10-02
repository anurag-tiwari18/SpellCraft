from flask import Flask, request, jsonify
from flask_cors import CORS

if __package__:
    from backend.spellcheck import get_corrections
else:
    from spellcheck import get_corrections

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return "SpellCraft API is running!"

@app.route("/correct", methods=["POST"])
def correct_text():
    data = request.get_json()
    text = data.get("text", "")

    return jsonify(get_corrections(text))

if __name__ == "__main__":
    app.run(debug=True, port=5000)