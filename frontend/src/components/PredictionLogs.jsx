import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Download,
  RefreshCw,
  X,
} from "lucide-react";

import {
  getAdminPredictionHistory,
} from "../services/predictionService";


function PredictionLogs() {

  const [predictions, setPredictions] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [cropFilter, setCropFilter] = useState("All Crops");

  const [stateFilter, setStateFilter] = useState("All States");

  const [dateFilter, setDateFilter] = useState("");


  // ==========================================
  // Load Admin Predictions
  // ==========================================

  const loadPredictions = async () => {

    try {

      setLoading(true);
      setError("");

      const response = await getAdminPredictionHistory();

      let data = [];

      if (Array.isArray(response)) {

        data = response;

      } else if (Array.isArray(response?.data)) {

        data = response.data;

      } else if (Array.isArray(response?.predictions)) {

        data = response.predictions;

      }

      setPredictions(data);

    } catch (err) {

      console.error(
        "Failed to load admin predictions:",
        err
      );

      if (err.response?.status === 403) {

        setError(
          "You do not have permission to view all prediction records."
        );

      } else {

        setError(
          err.response?.data?.detail ||
          "Failed to load prediction records."
        );
      }

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {

    loadPredictions();

  }, []);


  // ==========================================
  // Unique Crops
  // ==========================================

  const cropOptions = useMemo(() => {

    const crops = predictions
      .map((item) => item.crop)
      .filter(Boolean);

    return [
      "All Crops",
      ...Array.from(new Set(crops)).sort(),
    ];

  }, [predictions]);


  // ==========================================
  // Unique States
  // ==========================================

  const stateOptions = useMemo(() => {

    const states = predictions
      .map((item) => item.state)
      .filter(Boolean);

    return [
      "All States",
      ...Array.from(new Set(states)).sort(),
    ];

  }, [predictions]);


  // ==========================================
  // Filter Predictions
  // ==========================================

  const filteredPredictions = useMemo(() => {

    return predictions.filter((prediction) => {

      const searchText = search
        .toLowerCase()
        .trim();

      const farmName = String(
        prediction.farm_name || ""
      ).toLowerCase();

      const crop = String(
        prediction.crop || ""
      ).toLowerCase();

      const state = String(
        prediction.state || ""
      ).toLowerCase();

      const matchesSearch =
        !searchText ||
        farmName.includes(searchText) ||
        crop.includes(searchText) ||
        state.includes(searchText);

      const matchesCrop =
        cropFilter === "All Crops" ||
        prediction.crop === cropFilter;

      const matchesState =
        stateFilter === "All States" ||
        prediction.state === stateFilter;

      const predictionDate =
        prediction.created_at
          ? String(prediction.created_at).slice(0, 10)
          : "";

      const matchesDate =
        !dateFilter ||
        predictionDate === dateFilter;

      return (
        matchesSearch &&
        matchesCrop &&
        matchesState &&
        matchesDate
      );

    });

  }, [
    predictions,
    search,
    cropFilter,
    stateFilter,
    dateFilter,
  ]);


  // ==========================================
  // Summary
  // ==========================================

  const totalPredictions = predictions.length;

  const showingPredictions =
    filteredPredictions.length;

  const totalCrops =
    new Set(
      predictions
        .map((item) => item.crop)
        .filter(Boolean)
    ).size;

  const totalStates =
    new Set(
      predictions
        .map((item) => item.state)
        .filter(Boolean)
    ).size;


  // ==========================================
  // Clear Filters
  // ==========================================

  const clearFilters = () => {

    setSearch("");
    setCropFilter("All Crops");
    setStateFilter("All States");
    setDateFilter("");

  };


  // ==========================================
  // CSV Export
  // ==========================================

  const exportCSV = () => {

    if (!filteredPredictions.length) {
      return;
    }

    const headers = [
      "Farm",
      "State",
      "Crop",
      "Season",
      "Area",
      "Predicted Yield",
      "Estimated Production",
      "Date",
    ];

    const rows = filteredPredictions.map(
      (prediction) => [

        prediction.farm_name || "",

        prediction.state || "",

        prediction.crop || "",

        prediction.season || "",

        prediction.area ?? "",

        prediction.predicted_yield ?? "",

        prediction.estimated_production ?? "",

        prediction.created_at || "",

      ]
    );

    const csvContent = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row
          .map((value) =>
            `"${String(value).replaceAll('"', '""')}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob(
      [csvContent],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download =
      "prediction_logs.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };


  // ==========================================
  // Loading
  // ==========================================

  if (loading) {

    return (
      <div className="management-container">

        <div className="page-header">

          <h1>Prediction Logs</h1>

          <p>
            View all crop yield predictions
            made on the platform.
          </p>

        </div>

        <div className="analytics-loading">

          Loading prediction records...

        </div>

      </div>
    );
  }


  // ==========================================
  // Main UI
  // ==========================================

  return (

    <div className="management-container">

      <div className="page-header">

        <div>

          <h1>Prediction Logs</h1>

          <p>
            View all crop yield predictions
            made on the platform.
          </p>

        </div>

      </div>


      {/* =====================================
          Summary
      ====================================== */}

      <div className="prediction-summary">

        <div className="prediction-summary-item">

          <span>Total Predictions</span>

          <strong>
            {totalPredictions}
          </strong>

        </div>


        <div className="prediction-summary-item">

          <span>Showing</span>

          <strong>
            {showingPredictions}
          </strong>

        </div>


        <div className="prediction-summary-item">

          <span>Total Crops</span>

          <strong>
            {totalCrops}
          </strong>

        </div>


        <div className="prediction-summary-item">

          <span>Total States</span>

          <strong>
            {totalStates}
          </strong>

        </div>

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
          Filters
      ====================================== */}

      <div className="prediction-toolbar">

        <div className="filters">

          <div className="search-box">

            <Search size={18} />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search farm, crop or state..."
            />

          </div>


          <select
            value={cropFilter}
            onChange={(e) =>
              setCropFilter(e.target.value)
            }
          >

            {cropOptions.map((crop) => (

              <option
                key={crop}
                value={crop}
              >
                {crop}
              </option>

            ))}

          </select>


          <select
            value={stateFilter}
            onChange={(e) =>
              setStateFilter(e.target.value)
            }
          >

            {stateOptions.map((state) => (

              <option
                key={state}
                value={state}
              >
                {state}
              </option>

            ))}

          </select>


          <input
            type="date"
            value={dateFilter}
            onChange={(e) =>
              setDateFilter(e.target.value)
            }
          />

        </div>


        <div className="prediction-actions">

          <button
            className="secondary-btn"
            onClick={clearFilters}
          >

            <X size={17} />

            Clear

          </button>


          <button
            className="secondary-btn"
            onClick={loadPredictions}
          >

            <RefreshCw size={17} />

            Refresh

          </button>


          <button
            className="export-btn"
            onClick={exportCSV}
            disabled={!filteredPredictions.length}
          >

            <Download size={17} />

            Export CSV

          </button>

        </div>

      </div>


      {/* =====================================
          Table
      ====================================== */}

      <div className="table-container">

        <table>

          <thead>

            <tr>

              <th>Farm</th>

              <th>State</th>

              <th>Crop</th>

              <th>Season</th>

              <th>Area</th>

              <th>Predicted Yield</th>

              <th>Production</th>

              <th>Date</th>

            </tr>

          </thead>


          <tbody>

            {filteredPredictions.length === 0 ? (

              <tr>

                <td
                  colSpan="8"
                  className="empty-row"
                >

                  {predictions.length === 0
                    ? "No prediction records found."
                    : "No records match the selected filters."
                  }

                </td>

              </tr>

            ) : (

              filteredPredictions.map(
                (prediction, index) => (

                  <tr
                    key={
                      prediction.id ||
                      `${prediction.farm_name}-${index}`
                    }
                  >

                    <td>
                      {prediction.farm_name || "—"}
                    </td>

                    <td>
                      {prediction.state || "—"}
                    </td>

                    <td>
                      {prediction.crop || "—"}
                    </td>

                    <td>
                      {prediction.season || "—"}
                    </td>

                    <td>
                      {prediction.area ?? "—"}
                    </td>

                    <td>
                      {prediction.predicted_yield ?? "—"}
                    </td>

                    <td>
                      {prediction.estimated_production ?? "—"}
                    </td>

                    <td>
                      {prediction.created_at
                        ? new Date(
                            prediction.created_at
                          ).toLocaleDateString()
                        : "—"
                      }
                    </td>

                  </tr>

                )
              )

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}


export default PredictionLogs;