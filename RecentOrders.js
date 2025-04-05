import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // For navigation
import "../styles/RecentOrders.css"; // Import CSS file

const RecentOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Hook for navigation

  // Get user ID from localStorage
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) {
      axios
        .get(`http://localhost:5000/api/orders/user/${userId}`)
        .then((res) => {
          setOrders(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching orders:", err);
          setLoading(false);
        });
    }
  }, [userId]);

  // Logout function
  const handleLogout = () => {
    localStorage.clear();
    navigate("/"); // Redirect to home page
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="orders-page">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-logo">Canteen</div>
        <ul className="nav-links">
          <li onClick={() => navigate("/")}>Home</li>
          <li onClick={() => navigate("/menu")}>Menu</li>
          <li onClick={() => navigate("/cart")}>Cart</li>
          <li onClick={() => navigate("/order-tracking")}>Order Tracking</li>
          <li className="logout-btn" onClick={handleLogout}>Logout</li>
        </ul>
      </nav>

      <h1 className="orders-title">Recent Orders</h1>
      {orders.length === 0 ? (
        <p className="no-orders">No orders found</p>
      ) : (
        <div className="orders-container">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <h3 className="order-id">Order #{order._id}</h3>
              <p className="order-date">
                Date: {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <ul className="order-items">
                {order.items.map((item) => (
                  <li key={item._id} className="order-item">
                    <p className="item-name">{item.name}</p>
                    <p className="item-price">₹{item.price}</p>
                  </li>
                ))}
              </ul>
              <p className="order-status">
                <strong>Status:</strong> {order.status}
              </p>
              <p className="total-amount">Total: ₹{order.totalAmount}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentOrders;
