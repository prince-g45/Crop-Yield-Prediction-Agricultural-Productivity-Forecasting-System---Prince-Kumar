import requests

API_KEY = "40f9b5a1e24f4599a78151316263107"

def get_weather(latitude, longitude):

    url = (
        f"https://api.weatherapi.com/v1/forecast.json"
        f"?key={API_KEY}&q={latitude},{longitude}&days=1"
    )

    try:

        response = requests.get(url, timeout=10)

        response.raise_for_status()

        data = response.json()

        return {
            "state": data["location"]["region"],
            "temperature": data["current"]["temp_c"],
            "humidity": data["current"]["humidity"],
            "rainfall": data["forecast"]["forecastday"][0]["day"]["totalprecip_mm"]
        }

    except requests.exceptions.RequestException as e:

        raise Exception(f"Weather API Error: {str(e)}")