import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import About from "./pages/About";
import ChooseRole from "./pages/ChooseRole";

import FarmerDashboard from "./pages/FarmerDashboard";
import FarmerAnalytics from "./pages/FarmerAnalytics";
import FarmerReports from "./pages/FarmerReports";

import AdminDashboard from "./pages/AdminDashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";


function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* ======================================
            AUTHENTICATION
        ======================================= */}

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/choose-role"
          element={<ChooseRole />}
        />


        {/* ======================================
            ADMINISTRATOR
        ======================================= */}

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />


        {/* ======================================
            FARMER DASHBOARD
        ======================================= */}

        <Route
          path="/farmer-dashboard"
          element={
            <ProtectedRoute>
              <FarmerDashboard />
            </ProtectedRoute>
          }
        />


        {/* ======================================
            FARMER ANALYTICS
        ======================================= */}

        <Route
          path="/farmer-analytics"
          element={
            <ProtectedRoute>
              <FarmerAnalytics />
            </ProtectedRoute>
          }
        />


        {/* ======================================
            FARMER REPORTS
        ======================================= */}

        <Route
          path="/farmer-reports"
          element={
            <ProtectedRoute>
              <FarmerReports />
            </ProtectedRoute>
          }
        />


        {/* ======================================
            AGRICULTURE DEPARTMENT
        ======================================= */}

        <Route
          path="/department-dashboard"
          element={
            <ProtectedRoute>
              <FarmerDashboard />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>

  );

}


export default App;