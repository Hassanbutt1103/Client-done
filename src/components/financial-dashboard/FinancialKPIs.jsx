import React, { useState, useEffect } from 'react';
import { FaArrowUp, FaArrowDown, FaDollarSign, FaChartLine, FaPiggyBank, FaCalculator } from 'react-icons/fa';

const FinancialKPIs = ({ data }) => {
  const [kpiData, setKpiData] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    profitMargin: 0,
    revenueGrowth: 0,
    expenseRatio: 0
  });

  useEffect(() => {
    if (data && data.length > 0) {
      calculateKPIs(data);
    }
  }, [data]);

  const calculateKPIs = (financialData) => {
    const totalRevenue = financialData.reduce((sum, item) => sum + (Number(item.TOTAL_RECEBER) || 0), 0);
    const totalExpenses = financialData.reduce((sum, item) => sum + (Number(item.TOTAL_A_PAGAR) || 0), 0);
    const netProfit = financialData.reduce((sum, item) => sum + (Number(item.SALDO_DIARIO) || 0), 0);
    
    const profitMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100) : 0;
    const expenseRatio = totalRevenue > 0 ? ((totalExpenses / totalRevenue) * 100) : 0;
    
    // Calculate growth (comparing first half vs second half of data)
    const midPoint = Math.floor(financialData.length / 2);
    const firstHalfRevenue = financialData.slice(0, midPoint).reduce((sum, item) => sum + (Number(item.TOTAL_RECEBER) || 0), 0);
    const secondHalfRevenue = financialData.slice(midPoint).reduce((sum, item) => sum + (Number(item.TOTAL_RECEBER) || 0), 0);
    const revenueGrowth = firstHalfRevenue > 0 ? (((secondHalfRevenue - firstHalfRevenue) / firstHalfRevenue) * 100) : 0;

    setKpiData({
      totalRevenue,
      totalExpenses,
      netProfit,
      profitMargin,
      revenueGrowth,
      expenseRatio
    });
  };

  const formatCurrency = (value) => {
    return `R$ ${Math.abs(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  };

  const formatPercentage = (value) => {
    return `${Math.abs(value).toFixed(1)}%`;
  };

  const getTrendIcon = (value) => {
    return value >= 0 ? <FaArrowUp className="text-green-400" /> : <FaArrowDown className="text-red-400" />;
  };

  const getTrendColor = (value) => {
    return value >= 0 ? 'text-green-400' : 'text-red-400';
  };

  const KPICard = ({ title, value, icon: Icon, trend, isPercentage = false, isCurrency = true, description }) => (
    <div className="bg-gradient-to-br from-[#232b3a] to-[#1e293b] rounded-xl p-6 border border-white/10 hover:border-[#D6A647]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#D6A647]/20">
      <div className="flex items-center justify-between mb-3">
        <div className="p-3 bg-[#D6A647]/20 rounded-xl">
          <Icon className="text-[#D6A647] text-xl" />
        </div>
        <div className="flex items-center gap-2">
          {getTrendIcon(trend)}
          <span className={`text-sm font-semibold ${getTrendColor(trend)}`}>
            {isPercentage ? formatPercentage(trend) : ''}
          </span>
        </div>
      </div>
      
      <h3 className="text-gray-300 text-sm font-medium mb-1">{title}</h3>
      <p className="text-white text-2xl font-bold mb-2">
        {isCurrency ? formatCurrency(value) : (isPercentage ? formatPercentage(value) : value)}
      </p>
      <p className="text-gray-400 text-xs">{description}</p>
    </div>
  );

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <KPICard
          title="Total Revenue"
          value={kpiData.totalRevenue}
          icon={FaDollarSign}
          trend={kpiData.revenueGrowth}
          description="Total income from all sources"
        />
        
        <KPICard
          title="Total Expenses"
          value={kpiData.totalExpenses}
          icon={FaCalculator}
          trend={-kpiData.expenseRatio}
          description="All operational costs and expenses"
        />
        
        <KPICard
          title="Net Profit"
          value={kpiData.netProfit}
          icon={FaPiggyBank}
          trend={kpiData.netProfit >= 0 ? 15 : -15}
          description="Revenue minus total expenses"
        />
        
        <KPICard
          title="Profit Margin"
          value={kpiData.profitMargin}
          icon={FaChartLine}
          trend={kpiData.profitMargin}
          isPercentage={true}
          isCurrency={false}
          description="Profitability as percentage of revenue"
        />
        
        <KPICard
          title="Revenue Growth"
          value={kpiData.revenueGrowth}
          icon={FaArrowUp}
          trend={kpiData.revenueGrowth}
          isPercentage={true}
          isCurrency={false}
          description="Period-over-period revenue change"
        />
        
        <KPICard
          title="Expense Ratio"
          value={kpiData.expenseRatio}
          icon={FaCalculator}
          trend={-kpiData.expenseRatio}
          isPercentage={true}
          isCurrency={false}
          description="Expenses as percentage of revenue"
        />
      </div>
      
      {/* Summary Bar */}
      <div className="mt-6 bg-gradient-to-r from-[#232b3a] to-[#1e293b] rounded-xl p-4 border border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-[#D6A647]/20 rounded-lg">
              <FaChartLine className="text-[#D6A647] text-lg" />
            </div>
            <div>
              <h4 className="text-white font-semibold">Financial Health Score</h4>
              <p className="text-gray-400 text-sm">Based on current performance metrics</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-[#D6A647]">
              {kpiData.profitMargin > 0 ? 'Excellent' : 'Needs Attention'}
            </div>
            <div className="text-sm text-gray-400">
              Profit margin: {formatPercentage(kpiData.profitMargin)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialKPIs; 