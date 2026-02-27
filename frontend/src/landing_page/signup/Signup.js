import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../index.css";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [strength, setStrength] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "password") {
      if (value.length < 6) setStrength("Weak");
      else if (value.length < 10) setStrength("Medium");
      else setStrength("Strong");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const { name, email, phone, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const existingUser = users.find((user) => user.email === email);

    if (existingUser) {
      setError("Account already exists. Please login instead.");
      return;
    }

    const newUser = { name, email, phone, password };
    users.push(newUser);

    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userName", name);

    navigate("/", { replace: true });
  };

  return (
    <div className="luxury-signup">

      {/* Live Market Ticker */}
      <div className="market-ticker">
        RELIANCE ₹2,112 ▲1.2% | TCS ₹3,194 ▼0.3% | INFY ₹1,555 ▲0.8% |
        HDFCBANK ₹1,522 ▲0.6% | SBIN ₹430 ▲0.4%
      </div>

      <div className="glass-card">

        <h2>Create Your Wave Trading Account</h2>
        <p className="subtitle">
          Zero brokerage. Smart investing. Professional tools.
        </p>

        {error && (
          <div className="error-box">{error}</div>
        )}

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Create Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {strength && (
            <div className={`strength ${strength.toLowerCase()}`}>
              Password Strength: {strength}
            </div>
          )}

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <button type="submit" className="primary-btn">
            Create Account
          </button>

        </form>

        {/* Login Section */}
        <div className="login-section">
          <span>Already have an account?</span>
          <button
            type="button"
            className="secondary-btn"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>

      </div>
    </div>
  );
}

export default Signup;