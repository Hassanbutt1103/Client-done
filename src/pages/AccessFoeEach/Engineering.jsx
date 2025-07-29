import React, { useState, useEffect } from 'react';
import System from '../../components/Engineering/System';
import Progress from '../../components/Engineering/Progress';
import IssueTask from '../../components/Engineering/IssueTask';
import { handleAuthError, getAuthHeaders } from '../../utils/auth';
import { API_ENDPOINTS } from '../../config/api';

const Engineering = () => {
  const [csvData, setCsvData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [engineeringMetrics, setEngineeringMetrics] = useState({
    systemUptime: 75,
    progressData: [],
    engineerData: [],
    totalIssues: 0,
    totalTasks: 0,
    latestProgress: { name: 'Week 1', Progress: 0, Tasks: 0 }
  });

  useEffect(() => {
    fetchCSVData();
  }, []);

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
          calculateEngineeringMetrics(data.data);
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

  const calculateEngineeringMetrics = (data) => {
    if (!data || data.length === 0) {
      return;
    }

    // Calculate System Uptime based on data completeness
    const totalFields = ['RECEBER_VP', 'PAGAR_VP', 'RECEBER_TGN', 'PAGAR_TGN', 'TOTAL_RECEBER', 'TOTAL_A_PAGAR', 'SALDO_DIARIO', 'SALDO_ACUMULADO'];
    let completeRecords = 0;
    data.forEach(record => {
      const validFields = totalFields.filter(field => record[field] !== null && record[field] !== undefined && record[field] !== 0);
      if (validFields.length >= totalFields.length * 0.8) { // 80% fields must be valid
        completeRecords++;
      }
    });
    const systemUptime = Math.round((completeRecords / data.length) * 100);

    // Calculate Progress Data based on SALDO_ACUMULADO progression
    const sortedData = [...data].sort((a, b) => new Date(a.DATA.split('/').reverse().join('-')) - new Date(b.DATA.split('/').reverse().join('-')));
    const maxAccumulated = Math.max(...sortedData.map(d => d.SALDO_ACUMULADO || 0));
    
    const progressData = sortedData.slice(0, 7).map((record, index) => {
      const progress = maxAccumulated > 0 ? Math.round((record.SALDO_ACUMULADO / maxAccumulated) * 100) : 0;
      const tasks = Math.floor((record.TOTAL_RECEBER + record.TOTAL_A_PAGAR) / 1000); // Convert currency to task count
      return {
        name: `Week ${index + 1}`,
        Progress: progress,
        Tasks: tasks
      };
    });

    // Calculate Engineer Data based on different financial operations
    const vpOperations = data.reduce((sum, d) => sum + (d.RECEBER_VP || 0) + (d.PAGAR_VP || 0), 0);
    const tgnOperations = data.reduce((sum, d) => sum + (d.RECEBER_TGN || 0) + (d.PAGAR_TGN || 0), 0);
    const dailyVariance = data.reduce((sum, d) => sum + Math.abs(d.SALDO_DIARIO || 0), 0);
    const accumulatedGrowth = data.reduce((sum, d) => sum + (d.SALDO_ACUMULADO || 0), 0);

    const engineerData = [
      { 
        name: 'VP Operations', 
        Issues: Math.floor(vpOperations / 50000), // Convert to manageable issue count
        Tasks: Math.floor(vpOperations / 30000) 
      },
      { 
        name: 'TGN Operations', 
        Issues: Math.floor(tgnOperations / 50000), 
        Tasks: Math.floor(tgnOperations / 30000) 
      },
      { 
        name: 'Daily Monitoring', 
        Issues: Math.floor(dailyVariance / 100000), 
        Tasks: Math.floor(dailyVariance / 60000) 
      },
      { 
        name: 'Growth Analysis', 
        Issues: Math.floor(accumulatedGrowth / 500000), 
        Tasks: Math.floor(accumulatedGrowth / 300000) 
      }
    ];

    const totalIssues = engineerData.reduce((sum, eng) => sum + eng.Issues, 0);
    const totalTasks = engineerData.reduce((sum, eng) => sum + eng.Tasks, 0);
    const latestProgress = progressData[progressData.length - 1] || { name: 'Week 1', Progress: 0, Tasks: 0 };

    setEngineeringMetrics({
      systemUptime,
      progressData,
      engineerData,
      totalIssues,
      totalTasks,
      latestProgress
    });
  };

  if (loading) {
    return (
      <div className="p-8 min-h-screen flex items-center justify-center" style={{ backgroundColor: '#1a2a33' }}>
        <div className="text-white text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading Engineering Data from CSV...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 min-h-screen" style={{ backgroundColor: '#1a2a33' }}>
      {csvData.length === 0 ? (
        <div className="text-white text-center py-12">
          <h2 className="text-xl md:text-2xl font-bold mb-4">No CSV Data Available</h2>
          <p className="text-gray-400">Please upload CSV data through System Analytics to view Engineering metrics.</p>
        </div>
      ) : (
        <>
          <div className='flex flex-col sm:flex-row justify-between gap-4 mb-6 md:mb-8'>
            <div className="flex-1 bg-[#232b3a] rounded-xl shadow-lg p-4 md:p-6 border border-white/10 text-white">
              <h3 className="text-base md:text-lg font-semibold mb-2">Project Progress Over Time</h3>
              <p className="text-xl md:text-2xl font-bold text-[#10b981]">
                {engineeringMetrics.latestProgress.name}: {engineeringMetrics.latestProgress.Progress}%
              </p>
              <p className="text-xs md:text-sm text-gray-400 mt-1">
                Based on accumulated financial data progression
              </p>
            </div>

            <div className="flex-1 bg-[#232b3a] rounded-xl shadow-lg p-4 md:p-6 border border-white/10 text-white">
              <h3 className="text-base md:text-lg font-semibold mb-2">Issues & Tasks by Operations</h3>
              <p className="text-lg md:text-xl font-bold text-[#D6A647]">
                Total Issues: {engineeringMetrics.totalIssues} <span className='px-2 md:px-4'>vs</span> Total Tasks: {engineeringMetrics.totalTasks}
              </p>
              <p className="text-xs md:text-sm text-gray-400 mt-1">
                Derived from financial operations complexity
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
            {/* Gauge Chart */}
            <div className="bg-[#232b3a] rounded-xl shadow-lg p-4 md:p-6 border border-white/10 flex flex-col items-center justify-center min-h-[300px]">
              <h2 className="text-lg md:text-xl font-bold mb-4 text-white text-center">System Uptime</h2>
              <System value={engineeringMetrics.systemUptime} />
              <div className="text-gray-300 mt-2 text-center">Data Completeness</div>
              <div className="text-xs text-gray-400 mt-1 text-center px-2">
                Based on CSV data quality and completeness
              </div>
            </div>

            {/* Progress Line Chart */}
            <div className="lg:col-span-2 bg-[#232b3a] rounded-xl shadow-lg p-4 md:p-6 border border-white/10 min-h-[300px]">
              <h2 className="text-lg md:text-xl font-bold mb-4 text-white">Project Progress Over Time</h2>
              <div className="h-60 md:h-80">
                <Progress data={engineeringMetrics.progressData} />
              </div>
              <div className="text-xs text-gray-400 mt-2">
                Progress calculated from financial accumulation trends
              </div>
            </div>
          </div>

          {/* Issue Task Bar Chart */}
          <div className="bg-[#232b3a] rounded-xl shadow-lg p-4 md:p-6 border border-white/10">
            <h2 className="text-lg md:text-xl font-bold mb-4 text-white">Issues & Tasks by Operations</h2>
            <div className="h-60 md:h-80">
              <IssueTask data={engineeringMetrics.engineerData} />
            </div>
            <div className="text-xs text-gray-400 mt-2">
              Engineering metrics derived from financial operations data (VP, TGN, Daily Monitoring, Growth Analysis)
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Engineering;
