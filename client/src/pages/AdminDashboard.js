import React, { useEffect, useState } from "react";
import axios from "axios";
import "./../App.css";

function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [menuItem, setMenuItem] = useState({ name: "", price: "", description: "" });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    axios.get("http://localhost:5000/api/order").then((res) => {
      setOrders(res.data);
    });
  };

  const confirmOrder = (id) => {
    axios.put(`http://localhost:5000/api/order/${id}`, { status: "Confirmed" }).then(fetchOrders);
  };

  const addMenuItem = () => {
    if (!menuItem.name || !menuItem.price) {
      alert("Please fill all fields");
      return;
    }

    axios.post("http://localhost:5000/api/menu", menuItem).then(() => {
      alert("Item added");
      setMenuItem({ name: "", price: "", description: "" });
    });
  };

  return (
    <div>
      <h1>Admin Panel</h1>
      <h2>Add Menu Item</h2>
      <div className="center-container">
        <div  className="form-box">
      <input type="text" placeholder="Name" value={menuItem.name} onChange={(e) => setMenuItem({ ...menuItem, name: e.target.value })} />
      <input type="number" placeholder="Price" value={menuItem.price} onChange={(e) => setMenuItem({ ...menuItem, price: e.target.value })} />
      <input type="text" placeholder="Description" value={menuItem.description} onChange={(e) => setMenuItem({ ...menuItem, description: e.target.value })} />
      <button onClick={addMenuItem}>Add Item</button>
      </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
