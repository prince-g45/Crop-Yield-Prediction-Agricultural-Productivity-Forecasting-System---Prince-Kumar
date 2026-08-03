import { useState } from "react";

import Navbar from "../components/Navbar";

import DashboardOverview from "../components/DashboardOverview";
import FarmerManagement from "../components/FarmerManagement";
import PredictionLogs from "../components/PredictionLogs";
import DatasetManagement from "../components/DatasetManagement";
import Analytics from "../components/Analytics";

import "../styles/AdminDashboard.css";

function AdminDashboard() {

  const [activeSection, setActiveSection] = useState("dashboard");

  const renderSection = () => {

    switch (activeSection) {

      case "dashboard":
        return <DashboardOverview />;

      case "farmers":
        return <FarmerManagement />;

      case "predictions":
        return <PredictionLogs />;

      case "datasets":
        return <DatasetManagement />;

      case "analytics":
        return <Analytics />;

      default:
        return <DashboardOverview />;

    }

  };

  return (

    <>

      <Navbar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      <div className="admin-container">

        {renderSection()}

      </div>

    </>

  );

}

export default AdminDashboard;