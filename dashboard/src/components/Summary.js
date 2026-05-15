import React, { useEffect, useState, useMemo, useContext } from "react";
import api from "../utils/api";
import GeneralContext from "./GeneralContext";

const Summary = () => {
  const { refreshKey } = useContext(GeneralContext);

  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [fundsBalance, setFundsBalance] = useState(0);

  // ==========================
  // Fetch Holdings (Auto Refresh)
  // ==========================
  const fetchHoldings = async () => {
    try {
      setLoading(true);

      const response = await api.get("/allHoldings");
      setHoldings(Array.isArray(response.data) ? response.data : []);

      // Also fetch funds balance
      try {
        const fundsRes = await api.get("/funds/balance");
        setFundsBalance(fundsRes.data.balance || 0);
      } catch {} // ignore if fails
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
      <div className="summary-cards-grid four-col">
        <div className="summary-card">
          <p className="summary-card-label">Available Funds</p>
          <h4 className="summary-card-value" style={{ color: "#34d399" }}>
            ₹{formatCurrency(fundsBalance)}
          </h4>
        </div>

        <div className="summary-card">
          <p className="summary-card-label">Total Investment</p>
          <h4 className="summary-card-value">
            ₹{formatCurrency(portfolio.totalInvestment)}
          </h4>
        </div>

        <div className="summary-card">
          <p className="summary-card-label">Current Value</p>
          <h4 className="summary-card-value">
            ₹{formatCurrency(portfolio.totalCurrentValue)}
          </h4>
        </div>

        <div className="summary-card">
          <p className="summary-card-label">Total P&L</p>
          <h4 className={`summary-card-value ${portfolio.totalPnL >= 0 ? "profit" : "loss"}`}>
            ₹{formatCurrency(portfolio.totalPnL)}
          </h4>
          <span className={`summary-card-percent ${portfolio.totalPnL >= 0 ? "profit" : "loss"}`}>
            {portfolio.totalPnLPercent >= 0 ? "+" : ""}
            {portfolio.totalPnLPercent.toFixed(2)}%
          </span>
        </div>
      </div>

      {/* ===== Holdings Table ===== */}
      {ownedStocks.length === 0 ? (
        <div className="positions-empty">
          <div className="positions-empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
          <h4>No stocks in portfolio</h4>
          <p>Start by adding funds and buying stocks from the watchlist.</p>
        </div>
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
                <th>P&L</th>
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