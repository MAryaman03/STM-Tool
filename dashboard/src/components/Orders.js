import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import GeneralContext from "./GeneralContext";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3002";

const Orders = () => {
  const { refreshKey } = useContext(GeneralContext);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_URL}/allOrders`);

      // Sort latest orders first
      const sortedOrders = [...res.data].reverse();

      setOrders(sortedOrders);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [refreshKey]); // 🔥 auto refresh when new order placed

  const formatCurrency = (value) =>
    Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <>
      <h3 className="title">Orders ({orders.length})</h3>

      {orders.length === 0 ? (
        <p>No orders placed yet.</p>
      ) : (
        <div className="order-table">
          <table>
            <thead>
              <tr>
                <th>Stock</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Mode</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => {
                const total = order.qty * order.price;

                return (
                  <tr key={order._id}> {/* ✅ FIXED KEY */}
                    <td>{order.name}</td>
                    <td>{order.qty}</td>
                    <td>₹{formatCurrency(order.price)}</td>
                    <td
                      className={
                        order.mode === "BUY" ? "profit" : "loss"
                      }
                    >
                      {order.mode}
                    </td>
                    <td>₹{formatCurrency(total)}</td>
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

export default Orders;