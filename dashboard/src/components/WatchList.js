import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import GeneralContext from "./GeneralContext";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3002";

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
      <h3 className="title">Watchlist ({stocks.length})</h3>

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
              const percent = stock.percent || "0%";
              const isDown = stock.isDown;

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
                  <td className={isDown ? "loss" : "profit"}>
                    {percent}
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