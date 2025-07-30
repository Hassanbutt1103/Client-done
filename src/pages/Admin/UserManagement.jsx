import React, { useState, useEffect } from 'react';
import { FaUsers, FaEdit, FaTrash, FaUserPlus, FaSearch, FaFilter, FaEye, FaUserCheck, FaUserTimes } from 'react-icons/fa';
import { handleAuthError, getAuthHeaders } from '../../utils/auth';
import { API_ENDPOINTS } from '../../config/api';

const UserManagement = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  const [users, setUsers] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'pending'
  const [loading, setLoading] = useState(true);
  const [pendingLoading, setPendingLoading] = useState(false);
  const [updating, setUpdating] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const roles = ['admin', 'manager', 'financial', 'engineering', 'hr', 'commercial', 'purchasing'];

  useEffect(() => {
    fetchUsers();
    fetchPendingUsers();
    
    // Set up real-time updates every 30 seconds
    const interval = setInterval(() => {
      fetchUsers();
      fetchPendingUsers();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Check if token exists before making the request
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found, user needs to login');
        setLoading(false);
        return;
      }
      
              const response = await fetch(API_ENDPOINTS.USERS.LIST, {
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          setUsers(data.users);
        }
      } else {
        // Handle authentication errors
        if (!handleAuthError(null, response)) {
          const errorData = await response.json();
          console.error('Failed to fetch users:', errorData.message);
        }
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      // Check if it's a token error
      if (error.message === 'No authentication token found') {
        console.log('Token not found, staying on page without data');
        // Don't redirect, just show empty state
        setLoading(false);
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingUsers = async () => {
    try {
      setPendingLoading(true);
      
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found for pending users');
        setPendingLoading(false);
        return;
      }
      
      const response = await fetch(API_ENDPOINTS.PENDING_USERS.LIST, {
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          setPendingUsers(data.data);
        }
      } else {
        if (!handleAuthError(null, response)) {
          const errorData = await response.json();
          console.error('Failed to fetch pending users:', errorData.message);
        }
      }
    } catch (error) {
      console.error('Error fetching pending users:', error);
    } finally {
      setPendingLoading(false);
    }
  };

  const approveUser = async (userId) => {
    try {
      setUpdating({ ...updating, [userId]: 'approving' });
      
      const response = await fetch(API_ENDPOINTS.PENDING_USERS.APPROVE(userId), {
        method: 'PUT',
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          // Remove from pending list and refresh users list
          setPendingUsers(pendingUsers.filter(user => user._id !== userId));
          fetchUsers(); // Refresh the users list to show newly approved user
          alert('User approved successfully!');
        }
      } else {
        const errorData = await response.json();
        alert(`Failed to approve user: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error approving user:', error);
      alert('Error approving user. Please try again.');
    } finally {
      setUpdating({ ...updating, [userId]: false });
    }
  };

  const rejectUser = async (userId, reason = '') => {
    try {
      setUpdating({ ...updating, [userId]: 'rejecting' });
      
      const response = await fetch(API_ENDPOINTS.PENDING_USERS.REJECT(userId), {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          // Remove from pending list
          setPendingUsers(pendingUsers.filter(user => user._id !== userId));
          alert('User request rejected successfully!');
        }
      } else {
        const errorData = await response.json();
        alert(`Failed to reject user: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error rejecting user:', error);
      alert('Error rejecting user. Please try again.');
    } finally {
      setUpdating({ ...updating, [userId]: false });
    }
  };

  const handleRejectWithReason = (userId) => {
    const reason = prompt('Please provide a reason for rejection (optional):');
    if (reason !== null) { // User didn't cancel
      rejectUser(userId, reason);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && user.isActive) ||
                         (filterStatus === 'inactive' && !user.isActive);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const filteredPendingUsers = pendingUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  const totalUsers = users.length;

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      admin: 'bg-red-500/20 text-red-300 border-red-500/30',
      manager: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      financial: 'bg-green-500/20 text-green-300 border-green-500/30',
      engineering: 'bg-gradient-to-r from-[#D6A647]/20 to-[#b45309]/20 text-[#D6A647] border-[#D6A647]/30',
      hr: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
      commercial: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      purchasing: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
    };
    return colors[role] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      // Set updating state for this user
      setUpdating(prev => ({ ...prev, [userId]: true }));

      // Optimistic update - update UI immediately
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user._id === userId 
            ? { ...user, isActive: !currentStatus }
            : user
        )
      );

              const response = await fetch(API_ENDPOINTS.USERS.UPDATE(userId), {
          method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      if (!response.ok) {
        // If request failed, revert the optimistic update
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user._id === userId 
              ? { ...user, isActive: currentStatus }
              : user
          )
        );
        throw new Error('Failed to update user status');
      } else {
        // Refresh to ensure data consistency
        setTimeout(() => fetchUsers(), 1000);
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('Failed to update user status. Please try again.');
    } finally {
      // Remove updating state
      setUpdating(prev => {
        const newState = { ...prev };
        delete newState[userId];
        return newState;
      });
    }
  };

  const deleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.USERS.DELETE(userId), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Remove user from state immediately
        setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
        alert('User deleted successfully');
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user. Please try again.');
    }
  };

  // Add refresh button handler
  const handleRefresh = () => {
    fetchUsers();
    fetchPendingUsers();
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center" style={{ backgroundColor: '#1a2a33' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D6A647] mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen" style={{ backgroundColor: '#1a2a33' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-[#232b3a] rounded-xl shadow-lg p-6 border border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-r from-[#D6A647]/20 to-[#b45309]/20 rounded-xl">
          <FaUsers className="text-[#D6A647] text-xl" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">User Management</h1>
                  <p className="text-gray-300">Manage all system users and their permissions</p>
                </div>
              </div>
              <div className={`flex ${isMobile ? 'flex-col gap-2' : 'gap-2'}`}>
                <button 
                  className={`flex items-center gap-2 bg-green-600 text-white ${isMobile ? 'px-3 py-2 text-sm' : 'px-4 py-2'} rounded-lg hover:bg-green-700 transition-colors`}
                  onClick={handleRefresh}
                  title="Refresh user list"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>{isMobile ? 'Refresh' : 'Refresh'}</span>
                </button>
                <button 
                  className={`flex items-center gap-2 bg-gradient-to-r from-[#D6A647] to-[#b45309] text-white ${isMobile ? 'px-3 py-2 text-sm' : 'px-4 py-2'} rounded-lg hover:from-[#b45309] hover:to-[#92400e] transition-colors`}
                  onClick={() => alert('Add user functionality coming soon!')}
                >
                  <FaUserPlus />
                  <span>{isMobile ? 'Add User' : 'Add User'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="bg-[#232b3a] rounded-xl shadow-lg border border-white/10">
            <div className={`${isMobile ? 'flex-col' : 'flex'}`}>
              <button
                className={`flex-1 ${isMobile ? 'px-4 py-3' : 'px-6 py-4'} text-center font-medium transition-colors ${isMobile ? 'rounded-t-xl' : 'rounded-l-xl'} ${
                  activeTab === 'users'
                    ? 'bg-gradient-to-r from-[#D6A647] to-[#b45309] text-white'
                    : 'text-gray-300 hover:text-white hover:bg-[#2a3441]'
                }`}
                onClick={() => setActiveTab('users')}
              >
                <div className="flex items-center justify-center gap-2">
                  <FaUsers />
                  <span className={isMobile ? 'text-sm' : ''}>Active Users ({users.length})</span>
                </div>
              </button>
              <button
                className={`flex-1 ${isMobile ? 'px-4 py-3' : 'px-6 py-4'} text-center font-medium transition-colors ${isMobile ? 'rounded-b-xl' : 'rounded-r-xl'} ${
                  activeTab === 'pending'
                    ? 'bg-orange-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-[#2a3441]'
                }`}
                onClick={() => setActiveTab('pending')}
              >
                <div className="flex items-center justify-center gap-2">
                  <FaUserCheck />
                  <span className={isMobile ? 'text-sm' : ''}>
                    {isMobile ? 'Pending' : 'Pending Requests'} ({pendingUsers.length})
                    {pendingUsers.filter(user => user.role === 'admin').length > 0 && (
                      <span className={`ml-2 px-2 py-1 bg-red-600 text-white ${isMobile ? 'text-xs' : 'text-xs'} rounded-full animate-pulse`}>
                        {pendingUsers.filter(user => user.role === 'admin').length} ADMIN
                      </span>
                    )}
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="bg-[#232b3a] rounded-xl shadow-lg p-6 border border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-[#D6A647] focus:border-[#D6A647] text-white placeholder-gray-400"
                />
              </div>

              {/* Role Filter */}
              <div className="relative">
                <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-[#D6A647] focus:border-[#D6A647] text-white"
                >
                  <option value="all" className="bg-[#232b3a] text-white">All Roles</option>
                  {roles.map(role => (
                    <option key={role} value={role} className="bg-[#232b3a] text-white">{role.charAt(0).toUpperCase() + role.slice(1)}</option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-[#D6A647] focus:border-[#D6A647] text-white"
                >
                  <option value="all" className="bg-[#232b3a] text-white">All Status</option>
                  <option value="active" className="bg-[#232b3a] text-white">Active</option>
                  <option value="inactive" className="bg-[#232b3a] text-white">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'users' ? (
          // Users Table
          <div className="bg-[#232b3a] rounded-xl shadow-lg overflow-hidden border border-white/10">
          <div className="px-6 py-4 border-b border-white/10">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                All Users
              </h2>
              <div className="flex items-center gap-4 text-sm text-gray-300">
                <span>Showing {filteredUsers.length} of {totalUsers} users</span>
                {totalUsers > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      {users.filter(u => u.isActive).length} Active
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      {users.filter(u => !u.isActive).length} Inactive
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Last Login</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredUsers.map(user => (
                  <tr key={user._id} className="hover:bg-white/5 text-white">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="relative">
                          <div className="w-8 h-8 bg-gradient-to-r from-[#D6A647] to-[#b45309] rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-xs">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          {/* Status indicator dot */}
                          <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-[#232b3a] ${
                            user.isActive ? 'bg-green-500' : 'bg-red-500'
                          }`}></div>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-white">{user.name}</div>
                          <div className="text-sm text-gray-300">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getRoleBadgeColor(user.role)}`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {user.department || 'Not specified'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${
                        user.isActive 
                          ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                          : 'bg-red-500/20 text-red-300 border border-red-500/30'
                      }`}>
                        {user.isActive ? <FaUserCheck /> : <FaUserTimes />}
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {formatDate(user.lastLogin)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className={`${isMobile ? 'px-3 py-2' : 'px-6 py-4'} whitespace-nowrap text-center`}>
                      <div className={`flex items-center justify-center ${isMobile ? 'gap-1' : 'gap-2'}`}>
                        <button 
                          className={`${isMobile ? 'p-1' : 'p-2'} text-[#D6A647] hover:bg-[#D6A647]/10 rounded-lg transition-colors`}
                          title="View Details"
                          onClick={() => alert(`View details for ${user.name}`)}
                        >
                          <FaEye className={isMobile ? 'text-sm' : ''} />
                        </button>
                        <button 
                          className={`${isMobile ? 'p-1' : 'p-2'} text-green-600 hover:bg-green-50 rounded-lg transition-colors`}
                          title="Edit User"
                          onClick={() => alert(`Edit ${user.name}`)}
                        >
                          <FaEdit className={isMobile ? 'text-sm' : ''} />
                        </button>
                        <button 
                          className={`${isMobile ? 'p-1' : 'p-2'} rounded-lg transition-colors ${
                            user.isActive 
                              ? 'text-red-600 hover:bg-red-50' 
                              : 'text-green-600 hover:bg-green-50'
                          } ${updating[user._id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                          title={user.isActive ? 'Deactivate User' : 'Activate User'}
                          onClick={() => !updating[user._id] && toggleUserStatus(user._id, user.isActive)}
                          disabled={updating[user._id]}
                        >
                          {updating[user._id] ? (
                            <div className={`animate-spin border-2 border-current border-t-transparent rounded-full ${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`}></div>
                          ) : (
                            user.isActive ? <FaUserTimes className={isMobile ? 'text-sm' : ''} /> : <FaUserCheck className={isMobile ? 'text-sm' : ''} />
                          )}
                        </button>
                        <button 
                          className={`${isMobile ? 'p-1' : 'p-2'} text-red-600 hover:bg-red-50 rounded-lg transition-colors`}
                          title="Delete User"
                          onClick={() => deleteUser(user._id, user.name)}
                        >
                          <FaTrash className={isMobile ? 'text-sm' : ''} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <FaUsers className="mx-auto text-gray-400 text-4xl mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No users found</h3>
              <p className="text-gray-300">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
        ) : (
          // Pending Users Table
          <div className="bg-[#232b3a] rounded-xl shadow-lg overflow-hidden border border-white/10">
            <div className="px-6 py-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">
                  Pending Registration Requests
                </h2>
                <div className="flex items-center gap-4 text-sm text-gray-300">
                  <span>Showing {filteredPendingUsers.length} of {pendingUsers.length} requests</span>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Requested</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {pendingLoading ? (
                    <tr>
                      <td colSpan="5" className="text-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D6A647] mx-auto"></div>
                        <p className="text-gray-300 mt-2">Loading pending requests...</p>
                      </td>
                    </tr>
                  ) : filteredPendingUsers.length > 0 ? (
                    filteredPendingUsers.map((user) => (
                      <tr key={user._id} className={`hover:bg-white/5 transition-colors ${
                        user.role === 'admin' ? 'bg-red-500/10 border-l-4 border-red-500' : ''
                      }`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#D6A647] to-[#b45309] flex items-center justify-center">
                                <span className="text-white font-medium text-sm">
                                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-white">{user.name}</div>
                              <div className="text-sm text-gray-300">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getRoleBadgeColor(user.role)}`}>
                              {user.role}
                            </span>
                            {user.role === 'admin' && (
                              <span className="inline-flex px-2 py-1 text-xs font-bold bg-red-600 text-white rounded-full animate-pulse">
                                ADMIN REQUEST
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-300">{user.department || 'Not specified'}</div>
                          {user.position && <div className="text-xs text-gray-400">{user.position}</div>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-300">{formatDate(user.requestedAt)}</div>
                        </td>
                        <td className={`${isMobile ? 'px-3 py-2' : 'px-6 py-4'} whitespace-nowrap text-center`}>
                          <div className={`flex items-center justify-center ${isMobile ? 'gap-1' : 'gap-2'}`}>
                            <button
                              onClick={() => approveUser(user._id)}
                              disabled={updating[user._id]}
                              className={`bg-green-600 text-white ${isMobile ? 'px-2 py-1 text-xs' : 'px-3 py-1 text-sm'} rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                              title="Approve registration"
                            >
                              {updating[user._id] === 'approving' ? (
                                <div className={`animate-spin rounded-full border-b-2 border-white ${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`}></div>
                              ) : (
                                <FaUserCheck className={isMobile ? 'text-xs' : ''} />
                              )}
                            </button>
                            <button
                              onClick={() => handleRejectWithReason(user._id)}
                              disabled={updating[user._id]}
                              className={`bg-red-600 text-white ${isMobile ? 'px-2 py-1 text-xs' : 'px-3 py-1 text-sm'} rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                              title="Reject registration"
                            >
                              {updating[user._id] === 'rejecting' ? (
                                <div className={`animate-spin rounded-full border-b-2 border-white ${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`}></div>
                              ) : (
                                <FaUserTimes className={isMobile ? 'text-xs' : ''} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-12">
                        <div className="text-center py-12">
                          <FaUserCheck className="mx-auto text-gray-400 text-4xl mb-4" />
                          <h3 className="text-lg font-medium text-white mb-2">No pending requests</h3>
                          <p className="text-gray-300">All registration requests have been processed.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement; 