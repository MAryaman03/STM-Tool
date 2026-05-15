import React, {
  useState,
  useContext,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import api from "../utils/api";
import GeneralContext from "./GeneralContext";
import VerticalGraph from "./VerticalGraph";
import "./BuyActionWindow.css";

const BuyActionWindow = ({ uid, currentPrice = 0 }) => {
  const { closeBuyWindow, refreshDashboard } = useContext(GeneralContext);

  const [mode, setMode] = useState("BUY");
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(currentPrice);
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmStep, setConfirmStep] = useState(false);

  // =====================================
  // Sync price when selected stock changes
  // =====================================
  useEffect(() => {
    setPrice(currentPrice || 0);
  }, [currentPrice]);

  // =====================================
  // Fetch Holdings
  // =====================================
  const fetchHoldings = useCallback(async () => {
    try {
      const res = await api.get("/allHoldings");
      setHoldings(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch holdings:", err);
    }
  }, []);

  useEffect(() => {
    fetchHoldings();
  }, [fetchHoldings]);

  // Disable background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // =====================================
  // Safe Parsed Values
  // =====================================
  const parsedQuantity = useMemo(
    () => Math.max(1, parseInt(quantity) || 1),
    [quantity]
  );

  const parsedPrice = useMemo(
    () => Math.max(0.05, parseFloat(price) || 0),
    [price]
  );

  const totalAmount = useMemo(
    () => parsedQuantity * parsedPrice,
    [parsedQuantity, parsedPrice]
  );

  // =====================================
  // Sell Validation
  // =====================================
  const ownedStock = useMemo(
    () => holdings.find((h) => h.name === uid),
    [holdings, uid]
  );

  // =====================================
  // P&L Preview (For Sell)
  // =====================================
  const pnlPreview = useMemo(() => {
    if (!ownedStock || mode !== "SELL") return null;
    const difference = parsedPrice - ownedStock.avg;
    return difference * parsedQuantity;
  }, [ownedStock, mode, parsedPrice, parsedQuantity]);

  // =====================================
  // Graph Data
  // =====================================
  const graphData = useMemo(() => {
    if (!holdings.length) return null;

    return {
      labels: holdings.map((stock) => stock.name),
      datasets: [
        {
          label: "Average Price",
          data: holdings.map((stock) => stock.avg),
          backgroundColor: "rgba(54,162,235,0.7)",
          borderRadius: 6,
        },
        {
          label: "Current Price",
          data: holdings.map((stock) => stock.price),
          backgroundColor: holdings.map((stock) =>
            stock.price >= stock.avg
              ? "rgba(75,192,192,0.7)"
              : "rgba(255,99,132,0.7)"
          ),
          borderRadius: 6,
        },
      ],
    };
  }, [holdings]);

  // =====================================
  // Submit Order
  // =====================================
  const handleSubmit = async () => {
    setError("");

    if (!uid) {
      setError("No stock selected.");
      return;
    }

    if (parsedQuantity <= 0 || parsedPrice <= 0) {
      setError("Invalid quantity or price.");
      return;
    }

    if (mode === "SELL") {
      if (!ownedStock) {
        setError("You do not own this stock.");
        return;
      }

      if (parsedQuantity > ownedStock.qty) {
        setError(`You only have ${ownedStock.qty} shares.`);
        return;
      }
    }

    // Two-step confirmation: first click shows confirm, second click executes
    if (!confirmStep) {
      setConfirmStep(true);
      return;
    }

    try {
      setLoading(true);

      await api.post("/newOrder", {
        name: uid,
        qty: parsedQuantity,
        price: parsedPrice,
        mode,
      });

      // Backend handles funds deduction/addition automatically

      setConfirmStep(false);
      await fetchHoldings();
      refreshDashboard?.();
      closeBuyWindow();
    } catch (err) {
      setConfirmStep(false);
      setError(
        err.response?.data?.error || "Transaction failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // UI
  // =====================================
  return (
    <div className="modal-overlay">
      <div className="container position-relative" id="trade-window">

        {/* Back Arrow */}
      <button className="trade-back-btn" onClick={closeBuyWindow} title="Back to Dashboard">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
      </button>

      {loading && (
        <div className="loading-overlay">
          Processing Order...
        </div>
      )}

      <div className="regular-order" style={{ justifyContent: "flex-start", overflowY: "auto", paddingTop: "70px" }}>

        {graphData && (
          <div style={{ width: "100%", flexGrow: 1, display: "flex", flexDirection: "column" }}>
            <VerticalGraph data={graphData} />
          </div>
        )}

        <h3 style={{ marginBottom: "15px", marginTop: "10px", textAlign: "center", width: "100%" }}>
          {mode} {uid}
        </h3>

        {/* Mode Toggle */}
        <div style={{ display: "flex", gap: "15px", marginBottom: "20px", justifyContent: "center", width: "100%" }}>
          <button
            className={`btn ${mode === "BUY" ? "btn-green" : "btn-grey"}`}
            onClick={() => setMode("BUY")}
            disabled={loading}
          >
            Buy
          </button>

          <button
            className={`btn ${mode === "SELL" ? "btn-green" : "btn-grey"}`}
            onClick={() => setMode("SELL")}
            disabled={loading || !ownedStock}
          >
            Sell
          </button>
        </div>

        {/* Inputs */}
        <div className="inputs">
          <fieldset>
            <legend>Quantity</legend>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              disabled={loading}
            />
          </fieldset>

          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              step="0.05"
              min="0.05"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              disabled={loading}
            />
          </fieldset>
        </div>

        {/* Total */}
        <div
          style={{
            marginTop: "20px",
            fontSize: "1.2rem",
            fontWeight: 700,
            color: mode === "BUY" ? "#22c55e" : "#fb7185",
          }}
        >
          Total: ₹{totalAmount.toLocaleString("en-IN")}
        </div>

        {/* P&L Preview */}
        {pnlPreview !== null && (
          <div
            style={{
              marginTop: "10px",
              fontWeight: 600,
              color: pnlPreview >= 0 ? "#22c55e" : "#fb7185",
            }}
          >
            Estimated P&L: ₹{pnlPreview.toLocaleString("en-IN")}
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ color: "#fb7185", marginTop: "15px" }}>
            {error}
          </div>
        )}

      </div>

      {/* Footer Buttons */}
      <div className="buttons">
        <span>
          Required: ₹{totalAmount.toLocaleString("en-IN")}
        </span>

        <div style={{ display: "flex", gap: "20px" }}>
          <button
            className={`btn ${confirmStep ? "btn-confirm-pulse" : "btn-green"}`}
            onClick={handleSubmit}
            disabled={loading}
            style={confirmStep ? {
              background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
              boxShadow: "0 8px 20px rgba(245, 158, 11, 0.35)",
              animation: "pulse 1s infinite"
            } : {}}
          >
            {loading ? "Processing..." : confirmStep ? `Confirm ${mode} ✓` : mode}
          </button>

          <button
            className="btn btn-grey"
            onClick={() => { setConfirmStep(false); closeBuyWindow(); }}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </div>

      </div>
    </div>
  );
};

export default BuyActionWindow;