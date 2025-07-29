import React from 'react';
import { FaBars, FaChartPie, FaMoneyBill, FaCalculator, FaCogs, FaBuilding, FaUsers, FaShoppingCart, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate, NavLink } from 'react-router-dom';
import novaLogo from '../../assets/Nova Logo VP.png';
import { API_ENDPOINTS } from '../../config/api';

const navLinks = [
  { name: 'General Overview', icon: <FaChartPie className="text-white" />, path: '/overview' },
  { name: 'Financial Dashboard', icon: <FaMoneyBill className="text-white" />, path: '/financial' },
  { name: 'Accounting Dashboard', icon: <FaCalculator className="text-white" />, path: '/accounting' },
  { name: 'Engineering Dashboard', icon: <FaCogs className="text-white" />, path: '/engineering' },
  { name: 'Commercial Dashboard', icon: <FaBuilding className="text-white" />, path: '/commercial' },
];

const otherLinks = [
  { name: 'HR Dashboard', icon: <FaUsers className="text-white opacity-50" />, path: '#', disabled: true },
  { name: 'Purchasing Dashboard', icon: <FaShoppingCart className="text-white opacity-50" />, path: '#', disabled: true },
  { name: 'More Dashboards...', icon: <FaCogs className="text-white opacity-50" />, path: '#', disabled: true },
];

const Sidebar = ({ collapsed, setCollapsed, mobileSidebarOpen, setMobileSidebarOpen }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userName = user.name || 'User';
  const userRole = user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User';
  
  const handleLogout = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.id) {
      try {
        await fetch(API_ENDPOINTS.AUTH.LOGOUT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: user.id }),
        });
      } catch (err) {
        // Optionally handle error
      }
    }
    localStorage.removeItem('user');
    navigate('/');
  };
  // Sidebar content for desktop
  const desktopSidebar = (
    <div className={`min-h-screen h-full backdrop-blur-2xl border-r border-white/10 shadow-2xl flex flex-col transition-all duration-300 ${collapsed ? 'w-20' : 'w-72'} z-20 overflow-y-auto bg-[#1a2a33]`}>
      {/* Logo/Avatar */}
      <div className={`flex items-center border-b border-white/10 p-6 pb-2 transition-all duration-300 ${collapsed ? 'justify-center' : 'gap-3'}`}>
        {!collapsed && (
          <div
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => setCollapsed(true)}
          >
            <img 
              src={novaLogo} 
              alt="Nova Logo" 
              className="w-20 h-10 object-contain" 
            />
            <span className="font-extrabold text-xl text-white tracking-wide drop-shadow-lg transition-all duration-300">
              DASH VP ENGENHARIA
            </span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors focus:outline-none shadow ${collapsed ? 'ml-0' : 'ml-auto'}`}
        >
          <FaBars size={22} className="text-white" />
        </button>
      </div>
      <nav className="flex-1 mt-4 space-y-1">
        {navLinks.map(link => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-5 py-3 mx-2 rounded-xl transition-colors ${collapsed ? 'justify-center' : ''} hover:bg-white/10 focus:bg-white/10' ${isActive ? 'bg-gradient-to-r from-[#D6A647]/20 to-[#D6A647]/40 border border-[#D6A647]/30' : ''}`
            }
            onClick={() => setMobileSidebarOpen && setMobileSidebarOpen(false)}
          >
            {link.icon}
            <span className={`font-medium tracking-wide text-white ${collapsed ? 'hidden' : 'block'}`}>{link.name}</span>
          </NavLink>
        ))}
        
        {/* Separator */}
        {!collapsed && (
          <div className="mx-4 my-4">
            <hr className="border-white/20" />
            <p className="text-xs text-white/60 mt-2 px-2">Others - Coming Soon</p>
          </div>
        )}
        
        {/* Future dashboards */}
        {otherLinks.map(link => (
          <div
            key={link.name}
            className={`flex items-center gap-3 px-5 py-3 mx-2 rounded-xl transition-colors ${collapsed ? 'justify-center' : ''} cursor-not-allowed`}
          >
            {link.icon}
            <span className={`font-medium tracking-wide text-white/50 ${collapsed ? 'hidden' : 'block'}`}>{link.name}</span>
          </div>
        ))}
      </nav>
      
      {/* User Profile Section */}
      <div className="mt-auto mb-4 px-2">
        {!collapsed && (
          <div className="bg-white/10 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">{userName.charAt(0).toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">{userName}</p>
                <p className="text-white/60 text-xs">{userRole}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="mb-6 px-2">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-5 py-3 bg-[#1a2a33] hover:bg-[#2a3a43] transition-colors rounded-xl shadow-lg border border-white/20 ${collapsed ? 'justify-center' : ''}`}
        >
          <FaSignOutAlt className="text-white" />
          <span className={`text-white ${collapsed ? 'hidden' : 'block'}`}>Logout</span>
        </button>
      </div>
    </div>
  );
  // Sidebar content for mobile overlay
  const mobileSidebar = (
    <div className="fixed top-0 left-0 z-50 w-64 h-screen bg-[#1a2a33] shadow-2xl transform transition-transform duration-300" style={{ transform: mobileSidebarOpen ? 'translateX(0)' : 'translateX(-100%)' }}>
      <button
        className="absolute top-2 right-2 w-10 h-10 flex items-center justify-center text-white text-3xl z-50 bg-black/30 rounded-full focus:outline-none focus:ring-2 focus:ring-white"
        onClick={() => setMobileSidebarOpen(false)}
        aria-label="Close sidebar"
        tabIndex={0}
      >
        &times;
      </button>
      <div className="min-h-screen h-full w-full flex flex-col items-start">
        <div className="flex items-center border-b border-white/10 p-6 pb-2 gap-3 w-full min-w-0">
          <img 
            src={novaLogo} 
            alt="Nova Logo" 
            className="w-20 h-10 object-contain" 
          />
          <span className="font-extrabold text-base sm:text-xl text-white tracking-wide drop-shadow-lg transition-all duration-300 truncate flex-1 min-w-0">
            DASH VP ENGENHARIA
          </span>
        </div>
        <nav className="flex-1 mt-4 space-y-1 w-full">
          {navLinks.map(link => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-3 mx-2 rounded-xl transition-colors hover:bg-white/10 focus:bg-white/10' ${isActive ? 'bg-gradient-to-r from-[#D6A647]/20 to-[#D6A647]/40 border border-[#D6A647]/30' : ''}`
              }
              onClick={() => setMobileSidebarOpen(false)}
            >
              {link.icon}
              <span className="font-medium tracking-wide text-white block text-left">{link.name}</span>
            </NavLink>
          ))}
          
          {/* Separator */}
          <div className="mx-4 my-4">
            <hr className="border-white/20" />
            <p className="text-xs text-white/60 mt-2 px-2">Others - Coming Soon</p>
          </div>
          
          {/* Future dashboards */}
          {otherLinks.map(link => (
            <div
              key={link.name}
              className="flex items-center gap-3 px-5 py-3 mx-2 rounded-xl transition-colors cursor-not-allowed"
            >
              {link.icon}
              <span className="font-medium tracking-wide text-white/50 block text-left">{link.name}</span>
            </div>
          ))}
        </nav>
        
        {/* User Profile Section - Mobile */}
        <div className="mt-auto mb-4 px-2 w-full">
          <div className="bg-white/10 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">{userName.charAt(0).toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">{userName}</p>
                <p className="text-white/60 text-xs">{userRole}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-6 px-2 w-full">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-5 py-3 bg-[#1a2a33] hover:bg-[#2a3a43] transition-colors rounded-xl shadow-lg border border-white/20"
          >
            <FaSignOutAlt className="text-white" />
            <span className="text-white block text-left">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
  return (
    <>
      {/* Desktop sidebar (sm and up) */}
      <div className="hidden sm:flex fixed top-0 left-0">
        {desktopSidebar}
      </div>
      {/* Mobile sidebar overlay (below sm) */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-40 flex sm:hidden">
          <div className="bg-black/60 w-full h-full" onClick={() => setMobileSidebarOpen(false)} />
          {mobileSidebar}
        </div>
      )}
    </>
  );
};

export default Sidebar; 