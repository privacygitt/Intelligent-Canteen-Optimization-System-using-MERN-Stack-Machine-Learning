const express = require("express");
const Order = require("../models/Order");
const { PythonShell } = require("python-shell");
const router = express.Router();

// Create a new order
router.post("/", async (req, res) => {
  try {
    console.log("Received request body:", req.body);
    const { items, totalAmount, user, paymentMethod, preOrderDate } = req.body;
    console.log("Destructured preOrderDate:", preOrderDate);
    const newOrder = new Order({
      items,
      totalAmount,
      user,
      paymentMethod,
      preOrderDate: preOrderDate ? new Date(preOrderDate) : null,
      status: "Pending",
    });
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Order Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// Get all orders (For Admin)
router.get("/", async (req, res) => {
    try {
      const orders = await Order.find().sort({ createdAt: -1 }); // Latest orders first
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
});

// Update Order Status (For Admin)
router.put("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    
    // Log order before update
    console.log("Current order:", order);
    
    const allowedStatuses = ["Pending", "Preparing", "Ready for Pickup", "Completed"];
    if (!allowedStatuses.includes(req.body.status)) {
      return res.status(400).json({ message: "Invalid status transition" });
    }

    // Ensure status transitions follow the flow
    const statusFlow = ["Pending", "Preparing", "Ready for Pickup", "Completed"];
    const currentStatusIndex = statusFlow.indexOf(order.status);
    const nextStatusIndex = statusFlow.indexOf(req.body.status);
    
    if (nextStatusIndex === -1 || nextStatusIndex <= currentStatusIndex) {
      return res.status(400).json({ message: "Invalid status transition" });
    }

    order.status = req.body.status;
    
    // Log the new status before saving
    console.log("Updated order status:", order);

    await order.save();
    res.status(200).json({ message: "Order status updated", order });
  } catch (error) {
    // Log the error
    console.error("Error in updating order status:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// Get the latest order for a specific user
router.get("/user/:userId", async (req, res) => {
  try {
    console.log("Fetching orders for user:", req.params.userId);

    const orders = await Order.find({ user: req.params.userId }) // Fetch all orders for the user
      .populate("items", "name price image")
      .sort({ createdAt: -1 }); // Sort orders by latest first

    if (!orders.length) {
      return res.status(404).json({ message: "No orders found" });
    }

    res.json(orders); // Return all orders
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/* router.get("/api/orders/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    console.log("Backend received orderId:", orderId); // Debugging log

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Server error" });
  }
}); */

router.get("/analyze-orders", async (req, res) => {
  try {
    // Aggregate order data for ML analysis
    const orderData = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.name",
          order_count: { $sum: 1 },
        },
      },
      { $project: { item: "$_id", order_count: 1, _id: 0 } },
    ]);

    if (!orderData.length) {
      return res.status(404).json({ message: "No order data available for analysis" });
    }

    // Python script execution options
    let options = {
      mode: "text",
      pythonPath: "C:\\Users\\gsair\\AppData\\Local\\Programs\\Python\\Python312\\python.exe", // Update path if needed
      scriptPath: "C:/Users/gsair/canteen/ml/",
      args: [],
    };

    let pyshell = new PythonShell("order_analysis.py", options);

    // Send order data to Python script
    pyshell.send(JSON.stringify(orderData));

    let result = "";
    pyshell.on("message", (message) => {
      result += message;
    });

    pyshell.end((err) => {
      if (err) {
        console.error("Python Script Error:", err);
        return res.status(500).json({ message: "Python script error", error: err.message });
      }
      try {
        const analysisResult = JSON.parse(result);

        // Append additional order analytics
        const totalOrders = orderData.reduce((acc, item) => acc + item.order_count, 0);
        const mostOrderedItem = orderData.reduce((max, item) => (item.order_count > max.order_count ? item : max), orderData[0]);
        const leastOrderedItem = orderData.reduce((min, item) => (item.order_count < min.order_count ? item : min), orderData[0]);

        const analytics = {
          ...analysisResult,
          total_orders: totalOrders,
          most_ordered: mostOrderedItem,
          least_ordered: leastOrderedItem,
        };

        res.json(analytics);
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        res.status(500).json({ message: "Failed to parse Python response", error: parseError.message });
      }
    });
  } catch (error) {
    console.error("ML Analysis Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});



router.get("/predict-demand", async (req, res) => {
  try {
    const orderData = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          order_count: { $sum: 1 },
        },
      },
      { $project: { date: "$_id", order_count: 1, _id: 0 } },
    ]);

    let options = {
      mode: "text",
      pythonPath: "C:\\Users\\gsair\\AppData\\Local\\Programs\\Python\\Python312\\python.exe",
      scriptPath: "C:/Users/gsair/canteen/ml/",
      args: [],
    };

    let pyshell = new PythonShell("demand_prediction.py", options);

    pyshell.send(JSON.stringify(orderData));

    let result = "";

    pyshell.on("message", (message) => {
      result += message;
    });

    pyshell.end((err) => {
      if (err) {
        console.error("Python Script Error:", err);
        return res.status(500).json({ message: "Python script error", error: err.message });
      }

      try {
        let predictionResult = JSON.parse(result);

        // Ensure lower bound is non-negative
        predictionResult = predictionResult.map((p) => ({
          date: p.date,
          predicted_orders: p.predicted_orders,
          lower_bound: Math.max(0, p.lower_bound), // Prevent negative lower bound
          upper_bound: p.upper_bound,
        }));

        res.json(predictionResult);
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        res.status(500).json({ message: "Failed to parse Python response", error: parseError.message });
      }
    });
  } catch (error) {
    console.error("Prediction Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
