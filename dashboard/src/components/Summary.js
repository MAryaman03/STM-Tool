import React, { useEffect, useState, useMemo, useContext } from "react";
import axios from "axios";
import GeneralContext from "./GeneralContext";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3002";

const Summary = () => {
  const { refreshKey } = useContext(GeneralContext);

  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================
  // Fetch Holdings (Auto Refresh)
  // ==========================
  const fetchHoldings = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${API_URL}/allHoldings`);
      setHoldings(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Error fetching summary data:", err);
      setError("Failed to load summary data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHoldings();
  }, [refreshKey]); // 🔥 Auto update when order placed

  // ==========================
  // Owned Stocks Only
  // ==========================
  const ownedStocks = useMemo(() => {
    return holdings.filter((stock) => stock.qty > 0);
  }, [holdings]);

  // ==========================
  // Portfolio Calculations
  // ==========================
  const portfolio = useMemo(() => {
    const totalInvestment = ownedStocks.reduce(
      (acc, stock) => acc + stock.avg * stock.qty,
      0
    );

    const totalCurrentValue = ownedStocks.reduce(
      (acc, stock) => acc + stock.price * stock.qty,
      0
    );

    const totalPnL = totalCurrentValue - totalInvestment;
    const totalPnLPercent =
      totalInvestment > 0 ? (totalPnL / totalInvestment) * 100 : 0;

    return {
      totalInvestment,
      totalCurrentValue,
      totalPnL,
      totalPnLPercent,
    };
  }, [ownedStocks]);

  const formatCurrency = (value = 0) =>
    Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  if (loading) return <p>Loading summary...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <>
      <h3 className="title">Portfolio Summary</h3>

      {/* ===== Portfolio Cards ===== */}
      <div className="summary-container">
        <div className="summary-box">
          <h5>₹{formatCurrency(portfolio.totalInvestment)}</h5>
          <p>Total Investment</p>
        </div>

        <div className="summary-box">
          <h5>₹{formatCurrency(portfolio.totalCurrentValue)}</h5>
          <p>Current Value</p>
        </div>

        <div className="summary-box">
          <h5
            className={
              portfolio.totalPnL >= 0 ? "profit" : "loss"
            }
          >
            ₹{formatCurrency(portfolio.totalPnL)} (
            {portfolio.totalPnLPercent.toFixed(2)}%)
          </h5>
          <p>Total P&amp;L</p>
        </div>
      </div>

      {/* ===== Holdings Table ===== */}
      {ownedStocks.length === 0 ? (
        <p>No holdings yet.</p>
      ) : (
        <div className="order-table">
          <table>
            <thead>
              <tr>
                <th>Stock</th>
                <th>Qty</th>
                <th>Avg</th>
                <th>LTP</th>
                <th>Current Value</th>
                <th>P&amp;L</th>
              </tr>
            </thead>

            <tbody>
              {ownedStocks.map((stock) => {
                const currentValue = stock.price * stock.qty;
                const pnl =
                  currentValue - stock.avg * stock.qty;

                return (
                  <tr key={stock._id}>
                    <td>{stock.name}</td>
                    <td>{stock.qty}</td>
                    <td>₹{formatCurrency(stock.avg)}</td>
                    <td>₹{formatCurrency(stock.price)}</td>
                    <td>₹{formatCurrency(currentValue)}</td>
                    <td
                      className={pnl >= 0 ? "profit" : "loss"}
                    >
                      ₹{formatCurrency(pnl)}
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

export default Summary;