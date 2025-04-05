import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import axios from "axios";
import "../styles/OrderTracking.css";

function OrderTrackingPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [estimatedTime, setEstimatedTime] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [mapView, setMapView] = useState(false);
  const [isLiveUpdating, setIsLiveUpdating] = useState(true);
  const navigate = useNavigate(); 
  const userId = localStorage.getItem("userId"); 

  useEffect(() => {
    if (!userId) {
      console.error("User ID is undefined");
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/orders/user/${userId}`);
        
        if (response.data.length > 0) {
          // Sort orders by createdAt (latest first)
          const sortedOrders = response.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
    
          // Get the most recent order
          const latestOrder = sortedOrders[0];
          setOrder(latestOrder);
          
          // Calculate estimated time based on order status
          calculateEstimatedTime(latestOrder);
          
          // Generate notifications based on status changes
          generateNotificationUpdates(latestOrder);
        } else {
          setOrder(null);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrder();
    
    // Only set interval if live updating is enabled
    let interval;
    if (isLiveUpdating) {
      interval = setInterval(fetchOrder, 10000); // Refresh every 10 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [userId, isLiveUpdating]);

  // Calculate estimated preparation time based on order status and items
  const calculateEstimatedTime = (order) => {
    if (!order) return null;
    
    // Base time in minutes
    let baseTime = 15;
    
    // Add time based on number of items
    const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
    const itemTime = Math.floor(totalItems / 2) * 5;
    
    // Adjust based on status
    let remainingPercentage = 1;
    switch(order.status) {
      case "Placed": remainingPercentage = 1; break;
      case "Preparing": remainingPercentage = 0.7; break;
      case "Ready": remainingPercentage = 0; break;
      case "Completed": remainingPercentage = 0; break;
      default: remainingPercentage = 1;
    }
    
    const estimatedTotal = baseTime + itemTime;
    const estimatedRemaining = Math.ceil(estimatedTotal * remainingPercentage);
    
    setEstimatedTime({
      total: estimatedTotal,
      remaining: estimatedRemaining
    });
  };

  // Generate notifications based on order status
  const generateNotificationUpdates = (newOrder) => {
    if (!newOrder) return;
    
    // This would typically come from a server with real timestamps
    // For demonstration, we'll create some based on the order status
    const baseTime = new Date(newOrder.createdAt);
    const now = new Date();
    
    let updates = [
      { 
        message: "Your order has been received",
        time: new Date(baseTime),
        status: "Placed"
      }
    ];
    
    if (newOrder.status === "Preparing" || newOrder.status === "Ready" || newOrder.status === "Completed") {
      updates.push({
        message: "Your food is being prepared",
        time: new Date(baseTime.getTime() + 5 * 60000), // 5 minutes after
        status: "Preparing"
      });
    }
    
    if (newOrder.status === "Ready" || newOrder.status === "Completed") {
      updates.push({
        message: "Your order is ready for pickup",
        time: new Date(baseTime.getTime() + 15 * 60000), // 15 minutes after
        status: "Ready"
      });
    }
    
    if (newOrder.status === "Completed") {
      updates.push({
        message: "Your order has been completed",
        time: new Date(baseTime.getTime() + 20 * 60000), // 20 minutes after
        status: "Completed"
      });
    }
    
    setNotifications(updates);
  };

  // Function to submit feedback
  const submitFeedback = async () => {
    if (!order || rating === 0) return;
    
    try {
      await axios.post(`http://localhost:5000/api/feedback`, {
        orderId: order._id,
        userId: userId,
        rating: rating,
        comment: feedback
      });
      
      // Hide feedback form after submission
      setShowFeedback(false);
      
      // Add a notification about feedback submission
      setNotifications([...notifications, {
        message: "Thank you for your feedback!",
        time: new Date(),
        status: "Feedback"
      }]);
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  // Function to determine the step number based on order status
  const getStepNumber = (status) => {
    switch(status) {
      case "Placed": return 1;
      case "Preparing": return 2;
      case "Ready": return 3;
      case "Completed": return 4;
      default: return 1;
    }
  };

  // Calculate the time since order was placed
  const getTimeSinceOrder = (createdAt) => {
    const orderTime = new Date(createdAt);
    const now = new Date();
    const diffInMinutes = Math.floor((now - orderTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes === 1) return "1 minute ago";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours === 1) return "1 hour ago";
    return `${diffInHours} hours ago`;
  };

  // Format datetime
  const formatDateTime = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format time for notifications
  const formatTime = (dateString) => {
    const options = { 
      hour: '2-digit', 
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };

  // Reorder the same items
  const reorderSameItems = () => {
    if (!order) return;
    
    // In a real app, you'd call your API to create a new order
    // For demo purposes, we'll just navigate to the cart
    localStorage.setItem("reorderItems", JSON.stringify(order.items));
    navigate("/cart");
  };

  // Toggle live updates
  const toggleLiveUpdates = () => {
    setIsLiveUpdating(!isLiveUpdating);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your order...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="no-order-container">
        <div className="no-order-icon">📋</div>
        <h2>No Recent Orders Found</h2>
        <p>Looks like you haven't placed any orders yet.</p>
        <button className="primary-button" onClick={() => navigate("/menu")}>
          Browse Menu
        </button>
      </div>
    );
  }

  const stepNumber = getStepNumber(order.status);

  return (
    <div className="order-tracking-page">
      {/* Top Navigation */}
      <nav className="top-navigation">
        <div className="nav-left">
          <button className="nav-button back-button" onClick={() => navigate(-1)}>
            <span className="icon">←</span>
          </button>
          <h1>Order Tracking</h1>
        </div>
        <div className="nav-right">
          <button className="nav-button" onClick={() => navigate("/menu")}>Menu</button>
          <button className="nav-button" onClick={() => navigate("/recent-orders")}>Orders</button>
          <button className={`nav-button ${isLiveUpdating ? 'active' : ''}`} onClick={toggleLiveUpdates}>
            {isLiveUpdating ? "Live ●" : "Live ○"}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="order-tracking-content">
        {/* Order Status Card */}
        <div className="order-status-card">
          <div className="order-header">
            <div className="order-info">
              <h2>Order #{order._id.substr(-6)}</h2>
              <p className="order-timestamp">
                {formatDateTime(order.createdAt)} 
                <span className="order-time-ago">({getTimeSinceOrder(order.createdAt)})</span>
              </p>
            </div>
            <div className="order-badge" data-status={order.status.toLowerCase()}>
              {order.status}
            </div>
          </div>

          {/* Estimated Time */}
          {estimatedTime && estimatedTime.remaining > 0 && (
            <div className="estimated-time">
              <div className="time-icon">⏱️</div>
              <div className="time-info">
                <p>Estimated Time Remaining</p>
                <h3>{estimatedTime.remaining} minutes</h3>
              </div>
            </div>
          )}

          {/* Progress Tracker */}
          <div className="progress-tracker">
            <div className="progress-bar">
              <div className="progress-fill" style={{width: `${(stepNumber - 1) * 33.33}%`}}></div>
            </div>
            <div className="progress-steps">
              <div className={`progress-step ${stepNumber >= 1 ? 'active' : ''}`}>
                <div className="step-marker">1</div>
                <div className="step-label">Placed</div>
              </div>
              <div className={`progress-step ${stepNumber >= 2 ? 'active' : ''}`}>
                <div className="step-marker">2</div>
                <div className="step-label">Preparing</div>
              </div>
              <div className={`progress-step ${stepNumber >= 3 ? 'active' : ''}`}>
                <div className="step-marker">3</div>
                <div className="step-label">Ready</div>
              </div>
              <div className={`progress-step ${stepNumber >= 4 ? 'active' : ''}`}>
                <div className="step-marker">4</div>
                <div className="step-label">Completed</div>
              </div>
            </div>
          </div>

          {/* Status Message */}
          <div className="status-message">
            {order.status === "Placed" && (
              <p>Your order has been received and will be prepared soon.</p>
            )}
            {order.status === "Preparing" && (
              <p>We're currently preparing your delicious meal.</p>
            )}
            {order.status === "Ready" && (
              <p>Your order is ready! Please collect it from the counter.</p>
            )}
            {order.status === "Completed" && (
              <p>Your order has been completed. Enjoy your meal!</p>
            )}
          </div>

          {/* View toggles */}
          <div className="view-toggles">
            <button 
              className={`view-toggle-button ${!mapView ? 'active' : ''}`} 
              onClick={() => setMapView(false)}
            >
              Updates
            </button>
            <button 
              className={`view-toggle-button ${mapView ? 'active' : ''}`} 
              onClick={() => setMapView(true)}
            >
              Restaurant Map
            </button>
          </div>

          {/* Notifications Timeline or Map */}
          {mapView ? (
            <div className="map-container">
              <div className="restaurant-map">
                <div className="map-legend">
                  <div className="legend-item">
                    <div className="legend-marker customer"></div>
                    <span>You</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-marker restaurant"></div>
                    <span>Restaurant</span>
                  </div>
                </div>
                <div className="map-graphic">
                  <div className="restaurant-building">
                    <div className="restaurant-entrance">Entrance</div>
                    <div className="restaurant-counter">Counter</div>
                    <div className="restaurant-kitchen">Kitchen</div>
                  </div>
                  <div className="pickup-point">
                    <div className="pickup-marker">Pick up here</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="notifications-timeline">
              {notifications.map((notification, index) => (
                <div key={index} className={`notification-item ${notification.status.toLowerCase()}`}>
                  <div className="notification-time">{formatTime(notification.time)}</div>
                  <div className="notification-content">
                    <div className="notification-dot"></div>
                    <div className="notification-message">{notification.message}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Details Card */}
        <div className="order-details-card">
          <h3>Order Details</h3>
          <div className="order-items">
            {order.items.map((item, index) => (
              <div key={index} className="order-item">
                <div className="item-info">
                  <span className="item-name">{item.name}</span>
                  {item.customizations && (
                    <span className="item-customizations">
                      {item.customizations.join(", ")}
                    </span>
                  )}
                  <span className="item-quantity">x{item.quantity}</span>
                </div>
                <span className="item-price">₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="order-summary">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{order.totalAmount.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Tax</span>
              <span>₹{(order.totalAmount * 0.05).toFixed(2)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="summary-row discount">
                <span>Discount</span>
                <span>-₹{order.discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="summary-row total">
              <span>Total</span>
              <span>₹{(order.totalAmount + (order.totalAmount * 0.05)).toFixed(2)}</span>
            </div>
          </div>
          <div className="payment-info">
            <div className="payment-row">
              <span className="payment-label">Payment Method:</span>
              <span className="payment-value">{order.paymentMethod}</span>
            </div>
            <div className="payment-row">
              <span className="payment-label">Order Type:</span>
              <span className="payment-value">{order.orderType || "Pickup"}</span>
            </div>
          </div>
        </div>

        {/* Feedback Section */}
        {order.status === "Completed" && !showFeedback ? (
          <div className="feedback-prompt">
            <h3>How was your meal?</h3>
            <p>We'd love to hear your feedback!</p>
            <button 
              className="secondary-button" 
              onClick={() => setShowFeedback(true)}
            >
              Leave Feedback
            </button>
          </div>
        ) : showFeedback && (
          <div className="feedback-form">
            <h3>Rate Your Experience</h3>
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span 
                  key={star} 
                  className={`star ${rating >= star ? 'active' : ''}`}
                  onClick={() => setRating(star)}
                >
                  ★
                </span>
              ))}
            </div>
            <textarea
              placeholder="Tell us about your experience..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows="3"
            />
            <div className="feedback-buttons">
              <button 
                className="secondary-button" 
                onClick={() => setShowFeedback(false)}
              >
                Cancel
              </button>
              <button 
                className="primary-button" 
                onClick={submitFeedback}
                disabled={rating === 0}
              >
                Submit Feedback
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="primary-button" onClick={() => navigate("/menu")}>
            Order More
          </button>
          <button className="secondary-button" onClick={reorderSameItems}>
            Reorder Same Items
          </button>
          <button className="tertiary-button" onClick={() => navigate("/help")}>
            Need Help?
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderTrackingPage;