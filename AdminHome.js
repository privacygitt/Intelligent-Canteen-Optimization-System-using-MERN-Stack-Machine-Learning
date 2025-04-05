import React, { useEffect, useState } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import "chart.js/auto";
import { FaHome, FaTachometerAlt, FaUtensils, FaSignOutAlt, FaChartBar, FaChartPie, FaChartLine, FaBell } from "react-icons/fa";
import Lottie from "lottie-react";
import loadingAnimation from "./assests/loading.json"; // Fixed typo in folder name
import "../styles/AdminHome.css";

const AdminHome = () => {
  const [orderAnalysis, setOrderAnalysis] = useState(null);
  const [demandPrediction, setDemandPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState("home");

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:5000/api/orders/analyze-orders").then((res) => res.json()),
      fetch("http://localhost:5000/api/orders/predict-demand").then((res) => res.json())
    ])
      .then(([orderData, demandData]) => {
        setOrderAnalysis(orderData);
        setDemandPrediction(Array.isArray(demandData) ? demandData : []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  // Show Lottie animation while loading
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-64 mx-auto">
            <Lottie animationData={loadingAnimation} loop={true} />
          </div>
          <p className="mt-4 text-lg font-medium text-gray-600">Loading Order Analysis & Demand Prediction...</p>
        </div>
      </div>
    );
  }

  const highDemandItems = orderAnalysis?.high_demand?.map((item) => item.item) || [];
  const highDemandCounts = orderAnalysis?.high_demand?.map((item) => item.order_count) || [];
  const lowDemandItems = orderAnalysis?.low_demand?.map((item) => item.item) || [];
  const lowDemandCounts = orderAnalysis?.low_demand?.map((item) => item.order_count) || [];
  
  // Chart options for better appearance
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            family: 'Inter, sans-serif',
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.8)',
        titleFont: {
          family: 'Inter, sans-serif',
          size: 14
        },
        bodyFont: {
          family: 'Inter, sans-serif',
          size: 13
        },
        padding: 12,
        cornerRadius: 8
      }
    }
  };

  const highDemandData = {
    labels: highDemandItems,
    datasets: [
      {
        label: "High Demand Items",
        data: highDemandCounts,
        backgroundColor: "rgba(79, 70, 229, 0.8)",
        borderColor: "rgb(79, 70, 229)",
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const lowDemandData = {
    labels: lowDemandItems,
    datasets: [
      {
        label: "Low Demand Items",
        data: lowDemandCounts,
        backgroundColor: "rgba(249, 115, 22, 0.7)",
        borderColor: "rgb(249, 115, 22)",
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const pieData = {
    labels: ["High Demand Items", "Low Demand Items"],
    datasets: [
      {
        data: [highDemandCounts.reduce((a, b) => a + b, 0), lowDemandCounts.reduce((a, b) => a + b, 0)],
        backgroundColor: ["rgba(79, 70, 229, 0.8)", "rgba(249, 115, 22, 0.7)"],
        borderColor: ["rgb(79, 70, 229)", "rgb(249, 115, 22)"],
        borderWidth: 1,
      },
    ],
  };

  const demandDates = demandPrediction.map((entry) => entry.date);
  const predictedOrders = demandPrediction.map((entry) => entry.predicted_orders);

  const demandPredictionData = {
    labels: demandDates,
    datasets: [
      {
        label: "Predicted Orders",
        data: predictedOrders,
        backgroundColor: "rgba(16, 185, 129, 0.2)",
        borderColor: "rgb(16, 185, 129)",
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "rgb(16, 185, 129)",
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  // Get Current date for dashboard stats
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Calculate total orders for summary
  const totalHighDemand = highDemandCounts.reduce((a, b) => a + b, 0);
  const totalLowDemand = lowDemandCounts.reduce((a, b) => a + b, 0);
  const totalOrders = totalHighDemand + totalLowDemand;
  
  // Calculate average predicted orders
  const avgPredictedOrders = predictedOrders.length 
    ? Math.round(predictedOrders.reduce((a, b) => a + b, 0) / predictedOrders.length) 
    : 0;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-indigo-800 text-white">
        <div className="p-4 border-b border-indigo-700">
          <h2 className="text-2xl font-bold tracking-tight">Canteen Admin</h2>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="px-2 space-y-1">
            <a 
              href="/admin/home" 
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${activePage === 'home' ? 'bg-indigo-900 text-white' : 'text-indigo-100 hover:bg-indigo-700'}`}
              onClick={() => setActivePage('home')}
            >
              <FaHome className="mr-3 text-lg" />
              Dashboard
            </a>
            <a 
              href="/admin/dashboard" 
              className="flex items-center px-4 py-3 text-sm font-medium text-indigo-100 rounded-md hover:bg-indigo-700"
              onClick={() => setActivePage('dashboard')}
            >
              <FaTachometerAlt className="mr-3 text-lg" />
              Analytics
            </a>
            <a 
              href="/admin/menu" 
              className="flex items-center px-4 py-3 text-sm font-medium text-indigo-100 rounded-md hover:bg-indigo-700"
              onClick={() => setActivePage('menu')}
            >
              <FaUtensils className="mr-3 text-lg" />
              Menu Management
            </a>
          </div>
          <div className="pt-8 px-4 mt-auto">
            <a 
              href="/logout" 
              className="flex items-center px-4 py-3 text-sm font-medium text-indigo-100 bg-indigo-700 rounded-md hover:bg-indigo-600"
            >
              <FaSignOutAlt className="mr-3 text-lg" />
              Logout
            </a>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <h1 className="text-xl font-semibold text-gray-900">Order Analysis & Demand Prediction</h1>
            <div className="flex items-center">
              <span className="mr-4 text-sm font-medium text-gray-500">{currentDate}</span>
              <button className="p-1 text-gray-500 rounded-full hover:bg-gray-100">
                <FaBell className="text-lg" />
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="p-6 bg-white rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 bg-indigo-100 rounded-full">
                  <FaChartBar className="text-indigo-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Orders</p>
                  <p className="text-2xl font-semibold text-gray-900">{totalOrders}</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-white rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 rounded-full">
                  <FaChartPie className="text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">High Demand Items</p>
                  <p className="text-2xl font-semibold text-gray-900">{highDemandItems.length}</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-white rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 bg-red-100 rounded-full">
                  <FaChartPie className="text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Low Demand Items</p>
                  <p className="text-2xl font-semibold text-gray-900">{lowDemandItems.length}</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-white rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-full">
                  <FaChartLine className="text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Avg. Predicted Orders</p>
                  <p className="text-2xl font-semibold text-gray-900">{avgPredictedOrders}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="p-6 bg-white rounded-lg shadow">
              <h3 className="mb-6 text-lg font-semibold text-gray-800">High Demand Items</h3>
              <div className="h-80">
                <Bar data={highDemandData} options={chartOptions} />
              </div>
            </div>

            <div className="p-6 bg-white rounded-lg shadow">
              <h3 className="mb-6 text-lg font-semibold text-gray-800">Low Demand Items</h3>
              <div className="h-80">
                <Bar data={lowDemandData} options={chartOptions} />
              </div>
            </div>

            <div className="p-6 bg-white rounded-lg shadow">
              <h3 className="mb-6 text-lg font-semibold text-gray-800">Demand Distribution</h3>
              <div className="h-80">
                <Pie data={pieData} options={chartOptions} />
              </div>
            </div>

            <div className="p-6 bg-white rounded-lg shadow">
              <h3 className="mb-6 text-lg font-semibold text-gray-800">Predicted Orders Trend</h3>
              <div className="h-80">
                <Line data={demandPredictionData} options={chartOptions} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminHome;