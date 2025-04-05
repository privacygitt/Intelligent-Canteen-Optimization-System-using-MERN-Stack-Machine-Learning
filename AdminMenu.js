import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Lottie from "lottie-react";
import successAnimation from "./assests/item.json";
import { 
  ChevronDown, 
  PlusCircle, 
  Utensils, 
  ChartBar, 
  LogOut, 
  Trash2, 
  Edit, 
  AlertTriangle, 
  X, 
  Search, 
  Coffee
} from "lucide-react";

const AdminMenu = () => {
    const [menu, setMenu] = useState([]);
    const [editItem, setEditItem] = useState(null);
    const [isEditingItem, setIsEditingItem] = useState(false);
    const [filteredMenu, setFilteredMenu] = useState([]);
    const [newItem, setNewItem] = useState({ name: "", category: "", type: "Veg", price: "", image: "", stock: 0 });
    const [showSuccess, setShowSuccess] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [isAddingItem, setIsAddingItem] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        fetchMenu();
    }, []);

    useEffect(() => {
        const filtered = menu.filter(item => {
            const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                item.category.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
        setFilteredMenu(filtered);
    }, [selectedCategory, searchQuery, menu]);

    const fetchMenu = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/foods");
            setMenu(res.data);
            setFilteredMenu(res.data);
        } catch (error) {
            console.error("Error fetching menu:", error);
        }
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        if (!newItem.name || !newItem.category || !newItem.type || !newItem.price || !newItem.image || newItem.stock === "") {
            alert("Please fill all fields!");
            return;
        }
        try {
            const res = await axios.post("http://localhost:5000/api/foods", newItem);
            setMenu([...menu, res.data]);
            setFilteredMenu([...menu, res.data]);
            setNewItem({ name: "", category: "", type: "Veg", price: "", image: "", stock: 0 });
            setShowSuccess(true);
            setIsAddingItem(false);
            setTimeout(() => setShowSuccess(false), 2000);
        } catch (error) {
            console.error("Error adding item:", error);
        }
    };

    const openDialog = (id) => {
        setDeleteItemId(id);
        setShowDialog(true);
    };

    const closeDialog = () => {
        setShowDialog(false);
        setDeleteItemId(null);
    };

    const deleteItemConfirmed = async () => {
        if (!deleteItemId) return;
        try {
            await axios.delete(`http://localhost:5000/api/foods/${deleteItemId}`);
            const updatedMenu = menu.filter(item => item._id !== deleteItemId);
            setMenu(updatedMenu);
            setFilteredMenu(updatedMenu);
        } catch (error) {
            console.error("Error deleting item:", error);
        }
        closeDialog();
    };

    const handleCategoryChange = (e) => {
        const category = e.target.value;
        setSelectedCategory(category);
    };

    const groupedMenu = filteredMenu.reduce((acc, item) => {
        if (!acc[item.category]) {
            acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
    }, {});

    const openEditDialog = (item) => {
        setEditItem({...item});
        setIsEditingItem(true);
    };

    const closeEditDialog = () => {
        setEditItem(null);
        setIsEditingItem(false);
    };

    const handleEditItem = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(`http://localhost:5000/api/foods/${editItem._id}`, editItem);
            const updatedMenu = menu.map((item) => (item._id === editItem._id ? res.data : item));
            setMenu(updatedMenu);
            setIsEditingItem(false);
            setEditItem(null);
        } catch (error) {
            console.error("Error updating item:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Modern Navbar */}
            <nav className="bg-white shadow-md px-6 py-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center">
                        <Coffee className="text-blue-600 w-6 h-6 mr-2" />
                        <h2 className="text-xl font-bold text-gray-800">Food Admin</h2>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button 
                            className="flex items-center px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={() => navigate("/admin/dashboard")}
                        >
                            <ChartBar className="w-5 h-5 mr-2" />
                            <span>Dashboard</span>
                        </button>
                        <button 
                            className="flex items-center px-4 py-2 rounded-lg text-white bg-blue-600 shadow-md"
                            onClick={() => navigate("/admin/menu")}
                        >
                            <Utensils className="w-5 h-5 mr-2" />
                            <span>Menu</span>
                        </button>
                        <button 
                            className="flex items-center px-4 py-2 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                            onClick={() => navigate("/admin")}
                        >
                            <LogOut className="w-5 h-5 mr-2" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto py-8 px-6">
                {/* Header with actions */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Menu Management</h1>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="w-5 h-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search items..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                        </div>
                        <div className="flex items-center">
                            <label className="mr-2 text-gray-700">Category:</label>
                            <select 
                                className="border border-gray-300 rounded-lg py-2 px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={selectedCategory} 
                                onChange={handleCategoryChange}
                            >
                                <option value="All">All Categories</option>
                                {[...new Set(menu.map(item => item.category))].map((category) => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>
                        <button 
                            className={`flex items-center justify-center px-4 py-2 rounded-lg transition-colors ${
                                isAddingItem 
                                    ? "bg-gray-200 text-gray-800 hover:bg-gray-300" 
                                    : "bg-blue-600 text-white hover:bg-blue-700"
                            }`}
                            onClick={() => setIsAddingItem(!isAddingItem)}
                        >
                            {isAddingItem ? (
                                <>
                                    <X className="w-5 h-5 mr-2" />
                                    <span>Cancel</span>
                                </>
                            ) : (
                                <>
                                    <PlusCircle className="w-5 h-5 mr-2" />
                                    <span>Add New Item</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Add Item Form - Expanded/Collapsed */}
                {isAddingItem && (
                    <div className="bg-white rounded-xl shadow-md mb-8 overflow-hidden transition-all duration-300">
                        <div className="bg-blue-50 px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800">Add New Menu Item</h3>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleAddItem}>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-medium mb-2">Item Name</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g., Vegetable Biryani" 
                                        value={newItem.name} 
                                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} 
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium mb-2">Category</label>
                                        <input 
                                            type="text" 
                                            placeholder="e.g., Main Course" 
                                            value={newItem.category} 
                                            onChange={(e) => setNewItem({ ...newItem, category: e.target.value })} 
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium mb-2">Type</label>
                                        <select 
                                            value={newItem.type} 
                                            onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="Veg">Vegetarian</option>
                                            <option value="Non-Veg">Non-Vegetarian</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium mb-2">Price (₹)</label>
                                        <input 
                                            type="number" 
                                            placeholder="e.g., 250" 
                                            value={newItem.price} 
                                            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })} 
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium mb-2">Image URL</label>
                                        <input 
                                            type="text" 
                                            placeholder="Enter image URL" 
                                            value={newItem.image} 
                                            onChange={(e) => setNewItem({ ...newItem, image: e.target.value })} 
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium mb-2">Stock</label>
                                        <input 
                                            type="number" 
                                            placeholder="e.g., 100" 
                                            value={newItem.stock} 
                                            onChange={(e) => setNewItem({ ...newItem, stock: e.target.value })} 
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <button 
                                        type="submit" 
                                        className="flex items-center bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                                    >
                                        <PlusCircle className="w-5 h-5 mr-2" />
                                        Add to Menu
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Success Animation */}
                {showSuccess && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white rounded-xl p-8 flex flex-col items-center">
                            <Lottie animationData={successAnimation} style={{ width: 150, height: 150 }} />
                            <p className="text-lg font-medium text-gray-800 mt-4">Item Added Successfully!</p>
                        </div>
                    </div>
                )}

                {/* Menu Items Display */}
                <div>
                    {Object.keys(groupedMenu).length > 0 ? (
                        Object.keys(groupedMenu).map(category => (
                            <div key={category} className="mb-10">
                                <div className="flex items-center mb-4">
                                    <h3 className="text-xl font-bold text-gray-800 flex items-center">
                                        <span className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">
                                            <Utensils className="w-5 h-5" />
                                        </span>
                                        {category}
                                    </h3>
                                    <span className="ml-3 bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
                                        {groupedMenu[category].length} items
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {groupedMenu[category].map(item => (
                                        <div 
                                            key={item._id} 
                                            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                                        >
                                            <div className="relative h-48">
                                                <img 
                                                    src={item.image} 
                                                    alt={item.name} 
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${
                                                    item.type === "Veg" 
                                                        ? "bg-green-100 text-green-800" 
                                                        : "bg-red-100 text-red-800"
                                                }`}>
                                                    {item.type}
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <h4 className="text-lg font-semibold text-gray-800 mb-1">{item.name}</h4>
                                                <div className="flex justify-between items-center mb-3">
                                                    <div className="text-blue-600 font-bold">₹{item.price}</div>
                                                    <div className={`text-sm px-2 py-1 rounded ${
                                                        item.stock > 10 
                                                            ? "bg-green-100 text-green-800" 
                                                            : item.stock > 0 
                                                                ? "bg-yellow-100 text-yellow-800" 
                                                                : "bg-red-100 text-red-800"
                                                    }`}>
                                                        Stock: {item.stock}
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button 
                                                        className="flex-1 flex items-center justify-center bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                                                        onClick={() => openEditDialog(item)}
                                                    >
                                                        <Edit className="w-4 h-4 mr-1" />
                                                        Edit
                                                    </button>
                                                    <button 
                                                        className="flex-1 flex items-center justify-center bg-red-50 text-red-600 py-2 rounded-lg hover:bg-red-100 transition-colors"
                                                        onClick={() => openDialog(item._id)}
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-1" />
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow-md py-16">
                            <div className="bg-gray-100 p-6 rounded-full mb-4">
                                <Utensils className="w-12 h-12 text-gray-400" />
                            </div>
                            <p className="text-xl text-gray-500 mb-6">No items found in this category.</p>
                            <button 
                                className="flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                                onClick={() => setIsAddingItem(true)}
                            >
                                <PlusCircle className="w-5 h-5 mr-2" />
                                Add your first item
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Item Modal */}
            {isEditingItem && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
                        <div className="bg-blue-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-800">Edit Menu Item</h3>
                            <button 
                                onClick={closeEditDialog}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleEditItem}>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-medium mb-2">Item Name</label>
                                    <input
                                        type="text"
                                        value={editItem.name}
                                        onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-medium mb-2">Category</label>
                                    <input
                                        type="text"
                                        value={editItem.category}
                                        onChange={(e) => setEditItem({ ...editItem, category: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium mb-2">Type</label>
                                        <select
                                            value={editItem.type}
                                            onChange={(e) => setEditItem({ ...editItem, type: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="Veg">Vegetarian</option>
                                            <option value="Non-Veg">Non-Vegetarian</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium mb-2">Price (₹)</label>
                                        <input
                                            type="number"
                                            value={editItem.price}
                                            onChange={(e) => setEditItem({ ...editItem, price: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-medium mb-2">Image URL</label>
                                    <input
                                        type="text"
                                        value={editItem.image}
                                        onChange={(e) => setEditItem({ ...editItem, image: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div className="mb-6">
                                    <label className="block text-gray-700 text-sm font-medium mb-2">Stock</label>
                                    <input
                                        type="number"
                                        value={editItem.stock}
                                        onChange={(e) => setEditItem({ ...editItem, stock: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div className="flex justify-end space-x-4">
                                    <button
                                        type="button"
                                        onClick={closeEditDialog}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDialog && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
                        <div className="bg-red-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-800">Delete Item</h3>
                            <button 
                                onClick={closeDialog}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center mb-4">
                                <div className="bg-red-100 p-3 rounded-full mr-4">
                                    <AlertTriangle className="w-6 h-6 text-red-600" />
                                </div>
                                <p className="text-gray-700">Are you sure you want to delete this item? This action cannot be undone.</p>
                            </div>
                            <div className="flex justify-end space-x-4 mt-6">
                                <button 
                                    onClick={closeDialog}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={deleteItemConfirmed}
                                    className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors shadow-md"
                                >
                                    Delete Item
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminMenu;