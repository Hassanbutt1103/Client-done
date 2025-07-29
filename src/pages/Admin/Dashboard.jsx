import React, { useState } from "react";
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen h-full">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} mobileSidebarOpen={mobileSidebarOpen} setMobileSidebarOpen={setMobileSidebarOpen} />
      {/* Hamburger for mobile */}
      <button
        className="fixed top-4 left-4 z-30 p-2 rounded-md bg-[#1a2a33] text-white shadow-lg sm:hidden"
        onClick={() => setMobileSidebarOpen(true)}
        aria-label="Open sidebar"
      >
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
      </button>
      <main
        className={
          'flex-1 overflow-auto transition-all duration-300 ml-0 ' +
          (collapsed ? 'sm:ml-20' : 'sm:ml-72')
        }
      >
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard; 