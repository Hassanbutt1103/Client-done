import React, { useState, useEffect, useRef } from 'react';
import PieChart from '../../components/general-overview/PieChart';
import LineChart from '../../components/general-overview/Linechart';
import MonthSelector from '../../components/MonthSelector';
import { handleAuthError, getAuthHeaders } from '../../utils/auth';
import { API_ENDPOINTS } from '../../config/api';
import { filterDataByDateRange, getDateRangeDisplay } from '../../utils/dateFilter';

const Overview = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [departmentStats, setDepartmentStats] = useState([]);
  const [monthlyActivity, setMonthlyActivity] = useState([]);
  const [hasAdminAccess, setHasAdminAccess] = useState(true); // Track admin access
  
  // Initialize with no month filter to show all data
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    fetchRealUsers(); // initial fetch

    const interval = setInterval(() => {
      fetchRealUsers(false); // not initial
    }, 5000); // every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Filter users when selectedMonth changes
  useEffect(() => {
    if (selectedMonth && users.length > 0) {
      console.log('🔍 Filtering user data for month:', selectedMonth);
      const filtered = filterDataByDateRange(users, 'createdAt', selectedMonth.startDate, selectedMonth.endDate);
      console.log('🔍 Filtered user data length:', filtered.length);
      console.log('🔍 Original user data length:', users.length);
      setFilteredUsers(filtered);
      // Recalculate stats with filtered data
      if (filtered.length > 0) {
        calculateDepartmentStats(filtered);
        setMonthlyActivity(calculateMonthlyActivity(filtered));
      } else {
        // If no data for selected month, clear stats
        setDepartmentStats([]);
        setMonthlyActivity([]);
      }
    } else {
      setFilteredUsers(users);
      // Use original data when no filter is applied
      calculateDepartmentStats(users);
      setMonthlyActivity(calculateMonthlyActivity(users));
    }
  }, [selectedMonth, users]);

  function sortUsers(users) {
    return [...users].sort((a, b) => {
      if (a._id && b._id) return a._id.localeCompare(b._id);
      if (a.email && b.email) return a.email.localeCompare(b.email);
      return 0;
    });
  }

  const fetchRealUsers = async (showLoading = true) => {
    try {
      if (showLoading && isInitialLoad.current) setLoading(true);
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      if (!token) {
        setLoading(false);
        return;
      }

      // Check user role first
      let userRole = 'Unknown';
      try {
        const userData = JSON.parse(user);
        userRole = userData.role || 'Unknown';
        console.log('👤 Current user role:', userRole);
      } catch (e) {
        console.log('❌ Error parsing user data');
      }

      // If user is admin or manager, they can access the users endpoint
      if (userRole === 'admin' || userRole === 'manager') {
        const response = await fetch(API_ENDPOINTS.USERS.LIST, {
          headers: getAuthHeaders()
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.status === 'success') {
            const newSorted = sortUsers(data.users);
            const oldSorted = sortUsers(users);
            if (JSON.stringify(newSorted) !== JSON.stringify(oldSorted)) {
              setUsers(data.users);
              setFilteredUsers(data.users);
              calculateDepartmentStats(data.users);
              setMonthlyActivity(calculateMonthlyActivity(data.users));
            }
          }
        }
      } else {
        // For other roles, show a message that this page requires admin/manager access
        console.log('❌ This page requires admin or manager access');
        setUsers([]);
        setFilteredUsers([]);
        setDepartmentStats([]);
        setMonthlyActivity([]);
        setHasAdminAccess(false); // Indicate no access
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      if (isInitialLoad.current) {
        setLoading(false);
        isInitialLoad.current = false;
      }
    }
  };

  const calculateDepartmentStats = (usersData) => {
    console.log('🔍 Processing User Data - Users length:', usersData.length);
    console.log('🔍 Processing User Data - Sample:', usersData.slice(0, 2));
    
    const departmentCounts = {};
    
    usersData.forEach(user => {
      const dept = user.department || user.role || 'Other';
      departmentCounts[dept] = (departmentCounts[dept] || 0) + 1;
    });

    const stats = Object.entries(departmentCounts).map(([name, count]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: count
    }));

    console.log('🏢 Processed department stats:', stats);
    console.log('🏢 Department stats length:', stats.length);
    
    setDepartmentStats(stats);
  };

  const handleMonthChange = (monthData) => {
    setSelectedMonth(monthData);
  };

  const calculateMonthlyActivity = (usersData) => {
    // Get all users with a valid createdAt date
    const usersWithDates = usersData.filter(user => user.createdAt);
    // If no users have createdAt, fallback to flat growth
    if (usersWithDates.length === 0) {
      const totalUsers = usersData.length;
      return [{ name: 'All Time', users: totalUsers }];
    }

    // Group users by month
    const monthlyData = {};
    usersWithDates.forEach(user => {
      const date = new Date(user.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('en', { month: 'short', year: 'numeric' });
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { name: monthName, count: 0 };
      }
      monthlyData[monthKey].count++;
    });

    // Convert to array and sort by date
    const monthlyArray = Object.values(monthlyData).sort((a, b) => {
      const dateA = new Date(a.name);
      const dateB = new Date(b.name);
      return dateA - dateB;
    });

    // Calculate cumulative growth
    const monthlyCumulative = monthlyArray.map((m, index) => {
      const count = monthlyArray.slice(0, index + 1).reduce((sum, month) => sum + month.count, 0);
      // Also add users with no createdAt (legacy users)
      const legacyUsers = usersData.length - usersWithDates.length;
      return {
        name: m.name,
        users: count + legacyUsers
      };
    });
    return monthlyCumulative;
  };

  const getCurrentMonth = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[new Date().getMonth()];
  };

  const getActiveUsersCount = () => {
    return filteredUsers.filter(user => user.isActive !== false).length;
  };

  const getUserRegistrationSummary = () => {
    if (!filteredUsers.length) return null;
    
    const currentYear = new Date().getFullYear();
    const usersWithDates = filteredUsers.filter(user => user.createdAt);
    
    if (usersWithDates.length === 0) {
      return {
        total: filteredUsers.length,
        thisYear: 0,
        previousYears: 0,
        oldestDate: null,
        newestDate: null
      };
    }
    
    const dates = usersWithDates.map(user => new Date(user.createdAt));
    const oldestDate = new Date(Math.min(...dates));
    const newestDate = new Date(Math.max(...dates));
    
    const thisYearUsers = usersWithDates.filter(user => 
      new Date(user.createdAt).getFullYear() === currentYear
    ).length;
    
    const previousYearsUsers = usersWithDates.filter(user => 
      new Date(user.createdAt).getFullYear() < currentYear
    ).length;
    
    return {
      total: filteredUsers.length,
      thisYear: thisYearUsers,
      previousYears: previousYearsUsers,
      oldestDate,
      newestDate,
      hasDateData: true
    };
  };

  const getLatestUserMonth = () => {
    if (!filteredUsers.length) return { month: getCurrentMonth(), year: new Date().getFullYear() };
    const usersWithDates = filteredUsers.filter(u => u.createdAt);
    if (!usersWithDates.length) return { month: getCurrentMonth(), year: new Date().getFullYear() };
    const latest = usersWithDates.reduce((a, b) => new Date(a.createdAt) > new Date(b.createdAt) ? a : b);
    const date = new Date(latest.createdAt);
    return {
      month: date.toLocaleString('default', { month: 'short' }),
      year: date.getFullYear()
    };
  };

  return (
    <div className="p-4 md:p-8 min-h-screen overflow-hidden" style={{ backgroundColor: '#1a2a33' }}>
      
      {/* Admin Access Message */}
      {!hasAdminAccess && !loading && (
        <div className="mb-6 text-center">
          <div className="bg-[#232b3a] rounded-xl shadow-lg p-8 border border-white/10 text-white">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold mb-4 text-[#D6A647]">Access Required</h2>
            <p className="text-gray-300 mb-4">
              This General Overview page requires admin or manager privileges to view user data and statistics.
            </p>
            <p className="text-sm text-gray-400">
              Please contact your system administrator for access or use the appropriate dashboard for your role.
            </p>
          </div>
        </div>
      )}

      {/* Month Selector - Only show if admin access */}
      {hasAdminAccess && (
        <div className="mb-6">
          <MonthSelector 
            onMonthChange={handleMonthChange}
            selectedMonth={selectedMonth}
            className="max-w-md"
            label="Filter User Data by Month"
          />
          {selectedMonth && (
            <div className="mt-2 text-sm text-[#D6A647] bg-[#D6A647]/10 px-3 py-2 rounded-lg border border-[#D6A647]/20">
              📅 Showing data for: {getDateRangeDisplay(selectedMonth.startDate, selectedMonth.endDate)}
              {filteredUsers.length > 0 && (
                <span className="ml-2">({filteredUsers.length} users found)</span>
              )}
            </div>
          )}
          {selectedMonth && filteredUsers.length === 0 && (
            <div className="mt-2 text-sm text-red-400 bg-red-400/10 px-3 py-2 rounded-lg border border-red-400/20">
              ⚠️ No users found for selected month: {getDateRangeDisplay(selectedMonth.startDate, selectedMonth.endDate)}
            </div>
          )}
        </div>
      )}
      
      {/* Stat Cards */}
      <div className='flex flex-col sm:flex-row justify-between gap-4 mb-6 md:mb-8'>
        <div className="flex-1 bg-[#232b3a] rounded-xl shadow-lg p-4 md:p-6 border border-white/10 text-white">
          <h3 className="text-base md:text-lg font-semibold mb-2">
            Total Users
            {selectedMonth && (
              <span className="text-xs font-normal text-[#D6A647] block">
                For selected period
              </span>
            )}
          </h3>
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin w-4 h-4 border-2 border-[#10b981] border-t-transparent rounded-full"></div>
              <span className="text-sm text-gray-400">Loading...</span>
            </div>
          ) : (
            <div>
              <p className="text-2xl md:text-3xl font-bold text-[#10b981]">{filteredUsers.length}</p>
              <div className="flex items-center gap-4 mt-2 text-xs">
                <span className="flex items-center gap-1 text-green-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  {filteredUsers.filter(u => u.isActive !== false).length} Active
                </span>
                <span className="flex items-center gap-1 text-red-400">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  {filteredUsers.filter(u => u.isActive === false).length} Inactive
                </span>
              </div>
              {/* Show recent activity if available */}
              {(() => {
                const usersWithDates = filteredUsers.filter(user => user.createdAt);
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                const recentUsers = usersWithDates.filter(user => 
                  new Date(user.createdAt) >= thirtyDaysAgo
                ).length;
                
                if (recentUsers > 0) {
                  return (
                    <p className="text-xs text-blue-400 mt-1">
                      +{recentUsers} new (30 days)
                    </p>
                  );
                }
                return null;
              })()}
              {selectedMonth && filteredUsers.length === 0 && (
                <p className="text-xs text-red-400 mt-1">No users in this period</p>
              )}
            </div>
          )}
        </div>

        <div className="flex-1 bg-[#232b3a] rounded-xl shadow-lg p-4 md:p-6 border border-white/10 text-white">
          <h3 className="text-base md:text-lg font-semibold mb-2">
            {selectedMonth ? 'Latest User' : 'Current Month'}
          </h3>
          {(() => {
            const latest = getLatestUserMonth();
            return <>
              <p className="text-xl md:text-2xl font-bold text-[#f59e42]">{latest.month}</p>
              <p className="text-xs md:text-sm text-gray-400">{latest.year}</p>
            </>;
          })()}
        </div>

        <div className="flex-1 bg-[#232b3a] rounded-xl shadow-lg p-4 md:p-6 border border-white/10 text-white">
          <h3 className="text-base md:text-lg font-semibold mb-2">
            Departments
            {selectedMonth && (
              <span className="text-xs font-normal text-[#D6A647] block">
                For selected period
              </span>
            )}
          </h3>
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin w-4 h-4 border-2 border-[#10b981] border-t-transparent rounded-full"></div>
              <span className="text-sm text-gray-400">Loading...</span>
            </div>
          ) : (
            <div>
              <p className="text-2xl md:text-3xl font-bold text-[#3b82f6]">{departmentStats.length}</p>
              <p className="text-xs md:text-sm text-gray-400">Active departments</p>
              {selectedMonth && departmentStats.length === 0 && (
                <p className="text-xs text-red-400 mt-1">No departments in this period</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <div className="bg-[#232b3a] rounded-xl shadow-lg p-4 md:p-6 border border-white/10 min-h-[400px]">
          <h2 className="text-lg md:text-xl font-bold mb-4 text-white">
            User Activity
            {selectedMonth && (
              <span className="text-sm font-normal text-[#D6A647] block">
                For {getDateRangeDisplay(selectedMonth.startDate, selectedMonth.endDate)}
              </span>
            )}
          </h2>
          {loading ? (
            <div className="flex items-center justify-center h-64 md:h-80">
              <div className="animate-spin w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full"></div>
              <span className="ml-2 text-gray-300">Loading...</span>
            </div>
          ) : monthlyActivity.length > 0 ? (
            <>
              <div className="h-64 sm:h-80 lg:h-96">
                <LineChart data={monthlyActivity} />
              </div>
              <div className="text-xs text-gray-400 mt-2 text-center">
                * Real-time data from database
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">
              <div className="text-center">
                <div className="text-4xl mb-2">👥</div>
                <p className="text-sm">No user activity data available for selected period</p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-[#232b3a] rounded-xl shadow-lg p-4 md:p-6 border border-white/10 min-h-[400px]">
          <h2 className="text-lg md:text-xl font-bold mb-4 text-white">
            Department Distribution
            {selectedMonth && (
              <span className="text-sm font-normal text-[#D6A647] block">
                For {getDateRangeDisplay(selectedMonth.startDate, selectedMonth.endDate)}
              </span>
            )}
          </h2>
          {loading ? (
            <div className="flex items-center justify-center h-64 md:h-80">
              <div className="animate-spin w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full"></div>
              <span className="ml-2 text-gray-300">Loading...</span>
            </div>
          ) : departmentStats.length > 0 ? (
            <>
              <div className="h-64 sm:h-80 lg:h-96">
                <PieChart data={departmentStats} />
              </div>
              <div className="text-xs text-gray-400 mt-2 text-center">
                * Real-time data from database
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">
              <div className="text-center">
                <div className="text-4xl mb-2">🏢</div>
                <p className="text-sm">No department data available for selected period</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Overview; 