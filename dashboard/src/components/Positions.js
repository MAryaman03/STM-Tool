import React, { useEffect, useState } from "react";
import api from "../utils/api";

const Positions = () => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ==========================
  // Fetch Positions
  // ==========================
  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const response = await api.get("/allPositions");
        setPositions(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Error fetching positions:", err);
        setError("Failed to load positions.");
      } finally {
        setLoading(false);
      }
    };

    fetchPositions();
  }, []);

  // ==========================
  // Currency Formatter
  // ==========================
  const formatCurrency = (value = 0) => {
    return Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  if (loading) return <p>Loading positions...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <>
      <h3 className="title">Positions ({positions.length})</h3>

      {positions.length === 0 ? (
        <div className="positions-empty">
          <div className="positions-empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
          <h4>No open positions</h4>
          <p>Your intraday and delivery positions will appear here once you start trading.</p>
        </div>
      ) : (
        <div className="order-table">
          <table>
            <thead>
              <tr>
                <th className="text-left">Product</th>
                <th className="text-left">Stock</th>
                <th className="text-right">Qty</th>
                <th className="text-right">Avg</th>
                <th className="text-right">LTP</th>
                <th className="text-right">P&L</th>
                <th className="text-right">Net</th>
                <th className="text-right">Day</th>
              </tr>
            </thead>

            <tbody>
              {positions.map((stock, index) => {
                const qty = stock.qty || 0;
                const avg = stock.avg || 0;
                const price = stock.price || 0;

                const pnl = price * qty - avg * qty;

                const pnlClass = pnl >= 0 ? "profit" : "loss";
                const dayVal = stock.dayPercent || stock.day || 0;
                const dayClass =
                  typeof dayVal === "string"
                    ? dayVal.includes("-") ? "loss" : "profit"
                    : dayVal < 0 ? "loss" : "profit";

                return (
                  <tr key={stock._id || `${stock.name}-${index}`}>
                    <td className="text-left">{stock.product || "CNC"}</td>
                    <td className="text-left">{stock.name || "-"}</td>
                    <td className="text-right">{qty}</td>
                    <td className="text-right">₹{formatCurrency(avg)}</td>
                    <td className="text-right">₹{formatCurrency(price)}</td>
                    <td className={`text-right ${pnlClass}`}>
                      ₹{formatCurrency(pnl)}
                    </td>
                    <td className={`text-right ${pnlClass}`}>
                      {stock.netPercent != null
                        ? `${stock.netPercent >= 0 ? "+" : ""}${Number(stock.netPercent).toFixed(2)}%`
                        : stock.net || "-"}
                    </td>
                    <td className={`text-right ${dayClass}`}>
                      {typeof dayVal === "number"
                        ? `${dayVal >= 0 ? "+" : ""}${dayVal.toFixed(2)}%`
                        : dayVal || "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default Positions;