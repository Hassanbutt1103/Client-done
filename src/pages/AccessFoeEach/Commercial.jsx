import React, { useState, useEffect } from 'react';
import SalesTypes from '../../components/commercial/SalesTypes';
import Customers from '../../components/commercial/Customers';
import MonthlySales from '../../components/commercial/MonthlySales';
import MonthSelector from '../../components/MonthSelector';
import { handleAuthError, getAuthHeaders } from '../../utils/auth';
import { API_ENDPOINTS } from '../../config/api';
import { filterDataByDateRange, getDateRangeDisplay } from '../../utils/dateFilter';

const Commercial = () => {
  const [csvData, setCsvData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Initialize with current month
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState({
    value: 'current',
    label: 'Current Month',
    startDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
    endDate: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
  });
  
  const [filteredCommercialData, setFilteredCommercialData] = useState([]);
  const [commercialMetrics, setCommercialMetrics] = useState({
    salesData: [],
    customerData: [],
    monthlyTrend: [],
    totalSales: 0,
    topProduct: { name: 'Product A', Sales: 0 },
    latestSales: 0
  });

  useEffect(() => {
    fetchCSVData();
  }, []);

  // Filter commercial data when selectedMonth changes
  useEffect(() => {
    if (selectedMonth && csvData.length > 0) {
      console.log('🔍 Filtering commercial data for month:', selectedMonth);
      const filtered = filterDataByDateRange(csvData, 'DATA', selectedMonth.startDate, selectedMonth.endDate);
      console.log('🔍 Filtered commercial data length:', filtered.length);
      console.log('🔍 Original commercial data length:', csvData.length);
      setFilteredCommercialData(filtered);
      // Process filtered data immediately
      if (filtered.length > 0) {
        calculateCommercialMetrics(filtered, selectedMonth);
      } else {
        // If no data for selected month, clear metrics
        setCommercialMetrics({
          salesData: [],
          customerData: [],
          monthlyTrend: [],
          totalSales: 0,
          topProduct: { name: 'Product A', Sales: 0 },
          latestSales: 0
        });
      }
    } else {
      setFilteredCommercialData(csvData);
      // Process original data when no filter is applied
      if (csvData.length > 0) {
        calculateCommercialMetrics(csvData, null);
      }
    }
  }, [selectedMonth, csvData]);

  const fetchCSVData = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.CLIENT_DATA.LIST, {
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success' && data.data) {
          setCsvData(data.data);
          // Don't calculate here - let the useEffect handle it
        }
      } else {
        handleAuthError(response);
      }
    } catch (error) {
      console.error('Error fetching CSV data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateCommercialMetrics = (data, selectedMonthFilter = null) => {
    if (!data || data.length === 0) {
      return;
    }

    // Calculate Sales by Product (based on different revenue streams)
    const vpRevenue = data.reduce((sum, d) => sum + (d.RECEBER_VP || 0), 0);
    const tgnRevenue = data.reduce((sum, d) => sum + (d.RECEBER_TGN || 0), 0);
    const totalReceivable = data.reduce((sum, d) => sum + (d.TOTAL_RECEBER || 0), 0);
    const dailySales = data.reduce((sum, d) => sum + Math.abs(d.SALDO_DIARIO || 0), 0);
    const accumulatedSales = data.reduce((sum, d) => sum + (d.SALDO_ACUMULADO || 0), 0);

    const salesData = [
      { name: 'VP Revenue', Sales: Math.round(vpRevenue / 1000) }, // Convert to thousands
      { name: 'TGN Revenue', Sales: Math.round(tgnRevenue / 1000) },
      { name: 'Daily Operations', Sales: Math.round(dailySales / 1000) },
      { name: 'Accumulated Growth', Sales: Math.round(accumulatedSales / 10000) }, // Convert to ten thousands
      { name: 'Total Receivables', Sales: Math.round(totalReceivable / 1000) }
    ];

    // Calculate Customer Types (based on transaction patterns)
    const vpTransactions = data.filter(d => (d.RECEBER_VP || 0) > 0).length;
    const tgnTransactions = data.filter(d => (d.RECEBER_TGN || 0) > 0).length;
    const dailyActiveCustomers = data.filter(d => Math.abs(d.SALDO_DIARIO || 0) > 10000).length;
    const totalTransactions = vpTransactions + tgnTransactions + dailyActiveCustomers;

    const customerData = [
      { name: 'VP Clients', value: Math.round((vpTransactions / Math.max(totalTransactions, 1)) * 100) },
      { name: 'TGN Clients', value: Math.round((tgnTransactions / Math.max(totalTransactions, 1)) * 100) },
      { name: 'High Value', value: Math.round((dailyActiveCustomers / Math.max(totalTransactions, 1)) * 100) },
      { name: 'Others', value: Math.max(0, 100 - Math.round((vpTransactions + tgnTransactions + dailyActiveCustomers) / Math.max(totalTransactions, 1) * 100)) }
    ];

    // Calculate Monthly Sales Trend (based on chronological data)
    const sortedData = [...data].sort((a, b) => new Date(a.DATA.split('/').reverse().join('-')) - new Date(b.DATA.split('/').reverse().join('-')));
    
    const monthlyTrend = sortedData.slice(0, 7).map((record, index) => {
      const date = new Date(record.DATA.split('/').reverse().join('-'));
      // When showing data for a selected month, display days
      const name = selectedMonthFilter 
        ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      
      const sales = Math.round((record.TOTAL_RECEBER || 0) / 1000); // Convert to thousands
      
      return {
        name: name,
        Sales: sales
      };
    });

    const totalSales = Math.round(totalReceivable / 1000);
    const topProduct = salesData.reduce((max, current) => current.Sales > max.Sales ? current : max, salesData[0] || { name: 'Product A', Sales: 0 });
    const latestSales = monthlyTrend.length > 0 ? monthlyTrend[monthlyTrend.length - 1].Sales : 0;

    setCommercialMetrics({
      salesData,
      customerData,
      monthlyTrend,
      totalSales,
      topProduct,
      latestSales
    });
  };

  if (loading) {
    return (
      <div className="p-8 min-h-screen flex items-center justify-center" style={{ backgroundColor: '#1a2a33' }}>
        <div className="text-white text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading Commercial Data from CSV...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 min-h-screen" style={{ backgroundColor: '#1a2a33' }}>
      {csvData.length === 0 ? (
        <div className="text-white text-center py-12">
          <h2 className="text-xl md:text-2xl font-bold mb-4">No CSV Data Available</h2>
          <p className="text-gray-400">Please upload CSV data through System Analytics to view Commercial metrics.</p>
        </div>
      ) : (
        <>
          {/* Month Selector */}
          <div className="mb-6">
            <MonthSelector 
              selectedMonth={selectedMonth} 
              onMonthChange={setSelectedMonth}
              className={`mb-6 ${
                filteredCommercialData.length === 0 && selectedMonth 
                  ? 'bg-red-500/10 border-red-500' 
                  : selectedMonth 
                    ? 'bg-[#D6A647]/10 border-[#D6A647]' 
                    : ''
              }`}
            />
            
            {/* Data feedback */}
            {selectedMonth && (
              <div className={`text-sm mt-2 ${
                filteredCommercialData.length === 0 
                  ? 'text-red-400' 
                  : 'text-[#D6A647]'
              }`}>
                {filteredCommercialData.length === 0 
                  ? `⚠️ No data available for ${selectedMonth.label}` 
                  : `📊 Showing ${filteredCommercialData.length} records for ${selectedMonth.label}`
                }
              </div>
            )}
          </div>

          <div className='flex flex-col sm:flex-row justify-between gap-4 mb-6 md:mb-8'>
            <div className="flex-1 bg-[#232b3a] rounded-xl shadow-lg p-4 md:p-6 border border-white/10 text-white">
              <h3 className="text-base md:text-lg font-semibold mb-2">
                Top Revenue Source {selectedMonth ? `(${getDateRangeDisplay(selectedMonth.startDate, selectedMonth.endDate)})` : ''}
              </h3>
              {commercialMetrics.topProduct.Sales > 0 ? (
                <>
                  <p className="text-xl md:text-2xl font-bold text-[#10b981]">
                    {commercialMetrics.topProduct.name}: {commercialMetrics.topProduct.Sales.toLocaleString()}K
                  </p>
                  <p className="text-xs md:text-sm text-gray-400 mt-1">
                    Based on {selectedMonth ? 'filtered' : 'all'} financial revenue streams
                  </p>
                </>
              ) : (
                <div className="text-center text-gray-400">
                  <div className="text-2xl mb-1">💰</div>
                  <p className="text-sm">No revenue data</p>
                </div>
              )}
            </div>

            <div className="flex-1 bg-[#232b3a] rounded-xl shadow-lg p-4 md:p-6 border border-white/10 text-white">
              <h3 className="text-base md:text-lg font-semibold mb-2">
                Latest Period Sales {selectedMonth ? `(${getDateRangeDisplay(selectedMonth.startDate, selectedMonth.endDate)})` : ''}
              </h3>
              {commercialMetrics.latestSales > 0 ? (
                <>
                  <p className="text-xl md:text-2xl font-bold text-[#D6A647]">
                    {commercialMetrics.latestSales.toLocaleString()}K
                  </p>
                  <p className="text-xs md:text-sm text-gray-400 mt-1">
                    From {selectedMonth ? 'selected period' : 'recent'} financial data
                  </p>
                </>
              ) : (
                <div className="text-center text-gray-400">
                  <div className="text-2xl mb-1">📊</div>
                  <p className="text-sm">No sales data</p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
            {/* Bar Chart: Sales by Product */}
            <div className="bg-[#232b3a] rounded-xl shadow-lg p-4 md:p-6 border border-white/10 min-h-[400px]">
              <h2 className="text-lg md:text-xl font-bold mb-4 text-white">
                Revenue by Source {selectedMonth ? `(${selectedMonth.value === 'current' ? 'Daily' : 'Monthly'} - ${getDateRangeDisplay(selectedMonth.startDate, selectedMonth.endDate)})` : '(All Time)'}
              </h2>
              <div className="h-60 md:h-80">
                <SalesTypes data={commercialMetrics.salesData} />
              </div>
              <div className="text-xs text-gray-400 mt-2">
                Revenue streams derived from {selectedMonth ? 'filtered' : 'all'} CSV financial data
              </div>
            </div>

            {/* Pie Chart: Customer Types */}
            <div className="bg-[#232b3a] rounded-xl shadow-lg p-4 md:p-6 border border-white/10 min-h-[400px]">
              <h2 className="text-lg md:text-xl font-bold mb-4 text-white">
                Client Distribution {selectedMonth ? `(${getDateRangeDisplay(selectedMonth.startDate, selectedMonth.endDate)})` : '(All Time)'}
              </h2>
              <div className="h-60 md:h-80">
                <Customers data={commercialMetrics.customerData} />
              </div>
              <div className="text-xs text-gray-400 mt-2">
                Client distribution based on {selectedMonth ? 'filtered' : 'all'} transaction patterns
              </div>
            </div>
          </div>

          {/* Line Chart: Monthly Sales Trends */}
          <div className="bg-[#232b3a] rounded-xl shadow-lg p-4 md:p-6 border border-white/10">
            <h2 className="text-lg md:text-xl font-bold mb-4 text-white">
              Sales Trends {selectedMonth ? `(${selectedMonth.value === 'current' ? 'Daily' : 'Monthly'} - ${getDateRangeDisplay(selectedMonth.startDate, selectedMonth.endDate)})` : '(Over Time)'}
            </h2>
            <div className="h-60 md:h-80">
              <MonthlySales data={commercialMetrics.monthlyTrend} />
            </div>
            <div className="text-xs text-gray-400 mt-2">
              Sales trends calculated from {selectedMonth ? 'filtered' : 'chronological'} financial data
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Commercial; 