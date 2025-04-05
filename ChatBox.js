import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { MessageSquare, Send, ShoppingCart, HelpCircle, Utensils, ChevronLeft, X, Minimize2, Maximize2, Clock } from "lucide-react";
import "../styles/ChatBox.css";

function ChatBox() {
  const [messages, setMessages] = useState([{ text: "Hello! I'm your food assistant. Would you like to order something today?", sender: "bot", timestamp: new Date() }]);
  const [showCategories, setShowCategories] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [popularItems, setPopularItems] = useState([]);
  const [showEmoji, setShowEmoji] = useState(false);
  const [suggestedResponses, setSuggestedResponses] = useState([]);
  const [theme, setTheme] = useState("light");
  const messagesEndRef = useRef(null);
  
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const emojis = ["😊", "🙏", "👍", "❤️", "🍕", "🍔", "🍟", "🍗", "🍜", "🥗", "😋"];

  useEffect(() => {
    if (showCategories) {
      axios.get("http://localhost:5000/api/menu/categories")
        .then(response => setCategories(response.data))
        .catch(error => console.error("Error fetching categories:", error));
    }
  }, [showCategories]);

  useEffect(() => {
    // Fetch popular items when chat opens
    if (isChatOpen) {
      fetchPopularItems();
      fetchRecentOrders();
    }
  }, [isChatOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Filter menu items based on search query
    if (menuItems.length > 0 && searchQuery) {
      const filtered = menuItems.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems(menuItems);
    }
  }, [searchQuery, menuItems]);

  const fetchRecentOrders = () => {
    // Simulate fetching recent orders (replace with actual API call)
    const mockRecentOrders = [
      { id: 1, name: "Margherita Pizza", price: 299, image: "https://example.com/pizza.jpg" },
      { id: 2, name: "Chicken Burger", price: 199, image: "https://example.com/burger.jpg" }
    ];
    setRecentOrders(mockRecentOrders);
  };

  const fetchPopularItems = () => {
    // Simulate fetching popular items (replace with actual API call)
    const mockPopularItems = [
      { id: 1, name: "Paneer Tikka", price: 249, image: "https://example.com/paneer.jpg", rating: 4.8 },
      { id: 2, name: "Veg Biryani", price: 299, image: "https://example.com/biryani.jpg", rating: 4.7 }
    ];
    setPopularItems(mockPopularItems);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleOrderFood = () => {
    setShowCategories(true);
    addMessage("I'd like to order food", "user");
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      addMessage("Great! Please select a category:", "bot");
      setSuggestedResponses(["Show popular items", "View my recent orders", "Search the menu"]);
    }, 1000);
  };

  const addMessage = (text, sender) => {
    setMessages(prev => [...prev, { text, sender, timestamp: new Date() }]);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setMenuItems([]);
    setSearchQuery("");
    
    addMessage(`I'll go with ${category}`, "user");
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      addMessage(`Great choice! Here are the available items in ${category}:`, "bot");
      
      axios.get(`http://localhost:5000/api/menu?category=${category}`)
        .then(response => {
          setMenuItems(response.data);
          setFilteredItems(response.data);
          
          // Set contextual suggested responses
          setSuggestedResponses([
            `Sort by price: Low to High`,
            `Only show vegetarian options`,
            `What's popular in ${category}?`
          ]);
        })
        .catch(error => {
          console.error("Error fetching menu items:", error);
          addMessage("Sorry, I couldn't fetch the menu items. Please try again.", "bot");
        });
    }, 1200);
  };

  const handleAddToCart = (item) => {
    setCart(prevCart => [...prevCart, item]);
    addMessage(`Add ${item.name} to my cart`, "user");
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      addMessage(`${item.name} has been added to your cart. Anything else?`, "bot");
      setSuggestedResponses([
        "Checkout now", 
        "Continue shopping", 
        `Add a side with ${item.name}`
      ]);
    }, 800);
    
    addToCart(item);
  };

  const handleProceedToCart = () => {
    addMessage("I'm ready to checkout", "user");
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      addMessage("Taking you to your cart to complete the order!", "bot");
      setTimeout(() => navigate("/cart", { state: { cartItems: cart } }), 1000);
    }, 800);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSearchQuery("");
    addMessage("Show me different categories", "user");
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      addMessage("Sure! Here are all our food categories:", "bot");
    }, 800);
  };

  const handleShowPopularItems = () => {
    addMessage("Show me popular items", "user");
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      addMessage("Here are our most popular items right now:", "bot");
    }, 800);
  };

  const handleViewRecentOrders = () => {
    addMessage("Show my recent orders", "user");
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      addMessage("Here are your recent orders. Would you like to reorder any of these?", "bot");
    }, 800);
  };

  const handleSuggestedResponse = (response) => {
    setInputText(response);
    handleSendMessage({ preventDefault: () => {} }, response);
  };

  const handleSearchMenu = () => {
    addMessage(`Search for: ${searchQuery}`, "user");
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      if (filteredItems.length > 0) {
        addMessage(`I found ${filteredItems.length} items matching "${searchQuery}":`, "bot");
      } else {
        addMessage(`Sorry, I couldn't find any items matching "${searchQuery}". Would you like to try a different search?`, "bot");
        setSuggestedResponses(["Show all items", "Browse categories", "View popular items"]);
      }
    }, 800);
  };

  const handleSendMessage = (e, overrideText = null) => {
    e.preventDefault();
    const text = overrideText || inputText;
    if (!text.trim()) return;
    
    addMessage(text, "user");
    setInputText("");
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      
      const lowerText = text.toLowerCase();
      if (lowerText.includes("order") || lowerText.includes("food")) {
        handleOrderFood();
      } else if (lowerText.includes("help")) {
        addMessage("I can help you order food from our menu. Here are some things you can do:", "bot");
        setSuggestedResponses([
          "Order food", 
          "View popular items",
          "Search for an item"
        ]);
      } else if (lowerText.includes("checkout") || lowerText.includes("cart")) {
        if (cart.length > 0) {
          handleProceedToCart();
        } else {
          addMessage("Your cart is empty. Would you like to order something?", "bot");
          setSuggestedResponses(["Show menu", "Show popular items"]);
        }
      } else if (lowerText.includes("popular") || lowerText.includes("best seller")) {
        handleShowPopularItems();
      } else if (lowerText.includes("recent") || lowerText.includes("history") || lowerText.includes("previous order")) {
        handleViewRecentOrders();
      } else if (lowerText.includes("search")) {
        setSearchQuery(lowerText.replace("search", "").trim());
        handleSearchMenu();
      } else if (lowerText.includes("dark") || lowerText.includes("light") || lowerText.includes("theme")) {
        toggleTheme();
        addMessage(`I've switched to ${theme === "light" ? "dark" : "light"} mode for you.`, "bot");
      } else if (lowerText.includes("veg") || lowerText.includes("vegetarian")) {
        const vegItems = menuItems.filter(item => item.type && item.type.toLowerCase() === "veg");
        setFilteredItems(vegItems);
        addMessage("Here are the vegetarian options available:", "bot");
      } else {
        addMessage("I'm here to help you order food. Would you like to see our menu?", "bot");
        setSuggestedResponses(["Order food", "View popular items", "View recent orders"]);
      }
    }, 1000);
  };

  const formatTimestamp = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Chat toggle button */}
      <button 
        className={`chat-toggle-btn ${theme}`}
        onClick={toggleChat}
        style={{ display: isChatOpen ? 'none' : 'flex' }}
      >
        <MessageSquare size={20} />
        <span>Food Assistant</span>
      </button>
      
      {/* ChatBox */}
      <div 
        className={`chatbox-container ${!isChatOpen ? 'chatbox-minimized' : ''} ${theme}`} 
        style={{ display: isChatOpen || !isChatOpen ? 'flex' : 'none' }}
      >
        <div className="chatbox-header">
          <div className="chatbox-title" onClick={toggleChat}>
            <div className="chatbox-avatar">
              <span role="img" aria-label="robot">🤖</span>
            </div>
            <div>
              <h3>Food Assistant</h3>
              <div className="chatbox-status">
                <span className="status-indicator"></span>
                <span>Online</span>
              </div>
            </div>
          </div>
          <div className="chatbox-controls">
            <button onClick={toggleTheme} className="theme-toggle">
              {theme === "light" ? "🌙" : "☀️"}
            </button>
            <button onClick={() => setIsChatOpen(false)} className="minimize-btn">
              <Minimize2 size={16} />
            </button>
            <button onClick={() => navigate("/")} className="close-btn">
              <X size={16} />
            </button>
          </div>
        </div>
        
        {isChatOpen && (
          <>
            <div className="messages-container">
              {messages.map((msg, index) => (
                <div key={index} className={`message-wrapper ${msg.sender}-wrapper`}>
                  {msg.sender === "bot" && (
                    <div className="avatar-container">
                      <div className="bot-avatar">🤖</div>
                    </div>
                  )}
                  <div className={`message ${msg.sender}`}>
                    <div className="message-content">{msg.text}</div>
                    <div className="message-timestamp">
                      {formatTimestamp(msg.timestamp)}
                    </div>
                  </div>
                  {msg.sender === "user" && (
                    <div className="avatar-container">
                      <div className="user-avatar">👤</div>
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="message-wrapper bot-wrapper">
                  <div className="avatar-container">
                    <div className="bot-avatar">🤖</div>
                  </div>
                  <div className="message bot">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
              
              {showCategories && !selectedCategory && (
                <div className="interactive-options">
                  <h4>Food Categories</h4>
                  <div className="category-grid">
                    {categories.map((category, index) => (
                      <button 
                        key={index} 
                        className="category-card"
                        onClick={() => handleCategorySelect(category)}
                      >
                        <div className="category-icon">
                          {getCategoryIcon(category)}
                        </div>
                        <div className="category-name">{category}</div>
                      </button>
                    ))}
                  </div>
                  
                  <div className="recommendations-section">
                    <h4>Popular Now</h4>
                    <div className="popular-items-slider">
                      {popularItems.map(item => (
                        <div key={item.id} className="popular-item-card">
                          <div className="popular-item-image">
                            <img src={item.image || "/api/placeholder/150/100"} alt={item.name} />
                            <div className="popular-item-rating">
                              ⭐ {item.rating}
                            </div>
                          </div>
                          <div className="popular-item-info">
                            <h5>{item.name}</h5>
                            <div className="popular-item-price">₹{item.price}</div>
                          </div>
                          <button 
                            className="add-to-cart-btn small"
                            onClick={() => handleAddToCart(item)}
                          >
                            Add
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    <h4>Recent Orders</h4>
                    <div className="recent-orders-list">
                      {recentOrders.map(item => (
                        <div key={item.id} className="recent-order-item">
                          <div className="recent-order-image">
                            <img src={item.image || "/api/placeholder/60/60"} alt={item.name} />
                          </div>
                          <div className="recent-order-info">
                            <h5>{item.name}</h5>
                            <div className="recent-order-price">₹{item.price}</div>
                          </div>
                          <button 
                            className="reorder-btn"
                            onClick={() => handleAddToCart(item)}
                          >
                            Reorder
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {selectedCategory && (
                <div className="interactive-options">
                  <div className="options-header">
                    <h4>{selectedCategory} Menu</h4>
                    <div className="menu-controls">
                      <div className="search-container">
                        <input 
                          type="text" 
                          placeholder="Search items..." 
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="search-input"
                        />
                        <button className="search-btn" onClick={handleSearchMenu}>
                          🔍
                        </button>
                      </div>
                      <button className="back-btn" onClick={handleBackToCategories}>
                        <ChevronLeft size={16} /> Categories
                      </button>
                    </div>
                  </div>
                  
                  <div className="menu-filter-options">
                    <button className="filter-btn">Sort By: Price</button>
                    <button className="filter-btn">Veg Only</button>
                    <button className="filter-btn">Most Popular</button>
                  </div>
                  
                  <div className="menu-items-grid">
                    {filteredItems.length > 0 ? (
                      filteredItems.map(item => (
                        <div key={item._id || item.id} className="menu-item-card">
                          <div className="menu-item-image">
                            <img src={item.image || "/api/placeholder/150/120"} alt={item.name} />
                            {item.discount && (
                              <div className="item-discount-badge">
                                {item.discount}% OFF
                              </div>
                            )}
                          </div>
                          <div className="menu-item-info">
                            <h5>{item.name}</h5>
                            <div className="menu-item-description">
                              {item.description || `Delicious ${item.name.toLowerCase()} prepared with premium ingredients.`}
                            </div>
                            <div className="menu-item-meta">
                              <div className="menu-item-price">
                                ₹{item.price}
                                {item.originalPrice && (
                                  <span className="original-price">₹{item.originalPrice}</span>
                                )}
                              </div>
                              {item.type && (
                                <span className={`food-type ${item.type.toLowerCase()}`}>
                                  {item.type === "Veg" ? "🟢" : "🔴"} {item.type}
                                </span>
                              )}
                            </div>
                            {item.preparationTime && (
                              <div className="prep-time">
                                <Clock size={14} /> {item.preparationTime} mins
                              </div>
                            )}
                          </div>
                          <div className="item-card-actions">
                            <button 
                              className="add-to-cart-btn"
                              onClick={() => handleAddToCart(item)}
                            >
                              Add to Cart
                            </button>
                            <button className="customize-btn">
                              Customize
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="no-results">
                        <div className="no-results-icon">🍽️</div>
                        <h4>No items found</h4>
                        <p>Try a different search or category</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {suggestedResponses.length > 0 && (
              <div className="suggested-responses">
                {suggestedResponses.map((response, index) => (
                  <button 
                    key={index} 
                    className="suggested-response-btn"
                    onClick={() => handleSuggestedResponse(response)}
                  >
                    {response}
                  </button>
                ))}
              </div>
            )}
            
            <div className="chatbox-footer">
              {cart.length > 0 && (
                <div className="cart-summary">
                  <div className="cart-info">
                    <span className="cart-icon"><ShoppingCart size={16} /></span>
                    <span>{cart.length} item{cart.length !== 1 ? 's' : ''}</span>
                    <span className="cart-total">
                      ₹{cart.reduce((sum, item) => sum + item.price, 0)}
                    </span>
                  </div>
                  <button 
                    className="checkout-btn"
                    onClick={handleProceedToCart}
                  >
                    Checkout
                  </button>
                </div>
              )}
              
              <form className="input-area" onSubmit={handleSendMessage}>
                <button 
                  type="button" 
                  className="emoji-btn"
                  onClick={() => setShowEmoji(!showEmoji)}
                >
                  😊
                </button>
                {showEmoji && (
                  <div className="emoji-picker">
                    {emojis.map((emoji, index) => (
                      <button 
                        key={index} 
                        className="emoji"
                        onClick={() => {
                          setInputText(inputText + emoji);
                          setShowEmoji(false);
                        }}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
                <button type="submit" className="send-btn">
                  <Send size={18} />
                </button>
              </form>
              
              {!showCategories && (
                <div className="quick-actions">
                  <button className="quick-action-btn" onClick={handleOrderFood}>
                    <Utensils size={16} /> Order Food
                  </button>
                  <button className="quick-action-btn" onClick={handleShowPopularItems}>
                    <span role="img" aria-label="popular">🔥</span> Popular
                  </button>
                  <button className="quick-action-btn" onClick={handleViewRecentOrders}>
                    <Clock size={16} /> Recent Orders
                  </button>
                  <button className="quick-action-btn" onClick={() => handleSendMessage({ preventDefault: () => {} }, "Help me")}>
                    <HelpCircle size={16} /> Help
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

// Helper function to get category icon
function getCategoryIcon(category) {
  const icons = {
    "Pizza": "🍕",
    "Burger": "🍔",
    "Chinese": "🥢",
    "Indian": "🍛",
    "Italian": "🍝",
    "Dessert": "🍰",
    "Beverages": "🥤",
    "Breakfast": "🍳"
  };
  
  return icons[category] || "🍽️";
}

export default ChatBox;