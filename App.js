import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { useEffect, useState } from "react";

import RecentOrders from "./pages/RecentOrders";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminLogin from "./pages/AdminLogin";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderTracking from "./pages/OrderTracking";
import AdminHome from "./pages/AdminHome";
import AdminMenu from "./pages/AdminMenu";
import AdminDashboard from "./pages/AdminDashboard";
import ChatBox from "./pages/ChatBox";
import HelpDesk from "./pages/HelpDesk"; 


function App() {
  const [userRole, setUserRole] = useState(() => localStorage.getItem("userRole") || null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role) {
      setUserRole(role);
    }
    setIsLoading(false); // Stop loading after fetching role
  }, []);

  return (
    <CartProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setUserRole={setUserRole} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin-login" element={userRole === "admin" ? <Navigate to="/admin/dashboard" /> : <AdminLogin />} />
          <Route path="/admin/home" element={<AdminHome />} />
          <Route path="/help" element={<HelpDesk />} />
          {/* User Routes */}
          {userRole === "user" && (
            <>
              <Route path="/menu" element={<Menu />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-tracking/:orderId" element={<OrderTracking />} />
              <Route path="/recent-orders" element={<RecentOrders user={{ _id: "userId" }} />} />
              <Route path="/chat-box" element={<ChatBox />} />
            </>
          )}

          {/* Admin Routes */}
          {userRole === "admin" && (
            <>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/menu" element={<AdminMenu />} />
            </>
          )}

          {/* Redirect unauthenticated users */}
          <Route path="/menu" element={userRole ? <Menu /> : <Navigate to="/login" />} />
          <Route path="/admin/*" element={userRole === "admin" ? <AdminDashboard /> : <Navigate to="/admin-login" />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
