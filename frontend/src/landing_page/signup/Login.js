import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../index.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const existingUser = users.find(
      (user) =>
        user.email === formData.email &&
        user.password === formData.password
    );

    if (!existingUser) {
      setError("Invalid email or password.");
      return;
    }

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userName", existingUser.name);

    navigate("/", { replace: true });
  };

  return (
    <div className="luxury-signup">

      <div className="market-ticker">
        RELIANCE ₹2,112 ▲1.2% | TCS ₹3,194 ▼0.3% | INFY ₹1,555 ▲0.8% |
        HDFCBANK ₹1,522 ▲0.6% | SBIN ₹430 ▲0.4%
      </div>

      <div className="glass-card">

        <h2>Welcome Back Trader</h2>
        <p className="subtitle">
          Login to access your trading dashboard.
        </p>

        {error && (
          <div className="error-box">{error}</div>
        )}

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit" className="primary-btn">
            Login
          </button>

        </form>

        <div className="login-section">
          <span>Don't have an account?</span>
          <button
            type="button"
            className="secondary-btn"
            onClick={() => navigate("/signup")}
          >
            Create Account
          </button>
        </div>

      </div>
    </div>
  );
}

export default Login;