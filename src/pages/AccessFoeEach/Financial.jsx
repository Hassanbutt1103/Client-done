import React, { useState, useEffect, useRef } from 'react';
import { handleAuthError, getAuthHeaders } from '../../utils/auth';
import { API_ENDPOINTS } from '../../config/api';
import MonthSelector from '../../components/MonthSelector';
import { filterDataByDateRange, getDateRangeDisplay } from '../../utils/dateFilter';

// Import components without hardcoded data
import RavinueExxpense from '../../components/financial-dashboard/RavinueExxpense';
import MonthlyTrend from '../../components/financial-dashboard/MonthlyTrend';
import Budget from '../../components/financial-dashboard/Budget';
import FinancialKPIs from '../../components/financial-dashboard/FinancialKPIs';

const Financial = () => {
  const [financialData, setFinancialData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [revenueExpenseData, setRevenueExpenseData] = useState([]);
  const [monthlyTrendData, setMonthlyTrendData] = useState([]);
  const [budgetData, setBudgetData] = useState([]);
  
  // Initialize with current month
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState({
    value: 'current',
    label: 'Current Month',
    startDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
    endDate: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
  });
  
  const [filteredFinancialData, setFilteredFinancialData] = useState([]);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    fetchFinancialData(); // initial fetch

    const interval = setInterval(() => {
      fetchFinancialData(false); // not initial
    }, 5000); // every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Filter financial data when selectedMonth changes
  useEffect(() => {
    if (selectedMonth && financialData.length > 0) {
      console.log('🔍 Filtering data for month:', selectedMonth);
      const filtered = filterDataByDateRange(financialData, 'DATA', selectedMonth.startDate, selectedMonth.endDate);
      console.log('🔍 Filtered data length:', filtered.length);
      console.log('🔍 Original data length:', financialData.length);
      setFilteredFinancialData(filtered);
      // Process filtered data immediately
      if (filtered.length > 0) {
        processFinancialData(filtered);
      } else {
        // If no data for selected month, clear charts
        setRevenueExpenseData([]);
        setMonthlyTrendData([]);
        setBudgetData([]);
      }
    } else {
      setFilteredFinancialData(financialData);
      // Process original data when no filter is applied
      if (financialData.length > 0) {
        processFinancialData(financialData);
      }
    }
  }, [selectedMonth, financialData]);

  const fetchFinancialData = async (showLoading = true) => {
    try {
      if (showLoading && isInitialLoad.current) setLoading(true);
      
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      console.log('🔄 Fetching financial data from API...');
      
      const response = await fetch(API_ENDPOINTS.CLIENT_DATA.LIST, {
        headers: getAuthHeaders()
      });

      console.log('📥 API Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('📊 Full API Response:', data);
        
        if (data.status === 'success') {
          const csvData = data.data.clientData;
          console.log('💼 Raw CSV Data from MongoDB:', csvData);
          console.log('📈 Number of records:', csvData ? csvData.length : 0);
          
          if (csvData && csvData.length > 0) {
            console.log('📋 Sample record:', csvData[0]);
          }
          
          // Only update if data has changed
          if (JSON.stringify(csvData) !== JSON.stringify(financialData)) {
            setFinancialData(csvData);
            setFilteredFinancialData(csvData); // Initialize filtered data
            processFinancialData(csvData);
          }
        }
      }
    } catch (error) {
      console.error('💥 Error fetching financial data:', error);
    } finally {
      if (isInitialLoad.current) {
        setLoading(false);
        isInitialLoad.current = false;
      }
    }
  };

  const processFinancialData = (csvData) => {
    if (!csvData || csvData.length === 0) return;

    console.log('🔍 Processing Data - Raw CSV Data length:', csvData.length);
    console.log('🔍 Processing Data - Sample:', csvData.slice(0, 2));
    
    // Process Revenue vs Expenses data from real MongoDB data
    const revenueExpense = csvData.map((item, index) => {
      let monthName = 'N/A';
      
      if (item.DATA) {
        try {
          // Handle DD/MM/YYYY format from MongoDB
          const dateParts = item.DATA.split('/');
          if (dateParts.length === 3) {
            const day = parseInt(dateParts[0]);
            const month = parseInt(dateParts[1]) - 1; // JS months are 0-indexed
            const year = parseInt(dateParts[2]);
            const date = new Date(year, month, day);
            
            // For month filtering, show individual days within the month
            if (selectedMonth) {
              monthName = date.toLocaleDateString('en', { 
                month: 'short', 
                day: 'numeric'
              });
            } else {
              monthName = date.toLocaleDateString('en', { month: 'short', year: 'numeric' });
            }
          }
        } catch (error) {
          console.error('Date parsing error:', error);
          monthName = item.DATA || `Entry ${index + 1}`;
        }
      } else {
        monthName = `Entry ${index + 1}`;
      }

      return {
        name: monthName,
        Revenue: Number(item.TOTAL_RECEBER) || 0,
        Expenses: Number(item.TOTAL_A_PAGAR) || 0
      };
    });

    // Process Monthly Trend data
    const monthlyTrend = csvData.map((item, index) => {
      let monthName = 'N/A';
      
      if (item.DATA) {
        try {
          const dateParts = item.DATA.split('/');
          if (dateParts.length === 3) {
            const day = parseInt(dateParts[0]);
            const month = parseInt(dateParts[1]) - 1;
            const year = parseInt(dateParts[2]);
            const date = new Date(year, month, day);
            
            // For month filtering, show individual days within the month
            if (selectedMonth) {
              monthName = date.toLocaleDateString('en', { 
                month: 'short', 
                day: 'numeric'
              });
            } else {
              monthName = date.toLocaleDateString('en', { month: 'short', year: 'numeric' });
            }
          }
        } catch (error) {
          monthName = item.DATA || `Day ${index + 1}`;
        }
      } else {
        monthName = `Day ${index + 1}`;
      }

      return {
        name: monthName,
        Profit: Number(item.SALDO_DIARIO) || 0,
        Revenue: Number(item.TOTAL_RECEBER) || 0,
        Expenses: Number(item.TOTAL_A_PAGAR) || 0
      };
    });

    // Process Budget allocation data
    const totalRevenue = csvData.reduce((sum, item) => sum + (Number(item.TOTAL_RECEBER) || 0), 0);
    const totalExpenses = csvData.reduce((sum, item) => sum + (Number(item.TOTAL_A_PAGAR) || 0), 0);
    const totalProfit = csvData.reduce((sum, item) => sum + (Number(item.SALDO_DIARIO) || 0), 0);
    
    const budget = [
      { name: 'Revenue', value: totalRevenue },
      { name: 'Expenses', value: totalExpenses },
      { name: 'Profit', value: Math.max(0, totalProfit) }
    ].filter(item => item.value > 0);

    console.log('📊 Processed revenue/expense data:', revenueExpense);
    console.log('📈 Processed monthly trend data:', monthlyTrend);
    console.log('💰 Processed budget data:', budget);

    setRevenueExpenseData(revenueExpense);
    setMonthlyTrendData(monthlyTrend);
    setBudgetData(budget);
  };

  const handleMonthChange = (monthData) => {
    setSelectedMonth(monthData);
  };

  const getLatestFinancialStats = () => {
    if (!revenueExpenseData.length) return { revenue: 0, expenses: 0 };
    const latest = revenueExpenseData[revenueExpenseData.length - 1];
    return { revenue: latest.Revenue, expenses: latest.Expenses };
  };

  const getLatestProfit = () => {
    if (!monthlyTrendData.length) return 0;
    return monthlyTrendData[monthlyTrendData.length - 1].Profit;
  };

  return (
    <div className="p-8 min-h-screen" style={{ backgroundColor: '#1a2a33' }}>
      
      {/* Month Selector */}
      <div className="mb-6">
        <MonthSelector 
          onMonthChange={handleMonthChange}
          selectedMonth={selectedMonth}
          className="max-w-md"
          label="Filter Financial Data by Month"
        />
        {selectedMonth && (
          <div className="mt-2 text-sm text-[#D6A647] bg-[#D6A647]/10 px-3 py-2 rounded-lg border border-[#D6A647]/20">
            📅 Showing data for: {getDateRangeDisplay(selectedMonth.startDate, selectedMonth.endDate)}
            {filteredFinancialData.length > 0 && (
              <span className="ml-2">({filteredFinancialData.length} records found)</span>
            )}
          </div>
        )}
        {selectedMonth && filteredFinancialData.length === 0 && (
          <div className="mt-2 text-sm text-red-400 bg-red-400/10 px-3 py-2 rounded-lg border border-red-400/20">
            ⚠️ No data found for selected month: {getDateRangeDisplay(selectedMonth.startDate, selectedMonth.endDate)}
          </div>
        )}
      </div>
      
      <div className='flex flex-col md:flex-row justify-between gap-4 mb-8'>
        <div className="flex-1 bg-[#232b3a] rounded-xl shadow-lg p-6 border border-white/10 text-white">
          <h3 className="text-lg font-semibold mb-2">Revenue vs. Expenses</h3>
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin w-4 h-4 border-2 border-[#10b981] border-t-transparent rounded-full"></div>
              <span className="text-sm text-gray-400">Loading...</span>
            </div>
          ) : (
            <p className="text-2xl font-bold text-[#10b981]">
              R$ {getLatestFinancialStats().revenue.toLocaleString()} vs R$ {getLatestFinancialStats().expenses.toLocaleString()}
            </p>
          )}
        </div>

        <div className="flex-1 bg-[#232b3a] rounded-xl shadow-lg p-6 border border-white/10 text-white">
          <h3 className="text-lg font-semibold mb-2">Monthly Financial Trends (Profit)</h3>
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin w-4 h-4 border-2 border-[#D6A647] border-t-transparent rounded-full"></div>
              <span className="text-sm text-gray-400">Loading...</span>
            </div>
          ) : (
            <p className="text-xl font-bold text-[#D6A647]">R$ {getLatestProfit().toLocaleString()}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Bar Chart: Revenue vs. Expenses */}
        <div className="bg-[#232b3a] rounded-xl shadow-lg p-6 border border-white/10">
          <h2 className="text-xl font-bold mb-4 text-white">
            Revenue vs. Expenses
            {selectedMonth && (
              <span className="text-sm font-normal text-[#D6A647] block">
                For {getDateRangeDisplay(selectedMonth.startDate, selectedMonth.endDate)}
              </span>
            )}
          </h2>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full"></div>
              <span className="ml-2 text-gray-300">Loading...</span>
            </div>
          ) : revenueExpenseData.length > 0 ? (
            <RavinueExxpense data={revenueExpenseData} />
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">
              <div className="text-center">
                <div className="text-4xl mb-2">💰</div>
                <p className="text-sm">No revenue/expense data available for selected period</p>
              </div>
            </div>
          )}
        </div>

        {/* Donut/Pie Chart: Budget Allocation */}
        <div className="bg-[#232b3a] rounded-xl shadow-lg p-6 border border-white/10">
          <h2 className="text-xl font-bold mb-4 text-white">
            Budget Allocation
            {selectedMonth && (
              <span className="text-sm font-normal text-[#D6A647] block">
                For {getDateRangeDisplay(selectedMonth.startDate, selectedMonth.endDate)}
              </span>
            )}
          </h2>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full"></div>
              <span className="ml-2 text-gray-300">Loading...</span>
            </div>
          ) : budgetData.length > 0 ? (
            <Budget data={budgetData} />
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">
              <div className="text-center">
                <div className="text-4xl mb-2">📊</div>
                <p className="text-sm">No budget data available for selected period</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Financial KPIs Dashboard */}
      <div className="bg-[#232b3a] rounded-xl shadow-lg p-6 border border-white/10 mt-8">
        <h2 className="text-xl font-bold mb-6 text-white">
          Financial Performance Overview
          {selectedMonth && (
            <span className="text-sm font-normal text-[#D6A647] block">
              For {getDateRangeDisplay(selectedMonth.startDate, selectedMonth.endDate)}
            </span>
          )}
        </h2>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin w-8 h-8 border-4 border-[#D6A647] border-t-transparent rounded-full"></div>
            <span className="ml-2 text-gray-300">Loading...</span>
          </div>
        ) : (filteredFinancialData.length > 0 || (!selectedMonth && financialData.length > 0)) ? (
          <FinancialKPIs data={filteredFinancialData.length > 0 ? filteredFinancialData : financialData} />
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-400">
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <p className="text-sm">No financial data available for selected period</p>
            </div>
          </div>
        )}
      </div>

      {/* Line Chart: Monthly Financial Trends */}
      <div className="bg-[#232b3a] rounded-xl shadow-lg p-6 border border-white/10 mt-8 max-w-4xl mx-auto">
        <h2 className="text-xl font-bold mb-4 text-white">
          {selectedMonth ? 'Daily Financial Trends (Profit)' : 'Monthly Financial Trends (Profit)'}
          {selectedMonth && (
            <span className="text-sm font-normal text-[#D6A647] block">
              Daily progression for {getDateRangeDisplay(selectedMonth.startDate, selectedMonth.endDate)}
            </span>
          )}
        </h2>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin w-8 h-8 border-4 border-[#D6A647] border-t-transparent rounded-full"></div>
            <span className="ml-2 text-gray-300">Loading...</span>
          </div>
        ) : monthlyTrendData.length > 0 ? (
          <MonthlyTrend data={monthlyTrendData} />
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-400">
            <div className="text-center">
              <div className="text-4xl mb-2">📈</div>
              <p className="text-sm">No trend data available for selected period</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Financial; 