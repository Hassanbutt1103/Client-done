import React, { useState, useEffect, useRef } from 'react';
import { handleAuthError, getAuthHeaders } from '../../utils/auth';
import { API_ENDPOINTS } from '../../config/api';
import MonthSelector from '../../components/MonthSelector';
import { filterDataByDateRange, getDateRangeDisplay } from '../../utils/dateFilter';

// Import components without hardcoded data
import Assets from '../../components/Accounting/Assets';
import CashFlow from '../../components/Accounting/CashFlow';
import Transection from '../../components/Accounting/Transection';

const Accounting = () => {
  const [accountingData, setAccountingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assetsData, setAssetsData] = useState([]);
  const [cashFlowData, setCashFlowData] = useState([]);
  const [transactionData, setTransactionData] = useState([]);
  
  // Initialize with current month
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState({
    value: 'current',
    label: 'Current Month',
    startDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
    endDate: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
  });
  
  const [filteredAccountingData, setFilteredAccountingData] = useState([]);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    fetchAccountingData(); // initial fetch

    const interval = setInterval(() => {
      fetchAccountingData(false); // not initial
    }, 5000); // every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Filter accounting data when selectedMonth changes
  useEffect(() => {
    if (selectedMonth && accountingData.length > 0) {
      console.log('🔍 Filtering accounting data for month:', selectedMonth);
      const filtered = filterDataByDateRange(accountingData, 'DATA', selectedMonth.startDate, selectedMonth.endDate);
      console.log('🔍 Filtered accounting data length:', filtered.length);
      console.log('🔍 Original accounting data length:', accountingData.length);
      setFilteredAccountingData(filtered);
      // Process filtered data immediately
      if (filtered.length > 0) {
        processAccountingData(filtered);
      } else {
        // If no data for selected month, clear charts
        setAssetsData([]);
        setCashFlowData([]);
        setTransactionData([]);
      }
    } else {
      setFilteredAccountingData(accountingData);
      // Process original data when no filter is applied
      if (accountingData.length > 0) {
        processAccountingData(accountingData);
      }
    }
  }, [selectedMonth, accountingData]);

  const fetchAccountingData = async (showLoading = true) => {
    try {
      if (showLoading && isInitialLoad.current) setLoading(true);
      
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      console.log('🔄 Fetching accounting data from API...');

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
          if (JSON.stringify(csvData) !== JSON.stringify(accountingData)) {
            setAccountingData(csvData);
            setFilteredAccountingData(csvData); // Initialize filtered data
            processAccountingData(csvData);
          }
        }
      }
    } catch (error) {
      console.error('💥 Error fetching accounting data:', error);
    } finally {
      if (isInitialLoad.current) {
        setLoading(false);
        isInitialLoad.current = false;
      }
    }
  };

  const createSampleAccountingData = () => {
    console.log('🔧 Creating sample accounting data...');
    
    const currentDate = new Date();
    const sampleData = [];
    
    // Create 12 months of sample data
    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      
      sampleData.push({
        DATA: date.toISOString().split('T')[0],
        TOTAL_RECEBER: Math.floor(Math.random() * 40000) + 25000, // Assets
        TOTAL_A_PAGAR: Math.floor(Math.random() * 20000) + 10000, // Liabilities
        SALDO_DIARIO: Math.floor(Math.random() * 15000) - 5000    // Cash Flow
      });
    }
    
    console.log('📊 Sample accounting data created:', sampleData);
    processAccountingData(sampleData);
  };

  const processAccountingData = (csvData) => {
    if (!csvData || csvData.length === 0) return;

    console.log('🔍 Processing Accounting Data - Raw CSV Data length:', csvData.length);
    console.log('🔍 Processing Accounting Data - Sample:', csvData.slice(0, 2));

    // Process Assets & Liabilities data
    const assets = csvData.map((item, index) => {
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
        Assets: Number(item.TOTAL_RECEBER) || 0,
        Liabilities: Number(item.TOTAL_A_PAGAR) || 0
      };
    });

    // Process Cash Flow data
    const cashFlow = csvData.map((item, index) => {
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
        CashFlow: Number(item.SALDO_DIARIO) || 0
      };
    });

    // Process Transaction data - create meaningful transactions from the real data
    const transactions = csvData.map((item, index) => ({
      id: index + 1,
      date: item.DATA || 'N/A',
      description: `Financial Transaction ${index + 1}`,
      amount: Number(item.SALDO_DIARIO) || 0,
      type: Number(item.SALDO_DIARIO) >= 0 ? 'Credit' : 'Debit'
    }));

    console.log('🏦 Processed assets data:', assets);
    console.log('🏦 Assets data length:', assets.length);
    console.log('💸 Processed cash flow data:', cashFlow);
    console.log('💸 Cash flow data length:', cashFlow.length);
    console.log('📋 Processed transaction data:', transactions);
    console.log('📋 Transaction data length:', transactions.length);

    setAssetsData(assets);
    setCashFlowData(cashFlow);
    setTransactionData(transactions);
  };

  const handleMonthChange = (monthData) => {
    setSelectedMonth(monthData);
  };

  const getLatestAssetsLiabilities = () => {
    if (!assetsData.length) return { assets: 0, liabilities: 0 };
    const latest = assetsData[assetsData.length - 1];
    return { assets: latest.Assets, liabilities: latest.Liabilities };
  };

  const getLatestCashFlow = () => {
    if (!cashFlowData.length) return 0;
    return cashFlowData[cashFlowData.length - 1].CashFlow;
  };

  return (
    <div className="p-8 min-h-screen" style={{ backgroundColor: '#1a2a33' }}>
      
      {/* Month Selector */}
      <div className="mb-6">
        <MonthSelector 
          onMonthChange={handleMonthChange}
          selectedMonth={selectedMonth}
          className="max-w-md"
          label="Filter Accounting Data by Month"
        />
        {selectedMonth && (
          <div className="mt-2 text-sm text-[#D6A647] bg-[#D6A647]/10 px-3 py-2 rounded-lg border border-[#D6A647]/20">
            📅 Showing data for: {getDateRangeDisplay(selectedMonth.startDate, selectedMonth.endDate)}
            {filteredAccountingData.length > 0 && (
              <span className="ml-2">({filteredAccountingData.length} records found)</span>
            )}
          </div>
        )}
        {selectedMonth && filteredAccountingData.length === 0 && (
          <div className="mt-2 text-sm text-red-400 bg-red-400/10 px-3 py-2 rounded-lg border border-red-400/20">
            ⚠️ No data found for selected month: {getDateRangeDisplay(selectedMonth.startDate, selectedMonth.endDate)}
          </div>
        )}
      </div>
      
      <div className='flex flex-col md:flex-row justify-between gap-4 mb-8'>
        <div className="flex-1 bg-[#232b3a] rounded-xl shadow-lg p-6 border border-white/10 text-white">
          <h3 className="text-lg font-semibold mb-2">Assets & Liabilities</h3>
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin w-4 h-4 border-2 border-[#10b981] border-t-transparent rounded-full"></div>
              <span className="text-sm text-gray-400">Loading...</span>
            </div>
          ) : (
            <p className="text-2xl font-bold text-[#10b981]">
              R$ {getLatestAssetsLiabilities().assets.toLocaleString()} vs R$ {getLatestAssetsLiabilities().liabilities.toLocaleString()}
            </p>
          )}
        </div>

        <div className="flex-1 bg-[#232b3a] rounded-xl shadow-lg p-6 border border-white/10 text-white">
          <h3 className="text-lg font-semibold mb-2">Cash Flow Over Time</h3>
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin w-4 h-4 border-2 border-[#D6A647] border-t-transparent rounded-full"></div>
              <span className="text-sm text-gray-400">Loading...</span>
            </div>
          ) : (
            <p className="text-xl font-bold text-[#D6A647]">R$ {getLatestCashFlow().toLocaleString()}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Stacked Bar Chart: Assets & Liabilities */}
        <div className="bg-[#232b3a] rounded-xl shadow-lg p-6 border border-white/10">
          <h2 className="text-xl font-bold mb-4 text-white">
            Assets & Liabilities
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
          ) : assetsData.length > 0 ? (
            <Assets data={assetsData} />
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">
              <div className="text-center">
                <div className="text-4xl mb-2">🏦</div>
                <p className="text-sm">No assets/liabilities data available for selected period</p>
              </div>
            </div>
          )}
        </div>

        {/* Area Chart: Cash Flow */}
        <div className="bg-[#232b3a] rounded-xl shadow-lg p-6 border border-white/10">
          <h2 className="text-xl font-bold mb-4 text-white">
            {selectedMonth ? 'Daily Cash Flow' : 'Cash Flow Over Time'}
            {selectedMonth && (
              <span className="text-sm font-normal text-[#D6A647] block">
                Daily progression for {getDateRangeDisplay(selectedMonth.startDate, selectedMonth.endDate)}
              </span>
            )}
          </h2>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full"></div>
              <span className="ml-2 text-gray-300">Loading...</span>
            </div>
          ) : cashFlowData.length > 0 ? (
            <CashFlow data={cashFlowData} />
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">
              <div className="text-center">
                <div className="text-4xl mb-2">💸</div>
                <p className="text-sm">No cash flow data available for selected period</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Table: Transaction Logs */}
      <div className="bg-[#232b3a] rounded-xl shadow-lg p-6 border border-white/10 mt-8 max-w-4xl mx-auto">
        <h2 className="text-xl font-bold mb-4 text-white">
          Transaction Logs
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
        ) : transactionData.length > 0 ? (
          <Transection data={transactionData} />
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-400">
            <div className="text-center">
              <div className="text-4xl mb-2">📋</div>
              <p className="text-sm">No transaction data available for selected period</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Accounting; 