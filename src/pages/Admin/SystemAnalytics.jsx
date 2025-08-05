import React, { useState, useRef, useEffect } from 'react';
import { FaCloudUploadAlt, FaChartLine, FaChartBar, FaChartPie, FaTable, FaDownload, FaTrash, FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, AreaChart, Area } from 'recharts';
import { handleAuthError, getAuthHeaders, isAuthenticated } from '../../utils/auth';
import { API_ENDPOINTS } from '../../config/api';

const SystemAnalytics = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  console.log('🎯 === SystemAnalytics Component Initialized ===');
  console.log('🔧 API Endpoints:', API_ENDPOINTS);
  console.log('🔑 Authentication status:', isAuthenticated());
  console.log('👤 Current user:', localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : 'No user');
  console.log('🪙 Auth token exists:', localStorage.getItem('token') ? 'Yes' : 'No');
  
  const [csvData, setCsvData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [chartType, setChartType] = useState('line');
  const [xAxisField, setXAxisField] = useState('DATA');
  const [yAxisField, setYAxisField] = useState('TOTAL_RECEBER');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [dataFields, setDataFields] = useState([]);
  const tableRef = useRef(null);
  const [cleanupLoading, setCleanupLoading] = useState(false);
  const [deletingRows, setDeletingRows] = useState(new Set());
  const [bulkDeleteLoading, setBulkDeleteLoading] = useState(false);

  console.log('📊 Initial state set:');
  console.log('   - csvData: empty array');
  console.log('   - loading: false');
  console.log('   - uploadLoading: false');
  console.log('   - chartType: line');
  console.log('   - file: null');

  const chartTypes = [
    { value: 'line', label: 'Line Chart', icon: <FaChartLine /> },
    { value: 'bar', label: 'Bar Chart', icon: <FaChartBar /> },
    { value: 'area', label: 'Area Chart', icon: <FaChartLine /> },
    { value: 'pie', label: 'Pie Chart', icon: <FaChartPie /> },
    { value: 'scatter', label: 'Scatter Plot', icon: <FaChartLine /> }
  ];

  const handleFileChange = (e) => {
    console.log('📁 === FILE SELECTION CHANGED ===');
    console.log('📂 Event target:', e.target);
    console.log('📋 Files array:', e.target.files);
    console.log('📊 Number of files selected:', e.target.files.length);
    
    const selectedFile = e.target.files[0];
    console.log('📄 Selected file object:', selectedFile);
    
    if (selectedFile) {
      console.log('📝 File details:');
      console.log('   - Name:', selectedFile.name);
      console.log('   - Size:', `${(selectedFile.size / 1024).toFixed(1)} KB`);
      console.log('   - Type:', selectedFile.type);
      console.log('   - Last modified:', new Date(selectedFile.lastModified));
      console.log('   - Ends with .csv:', selectedFile.name.endsWith('.csv'));
      
      if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
        console.log('✅ File validation passed - valid CSV file');
        setFile(selectedFile);
        setMessage('');
        console.log('🗑️ Cleared any previous error messages');
      } else {
        console.log('❌ File validation failed - not a CSV file');
        console.log('💬 Setting error message for invalid file type');
        setMessage('Please select a valid CSV file.');
        setFile(null);
      }
    } else {
      console.log('⚠️ No file selected or file selection was cancelled');
      setFile(null);
    }
    console.log('📁 === FILE SELECTION PROCESS COMPLETE ===');
  };

  const handleUpload = async () => {
    console.log('🚀 === UPLOAD BUTTON CLICKED ===');
    console.log('📁 File selected:', file ? file.name : 'No file');
    console.log('📏 File size:', file ? `${(file.size / 1024).toFixed(1)} KB` : 'N/A');
    console.log('📋 File type:', file ? file.type : 'N/A');
    
    if (!file) {
      console.log('❌ No file selected, showing error message');
      setMessage('Please select a CSV file first.');
      return;
    }

    console.log('⏳ Setting upload loading to true...');
    setUploadLoading(true);
    
    try {
      console.log('🔍 Checking authentication status...');
      // Check authentication before proceeding
      if (!isAuthenticated()) {
        console.log('❌ User not authenticated');
        console.log('📦 localStorage token:', localStorage.getItem('token') ? 'Present' : 'Missing');
        console.log('👤 localStorage user:', localStorage.getItem('user') ? 'Present' : 'Missing');
        setMessage('❌ Please login to upload files.');
        setUploadLoading(false);
        return;
      }

      console.log('✅ User authenticated, proceeding with upload...');
      console.log('🔑 Starting file upload with authentication...');
      
      const formData = new FormData();
      formData.append('csvFile', file);
      console.log('📦 FormData created and file appended');

      // Get proper authentication headers (without Content-Type for FormData)
      const authHeaders = getAuthHeaders();
      console.log('🔑 Original auth headers:', authHeaders);
      delete authHeaders['Content-Type']; // Remove Content-Type for FormData uploads
      console.log('🔑 Final auth headers (Content-Type removed):', authHeaders);

      console.log('📤 Upload details:');
      console.log('   - URL:', API_ENDPOINTS.CLIENT_DATA.UPLOAD);
      console.log('   - Method: POST');
      console.log('   - Headers:', authHeaders);
      console.log('   - Body: FormData with csvFile');
      console.log('🔐 Auth header:', authHeaders.Authorization ? 'Present' : 'Missing');

      const response = await fetch(API_ENDPOINTS.CLIENT_DATA.UPLOAD, {
        method: 'POST',
        headers: authHeaders,
        body: formData
      });

      console.log('📥 Server response received:');
      console.log('   - Status:', response.status);
      console.log('   - Status Text:', response.statusText);
      console.log('   - Headers:', Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        console.log('✅ Response is OK, parsing JSON...');
        const data = await response.json();
        console.log('📥 Full response data:', JSON.stringify(data, null, 2));
        
        if (data.status === 'success') {
          console.log('🎉 Upload successful!');
          const savedCount = data.data.savedRecords || data.data.totalRecords || 0;
          const skippedCount = data.data.skippedRecords || 0;
          
          console.log('📊 Upload results:');
          console.log('   - Saved records:', savedCount);
          console.log('   - Skipped records:', skippedCount);
          console.log('   - File name:', data.data.fileName);
          
          let successMessage = `✅ Successfully uploaded ${savedCount} records!`;
          if (skippedCount > 0) {
            successMessage += ` (${skippedCount} rows skipped due to errors)`;
          }
          
          console.log('💬 Setting success message:', successMessage);
          setMessage(successMessage);
          
          console.log('🧹 Clearing file selection...');
          setFile(null);
          
          // Reset file input
          const fileInput = document.getElementById('csvFile');
          if (fileInput) {
            console.log('🗑️ Resetting file input element');
            fileInput.value = '';
          }
          
          // Fetch updated data
          console.log('🔄 Fetching updated data...');
          fetchData();
        } else {
          console.log('❌ Upload failed on server side');
          console.log('💬 Server message:', data.message);
          setMessage(`❌ Upload failed: ${data.message}`);
        }
      } else {
        console.log('❌ Response not OK, handling error...');
        // Handle authentication errors
        if (response.status === 401) {
          console.log('🔒 401 Unauthorized error detected');
          console.error('Authentication failed during upload');
          handleAuthError(null, response);
          setMessage('❌ Authentication failed. Please login again.');
        } else {
          console.log('💥 Other error status:', response.status);
          const errorData = await response.json();
          console.log('📥 Error response data:', errorData);
          setMessage(`❌ Upload failed: ${errorData.message || 'Unknown error'}`);
        }
      }
    } catch (error) {
      console.log('💥 Exception caught during upload process:');
      console.error('Upload error:', error);
      console.log('📝 Error details:');
      console.log('   - Message:', error.message);
      console.log('   - Stack:', error.stack);
      
      if (error.message === 'No authentication token found') {
        console.log('🔑 Token error detected');
        setMessage('❌ Please login to upload files.');
        handleAuthError(error);
      } else {
        console.log('🌐 Network or other error');
        setMessage('❌ Upload failed. Please try again.');
      }
    } finally {
      console.log('🏁 Upload process completed, setting loading to false');
      setUploadLoading(false);
      console.log('🚀 === UPLOAD PROCESS FINISHED ===');
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Check if token exists
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found for data fetch');
        setLoading(false);
        return;
      }

      const response = await fetch(API_ENDPOINTS.CLIENT_DATA.LIST, {
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const result = await response.json();
        const data = result.data.clientData;
        
        setCsvData(data);
        
        // Extract field names for dropdowns
        if (data.length > 0) {
          const fields = Object.keys(data[0]).filter(key => 
            !['_id', '__v', 'uploadedBy', 'fileName', 'uploadDate', 'createdAt', 'updatedAt'].includes(key)
          );
          setDataFields(fields);
        }
      } else {
        // Handle authentication errors
        if (!handleAuthError(null, response)) {
          console.error('Failed to fetch data');
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // Check if it's a token error
      if (error.message === 'No authentication token found') {
        console.log('Token not found, unable to fetch data');
      }
    } finally {
      setLoading(false);
    }
  };

  const prepareChartData = () => {
    if (!csvData.length) return [];
    
    return csvData.map(item => ({
      ...item,
      // Format numbers for better display
      RECEBER_VP: Number(item.RECEBER_VP) || 0,
      PAGAR_VP: Number(item.PAGAR_VP) || 0,
      RECEBER_TGN: Number(item.RECEBER_TGN) || 0,
      PAGAR_TGN: Number(item.PAGAR_TGN) || 0,
      TOTAL_RECEBER: Number(item.TOTAL_RECEBER) || 0,
      TOTAL_A_PAGAR: Number(item.TOTAL_A_PAGAR) || 0,
      SALDO_DIARIO: Number(item.SALDO_DIARIO) || 0,
      SALDO_ACUMULADO: Number(item.SALDO_ACUMULADO) || 0
    })).slice(0, 20); // Limit to 20 points for better visualization
  };

  const renderChart = () => {
    const data = prepareChartData();
    if (!data.length) return <div className="text-center text-gray-400 py-8">No data to display</div>;

    const colors = ['#D6A647', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

    // Custom tooltip component for dynamic data display
    const CustomTooltip = ({ active, payload, label }) => {
      if (active && payload && payload.length) {
        return (
          <div className="bg-[#232b3a] border border-white/10 rounded-lg p-3 shadow-lg">
            <p className="text-white font-semibold mb-2">{label}</p>
            {payload.map((entry, index) => (
              <p key={index} className="text-sm" style={{ color: entry.color }}>
                {entry.dataKey}: <span className="font-bold">R$ {Number(entry.value || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </p>
            ))}
          </div>
        );
      }
      return null;
    };

    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xAxisField} />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey={yAxisField} stroke="#D6A647" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xAxisField} />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey={yAxisField} fill="#D6A647" />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xAxisField} />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area type="monotone" dataKey={yAxisField} stroke="#D6A647" fill="#D6A64780" />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'pie':
        // Enhanced color palette for pie chart
        const pieColors = ['#D6A647', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316', '#06B6D4', '#84CC16', '#EC4899', '#6366F1'];
        
        // Filter out zero/negative values and limit to top 8 segments for better visibility
        const pieData = data
          .filter(item => Number(item[yAxisField]) > 0)
          .slice(0, 8)
          .map((item, index) => ({
            name: item[xAxisField],
            value: Number(item[yAxisField]) || 0,
            fill: pieColors[index % pieColors.length]
          }));

        // Custom label component with proper styling
        const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
          if (percent < 0.03) return null; // Don't show labels for segments less than 3%
          
          const RADIAN = Math.PI / 180;
          const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
          const x = cx + radius * Math.cos(-midAngle * RADIAN);
          const y = cy + radius * Math.sin(-midAngle * RADIAN);
          
          return (
            <text 
              x={x} 
              y={y} 
              fill="#ffffff"
              textAnchor={x > cx ? 'start' : 'end'} 
              dominantBaseline="central"
              fontSize="12"
              fontWeight="600"
              style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
            >
              {`${(percent * 100).toFixed(1)}%`}
            </text>
          );
        };

        // Custom tooltip component with full white text control
        const PieCustomTooltip = ({ active, payload, label }) => {
          if (active && payload && payload.length) {
            const data = payload[0];
            return (
              <div style={{
                backgroundColor: '#232b3a',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                padding: '12px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
                color: '#ffffff'
              }}>
                <p style={{ 
                  color: '#ffffff', 
                  margin: '0 0 8px 0', 
                  fontWeight: '600',
                  fontSize: '14px'
                }}>
                  {`${data.payload.name}`}
                </p>
                <p style={{ 
                  color: '#ffffff', 
                  margin: '0',
                  fontSize: '14px'
                }}>
                  {`Value: R$ ${Number(data.value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                </p>
                <p style={{ 
                  color: '#ffffff', 
                  margin: '4px 0 0 0',
                  fontSize: '12px',
                  opacity: 0.8
                }}>
                  {`${((data.value / pieData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%`}
                </p>
              </div>
            );
          }
          return null;
        };

        return (
          <ResponsiveContainer width="100%" height={500}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={140}
                innerRadius={60}
                fill="#8884d8"
                dataKey="value"
                stroke="#232b3a"
                strokeWidth={2}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip 
                content={<PieCustomTooltip />}
                cursor={{ fill: 'rgba(255,255,255,0.1)' }}
              />
              <Legend 
                wrapperStyle={{ 
                  color: '#ffffff', 
                  fontSize: '12px',
                  fontWeight: '500'
                }}
                iconType="circle"
                formatter={(value) => (
                  <span style={{ color: '#ffffff' }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xAxisField} />
              <YAxis dataKey={yAxisField} />
              <Tooltip content={<CustomTooltip />} />
              <Scatter dataKey={yAxisField} fill="#D6A647" />
            </ScatterChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  // Scroll functions for data preview
  const scrollToTop = () => {
    if (tableRef.current) {
      tableRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  const scrollToBottom = () => {
    if (tableRef.current) {
      tableRef.current.scrollTo({
        top: tableRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  const cleanupDuplicates = async () => {
    try {
      setCleanupLoading(true);
      setMessage('');
      
      const response = await fetch(API_ENDPOINTS.CLIENT_DATA.LIST + '/cleanup-duplicates', {
        method: 'POST',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const result = await response.json();
        setMessage(`✅ ${result.message}`);
        // Refresh data to show cleaned results
        fetchData();
      } else {
        const errorData = await response.json();
        setMessage(`❌ Cleanup failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Cleanup error:', error);
      setMessage('❌ Error cleaning up duplicates. Please try again.');
    } finally {
      setCleanupLoading(false);
    }
  };

  const handleDeleteAll = async () => {
    const confirmMessage = `Are you sure you want to delete ALL ${csvData.length} records?\n\nThis action cannot be undone and will remove all CSV data from the database.\n\nThis will affect:\n• Financial Dashboard data\n• Analytics charts\n• All uploaded CSV records`;
    
    if (!confirm(confirmMessage)) {
      return;
    }

    setBulkDeleteLoading(true);

    try {
      console.log('🗑️ Deleting all records...');
      
      // Delete all records one by one (since we don't have a bulk delete endpoint)
      const deletePromises = csvData.map(async (row, index) => {
        try {
          const response = await fetch(API_ENDPOINTS.CLIENT_DATA.DELETE(row._id), {
            method: 'DELETE',
            headers: getAuthHeaders()
          });
          
          if (response.ok) {
            console.log(`✅ Deleted record ${index + 1}/${csvData.length}`);
            return true;
          } else {
            console.log(`❌ Failed to delete record ${index + 1}`);
            return false;
          }
        } catch (error) {
          console.error(`❌ Error deleting record ${index + 1}:`, error);
          return false;
        }
      });

      const results = await Promise.all(deletePromises);
      const successCount = results.filter(Boolean).length;
      const failCount = results.length - successCount;

      if (successCount > 0) {
        setMessage(`✅ Successfully deleted ${successCount} records${failCount > 0 ? ` (${failCount} failed)` : ''}`);
        setCsvData([]); // Clear the table
        
        // Refresh data after a short delay
        setTimeout(() => {
          fetchData();
        }, 1000);
      } else {
        setMessage('❌ Failed to delete any records');
      }
    } catch (error) {
      console.error('❌ Bulk delete error:', error);
      setMessage(`❌ Bulk delete error: ${error.message}`);
    } finally {
      setBulkDeleteLoading(false);
    }
  };

  const handleDeleteRow = async (recordId, index) => {
    const recordDate = csvData[index]?.DATA || 'this record';
    const confirmMessage = `Are you sure you want to delete the record for ${recordDate}?\n\nThis action cannot be undone.`;
    
    if (!confirm(confirmMessage)) {
      return;
    }

    setDeletingRows(prev => new Set(prev).add(index));

    try {
      console.log(`🗑️ Deleting record: ${recordId}`);
      
      const response = await fetch(API_ENDPOINTS.CLIENT_DATA.DELETE(recordId), {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        console.log('✅ Record deleted successfully');
        setMessage(`✅ Record for ${recordDate} deleted successfully`);
        
        // Remove the row from the local state
        setCsvData(prevData => prevData.filter((_, i) => i !== index));
        
        // Refresh data after a short delay
        setTimeout(() => {
          fetchData();
        }, 1000);
      } else {
        const errorData = await response.json();
        console.error('❌ Delete failed:', errorData);
        setMessage(`❌ Delete failed: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('❌ Delete error:', error);
      setMessage(`❌ Delete error: ${error.message}`);
    } finally {
      setDeletingRows(prev => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-8 min-h-screen" style={{ backgroundColor: '#1a2a33' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-[#232b3a] rounded-xl shadow-lg p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-gradient-to-r from-[#D6A647]/20 to-[#b45309]/20 rounded-xl">
          <FaCloudUploadAlt className="text-[#D6A647] text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">System Analytics</h1>
                <p className="text-gray-300">Upload CSV files and create custom data visualizations</p>
              </div>
            </div>
          </div>
        </div>

        {/* CSV Upload Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-[#232b3a] rounded-xl shadow-lg p-6 border border-white/10">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                              <FaCloudUploadAlt className="text-[#D6A647]" />
              Upload CSV Data
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select CSV File
                </label>
                <input
                  id="csvFile"
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-500/20 file:text-blue-300 hover:file:bg-blue-500/30 bg-white/5 border border-white/10 rounded-lg"
                />
              </div>

              {file && (
                <div className="p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
                  <p className="text-sm text-green-300">
                    Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
                  </p>
                </div>
              )}

              <button
                onClick={() => {
                  console.log('🔘 Upload button clicked!');
                  console.log('📁 Current file state:', file);
                  console.log('⏳ Current uploadLoading state:', uploadLoading);
                  console.log('🚫 Button disabled?', !file || uploadLoading);
                  handleUpload();
                }}
                disabled={!file || uploadLoading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#D6A647] to-[#b45309] text-white px-4 py-2 rounded-lg hover:from-[#b45309] hover:to-[#92400e] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {uploadLoading ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <FaCloudUploadAlt />
                    Upload CSV
                  </>
                )}
              </button>

              {message && (
                <div className={`p-3 rounded-lg border ${
                  message.includes('✅') 
                    ? 'bg-green-500/20 border-green-500/30 text-green-300' 
                    : 'bg-red-500/20 border-red-500/30 text-red-300'
                }`}>
                  {message}
                </div>
              )}
            </div>
          </div>

          {/* Chart Customization */}
          <div className="bg-[#232b3a] rounded-xl shadow-lg p-6 border border-white/10">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FaChartLine className="text-green-400" />
              Customize Graph
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Chart Type
                </label>
                <select
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-[#D6A647] focus:border-[#D6A647] text-white"
                >
                  {chartTypes.map(type => (
                    <option key={type.value} value={type.value} className="bg-[#232b3a] text-white">
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  X-Axis Field
                </label>
                <select
                  value={xAxisField}
                  onChange={(e) => setXAxisField(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-[#D6A647] focus:border-[#D6A647] text-white"
                >
                  {dataFields.map(field => (
                    <option key={field} value={field} className="bg-[#232b3a] text-white">
                      {field}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Y-Axis Field
                </label>
                <select
                  value={yAxisField}
                  onChange={(e) => setYAxisField(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-[#D6A647] focus:border-[#D6A647] text-white"
                >
                  {dataFields.filter(field => 
                    ['RECEBER_VP', 'PAGAR_VP', 'RECEBER_TGN', 'PAGAR_TGN', 'TOTAL_RECEBER', 'TOTAL_A_PAGAR', 'SALDO_DIARIO', 'SALDO_ACUMULADO'].includes(field)
                  ).map(field => (
                    <option key={field} value={field} className="bg-[#232b3a] text-white">
                      {field}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={fetchData}
                className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <FaDownload />
                Refresh Data
              </button>
            </div>
          </div>
        </div>

        {/* Chart Display */}
        <div className="bg-[#232b3a] rounded-xl shadow-lg p-6 mb-8 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">
              Data Visualization
            </h2>
            <div className="text-sm text-gray-300">
              Showing {csvData.length} records
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-[#D6A647] border-t-transparent rounded-full"></div>
              <span className="ml-2 text-gray-300">Loading data...</span>
            </div>
          ) : (
            renderChart()
          )}
        </div>

        {/* Data Table Preview */}
        {csvData.length > 0 && (
          <div className="bg-[#232b3a] rounded-xl shadow-lg p-6 border border-white/10">
            <div className={`${isMobile ? 'flex-col gap-4' : 'flex items-center justify-between'} mb-4`}>
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <FaTable className="text-purple-400" />
                Data Preview
              </h2>
              <div className={`${isMobile ? 'flex-col gap-3' : 'flex items-center gap-4'}`}>
                <div className={`flex ${isMobile ? 'flex-wrap gap-2' : 'gap-2'}`}>
                  <button
                    onClick={scrollToTop}
                    className={`flex items-center gap-1 ${isMobile ? 'px-2 py-1 text-xs' : 'px-3 py-1 text-sm'} bg-gradient-to-r from-[#D6A647] to-[#b45309] text-white rounded-lg hover:from-[#b45309] hover:to-[#92400e] transition-colors`}
                    title="Scroll to top"
                  >
                    <FaArrowUp className={isMobile ? "text-xs" : "text-xs"} />
                    {isMobile ? "Top" : "Top"}
                  </button>
                  <button
                    onClick={scrollToBottom}
                    className={`flex items-center gap-1 ${isMobile ? 'px-2 py-1 text-xs' : 'px-3 py-1 text-sm'} bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors`}
                    title="Scroll to bottom"
                  >
                    <FaArrowDown className={isMobile ? "text-xs" : "text-xs"} />
                    {isMobile ? "Bottom" : "Bottom"}
                  </button>
                  <button
                    onClick={cleanupDuplicates}
                    disabled={cleanupLoading}
                    className={`flex items-center gap-1 ${isMobile ? 'px-2 py-1 text-xs' : 'px-3 py-1 text-sm'} bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
                    title="Remove duplicate dates - each date will appear only once"
                  >
                    {cleanupLoading ? (
                      <>
                        <div className="animate-spin w-3 h-3 border border-white border-t-transparent rounded-full"></div>
                        {isMobile ? "Cleaning..." : "Cleaning..."}
                      </>
                    ) : (
                      <>
                        <FaTrash className={isMobile ? "text-xs" : "text-xs"} />
                        {isMobile ? "Fix" : "Fix Duplicates"}
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleDeleteAll}
                    disabled={bulkDeleteLoading || csvData.length === 0}
                    className={`flex items-center gap-1 ${isMobile ? 'px-2 py-1 text-xs' : 'px-3 py-1 text-sm'} bg-red-700 text-white rounded-lg hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
                    title="Delete all records from database"
                  >
                    {bulkDeleteLoading ? (
                      <>
                        <div className="animate-spin w-3 h-3 border border-white border-t-transparent rounded-full"></div>
                        {isMobile ? "Deleting..." : "Deleting All..."}
                      </>
                    ) : (
                      <>
                        <FaTrash className={isMobile ? "text-xs" : "text-xs"} />
                        {isMobile ? "Del All" : "Delete All"}
                      </>
                    )}
                  </button>
                </div>
                <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-400 text-center`}>
                  Showing all {csvData.length} rows
                </div>
              </div>
            </div>
            
            <div className="overflow-auto max-h-96 border border-white/10 rounded-lg" ref={tableRef}>
              <table className={`w-full ${isMobile ? 'text-xs' : 'text-sm'}`}>
                <thead className="bg-white/5 sticky top-0">
                  <tr>
                    <th className={`${isMobile ? 'px-2 py-2' : 'px-4 py-3'} text-left text-gray-300 border-b border-white/10`}>Date</th>
                    <th className={`${isMobile ? 'px-2 py-2' : 'px-4 py-3'} text-right text-gray-300 border-b border-white/10`}>RECEBER VP</th>
                    <th className={`${isMobile ? 'px-2 py-2' : 'px-4 py-3'} text-right text-gray-300 border-b border-white/10`}>PAGAR VP</th>
                    <th className={`${isMobile ? 'px-2 py-2' : 'px-4 py-3'} text-right text-gray-300 border-b border-white/10`}>RECEBER TGN</th>
                    <th className={`${isMobile ? 'px-2 py-2' : 'px-4 py-3'} text-right text-gray-300 border-b border-white/10`}>PAGAR TGN</th>
                    <th className={`${isMobile ? 'px-2 py-2' : 'px-4 py-3'} text-right text-gray-300 border-b border-white/10`}>TOTAL RECEBER</th>
                    <th className={`${isMobile ? 'px-2 py-2' : 'px-4 py-3'} text-right text-gray-300 border-b border-white/10`}>TOTAL A PAGAR</th>
                    <th className={`${isMobile ? 'px-2 py-2' : 'px-4 py-3'} text-right text-gray-300 border-b border-white/10`}>SALDO DIÁRIO</th>
                    <th className={`${isMobile ? 'px-2 py-2' : 'px-4 py-3'} text-right text-gray-300 border-b border-white/10`}>SALDO ACUMULADO</th>
                    <th className={`${isMobile ? 'px-2 py-2' : 'px-4 py-3'} text-center text-gray-300 border-b border-white/10`}>Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {csvData.map((row, index) => (
                    <tr key={index} className={`hover:bg-white/5 text-white ${deletingRows.has(index) ? 'opacity-50' : ''}`}>
                      <td className={`${isMobile ? 'px-2 py-1' : 'px-4 py-2'}`}>{row.DATA}</td>
                      <td className={`${isMobile ? 'px-2 py-1' : 'px-4 py-2'} text-right`}>R$ {Number(row.RECEBER_VP).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                      <td className={`${isMobile ? 'px-2 py-1' : 'px-4 py-2'} text-right`}>R$ {Number(row.PAGAR_VP).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                      <td className={`${isMobile ? 'px-2 py-1' : 'px-4 py-2'} text-right`}>R$ {Number(row.RECEBER_TGN).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                      <td className={`${isMobile ? 'px-2 py-1' : 'px-4 py-2'} text-right`}>R$ {Number(row.PAGAR_TGN).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                      <td className={`${isMobile ? 'px-2 py-1' : 'px-4 py-2'} text-right`}>R$ {Number(row.TOTAL_RECEBER).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                      <td className={`${isMobile ? 'px-2 py-1' : 'px-4 py-2'} text-right`}>R$ {Number(row.TOTAL_A_PAGAR).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                      <td className={`${isMobile ? 'px-2 py-1' : 'px-4 py-2'} text-right`}>R$ {Number(row.SALDO_DIARIO).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                      <td className={`${isMobile ? 'px-2 py-1' : 'px-4 py-2'} text-right`}>R$ {Number(row.SALDO_ACUMULADO).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                      <td className={`${isMobile ? 'px-2 py-1' : 'px-4 py-2'} text-center`}>
                        <button
                          onClick={() => handleDeleteRow(row._id, index)}
                          disabled={deletingRows.has(index)}
                          className={`flex items-center justify-center gap-1 ${isMobile ? 'px-2 py-1 text-xs' : 'px-3 py-1 text-sm'} bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
                          title="Delete this record"
                        >
                          {deletingRows.has(index) ? (
                            <>
                              <div className="animate-spin w-3 h-3 border border-white border-t-transparent rounded-full"></div>
                              {isMobile ? "..." : "Deleting..."}
                            </>
                          ) : (
                            <>
                              <FaTrash className={isMobile ? "text-xs" : "text-xs"} />
                              {isMobile ? "Del" : "Delete"}
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 text-center text-gray-400 text-sm">
              💡 Use scroll buttons above or mouse wheel to navigate • Click "Bottom" for latest data • Use "Fix Duplicates" to ensure each date appears only once • Click "Delete" to remove individual records • Use "Delete All" to remove all data from database
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemAnalytics; 