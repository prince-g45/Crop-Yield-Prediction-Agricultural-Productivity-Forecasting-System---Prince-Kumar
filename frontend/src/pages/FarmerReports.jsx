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
  ShieldCheck,
  FileBarChart,
  Filter,
  RefreshCw,
} from "lucide-react";

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
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
  const [selectedReport, setSelectedReport] = useState(null);

  const [reportType, setReportType] = useState("productivity");
  const [selectedCrop, setSelectedCrop] = useState("all");
  const [selectedSeason, setSelectedSeason] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");

  const [generatedReport, setGeneratedReport] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // =====================================================
  // LOAD PREDICTION HISTORY
  // =====================================================

  useEffect(() => {
    const loadReports = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getPredictionHistory();

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
        console.error("Unable to load reports:", err);

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
  // HELPERS
  // =====================================================

  const numberValue = (value, digits = 2) => {
    const number = Number(value);

    if (!Number.isFinite(number)) {
      return "--";
    }

    return number.toFixed(digits);
  };


  const numericValue = (value) => {
    const number = Number(value);

    return Number.isFinite(number) ? number : 0;
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


  const getPredictionId = (prediction, index) =>
    prediction?.id ??
    prediction?.prediction_id ??
    index;


  const getPredictionYear = (prediction) => {
    const possibleDate =
      prediction?.created_at ||
      prediction?.createdAt ||
      prediction?.date ||
      prediction?.prediction_date ||
      prediction?.year;

    if (
      possibleDate === null ||
      possibleDate === undefined ||
      possibleDate === ""
    ) {
      return "Unknown";
    }

    const date = new Date(possibleDate);

    if (!Number.isNaN(date.getTime())) {
      return String(date.getFullYear());
    }

    const yearMatch =
      String(possibleDate).match(/\b(20\d{2})\b/);

    return yearMatch
      ? yearMatch[1]
      : String(possibleDate);
  };


  const normalizeRisk = (risk) => {
    const value = String(risk || "Review")
      .trim()
      .toLowerCase();

    if (
      value === "low" ||
      value === "safe"
    ) {
      return "Low";
    }

    if (
      value === "medium" ||
      value === "moderate"
    ) {
      return "Medium";
    }

    if (
      value === "high" ||
      value === "critical"
    ) {
      return "High";
    }

    return "Review";
  };


  // =====================================================
  // PARSE AGRICULTURAL REPORT
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
  // FILTER OPTIONS
  // =====================================================

  const cropOptions = useMemo(() => {
    return [
      ...new Set(
        predictions
          .map((item) => item?.crop)
          .filter(Boolean)
          .map(String)
      ),
    ];
  }, [predictions]);


  const seasonOptions = useMemo(() => {
    return [
      ...new Set(
        predictions
          .map((item) => item?.season)
          .filter(Boolean)
          .map(String)
      ),
    ];
  }, [predictions]);


  const yearOptions = useMemo(() => {
    return [
      ...new Set(
        predictions
          .map(getPredictionYear)
          .filter(
            (year) =>
              year !== "Unknown" &&
              year !== ""
          )
      ),
    ].sort((a, b) => b.localeCompare(a));
  }, [predictions]);


  // =====================================================
  // FILTERED REPORT DATA
  // =====================================================

  const filteredPredictions = useMemo(() => {
    return predictions.filter((prediction) => {
      const crop =
        textValue(prediction?.crop, "");

      const season =
        textValue(prediction?.season, "");

      const year =
        getPredictionYear(prediction);

      const cropMatch =
        selectedCrop === "all" ||
        crop === selectedCrop;

      const seasonMatch =
        selectedSeason === "all" ||
        season === selectedSeason;

      const yearMatch =
        selectedYear === "all" ||
        year === selectedYear;

      return (
        cropMatch &&
        seasonMatch &&
        yearMatch
      );
    });
  }, [
    predictions,
    selectedCrop,
    selectedSeason,
    selectedYear,
  ]);


  // =====================================================
  // FILTER HANDLING
  // =====================================================

  const handleGenerateReport = () => {
    const firstMatch =
      filteredPredictions[0];

    if (firstMatch) {
      setSelectedReport(firstMatch);
    }

    setGeneratedReport(true);
  };


  const handleResetFilters = () => {
    setReportType("productivity");
    setSelectedCrop("all");
    setSelectedSeason("all");
    setSelectedYear("all");

    if (predictions.length > 0) {
      setSelectedReport(predictions[0]);
    }

    setGeneratedReport(false);
  };


  // =====================================================
  // PRODUCTIVITY SUMMARY
  // =====================================================

  const productivitySummary = useMemo(() => {
    const data =
      filteredPredictions.length > 0
        ? filteredPredictions
        : predictions;

    const totalProduction = data.reduce(
      (sum, item) =>
        sum +
        numericValue(
          item?.estimated_production
        ),
      0
    );

    const totalYield = data.reduce(
      (sum, item) =>
        sum +
        numericValue(
          item?.predicted_yield
        ),
      0
    );

    const totalArea = data.reduce(
      (sum, item) =>
        sum +
        numericValue(item?.area),
      0
    );

    const averageYield =
      data.length > 0
        ? totalYield / data.length
        : 0;

    const cropProduction = {};

    data.forEach((item) => {
      const crop =
        textValue(
          item?.crop,
          "Unknown"
        );

      cropProduction[crop] =
        (cropProduction[crop] || 0) +
        numericValue(
          item?.estimated_production
        );
    });

    const topCrop = Object.entries(
      cropProduction
    ).sort(
      (a, b) => b[1] - a[1]
    )[0];

    return {
      totalProduction,
      averageYield,
      totalArea,
      topCrop: topCrop
        ? topCrop[0]
        : "--",
    };
  }, [
    filteredPredictions,
    predictions,
  ]);


  // =====================================================
  // CROP PRODUCTION PIE DATA
  // =====================================================

  const cropProductionData = useMemo(() => {
    const data =
      filteredPredictions.length > 0
        ? filteredPredictions
        : predictions;

    const grouped = {};

    data.forEach((item) => {
      const crop =
        textValue(
          item?.crop,
          "Unknown"
        );

      grouped[crop] =
        (grouped[crop] || 0) +
        numericValue(
          item?.estimated_production
        );
    });

    return Object.entries(grouped)
      .map(([crop, value]) => ({
        crop,
        value,
      }))
      .filter((item) => item.value > 0)
      .sort(
        (a, b) => b.value - a.value
      );
  }, [
    filteredPredictions,
    predictions,
  ]);


  // =====================================================
  // SEASON PRODUCTION PIE DATA
  // =====================================================

  const seasonProductionData = useMemo(() => {
    const data =
      filteredPredictions.length > 0
        ? filteredPredictions
        : predictions;

    const grouped = {};

    data.forEach((item) => {
      const season =
        textValue(
          item?.season,
          "Unknown"
        );

      grouped[season] =
        (grouped[season] || 0) +
        numericValue(
          item?.estimated_production
        );
    });

    return Object.entries(grouped)
      .map(([season, value]) => ({
        season,
        value,
      }))
      .filter((item) => item.value > 0)
      .sort(
        (a, b) => b.value - a.value
      );
  }, [
    filteredPredictions,
    predictions,
  ]);


  // =====================================================
  // CROP YIELD PIE DATA
  // =====================================================

  const cropYieldData = useMemo(() => {
    const data =
      filteredPredictions.length > 0
        ? filteredPredictions
        : predictions;

    const grouped = {};

    data.forEach((item) => {
      const crop =
        textValue(
          item?.crop,
          "Unknown"
        );

      if (!grouped[crop]) {
        grouped[crop] = {
          total: 0,
          count: 0,
        };
      }

      grouped[crop].total +=
        numericValue(
          item?.predicted_yield
        );

      grouped[crop].count += 1;
    });

    return Object.entries(grouped)
      .map(([crop, item]) => ({
        crop,
        value:
          item.count > 0
            ? item.total / item.count
            : 0,
      }))
      .filter((item) => item.value > 0)
      .sort(
        (a, b) => b.value - a.value
      );
  }, [
    filteredPredictions,
    predictions,
  ]);


  // =====================================================
  // SEASON PRODUCTIVITY BAR DATA
  // =====================================================

  const seasonProductivityData = useMemo(() => {
    const data =
      filteredPredictions.length > 0
        ? filteredPredictions
        : predictions;

    const grouped = {};

    data.forEach((item) => {
      const season =
        textValue(
          item?.season,
          "Unknown"
        );

      if (!grouped[season]) {
        grouped[season] = {
          yieldTotal: 0,
          productionTotal: 0,
          count: 0,
        };
      }

      grouped[season].yieldTotal +=
        numericValue(
          item?.predicted_yield
        );

      grouped[season].productionTotal +=
        numericValue(
          item?.estimated_production
        );

      grouped[season].count += 1;
    });

    return Object.entries(grouped)
      .map(([season, item]) => ({
        season,
        yield:
          item.count > 0
            ? item.yieldTotal / item.count
            : 0,
        production:
          item.productionTotal,
      }))
      .sort(
        (a, b) =>
          b.production - a.production
      );
  }, [
    filteredPredictions,
    predictions,
  ]);


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
          numericValue(
            selectedReport.N
          ),
      },
      {
        nutrient: "Phosphorus",
        short: "P",
        value:
          numericValue(
            selectedReport.P
          ),
      },
      {
        nutrient: "Potassium",
        short: "K",
        value:
          numericValue(
            selectedReport.K
          ),
      },
    ];
  }, [selectedReport]);


  // =====================================================
  // RISK ASSESSMENT
  // =====================================================

  const riskAssessment =
    selectedReport?.risk_assessment ||
    null;

  const overallRisk =
    normalizeRisk(
      riskAssessment?.level
    );

  const riskScore = Math.min(
    100,
    Math.max(
      0,
      numericValue(
        riskAssessment?.score
      )
    )
  );


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
        {label && (
          <strong>{label}</strong>
        )}

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
  // PIE COLORS
  // =====================================================

  const pieColors = [
    "#2e7d32",
    "#66a86b",
    "#4f7cac",
    "#d59b36",
    "#6b7280",
    "#8b5e83",
  ];


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="reports-page">
        <Navbar />

        <main className="reports-container">
          <div className="reports-loading">
            <div className="loading-spinner" />

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

            <p>{error}</p>
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
                Productivity & Seasonal Reports
              </h1>

              <p>
                Generate clear reports for crop
                productivity, seasonal performance,
                risk and recommendations.
              </p>
            </div>
          </section>

          <div className="empty-report">
            <Database size={42} />

            <h2>
              No Reports Yet
            </h2>

            <p>
              Make a crop yield prediction to
              generate your first agricultural report.
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

        {/* =================================================
            HEADER
        ================================================= */}

        <section className="reports-header">
          <div>
            <span className="reports-eyebrow">
              FARM REPORTS
            </span>

            <h1>
              Productivity & Seasonal Reports
            </h1>

            <p>
              Generate clear reports to understand
              crop productivity and seasonal performance.
            </p>
          </div>

          <div className="reports-count">
            <Database size={16} />

            <span>
              {predictions.length} records
            </span>
          </div>
        </section>


        {/* =================================================
            REPORT GENERATOR
        ================================================= */}

        <section className="report-generator">

          <div className="generator-heading">
            <div className="generator-heading-icon">
              <FileBarChart size={20} />
            </div>

            <div>
              <span className="section-label">
                REPORT GENERATOR
              </span>

              <h2>
                Generate a Report
              </h2>

              <p>
                Select the required filters and
                generate the report.
              </p>
            </div>
          </div>


          <div className="generator-grid">

            <div className="filter-field">
              <label htmlFor="report-type">
                Report Type
              </label>

              <select
                id="report-type"
                value={reportType}
                onChange={(event) =>
                  setReportType(
                    event.target.value
                  )
                }
              >
                <option value="productivity">
                  Productivity Report
                </option>

                <option value="seasonal">
                  Seasonal Report
                </option>
              </select>
            </div>


            <div className="filter-field">
              <label htmlFor="report-crop">
                Crop
              </label>

              <select
                id="report-crop"
                value={selectedCrop}
                onChange={(event) =>
                  setSelectedCrop(
                    event.target.value
                  )
                }
              >
                <option value="all">
                  All Crops
                </option>

                {cropOptions.map(
                  (crop) => (
                    <option
                      key={crop}
                      value={crop}
                    >
                      {crop}
                    </option>
                  )
                )}
              </select>
            </div>


            <div className="filter-field">
              <label htmlFor="report-season">
                Season
              </label>

              <select
                id="report-season"
                value={selectedSeason}
                onChange={(event) =>
                  setSelectedSeason(
                    event.target.value
                  )
                }
              >
                <option value="all">
                  All Seasons
                </option>

                {seasonOptions.map(
                  (season) => (
                    <option
                      key={season}
                      value={season}
                    >
                      {season}
                    </option>
                  )
                )}
              </select>
            </div>


            <div className="filter-field">
              <label htmlFor="report-year">
                Year
              </label>

              <select
                id="report-year"
                value={selectedYear}
                onChange={(event) =>
                  setSelectedYear(
                    event.target.value
                  )
                }
              >
                <option value="all">
                  All Years
                </option>

                {yearOptions.map(
                  (year) => (
                    <option
                      key={year}
                      value={year}
                    >
                      {year}
                    </option>
                  )
                )}
              </select>
            </div>

          </div>


          <div className="generator-actions">

            <button
              type="button"
              className="generate-button"
              onClick={handleGenerateReport}
            >
              <FileBarChart size={17} />
              Generate Report
            </button>

            <button
              type="button"
              className="reset-button"
              onClick={handleResetFilters}
            >
              <RefreshCw size={15} />
              Reset
            </button>

          </div>

        </section>


        {/* =================================================
            GENERATED REPORT STATUS
        ================================================= */}

        <section className="report-status-bar">

          <div>
            <Filter size={16} />

            <span>
              {reportType === "productivity"
                ? "Productivity Report"
                : "Seasonal Report"}
            </span>
          </div>

          <span>
            {filteredPredictions.length} matching
            records
          </span>

        </section>


        {/* =================================================
            REPORT TITLE
        ================================================= */}

        <section className="report-title">

          <div className="report-title-info">

            <span className="section-label">
              GENERATED REPORT
            </span>

            <h2>
              {reportType === "productivity"
                ? "Productivity Performance"
                : "Seasonal Performance"}
            </h2>

            <p>
              {selectedReport
                ? `${textValue(
                    selectedReport.crop,
                    "Crop"
                  )} · ${textValue(
                    selectedReport.season,
                    "Season"
                  )} · ${textValue(
                    selectedReport.farm_name,
                    "Farm"
                  )}`
                : "Agricultural performance report"}
            </p>

          </div>


          <div className="report-date">
            <span>
              Report Records
            </span>

            <strong>
              {filteredPredictions.length}
            </strong>
          </div>

        </section>


        {/* =================================================
            KPI
        ================================================= */}

        <section className="report-overview">

          <div className="overview-card">

            <div className="overview-icon">
              <Target size={19} />
            </div>

            <div>
              <span>
                Total Production
              </span>

              <strong>
                {numberValue(
                  productivitySummary.totalProduction
                )}
              </strong>

              <small>
                estimated tonnes
              </small>
            </div>

          </div>


          <div className="overview-card">

            <div className="overview-icon">
              <BarChart3 size={19} />
            </div>

            <div>
              <span>
                Average Yield
              </span>

              <strong>
                {numberValue(
                  productivitySummary.averageYield
                )}
              </strong>

              <small>
                tonnes / hectare
              </small>
            </div>

          </div>


          <div className="overview-card">

            <div className="overview-icon">
              <Sprout size={19} />
            </div>

            <div>
              <span>
                Total Farm Area
              </span>

              <strong>
                {numberValue(
                  productivitySummary.totalArea
                )}
              </strong>

              <small>
                hectares
              </small>
            </div>

          </div>


          <div className="overview-card">

            <div className="overview-icon">
              <ShieldCheck size={19} />
            </div>

            <div>
              <span>
                Top Performing Crop
              </span>

              <strong className="overview-text">
                {productivitySummary.topCrop}
              </strong>

              <small>
                production contribution
              </small>
            </div>

          </div>

        </section>


        {/* =================================================
            PIE CHART ROW
        ================================================= */}

        <section className="chart-grid-three">

          {/* CROP PRODUCTION */}

          <section className="report-card chart-card">

            <div className="report-card-heading">
              <div>
                <span className="section-label">
                  PRODUCTIVITY
                </span>

                <h3>
                  Crop Production Share
                </h3>

                <p>
                  Production contribution by crop.
                </p>
              </div>
            </div>


            <div className="pie-chart-wrap">

              {cropProductionData.length > 0 ? (
                <>
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <PieChart>
                      <Pie
                        data={
                          cropProductionData
                        }
                        dataKey="value"
                        nameKey="crop"
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={88}
                        paddingAngle={3}
                        cornerRadius={4}
                      >
                        {cropProductionData.map(
                          (item, index) => (
                            <Cell
                              key={item.crop}
                              fill={
                                pieColors[
                                  index %
                                    pieColors.length
                                ]
                              }
                            />
                          )
                        )}
                      </Pie>

                      <Tooltip
                        content={
                          <ChartTooltip />
                        }
                      />

                      <Legend
                        verticalAlign="bottom"
                        height={32}
                        wrapperStyle={{
                          fontSize: "11px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="pie-center">
                    <span>
                      TOTAL
                    </span>

                    <strong>
                      {numberValue(
                        productivitySummary.totalProduction,
                        1
                      )}
                    </strong>

                    <small>
                      tonnes
                    </small>
                  </div>
                </>
              ) : (
                <div className="chart-empty">
                  No production data
                </div>
              )}

            </div>

          </section>


          {/* SEASON PRODUCTION */}

          <section className="report-card chart-card">

            <div className="report-card-heading">
              <div>
                <span className="section-label">
                  SEASONAL
                </span>

                <h3>
                  Season Production Share
                </h3>

                <p>
                  Production contribution by season.
                </p>
              </div>
            </div>


            <div className="pie-chart-wrap">

              {seasonProductionData.length > 0 ? (
                <>
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <PieChart>
                      <Pie
                        data={
                          seasonProductionData
                        }
                        dataKey="value"
                        nameKey="season"
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={88}
                        paddingAngle={3}
                        cornerRadius={4}
                      >
                        {seasonProductionData.map(
                          (item, index) => (
                            <Cell
                              key={item.season}
                              fill={
                                pieColors[
                                  index %
                                    pieColors.length
                                ]
                              }
                            />
                          )
                        )}
                      </Pie>

                      <Tooltip
                        content={
                          <ChartTooltip />
                        }
                      />

                      <Legend
                        verticalAlign="bottom"
                        height={32}
                        wrapperStyle={{
                          fontSize: "11px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="pie-center">
                    <span>
                      SEASONS
                    </span>

                    <strong>
                      {seasonProductionData.length}
                    </strong>

                    <small>
                      analysed
                    </small>
                  </div>
                </>
              ) : (
                <div className="chart-empty">
                  No seasonal data
                </div>
              )}

            </div>

          </section>


          {/* CROP YIELD */}

          <section className="report-card chart-card">

            <div className="report-card-heading">
              <div>
                <span className="section-label">
                  YIELD
                </span>

                <h3>
                  Crop Yield Distribution
                </h3>

                <p>
                  Average yield by crop.
                </p>
              </div>
            </div>


            <div className="pie-chart-wrap">

              {cropYieldData.length > 0 ? (
                <>
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <PieChart>
                      <Pie
                        data={cropYieldData}
                        dataKey="value"
                        nameKey="crop"
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={88}
                        paddingAngle={3}
                        cornerRadius={4}
                      >
                        {cropYieldData.map(
                          (item, index) => (
                            <Cell
                              key={item.crop}
                              fill={
                                pieColors[
                                  index %
                                    pieColors.length
                                ]
                              }
                            />
                          )
                        )}
                      </Pie>

                      <Tooltip
                        content={
                          <ChartTooltip />
                        }
                      />

                      <Legend
                        verticalAlign="bottom"
                        height={32}
                        wrapperStyle={{
                          fontSize: "11px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="pie-center">
                    <span>
                      AVERAGE
                    </span>

                    <strong>
                      {numberValue(
                        productivitySummary.averageYield,
                        1
                      )}
                    </strong>

                    <small>
                      t/ha
                    </small>
                  </div>
                </>
              ) : (
                <div className="chart-empty">
                  No yield data
                </div>
              )}

            </div>

          </section>

        </section>


        {/* =================================================
            SEASONAL BAR CHART
        ================================================= */}

        <section className="report-card">

          <div className="report-card-heading">

            <div>
              <span className="section-label">
                SEASONAL ANALYSIS
              </span>

              <h3>
                Season Productivity Comparison
              </h3>

              <p>
                Compare estimated production across
                available seasons.
              </p>
            </div>

            <span className="chart-unit">
              Production
            </span>

          </div>


          <div className="large-chart">

            {seasonProductivityData.length > 0 ? (
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart
                  data={
                    seasonProductivityData
                  }
                  margin={{
                    top: 15,
                    right: 20,
                    left: 0,
                    bottom: 10,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e5ebe6"
                  />

                  <XAxis
                    dataKey="season"
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
                    dataKey="production"
                    name="Production"
                    fill="#2e7d32"
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
            ) : (
              <div className="chart-empty">
                No seasonal comparison data
              </div>
            )}

          </div>

        </section>


        {/* =================================================
            CURRENT REPORT DETAILS
        ================================================= */}

        {selectedReport && (
          <section className="detail-grid">

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
                    Current report weather indicators.
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
                    Soil Nutrient Profile
                  </h3>

                  <p>
                    Available soil nutrient values.
                  </p>
                </div>

              </div>


              <div className="soil-profile">

                <div className="soil-pie">

                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <PieChart>
                      <Pie
                        data={soilData}
                        dataKey="value"
                        nameKey="nutrient"
                        cx="50%"
                        cy="50%"
                        innerRadius={48}
                        outerRadius={76}
                        paddingAngle={4}
                      >
                        {soilData.map(
                          (soil, index) => (
                            <Cell
                              key={soil.short}
                              fill={
                                pieColors[
                                  index
                                ]
                              }
                            />
                          )
                        )}
                      </Pie>

                      <Tooltip
                        content={
                          <ChartTooltip />
                        }
                      />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="soil-pie-center">
                    <span>
                      SOIL
                    </span>

                    <strong>
                      Profile
                    </strong>
                  </div>

                </div>


                <div className="soil-list">

                  {soilData.map(
                    (soil, index) => (
                      <div
                        className="soil-list-item"
                        key={soil.short}
                      >

                        <span
                          className="soil-dot"
                          style={{
                            background:
                              pieColors[
                                index
                              ],
                          }}
                        />

                        <div>
                          <span>
                            {soil.nutrient}
                          </span>

                          <strong>
                            {numberValue(
                              soil.value
                            )}
                          </strong>
                        </div>

                      </div>
                    )
                  )}

                </div>

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

          </section>
        )}


        {/* =================================================
            RISK ASSESSMENT
        ================================================= */}

        {selectedReport && (
          <section className="report-card risk-section">

            <div className="risk-heading">

              <div className="risk-heading-left">

                <div className="risk-heading-icon">
                  <TriangleAlert size={21} />
                </div>

                <div>
                  <span className="section-label">
                    RISK ASSESSMENT
                  </span>

                  <h3>
                    Farm Risk Status
                  </h3>

                  <p>
                    Assessment based on the available
                    farm, soil and environmental data.
                  </p>
                </div>

              </div>


              <div
                className={`overall-risk ${overallRisk.toLowerCase()}`}
              >
                <span>
                  Overall Risk
                </span>

                <strong>
                  {overallRisk}
                </strong>
              </div>

            </div>


            <div className="risk-main-grid">

              {/* SCORE */}

              <div className="risk-score-card">

                <div className="risk-score-header">

                  <div>
                    <span>
                      Risk Score
                    </span>

                    <small>
                      Current assessment
                    </small>
                  </div>

                  <strong>
                    {riskAssessment?.score ??
                      "--"}
                    <small>
                      {" "} / 100
                    </small>
                  </strong>

                </div>


                <div className="risk-score-track">

                  <div
                    className={`risk-score-fill ${overallRisk.toLowerCase()}`}
                    style={{
                      width: `${riskScore}%`,
                    }}
                  />

                </div>


                <div className="risk-score-scale">
                  <span>
                    Low
                  </span>

                  <span>
                    Moderate
                  </span>

                  <span>
                    High
                  </span>
                </div>

              </div>


              {/* RISK SUMMARY */}

              <div className="risk-summary-card">

                <div className="risk-summary-icon">
                  <ShieldCheck size={22} />
                </div>

                <div>
                  <span>
                    Assessment
                  </span>

                  <strong>
                    {overallRisk} Risk
                  </strong>

                  <p>
                    Review the listed factors before
                    making major farming decisions.
                  </p>
                </div>

              </div>

            </div>


            {/* RISK FACTORS */}

            {riskAssessment?.factors?.length >
              0 && (
              <div className="risk-factors">

                <div className="risk-factors-heading">
                  <h4>
                    Risk Factors
                  </h4>

                  <span>
                    {riskAssessment.factors.length}
                    {" "}identified
                  </span>
                </div>


                <div className="risk-factor-grid">

                  {riskAssessment.factors.map(
                    (factor, index) => (
                      <div
                        className="risk-factor"
                        key={index}
                      >

                        <div className="factor-number">
                          {String(
                            index + 1
                          ).padStart(2, "0")}
                        </div>

                        <span>
                          {factor}
                        </span>

                      </div>
                    )
                  )}

                </div>

              </div>
            )}


            <div className="risk-legend">

              <span>
                <i className="risk-dot low-dot" />
                Low
              </span>

              <span>
                <i className="risk-dot medium-dot" />
                Moderate
              </span>

              <span>
                <i className="risk-dot high-dot" />
                High
              </span>

            </div>

          </section>
        )}


        {/* =================================================
            RECOMMENDATIONS
        ================================================= */}

        {recommendations.length > 0 && (
          <section className="report-card recommendations-section">

            <div className="recommendations-heading">

              <div>
                <span className="section-label">
                  RECOMMENDATIONS
                </span>

                <h3>
                  Recommended Actions
                </h3>

                <p>
                  Simple actions based on the generated
                  agricultural report.
                </p>
              </div>

              <span className="recommendation-count">
                {recommendations.length} actions
              </span>

            </div>


            <div className="recommendation-grid">

              {recommendations.map(
                (recommendation, index) => (
                  <article
                    className="recommendation-card"
                    key={
                      recommendation.title
                    }
                  >

                    <div className="recommendation-number">
                      {String(
                        index + 1
                      ).padStart(2, "0")}
                    </div>


                    <div className="recommendation-content">

                      <h4>
                        {recommendation.title}
                      </h4>

                      <p>
                        {recommendation.value}
                      </p>

                    </div>

                  </article>
                )
              )}

            </div>

          </section>
        )}


        {/* =================================================
            FINAL SUMMARY
        ================================================= */}

        <section className="report-summary">

          <div className="summary-heading">

            <div>
              <span className="section-label">
                REPORT SUMMARY
              </span>

              <h3>
                Agricultural Performance Summary
              </h3>
            </div>

            <CalendarDays size={20} />

          </div>


          <div className="summary-grid-report">

            <div>
              <span>
                Crop
              </span>

              <strong>
                {textValue(
                  selectedReport?.crop
                )}
              </strong>
            </div>


            <div>
              <span>
                Season
              </span>

              <strong>
                {textValue(
                  selectedReport?.season
                )}
              </strong>
            </div>


            <div>
              <span>
                Expected Yield
              </span>

              <strong>
                {numberValue(
                  selectedReport?.predicted_yield
                )}{" "}
                t/ha
              </strong>
            </div>


            <div>
              <span>
                Overall Risk
              </span>

              <strong
                className={`summary-risk-value ${overallRisk.toLowerCase()}`}
              >
                {overallRisk}
              </strong>
            </div>

          </div>


          {(report?.summary ||
            report?.overall_summary ||
            report?.final_summary) && (
            <p className="report-final-text">
              {report.summary ||
                report.overall_summary ||
                report.final_summary}
            </p>
          )}

        </section>

      </main>

      <Footer />
    </div>
  );
}


export default FarmerReports;