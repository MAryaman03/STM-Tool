import React, { useEffect, useState, useMemo, useContext } from "react";
import api from "../utils/api";
import VerticalGraph from "./VerticalGraph";
import GeneralContext from "./GeneralContext";

const Holdings = () => {
  const { refreshKey } = useContext(GeneralContext);

  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================
  // Fetch Holdings (Auto refresh)
  // ==========================
  const fetchHoldings = async () => {
    try {
      setLoading(true);

      const res = await api.get("/allHoldings");
      setHoldings(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch holdings:", err);
      setError("Failed to load holdings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHoldings();
  }, [refreshKey]); // 🔥 Auto refresh after Buy/Sell

  // ==========================
  // Owned Stocks Only
  // ==========================
  const ownedStocks = useMemo(() => {
    return holdings.filter(stock => Number(stock.qty) > 0);
  }, [holdings]);

  // ==========================
  // Portfolio Calculations
  // ==========================
  const portfolio = useMemo(() => {
    const totalInvestment = ownedStocks.reduce(
      (acc, stock) =>
        acc + Number(stock.avg || 0) * Number(stock.qty || 0),
      0
    );

    const totalCurrentValue = ownedStocks.reduce(
      (acc, stock) =>
        acc + Number(stock.price || 0) * Number(stock.qty || 0),
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

  // ==========================
  // Graph Data (Safe)
  // ==========================
  const graphData = useMemo(() => {
    if (ownedStocks.length === 0) return null;

    return {
      labels: ownedStocks.map(stock => stock.name),
      datasets: [
        {
          label: "Average Price",
          data: ownedStocks.map(stock => Number(stock.avg || 0)),
          backgroundColor: "rgba(99, 102, 241, 0.6)",
        },
        {
          label: "Current Price",
          data: ownedStocks.map(stock => Number(stock.price || 0)),
          backgroundColor: ownedStocks.map(stock =>
            Number(stock.price) >= Number(stock.avg)
              ? "rgba(16, 185, 129, 0.6)"
              : "rgba(251, 113, 133, 0.6)"
          ),
        },
      ],
    };
  }, [ownedStocks]);

  const formatCurrency = (value = 0) =>
    Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  if (loading) return <p>Loading holdings...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <>
      <h3 className="title">
        Holdings ({ownedStocks.length})
      </h3>

      {ownedStocks.length === 0 ? (
        <div className="positions-empty">
          <div className="positions-empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          </div>
          <h4>No holdings yet</h4>
          <p>Buy stocks from the watchlist to see your holdings here.</p>
        </div>
      ) : (
        <>
          {/* 1. Portfolio Summary Cards */}
          <div className="summary-cards-grid">
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

          {/* 2. Price Comparison Graph */}
          {graphData && <VerticalGraph data={graphData} />}

          {/* 3. Holdings Table */}
          <div className="order-table">
            <table>
              <thead>
                <tr>
                  <th className="text-left">Instrument</th>
                  <th className="text-right">Qty</th>
                  <th className="text-right">Avg Cost</th>
                  <th className="text-right">LTP</th>
                  <th className="text-right">Current Value</th>
                  <th className="text-right">P&L</th>
                </tr>
              </thead>

              <tbody>
                {ownedStocks.map((stock, index) => {
                  const qty = Number(stock.qty || 0);
                  const avg = Number(stock.avg || 0);
                  const price = Number(stock.price || 0);

                  const currentValue = price * qty;
                  const pnl = currentValue - avg * qty;

                  return (
                    <tr key={stock._id || `${stock.name}-${index}`}>
                      <td className="text-left">{stock.name}</td>
                      <td className="text-right">{qty}</td>
                      <td className="text-right">₹{formatCurrency(avg)}</td>
                      <td className="text-right">₹{formatCurrency(price)}</td>
                      <td className="text-right">₹{formatCurrency(currentValue)}</td>
                      <td className={`text-right ${pnl >= 0 ? "profit" : "loss"}`}>
                        ₹{formatCurrency(pnl)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
};

export default Holdings;