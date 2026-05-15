import React, { useEffect, useState } from "react";
import api from "../utils/api";
import "./AdminDashboard.css";

const formatCurrency = (value = 0) =>
  Number(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const FRONTEND_URL = process.env.REACT_APP_FRONTEND_URL || "http://localhost:3001/";

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const [usersRes, analyticsRes] = await Promise.all([
          api.get("/admin/users"),
          api.get("/admin/analytics"),
        ]);
        setUsers(usersRes.data);
        setAnalytics(analyticsRes.data);
      } catch (err) {
        console.error("Admin fetch error:", err);
        setError("Access denied or failed to load admin data.");
      } finally {
        setLoading(false);
      }
    };
    fetchAdmin();
  }, []);

  const viewUser = async (userId) => {
    try {
      setSelectedUser(userId);
      const res = await api.get(`/admin/user/${userId}`);
      setUserData(res.data);
      setActiveTab("userDetail");
    } catch (err) {
      console.error("Failed to fetch user data:", err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = `${FRONTEND_URL}/login`;
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-loader">
          <div className="admin-loader-ring"></div>
          <p>Loading Admin Panel...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page">
        <div className="admin-loader">
          <p style={{ color: "#fb7185" }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      {/* Decorative Orbs */}
      <div className="admin-orb admin-orb-1"></div>
      <div className="admin-orb admin-orb-2"></div>
      <div className="admin-orb admin-orb-3"></div>

      {/* Header - Centered */}
      <header className="admin-hdr">
        <div className="admin-hdr-left-actions">
          {activeTab === "userDetail" ? (
            <button className="admin-back-btn" title="Back to Users" onClick={() => setActiveTab("users")}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </button>
          ) : (
            <a href={FRONTEND_URL} className="admin-back-btn" title="Back to Home">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </a>
          )}
        </div>

        <div className="admin-hdr-center">
          <svg viewBox="0 0 40 40" fill="none" width="42" height="42">
            <defs>
              <linearGradient id="adminWave" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#e11d48" />
                <stop offset="100%" stopColor="#be123c" />
              </linearGradient>
            </defs>
            <circle cx="20" cy="20" r="18" fill="url(#adminWave)" opacity="0.15" />
            <path d="M8,22 Q14,14 20,22 Q26,30 32,22" stroke="url(#adminWave)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </svg>
          <h1>Wave <span className="admin-hdr-accent">Command</span></h1>
          <p className="admin-hdr-sub">Administration Console</p>
          <span className="admin-role-badge">ADMIN</span>
        </div>

        <div className="admin-hdr-right-actions">
          <div className="admin-hdr-status">
            <span className="admin-status-dot"></span>
            System Active
          </div>
          <button className="admin-logout" onClick={handleLogout}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      </header>

      {/* Tab Navigation - Centered */}
      <nav className="admin-tabs">
        <button
          className={`admin-tab ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          <span className="admin-tab-icon">📊</span> Overview
        </button>
        <button
          className={`admin-tab ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          <span className="admin-tab-icon">👥</span> Users
        </button>
        <button
          className={`admin-tab ${activeTab === "market" ? "active" : ""}`}
          onClick={() => setActiveTab("market")}
        >
          <span className="admin-tab-icon">🔥</span> Market
        </button>
        {userData && (
          <button
            className={`admin-tab ${activeTab === "userDetail" ? "active" : ""}`}
            onClick={() => setActiveTab("userDetail")}
          >
            <span className="admin-tab-icon">🔍</span> {userData.user.name}
          </button>
        )}
      </nav>

      {/* OVERVIEW TAB */}
      {activeTab === "overview" && analytics && (
        <div className="admin-content">
          {/* Stats */}
          <div className="admin-kpi-grid">
            <div className="admin-kpi admin-kpi-glow-green">
              <div className="admin-kpi-icon">👤</div>
              <div className="admin-kpi-data">
                <p className="admin-kpi-label">Total Users</p>
                <h2 className="admin-kpi-value">{analytics.totalUsers}</h2>
              </div>
            </div>
            <div className="admin-kpi admin-kpi-glow-blue">
              <div className="admin-kpi-icon">📦</div>
              <div className="admin-kpi-data">
                <p className="admin-kpi-label">Total Orders</p>
                <h2 className="admin-kpi-value">{analytics.totalOrders}</h2>
              </div>
            </div>
            <div className="admin-kpi admin-kpi-glow-purple">
              <div className="admin-kpi-icon">💎</div>
              <div className="admin-kpi-data">
                <p className="admin-kpi-label">Total Volume</p>
                <h2 className="admin-kpi-value">₹{formatCurrency(analytics.totalVolume)}</h2>
              </div>
            </div>
            <div className={`admin-kpi ${analytics.platformPnL >= 0 ? "admin-kpi-glow-green" : "admin-kpi-glow-red"}`}>
              <div className="admin-kpi-icon">{analytics.platformPnL >= 0 ? "📈" : "📉"}</div>
              <div className="admin-kpi-data">
                <p className="admin-kpi-label">Platform P&L</p>
                <h2 className={`admin-kpi-value ${analytics.platformPnL >= 0 ? "text-profit" : "text-loss"}`}>
                  {analytics.platformPnL >= 0 ? "+" : ""}₹{formatCurrency(analytics.platformPnL)}
                </h2>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          {analytics.recentOrders.length > 0 && (
            <div className="admin-card">
              <div className="admin-card-hdr">
                <h3>⚡ Recent Activity</h3>
                <span className="admin-card-badge">{analytics.recentOrders.length} orders</span>
              </div>
              <div className="admin-tbl-wrap">
                <table className="admin-tbl">
                  <thead>
                    <tr>
                      <th>Stock</th>
                      <th>Qty</th>
                      <th>Price</th>
                      <th>Type</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.recentOrders.slice(0, 8).map((o, i) => (
                      <tr key={i}>
                        <td className="admin-tbl-name">{o.name}</td>
                        <td>{o.qty}</td>
                        <td>₹{formatCurrency(o.price)}</td>
                        <td>
                          <span className={`admin-mode-tag ${o.mode === "BUY" ? "buy" : "sell"}`}>
                            {o.mode}
                          </span>
                        </td>
                        <td>₹{formatCurrency(o.qty * o.price)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* USERS TAB */}
      {activeTab === "users" && (
        <div className="admin-content">
          <div className="admin-card">
            <div className="admin-card-hdr">
              <h3>👥 Registered Users</h3>
              <span className="admin-card-badge">{users.length} users</span>
            </div>
            {users.length > 0 ? (
              <div className="admin-users-grid">
                {users.map((user) => (
                  <div
                    key={user._id}
                    className={`admin-user-card ${selectedUser === user._id ? "selected" : ""}`}
                    onClick={() => viewUser(user._id)}
                  >
                    <div className="admin-user-avatar">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="admin-user-info">
                      <h4>{user.name}</h4>
                      <p className="admin-user-email">{user.email}</p>
                    </div>
                    <div className="admin-user-bal">
                      <span className="admin-user-bal-label">Balance</span>
                      <span className="admin-user-bal-value">₹{formatCurrency(user.balance)}</span>
                    </div>
                    <div className="admin-user-date">
                      Joined {new Date(user.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </div>
                    <button className="admin-user-view-btn">View →</button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="admin-empty">
                <p>No users registered yet.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MARKET TAB */}
      {activeTab === "market" && analytics && (
        <div className="admin-content">
          <div className="admin-card">
            <div className="admin-card-hdr">
              <h3>🔥 Most Traded Stocks</h3>
            </div>
            {analytics.topStocks.length > 0 ? (
              <div className="admin-stocks-grid">
                {analytics.topStocks.map((stock, i) => (
                  <div key={i} className="admin-stock-card">
                    <div className="admin-stock-rank">#{i + 1}</div>
                    <div className="admin-stock-info">
                      <h4>{stock.name}</h4>
                      <p>{stock.totalQty.toLocaleString()} units traded</p>
                    </div>
                    <div className="admin-stock-bar">
                      <div
                        className="admin-stock-bar-fill"
                        style={{
                          width: `${(stock.totalQty / analytics.topStocks[0].totalQty) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="admin-empty">
                <p>No trading data yet.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* USER DETAIL TAB */}
      {activeTab === "userDetail" && userData && (
        <div className="admin-content">
          {/* User Header */}
          <div className="admin-user-detail-hdr">
            <div className="admin-user-detail-avatar">
              {userData.user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2>{userData.user.name}</h2>
              <p>{userData.user.email}</p>
            </div>
          </div>

          {/* User KPIs */}
          <div className="admin-kpi-grid admin-kpi-grid-6">
            <div className="admin-kpi-mini">
              <p className="admin-kpi-label">Balance</p>
              <h3 className="admin-kpi-value">₹{formatCurrency(userData.user.balance)}</h3>
            </div>
            <div className="admin-kpi-mini">
              <p className="admin-kpi-label">Investment</p>
              <h3 className="admin-kpi-value">₹{formatCurrency(userData.analytics.totalInvestment)}</h3>
            </div>
            <div className="admin-kpi-mini">
              <p className="admin-kpi-label">Current Value</p>
              <h3 className="admin-kpi-value">₹{formatCurrency(userData.analytics.totalCurrentValue)}</h3>
            </div>
            <div className="admin-kpi-mini">
              <p className="admin-kpi-label">P&L</p>
              <h3 className={`admin-kpi-value ${userData.analytics.totalPnL >= 0 ? "text-profit" : "text-loss"}`}>
                {userData.analytics.totalPnL >= 0 ? "+" : ""}₹{formatCurrency(userData.analytics.totalPnL)}
              </h3>
            </div>
            <div className="admin-kpi-mini">
              <p className="admin-kpi-label">Orders</p>
              <h3 className="admin-kpi-value">{userData.analytics.totalOrders}</h3>
            </div>
            <div className="admin-kpi-mini">
              <p className="admin-kpi-label">Buy / Sell</p>
              <h3 className="admin-kpi-value">{userData.analytics.buyOrders} / {userData.analytics.sellOrders}</h3>
            </div>
          </div>

          {/* User Holdings */}
          {userData.holdings.length > 0 && (
            <div className="admin-card">
              <div className="admin-card-hdr">
                <h3>💼 Holdings ({userData.holdings.length})</h3>
              </div>
              <div className="admin-tbl-wrap">
                <table className="admin-tbl">
                  <thead>
                    <tr>
                      <th>Stock</th>
                      <th>Qty</th>
                      <th>Avg Price</th>
                      <th>LTP</th>
                      <th>P&L</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userData.holdings.map((h, i) => {
                      const pnl = (h.price - h.avg) * h.qty;
                      return (
                        <tr key={i}>
                          <td className="admin-tbl-name">{h.name}</td>
                          <td>{h.qty}</td>
                          <td>₹{formatCurrency(h.avg)}</td>
                          <td>₹{formatCurrency(h.price)}</td>
                          <td className={pnl >= 0 ? "text-profit" : "text-loss"}>
                            {pnl >= 0 ? "+" : ""}₹{formatCurrency(pnl)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* User Orders */}
          {userData.orders.length > 0 && (
            <div className="admin-card">
              <div className="admin-card-hdr">
                <h3>📋 Order History ({userData.orders.length})</h3>
              </div>
              <div className="admin-tbl-wrap">
                <table className="admin-tbl">
                  <thead>
                    <tr>
                      <th>Stock</th>
                      <th>Qty</th>
                      <th>Price</th>
                      <th>Type</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userData.orders.slice(0, 20).map((o, i) => (
                      <tr key={i}>
                        <td className="admin-tbl-name">{o.name}</td>
                        <td>{o.qty}</td>
                        <td>₹{formatCurrency(o.price)}</td>
                        <td>
                          <span className={`admin-mode-tag ${o.mode === "BUY" ? "buy" : "sell"}`}>
                            {o.mode}
                          </span>
                        </td>
                        <td>{new Date(o.createdAt).toLocaleString("en-IN")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {userData.holdings.length === 0 && userData.orders.length === 0 && (
            <div className="admin-empty">
              <p>This user has no trading activity yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
