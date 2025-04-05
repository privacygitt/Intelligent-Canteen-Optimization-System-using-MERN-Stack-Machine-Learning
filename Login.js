import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUser, FaLock, FaEnvelope, FaHome, FaUserPlus } from "react-icons/fa";
import Lottie from "lottie-react";
import loginAnimation from "./assests/Login-animation.json";
import successAnimation from "./assests/success.json";
import errorAnimation from "./assests/error.json";

function Login({ setUserRole }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    
    try {
      const res = await axios.post("http://localhost:5000/api/users/login", {
        email,
        password,
      });

      if (res.data && res.data.success) {
        const { user } = res.data;
        
        // Store user ID separately in localStorage
        localStorage.setItem("userId", user._id);
        
        // Store user details in localStorage
        localStorage.setItem("user", JSON.stringify({
          id: user._id,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          department: user.department,
          role: user.role,
        }));

        localStorage.setItem("userRole", "user");
        setUserRole("user");
        setIsSuccess(true);
      } else {
        setIsSuccess(false);
        setErrorMsg("Invalid credentials. Please try again.");
      }
      setShowModal(true);
    } catch (error) {
      console.error("Login Error:", error);
      setIsSuccess(false);
      setErrorMsg(error.response?.data?.message || "Login failed. Please try again.");
      setShowModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-blue-600">NSRIT Canteen</h1>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                to="/" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <FaHome className="mr-2" />
                Home
              </Link>
              <Link 
                to="/register" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <FaUserPlus className="mr-2" />
                Register
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-6xl flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Left Side - Animation and Brand */}
          <motion.div 
            className="w-full md:w-1/2 bg-gradient-to-br from-blue-500 to-indigo-600 p-12 flex flex-col justify-center items-center text-white"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl font-bold mb-6 text-center">Welcome Back</h1>
            <p className="text-blue-100 mb-8 text-center">Sign in to access your account and continue your journey</p>
            <div className="w-full max-w-md">
              <Lottie animationData={loginAnimation} loop={true} className="w-full h-64" />
            </div>
          </motion.div>

          {/* Right Side - Login Form */}
          <motion.div 
            className="w-full md:w-1/2 p-12 flex items-center justify-center"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-full max-w-md">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-800">Login</h2>
                <p className="text-gray-500 mt-2">Please enter your credentials to proceed</p>
              </div>
              
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-gray-400" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <a href="#" className="text-sm text-blue-600 hover:text-blue-800 transition-colors">Forgot password?</a>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-gray-400" />
                    </div>
                    <input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50"
                    />
                  </div>
                </div>
                
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-lg font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg transition-all duration-200 disabled:opacity-70"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </motion.button>
                
                <div className="relative flex items-center justify-center mt-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative px-4 bg-white">
                    <span className="text-sm text-gray-500">or continue with</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3 mt-6">
                  {["Google", "Apple", "Facebook"].map((provider) => (
                    <button
                      key={provider}
                      type="button"
                      className="py-2 px-4 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                    >
                      {provider}
                    </button>
                  ))}
                </div>
                
                <p className="text-center mt-8 text-gray-600">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-blue-600 font-medium cursor-pointer hover:text-blue-800 transition-colors"
                  >
                    Sign up
                  </Link>
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Success/Error Modal */}
      {showModal && (
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-white p-8 rounded-xl shadow-xl flex flex-col items-center max-w-md w-full mx-4"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
          >
            <Lottie
              animationData={isSuccess ? successAnimation : errorAnimation}
              loop={false}
              className="w-32 h-32"
            />
            <h3 className="text-xl font-bold mt-4 text-center">
              {isSuccess ? "Login Successful!" : "Login Failed"}
            </h3>
            {!isSuccess && errorMsg && (
              <p className="mt-2 text-red-600 text-center">{errorMsg}</p>
            )}
            <motion.button
              onClick={() => {
                setShowModal(false);
                if (isSuccess) navigate("/");
              }}
              className="mt-6 px-8 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow-md hover:from-blue-600 hover:to-indigo-700 transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isSuccess ? "Continue" : "Try Again"}
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

export default Login;