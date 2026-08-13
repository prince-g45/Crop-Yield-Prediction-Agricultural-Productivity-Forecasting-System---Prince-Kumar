import os
import requests
from dotenv import load_dotenv

# ==========================================
# Environment
# ==========================================

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

MODEL = "gemini-2.5-flash"

URL = (
    f"https://generativelanguage.googleapis.com/v1beta/models/"
    f"{MODEL}:generateContent?key={API_KEY}"
)


# ==========================================
# Test Gemini Connection
# ==========================================

def test_gemini():

    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "text": "Reply with only one word: Connected"
                    }
                ]
            }
        ]
    }

    response = requests.post(
        URL,
        headers={
            "Content-Type": "application/json"
        },
        json=payload,
        timeout=60
    )

    print("Status Code:", response.status_code)
    print(response.text)

    response.raise_for_status()

    return response.json()


# ==========================================
# Generate Agricultural AI Report
# ==========================================

def generate_agriculture_report(
    state,
    crop,
    season,
    predicted_yield,
    estimated_production,
    temperature,
    rainfall,
    humidity,
    N,
    P,
    K,
    pH,
    soil_health
):

    prompt = f"""
You are an agricultural AI assistant.

Analyze the following real farm data and provide practical
agricultural insights.

FARM DATA
---------

State: {state}
Current Crop: {crop}
Season: {season}

PREDICTION
----------

Predicted Yield: {predicted_yield}
Estimated Production: {estimated_production}

WEATHER
-------

Temperature: {temperature} °C
Rainfall: {rainfall} mm
Humidity: {humidity} %

SOIL
----

Nitrogen (N): {N}
Phosphorus (P): {P}
Potassium (K): {K}
pH: {pH}
Soil Health: {soil_health}

IMPORTANT RULES
---------------

1. Use ONLY the provided farm data.
2. Do not invent soil or weather values.
3. Do not claim certainty where the data is insufficient.
4. Explain why your recommendations are suitable.
5. The current crop is {crop}; do not assume another crop
   is currently being grown.
6. Consider soil, weather, season and state together.
7. Give practical recommendations suitable for a farmer.

Return ONLY valid JSON in this exact structure:

{{
    "best_crop": "",
    "crop_reason": "",
    "soil_analysis": "",
    "weather_analysis": "",
    "fertilizer_advice": "",
    "irrigation_advice": "",
    "pest_risk": "",
    "yield_analysis": "",
    "productivity_tips": "",
    "summary": ""
}}
"""

    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "text": prompt
                    }
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0.3,
            "responseMimeType": "application/json"
        }
    }

    response = requests.post(
        URL,
        headers={
            "Content-Type": "application/json"
        },
        json=payload,
        timeout=60
    )

    response.raise_for_status()

    result = response.json()

    # Gemini response text
    text = result["candidates"][0]["content"]["parts"][0]["text"]

    return text