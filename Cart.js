import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import animationData from "./assests/cart.json";
import { ShoppingCart, Trash2, Home, Book, Info, LogOut, Clock } from "lucide-react";

function Cart() {
  const { cart, clearCart, updateCartItem } = useContext(CartContext);
  const navigate = useNavigate();
  const [showAnimation, setShowAnimation] = useState(false);

  const getTotalPrice = (item) => item.price * item.quantity;
  const grandTotal = cart.reduce((total, item) => total + getTotalPrice(item), 0);

  const handleCheckout = () => {
    setShowAnimation(true);
    setTimeout(() => {
      setShowAnimation(false);
      navigate("/checkout");
    }, 2000);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modern Navigation Bar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex space-x-8">
              <a href="/" className="flex items-center text-gray-900 hover:text-blue-600">
                <Home className="w-5 h-5 mr-1" />
                <span>Home</span>
              </a>
              <a href="/menu" className="flex items-center text-gray-900 hover:text-blue-600">
                <Book className="w-5 h-5 mr-1" />
                <span>Menu</span>
              </a>
              <a href="/about" className="flex items-center text-gray-900 hover:text-blue-600">
                <Info className="w-5 h-5 mr-1" />
                <span>About</span>
              </a>
            </div>
            <div className="flex items-center space-x-8">
              <a href="/recent-orders" className="flex items-center text-gray-900 hover:text-blue-600">
                <Clock className="w-5 h-5 mr-1" />
                <span>Recent Orders</span>
              </a>
              <a href="/logout" className="flex items-center text-gray-900 hover:text-blue-600">
                <LogOut className="w-5 h-5 mr-1" />
                <span>Logout</span>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Cart Content */}
      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <ShoppingCart className="w-6 h-6 mr-2 text-blue-600" />
              Your Cart
            </h2>
            {cart.length > 0 && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {cart.length} {cart.length === 1 ? 'item' : 'items'}
              </span>
            )}
          </div>

          {showAnimation ? (
            <div className="flex justify-center items-center py-12">
              <Lottie animationData={animationData} loop={false} autoplay={true} style={{ height: 250, width: 250 }} />
            </div>
          ) : cart.length === 0 ? (
            <div className="flex flex-col items-center py-12 px-4 text-center">
              <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-lg text-gray-500">Your cart is empty</p>
              <button 
                onClick={() => navigate('/menu')} 
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <div>
              <ul className="divide-y divide-gray-200">
                {cart.map((item, index) => (
                  <li key={index} className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-20 w-20 bg-gray-100 rounded-md overflow-hidden">
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                          <p className="text-lg font-medium text-gray-900">₹{getTotalPrice(item)}</p>
                        </div>
                        <p className="text-sm text-gray-500">₹{item.price} each</p>
                        <div className="flex items-center mt-2">
                        <div className="flex items-center mt-2">
  <button 
    onClick={() => updateCartItem(item._id, item.quantity - 1)}
    className="rounded-l-md bg-gray-200 px-3 py-1 text-gray-700 hover:bg-gray-300 transition-colors"
  >
    -
  </button>

  <span className="px-4 text-lg font-semibold">{item.quantity}</span> {/* This displays the quantity */}

  <button 
    onClick={() => updateCartItem(item._id, item.quantity + 1)}
    className="rounded-r-md bg-gray-200 px-3 py-1 text-gray-700 hover:bg-gray-300 transition-colors"
  >
    +
  </button>

  <button 
    onClick={() => updateCartItem(item._id, 0)}
    className="ml-4 p-1 text-gray-400 hover:text-red-500 transition-colors"
  >
    <Trash2 className="w-5 h-5" />
  </button>
</div>

                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="px-6 py-4 bg-gray-50">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-900">Subtotal</span>
                  <span className="text-lg font-medium text-gray-900">₹{grandTotal}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">Shipping and taxes calculated at checkout</p>
              </div>

              <div className="px-6 py-4 flex space-x-4">
                <button 
                  onClick={handleCheckout}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
                >
                  Proceed to Checkout
                </button>
                <button 
                  onClick={clearCart}
                  className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Cart;