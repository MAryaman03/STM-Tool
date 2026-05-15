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
      staggerChildren: 0.12,
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
// Wave SVG Background
// ===========================
const WaveBackground = () => (
  <div className="wave-bg-container">
    <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
      <path
        className="wave-path-1"
        fill="rgba(16, 185, 129, 0.15)"
        d="M0,224L48,213.3C96,203,192,181,288,186.7C384,192,480,224,576,218.7C672,213,768,171,864,165.3C960,160,1056,192,1152,197.3C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
      />
      <path
        className="wave-path-2"
        fill="rgba(99, 102, 241, 0.1)"
        d="M0,288L48,272C96,256,192,224,288,213.3C384,203,480,213,576,229.3C672,245,768,267,864,261.3C960,256,1056,224,1152,208C1248,192,1344,192,1392,192L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
      />
      <path
        className="wave-path-3"
        fill="rgba(16, 185, 129, 0.08)"
        d="M0,256L48,261.3C96,267,192,277,288,272C384,267,480,245,576,234.7C672,224,768,224,864,234.7C960,245,1056,267,1152,261.3C1248,256,1344,224,1392,208L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
      />
    </svg>
  </div>
);

// ===========================
// Stock Chart Line
// ===========================
const ChartLine = () => (
  <div className="wave-chart-line">
    <svg viewBox="0 0 1200 200" preserveAspectRatio="none">
      <path
        className="chart-line-path"
        d="M0,150 L50,130 L100,140 L150,100 L200,110 L250,80 L300,90 L350,60 L400,70 L450,40 L500,55 L550,30 L600,50 L650,35 L700,45 L750,20 L800,40 L850,30 L900,50 L950,25 L1000,45 L1050,35 L1100,15 L1150,30 L1200,20"
        stroke="#10b981"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  </div>
);

// ===========================
// Market Ticker
// ===========================
const MarketTicker = () => {
  const items = [...tickerData, ...tickerData]; // duplicate for seamless loop

  return (
    <motion.div
      className="wave-ticker"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
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

// ===========================
// Wave Brand Logo
// ===========================
const WaveLogo = () => (
  <svg viewBox="0 0 40 40" fill="none">
    <defs>
      <linearGradient id="waveGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
    </defs>
    <circle cx="20" cy="20" r="18" fill="url(#waveGrad)" opacity="0.15" />
    <path
      d="M8,22 Q14,14 20,22 Q26,30 32,22"
      stroke="url(#waveGrad)"
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M8,18 Q14,10 20,18 Q26,26 32,18"
      stroke="url(#waveGrad)"
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
      opacity="0.5"
    />
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
// Main Login Component
// ===========================
function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const [userName, setUserName] = useState("");

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  }, [error]);

  const triggerError = useCallback((msg) => {
    setError(msg);
    setShakeKey((prev) => prev + 1);
  }, []);

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3002";
  const DASHBOARD_URL = process.env.REACT_APP_DASHBOARD_URL || "http://localhost:3001";

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      triggerError("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setLoading(false);
        triggerError(data.error || "Invalid email or password.");
        return;
      }

      // Store auth data
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userName", data.user.name);
      localStorage.setItem("wave_token", data.token);
      localStorage.setItem("wave_user", JSON.stringify(data.user));
      setUserName(data.user.name);

      setLoading(false);
      setShowLoadingScreen(true);
    } catch (err) {
      setLoading(false);
      triggerError("Server error. Please try again.");
    }
  }, [formData, triggerError, API_URL]);

  const handleLoadingComplete = useCallback(() => {
    const token = localStorage.getItem("wave_token");
    const user = JSON.parse(localStorage.getItem("wave_user") || "{}");
    const authParam = encodeURIComponent(JSON.stringify({ token, user }));
    if (user.role === "admin") {
      window.location.href = `${DASHBOARD_URL}/admin?auth=${authParam}`;
    } else {
      window.location.href = `${DASHBOARD_URL}?auth=${authParam}`;
    }
  }, [DASHBOARD_URL]);

  // Show loading screen after successful login
  if (showLoadingScreen) {
    return <LoadingScreen onComplete={handleLoadingComplete} userName={userName} />;
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

      {/* Login Card */}
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
            <p>Welcome back, Trader</p>
          </motion.div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                className="wave-error-msg"
                variants={errorVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
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
            {/* Email */}
            <motion.div className="wave-input-group" variants={itemVariants}>
              <input
                type="email"
                name="email"
                id="wave-email"
                placeholder=" "
                value={formData.email}
                onChange={handleChange}
                className={error ? "input-error" : ""}
                autoComplete="email"
                required
              />
              <label htmlFor="wave-email">Email Address</label>
            </motion.div>

            {/* Password */}
            <motion.div className="wave-input-group" variants={itemVariants}>
              <input
                type="password"
                name="password"
                id="wave-password"
                placeholder=" "
                value={formData.password}
                onChange={handleChange}
                className={error ? "input-error" : ""}
                autoComplete="current-password"
                required
              />
              <label htmlFor="wave-password">Password</label>
            </motion.div>

            {/* Login Button */}
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
                    Processing...
                  </>
                ) : (
                  "Login to Dashboard"
                )}
              </motion.button>
            </motion.div>
          </form>

          {/* Divider */}
          <motion.div className="wave-divider" variants={itemVariants}>
            <span>or</span>
          </motion.div>

          {/* Create Account */}
          <motion.div className="wave-login-footer" variants={itemVariants}>
            Don't have an account?
            <button type="button" onClick={() => navigate("/signup")}>
              Create Account
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default Login;