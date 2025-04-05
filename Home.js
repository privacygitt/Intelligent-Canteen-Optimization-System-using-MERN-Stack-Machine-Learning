import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ChatBox from "./ChatBox";
import { User, LogOut, Coffee, ShoppingCart, Clock, UserCheck, Menu, ArrowRight } from "lucide-react";

function Home() {
  const [menuItems, setMenuItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
    
    // Fetch menu items
    axios.get("http://localhost:5000/api/menu")
      .then(response => {
        setMenuItems(response.data.slice(0, 5));
      })
      .catch(error => {
        console.error("Error fetching menu items:", error);
      });
  }, []);
  
  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    window.location.reload();
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Navigation */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        {/* Navigation */}
        <nav className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Coffee className="h-8 w-8 mr-2" />
              <span className="text-xl font-bold">NSRIT Canteen</span>
            </div>
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2 rounded-md focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-4">
              {isLoggedIn ? (
                <>
                  <Link to="/menu" className="flex items-center px-3 py-2 rounded hover:bg-blue-700 transition">
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    <span>Menu</span>
                  </Link>
                  <Link to="/recent-orders" className="flex items-center px-3 py-2 rounded hover:bg-blue-700 transition">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Recent Orders</span>
                  </Link>
                  <Link to="/admin/login" className="flex items-center px-3 py-2 rounded hover:bg-blue-700 transition">
                    <UserCheck className="h-4 w-4 mr-1" />
                    <span>Admin</span>
                  </Link>
                  <button 
                    onClick={handleLogout} 
                    className="flex items-center px-3 py-2 rounded hover:bg-blue-700 transition"
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="flex items-center px-3 py-2 rounded hover:bg-blue-700 transition">
                    <User className="h-4 w-4 mr-1" />
                    <span>Login</span>
                  </Link>
                  <Link to="/register" className="flex items-center px-3 py-2 rounded hover:bg-blue-700 transition">
                    <User className="h-4 w-4 mr-1" />
                    <span>Register</span>
                  </Link>
                  <Link to="/menu" className="flex items-center px-3 py-2 rounded hover:bg-blue-700 transition">
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    <span>Menu</span>
                  </Link>
                  <Link to="/admin/login" className="flex items-center px-3 py-2 rounded hover:bg-blue-700 transition">
                    <UserCheck className="h-4 w-4 mr-1" />
                    <span>Admin</span>
                  </Link>
                </>
              )}
            </div>
          </div>
          
          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 bg-blue-700 rounded-lg p-4">
              {isLoggedIn ? (
                <div className="flex flex-col space-y-2">
                  <Link to="/menu" className="flex items-center px-3 py-2 rounded hover:bg-blue-600 transition">
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    <span>Menu</span>
                  </Link>
                  <Link to="/recent-orders" className="flex items-center px-3 py-2 rounded hover:bg-blue-600 transition">
                    <Clock className="h-5 w-5 mr-2" />
                    <span>Recent Orders</span>
                  </Link>
                  <Link to="/admin/login" className="flex items-center px-3 py-2 rounded hover:bg-blue-600 transition">
                    <UserCheck className="h-5 w-5 mr-2" />
                    <span>Admin</span>
                  </Link>
                  <button 
                    onClick={handleLogout} 
                    className="flex items-center px-3 py-2 rounded hover:bg-blue-600 transition"
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link to="/login" className="flex items-center px-3 py-2 rounded hover:bg-blue-600 transition">
                    <User className="h-5 w-5 mr-2" />
                    <span>Login</span>
                  </Link>
                  <Link to="/register" className="flex items-center px-3 py-2 rounded hover:bg-blue-600 transition">
                    <User className="h-5 w-5 mr-2" />
                    <span>Register</span>
                  </Link>
                  <Link to="/menu" className="flex items-center px-3 py-2 rounded hover:bg-blue-600 transition">
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    <span>Menu</span>
                  </Link>
                  <Link to="/admin/login" className="flex items-center px-3 py-2 rounded hover:bg-blue-600 transition">
                    <UserCheck className="h-5 w-5 mr-2" />
                    <span>Admin</span>
                  </Link>
                </div>
              )}
            </div>
          )}
        </nav>
        
        {/* Hero Content */}
        <div className="container mx-auto px-4 py-16 md:py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to the NSRIT Canteen</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Order your favorite food with ease! Enjoy delicious meals prepared fresh daily.</p>
          
          <div className="flex flex-wrap justify-center gap-4">
            {isLoggedIn ? (
              <Link to="/menu">
                <button className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition shadow-md">
                  View Menu & Order
                </button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <button className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition shadow-md">
                    Login to Order
                  </button>
                </Link>
                <Link to="/register">
                  <button className="bg-transparent border-2 border-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                    Create Account
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
        
        {/* Wave SVG */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12 text-gray-50 block">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.11,130.83,141.14,208.08,141.14c100.24,0,172.58-32.16,321.39-84.7Z" 
              className="fill-current"></path>
          </svg>
        </div>
      </div>
      
      {/* Recommended Items Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-6">
        <div className="text-center mb-6">
  <h2 className="text-2xl font-bold text-gray-800">Recommended Items</h2>
  <p className="text-gray-600 text-sm">Try our most popular dishes</p>
</div>

          <Link to="/menu" className="flex items-center text-blue-600 hover:text-blue-800 transition">
            <span className="font-medium">View All</span>
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        
        {/* Single Row Food Cards */}
        <div className="overflow-x-auto pb-4">
          <div className="flex space-x-4" style={{ minWidth: 'max-content' }}>
            {menuItems.map(item => (
              <div key={item._id} className="flex-none w-64 bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                <div className="relative h-32 w-full">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => e.target.src = "/default-image.png"}
                  />
                  <div className="absolute top-0 right-0 bg-blue-600 text-white px-2 py-1 text-sm font-bold rounded-bl-lg">
                    ₹{item.price}
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-bold text-gray-800 truncate">{item.name}</h3>
                  <p className="text-gray-600 text-sm h-8 overflow-hidden">{item.description}</p>
                  <Link to="/menu">
                    <button className="w-full mt-2 bg-blue-600 text-white py-1 rounded text-sm font-medium hover:bg-blue-700 transition">
                      Order Now
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Why Choose Us</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md flex items-start">
              <div className="flex-shrink-0 mr-4">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-1">Quick Ordering</h3>
                <p className="text-gray-600 text-sm">Place your order online and pick it up without waiting in line</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md flex items-start">
              <div className="flex-shrink-0 mr-4">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-1">Fresh Ingredients</h3>
                <p className="text-gray-600 text-sm">All meals are prepared daily with fresh, quality ingredients</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md flex items-start">
              <div className="flex-shrink-0 mr-4">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-1">Student Friendly Prices</h3>
                <p className="text-gray-600 text-sm">Enjoy delicious meals at affordable prices for students</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="bg-blue-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Order?</h2>
          <p className="mb-6 max-w-lg mx-auto">Skip the lines and order your favorite meals online for pickup at the NSRIT Canteen.</p>
          <Link to="/menu">
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition shadow-md">
              View Full Menu
            </button>
          </Link>
        </div>
      </div>
      
      {/* Today's Special */}
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
              <img 
                src="https://source.unsplash.com/random/800x600/?food" 
                alt="Special dish" 
                className="w-full h-full object-cover"
                onError={(e) => e.target.src = "/default-image.png"}
              />
            </div>
            <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
              <div className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium mb-4">
                Today's Special
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Chef's Special Thali</h3>
              <p className="text-gray-600 mb-4">A complete meal with rice, dal, curry, chapati, and dessert. Perfect for a hearty lunch!</p>
              <div className="flex items-center mb-6">
                <span className="text-2xl font-bold text-blue-600">₹120</span>
                <span className="ml-2 text-sm line-through text-gray-500">₹150</span>
                <span className="ml-2 text-sm text-green-600 font-medium">Save ₹30</span>
              </div>
              <Link to="/menu">
                <button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition inline-flex items-center">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Order Now
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Chat Box */}
      <div className="fixed bottom-4 right-4 z-50">
        <ChatBox />
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Coffee className="h-6 w-6 mr-2" />
                <span className="text-lg font-bold">NSRIT Canteen</span>
              </div>
              <p className="text-gray-400">Serving delicious meals since 2010</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
              <ul className="space-y-1">
                <li><Link to="/menu" className="text-gray-400 hover:text-white transition">Menu</Link></li>
                <li><Link to="/about" className="text-gray-400 hover:text-white transition">About Us</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white transition">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Opening Hours</h3>
              <ul className="space-y-1 text-gray-400">
                <li>Monday - Friday: 8AM - 8PM</li>
                <li>Saturday: 9AM - 5PM</li>
                <li>Sunday: Closed</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
              <ul className="space-y-1 text-gray-400">
                <li>NSRIT Campus</li>
                <li>Email: canteen@nsrit.edu</li>
                <li>Phone: +91 1234567890</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-4 border-t border-gray-700 text-center text-sm text-gray-400">
            <p>© {new Date().getFullYear()} NSRIT Canteen. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;