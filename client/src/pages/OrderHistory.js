import React, { useEffect, useState } from "react";
import axios from "axios";

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const userId = "default-user"; // You can replace this with actual login-based userId

  useEffect(() => {
    axios.get(`http://localhost:5000/api/orders/${userId}`).then((res) => {
      setOrders(res.data);
    });
  }, []);

  return (
    <div>
      <h2>Your Order History</h2>
      {orders.length === 0 ? (
        <p>No previous orders.</p>
      ) : (
        orders.map((order, index) => (
          <div key={index} className="menu-card">
            <p><strong>Items:</strong> {order.items.join(", ")}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default OrderHistory;
