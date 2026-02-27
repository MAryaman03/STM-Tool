import React, {
  useState,
  useContext,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";
import GeneralContext from "./GeneralContext";
import VerticalGraph from "./VerticalGraph";
import "./BuyActionWindow.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3002";

const BuyActionWindow = ({ uid, currentPrice = 0 }) => {
  const { closeBuyWindow, refreshDashboard } = useContext(GeneralContext);

  const [mode, setMode] = useState("BUY");
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(currentPrice);
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      const res = await axios.get(`${API_URL}/allHoldings`);
      setHoldings(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch holdings:", err);
    }
  }, []);

  useEffect(() => {
    fetchHoldings();
  }, [fetchHoldings]);

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

    const confirm = window.confirm(
      `Confirm ${mode} ${parsedQuantity} shares of ${uid} at ₹${parsedPrice}?`
    );

    if (!confirm) return;

    try {
      setLoading(true);

      await axios.post(`${API_URL}/newOrder`, {
        name: uid,
        qty: parsedQuantity,
        price: parsedPrice,
        mode,
      });

      await fetchHoldings();
      refreshDashboard?.();
      closeBuyWindow();
    } catch (err) {
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
    <div className="container position-relative" id="trade-window">

      {loading && (
        <div className="loading-overlay">
          Processing Order...
        </div>
      )}

      <div className="regular-order">

        {graphData && (
          <div style={{ marginBottom: "40px" }}>
            <VerticalGraph data={graphData} />
          </div>
        )}

        <h3 style={{ marginBottom: "25px" }}>
          {mode} {uid}
        </h3>

        {/* Mode Toggle */}
        <div style={{ display: "flex", gap: "20px", marginBottom: "25px" }}>
          <button
            className={`btn ${mode === "BUY" ? "btn-blue" : "btn-grey"}`}
            onClick={() => setMode("BUY")}
            disabled={loading}
          >
            Buy
          </button>

          <button
            className={`btn ${mode === "SELL" ? "btn-blue" : "btn-grey"}`}
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
            color: mode === "BUY" ? "#2563eb" : "#dc2626",
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
              color: pnlPreview >= 0 ? "#16a34a" : "#dc2626",
            }}
          >
            Estimated P&L: ₹{pnlPreview.toLocaleString("en-IN")}
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ color: "#ff4d4f", marginTop: "15px" }}>
            {error}
          </div>
        )}

      </div>

      {/* Footer Buttons */}
      <div className="buttons">
        <span>
          Required: ₹{totalAmount.toLocaleString("en-IN")}
        </span>

        <div style={{ display: "flex", gap: "25px" }}>
          <button
            className="btn btn-blue"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Processing..." : mode}
          </button>

          <button
            className="btn btn-grey"
            onClick={closeBuyWindow}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </div>

    </div>
  );
};

export default BuyActionWindow;