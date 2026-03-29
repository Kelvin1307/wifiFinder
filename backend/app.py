from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

@app.route("/nearby-wifi", methods=["GET"])
def nearby_wifi():
    lat = request.args.get("lat")
    lon = request.args.get("lng")

    if not lat or not lon:
        return jsonify({"error": "Missing coordinates"}), 400

    query = f"""
    [out:json][timeout:25];
    node
      ["internet_access"="wlan"]
      (around:200,{lat},{lon});
    out;
    """

    url = "https://overpass-api.de/api/interpreter"

    try:
        response = requests.post(url, data=query, timeout=10)

        # 🔴 Check if response is empty
        if response.status_code != 200 or not response.text.strip():
            return jsonify({"error": "Overpass API failed"}), 500

        # 🔴 Safe JSON parsing
        try:
            data = response.json()
        except:
            return jsonify({"error": "Invalid response from Overpass"}), 500

        results = []
        for el in data.get("elements", []):
            results.append({
                "name": el.get("tags", {}).get("name", "Unnamed WiFi Spot"),
                "lat": el.get("lat"),
                "lng": el.get("lon")
            })

        return jsonify(results)

    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500
@app.route("/")
def home():
    return "WiFi Finder Backend Running"
if __name__ == "__main__":
    print("Starting Flask server...")
    app.run(host="0.0.0.0", port=5000, debug=True)