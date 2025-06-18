
//import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import UserHome from "./pages/UserHome";
import Login from "./pages/Login";
import { getUser } from "./utils/auth";
import UserOrders from "./pages/UserOrders"; // adjust path if needed
import AdminDashboard from "./pages/AdminDashboard";
import AdminOrders from "./pages/AdminOrders";
import UserSettings from "./pages/UserSettings";
//import {user} from "./pages/UserSettings"
import React, { useState, useEffect } from "react";




function App() {
  // const [user, setUser] = useState(null);
  const [user, setUser] = useState(() => {
  const stored = localStorage.getItem("user");
  return stored ? JSON.parse(stored) : null;
});

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/user" />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/user" element={<UserHome user={user}/>} />
        <Route path="/orders" element={<UserOrders />} />
         <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/settings" element={<UserSettings user={user} setUser={setUser} />} />
      </Routes>
    </Router>
  );
}

export default App;
