import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import LoadingScreen from "./LoadingScreen";
import "./Login.css";

// ===========================
// Animation Variants
// ===========================
const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const errorVariants = {
  hidden: { opacity: 0, height: 0, marginBottom: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    marginBottom: 20,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    height: 0,
    marginBottom: 0,
    transition: { duration: 0.2 },
  },
};

const shakeVariants = {
  shake: {
    x: [0, -8, 8, -6, 6, -3, 3, 0],
    transition: { duration: 0.4 },
  },
};

const buttonVariants = {
  idle: { scale: 1 },
  hover: { scale: 1.03 },
  tap: { scale: 0.97 },
};

// ===========================
// Ticker Data
// ===========================
const tickerData = [
  { name: "RELIANCE", price: "₹2,112.40", change: "+1.44%", up: true },
  { name: "TCS", price: "₹3,194.80", change: "-0.25%", up: false },
  { name: "INFY", price: "₹1,555.30", change: "+0.82%", up: true },
  { name: "HDFCBANK", price: "₹1,522.60", change: "+0.61%", up: true },
  { name: "SBIN", price: "₹5,000.00", change: "+0.40%", up: true },
  { name: "WIPRO", price: "₹577.75", change: "+0.32%", up: true },
  { name: "KPITTECH", price: "₹266.45", change: "+3.54%", up: true },
  { name: "M&M", price: "₹779.80", change: "-0.01%", up: false },
  { name: "TATAPOWER", price: "₹10,000", change: "+2.10%", up: true },
  { name: "QUICKHEAL", price: "₹308.55", change: "-0.15%", up: false },
];

// ===========================
// Shared Components
// ===========================
const WaveBackground = () => (
  <div className="wave-bg-container">
    <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
      <path className="wave-path-1" fill="rgba(16, 185, 129, 0.15)"
        d="M0,224L48,213.3C96,203,192,181,288,186.7C384,192,480,224,576,218.7C672,213,768,171,864,165.3C960,160,1056,192,1152,197.3C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
      <path className="wave-path-2" fill="rgba(99, 102, 241, 0.1)"
        d="M0,288L48,272C96,256,192,224,288,213.3C384,203,480,213,576,229.3C672,245,768,267,864,261.3C960,256,1056,224,1152,208C1248,192,1344,192,1392,192L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
      <path className="wave-path-3" fill="rgba(16, 185, 129, 0.08)"
        d="M0,256L48,261.3C96,267,192,277,288,272C384,267,480,245,576,234.7C672,224,768,224,864,234.7C960,245,1056,267,1152,261.3C1248,256,1344,224,1392,208L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
    </svg>
  </div>
);

const ChartLine = () => (
  <div className="wave-chart-line">
    <svg viewBox="0 0 1200 200" preserveAspectRatio="none">
      <path className="chart-line-path"
        d="M0,150 L50,130 L100,140 L150,100 L200,110 L250,80 L300,90 L350,60 L400,70 L450,40 L500,55 L550,30 L600,50 L650,35 L700,45 L750,20 L800,40 L850,30 L900,50 L950,25 L1000,45 L1050,35 L1100,15 L1150,30 L1200,20"
        stroke="#10b981" strokeWidth="2" fill="none" />
    </svg>
  </div>
);

const MarketTicker = () => {
  const items = [...tickerData, ...tickerData];
  return (
    <motion.div className="wave-ticker"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}>
      <div className="wave-ticker-inner">
        {items.map((item, i) => (
          <span key={i} className="ticker-item">
            <span className="ticker-name">{item.name}</span>
            <span>{item.price}</span>
            <span className={item.up ? "ticker-up" : "ticker-down"}>
              {item.up ? "▲" : "▼"} {item.change}
            </span>
          </span>
        ))}
      </div>
    </motion.div>
  );
};

const WaveLogo = () => (
  <svg viewBox="0 0 40 40" fill="none">
    <defs>
      <linearGradient id="waveGradSignup" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
    </defs>
    <circle cx="20" cy="20" r="18" fill="url(#waveGradSignup)" opacity="0.15" />
    <path d="M8,22 Q14,14 20,22 Q26,30 32,22" stroke="url(#waveGradSignup)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <path d="M8,18 Q14,10 20,18 Q26,26 32,18" stroke="url(#waveGradSignup)" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.5" />
  </svg>
);

const BackArrow = ({ onClick }) => (
  <motion.button
    className="wave-back-btn"
    onClick={onClick}
    title="Back to Home"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.3, delay: 0.3 }}
  >
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  </motion.button>
);

// ===========================
// Password Strength
// ===========================
const getStrength = (password) => {
  if (!password) return null;
  if (password.length < 6) return { label: "Weak", color: "#f43f5e" };
  if (password.length < 10) return { label: "Medium", color: "#f59e0b" };
  return { label: "Strong", color: "#10b981" };
};

// ===========================
// Main Signup Component
// ===========================
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
  const [loading, setLoading] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const [savedName, setSavedName] = useState("");

  const strength = getStrength(formData.password);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  }, [error]);

  const triggerError = useCallback((msg) => {
    setError(msg);
    setShakeKey((prev) => prev + 1);
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError("");

    const { name, email, phone, password, confirmPassword } = formData;

    if (!name || !email || !phone || !password || !confirmPassword) {
      triggerError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      triggerError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      triggerError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3002";

    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setLoading(false);
        triggerError(data.error || "Signup failed.");
        return;
      }

      // Store auth data
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userName", data.user.name);
      localStorage.setItem("wave_token", data.token);
      localStorage.setItem("wave_user", JSON.stringify(data.user));
      setSavedName(data.user.name);

      setLoading(false);
      setShowLoadingScreen(true);
    } catch (err) {
      setLoading(false);
      triggerError("Server error. Please try again.");
    }
  }, [formData, triggerError]);

  const inputFields = [
    { type: "text", name: "name", label: "Full Name", autoComplete: "name" },
    { type: "email", name: "email", label: "Email Address", autoComplete: "email" },
    { type: "tel", name: "phone", label: "Phone Number", autoComplete: "tel" },
    { type: "password", name: "password", label: "Create Password", autoComplete: "new-password" },
    { type: "password", name: "confirmPassword", label: "Confirm Password", autoComplete: "new-password" },
  ];

  const DASHBOARD_URL = process.env.REACT_APP_DASHBOARD_URL || "http://localhost:3000";

  const handleLoadingComplete = useCallback(() => {
    const token = localStorage.getItem("wave_token");
    const user = JSON.parse(localStorage.getItem("wave_user") || "{}");
    const authParam = encodeURIComponent(JSON.stringify({ token, user }));
    window.location.href = `${DASHBOARD_URL}?auth=${authParam}`;
  }, [DASHBOARD_URL]);

  if (showLoadingScreen) {
    return <LoadingScreen onComplete={handleLoadingComplete} userName={savedName} />;
  }

  return (
    <motion.div
      className="wave-login-page"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <WaveBackground />
      <ChartLine />
      <MarketTicker />

      {/* Back Arrow */}
      <BackArrow onClick={() => navigate("/")} />

      <motion.div
        className="wave-login-card"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        key={shakeKey}
      >
        <motion.div
          variants={error ? shakeVariants : {}}
          animate={error ? "shake" : ""}
        >
          {/* Brand */}
          <motion.div className="wave-brand" variants={itemVariants}>
            <div className="wave-brand-logo">
              <div className="wave-brand-icon">
                <WaveLogo />
              </div>
              <h1>Wave</h1>
            </div>
            <p>Create your trading account</p>
          </motion.div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div className="wave-error-msg"
                variants={errorVariants} initial="hidden" animate="visible" exit="exit">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {inputFields.map((field) => (
              <motion.div className="wave-input-group" variants={itemVariants} key={field.name}>
                <input
                  type={field.type}
                  name={field.name}
                  id={`wave-${field.name}`}
                  placeholder=" "
                  value={formData[field.name]}
                  onChange={handleChange}
                  className={error ? "input-error" : ""}
                  autoComplete={field.autoComplete}
                  required
                />
                <label htmlFor={`wave-${field.name}`}>{field.label}</label>
              </motion.div>
            ))}

            {/* Password Strength */}
            <AnimatePresence>
              {strength && (
                <motion.div
                  className="wave-strength"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ color: strength.color }}
                >
                  <span className="wave-strength-dot" style={{ background: strength.color }} />
                  Password Strength: {strength.label}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.div variants={itemVariants}>
              <motion.button
                type="submit"
                className="wave-login-btn"
                variants={buttonVariants}
                initial="idle"
                whileHover={loading ? "idle" : "hover"}
                whileTap={loading ? "idle" : "tap"}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="wave-spinner" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </motion.button>
            </motion.div>
          </form>

          {/* Divider */}
          <motion.div className="wave-divider" variants={itemVariants}>
            <span>or</span>
          </motion.div>

          {/* Login Link */}
          <motion.div className="wave-login-footer" variants={itemVariants}>
            Already have an account?
            <button type="button" onClick={() => navigate("/login")}>
              Login
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default Signup;