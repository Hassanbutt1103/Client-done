import React from 'react';
import { FaBars, FaUsers, FaChartPie, FaCog, FaUserShield, FaDatabase, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';
import { useNavigate, NavLink } from 'react-router-dom';
import novaLogo from '../../assets/Nova Logo VP.png';
import { API_ENDPOINTS } from '../../config/api';

const adminNavLinks = [
  { name: 'General Overview', icon: <FaTachometerAlt className="text-white" />, path: '/admin/overview' },
  { name: 'Financial Dashboard', icon: <FaChartPie className="text-white" />, path: '/admin/financial' },
  { name: 'Accounting Dashboard', icon: <FaDatabase className="text-white" />, path: '/admin/accounting' },
  { name: 'Engineering Dashboard', icon: <FaCog className="text-white" />, path: '/admin/engineering' },
  { name: 'Commercial Dashboard', icon: <FaUsers className="text-white" />, path: '/admin/commercial' },
];

const adminManagementLinks = [
  { name: 'User Management', icon: <FaUsers className="text-white" />, path: '/admin/users' },
  { name: 'System Analytics', icon: <FaChartPie className="text-white" />, path: '/admin/analytics' },
  { name: 'Role Management', icon: <FaUserShield className="text-white" />, path: '/admin/roles' },
  { name: 'Database Admin', icon: <FaDatabase className="text-white" />, path: '/admin/database' },
  { name: 'System Settings', icon: <FaCog className="text-white" />, path: '/admin/settings' },
];

const Sidebar = ({ collapsed, setCollapsed, mobileSidebarOpen, setMobileSidebarOpen }) => {
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    console.log('🚪 Logout initiated...');
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.id) {
      try {
        await fetch(API_ENDPOINTS.AUTH.LOGOUT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: user.id }),
        });
        console.log('✅ Server logout successful');
      } catch (err) {
        console.error('Logout error:', err);
      }
    }
    
    console.log('🧹 Clearing authentication data...');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    console.log('✅ All authentication data cleared');
    console.log('🔄 Redirecting to login...');
    navigate('/');
  };

  // Get current user info
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userName = user.name || 'Admin User';
  const userRole = user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Admin';

  // Sidebar content for desktop
  const desktopSidebar = (
    <div className={`min-h-screen h-screen backdrop-blur-2xl border-r border-white/10 shadow-2xl flex flex-col transition-all duration-300 ${collapsed ? 'w-20' : 'w-72'} z-20 overflow-y-auto bg-[#1a2a33]`}>
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
        {adminNavLinks.map(link => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-5 py-3 mx-2 rounded-xl transition-colors ${collapsed ? 'justify-center' : ''} hover:bg-white/10 focus:bg-white/10 ${isActive ? 'bg-gradient-to-r from-[#D6A647]/20 to-[#D6A647]/40 border border-[#D6A647]/30' : ''}`
            }
            onClick={() => setMobileSidebarOpen && setMobileSidebarOpen(false)}
          >
            {link.icon}
            <span className={`font-medium tracking-wide text-white ${collapsed ? 'hidden' : 'block'}`}>{link.name}</span>
          </NavLink>
        ))}
        
        {/* Admin Management Section */}
        {!collapsed && (
          <div className="mx-4 my-4">
            <hr className="border-white/20" />
            <p className="text-xs text-white/60 mt-2 px-2">Admin Management</p>
          </div>
        )}
        
        {adminManagementLinks.map(link => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-5 py-3 mx-2 rounded-xl transition-colors ${collapsed ? 'justify-center' : ''} hover:bg-white/10 focus:bg-white/10 ${isActive ? 'bg-gradient-to-r from-[#D6A647]/20 to-[#D6A647]/40 border border-[#D6A647]/30' : ''}`
            }
            onClick={() => setMobileSidebarOpen && setMobileSidebarOpen(false)}
          >
            {link.icon}
            <span className={`font-medium tracking-wide text-white ${collapsed ? 'hidden' : 'block'}`}>{link.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Profile Section - Desktop */}
      <div className="mt-auto px-2">
        {!collapsed && (
          <div className="bg-gradient-to-r from-[#D6A647]/20 to-[#D6A647]/40 border border-[#D6A647]/30 rounded-xl p-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-[#D6A647] to-[#D6A647]/80 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">{userName.charAt(0).toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-xs truncate">{userName}</p>
                <p className="text-[#D6A647] text-xs uppercase tracking-wider">{userRole}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mb-4 px-2">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-5 py-3 bg-red-600/20 hover:bg-red-600/30 transition-colors rounded-xl shadow-lg border border-red-400/30 ${collapsed ? 'justify-center' : ''}`}
        >
          <FaSignOutAlt className="text-red-400" />
          <span className={`text-red-400 ${collapsed ? 'hidden' : 'block'}`}>Logout</span>
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
            className="w-16 h-8 object-contain" 
          />
          <span className="font-extrabold text-base sm:text-xl text-white tracking-wide drop-shadow-lg transition-all duration-300 truncate flex-1 min-w-0">
            DASH VP ENGENHARIA
          </span>
        </div>

        {/* User info section - mobile */}
        <div className="px-6 py-4 border-b border-white/10 w-full">
          <div className="bg-gradient-to-r from-[#D6A647]/20 to-[#D6A647]/40 border border-[#D6A647]/30 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-[#D6A647] to-[#D6A647]/80 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">{userName.charAt(0).toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">{userName}</p>
                <p className="text-blue-300 text-xs uppercase tracking-wider">{userRole}</p>
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 mt-4 space-y-1 w-full">
          {adminNavLinks.map(link => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-3 mx-2 rounded-xl transition-colors hover:bg-white/10 focus:bg-white/10 ${isActive ? 'bg-gradient-to-r from-[#D6A647]/20 to-[#D6A647]/40 border border-[#D6A647]/30' : ''}`
              }
              onClick={() => setMobileSidebarOpen(false)}
            >
              {link.icon}
              <span className="font-medium tracking-wide text-white block text-left">{link.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto mb-6 px-2 w-full">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-5 py-3 bg-red-600/20 hover:bg-red-600/30 transition-colors rounded-xl shadow-lg border border-red-400/30"
          >
            <FaSignOutAlt className="text-red-400" />
            <span className="text-red-400 block text-left">Logout</span>
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