import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import GeneralContext from "./GeneralContext";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3002";

const FRONTEND_URL = "http://localhost:3001/";

const WatchList = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { openBuyWindow } = useContext(GeneralContext);

  // ==========================
  // Fetch Watchlist
  // ==========================
  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const response = await axios.get(`${API_URL}/allWatchlist`);
        setStocks(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Failed to fetch watchlist:", err);
        setError("Failed to load watchlist.");
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, []);

  const formatCurrency = (value = 0) =>
    Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  if (loading) return <p>Loading watchlist...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <>
      <div className="watchlist-header">
        <a 
          href={FRONTEND_URL} 
          className="back-home-btn" 
          id="back-home-button" 
          title="Back to Home"
          onClick={(e) => {
            e.preventDefault();
            window.location.href = FRONTEND_URL;
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </a>
        <h3 className="title">Watchlist ({stocks.length})</h3>
      </div>

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Stock</th>
              <th>Price</th>
              <th>Change</th>
            </tr>
          </thead>

          <tbody>
            {stocks.map((stock, index) => {
              const price = stock.price || 0;
              const avg = stock.avg || price;
              
              let finalPercentStr = "0.00%";
              let finalIsDown = false;

              // Calculate overall change based on LTP vs AVG
              if (avg > 0 && price > 0 && price !== avg) {
                const diff = price - avg;
                const perc = (diff / avg) * 100;
                finalPercentStr = Math.abs(perc).toFixed(2) + "%";
                finalIsDown = perc < 0;
              } else {
                finalPercentStr = stock.percent || stock.day || "0.00%";
                finalIsDown = stock.isDown !== undefined ? stock.isDown : stock.isLoss;
              }

              // Add a plus/minus sign to the string
              const displayPercent = finalPercentStr.replace("-", "").replace("+", "");
              const formattedPercent = finalIsDown 
                ? `-${displayPercent}` 
                : (displayPercent === "0%" || displayPercent === "0.00%") 
                  ? displayPercent 
                  : `+${displayPercent}`;

              return (
                <tr
                  key={stock._id || `${stock.name}-${index}`}
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    openBuyWindow({
                      name: stock.name,
                      price: price,
                    })
                  }
                >
                  <td>{stock.name}</td>
                  <td>₹{formatCurrency(price)}</td>
                  <td className={finalIsDown ? "loss" : "profit"}>
                    {formattedPercent}
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

export default WatchList;