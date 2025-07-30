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
  
  // Initialize with current month
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState({
    value: 'current',
    label: 'Current Month',
    startDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
    endDate: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
  });
  
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
      if (!token) {
        setLoading(false);
        return;
      }
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
            setFilteredUsers(data.users); // Initialize filtered users with all users
            calculateDepartmentStats(data.users);
            setMonthlyActivity(calculateMonthlyActivity(data.users));
          }
        }
      }
    } catch (error) {
      // handle error
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
      // Prioritize department over role, only use role if department is not available
      let dept = 'Other';
      if (user.department && user.department.trim()) {
        dept = user.department;
      } else if (user.role) {
        // Map roles to more readable department names
        const roleToDept = {
          'admin': 'Administração',
          'manager': 'Gerência',
          'financial': 'Financeiro',
          'engineering': 'Engenharia',
          'hr': 'Recursos Humanos',
          'commercial': 'Comercial',
          'purchasing': 'Compras'
        };
        dept = roleToDept[user.role] || user.role;
      }
      
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
    // Find the earliest and latest createdAt dates
    const createdDates = usersWithDates.map(user => new Date(user.createdAt));
    const firstDate = new Date(Math.min(...createdDates));
    const lastDate = new Date(); // up to now
    // Build a list of months from firstDate to lastDate
    const months = [];
    let d = new Date(firstDate.getFullYear(), firstDate.getMonth(), 1);
    while (d <= lastDate) {
      months.push({
        name: d.toLocaleString('default', { month: 'short' }) + ' ' + d.getFullYear(),
        year: d.getFullYear(),
        monthIndex: d.getMonth(),
        date: new Date(d)
      });
      d.setMonth(d.getMonth() + 1);
    }
    // For each month, count users who registered on or before the end of that month
    const monthlyCumulative = months.map((m) => {
      // Get the last day of this month
      const lastDayOfMonth = new Date(m.year, m.monthIndex + 1, 0, 23, 59, 59, 999);
      // Count users whose createdAt is <= lastDayOfMonth
      const count = usersWithDates.filter(user => {
        const created = new Date(user.createdAt);
        return created <= lastDayOfMonth;
      }).length;
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
      
      {/* Month Selector */}
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
              <p className="text-xs md:text-sm text-gray-400">Active: {getActiveUsersCount()}</p>
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
              <div className="animate-spin w-4 h-4 border-2 border-[#D6A647] border-t-transparent rounded-full"></div>
              <span className="text-sm text-gray-400">Loading...</span>
            </div>
          ) : (
            <div>
              <p className="text-xl md:text-2xl font-bold text-[#D6A647]">{departmentStats.length}</p>
              {departmentStats.length > 0 ? (
                <div className="text-xs text-gray-400 mt-2 max-h-16 overflow-y-auto">
                  {departmentStats.map((dept, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{dept.name}:</span>
                      <span className="text-[#D6A647]">{dept.value}</span>
                    </div>
                  ))}
                </div>
              ) : selectedMonth ? (
                <p className="text-xs text-red-400 mt-1">No departments in this period</p>
              ) : (
                <p className="text-xs text-gray-400 mt-1">No department data</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 bg-[#232b3a] rounded-xl shadow-lg p-4 md:p-6 border border-white/10 min-h-[400px]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
            <h2 className="text-lg md:text-xl font-bold text-white">
              User Activity (Monthly)
              {selectedMonth && (
                <span className="text-sm font-normal text-[#D6A647] block">
                  For {getDateRangeDisplay(selectedMonth.startDate, selectedMonth.endDate)}
                </span>
              )}
            </h2>
            <div className="text-xs md:text-sm text-gray-400">
              {loading ? 'Loading...' : `${new Date().getFullYear()} Registrations`}
            </div>
          </div>
          {loading ? (
            <div className="flex items-center justify-center h-64 md:h-80">
              <div className="animate-spin w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full"></div>
              <span className="ml-2 text-gray-300">Loading user data...</span>
            </div>
          ) : monthlyActivity.length > 0 ? (
            <>
              <div className="h-64 sm:h-80 lg:h-96">
                <LineChart 
                  data={monthlyActivity} 
                  totalUsers={users.length}
                />
              </div>
              {/* User Registration Summary */}
              {(() => {
                const summary = getUserRegistrationSummary();
                return summary && (
                  <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-[#10b981] font-bold text-base md:text-lg">{summary.thisYear}</div>
                        <div className="text-gray-400 text-xs md:text-sm">This Year</div>
                      </div>
                      <div className="text-center">
                        <div className="text-[#f59e42] font-bold text-base md:text-lg">{summary.previousYears}</div>
                        <div className="text-gray-400 text-xs md:text-sm">Previous Years</div>
                      </div>
                      {summary.hasDateData && summary.oldestDate && (
                        <div className="text-center">
                          <div className="text-[#8b5cf6] font-bold text-xs md:text-sm">
                            {summary.oldestDate.toLocaleDateString()}
                          </div>
                          <div className="text-gray-400 text-xs">First User</div>
                        </div>
                      )}
                      {summary.hasDateData && summary.newestDate && (
                        <div className="text-center">
                          <div className="text-[#06b6d4] font-bold text-xs md:text-sm">
                            {summary.newestDate.toLocaleDateString()}
                          </div>
                          <div className="text-gray-400 text-xs">Latest User</div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
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
