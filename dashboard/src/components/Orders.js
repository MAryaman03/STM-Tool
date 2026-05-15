import React, { useEffect, useState, useContext } from "react";
import api from "../utils/api";
import GeneralContext from "./GeneralContext";

const Orders = () => {
  const { refreshKey } = useContext(GeneralContext);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const res = await api.get("/allOrders");

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
                <th className="text-left">Stock</th>
                <th className="text-right">Qty</th>
                <th className="text-right">Price</th>
                <th className="text-center">Mode</th>
                <th className="text-right">Total</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => {
                const total = order.qty * order.price;

                return (
                  <tr key={order._id}> {/* ✅ FIXED KEY */}
                    <td className="text-left">{order.name}</td>
                    <td className="text-right">{order.qty}</td>
                    <td className="text-right">₹{formatCurrency(order.price)}</td>
                    <td
                      className={`text-center ${
                        order.mode === "BUY" ? "profit" : "loss"
                      }`}
                    >
                      {order.mode}
                    </td>
                    <td className="text-right">₹{formatCurrency(total)}</td>
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