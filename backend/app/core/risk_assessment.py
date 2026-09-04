# ==========================================
# RISK ASSESSMENT
# ==========================================

def calculate_risk_assessment(
    temperature,
    rainfall,
    humidity,
    soil_health,
    weather_analysis,
):

    score = 0

    factors = []


    # ==========================================
    # SAFELY READ HISTORICAL WEATHER
    # ==========================================

    if isinstance(weather_analysis, dict):

        average_temperature = (
            weather_analysis.get(
                "average_temperature_c"
            )
        )

        average_rainfall = (
            weather_analysis.get(
                "average_rainfall_mm"
            )
        )

        average_humidity = (
            weather_analysis.get(
                "average_humidity_percent"
            )
        )

    else:

        average_temperature = (
            weather_analysis.average_temperature_c
            if weather_analysis
            else None
        )

        average_rainfall = (
            weather_analysis.average_rainfall_mm
            if weather_analysis
            else None
        )

        average_humidity = (
            weather_analysis.average_humidity_percent
            if weather_analysis
            else None
        )


    # ==========================================
    # TEMPERATURE RISK
    # ==========================================

    if (
        temperature is not None
        and average_temperature is not None
    ):

        difference = abs(
            temperature - average_temperature
        )

        if difference > 5:

            score += 30

            factors.append(
                "Temperature is significantly different from the historical average."
            )

        elif difference > 3:

            score += 15

            factors.append(
                "Temperature is moderately different from the historical average."
            )


    # ==========================================
    # RAINFALL RISK
    # ==========================================

    if (
        rainfall is not None
        and average_rainfall is not None
        and average_rainfall > 0
    ):

        difference_percent = (

            abs(
                rainfall - average_rainfall
            )

            / average_rainfall

        ) * 100


        if difference_percent > 50:

            score += 30

            factors.append(
                "Rainfall is significantly different from the historical pattern."
            )

        elif difference_percent > 25:

            score += 15

            factors.append(
                "Rainfall is moderately different from the historical pattern."
            )


    # ==========================================
    # HUMIDITY RISK
    # ==========================================

    if (
        humidity is not None
        and average_humidity is not None
    ):

        difference = abs(
            humidity - average_humidity
        )


        if difference > 20:

            score += 20

            factors.append(
                "Humidity is significantly different from the historical average."
            )

        elif difference > 10:

            score += 10

            factors.append(
                "Humidity is moderately different from the historical average."
            )


    # ==========================================
    # SOIL RISK
    # ==========================================

    soil = str(
        soil_health or ""
    ).strip().lower()


    if "poor" in soil:

        score += 20

        factors.append(
            "Soil health may negatively affect crop growth."
        )


    # ==========================================
    # LIMIT SCORE
    # ==========================================

    score = min(
        max(score, 0),
        100
    )


    # ==========================================
    # RISK LEVEL
    # ==========================================

    if score <= 25:

        level = "LOW"

    elif score <= 55:

        level = "MODERATE"

    else:

        level = "HIGH"


    # ==========================================
    # DEFAULT FACTOR
    # ==========================================

    if not factors:

        factors.append(
            "No major risk factor was detected from the available data."
        )


    # ==========================================
    # FINAL RESULT
    # ==========================================

    return {

        "score": score,

        "level": level,

        "factors": factors,

    }