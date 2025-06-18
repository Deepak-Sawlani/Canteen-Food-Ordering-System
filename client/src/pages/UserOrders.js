import React, { useEffect, useState } from "react";
import axios from "axios";
import { getUser } from "../utils/auth";
import { useNavigate } from "react-router-dom";

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const user = getUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      alert("Please login to view orders.");
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:5000/api/order")
      .then((res) => {
        const userOrders = res.data.filter((order) => order.email === user.email);
        setOrders(userOrders);
      })
      .catch((err) => console.error("Error fetching orders:", err));
  }, [user, navigate]);


const calculateTotal = (items) => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

const getUpdatedStatus = (order) => {
  const now = new Date();
  const createdAt = new Date(order.createdAt);
  const cancelled = order.status === "Order Cancelled";
  const deliveryDeadline = new Date(createdAt.getTime() + 30 * 60 * 1000);

  if (cancelled) return "Order Cancelled";
  if (now > deliveryDeadline) return "Food Delivered";
  return "Order Pending";
};


  
  const getStatus = (createdAt) => {
    const now = new Date();
    const orderTime = new Date(createdAt);
    const deliveryTime = new Date(orderTime.getTime() + 30 * 60 * 1000); // +30 minutes
    const remaining = deliveryTime - now;

    if (remaining <= 0) {
      return { status: "Food Delivered", remainingTime: "00:00" };
    } else {
      const minutes = Math.floor(remaining / 60000);
      const seconds = Math.floor((remaining % 60000) / 1000);
      return {
        status: "Order Pending",
        remainingTime: `${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`,
      };
    }
  };

  return (
    <div>
      <h2>Your Orders</h2>
      <h4>Your order history</h4>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
  
orders.map((order, idx) => {
  const orderTime = new Date(order.createdAt);
  const now = new Date();
  const deliveryDeadline = new Date(orderTime.getTime() + 30 * 60000); // 30 mins
  const total = calculateTotal(order.items);

  const isWithin30Mins = now < deliveryDeadline;
  const isCancelled = order.status === "Order Cancelled";
  const isDelivered = now >= deliveryDeadline && order.status !== "Order Cancelled";

  const showCancelButton = isWithin30Mins && !isCancelled && !isDelivered;
  const deliveredTime = deliveryDeadline.toLocaleString();

  const getRemainingTime = () => {
    const remaining = deliveryDeadline - now;
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const cancelOrder = () => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      axios
        .put(`http://localhost:5000/api/order/cancel/${order._id}`)
        .then(() => {
          alert("Order cancelled successfully.");
          setOrders((prev) =>
            prev.map((o) =>
              o._id === order._id
                ? {
                    ...o,
                    status: "Order Cancelled",
                    cancelledAt: new Date().toISOString(),
                  }
                : o
            )
          );
        })
        .catch((err) => {
          alert("Failed to cancel order.");
          console.error(err);
        });
    }
  };

  return (
    <div
      key={idx}
      style={{
        border: "1px solid #ffffff",
        padding: "10px",
        marginBottom: "10px",
        backgroundColor: "#FF5349",
        color: "#ffffff",
        borderRadius: "8px",
      }}
    >
      <p><strong>Ordered At:</strong> {orderTime.toLocaleString()}</p>
      <p><strong>Items with their individual Prices:</strong></p>
      <ul>
        {order.items.map((item, i) => (
          <li key={i}>
            {item.item} ({item.quantity})={item.quantity}*{item.price}=₹{item.quantity*item.price}
          </li>
        ))}
      </ul>
      <p><strong>Total Price:</strong> ₹{total}</p>
      {/* <p><strong>Status:</strong> {order.status}</p> */}
      <p><strong>Status:</strong> {getUpdatedStatus(order)}</p>


      {isCancelled && order.cancelledAt && (
        <p><strong>Order Cancelled At:</strong> {new Date(order.cancelledAt).toLocaleString()}</p>
      )}

      {!isCancelled && isDelivered && (
        <p><strong>Order Delivered At:</strong> {deliveredTime}</p>
      )}

      {!isCancelled && !isDelivered && (
        <p><strong>Time Left in Delivering Order:</strong> {getRemainingTime()}</p>
      )}

      {showCancelButton && (
        <button
          onClick={cancelOrder}
          style={{
            backgroundColor: "#000000",
            color: "#ffffff",
            padding: "5px 12px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginTop: "8px",
          }}
        >
          Cancel Order
        </button>
      )}

      <p><strong>Payment Mode:</strong> Cash on Delivery</p>
    </div>
  );
})

      )}
    </div>
  );
};

export default UserOrders;
