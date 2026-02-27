import React, { useEffect, useState, useMemo, useContext } from "react";
import axios from "axios";
import VerticalGraph from "./VerticalGraph";
import GeneralContext from "./GeneralContext";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3002";

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

      const res = await axios.get(`${API_URL}/allHoldings`);
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
          backgroundColor: "rgba(54, 162, 235, 0.6)",
        },
        {
          label: "Current Price",
          data: ownedStocks.map(stock => Number(stock.price || 0)),
          backgroundColor: ownedStocks.map(stock =>
            Number(stock.price) >= Number(stock.avg)
              ? "rgba(75, 192, 192, 0.6)"
              : "rgba(255, 99, 132, 0.6)"
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
        <p>No holdings yet.</p>
      ) : (
        <>
          <div className="order-table">
            <table>
              <thead>
                <tr>
                  <th>Instrument</th>
                  <th>Qty</th>
                  <th>Avg Cost</th>
                  <th>LTP</th>
                  <th>Current Value</th>
                  <th>P&amp;L</th>
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
                      <td>{stock.name}</td>
                      <td>{qty}</td>
                      <td>₹{formatCurrency(avg)}</td>
                      <td>₹{formatCurrency(price)}</td>
                      <td>₹{formatCurrency(currentValue)}</td>
                      <td className={pnl >= 0 ? "profit" : "loss"}>
                        ₹{formatCurrency(pnl)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Portfolio Summary */}
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

          {/* Graph */}
          {graphData && <VerticalGraph data={graphData} />}
        </>
      )}
    </>
  );
};

export default Holdings;