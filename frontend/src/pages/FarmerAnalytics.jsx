import { useEffect, useMemo, useState } from "react";

import {
  BarChart3,
  TrendingUp,
  Target,
  Database,
  CalendarDays,
  Sprout,
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

import "../styles/FarmerAnalytics.css";


function FarmerAnalytics() {

  // =========================================================
  // STATES
  // =========================================================

  const [predictions, setPredictions] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // =========================================================
  // LOAD PREDICTION HISTORY
  // =========================================================

  useEffect(() => {

    const loadAnalytics = async () => {

      try {

        setLoading(true);

        setError("");

        const data = await getPredictionHistory();

        console.log("Analytics history:", data);

        const history = Array.isArray(data)
          ? data
          : Array.isArray(data?.predictions)
          ? data.predictions
          : Array.isArray(data?.history)
          ? data.history
          : [];

        setPredictions(history);

      } catch (err) {

        console.error(
          "Failed to load analytics:",
          err
        );

        setError(
          "Unable to load your prediction data."
        );

      } finally {

        setLoading(false);

      }

    };

    loadAnalytics();

  }, []);


  // =========================================================
  // HELPERS
  // =========================================================

  const getYield = (item) => {

    const value =
      item?.predicted_yield ??
      item?.predictedYield ??
      item?.yield_prediction ??
      item?.yield ??
      item?.prediction ??
      item?.predicted_production ??
      0;

    const number = Number(value);

    return Number.isFinite(number)
      ? number
      : 0;

  };


  const getProduction = (item) => {

    const directValue =
      item?.predicted_production ??
      item?.predictedProduction ??
      item?.production ??
      item?.estimated_production ??
      item?.estimatedProduction;

    if (
      directValue !== undefined &&
      directValue !== null &&
      directValue !== ""
    ) {

      const number = Number(directValue);

      if (Number.isFinite(number)) {
        return number;
      }

    }


    const area = Number(
      item?.area ?? 0
    );

    const yieldValue = getYield(item);


    if (
      Number.isFinite(area) &&
      area > 0 &&
      yieldValue > 0
    ) {

      return area * yieldValue;

    }


    return 0;

  };


  const getCrop = (item) => {

    return (
      item?.crop ??
      item?.crop_name ??
      item?.cropName ??
      "Unknown"
    );

  };


  const getSeason = (item) => {

    return (
      item?.season ??
      item?.season_name ??
      item?.seasonName ??
      "Unknown"
    );

  };


  const getDate = (item) => {

    return (
      item?.created_at ??
      item?.createdAt ??
      item?.prediction_date ??
      item?.predictionDate ??
      item?.date ??
      ""
    );

  };


  const formatNumber = (
    value,
    decimals = 2
  ) => {

    const number = Number(value);

    if (!Number.isFinite(number)) {
      return "0";
    }

    return number.toFixed(decimals);

  };


  // =========================================================
  // PERFORMANCE
  // =========================================================

  const performance = useMemo(() => {

    const validYields = predictions
      .map(getYield)
      .filter(
        (value) =>
          Number.isFinite(value) &&
          value > 0
      );


    const validProductions = predictions
      .map(getProduction)
      .filter(
        (value) =>
          Number.isFinite(value) &&
          value > 0
      );


    const averageYield =
      validYields.length > 0
        ? validYields.reduce(
            (sum, value) =>
              sum + value,
            0
          ) / validYields.length
        : 0;


    const bestYield =
      validYields.length > 0
        ? Math.max(...validYields)
        : 0;


    const averageProduction =
      validProductions.length > 0
        ? validProductions.reduce(
            (sum, value) =>
              sum + value,
            0
          ) / validProductions.length
        : 0;


    return {

      totalPredictions:
        predictions.length,

      averageYield,

      bestYield,

      averageProduction,

    };

  }, [predictions]);


  // =========================================================
  // YIELD PERFORMANCE DATA
  // =========================================================

  const yieldData = useMemo(() => {

    return predictions
      .map((item, index) => {

        const yieldValue =
          getYield(item);


        return {

          name:
            `Prediction ${index + 1}`,

          yield:
            Number(
              yieldValue.toFixed(2)
            ),

          crop:
            getCrop(item),

          season:
            getSeason(item),

        };

      })
      .filter(
        (item) =>
          item.yield > 0
      );

  }, [predictions]);


  // =========================================================
  // CROP PERFORMANCE
  // =========================================================

  const cropData = useMemo(() => {

    const cropMap = {};


    predictions.forEach((item) => {

      const crop =
        getCrop(item);

      const yieldValue =
        getYield(item);


      if (!yieldValue) {
        return;
      }


      if (!cropMap[crop]) {

        cropMap[crop] = {

          crop,

          total: 0,

          count: 0,

        };

      }


      cropMap[crop].total +=
        yieldValue;

      cropMap[crop].count += 1;

    });


    return Object.values(cropMap)

      .map((item) => ({

        crop:
          item.crop,

        yield:
          Number(
            (
              item.total /
              item.count
            ).toFixed(2)
          ),

      }))

      .sort(
        (a, b) =>
          b.yield - a.yield
      );

  }, [predictions]);


  // =========================================================
  // SEASON PERFORMANCE
  // =========================================================

  const seasonData = useMemo(() => {

    const seasonMap = {};


    predictions.forEach((item) => {

      const season =
        getSeason(item);

      const yieldValue =
        getYield(item);


      if (!yieldValue) {
        return;
      }


      if (!seasonMap[season]) {

        seasonMap[season] = {

          season,

          total: 0,

          count: 0,

        };

      }


      seasonMap[season].total +=
        yieldValue;

      seasonMap[season].count += 1;

    });


    return Object.values(seasonMap)

      .map((item) => ({

        season:
          item.season,

        yield:
          Number(
            (
              item.total /
              item.count
            ).toFixed(2)
          ),

      }))

      .sort(
        (a, b) =>
          b.yield - a.yield
      );

  }, [predictions]);


  // =========================================================
  // INSIGHTS
  // =========================================================

  const insights = useMemo(() => {

    const latest =
      predictions.length > 0
        ? predictions[
            predictions.length - 1
          ]
        : null;


    return {

      bestCrop:
        cropData.length > 0
          ? cropData[0]
          : null,

      bestSeason:
        seasonData.length > 0
          ? seasonData[0]
          : null,

      latestYield:
        latest
          ? getYield(latest)
          : 0,

      latestCrop:
        latest
          ? getCrop(latest)
          : "—",

    };

  }, [
    predictions,
    cropData,
    seasonData,
  ]);


  // =========================================================
  // TOOLTIP
  // =========================================================

  const CustomTooltip = ({
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


    const value =
      payload[0]?.value;


    return (

      <div className="analytics-tooltip">

        <strong>
          {label}
        </strong>

        <span>
          Yield:{" "}
          {formatNumber(value)}
          {" "}t/ha
        </span>

      </div>

    );

  };


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {

    return (

      <div className="farmer-analytics-page">

        <Navbar />

        <main className="analytics-container">

          <div className="analytics-loading">

            <div className="analytics-spinner"></div>

            <p>
              Loading analytics...
            </p>

          </div>

        </main>

        <Footer />

      </div>

    );

  }


  // =========================================================
  // ERROR
  // =========================================================

  if (error) {

    return (

      <div className="farmer-analytics-page">

        <Navbar />

        <main className="analytics-container">

          <div className="analytics-error">

            <BarChart3 size={42} />

            <h2>
              Analytics unavailable
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


  // =========================================================
  // EMPTY
  // =========================================================

  if (!predictions.length) {

    return (

      <div className="farmer-analytics-page">

        <Navbar />

        <main className="analytics-container">

          <section className="analytics-header">

            <div>

              <span className="analytics-label">
                FARM ANALYTICS
              </span>

              <h1>
                Crop Performance
              </h1>

              <p>
                Your prediction performance
                will appear here.
              </p>

            </div>

          </section>


          <div className="analytics-empty">

            <Database size={42} />

            <h2>
              No prediction data yet
            </h2>

            <p>
              Make a crop yield prediction
              to start building analytics.
            </p>

          </div>

        </main>

        <Footer />

      </div>

    );

  }


  // =========================================================
  // MAIN PAGE
  // =========================================================

  return (

    <div className="farmer-analytics-page">

      <Navbar />


      <main className="analytics-container">


        {/* =================================================
            HEADER
        ================================================= */}

        <section className="analytics-header">

          <div>

            <span className="analytics-label">
              FARM ANALYTICS
            </span>

            <h1>
              Crop Performance
            </h1>

            <p>
              Clear view of your yield,
              crop and seasonal performance.
            </p>

          </div>


          <div className="analytics-header-badge">

            <BarChart3 size={18} />

            <span>
              {performance.totalPredictions}
              {" "}predictions
            </span>

          </div>

        </section>


        {/* =================================================
            KPI CARDS
        ================================================= */}

        <section className="analytics-overview">


          <div className="analytics-kpi-card">

            <div className="kpi-icon">
              <Database size={20} />
            </div>

            <div className="kpi-content">

              <span>
                Total Predictions
              </span>

              <strong>
                {performance.totalPredictions}
              </strong>

              <small>
                Recorded predictions
              </small>

            </div>

          </div>


          <div className="analytics-kpi-card">

            <div className="kpi-icon">
              <TrendingUp size={20} />
            </div>

            <div className="kpi-content">

              <span>
                Average Yield
              </span>

              <strong>
                {formatNumber(
                  performance.averageYield
                )}
              </strong>

              <small>
                tonnes per hectare
              </small>

            </div>

          </div>


          <div className="analytics-kpi-card">

            <div className="kpi-icon">
              <Target size={20} />
            </div>

            <div className="kpi-content">

              <span>
                Best Yield
              </span>

              <strong>
                {formatNumber(
                  performance.bestYield
                )}
              </strong>

              <small>
                highest prediction
              </small>

            </div>

          </div>


          <div className="analytics-kpi-card">

            <div className="kpi-icon">
              <Sprout size={20} />
            </div>

            <div className="kpi-content">

              <span>
                Average Production
              </span>

              <strong>
                {formatNumber(
                  performance.averageProduction
                )}
              </strong>

              <small>
                estimated tonnes
              </small>

            </div>

          </div>


        </section>


        {/* =================================================
            YIELD PERFORMANCE
        ================================================= */}

        {yieldData.length > 0 && (

          <section className="analytics-card analytics-main-chart">

            <div className="analytics-section-heading">

              <div>

                <span className="section-kicker">
                  YIELD
                </span>

                <h2>
                  Yield Performance
                </h2>

                <p>
                  Predicted yield for each
                  recorded prediction.
                </p>

              </div>


              <div className="chart-unit">
                t/ha
              </div>

            </div>


            <div className="chart-container chart-large">

              <ResponsiveContainer
                width="100%"
                height={340}
              >

                <BarChart
                  data={yieldData}
                  margin={{
                    top: 25,
                    right: 20,
                    left: 5,
                    bottom: 20,
                  }}
                  barCategoryGap="20%"
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e5ebe6"
                  />


                  <XAxis
                    dataKey="name"
                    tick={{
                      fill: "#647067",
                      fontSize: 11,
                    }}
                    axisLine={{
                      stroke: "#dce4de",
                    }}
                    tickLine={false}
                  />


                  <YAxis
                    tick={{
                      fill: "#647067",
                      fontSize: 11,
                    }}
                    axisLine={false}
                    tickLine={false}
                    width={55}
                    label={{
                      value: "Yield (t/ha)",
                      angle: -90,
                      position: "insideLeft",
                      style: {
                        fill: "#647067",
                        fontSize: 11,
                      },
                    }}
                  />


                  <Tooltip
                    content={
                      <CustomTooltip />
                    }
                    cursor={{
                      fill: "#f2f7f3",
                    }}
                  />


                  <Bar
                    dataKey="yield"
                    name="Yield"
                    fill="#3f8f4c"
                    radius={[
                      7,
                      7,
                      0,
                      0,
                    ]}
                    maxBarSize={55}
                  >

                    {yieldData.map(
                      (item, index) => (

                        <Cell
                          key={
                            `yield-${index}`
                          }
                          fill={
                            index ===
                            yieldData.length - 1
                              ? "#2e7d32"
                              : "#74a979"
                          }
                        />

                      )
                    )}

                  </Bar>

                </BarChart>

              </ResponsiveContainer>

            </div>

          </section>

        )}


        {/* =================================================
            CROP + SEASON
        ================================================= */}

        <section className="analytics-chart-grid">


          {/* CROP PERFORMANCE */}

          {cropData.length > 0 && (

            <div className="analytics-card">

              <div className="analytics-section-heading">

                <div>

                  <span className="section-kicker">
                    CROP
                  </span>

                  <h2>
                    Crop Performance
                  </h2>

                  <p>
                    Average predicted yield by crop.
                  </p>

                </div>

                <Sprout size={20} />

              </div>


              <div className="chart-container">

                <ResponsiveContainer
                  width="100%"
                  height={300}
                >

                  <BarChart
                    data={cropData}
                    layout="vertical"
                    margin={{
                      top: 10,
                      right: 35,
                      left: 10,
                      bottom: 10,
                    }}
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                      horizontal={false}
                      stroke="#e5ebe6"
                    />


                    <XAxis
                      type="number"
                      tick={{
                        fill: "#647067",
                        fontSize: 11,
                      }}
                      axisLine={{
                        stroke: "#dce4de",
                      }}
                      tickLine={false}
                    />


                    <YAxis
                      type="category"
                      dataKey="crop"
                      width={85}
                      tick={{
                        fill: "#36443b",
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                      axisLine={false}
                      tickLine={false}
                    />


                    <Tooltip
                      content={
                        <CustomTooltip />
                      }
                      cursor={{
                        fill: "#f2f7f3",
                      }}
                    />


                    <Bar
                      dataKey="yield"
                      name="Yield"
                      fill="#3f8f4c"
                      radius={[
                        0,
                        7,
                        7,
                        0,
                      ]}
                      maxBarSize={32}
                    />

                  </BarChart>

                </ResponsiveContainer>

              </div>


              <div className="chart-footer">

                <span>
                  Unit
                </span>

                <strong>
                  tonnes per hectare
                </strong>

              </div>

            </div>

          )}


          {/* SEASON PERFORMANCE */}

          {seasonData.length > 0 && (

            <div className="analytics-card">

              <div className="analytics-section-heading">

                <div>

                  <span className="section-kicker">
                    SEASON
                  </span>

                  <h2>
                    Yield by Season
                  </h2>

                  <p>
                    Average predicted yield
                    for each season.
                  </p>

                </div>

                <CalendarDays size={20} />

              </div>


              <div className="chart-container">

                <ResponsiveContainer
                  width="100%"
                  height={300}
                >

                  <BarChart
                    data={seasonData}
                    margin={{
                      top: 15,
                      right: 15,
                      left: 5,
                      bottom: 10,
                    }}
                    barCategoryGap="25%"
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#e5ebe6"
                    />


                    <XAxis
                      dataKey="season"
                      tick={{
                        fill: "#36443b",
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                      axisLine={{
                        stroke: "#dce4de",
                      }}
                      tickLine={false}
                    />


                    <YAxis
                      tick={{
                        fill: "#647067",
                        fontSize: 11,
                      }}
                      axisLine={false}
                      tickLine={false}
                      width={45}
                    />


                    <Tooltip
                      content={
                        <CustomTooltip />
                      }
                      cursor={{
                        fill: "#f2f7f3",
                      }}
                    />


                    <Bar
                      dataKey="yield"
                      name="Yield"
                      fill="#4f9660"
                      radius={[
                        7,
                        7,
                        0,
                        0,
                      ]}
                      maxBarSize={55}
                    />

                  </BarChart>

                </ResponsiveContainer>

              </div>


              <div className="chart-footer">

                <span>
                  Unit
                </span>

                <strong>
                  tonnes per hectare
                </strong>

              </div>

            </div>

          )}

        </section>


        {/* =================================================
            KEY INSIGHTS
        ================================================= */}

        <section className="analytics-card insights-card">

          <div className="analytics-section-heading">

            <div>

              <span className="section-kicker">
                SUMMARY
              </span>

              <h2>
                Key Insights
              </h2>

              <p>
                Important results from your
                prediction history.
              </p>

            </div>

          </div>


          <div className="insights-grid">


            <div className="insight-item">

              <span>
                Best Crop
              </span>

              <strong>
                {insights.bestCrop
                  ? insights.bestCrop.crop
                  : "—"}
              </strong>

              <small>
                {insights.bestCrop
                  ? `${formatNumber(
                      insights.bestCrop.yield
                    )} t/ha`
                  : "No data"}
              </small>

            </div>


            <div className="insight-item">

              <span>
                Best Season
              </span>

              <strong>
                {insights.bestSeason
                  ? insights.bestSeason.season
                  : "—"}
              </strong>

              <small>
                {insights.bestSeason
                  ? `${formatNumber(
                      insights.bestSeason.yield
                    )} t/ha`
                  : "No data"}
              </small>

            </div>


            <div className="insight-item">

              <span>
                Latest Yield
              </span>

              <strong>
                {formatNumber(
                  insights.latestYield
                )}{" "}
                t/ha
              </strong>

              <small>
                {insights.latestCrop}
              </small>

            </div>


            <div className="insight-item">

              <span>
                Highest Recorded Yield
              </span>

              <strong>
                {formatNumber(
                  performance.bestYield
                )}{" "}
                t/ha
              </strong>

              <small>
                From prediction history
              </small>

            </div>


          </div>

        </section>


      </main>


      <Footer />

    </div>

  );

}


export default FarmerAnalytics;