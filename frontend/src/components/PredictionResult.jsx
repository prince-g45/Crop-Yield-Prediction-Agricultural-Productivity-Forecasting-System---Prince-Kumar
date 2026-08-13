import "../styles/PredictionResult.css";

import {
  Sprout,
  Droplets,
  FlaskConical,
  ShieldAlert,
  CheckCircle2,
  ArrowUpRight,
  CloudSun,
  CloudRain,
  Thermometer,
} from "lucide-react";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";


function PredictionResult({
  result,
  variant = "hero",
  onNewPrediction,
}) {

  // ==========================================
  // HERO CARD
  // ==========================================

  if (variant === "hero") {

    return (
      <div className="prediction-hero-wrapper">

        <div className="production-card">

          <h2>
            Estimated Production
          </h2>

          <div className="production-value">

            {result
              ? Number(
                  result.estimated_production
                ).toFixed(2)
              : "--"}

          </div>

          <p>
            Tonnes
          </p>

          <span>

            {result
              ? "Prediction Completed"
              : "Prediction not available"}

          </span>

        </div>


        {result && (

          <button
            className="new-prediction-btn"
            onClick={onNewPrediction}
          >
            New Prediction
          </button>

        )}

      </div>
    );
  }


  // ==========================================
  // AI REPORT PARSER
  // ==========================================

  let aiReport = null;

  if (result?.agricultural_report) {

    try {

      if (
        typeof result.agricultural_report ===
        "object"
      ) {

        aiReport =
          result.agricultural_report;

      } else {

        aiReport = JSON.parse(
          result.agricultural_report
        );

      }

    } catch (error) {

      console.error(
        "Agricultural report parsing error:",
        error
      );

      aiReport = null;
    }
  }


  // ==========================================
  // NPK CHART DATA
  // ==========================================

  const npkData = result
    ? [

        {
          name: "Nitrogen",
          value:
            Number(result.N) || 0,
        },

        {
          name: "Phosphorus",
          value:
            Number(result.P) || 0,
        },

        {
          name: "Potassium",
          value:
            Number(result.K) || 0,
        },

      ]
    : [];


  const npkColors = [
    "#16a34a",
    "#2563eb",
    "#f59e0b",
  ];


  // ==========================================
  // PH POSITION
  // ==========================================

  const phValue = result
    ? Number(result.pH) || 0
    : 0;


  const phPosition = Math.min(
    Math.max(
      ((phValue - 4) / 5) * 100,
      0
    ),
    100
  );


  // ==========================================
  // WEATHER ANALYSIS
  // ==========================================

  const weatherAnalysis =
    result?.weather_analysis || null;


  // ==========================================
  // HISTORICAL YEAR DATA
  // ==========================================

  const weatherTrend =
    weatherAnalysis?.years?.length > 0
      ? weatherAnalysis.years
      : [];


  // ==========================================
  // MAIN RESULT
  // ==========================================

  return (

    <div className="result-container">


      {/* ======================================
          PREDICTION SUMMARY
      ====================================== */}

      <div className="summary-card">

        <h2>
          Prediction Summary
        </h2>


        {!result ? (

          <div className="no-result">

            <p>
              No prediction available.
            </p>

            <small>
              Fill the form and click
              "Predict Yield".
            </small>

          </div>

        ) : (

          <div className="summary-grid">


            <div className="summary-row">

              <span>
                Farm
              </span>

              <strong>
                {result.farm_name}
              </strong>

            </div>


            <div className="summary-row">

              <span>
                State
              </span>

              <strong>
                {result.state}
              </strong>

            </div>


            <div className="summary-row">

              <span>
                Crop
              </span>

              <strong>
                {result.crop}
              </strong>

            </div>


            <div className="summary-row">

              <span>
                Season
              </span>

              <strong>
                {result.season}
              </strong>

            </div>


            <div className="summary-row">

              <span>
                Yield
              </span>

              <strong>

                {Number(
                  result.predicted_yield
                ).toFixed(2)}{" "}

                t/ha

              </strong>

            </div>


            <div className="summary-row">

              <span>
                Area
              </span>

              <strong>

                {Number(
                  result.area
                ).toFixed(2)}{" "}

                ha

              </strong>

            </div>


            <div className="summary-row full-width">

              <span>
                Prediction Date
              </span>

              <strong>

                {result.created_at

                  ? new Date(
                      result.created_at
                    ).toLocaleString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      }
                    )

                  : "-"}

              </strong>

            </div>


          </div>

        )}

      </div>



      {/* ======================================
          SOIL ANALYSIS
      ====================================== */}

      {result && (

        <div className="soil-section">


          <div className="section-title">

            <div>

              <h2>
                Soil Analysis
              </h2>

              <p>
                Nutrient composition of your soil
              </p>

            </div>

          </div>



          <div className="soil-visual">


            {/* ==================================
                NPK CHART
            ================================== */}

            <div className="soil-chart-card">

              <h3>
                NPK Balance
              </h3>


              <div className="soil-chart-wrapper">

                <ResponsiveContainer
                  width="100%"
                  height={260}
                >

                  <PieChart>

                    <Pie
                      data={npkData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={105}
                      paddingAngle={4}
                      dataKey="value"
                      stroke="none"
                    >

                      {npkData.map(
                        (entry, index) => (

                          <Cell
                            key={`cell-${index}`}
                            fill={
                              npkColors[
                                index %
                                npkColors.length
                              ]
                            }
                          />

                        )
                      )}

                    </Pie>


                    <Tooltip />

                  </PieChart>

                </ResponsiveContainer>


                <div className="soil-chart-center">

                  <strong>
                    NPK
                  </strong>

                  <span>
                    Balance
                  </span>

                </div>

              </div>



              <div className="soil-legend">


                <div className="legend-item">

                  <span className="legend-dot nitrogen" />

                  <div>

                    <span>
                      Nitrogen
                    </span>

                    <strong>
                      {result.N}
                    </strong>

                  </div>

                </div>


                <div className="legend-item">

                  <span className="legend-dot phosphorus" />

                  <div>

                    <span>
                      Phosphorus
                    </span>

                    <strong>
                      {result.P}
                    </strong>

                  </div>

                </div>


                <div className="legend-item">

                  <span className="legend-dot potassium" />

                  <div>

                    <span>
                      Potassium
                    </span>

                    <strong>
                      {result.K}
                    </strong>

                  </div>

                </div>


              </div>

            </div>



            {/* ==================================
                SOIL STATUS
            ================================== */}

            <div className="soil-status-panel">

              <div className="status-heading">
                Soil Status
              </div>


              <div className="status-value">

                {result.soil_health}

              </div>


              <div className="status-badge">
                Healthy
              </div>



              <div className="ph-section">

                <div className="ph-header">

                  <span>
                    pH Level
                  </span>

                  <strong>
                    {result.pH}
                  </strong>

                </div>


                <div className="ph-bar">

                  <div
                    className="ph-marker"
                    style={{
                      left:
                        `${phPosition}%`,
                    }}
                  />

                </div>


                <div className="ph-labels">

                  <span>
                    Acidic
                  </span>

                  <span>
                    Ideal
                  </span>

                  <span>
                    Alkaline
                  </span>

                </div>

              </div>



              <div className="nutrient-status">


                <div>

                  <span>
                    Nitrogen
                  </span>

                  <strong>
                    {result.N}
                  </strong>

                </div>


                <div>

                  <span>
                    Phosphorus
                  </span>

                  <strong>
                    {result.P}
                  </strong>

                </div>


                <div className="low">

                  <span>
                    Potassium
                  </span>

                  <strong>
                    {result.K}
                  </strong>

                  <small>
                    Low
                  </small>

                </div>


              </div>

            </div>


          </div>

        </div>

      )}



      {/* ======================================
          WEATHER ANALYSIS
          HISTORICAL DATA
      ====================================== */}

      {result && (

        <div className="weather-section">


          {/* ==================================
              WEATHER HEADER
          ================================== */}

          <div className="weather-section-header">


            <div className="weather-heading">


              <div className="weather-title-icon">

                <CloudSun
                  size={20}
                  strokeWidth={2}
                />

              </div>


              <div>

                <h2>
                  Weather Analysis
                </h2>

                <p>
                  Historical climate pattern for
                  your crop and season
                </p>

              </div>


            </div>


            <span className="weather-analysis-badge">
              Historical
            </span>


          </div>



          {/* ==================================
              WEATHER METRICS
          ================================== */}

          <div className="weather-metrics">


            {/* RAINFALL */}

            <div className="weather-metric-card">

              <span>
                Rainfall
              </span>

              <strong>

                {weatherAnalysis
                  ?.average_rainfall_mm != null

                  ? `${Number(
                      weatherAnalysis
                        .average_rainfall_mm
                    ).toFixed(0)} mm`

                  : "--"}

              </strong>

            </div>



            {/* TEMPERATURE */}

            <div className="weather-metric-card">

              <span>
                Temperature
              </span>

              <strong>

                {weatherAnalysis
                  ?.average_temperature_c != null

                  ? `${Number(
                      weatherAnalysis
                        .average_temperature_c
                    ).toFixed(1)}°C`

                  : "--"}

              </strong>

            </div>



            {/* HUMIDITY */}

            <div className="weather-metric-card">

              <span>
                Humidity
              </span>

              <strong>

                {weatherAnalysis
                  ?.average_humidity_percent != null

                  ? `${Number(
                      weatherAnalysis
                        .average_humidity_percent
                    ).toFixed(0)}%`

                  : "--"}

              </strong>

            </div>



            {/* SUITABILITY */}

            <div className="weather-metric-card suitability-card">

              <span>
                Weather Pattern
              </span>

              <strong>

                {weatherAnalysis?.suitability ||
                  "--"}

              </strong>

            </div>


          </div>



          {/* ==================================
              HISTORICAL CHART
          ================================== */}

          <div className="weather-chart-card">


            <div className="weather-card-header">

              <div>

                <h3>
                  Historical Rainfall Trend
                </h3>

                <p>
                  Year-wise rainfall pattern from
                  the YieldSense historical dataset
                </p>

              </div>

            </div>



            <div className="weather-chart-wrapper">


              {weatherTrend.length > 0 ? (

                <ResponsiveContainer
                  width="100%"
                  height={220}
                >

                  <LineChart
                    data={weatherTrend}
                    margin={{
                      top: 10,
                      right: 10,
                      left: 0,
                      bottom: 5,
                    }}
                  >


                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e2e8f0"
                    />


                    <XAxis
                      dataKey="year"
                      tick={{
                        fontSize: 10,
                        fill: "#64748b",
                      }}
                      axisLine={false}
                      tickLine={false}
                    />


                    <YAxis
                      tick={{
                        fontSize: 10,
                        fill: "#64748b",
                      }}
                      axisLine={false}
                      tickLine={false}
                    />


                    <Tooltip
                      formatter={(
                        value,
                        name
                      ) => {

                        if (
                          name === "Rainfall"
                        ) {

                          return [
                            `${Number(
                              value
                            ).toFixed(0)} mm`,
                            name,
                          ];

                        }

                        return [
                          value,
                          name,
                        ];

                      }}
                    />


                    <Line
                      type="monotone"
                      dataKey="rainfall_mm"
                      name="Rainfall"
                      stroke="#2563eb"
                      strokeWidth={2.5}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />


                  </LineChart>

                </ResponsiveContainer>

              ) : (

                <div className="weather-no-chart">

                  <CloudRain
                    size={25}
                  />

                  <strong>
                    Historical weather data
                    unavailable
                  </strong>

                  <span>
                    No historical records were
                    found for this crop, state
                    and season.
                  </span>

                </div>

              )}


            </div>

          </div>



          {/* ==================================
              WEATHER SUMMARY
          ================================== */}

          {weatherAnalysis?.available && (

            <div className="weather-bottom">


              <div className="weather-suitability-box">

                <span>
                  Weather Pattern
                </span>

                <strong>

                  {weatherAnalysis.suitability ||
                    "--"}

                </strong>

              </div>


              <p>

                {weatherAnalysis.summary ||
                  "Historical weather information is available for this crop and season."}

              </p>


            </div>

          )}



          {/* ==================================
              NO DATA MESSAGE
          ================================== */}

          {weatherAnalysis &&
            !weatherAnalysis.available && (

              <div className="weather-bottom">

                <div className="weather-suitability-box">

                  <span>
                    Weather Pattern
                  </span>

                  <strong>
                    Unavailable
                  </strong>

                </div>


                <p>

                  {weatherAnalysis.message ||
                    "Historical weather data is not available for this crop, state and season."}

                </p>

              </div>

            )}


        </div>

      )}



      {/* ======================================
          FARM ADVICE
      ====================================== */}

      {aiReport && (

        <div className="farmer-report">


          <div className="farmer-report-header">


            <div className="report-heading">


              <div className="report-title-icon">

                <Sprout
                  size={20}
                  strokeWidth={2}
                />

              </div>


              <div>

                <h2>
                  Farm Advice
                </h2>

                <p>
                  Simple recommendations
                  for your farm
                </p>

              </div>


            </div>


            <span>
              Advisory
            </span>


          </div>



          {/* GOOD */}

          <div className="advice-card good-card">


            <div className="advice-label">

              <CheckCircle2
                size={14}
                strokeWidth={2}
              />

              GOOD

            </div>


            <h3>

              Soil condition is{" "}

              {result.soil_health
                ? result.soil_health.toLowerCase()
                : "healthy"}

            </h3>


            <p>
              Your soil is suitable
              for the selected crop.
            </p>


          </div>



          {/* ACTION */}

          <div className="advice-card action-card">


            <div className="advice-label">

              <Droplets
                size={14}
                strokeWidth={2}
              />

              DO NOW

            </div>


            <div className="advice-main">


              <div>

                <h3>
                  Water your crop regularly
                </h3>

                <p>
                  Keep the soil moist,
                  especially during hot
                  and dry days.
                </p>

              </div>


              <span className="priority">
                HIGH
              </span>


            </div>

          </div>



          {/* FERTILIZER */}

          <div className="advice-card nutrient-card">


            <div className="advice-label">

              <FlaskConical
                size={14}
                strokeWidth={2}
              />

              FERTILIZER

            </div>


            <h3>
              Improve potassium
            </h3>


            <p>
              Potassium is low. Use a
              potassium-rich fertilizer
              as recommended.
            </p>


          </div>



          {/* WATCH */}

          <div className="advice-card watch-card">


            <div className="advice-label">

              <ShieldAlert
                size={14}
                strokeWidth={2}
              />

              WATCH

            </div>


            <h3>
              Check your crop regularly
            </h3>


            <p>
              Look for signs of water
              stress, pests or disease.
            </p>


          </div>



          {/* BOTTOM */}

          <div className="farmer-bottom">


            <div className="focus-icon">

              <ArrowUpRight
                size={16}
                strokeWidth={2}
              />

            </div>


            <div>

              <strong>
                Main focus
              </strong>

              <span>
                Water + Potassium +
                Regular monitoring
              </span>

            </div>


          </div>


        </div>

      )}


    </div>

  );
}


export default PredictionResult;