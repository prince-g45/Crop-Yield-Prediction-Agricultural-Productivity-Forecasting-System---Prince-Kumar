import { Pencil, Trash2, TrendingUp } from "lucide-react";

function FarmTable({ farms, onEdit, onDelete }) {
  return (
    <div className="table-card">

      <div className="table-header">

        <h2>My Farms</h2>

        <span>{farms.length} Farm(s)</span>

      </div>

      <table>

        <thead>

          <tr>

            <th>Farm Name</th>

            <th>Crop</th>

            <th>Area</th>

            <th>Location</th>

            <th>Season</th>

            <th>Actions</th>

          </tr>

        </thead>

        <tbody>

          {farms.length === 0 ? (

            <tr>

              <td colSpan="6" className="empty">

                No farms found.

              </td>

            </tr>

          ) : (

            farms.map((farm) => (

              <tr key={farm.id}>

                <td>{farm.farm_name}</td>

                <td>

                  <span className="crop-badge">

                    {farm.crop_name}

                  </span>

                </td>

                <td>{farm.area} Acres</td>

                <td>{farm.location}</td>

                <td>{farm.season}</td>

                <td>

                  <button
                    className="icon-btn"
                    onClick={() => onEdit(farm)}
                  >
                    <Pencil size={17} />
                  </button>

                  <button
                    className="icon-btn delete"
                    onClick={() => onDelete(farm.id)}
                  >
                    <Trash2 size={17} />
                  </button>

                  <button
                    className="icon-btn predict"
                  >
                    <TrendingUp size={17} />
                  </button>

                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>
  );
}

export default FarmTable;