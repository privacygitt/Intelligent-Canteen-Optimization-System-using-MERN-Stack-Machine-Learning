import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [orderStats, setOrderStats] = useState({});
  const [revenueData, setRevenueData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (orders.length === 0) {
      setCurrentPage(1);
    } else {
      const totalPages = Math.ceil(orders.length / 10);
      if (currentPage > totalPages) {
        setCurrentPage(totalPages);
      }
    }
  }, [orders]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/orders");
      setOrders(res.data);
      calculateAnalytics(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateAnalytics = (orders) => {
    let revenue = 0;
    let statusCounts = { Pending: 0, Preparing: 0, "Ready for Pickup": 0, Completed: 0 };
    let dailyRevenue = {};

    orders.forEach((order) => {
      revenue += order.totalAmount;
      statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
      const orderDate = new Date(order.createdAt).toISOString().split("T")[0];
      dailyRevenue[orderDate] = (dailyRevenue[orderDate] || 0) + order.totalAmount;
    });

    setTotalRevenue(revenue);
    setOrderStats(statusCounts);
    setRevenueData(
      Object.entries(dailyRevenue).map(([date, amount]) => ({ date, amount }))
    );
  };

  const updateOrderStatus = async (orderId, currentStatus) => {
    const statusFlow = ["Pending", "Preparing", "Ready for Pickup", "Completed"];
    const nextStatus = statusFlow[statusFlow.indexOf(currentStatus) + 1] || "Completed";
    
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}`, { status: nextStatus });
      fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const filteredRevenueData = revenueData.filter(({ date }) => {
    if (!startDate || !endDate) return true;
    return date >= startDate && date <= endDate;
  });

  const pieData = Object.keys(orderStats).map((status) => ({
    name: status,
    value: orderStats[status],
  }));

  const COLORS = ["#6366F1", "#F59E0B", "#10B981", "#3B82F6"];
  const STATUS_COLORS = { 
    Pending: "#6366F1", 
    Preparing: "#F59E0B", 
    "Ready for Pickup": "#10B981", 
    Completed: "#3B82F6" 
  };

  const ordersPerPage = 10;
  const totalPages = Math.ceil(orders.length / ordersPerPage);
  const displayedOrders = orders.slice((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 bg-indigo-600">
          <h2 className="text-xl font-bold text-white">Restaurant Admin</h2>
        </div>
        <nav className="mt-6">
          <div className="px-4">
            <div className="flex flex-col space-y-2">
              <button 
                onClick={() => navigate("/admin/home")} 
                className="flex items-center px-4 py-3 text-gray-600 rounded-lg hover:bg-indigo-50"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
                <span>Home</span>
              </button>
              <button 
                className="flex items-center px-4 py-3 text-white bg-indigo-500 rounded-lg"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
                <span>Dashboard</span>
              </button>
              <button 
                onClick={() => navigate("/admin/menu")} 
                className="flex items-center px-4 py-3 text-gray-600 rounded-lg hover:bg-indigo-50"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
                <span>Menu Management</span>
              </button>
              <button 
                onClick={() => { localStorage.clear(); navigate("/admin-login"); }} 
                className="flex items-center px-4 py-3 mt-8 text-red-600 rounded-lg hover:bg-red-50"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label htmlFor="start-date" className="text-sm font-medium text-gray-600">Start Date</label>
                <input 
                  id="start-date"
                  type="date" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)} 
                  className="px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex items-center space-x-2">
                <label htmlFor="end-date" className="text-sm font-medium text-gray-600">End Date</label>
                <input 
                  id="end-date"
                  type="date" 
                  value={endDate} 
                  onChange={(e) => setEndDate(e.target.value)} 
                  className="px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-12 h-12 border-4 border-t-4 border-gray-200 rounded-full border-t-indigo-500 animate-spin"></div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Analytics Cards */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="p-6 bg-white rounded-lg shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">₹{totalRevenue.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-indigo-100 rounded-full">
                      <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-white rounded-lg shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Orders</p>
                      <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-full">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-white rounded-lg shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                      <p className="text-2xl font-bold text-gray-900">{orderStats.Pending || 0}</p>
                    </div>
                    <div className="p-3 bg-yellow-100 rounded-full">
                      <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-white rounded-lg shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Completed Orders</p>
                      <p className="text-2xl font-bold text-gray-900">{orderStats.Completed || 0}</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-full">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="p-6 bg-white rounded-lg shadow-md">
                  <h3 className="mb-4 text-lg font-medium text-gray-800">Revenue Over Time</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={filteredRevenueData}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`₹${value}`, "Revenue"]} />
                        <Bar dataKey="amount" fill="#6366F1" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="p-6 bg-white rounded-lg shadow-md">
                  <h3 className="mb-4 text-lg font-medium text-gray-800">Order Status Distribution</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie 
                          data={pieData} 
                          cx="50%" 
                          cy="50%" 
                          outerRadius={80} 
                          innerRadius={50}
                          paddingAngle={5}
                          dataKey="value"
                          label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {pieData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={COLORS[index % COLORS.length]} 
                            />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value, name) => [value, name]} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Orders Table */}
              <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="mb-4 text-lg font-medium text-gray-800">Recent Orders</h3>
                {orders.length === 0 ? (
                  <div className="flex items-center justify-center h-32 text-gray-500">
                    No orders available
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left text-gray-500 bg-gray-50">
                            <th className="px-4 py-3">#</th>
                            <th className="px-4 py-3">Order ID</th>
                            <th className="px-4 py-3">Total</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Schedule</th>
                            <th className="px-4 py-3">Items</th>
                            <th className="px-4 py-3">Payment</th>
                            <th className="px-4 py-3">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {displayedOrders.map((order, index) => (
                            <tr key={order._id} className="hover:bg-gray-50">
                              <td className="px-4 py-4 text-sm text-gray-500">
                                {(currentPage - 1) * ordersPerPage + index + 1}
                              </td>
                              <td className="px-4 py-4 text-sm font-medium text-gray-900">
                                #{order._id.slice(-8)}
                              </td>
                              <td className="px-4 py-4 text-sm font-medium text-gray-900">
                                ₹{order.totalAmount}
                              </td>
                              <td className="px-4 py-4">
                                <span 
                                  className="px-2 py-1 text-xs font-medium rounded-full"
                                  style={{ 
                                    backgroundColor: `${STATUS_COLORS[order.status]}20`, 
                                    color: STATUS_COLORS[order.status] 
                                  }}
                                >
                                  {order.status}
                                </span>
                              </td>
                              <td className="px-4 py-4 text-sm text-gray-500">
                                {order.preOrderDate 
                                  ? `Pre-order on ${new Date(order.preOrderDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}` 
                                  : 'Immediate'}
                              </td>
                              <td className="px-4 py-4">
                                <div className="max-w-xs text-sm text-gray-500">
                                  {order.items.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between mb-1">
                                      <span>{item.name}</span>
                                      <span>₹{item.price} × {item.quantity}</span>
                                    </div>
                                  ))}
                                </div>
                              </td>
                              <td className="px-4 py-4">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  order.paymentMethod === 'Online Payment' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {order.paymentMethod === 'Online Payment' ? 'Paid' : 'COD'}
                                </span>
                              </td>
                              <td className="px-4 py-4">
                                {order.status !== 'Completed' ? (
                                  <button 
                                    onClick={() => updateOrderStatus(order._id, order.status)}
                                    className="px-3 py-1 text-xs font-medium text-white bg-indigo-500 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                  >
                                    Next Status
                                  </button>
                                ) : (
                                  <span className="text-sm text-gray-500">Completed</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="flex items-center justify-between mt-6">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md ${
                          currentPage === 1 
                            ? 'opacity-50 cursor-not-allowed' 
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        Previous
                      </button>
                      <p className="text-sm text-gray-700">
                        Page <span className="font-medium">{currentPage}</span> of{" "}
                        <span className="font-medium">{totalPages}</span>
                      </p>
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md ${
                          currentPage === totalPages 
                            ? 'opacity-50 cursor-not-allowed' 
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        Next
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;