import { useState } from "react";
import { Eye, Ban, Trash2, Search } from "lucide-react";

function FarmerManagement() {

  const [search, setSearch] = useState("");

  // Backend se baad me aayega
  const [farmers] = useState([]);

  return (

    <div className="management-container">

      <div className="page-header">

        <h1>Farmer Management</h1>

        <p>
          View and manage all registered farmers.
        </p>

      </div>

      {/* Search */}

      <div className="search-box">

        <Search size={18} />

        <input
          type="text"
          placeholder="Search by farmer name or state..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>

      {/* Table */}

      <div className="table-container">

        <table>

          <thead>

            <tr>

              <th>Name</th>

              <th>Email</th>

              <th>State</th>

              <th>Joined Date</th>

              <th>Status</th>

              <th>Actions</th>

            </tr>

          </thead>

          <tbody>

            {farmers.length === 0 ? (

              <tr>

                <td
                  colSpan="6"
                  className="empty-row"
                >

                  No farmers found.

                </td>

              </tr>

            ) : (

              farmers.map((farmer) => (

                <tr key={farmer.id}>

                  <td>{farmer.full_name}</td>

                  <td>{farmer.email}</td>

                  <td>{farmer.state}</td>

                  <td>{farmer.created_at}</td>

                  <td>

                    <span className="status active">

                      Active

                    </span>

                  </td>

                  <td>

                    <button className="action-btn view">

                      <Eye size={16} />

                      View

                    </button>

                    <button className="action-btn block">

                      <Ban size={16} />

                      Block

                    </button>

                    <button className="action-btn delete">

                      <Trash2 size={16} />

                      Delete

                    </button>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>

  );

}

export default FarmerManagement;