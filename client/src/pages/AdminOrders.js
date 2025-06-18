import React, { useEffect, useState } from "react";
import axios from "axios";
import "./../App.css";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const fetchOrders = () => {
      axios.get("http://localhost:5000/api/order")
        .then((res) => setOrders(res.data))
        .catch((err) => console.error("Error fetching orders:", err));
    };

    fetchOrders();
    const interval = setInterval(() => {
      setNow(new Date());
      fetchOrders();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (ms) => {
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    return `${min}m ${sec}s`;
  };

  const activeOrders = [];
  const deliveredOrders = [];
  const cancelledOrders = [];

  orders.forEach(order => {
    const orderTime = new Date(order.createdAt);
    const deliveryDeadline = new Date(orderTime.getTime() + 30 * 60 * 1000);

    if (order.status === "Order Cancelled") {
      cancelledOrders.push(order);
    } else if (now > deliveryDeadline) {
      deliveredOrders.push(order);
    } else {
      activeOrders.push(order);
    }
  });

  const renderTable = (title, data, type) => (
    <>
      <h3 style={{ marginTop: "30px", color: "#333" }}>{title}</h3>
      {data.length === 0 ? <p>No {title.toLowerCase()}.</p> : (
        <table border="1" cellPadding="10" style={{ width: "100%", marginBottom: "20px" }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Address</th>
              <th>Items</th>
              <th>Order Time</th>
              <th>Status</th>
              <th>{type === "active" ? "Will Deliver In" : (type === "cancelled" ? "Cancelled At" : "Delivered At")}</th>
              <th>Payment Mode</th>
              <th>Total Price</th>
            </tr>
          </thead>
          <tbody>
            {data.map((order, idx) => {
              const orderTime = new Date(order.createdAt);
              const deliveryDeadline = new Date(orderTime.getTime() + 30 * 60 * 1000);
              const totalPrice = order.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
              const cancelledAt = order.cancelledAt ? new Date(order.cancelledAt).toLocaleString() : "-";
              const deliveredAt = new Date(deliveryDeadline).toLocaleString();

              let deliveryStatus = "-";
              if (type === "active") {
                const remaining = Math.max(0, deliveryDeadline - now);
                deliveryStatus = formatTime(remaining);
              } else if (type === "cancelled") {
                deliveryStatus = cancelledAt;
              } else if (type === "delivered") {
                deliveryStatus = deliveredAt;
              }

              return (
                <tr key={idx}>
                  <td>{order.name}</td>
                  <td>{order.email}</td>
                  {/* <td>{order.mobile}</td>
                  <td>{order.Address}</td> */}

                  <td>{order.mobile || "-"}</td>
                  <td>{order.address || "-"}</td>

              
                  <td>
                    {order.items.map((i, index) => (
                      <div key={index}>
                        {i.item}({i.quantity}) = ₹{i.quantity * i.price}
                      </div>
                    ))}
                  </td>
                  <td>{orderTime.toLocaleString()}</td>
                  {/* <td>{order.status}</td> */}
                  <td>{type === "delivered" ? "Food Delivered" : order.status}</td>

                  <td>{deliveryStatus}</td>
                  <td>Cash on Delivery</td>
                  <td>₹{totalPrice}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </>
  );

  return (
    <div style={{ padding: "20px" }}>
      <h2>📋 All Customer Orders</h2>
      {renderTable("🕒 Active Delivering Orders", activeOrders, "active")}
      {renderTable("✅ Delivered Orders", deliveredOrders, "delivered")}
      {renderTable("❌ Cancelled Orders", cancelledOrders, "cancelled")}
    </div>
  );
}

export default AdminOrders;
