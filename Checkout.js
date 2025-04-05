import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import Lottie from "lottie-react";
import orderPlacedAnimation from "./assests/order.json";
import "../styles/checkout.css";

function Checkout() {
  const { cart, clearCart } = useContext(CartContext);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [qrCodeData, setQrCodeData] = useState(null);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderType, setOrderType] = useState("immediate");
  const [preOrderDate, setPreOrderDate] = useState("");
  const [activeStep, setActiveStep] = useState(1); // Track checkout steps
  const navigate = useNavigate();

  const totalAmount = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  const itemCount = cart.reduce((count, item) => count + (item.quantity || 1), 0);
  
  // Calculate delivery date based on order type
  const getDeliveryDate = () => {
    if (orderType === "preorder" && preOrderDate) {
      return new Date(preOrderDate).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
      });
    } else {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
      });
    }
  };

  const handlePayment = (method) => {
    setPaymentMethod(method);
    if (method === "Online") {
      const paymentData = {
        amount: totalAmount,
        orderId: Math.floor(Math.random() * 1000000),
      };
      setQrCodeData(paymentData);
      setActiveStep(3);
    } else {
      setQrCodeData(null);
      setActiveStep(3);
    }
  };

  const handleContinue = () => {
    if (activeStep === 1) {
      // Validate delivery options
      if (orderType === "preorder" && !preOrderDate) {
        alert("Please select a delivery date for your pre-order.");
        return;
      }
      setActiveStep(2);
    }
  };

  const handleOrder = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Please log in to complete your order");
      return;
    }

    if (!paymentMethod) {
      alert("Please select a payment method");
      return;
    }

    setIsProcessing(true);

    const orderData = {
      items: cart.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
        category: item.category || "Unknown",
      })),
      totalAmount,
      user: userId,
      paymentMethod,
      preOrderDate: orderType === "preorder" ? new Date(preOrderDate).toISOString() : null,
    };
    
    try {
      if (paymentMethod === "Online" && paymentStatus === "Success") {
        orderData.paymentStatus = "Success";
      } else if (paymentMethod === "COD") {
        orderData.paymentStatus = "Pending";
      }

      const response = await axios.post("http://localhost:5000/api/orders", orderData, {
        headers: { "Content-Type": "application/json" },
      });

      const savedOrder = response.data;

      setShowSuccessAnimation(true);
      setTimeout(() => {
        clearCart();
        navigate(`/order-tracking/${savedOrder._id}`);
      }, 3000);
    } catch (error) {
      console.error("Order Error:", error.response?.data || error.message);
      alert("We couldn't process your order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Simulate payment success for demo purposes
  useEffect(() => {
    if (paymentMethod === "Online" && qrCodeData) {
      const timer = setTimeout(() => {
        setPaymentStatus("Success");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [paymentMethod, qrCodeData]);

  return (
    <div className="checkout-container">
      {/* Checkout Progress */}
      <div className="checkout-progress">
        <div className={`progress-step ${activeStep >= 1 ? "active" : ""}`}>
          <div className="step-number">1</div>
          <div className="step-label">Order Details</div>
        </div>
        <div className="progress-line"></div>
        <div className={`progress-step ${activeStep >= 2 ? "active" : ""}`}>
          <div className="step-number">2</div>
          <div className="step-label">Payment</div>
        </div>
        <div className="progress-line"></div>
        <div className={`progress-step ${activeStep >= 3 ? "active" : ""}`}>
          <div className="step-number">3</div>
          <div className="step-label">Confirmation</div>
        </div>
      </div>

      <div className="checkout-content">
        {/* Left Side - Order Summary (Always visible) */}
        <div className="checkout-left">
          <div className="order-summary">
            <div className="summary-header">
              <h2>Order Summary</h2>
              <span className="item-count">{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
            </div>
            
            <div className="cart-items-container">
              {cart.map((item, index) => (
                <div key={index} className="cart-item">
                  <div className="item-image">
                    {item.image ? (
                      <img src={item.image} alt={item.name} />
                    ) : (
                      <div className="placeholder-image">
                        {item.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="item-details">
                    <h3 className="item-name">{item.name}</h3>
                    <p className="item-category">{item.category || "Uncategorized"}</p>
                  </div>
                  <div className="item-quantity-box">
                    <span>x{item.quantity || 1}</span>
                  </div>
                  <div className="item-price">₹{(item.price * (item.quantity || 1)).toFixed(2)}</div>
                </div>
              ))}
            </div>
            
            <div className="price-breakdown">
              <div className="price-row">
                <span>Subtotal</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
              <div className="price-row">
                <span>Delivery</span>
                <span className="free-delivery">FREE</span>
              </div>
              <div className="price-row">
                <span>Tax</span>
                <span>₹0.00</span>
              </div>
              <div className="price-divider"></div>
              <div className="price-row total">
                <span>Total</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="delivery-info">
              <div className="delivery-icon">🚚</div>
              <div className="delivery-details">
                <p className="delivery-heading">Estimated Delivery</p>
                <p className="delivery-date">{getDeliveryDate()}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Side - Checkout Steps */}
        <div className="checkout-right">
          {/* Step 1: Delivery Options */}
          {activeStep === 1 && (
            <div className="checkout-step-card">
              <div className="step-card-header">
                <h2>Delivery Options</h2>
              </div>
              
              <div className="delivery-options">
                <div className="option-heading">Choose Delivery Type</div>
                <div className="delivery-type-selector">
                  <div 
                    className={`delivery-option ${orderType === "immediate" ? "selected" : ""}`}
                    onClick={() => setOrderType("immediate")}
                  >
                    <div className="option-radio">
                      {orderType === "immediate" && <div className="radio-inner"></div>}
                    </div>
                    <div className="option-content">
                      <div className="option-icon immediate">⚡</div>
                      <div className="option-text">
                        <h3>Standard Delivery</h3>
                        <p>Delivery by tomorrow</p>
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    className={`delivery-option ${orderType === "preorder" ? "selected" : ""}`}
                    onClick={() => setOrderType("preorder")}
                  >
                    <div className="option-radio">
                      {orderType === "preorder" && <div className="radio-inner"></div>}
                    </div>
                    <div className="option-content">
                      <div className="option-icon scheduled">📅</div>
                      <div className="option-text">
                        <h3>Scheduled Delivery</h3>
                        <p>Choose your preferred date</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {orderType === "preorder" && (
                  <div className="date-selector">
                    <label htmlFor="preOrderDate">Select Delivery Date</label>
                    <input
                      type="date"
                      id="preOrderDate"
                      value={preOrderDate}
                      onChange={(e) => setPreOrderDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                )}
              </div>
              
              <button className="continue-button" onClick={handleContinue}>
                Continue to Payment
              </button>
            </div>
          )}
          
          {/* Step 2: Payment Methods */}
          {activeStep === 2 && (
            <div className="checkout-step-card">
              <div className="step-card-header">
                <h2>Payment Method</h2>
                <button className="back-button" onClick={() => setActiveStep(1)}>
                  Back
                </button>
              </div>
              
              <div className="payment-methods">
                <div className="payment-option-card" onClick={() => handlePayment("COD")}>
                  <div className="payment-option-content">
                    <div className="payment-icon cod">💵</div>
                    <div className="payment-details">
                      <h3>Cash On Delivery</h3>
                      <p>Pay when your order arrives</p>
                    </div>
                  </div>
                  <div className={`payment-check ${paymentMethod === "COD" ? "visible" : ""}`}>✓</div>
                </div>
                
                <div className="payment-option-card" onClick={() => handlePayment("Online")}>
                  <div className="payment-option-content">
                    <div className="payment-icon online">💳</div>
                    <div className="payment-details">
                      <h3>Online Payment</h3>
                      <p>UPI, Credit/Debit cards, Net Banking</p>
                    </div>
                  </div>
                  <div className={`payment-check ${paymentMethod === "Online" ? "visible" : ""}`}>✓</div>
                </div>
                
                <div className="payment-option-card disabled">
                  <div className="payment-option-content">
                    <div className="payment-icon wallet">💰</div>
                    <div className="payment-details">
                      <h3>Wallet</h3>
                      <p>Coming soon</p>
                    </div>
                  </div>
                  <div className="payment-soon">Soon</div>
                </div>
              </div>
            </div>
          )}
          
          {/* Step 3: Payment Confirmation */}
          {activeStep === 3 && (
            <div className="checkout-step-card">
              <div className="step-card-header">
                <h2>Confirm & Pay</h2>
                <button className="back-button" onClick={() => setActiveStep(2)}>
                  Back
                </button>
              </div>
              
              <div className="payment-summary">
                <div className="payment-method-summary">
                  <div className="summary-label">Payment Method</div>
                  <div className="summary-value">
                    <span className={`payment-icon-small ${paymentMethod === "COD" ? "cod" : "online"}`}>
                      {paymentMethod === "COD" ? "💵" : "💳"}
                    </span>
                    {paymentMethod === "COD" ? "Cash On Delivery" : "Online Payment"}
                  </div>
                </div>
                
                <div className="delivery-method-summary">
                  <div className="summary-label">Delivery</div>
                  <div className="summary-value">
                    <span className="delivery-icon-small">🚚</span>
                    {orderType === "immediate" ? "Standard Delivery" : "Scheduled Delivery"}
                    <span className="delivery-date-small">{getDeliveryDate()}</span>
                  </div>
                </div>
                
                <div className="price-summary-mini">
                  <div className="summary-label">Total Payment</div>
                  <div className="summary-total">₹{totalAmount.toFixed(2)}</div>
                </div>
              </div>
              
              {paymentMethod === "Online" && qrCodeData && (
                <div className="qr-payment-section">
                  <h3>Scan to Complete Payment</h3>
                  <div className="qr-wrapper">
                    <QRCode 
                      value={`https://paymentgateway.com/qr/${qrCodeData.orderId}`} 
                      size={180}
                      className="qr-code"
                    />
                    <div className="payment-amount-tag">₹{totalAmount.toFixed(2)}</div>
                  </div>
                  
                  {paymentStatus === "Success" ? (
                    <div className="payment-status success">
                      <div className="status-icon">✓</div>
                      <div className="status-message">Payment Successful</div>
                    </div>
                  ) : (
                    <div className="payment-status waiting">
                      <div className="pulse-ring"></div>
                      <div className="status-message">Waiting for payment...</div>
                    </div>
                  )}
                </div>
              )}
              
              <button 
                className={`place-order-button ${isProcessing ? "processing" : ""} ${(paymentMethod === "Online" && paymentStatus !== "Success") ? "disabled" : ""}`}
                onClick={handleOrder}
                disabled={isProcessing || (paymentMethod === "Online" && paymentStatus !== "Success")}
              >
                {isProcessing ? (
                  <>
                    <div className="button-spinner"></div>
                    Processing Order...
                  </>
                ) : (
                  <>
                    {paymentMethod === "Online" && paymentStatus !== "Success" ? 
                      "Waiting for Payment..." : 
                      "Place Order"}
                  </>
                )}
              </button>
              
              <div className="security-badges">
                <div className="badge">
                  <div className="badge-icon">🔒</div>
                  <div className="badge-text">Secure Payment</div>
                </div>
                <div className="badge">
                  <div className="badge-icon">✅</div>
                  <div className="badge-text">Easy Returns</div>
                </div>
                <div className="badge">
                  <div className="badge-icon">🛡️</div>
                  <div className="badge-text">Buyer Protection</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showSuccessAnimation && (
        <div className="success-overlay">
          <div className="success-animation-container">
            <Lottie animationData={orderPlacedAnimation} loop={false} />
            <div className="success-message">Order Placed Successfully!</div>
            <div className="order-details">
              <p>Thank you for your order!</p>
              <p>You will be redirected to tracking page shortly.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Checkout;