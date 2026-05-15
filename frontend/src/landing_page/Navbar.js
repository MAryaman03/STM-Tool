import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dashboardUrl =
    process.env.REACT_APP_DASHBOARD_URL || "http://localhost:3000";

  useEffect(() => {
    const status = localStorage.getItem("isLoggedIn");
    setIsLoggedIn(status === "true");
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userName");
    navigate("/", { replace: true });
  };

  const isActive = (path) =>
    location.pathname === path ? "active" : "";

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark"
      style={{
        background: "linear-gradient(135deg, rgba(2, 6, 23, 0.9) 0%, rgba(4, 27, 20, 0.9) 100%)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img
            src={process.env.PUBLIC_URL + "/images/newlogo.png"}
            alt="Wave Logo"
            style={{ height: "150px", width: "auto" }}
          />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto">
            {isLoggedIn ? (
              <>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive("/")}`} to="/">
                    Home
                  </Link>
                </li>

                <li className="nav-item">
                  <a
                    className="nav-link"
                    href={`${dashboardUrl}?auth=${encodeURIComponent(
                      JSON.stringify({
                        token: localStorage.getItem("wave_token"),
                        user: JSON.parse(localStorage.getItem("wave_user") || "{}"),
                      })
                    )}`}
                  >
                    Dashboard
                  </a>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link className="nav-link" to="/signup">
                  Signup
                </Link>
              </li>
            )}

            <li className="nav-item">
              <Link className={`nav-link ${isActive("/about")}`} to="/about">
                About
              </Link>
            </li>

            <li className="nav-item">
              <Link className={`nav-link ${isActive("/product")}`} to="/product">
                Product
              </Link>
            </li>

            <li className="nav-item">
              <Link className={`nav-link ${isActive("/pricing")}`} to="/pricing">
                Pricing
              </Link>
            </li>

            <li className="nav-item">
              <Link className={`nav-link ${isActive("/support")}`} to="/support">
                Support
              </Link>
            </li>

            <li className="nav-item">
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="nav-link btn btn-link"
                  style={{ textDecoration: "none" }}
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="nav-link"
                  style={{ textDecoration: "none" }}
                >
                  Login
                </Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
