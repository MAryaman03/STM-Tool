import React, { useEffect, useState } from "react";
import axios from "axios";

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
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL || "http://localhost:3002"}/allPositions`
        );

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

      <div className="order-tables">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Stock</th>
              <th>Qty</th>
              <th>Avg</th>
              <th>LTP</th>
              <th>P&amp;L</th>
              <th>Net</th>
              <th>Day</th>
            </tr>
          </thead>

          <tbody>
            {positions.map((stock, index) => {
              const qty = stock.qty || 0;
              const avg = stock.avg || 0;
              const price = stock.price || 0;

              const pnl = price * qty - avg * qty;

              const pnlClass = pnl >= 0 ? "profit" : "loss";
              const dayClass =
                typeof stock.day === "string" && stock.day.includes("-")
                  ? "loss"
                  : "profit";

              return (
                <tr key={stock._id || `${stock.name}-${index}`}>
                  <td>{stock.product || "-"}</td>
                  <td>{stock.name || "-"}</td>
                  <td>{qty}</td>
                  <td>₹{formatCurrency(avg)}</td>
                  <td>₹{formatCurrency(price)}</td>
                  <td className={pnlClass}>
                    ₹{formatCurrency(pnl)}
                  </td>
                  <td className={pnlClass}>
                    {stock.net || "-"}
                  </td>
                  <td className={dayClass}>
                    {stock.day || "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Positions;