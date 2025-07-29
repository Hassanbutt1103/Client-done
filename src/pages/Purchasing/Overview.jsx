import React, { useState, useEffect } from 'react';
import { FaShoppingCart, FaBoxes, FaTruck, FaFileInvoice, FaChartLine, FaExclamationTriangle } from 'react-icons/fa';

const Overview = () => {
  const [stats, setStats] = useState({
    totalOrders: 156,
    pendingOrders: 23,
    completedOrders: 133,
    totalSuppliers: 45,
    activeSuppliers: 38,
    inventoryItems: 1247,
    lowStockItems: 12,
    totalSpent: 2850000,
    monthlySpent: 320000
  });

  const [recentOrders, setRecentOrders] = useState([
    { id: 1, supplier: 'ABC Supplies', item: 'Steel Beams', quantity: 50, status: 'Delivered', date: '2025-01-28' },
    { id: 2, supplier: 'XYZ Materials', item: 'Concrete Mix', quantity: 200, status: 'In Transit', date: '2025-01-27' },
    { id: 3, supplier: 'Tech Solutions', item: 'Safety Equipment', quantity: 25, status: 'Pending', date: '2025-01-26' },
    { id: 4, supplier: 'BuildCorp', item: 'Electrical Components', quantity: 100, status: 'Delivered', date: '2025-01-25' }
  ]);

  const [lowStockAlerts, setLowStockAlerts] = useState([
    { item: 'Steel Pipes', current: 15, min: 20, supplier: 'MetalCorp' },
    { item: 'Safety Helmets', current: 8, min: 25, supplier: 'SafetyFirst' },
    { item: 'Concrete Mix', current: 30, min: 50, supplier: 'BuildMaterials' },
    { item: 'Electrical Wire', current: 12, min: 30, supplier: 'ElectroSupply' }
  ]);

  return (
    <div className="p-4 md:p-8 min-h-screen overflow-hidden" style={{ backgroundColor: '#1a2a33' }}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Purchasing Overview</h1>
        <p className="text-gray-300">Monitor procurement activities, supplier performance, and inventory levels</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#232b3a] rounded-xl shadow-lg p-6 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Orders</p>
              <p className="text-2xl font-bold text-white">{stats.totalOrders}</p>
              <p className="text-green-400 text-sm">+12% this month</p>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <FaShoppingCart className="text-blue-400 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-[#232b3a] rounded-xl shadow-lg p-6 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Suppliers</p>
              <p className="text-2xl font-bold text-white">{stats.activeSuppliers}</p>
              <p className="text-green-400 text-sm">+3 new this month</p>
            </div>
            <div className="p-3 bg-green-500/20 rounded-lg">
              <FaTruck className="text-green-400 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-[#232b3a] rounded-xl shadow-lg p-6 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Inventory Items</p>
              <p className="text-2xl font-bold text-white">{stats.inventoryItems}</p>
              <p className="text-yellow-400 text-sm">{stats.lowStockItems} low stock</p>
            </div>
            <div className="p-3 bg-yellow-500/20 rounded-lg">
              <FaBoxes className="text-yellow-400 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-[#232b3a] rounded-xl shadow-lg p-6 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Monthly Spend</p>
              <p className="text-2xl font-bold text-white">R$ {stats.monthlySpent.toLocaleString()}</p>
              <p className="text-red-400 text-sm">+8% vs last month</p>
            </div>
            <div className="p-3 bg-red-500/20 rounded-lg">
              <FaChartLine className="text-red-400 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-[#232b3a] rounded-xl shadow-lg p-6 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Recent Orders</h2>
            <button className="text-[#D6A647] hover:text-[#b45309] transition-colors">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div>
                  <p className="text-white font-medium">{order.supplier}</p>
                  <p className="text-gray-400 text-sm">{order.item} - Qty: {order.quantity}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    order.status === 'Delivered' ? 'bg-green-500/20 text-green-400' :
                    order.status === 'In Transit' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {order.status}
                  </span>
                  <p className="text-gray-400 text-xs mt-1">{order.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-[#232b3a] rounded-xl shadow-lg p-6 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Low Stock Alerts</h2>
            <div className="p-2 bg-red-500/20 rounded-lg">
              <FaExclamationTriangle className="text-red-400" />
            </div>
          </div>
          <div className="space-y-4">
            {lowStockAlerts.map((alert, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                <div>
                  <p className="text-white font-medium">{alert.item}</p>
                  <p className="text-gray-400 text-sm">Supplier: {alert.supplier}</p>
                </div>
                <div className="text-right">
                  <p className="text-red-400 font-bold">{alert.current}/{alert.min}</p>
                  <button className="text-[#D6A647] text-xs hover:text-[#b45309] transition-colors">
                    Reorder
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-[#232b3a] rounded-xl shadow-lg p-6 border border-white/10">
        <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center gap-3 p-4 bg-[#D6A647]/20 hover:bg-[#D6A647]/30 transition-colors rounded-lg border border-[#D6A647]/30">
            <FaFileInvoice className="text-[#D6A647] text-xl" />
            <span className="text-white font-medium">Create Purchase Order</span>
          </button>
          <button className="flex items-center gap-3 p-4 bg-blue-500/20 hover:bg-blue-500/30 transition-colors rounded-lg border border-blue-500/30">
            <FaTruck className="text-blue-400 text-xl" />
            <span className="text-white font-medium">Add New Supplier</span>
          </button>
          <button className="flex items-center gap-3 p-4 bg-green-500/20 hover:bg-green-500/30 transition-colors rounded-lg border border-green-500/30">
            <FaBoxes className="text-green-400 text-xl" />
            <span className="text-white font-medium">Update Inventory</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Overview; 