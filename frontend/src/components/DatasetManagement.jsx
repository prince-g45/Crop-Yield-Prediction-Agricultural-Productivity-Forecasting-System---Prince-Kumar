import { Upload } from "lucide-react";

function DatasetManagement() {

  return (

    <div className="management-container">

      <div className="page-header">

        <h1>Dataset Management</h1>

        <p>
          Upload and manage datasets used for crop yield prediction.
        </p>

      </div>

      <div className="dataset-grid">

        {/* Weather Dataset */}

        <div className="dataset-card">

          <h3>Weather Dataset</h3>

          <p>Upload latest weather CSV file.</p>

          <input
            type="file"
            accept=".csv"
          />

          <button className="upload-btn">

            <Upload size={18} />

            Upload Weather Data

          </button>

          <small>
            Last Updated : --
          </small>

        </div>

        {/* Soil Dataset */}

        <div className="dataset-card">

          <h3>Soil Dataset</h3>

          <p>Upload latest soil CSV file.</p>

          <input
            type="file"
            accept=".csv"
          />

          <button className="upload-btn">

            <Upload size={18} />

            Upload Soil Data

          </button>

          <small>
            Last Updated : --
          </small>

        </div>

        {/* Crop Dataset */}

        <div className="dataset-card">

          <h3>Crop Dataset</h3>

          <p>Upload latest crop yield CSV file.</p>

          <input
            type="file"
            accept=".csv"
          />

          <button className="upload-btn">

            <Upload size={18} />

            Upload Crop Data

          </button>

          <small>
            Last Updated : --
          </small>

        </div>

      </div>

    </div>

  );

}

export default DatasetManagement;