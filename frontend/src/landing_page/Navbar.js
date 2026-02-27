import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
      className="navbar navbar-expand-lg border-bottom"
      style={{
        background: "radial-gradient(circle, rgba(238, 174, 202, 1) 0%, rgba(148, 187, 233, 1) 100%)"
      }}
    >
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand" to="/">
          <img
            src="/images/logo.svg"
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

                {/* ✅ Dashboard Link (Separate App) */}
                <li className="nav-item">
                  <a
                    className="nav-link"
                    href="http://localhost:3000"   // 🔥 Change port if needed
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

            {/* Common Links */}
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