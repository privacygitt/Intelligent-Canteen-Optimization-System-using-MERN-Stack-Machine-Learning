import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const updateRole = () => setUserRole(localStorage.getItem("userRole"));
    window.addEventListener("storage", updateRole);
    return () => window.removeEventListener("storage", updateRole);
  }, []);
  

  const handleLogout = () => {
    localStorage.removeItem("userRole"); // Clear session
    setUserRole(null);
    navigate("/"); // Redirect to home
  };

  return (
    <nav style={styles.navbar}>
      <Link to="/" style={styles.logo}>🍔 Canteen</Link>

      <div style={styles.links}>
        {userRole === "admin" ? (
          <>
            <Link to="/admin/dashboard" style={styles.link}>📊 Dashboard</Link>
            <Link to="/admin/menu" style={styles.link}>🍽️ Manage Menu</Link>
            <button onClick={handleLogout} style={styles.logout}>🚪 Logout</button>
          </>
        ) : userRole === "user" ? (
          <>
            <Link to="/menu" style={styles.link}>📖 Menu</Link>
            <Link to="/cart" style={styles.link}>🛒 Cart</Link>
            <Link to="/order-tracking" style={styles.link}>📦 Orders</Link>
            <button onClick={handleLogout} style={styles.logout}>🚪 Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>🔑 User Login</Link>
            <Link to="/register" style={styles.link}>📝 Register</Link>
            <Link to="/admin-login" style={styles.link}>👨‍💼 Admin Login</Link>
          </>
        )}
      </div>
    </nav>
  );
}

// 🔹 Styling
const styles = {
  navbar: { display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#333", padding: "10px 20px", color: "white" },
  logo: { color: "white", textDecoration: "none", fontSize: "22px", fontWeight: "bold" },
  links: { display: "flex", alignItems: "center", gap: "15px" },
  link: { color: "white", textDecoration: "none", fontSize: "16px", padding: "8px 12px" },
  logout: { backgroundColor: "red", color: "white", border: "none", padding: "8px 12px", cursor: "pointer", borderRadius: "5px" }
};

export default Navbar;
