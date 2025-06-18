import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { getUser } from "../utils/auth";
import "./../App.css";
import { Link } from "react-router-dom";

import burger from "../assets/burgerimage.jpg";
import chowmein from "../assets/chowmeinimage.jpeg"
import momos from "../assets/momos.jpeg"
import tea from "../assets/tea.jpeg"
import paratha from "../assets/paratha.jpeg"
//import pasta from "../assets/pasta.jpg"
import pasta from "../assets/pasta 2.jpeg"
//import dosa from "../assets/dosa.jpg";
//import sandwich from "../assets/sandwich.jpg";
import dosa from "../assets/dosa.avif"
import sandwich from "../assets/sandwich.jpeg"

const foodImages = {
  Burger: burger,
  Chowmein: chowmein,
  Tea: tea,
  Momos:momos,
  Paratha:paratha,
  Pasta: pasta,
  Dosa: dosa,
  Sandwich: sandwich,
};

function UserHome() {
  const [menu, setMenu] = useState([]);
  const [orderItems, setOrderItems] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  const user = getUser();

  useEffect(() => {
    axios.get("http://localhost:5000/api/menu").then((res) => {
      setMenu(res.data);
    });

    if (location.state?.fromLogin) {
      alert("Login successful! You can now place an order.");
    }
  }, [location.state]);

  const handleAdd = (itemName) => {
    setOrderItems((prev) => ({
      ...prev,
      [itemName]: (prev[itemName] || 0) + 1,
    }));
  };

  const handleRemove = (itemName) => {
    setOrderItems((prev) => {
      const updated = { ...prev };
      if (updated[itemName] > 1) updated[itemName]--;
      else delete updated[itemName];
      return updated;
    });
  };



const placeOrder = () => {
  if (!user) {
    alert("Please login to place an order.");
    navigate("/login");
    return;
  }

  const items = Object.entries(orderItems).map(([itemName, quantity]) => {
    const matchedItem = menu.find((m) => m.name === itemName);
    return {
      item: itemName,
      quantity,
      price: matchedItem?.price || 0,
    };
  });

  if (items.length === 0) {
    alert("No items selected!");
    return;
  }

  // Show confirmation dialog with options
  const confirmBox = document.createElement("div");
  confirmBox.style.position = "fixed";
  confirmBox.style.top = "0";
  confirmBox.style.left = "0";
  confirmBox.style.width = "100vw";
  confirmBox.style.height = "100vh";
  confirmBox.style.backgroundColor = "rgba(0,0,0,0.5)";
  confirmBox.style.display = "flex";
  confirmBox.style.justifyContent = "center";
  confirmBox.style.alignItems = "center";
  confirmBox.style.zIndex = "9999";

  confirmBox.innerHTML = `
    <div style="
      background: white;
      padding: 30px;
      border-radius: 10px;
      text-align: center;
      max-width: 400px;
      font-family: sans-serif;
    ">
      <h3>If your delivery address has changed, please login again and then place your order then click option continue with same address after adding new address.</h3>
      <p>Thank you!</p>
      <h4>Same Address you don't want to change then, click Continue with Same Address</h4>    
      <button id="continueBtn" style="margin-right: 10px; padding: 8px 15px;">Continue with Same Address</button>
      <button id="loginAgainBtn" style="padding: 8px 15px;">Login Again</button>
    </div>
  `;

  document.body.appendChild(confirmBox);

  document.getElementById("continueBtn").onclick = () => {
    document.body.removeChild(confirmBox);

    axios
      .post("http://localhost:5000/api/order", {
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        address: user.address,
        items,
      })
      .then(() => {
        alert(
          `Order Placed!\nName: ${user.name}\nEmail: ${user.email}\nItems: ${items
            .map((i) => `${i.item}(${i.quantity})`)
            .join(", ")}`
        );
        setOrderItems({});
      })
      .catch(() => {
        alert("Order failed!");
      });
  };

  document.getElementById("loginAgainBtn").onclick = () => {
    document.body.removeChild(confirmBox);
    navigate("/login");
  };
};


  const calculateTotal = () => {
    return menu.reduce((total, item) => {
      const qty = orderItems[item.name] || 0;
      return total + qty * item.price;
    }, 0);
  };

  return (
    <div>
      <h1>🍽️ Welcome to Canteen</h1>
      <h4>Quality Guaranteed</h4>
     
     <div className="intro" style={{
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 20px",
  backgroundColor: "#f5f5f5",
  borderRadius: "10px",
  marginBottom: "20px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
}}>
  <div style={{ display: "flex", alignItems: "center" }}>
    {!user && (
      <button onClick={() => navigate("/login")} style={{ marginRight: "15px" }}>
        Login
      </button>
    )}
   

    {user && (
  <div style={{ marginRight: "15px", textAlign: "left" }}>
    <p>Hi, {user.name}</p>
    <p>Address: {user.address}</p>
  </div>
)}

  </div>

  <div style={{ textAlign: "center" }}>
    <h3 style={{ margin: "5px 0" }}>
      Total Items: {Object.values(orderItems).reduce((a, b) => a + b, 0)}
    </h3>
    <h3 style={{ margin: "5px 0" }}>
      Total Price: ₹{calculateTotal()}
    </h3>
    <button onClick={placeOrder}>Place Order</button>
  </div>

  <div>
    {user && (
      <button onClick={() => navigate("/orders")}>
        Your Orders
      </button>
    )}
  </div>
</div>

  
      <div className="menu-container">
        {menu.map((item, index) => (
          <div className="menu-card" key={index}>
           
            <img
  src={foodImages[item.name.trim().charAt(0).toUpperCase() + item.name.trim().slice(1).toLowerCase()]}
  alt={item.name}
  className="menu-img"
/>


            <h3>{item.name}</h3>
            <p>₹{item.price}</p>
            <p>{item.description}</p>
            <div>
              <button onClick={() => handleRemove(item.name)} disabled={!orderItems[item.name]}>
                -
              </button>
              <span style={{ margin: "0 10px" }}>{orderItems[item.name] || 0}</span>
              <button onClick={() => handleAdd(item.name)}>+</button>
            </div>
          </div>
        ))}
      </div>

      <div className="buttompart">
        <p>Privacy Policy</p>
        <p>Terms and Conditions are applied</p>
        <p>Ajmer, Rajasthan, India</p>
      </div>
    </div>
  );
}

export default UserHome;

