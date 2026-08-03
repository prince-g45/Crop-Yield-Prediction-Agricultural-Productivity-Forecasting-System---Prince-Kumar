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
} from "recharts";

function Analytics() {

  // Backend se baad me aayega
  const stateData = [];

  const cropData = [];

  const trendData = [];

  return (

    <div className="management-container">

      <div className="page-header">

        <h1>Analytics</h1>

        <p>
          Platform reports and prediction analytics.
        </p>

      </div>

      {/* State-wise Predictions */}

      <div className="chart-card">

        <h2>State-wise Predictions</h2>

        <ResponsiveContainer
          width="100%"
          height={300}
        >

          <BarChart data={stateData}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="state" />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="predictions"
              fill="#2E7D32"
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

      {/* Crop-wise Yield */}

      <div className="chart-card">

        <h2>Crop-wise Average Yield</h2>

        <ResponsiveContainer
          width="100%"
          height={300}
        >

          <BarChart data={cropData}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="crop" />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="yield"
              fill="#4CAF50"
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

      {/* Platform Usage */}

      <div className="chart-card">

        <h2>Platform Usage Over Time</h2>

        <ResponsiveContainer
          width="100%"
          height={300}
        >

          <LineChart data={trendData}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="date" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="predictions"
              stroke="#2E7D32"
              strokeWidth={3}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>

  );

}

export default Analytics;