import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login({ setUser }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [mobile, setMobile] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!name || !email || !address || !mobile) {
      alert("Please enter all required details");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/user/login", {
        name,
        email,
        address,
        mobile,
      });

      // Save the full user data (with _id) to state and localStorage
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      navigate("/user", { state: { fromLogin: true } });

    } catch (error) {
      console.error("Login failed", error);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Enter name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      /><br /><br />
      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      /><br /><br />
      <textarea
        placeholder="Enter Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      /><br /><br />
      <input
        type="number"
        placeholder="Enter Mobile Number"
        value={mobile}
        onChange={(e)=> setMobile(e.target.value)}
      /><br /><br />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;
