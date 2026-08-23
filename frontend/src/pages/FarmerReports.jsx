import { useEffect, useMemo, useState } from "react";

import {
  BarChart3,
  CalendarDays,
  Database,
  Droplets,
  Sprout,
  Target,
  Thermometer,
  TriangleAlert,
  Wind,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {
  getPredictionHistory,
} from "../services/predictionService";

import "../styles/FarmerReports.css";


function FarmerReports() {

  // =====================================================
  // STATE
  // =====================================================

  const [predictions, setPredictions] = useState([]);

  const [selectedReport, setSelectedReport] =
    useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // =====================================================
  // LOAD HISTORY
  // =====================================================

  useEffect(() => {

    const loadReports = async () => {

      try {

        setLoading(true);
        setError("");

        const data =
          await getPredictionHistory();

        const safeData = Array.isArray(data)
          ? data
          : Array.isArray(data?.predictions)
          ? data.predictions
          : Array.isArray(data?.history)
          ? data.history
          : [];

        setPredictions(safeData);

        if (safeData.length > 0) {
          setSelectedReport(safeData[0]);
        }

      } catch (err) {

        console.error(
          "Unable to load reports:",
          err
        );

        setError(
          "Unable to load agricultural reports."
        );

      } finally {

        setLoading(false);

      }

    };

    loadReports();

  }, []);


  // =====================================================
  // PARSE REPORT
  // =====================================================

  const parseReport = (prediction) => {

    if (
      !prediction ||
      !prediction.agricultural_report
    ) {
      return null;
    }

    try {

      if (
        typeof prediction.agricultural_report ===
        "object"
      ) {
        return prediction.agricultural_report;
      }

      return JSON.parse(
        prediction.agricultural_report
      );

    } catch (err) {

      console.error(
        "Unable to parse agricultural report:",
        err
      );

      return null;

    }

  };


  const report = useMemo(
    () => parseReport(selectedReport),
    [selectedReport]
  );


  // =====================================================
  // HELPERS
  // =====================================================

  const numberValue = (
    value,
    digits = 2
  ) => {

    const number = Number(value);

    if (!Number.isFinite(number)) {
      return "--";
    }

    return number.toFixed(digits);

  };


  const textValue = (
    value,
    fallback = "Not available"
  ) => {

    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return fallback;
    }

    return String(value);

  };


  // =====================================================
  // YIELD / PRODUCTION DATA
  // =====================================================

  const yieldData = useMemo(() => {

    if (!selectedReport) {
      return [];
    }

    return [

      {
        metric: "Yield",
        value:
          Number(
            selectedReport.predicted_yield
          ) || 0,
        unit: "t/ha",
      },

      {
        metric: "Production",
        value:
          Number(
            selectedReport.estimated_production
          ) || 0,
        unit: "tonnes",
      },

    ];

  }, [selectedReport]);


  // =====================================================
  // SOIL DATA
  // =====================================================

  const soilData = useMemo(() => {

    if (!selectedReport) {
      return [];
    }

    return [

      {
        nutrient: "Nitrogen",
        short: "N",
        value:
          Number(selectedReport.N) || 0,
      },

      {
        nutrient: "Phosphorus",
        short: "P",
        value:
          Number(selectedReport.P) || 0,
      },

      {
        nutrient: "Potassium",
        short: "K",
        value:
          Number(selectedReport.K) || 0,
      },

    ];

  }, [selectedReport]);


  // =====================================================
  // WEATHER
  // =====================================================

  const weatherMetrics = useMemo(() => {

    const weather =
      selectedReport?.weather_analysis;

    if (!weather) {
      return [];
    }

    return [

      {
        label: "Temperature",
        value:
          weather.average_temperature_c !==
            null &&
          weather.average_temperature_c !==
            undefined
            ? numberValue(
                weather.average_temperature_c
              )
            : "--",
        unit: "°C",
      },

      {
        label: "Rainfall",
        value:
          weather.average_rainfall_mm !==
            null &&
          weather.average_rainfall_mm !==
            undefined
            ? numberValue(
                weather.average_rainfall_mm
              )
            : "--",
        unit: "mm",
      },

      {
        label: "Humidity",
        value:
          weather.average_humidity_percent !==
            null &&
          weather.average_humidity_percent !==
            undefined
            ? numberValue(
                weather.average_humidity_percent
              )
            : "--",
        unit: "%",
      },

    ];

  }, [selectedReport]);


  // =====================================================
  // RISK CLASSIFICATION
  // =====================================================

  const getRiskLevel = (text) => {

    if (!text) {
      return "Review";
    }

    const value =
      String(text).toLowerCase();


    if (
      value.includes("high risk") ||
      value.includes("high")
    ) {
      return "High";
    }


    if (
      value.includes("moderate risk") ||
      value.includes("medium risk") ||
      value.includes("moderate") ||
      value.includes("medium")
    ) {
      return "Medium";
    }


    if (
      value.includes("low risk") ||
      value.includes("low")
    ) {
      return "Low";
    }


    return "Review";

  };


  const pestRisk =
    getRiskLevel(
      report?.pest_risk
    );

  const weatherRisk =
    getRiskLevel(
      report?.weather_risk
    );

  const soilRisk =
    getRiskLevel(
      report?.soil_risk
    );


  // =====================================================
  // OVERALL RISK
  // =====================================================

  const overallRisk = useMemo(() => {

    const risks = [
      pestRisk,
      weatherRisk,
      soilRisk,
    ];


    if (risks.includes("High")) {
      return "High";
    }


    if (risks.includes("Medium")) {
      return "Medium";
    }


    if (
      risks.length > 0 &&
      risks.every(
        (risk) => risk === "Low"
      )
    ) {
      return "Low";
    }


    return "Review";

  }, [
    pestRisk,
    weatherRisk,
    soilRisk,
  ]);


  // =====================================================
  // RECOMMENDATIONS
  // =====================================================

  const recommendations = useMemo(() => {

    if (!report) {
      return [];
    }

    const result = [];


    const addRecommendation = (
      title,
      value
    ) => {

      if (
        value !== null &&
        value !== undefined &&
        String(value).trim() !== ""
      ) {

        result.push({
          title,
          value: String(value),
        });

      }

    };


    addRecommendation(
      "Crop Recommendation",
      report.recommended_crop ||
      report.crop_recommendation ||
      report.best_crop
    );


    addRecommendation(
      "Fertilizer Advice",
      report.fertilizer_recommendation ||
      report.fertilizer_advice
    );


    addRecommendation(
      "Irrigation Advice",
      report.irrigation_recommendation ||
      report.irrigation_advice
    );


    addRecommendation(
      "Pest Management",
      report.pest_recommendation ||
      report.pest_management
    );


    addRecommendation(
      "Weather Guidance",
      report.weather_recommendation ||
      report.weather_advice
    );


    addRecommendation(
      "Optimization Advice",
      report.optimization_advice ||
      report.productivity_advice
    );


    return result;

  }, [report]);


  // =====================================================
  // TOOLTIP
  // =====================================================

  const ChartTooltip = ({
    active,
    payload,
    label,
  }) => {

    if (
      !active ||
      !payload ||
      !payload.length
    ) {
      return null;
    }


    return (

      <div className="report-chart-tooltip">

        <strong>
          {label}
        </strong>

        {payload.map(
          (item, index) => (

            <div
              key={index}
              className="tooltip-row"
            >

              <span>
                {item.name}
              </span>

              <strong>
                {numberValue(
                  item.value
                )}
              </strong>

            </div>

          )
        )}

      </div>

    );

  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="reports-page">

        <Navbar />

        <main className="reports-container">

          <div className="reports-loading">

            <div className="loading-spinner"></div>

            <p>
              Loading agricultural reports...
            </p>

          </div>

        </main>

        <Footer />

      </div>

    );

  }


  // =====================================================
  // ERROR
  // =====================================================

  if (error) {

    return (

      <div className="reports-page">

        <Navbar />

        <main className="reports-container">

          <div className="empty-report">

            <BarChart3 size={42} />

            <h2>
              Reports unavailable
            </h2>

            <p>
              {error}
            </p>

          </div>

        </main>

        <Footer />

      </div>

    );

  }


  // =====================================================
  // EMPTY
  // =====================================================

  if (!predictions.length) {

    return (

      <div className="reports-page">

        <Navbar />

        <main className="reports-container">

          <section className="reports-header">

            <div>

              <span className="reports-eyebrow">
                FARM REPORTS
              </span>

              <h1>
                Agricultural Reports
              </h1>

              <p>
                View crop performance, soil,
                weather, risk and recommendations.
              </p>

            </div>

          </section>


          <div className="empty-report">

            <Database size={42} />

            <h2>
              No Reports Yet
            </h2>

            <p>
              Make a crop yield prediction
              to generate your first report.
            </p>

          </div>

        </main>

        <Footer />

      </div>

    );

  }


  // =====================================================
  // MAIN
  // =====================================================

  return (

    <div className="reports-page">

      <Navbar />


      <main className="reports-container">


        {/* HEADER */}

        <section className="reports-header">

          <div>

            <span className="reports-eyebrow">
              FARM REPORTS
            </span>

            <h1>
              Agricultural Reports
            </h1>

            <p>
              A clear summary of crop yield,
              production, soil, weather and risk.
            </p>

          </div>


          <div className="reports-count">

            <Database size={17} />

            <span>
              {predictions.length} reports
            </span>

          </div>

        </section>


        {/* SELECTOR */}

        <section className="report-selector">

          <div className="selector-header">

            <span className="section-label">
              REPORT HISTORY
            </span>

            <h2>
              Select Prediction
            </h2>

            <p>
              Select a prediction to view
              its detailed report.
            </p>

          </div>


          <div className="prediction-list">

            {predictions.map(
              (prediction, index) => (

                <button
                  key={
                    prediction.id ??
                    prediction.prediction_id ??
                    index
                  }
                  type="button"
                  className={
                    `prediction-item ${
                      selectedReport ===
                      prediction
                        ? "selected"
                        : ""
                    }`
                  }
                  onClick={() =>
                    setSelectedReport(
                      prediction
                    )
                  }
                >

                  <div className="prediction-item-main">

                    <strong>
                      {textValue(
                        prediction.crop,
                        "Crop"
                      )}
                    </strong>

                    <span>
                      {textValue(
                        prediction.farm_name,
                        "Farm"
                      )}
                    </span>

                  </div>


                  <div className="prediction-item-details">

                    <span>
                      {textValue(
                        prediction.season,
                        "Season"
                      )}
                    </span>

                    <strong>
                      {numberValue(
                        prediction.predicted_yield
                      )}{" "}
                      t/ha
                    </strong>

                  </div>

                </button>

              )
            )}

          </div>

        </section>


        {/* REPORT */}

        {report ? (

          <section className="report-content">


            {/* REPORT HEADER */}

            <section className="report-title">

              <div className="report-title-info">

                <span className="section-label">
                  AGRICULTURAL REPORT
                </span>

                <h2>
                  {textValue(
                    selectedReport.crop,
                    "Crop"
                  )}{" "}
                  Performance
                </h2>

                <p>
                  {textValue(
                    selectedReport.season,
                    "Season"
                  )}
                  {" · "}
                  {textValue(
                    selectedReport.state,
                    "Location"
                  )}
                </p>

              </div>


              <div className="report-date">

                <span>
                  Farm
                </span>

                <strong>
                  {textValue(
                    selectedReport.farm_name
                  )}
                </strong>

              </div>

            </section>


            {/* KPI */}

            <section className="report-overview">


              <div className="overview-card">

                <div className="overview-icon">
                  <TrendingUpIcon />
                </div>

                <div>

                  <span>
                    Predicted Yield
                  </span>

                  <strong>
                    {numberValue(
                      selectedReport.predicted_yield
                    )}
                  </strong>

                  <small>
                    tonnes / hectare
                  </small>

                </div>

              </div>


              <div className="overview-card">

                <div className="overview-icon">
                  <Target size={19} />
                </div>

                <div>

                  <span>
                    Production
                  </span>

                  <strong>
                    {numberValue(
                      selectedReport.estimated_production
                    )}
                  </strong>

                  <small>
                    estimated tonnes
                  </small>

                </div>

              </div>


              <div className="overview-card">

                <div className="overview-icon">
                  <Sprout size={19} />
                </div>

                <div>

                  <span>
                    Farm Area
                  </span>

                  <strong>
                    {numberValue(
                      selectedReport.area
                    )}
                  </strong>

                  <small>
                    hectares
                  </small>

                </div>

              </div>


              <div
                className={
                  `overview-card risk-overview ${
                    overallRisk.toLowerCase()
                  }`
                }
              >

                <div className="overview-icon">
                  <TriangleAlert size={19} />
                </div>

                <div>

                  <span>
                    Overall Risk
                  </span>

                  <strong>
                    {overallRisk}
                  </strong>

                  <small>
                    current assessment
                  </small>

                </div>

              </div>


            </section>


            {/* YIELD CHART */}

            <section className="report-card">

              <div className="report-card-heading">

                <div>

                  <span className="section-label">
                    PRODUCTIVITY
                  </span>

                  <h3>
                    Yield & Production
                  </h3>

                  <p>
                    Expected output for this farm.
                  </p>

                </div>

                <span className="chart-unit">
                  Current prediction
                </span>

              </div>


              <div className="chart-explanation">

                <div>

                  <span>
                    Yield
                  </span>

                  <strong>
                    {numberValue(
                      selectedReport.predicted_yield
                    )}{" "}
                    t/ha
                  </strong>

                  <small>
                    Expected output per hectare
                  </small>

                </div>


                <div>

                  <span>
                    Production
                  </span>

                  <strong>
                    {numberValue(
                      selectedReport.estimated_production
                    )}{" "}
                    tonnes
                  </strong>

                  <small>
                    Expected total farm output
                  </small>

                </div>

              </div>


              <div className="chart-container yield-chart">

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <BarChart
                    data={yieldData}
                    margin={{
                      top: 20,
                      right: 25,
                      left: 10,
                      bottom: 15,
                    }}
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#e5ebe6"
                    />

                    <XAxis
                      dataKey="metric"
                      tick={{
                        fontSize: 12,
                        fill: "#536158",
                      }}
                      axisLine={{
                        stroke: "#dce4de",
                      }}
                      tickLine={false}
                    />

                    <YAxis
                      tick={{
                        fontSize: 11,
                        fill: "#68736c",
                      }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <Tooltip
                      content={
                        <ChartTooltip />
                      }
                    />

                    <Bar
                      dataKey="value"
                      name="Value"
                      radius={[
                        7,
                        7,
                        0,
                        0,
                      ]}
                      barSize={70}
                    >

                      <Cell
                        fill="#2e7d32"
                      />

                      <Cell
                        fill="#65a56d"
                      />

                    </Bar>

                  </BarChart>

                </ResponsiveContainer>

              </div>

            </section>


            {/* WEATHER */}

            <section className="report-card">

              <div className="report-card-heading">

                <div>

                  <span className="section-label">
                    ENVIRONMENT
                  </span>

                  <h3>
                    Weather Conditions
                  </h3>

                  <p>
                    Average conditions associated
                    with this prediction.
                  </p>

                </div>

              </div>


              <div className="weather-metrics">


                <div className="weather-metric">

                  <div className="weather-icon">
                    <Thermometer size={18} />
                  </div>

                  <span>
                    Temperature
                  </span>

                  <strong>
                    {weatherMetrics[0]?.value ??
                      "--"}{" "}
                    °C
                  </strong>

                </div>


                <div className="weather-metric">

                  <div className="weather-icon">
                    <Droplets size={18} />
                  </div>

                  <span>
                    Rainfall
                  </span>

                  <strong>
                    {weatherMetrics[1]?.value ??
                      "--"}{" "}
                    mm
                  </strong>

                </div>


                <div className="weather-metric">

                  <div className="weather-icon">
                    <Wind size={18} />
                  </div>

                  <span>
                    Humidity
                  </span>

                  <strong>
                    {weatherMetrics[2]?.value ??
                      "--"}{" "}
                    %
                  </strong>

                </div>


              </div>

            </section>


            {/* SOIL */}

            <section className="report-card">

              <div className="report-card-heading">

                <div>

                  <span className="section-label">
                    SOIL
                  </span>

                  <h3>
                    Soil Nutrient Analysis
                  </h3>

                  <p>
                    Available nitrogen,
                    phosphorus and potassium.
                  </p>

                </div>

              </div>


              <div className="chart-container soil-chart">

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <BarChart
                    data={soilData}
                    margin={{
                      top: 15,
                      right: 20,
                      left: 10,
                      bottom: 10,
                    }}
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#e5ebe6"
                    />

                    <XAxis
                      dataKey="short"
                      tick={{
                        fontSize: 13,
                        fontWeight: 700,
                        fill: "#435147",
                      }}
                      axisLine={{
                        stroke: "#dce4de",
                      }}
                      tickLine={false}
                    />

                    <YAxis
                      tick={{
                        fontSize: 11,
                        fill: "#68736c",
                      }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <Tooltip
                      content={
                        <ChartTooltip />
                      }
                    />

                    <Bar
                      dataKey="value"
                      name="Value"
                      fill="#4f9159"
                      radius={[
                        7,
                        7,
                        0,
                        0,
                      ]}
                      barSize={60}
                    />

                  </BarChart>

                </ResponsiveContainer>

              </div>


              <div className="soil-values">

                {soilData.map(
                  (soil) => (

                    <div
                      className="soil-value"
                      key={soil.short}
                    >

                      <span>
                        {soil.nutrient}
                      </span>

                      <strong>
                        {numberValue(
                          soil.value
                        )}
                      </strong>

                    </div>

                  )
                )}

              </div>


              <div className="soil-details">

                <div>

                  <span>
                    Soil pH
                  </span>

                  <strong>
                    {numberValue(
                      selectedReport.pH
                    )}
                  </strong>

                </div>


                <div>

                  <span>
                    Soil Health
                  </span>

                  <strong>
                    {textValue(
                      selectedReport.soil_health,
                      "Unknown"
                    )}
                  </strong>

                </div>

              </div>

            </section>


            {/* RISK */}

            <section className="report-card risk-section">

              <div className="report-card-heading">

                <div>

                  <span className="section-label">
                    RISK ASSESSMENT
                  </span>

                  <h3>
                    Farm Risk Status
                  </h3>

                  <p>
                    Current risk levels from the
                    agricultural report.
                  </p>

                </div>


                <div
                  className={
                    `overall-risk ${
                      overallRisk.toLowerCase()
                    }`
                  }
                >

                  <span>
                    Overall Risk
                  </span>

                  <strong>
                    {overallRisk}
                  </strong>

                </div>

              </div>


              <div className="risk-grid">


                <RiskCard
                  title="Pest Risk"
                  level={pestRisk}
                />


                <RiskCard
                  title="Weather Risk"
                  level={weatherRisk}
                />


                <RiskCard
                  title="Soil Risk"
                  level={soilRisk}
                />


              </div>


              <div className="risk-legend">

                <span>
                  <i className="risk-dot low-dot"></i>
                  Low
                </span>

                <span>
                  <i className="risk-dot medium-dot"></i>
                  Medium
                </span>

                <span>
                  <i className="risk-dot high-dot"></i>
                  High
                </span>

              </div>

            </section>


            {/* RECOMMENDATIONS */}

            {recommendations.length > 0 && (

              <section className="report-card">

                <div className="report-card-heading">

                  <div>

                    <span className="section-label">
                      DECISION SUPPORT
                    </span>

                    <h3>
                      Farming Recommendations
                    </h3>

                    <p>
                      Practical suggestions available
                      from the agricultural report.
                    </p>

                  </div>

                </div>


                <div className="recommendation-grid">

                  {recommendations.map(
                    (recommendation) => (

                      <article
                        className="recommendation-card"
                        key={
                          recommendation.title
                        }
                      >

                        <div className="recommendation-number">
                          {String(
                            recommendations.indexOf(
                              recommendation
                            ) + 1
                          ).padStart(2, "0")}
                        </div>

                        <div>

                          <h4>
                            {
                              recommendation.title
                            }
                          </h4>

                          <p>
                            {
                              recommendation.value
                            }
                          </p>

                        </div>

                      </article>

                    )
                  )}

                </div>

              </section>

            )}


            {/* FINAL SUMMARY */}

            <section className="report-summary">

              <span className="section-label">
                REPORT SUMMARY
              </span>

              <h3>
                Agricultural Assessment
              </h3>


              <div className="summary-grid-report">


                <div>

                  <span>
                    Crop
                  </span>

                  <strong>
                    {textValue(
                      selectedReport.crop
                    )}
                  </strong>

                </div>


                <div>

                  <span>
                    Expected Yield
                  </span>

                  <strong>
                    {numberValue(
                      selectedReport.predicted_yield
                    )}{" "}
                    t/ha
                  </strong>

                </div>


                <div>

                  <span>
                    Soil Status
                  </span>

                  <strong>
                    {textValue(
                      selectedReport.soil_health,
                      "Unknown"
                    )}
                  </strong>

                </div>


                <div
                  className={
                    `summary-risk ${
                      overallRisk.toLowerCase()
                    }`
                  }
                >

                  <span>
                    Overall Risk
                  </span>

                  <strong>
                    {overallRisk}
                  </strong>

                </div>


              </div>


              {(
                report.summary ||
                report.overall_summary ||
                report.final_summary
              ) && (

                <p className="report-final-text">

                  {report.summary ||
                    report.overall_summary ||
                    report.final_summary}

                </p>

              )}

            </section>


          </section>

        ) : (

          <div className="empty-report">

            <BarChart3 size={42} />

            <h2>
              Report Data Unavailable
            </h2>

            <p>
              The selected prediction does not
              contain a readable agricultural report.
            </p>

          </div>

        )}

      </main>


      <Footer />

    </div>

  );

}


/* =========================================================
   SMALL ICON COMPONENT
========================================================= */

function TrendingUpIcon() {

  return (
    <BarChart3 size={19} />
  );

}


/* =========================================================
   RISK CARD
========================================================= */

function RiskCard({
  title,
  level,
}) {

  return (

    <div
      className={
        `risk-card ${
          level.toLowerCase()
        }`
      }
    >

      <div className="risk-card-top">

        <span>
          {title}
        </span>

        <div className="risk-status-dot"></div>

      </div>


      <strong>
        {level}
      </strong>


      <small>

        {level === "Low" &&
          "Low level"}

        {level === "Medium" &&
          "Needs attention"}

        {level === "High" &&
          "Immediate attention"}

        {level === "Review" &&
          "Review required"}

      </small>

    </div>

  );

}


export default FarmerReports;