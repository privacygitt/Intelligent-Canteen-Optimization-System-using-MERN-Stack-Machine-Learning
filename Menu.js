import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "../styles/menu.css";

function Menu() {
  const [foods, setFoods] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showDropdown, setShowDropdown] = useState(false);
  const { addToCart, updateCartItem, cart } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/api/foods")
      .then(res => setFoods(res.data))
      .catch(err => console.log(err));
  }, []);

  const getQuantity = (foodId) => {
    const item = cart.find((item) => item._id === foodId);
    return item ? item.quantity : 0;
  };

  const categories = ["All", ...new Set(foods.map(food => food.category))];

  return (
    <div className="menu-page">
      {/* TOP NAVBAR */}
      <nav className="top-navbar">
        <div className="logo">NSRIT CANTEEN</div>
        <div className="profile" onClick={() => setShowDropdown(!showDropdown)}>
          👤
          {showDropdown && (
            <div className="dropdown-menu">
              <p onClick={() => navigate("/")}>🏠 Home</p>
              <p onClick={() => navigate("/menu")}>🍕 Menu</p>
              <p onClick={() => navigate("/orders")}>🛒 Recent Orders</p>
              <p onClick={() => navigate("/favorites")}>⭐ Favourites</p>
            </div>
          )}
        </div>
      </nav>

      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2>Categories</h2>
        <ul>
          {categories.map((category, index) => (
            <li key={index} className={selectedCategory === category ? "active" : ""}
                onClick={() => setSelectedCategory(category)}>
              {category}
            </li>
          ))}
        </ul>
      </aside>

      {/* MAIN CONTENT */}
      <div className="menu-content">
                <h1 className="menu-title">Food Menu</h1>
                
                <div className="menu-container">
                    {foods
                        .filter(food => selectedCategory === "All" || food.category === selectedCategory)
                        .map(food => {
                            const quantity = getQuantity(food._id);
                            
                            return (
                                <div key={food._id} className="food-card">
                                    <img src={food.image} alt={food.name} className="food-image" />
                                    <div className="food-details">
                                        <h3>{food.name}</h3>
                                        <p className="food-category">
                                            {food.type === "Veg" ? "🟢 Veg" : "🔴 Non-Veg"}
                                        </p>
                                        <p className="food-price">₹{food.price}</p>
                                        <p className="food-stock">Stock: {food.stock}</p>
                                        {quantity > 0 ? (
    <div className="quantity-control">
        <button onClick={() => updateCartItem(food._id, quantity - 1)}>-</button>
        <span>{quantity}</span>
        <button onClick={() => updateCartItem(food._id, quantity + 1)}>+</button>
    </div>
) : (
<button
    className="add-to-cart-btn"
    onClick={() => addToCart(food)}
    disabled={food.stock <= 0}
>
    {food.stock > 0 ? "Add to Cart" : "Out of Stock"}
</button>
)}
                                    </div>
                                </div>
                            );
                        })}
                </div>

                {cart.length > 0 && (
                    <button className="go-to-cart-btn" onClick={() => navigate("/cart")}>
                        Go to Cart
                    </button>
                )}
            </div>
        </div>
    );
}
export default Menu;
