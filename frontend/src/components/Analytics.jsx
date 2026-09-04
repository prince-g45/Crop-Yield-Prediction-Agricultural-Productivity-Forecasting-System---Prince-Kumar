import { useEffect, useMemo, useState } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import {
  RefreshCw,
} from "lucide-react";

import {
  getAdminPredictionHistory,
} from "../services/predictionService";


function Analytics() {

  const [predictions, setPredictions] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // ==========================================
  // Load Data
  // ==========================================

  const loadAnalytics = async () => {

    try {

      setLoading(true);

      setError("");

      const response =
        await getAdminPredictionHistory();

      let data = [];

      if (Array.isArray(response)) {

        data = response;

      } else if (Array.isArray(response?.data)) {

        data = response.data;

      } else if (
        Array.isArray(response?.predictions)
      ) {

        data = response.predictions;

      }

      setPredictions(data);

    } catch (err) {

      console.error(
        "Analytics loading failed:",
        err
      );

      setError(
        err.response?.data?.detail ||
        "Failed to load analytics data."
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {

    loadAnalytics();

  }, []);


  // ==========================================
  // Basic Statistics
  // ==========================================

  const statistics = useMemo(() => {

    const totalPredictions =
      predictions.length;

    const states = new Set(
      predictions
        .map((item) => item.state)
        .filter(Boolean)
    );

    const crops = new Set(
      predictions
        .map((item) => item.crop)
        .filter(Boolean)
    );

    const yields = predictions
      .map((item) =>
        Number(item.predicted_yield)
      )
      .filter((value) =>
        Number.isFinite(value)
      );

    const averageYield =
      yields.length
        ? yields.reduce(
            (sum, value) =>
              sum + value,
            0
          ) / yields.length
        : 0;

    return {
      totalPredictions,
      totalStates: states.size,
      totalCrops: crops.size,
      averageYield,
    };

  }, [predictions]);


  // ==========================================
  // State-wise Predictions
  // ==========================================

  const stateData = useMemo(() => {

    const grouped = {};

    predictions.forEach((prediction) => {

      const state =
        prediction.state || "Unknown";

      if (!grouped[state]) {

        grouped[state] = 0;

      }

      grouped[state] += 1;

    });

    return Object.entries(grouped)

      .map(([state, predictions]) => ({
        state,
        predictions,
      }))

      .sort(
        (a, b) =>
          b.predictions -
          a.predictions
      );

  }, [predictions]);


  // ==========================================
  // Crop Average Yield
  // ==========================================

  const cropData = useMemo(() => {

    const grouped = {};

    predictions.forEach((prediction) => {

      const crop =
        prediction.crop || "Unknown";

      const yieldValue =
        Number(
          prediction.predicted_yield
        );

      if (
        !Number.isFinite(yieldValue)
      ) {
        return;
      }

      if (!grouped[crop]) {

        grouped[crop] = {
          total: 0,
          count: 0,
        };

      }

      grouped[crop].total +=
        yieldValue;

      grouped[crop].count += 1;

    });

    return Object.entries(grouped)

      .map(([crop, values]) => ({

        crop,

        yield:
          values.count
            ? values.total /
              values.count
            : 0,

      }))

      .sort(
        (a, b) =>
          b.yield - a.yield
      );

  }, [predictions]);


  // ==========================================
  // Crop Distribution
  // ==========================================

  const cropDistribution = useMemo(() => {

    const grouped = {};

    predictions.forEach((prediction) => {

      const crop =
        prediction.crop || "Unknown";

      grouped[crop] =
        (grouped[crop] || 0) + 1;

    });

    return Object.entries(grouped)

      .map(([name, value]) => ({
        name,
        value,
      }))

      .sort(
        (a, b) =>
          b.value - a.value
      );

  }, [predictions]);


  // ==========================================
  // Prediction Trend
  // ==========================================

  const trendData = useMemo(() => {

    const grouped = {};

    predictions.forEach((prediction) => {

      if (!prediction.created_at) {
        return;
      }

      const date =
        String(
          prediction.created_at
        ).slice(0, 10);

      if (!grouped[date]) {

        grouped[date] = 0;

      }

      grouped[date] += 1;

    });

    return Object.entries(grouped)

      .map(([date, predictions]) => ({
        date,
        predictions,
      }))

      .sort(
        (a, b) =>
          new Date(a.date) -
          new Date(b.date)
      );

  }, [predictions]);


  // ==========================================
  // Empty State
  // ==========================================

  if (
    !loading &&
    !error &&
    predictions.length === 0
  ) {

    return (

      <div className="management-container">

        <div className="analytics-header">

          <div>

            <h1>Analytics</h1>

            <p>
              Platform reports and
              prediction analytics.
            </p>

          </div>

          <button
            className="secondary-btn"
            onClick={loadAnalytics}
          >

            <RefreshCw size={17} />

            Refresh

          </button>

        </div>


        <div className="analytics-empty">

          No prediction data is available
          for analytics.

        </div>

      </div>

    );
  }


  return (

    <div className="management-container">

      {/* =====================================
          Header
      ====================================== */}

      <div className="analytics-header">

        <div>

          <h1>Analytics</h1>

          <p>
            Platform reports and
            prediction analytics.
          </p>

        </div>


        <button
          className="secondary-btn"
          onClick={loadAnalytics}
        >

          <RefreshCw size={17} />

          Refresh

        </button>

      </div>


      {/* =====================================
          Error
      ====================================== */}

      {error && (

        <div className="dashboard-error">

          {error}

        </div>

      )}


      {/* =====================================
          Statistics
      ====================================== */}

      <div className="analytics-stats">

        <div className="analytics-stat-card">

          <span>Total Predictions</span>

          <strong>
            {statistics.totalPredictions}
          </strong>

        </div>


        <div className="analytics-stat-card">

          <span>States Covered</span>

          <strong>
            {statistics.totalStates}
          </strong>

        </div>


        <div className="analytics-stat-card">

          <span>Crops Analysed</span>

          <strong>
            {statistics.totalCrops}
          </strong>

        </div>


        <div className="analytics-stat-card">

          <span>Average Yield</span>

          <strong>
            {statistics.averageYield.toFixed(2)}
          </strong>

        </div>

      </div>


      {/* =====================================
          Charts
      ====================================== */}

      <div className="analytics-chart-grid">


        {/* State Chart */}

        <div className="chart-card">

          <h2>
            State-wise Predictions
          </h2>

          <ResponsiveContainer
            width="100%"
            height={320}
          >

            <BarChart
              data={stateData}
              margin={{
                top: 15,
                right: 20,
                left: 0,
                bottom: 5,
              }}
            >

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="state"
              />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="predictions"
                fill="#2E7D32"
                radius={[
                  5,
                  5,
                  0,
                  0
                ]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>


        {/* Crop Yield */}

        <div className="chart-card">

          <h2>
            Crop-wise Average Yield
          </h2>

          <ResponsiveContainer
            width="100%"
            height={320}
          >

            <BarChart
              data={cropData}
              margin={{
                top: 15,
                right: 20,
                left: 0,
                bottom: 5,
              }}
            >

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="crop"
              />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="yield"
                fill="#4CAF50"
                radius={[
                  5,
                  5,
                  0,
                  0
                ]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>


        {/* Crop Distribution */}

        <div className="chart-card">

          <h2>
            Crop Distribution
          </h2>

          <ResponsiveContainer
            width="100%"
            height={320}
          >

            <PieChart>

              <Pie
                data={cropDistribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={105}
                innerRadius={55}
                paddingAngle={2}
              >

                {cropDistribution.map(
                  (entry, index) => (

                    <Cell
                      key={`cell-${index}`}
                      fill={
                        [
                          "#2E7D32",
                          "#4CAF50",
                          "#81C784",
                          "#A5D6A7",
                          "#66BB6A",
                          "#388E3C",
                        ][
                          index %
                          6
                        ]
                      }
                    />

                  )
                )}

              </Pie>

              <Tooltip />

              <Legend />

            </PieChart>

          </ResponsiveContainer>

        </div>


        {/* Trend */}

        <div className="chart-card">

          <h2>
            Platform Usage Over Time
          </h2>

          <ResponsiveContainer
            width="100%"
            height={320}
          >

            <LineChart
              data={trendData}
              margin={{
                top: 15,
                right: 20,
                left: 0,
                bottom: 5,
              }}
            >

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="date"
              />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="predictions"
                stroke="#2E7D32"
                strokeWidth={3}
                dot={{
                  r: 4,
                }}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>

  );
}


export default Analytics;