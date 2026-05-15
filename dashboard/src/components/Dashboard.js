import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate, NavLink } from "react-router-dom";

import Funds from "./Funds";
import Holdings from "./Holdings";
import Orders from "./Orders";
import Positions from "./Positions";
import Summary from "./Summary";
import WatchList from "./WatchList";
import AdminDashboard from "./AdminDashboard";
import { GeneralContextProvider } from "./GeneralContext";

const FRONTEND_URL = "http://localhost:3001/";

// ===========================
// Navigation Menu Items
// ===========================
const navItems = [
  { path: "/", label: "Summary", icon: "📊" },
  { path: "/orders", label: "Orders", icon: "📋" },
  { path: "/holdings", label: "Holdings", icon: "💼" },
  { path: "/positions", label: "Positions", icon: "📈" },
  { path: "/funds", label: "Funds", icon: "💰" },
];

const Dashboard = () => {
  const [authReady, setAuthReady] = useState(false);

  // Extract auth token from URL (passed from frontend login)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authData = params.get("auth");
    if (authData) {
      try {
        const { token, user } = JSON.parse(decodeURIComponent(authData));
        if (token) localStorage.setItem("wave_token", token);
        if (user) {
          localStorage.setItem("wave_user", JSON.stringify(user));
          localStorage.setItem("userName", user.name);
          localStorage.setItem("isLoggedIn", "true");
        }
        // Clean the URL
        window.history.replaceState({}, "", window.location.pathname);
      } catch (e) {
        console.error("Auth parse error:", e);
      }
    }
    setAuthReady(true);
  }, []);

  if (!authReady) return null;

  // Check if user is logged in
  const token = localStorage.getItem("wave_token");
  if (!token) {
    window.location.href = `${FRONTEND_URL}/login`;
    return null;
  }

  // Check if user is admin
  const user = JSON.parse(localStorage.getItem("wave_user") || "{}");
  const isAdmin = user.role === "admin";

  // If admin, show admin dashboard
  if (isAdmin || window.location.pathname === "/admin") {
    return <AdminDashboard />;
  }

  return (
    <GeneralContextProvider>
      <div className="dashboard-container">

        {/* Left Sidebar */}
        <aside className="sidebar">
          <WatchList />
        </aside>

        {/* Main Content Area */}
        <main className="content">

          {/* Top Navigation Bar */}
          <nav className="dashboard-nav">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                replace={true}
                className={({ isActive }) =>
                  `dashboard-nav-link ${isActive ? "active" : ""}`
                }
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
            <a
              href={FRONTEND_URL}
              className="dashboard-nav-link"
              style={{ marginLeft: "auto", color: "#fb7185" }}
              title="Back to Home"
            >
              <span className="nav-icon">🚪</span>
              Exit Dashboard
            </a>
          </nav>

          {/* Page Content */}
          <div className="dashboard-page-content">
            <Routes>
              <Route index element={<Summary />} />
              <Route path="orders" element={<Orders />} />
              <Route path="holdings" element={<Holdings />} />
              <Route path="positions" element={<Positions />} />
              <Route path="funds" element={<Funds />} />

              {/* Fallback Route */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </main>
      </div>
    </GeneralContextProvider>
  );
};

export default Dashboard;