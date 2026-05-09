// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "./../App.css";

// function AdminDashboard() {
//   const [orders, setOrders] = useState([]);
//   const [menuItem, setMenuItem] = useState({ name: "", price: "", description: "" });

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const fetchOrders = () => {
//     axios.get("https://canteen-food-ordering-system-midh.onrender.com/api/order").then((res) => {
//       setOrders(res.data);
//     });
//   };

//   const confirmOrder = (id) => {
//     axios.put(`https://canteen-food-ordering-system-midh.onrender.com/api/order/${id}`, { status: "Confirmed" }).then(fetchOrders);
//   };

//   const addMenuItem = () => {
//     if (!menuItem.name || !menuItem.price) {
//       alert("Please fill all fields");
//       return;
//     }

//     axios.post("https://canteen-food-ordering-system-midh.onrender.com/api/menu", menuItem).then(() => {
//       alert("Item added");
//       setMenuItem({ name: "", price: "", description: "" });
//     });
//   };

//   return (
//     <div>
//       <h1>Admin Panel</h1>
//       <h2>Add Menu Item</h2>
//       <div className="center-container">
//         <div  className="form-box">
//       <input type="text" placeholder="Name" value={menuItem.name} onChange={(e) => setMenuItem({ ...menuItem, name: e.target.value })} />
//       <input type="number" placeholder="Price" value={menuItem.price} onChange={(e) => setMenuItem({ ...menuItem, price: e.target.value })} />
//       <input type="text" placeholder="Description" value={menuItem.description} onChange={(e) => setMenuItem({ ...menuItem, description: e.target.value })} />
//       <button onClick={addMenuItem}>Add Item</button>
//       </div>
//       </div>
//     </div>
//   );
// }

// export default AdminDashboard;























import React, { useEffect, useState } from "react";
import axios from "axios";
import "./../App.css";

function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [menuItem, setMenuItem] = useState({
    name: "",
    price: "",
    description: "",
    imageUrl: "",
  });
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    axios
      .get("https://canteen-food-ordering-system-midh.onrender.com/api/order")
      .then((res) => setOrders(res.data));
  };

  const confirmOrder = (id) => {
    axios
      .put(`https://canteen-food-ordering-system-midh.onrender.com/api/order/${id}`, {
        status: "Confirmed",
      })
      .then(fetchOrders);
  };

  // 👇 Image select hone par base64 mein convert karo
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setMenuItem((prev) => ({ ...prev, imageUrl: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const addMenuItem = () => {
    if (!menuItem.name || !menuItem.price) {
      alert("Please fill name and price");
      return;
    }

    axios
      .post("https://canteen-food-ordering-system-midh.onrender.com/api/menu", menuItem)
      .then(() => {
        alert("Item added successfully!");
        setMenuItem({ name: "", price: "", description: "", imageUrl: "" });
        setPreview(null);
      })
      .catch(() => alert("Failed to add item!"));
  };

  return (
    <div>
      <h1>Admin Panel</h1>
      <h2>Add Menu Item</h2>
      <div className="center-container">
        <div className="form-box">
          <input
            type="text"
            placeholder="Name"
            value={menuItem.name}
            onChange={(e) => setMenuItem({ ...menuItem, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Price"
            value={menuItem.price}
            onChange={(e) => setMenuItem({ ...menuItem, price: e.target.value })}
          />
          <input
            type="text"
            placeholder="Description"
            value={menuItem.description}
            onChange={(e) =>
              setMenuItem({ ...menuItem, description: e.target.value })
            }
          />

          {/* 👇 Device se image select karo */}
          <label style={{ fontWeight: "bold", marginTop: "10px", display: "block" }}>
            Select Image from Device:
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ marginBottom: "10px" }}
          />

          {/* 👇 Preview */}
          {preview && (
            <div style={{ marginBottom: "10px" }}>
              <p style={{ margin: "0 0 5px" }}>Preview:</p>
              <img
                src={preview}
                alt="preview"
                style={{
                  width: "120px",
                  height: "120px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
          )}

          <button onClick={addMenuItem}>Add Item</button>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;