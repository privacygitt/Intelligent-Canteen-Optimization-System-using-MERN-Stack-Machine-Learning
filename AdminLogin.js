import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Lottie from "lottie-react";
import adminAnimation from "./assests/adminlogin.json";
import "../styles/AdminLogin.css";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleAdminLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate API call with timeout
    setTimeout(() => {
      if (username === "admin" && password === "admin123") {
        localStorage.setItem("userRole", "admin");
        navigate("/admin/dashboard");
        window.location.reload();
      } else {
        setError("Invalid username or password");
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="admin-page-container">
      {/* Navigation Bar */}
      <nav className="admin-navbar">
        <div className="nav-logo">
          <svg className="company-logo" viewBox="0 0 24 24" width="30" height="30">
            <path fill="currentColor" d="M12 2L1 12h3v9h6v-6h4v6h6v-9h3L12 2zm0 2.9L18.2 11H5.8L12 4.9z" />
          </svg>
          <span className="logo-text">Admin Portal</span>
        </div>
        <div className="nav-links">
          <Link to="/" className="nav-link">
            <svg className="nav-icon" viewBox="0 0 24 24" width="16" height="16">
              <path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
            <span>Home</span>
          </Link>
          <Link to="/admin" className="nav-link active">
            <svg className="nav-icon" viewBox="0 0 24 24" width="16" height="16">
              <path fill="currentColor" d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
            <span>Admin Login</span>
          </Link>
        </div>
      </nav>

      <div className="admin-login-container">
        <div className="admin-login-card">
          <div className="animation-container">
            <div className="animation-background-shapes">
              <div className="shape shape-1"></div>
              <div className="shape shape-2"></div>
              <div className="shape shape-3"></div>
            </div>
            <Lottie
              animationData={adminAnimation}
              loop={true}
              className="admin-animation"
            />
            <div className="animation-overlay">
              <h2 className="overlay-text">Welcome Back</h2>
              <p className="overlay-subtext">Administrator Access Only</p>
              <div className="overlay-badges">
                <span className="badge">Secure</span>
                <span className="badge">Protected</span>
              </div>
            </div>
          </div>

          <div className="login-form-container">
            <div className="form-header">
              <div className="lock-icon">
                <svg viewBox="0 0 24 24" width="40" height="40">
                  <path fill="#3a5ce5" d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                </svg>
              </div>
              <h1 className="login-title">Admin Portal</h1>
              <p className="login-subtitle">Enter your credentials to continue</p>
            </div>

            {error && (
              <div className="error-message">
                <svg className="error-icon" viewBox="0 0 24 24" width="20" height="20">
                  <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="login-form">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <div className="input-wrapper">
                  <svg className="input-icon" viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <svg className="input-icon" viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                  </svg>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              <div className="remember-me">
                <label className="checkbox-container">
                  <input type="checkbox" />
                  <span className="checkmark"></span>
                  <span className="label-text">Remember me</span>
                </label>
              </div>

              <button 
                type="submit" 
                className={`login-button ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="spinner" viewBox="0 0 24 24" width="20" height="20">
                      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="4" />
                    </svg>
                    <span>Logging in...</span>
                  </>
                ) : (
                  <>
                    <svg className="btn-icon" viewBox="0 0 24 24" width="20" height="20">
                      <path fill="currentColor" d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z" />
                    </svg>
                    <span>Login to Dashboard</span>
                  </>
                )}
              </button>
            </form>

            <div className="form-footer">
              <a href="/forgot-password" className="forgot-password">
                Forgot password?
              </a>
              <div className="security-note">
                <svg className="security-icon" viewBox="0 0 24 24" width="16" height="16">
                  <path fill="currentColor" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
                </svg>
                <span>Secure login enabled</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;