from pathlib import Path
from functools import lru_cache

import pandas as pd


# ==========================================
# DATASET PATH
# ==========================================

DATASET_PATH = (
    Path(__file__).resolve().parents[2]
    / "data"
    / "YieldSense_datasets.csv"
)


# ==========================================
# LOAD DATASET
# ==========================================

@lru_cache(maxsize=1)
def load_weather_dataset():

    if not DATASET_PATH.exists():
        raise FileNotFoundError(
            f"YieldSense dataset not found: {DATASET_PATH}"
        )

    df = pd.read_csv(DATASET_PATH)

    required_columns = [
        "crop",
        "year",
        "season",
        "state",
        "avg_temp_c",
        "total_rainfall_mm",
        "avg_humidity_percent",
    ]

    missing_columns = [
        column
        for column in required_columns
        if column not in df.columns
    ]

    if missing_columns:
        raise ValueError(
            "Missing columns in YieldSense_datasets.csv: "
            + ", ".join(missing_columns)
        )

    # ======================================
    # CLEAN TEXT COLUMNS
    # ======================================

    df["crop_clean"] = (
        df["crop"]
        .astype(str)
        .str.strip()
        .str.lower()
    )

    df["state_clean"] = (
        df["state"]
        .astype(str)
        .str.strip()
        .str.lower()
    )

    df["season_clean"] = (
        df["season"]
        .astype(str)
        .str.strip()
        .str.lower()
    )

    # ======================================
    # CLEAN NUMERIC COLUMNS
    # ======================================

    numeric_columns = [
        "year",
        "avg_temp_c",
        "total_rainfall_mm",
        "avg_humidity_percent",
    ]

    for column in numeric_columns:
        df[column] = pd.to_numeric(
            df[column],
            errors="coerce"
        )

    df = df.dropna(
        subset=numeric_columns
    )

    return df


# ==========================================
# HISTORICAL WEATHER ANALYSIS
# ==========================================

def get_historical_weather_analysis(
    crop: str,
    state: str,
    season: str,
):

    df = load_weather_dataset()

    # ======================================
    # NORMALIZE INPUT
    # ======================================

    crop_value = (
        str(crop)
        .strip()
        .lower()
    )

    state_value = (
        str(state)
        .strip()
        .lower()
    )

    season_value = (
        str(season)
        .strip()
        .lower()
    )

    # ======================================
    # FIND MATCHING RECORDS
    # ======================================

    matched = df[
        (df["crop_clean"] == crop_value)
        & (df["state_clean"] == state_value)
        & (df["season_clean"] == season_value)
    ].copy()

    # ======================================
    # NO DATA
    # ======================================

    if matched.empty:

        return {
            "available": False,

            "message": (
                "Historical weather data is not "
                "available for this crop, state "
                "and season combination."
            ),

            "average_rainfall_mm": None,

            "average_temperature_c": None,

            "average_humidity_percent": None,

            "suitability": "Unavailable",

            "years": [],

            "summary": None,
        }

    # ======================================
    # HISTORICAL AVERAGES
    # ======================================

    average_rainfall = float(
        matched[
            "total_rainfall_mm"
        ].mean()
    )

    average_temperature = float(
        matched[
            "avg_temp_c"
        ].mean()
    )

    average_humidity = float(
        matched[
            "avg_humidity_percent"
        ].mean()
    )

    # ======================================
    # WEATHER STABILITY
    # ======================================

    rainfall_std = float(
        matched[
            "total_rainfall_mm"
        ].std()
        or 0
    )

    temperature_std = float(
        matched[
            "avg_temp_c"
        ].std()
        or 0
    )

    humidity_std = float(
        matched[
            "avg_humidity_percent"
        ].std()
        or 0
    )

    rainfall_cv = (
        rainfall_std / average_rainfall
        if average_rainfall > 0
        else 0
    )

    # ======================================
    # WEATHER SUITABILITY
    # ======================================

    if (
        rainfall_cv <= 0.25
        and temperature_std <= 2
        and humidity_std <= 8
    ):

        suitability = "Good"

    elif (
        rainfall_cv <= 0.45
        and temperature_std <= 3
        and humidity_std <= 12
    ):

        suitability = "Moderate"

    else:

        suitability = "Variable"

    # ======================================
    # YEAR-WISE DATA
    # ======================================

    yearly = (
        matched
        .groupby(
            "year",
            as_index=False
        )
        .agg(
            rainfall_mm=(
                "total_rainfall_mm",
                "mean"
            ),

            temperature_c=(
                "avg_temp_c",
                "mean"
            ),

            humidity_percent=(
                "avg_humidity_percent",
                "mean"
            ),
        )
        .sort_values("year")
    )

    # ======================================
    # PREPARE CHART DATA
    # ======================================

    years = []

    for _, row in yearly.iterrows():

        years.append(
            {
                "year": int(
                    row["year"]
                ),

                "rainfall_mm": round(
                    float(
                        row["rainfall_mm"]
                    ),
                    2
                ),

                "temperature_c": round(
                    float(
                        row["temperature_c"]
                    ),
                    2
                ),

                "humidity_percent": round(
                    float(
                        row["humidity_percent"]
                    ),
                    2
                ),
            }
        )

    # ======================================
    # FARMER-FRIENDLY SUMMARY
    # ======================================

    summary = (
        f"Historical weather conditions for "
        f"{crop.title()} in {state.title()} "
        f"during the {season.title()} season "
        f"show an average rainfall of "
        f"{average_rainfall:.0f} mm, average "
        f"temperature of "
        f"{average_temperature:.1f}°C and "
        f"average humidity of "
        f"{average_humidity:.0f}%."
    )

    # ======================================
    # FINAL RESULT
    # ======================================

    return {

        "available": True,

        "message": None,

        "average_rainfall_mm": round(
            average_rainfall,
            2
        ),

        "average_temperature_c": round(
            average_temperature,
            2
        ),

        "average_humidity_percent": round(
            average_humidity,
            2
        ),

        "suitability": suitability,

        "years": years,

        "summary": summary,
    }