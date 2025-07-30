import React, { useState, useEffect } from 'react';
import { FaUsers, FaUserTie, FaSearch, FaFilter, FaEye, FaUserCheck, FaUserTimes, FaEdit, FaTrash, FaChartPie, FaChartBar } from 'react-icons/fa';
import { handleAuthError, getAuthHeaders } from '../../utils/auth';
import { API_ENDPOINTS } from '../../config/api';
import PieChart from '../../components/general-overview/PieChart';

const TeamManagement = () => {
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
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'users', 'analytics'
  const [updating, setUpdating] = useState({});

  const departments = ['admin', 'manager', 'financial', 'engineering', 'hr', 'commercial', 'purchasing'];

  useEffect(() => {
    fetchUsers();
    
    // Set up real-time updates every 30 seconds
    const interval = setInterval(() => {
      fetchUsers();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
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
        if (!handleAuthError(null, response)) {
          const errorData = await response.json();
          console.error('Failed to fetch users:', errorData.message);
        }
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      if (error.message === 'No authentication token found') {
        console.log('Token not found, staying on page without data');
        setLoading(false);
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      setUpdating(prev => ({ ...prev, [userId]: true }));
      
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      
      const response = await fetch(API_ENDPOINTS.USERS.UPDATE(userId), {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          setUsers(prevUsers => 
            prevUsers.map(user => 
              user._id === userId 
                ? { ...user, status: newStatus }
                : user
            )
          );
        }
      } else {
        if (!handleAuthError(null, response)) {
          const errorData = await response.json();
          console.error('Failed to update user status:', errorData.message);
        }
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    } finally {
      setUpdating(prev => ({ ...prev, [userId]: false }));
    }
  };

  const deleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) {
      return;
    }

    try {
      setUpdating(prev => ({ ...prev, [userId]: true }));
      
      const response = await fetch(API_ENDPOINTS.USERS.DELETE(userId), {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
        }
      } else {
        if (!handleAuthError(null, response)) {
          const errorData = await response.json();
          console.error('Failed to delete user:', errorData.message);
        }
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setUpdating(prev => ({ ...prev, [userId]: false }));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDepartmentBadgeColor = (department) => {
    const colors = {
      'admin': 'bg-purple-100 text-purple-800',
      'manager': 'bg-blue-100 text-blue-800',
      'financial': 'bg-green-100 text-green-800',
      'engineering': 'bg-orange-100 text-orange-800',
      'hr': 'bg-pink-100 text-pink-800',
      'commercial': 'bg-indigo-100 text-indigo-800',
      'purchasing': 'bg-yellow-100 text-yellow-800'
    };
    return colors[department] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadgeColor = (status) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  // Calculate statistics
  const totalUsers = users.length;
  const activeUsers = users.filter(user => user.status === 'active').length;
  const inactiveUsers = users.filter(user => user.status === 'inactive').length;

  // Calculate department distribution
  const calculateDepartmentStats = () => {
    const departmentCounts = {};
    
    // Department name mapping to English
    const departmentMapping = {
      'admin': 'Admin',
      'manager': 'Manager',
      'financial': 'Financial',
      'engineering': 'Engineering',
      'hr': 'HR',
      'commercial': 'Commercial',
      'purchasing': 'Purchasing',
      // Portuguese mappings
      'administração': 'Admin',
      'gerência': 'Manager',
      'financeiro': 'Financial',
      'engenharia': 'Engineering',
      'recursos humanos': 'HR',
      'comercial': 'Commercial',
      'compras': 'Purchasing'
    };
    
    users.forEach(user => {
      const dept = user.department || user.role;
      if (dept) {
        // Map to English name
        const englishName = departmentMapping[dept.toLowerCase()] || dept.charAt(0).toUpperCase() + dept.slice(1);
        departmentCounts[englishName] = (departmentCounts[englishName] || 0) + 1;
      }
    });
    
    return Object.entries(departmentCounts).map(([name, value]) => ({
      name,
      value
    }));
  };

  const departmentStats = calculateDepartmentStats();

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.department?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = filterDepartment === 'all' || user.department === filterDepartment;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a2a33] p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Team Management</h1>
          <p className="text-gray-300">Manage your team members, view statistics, and monitor performance</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-white/10">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-[#D6A647] text-[#D6A647]'
                    : 'border-transparent text-gray-300 hover:text-white hover:border-white/30'
                }`}
              >
                <FaChartBar className="inline mr-2" />
                Overview
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'users'
                    ? 'border-[#D6A647] text-[#D6A647]'
                    : 'border-transparent text-gray-300 hover:text-white hover:border-white/30'
                }`}
              >
                <FaUsers className="inline mr-2" />
                Team Members ({totalUsers})
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'analytics'
                    ? 'border-[#D6A647] text-[#D6A647]'
                    : 'border-transparent text-gray-300 hover:text-white hover:border-white/30'
                }`}
              >
                <FaChartPie className="inline mr-2" />
                Analytics
              </button>
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#232b3a] rounded-xl shadow-lg p-4 md:p-6 border border-white/10 text-white">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-500/20">
                    <FaUsers className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-300">Total Team Members</p>
                    <p className="text-2xl font-bold text-[#10b981]">{totalUsers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#232b3a] rounded-xl shadow-lg p-4 md:p-6 border border-white/10 text-white">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-500/20">
                    <FaUserCheck className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-300">Active Members</p>
                    <p className="text-2xl font-bold text-[#10b981]">{activeUsers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#232b3a] rounded-xl shadow-lg p-4 md:p-6 border border-white/10 text-white">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-red-500/20">
                    <FaUserTimes className="h-6 w-6 text-red-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-300">Inactive Members</p>
                    <p className="text-2xl font-bold text-[#ef4444]">{inactiveUsers}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Department Distribution Chart */}
            <div className="bg-[#232b3a] rounded-xl shadow-lg p-4 md:p-6 border border-white/10 min-h-[400px]">
              <h3 className="text-lg md:text-xl font-bold mb-4 text-white">Department Distribution</h3>
              <div className="h-64 sm:h-80 lg:h-96">
                <PieChart data={departmentStats} />
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="bg-[#232b3a] rounded-xl shadow-lg p-4 md:p-6 border border-white/10">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by name, email, or department..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-white/20 rounded-lg focus:ring-2 focus:ring-[#D6A647] focus:border-transparent bg-[#1a2a33] text-white placeholder-gray-400"
                    />
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <select
                    value={filterDepartment}
                    onChange={(e) => setFilterDepartment(e.target.value)}
                    className="px-4 py-2 border border-white/20 rounded-lg focus:ring-2 focus:ring-[#D6A647] focus:border-transparent bg-[#1a2a33] text-white"
                  >
                    <option value="all">All Departments</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept.charAt(0).toUpperCase() + dept.slice(1)}</option>
                    ))}
                  </select>
                  
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-white/20 rounded-lg focus:ring-2 focus:ring-[#D6A647] focus:border-transparent bg-[#1a2a33] text-white"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-[#232b3a] rounded-xl shadow-lg border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-white/10">
                  <thead className="bg-[#1a2a33]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-[#232b3a] divide-y divide-white/10">
                    {filteredUsers.map((user) => (
                      <tr key={user._id} className="hover:bg-[#1a2a33] transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-[#D6A647] flex items-center justify-center">
                                <span className="text-sm font-medium text-white">
                                  {user.name?.charAt(0).toUpperCase() || 'U'}
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
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDepartmentBadgeColor(user.department)}`}>
                            {user.department?.charAt(0).toUpperCase() + user.department?.slice(1) || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(user.status)}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => toggleUserStatus(user._id, user.status)}
                              disabled={updating[user._id]}
                              className={`inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded transition-colors ${
                                user.status === 'active'
                                  ? 'text-red-400 bg-red-500/20 hover:bg-red-500/30 border-red-500/30'
                                  : 'text-green-400 bg-green-500/20 hover:bg-green-500/30 border-green-500/30'
                              }`}
                            >
                              {updating[user._id] ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                              ) : (
                                <>
                                  {user.status === 'active' ? <FaUserTimes className="mr-1" /> : <FaUserCheck className="mr-1" />}
                                  {user.status === 'active' ? 'Deactivate' : 'Activate'}
                                </>
                              )}
                            </button>
                            
                            <button
                              onClick={() => deleteUser(user._id, user.name)}
                              disabled={updating[user._id]}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-red-400 bg-red-500/20 hover:bg-red-500/30 border-red-500/30 transition-colors"
                            >
                              {updating[user._id] ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                              ) : (
                                <>
                                  <FaTrash className="mr-1" />
                                  Delete
                                </>
                              )}
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
                  <FaUsers className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-white">No users found</h3>
                  <p className="mt-1 text-sm text-gray-300">
                    {searchTerm || filterDepartment !== 'all' || filterStatus !== 'all'
                      ? 'Try adjusting your search or filters.'
                      : 'No team members available.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-[#232b3a] rounded-xl shadow-lg p-4 md:p-6 border border-white/10">
              <h3 className="text-lg md:text-xl font-bold mb-4 text-white">Team Analytics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-md font-medium text-gray-300 mb-3">Department Breakdown</h4>
                  <div className="space-y-2">
                    {departmentStats.map((dept, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">{dept.name}</span>
                        <span className="text-sm font-medium text-[#10b981]">{dept.value} members</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-md font-medium text-gray-300 mb-3">Status Overview</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">Active Members</span>
                      <span className="text-sm font-medium text-[#10b981]">{activeUsers}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">Inactive Members</span>
                      <span className="text-sm font-medium text-[#ef4444]">{inactiveUsers}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">Total Members</span>
                      <span className="text-sm font-medium text-white">{totalUsers}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamManagement; 