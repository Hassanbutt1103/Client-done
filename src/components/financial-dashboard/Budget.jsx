import React, { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const Budget = ({ data }) => {
  const [isMobile, setIsMobile] = useState(false);
  const chartData = Array.isArray(data) && data.length > 0 ? data : [];

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  const COLORS = {
    revenue: '#10b981',
    expenses: '#ef4444',
    profit: '#3b82f6'
  };

  // Enhanced tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      // Calculate total from all payload data instead of relying on chartData closure
      const allData = payload[0].payload.parent || chartData;
      const total = Array.isArray(allData) ? allData.reduce((sum, item) => sum + item.value, 0) : 
                    payload.reduce((sum, p) => sum + p.value, 0);
      const percentage = total > 0 ? ((data.value / total) * 100).toFixed(1) : '0.0';
      
      return (
        <div className="bg-[#1e293b] border border-gray-600 rounded-lg p-3 shadow-lg">
          <p className="text-white font-semibold mb-2">{data.payload.name || data.name}</p>
          <p className="text-sm" style={{ color: data.color }}>
            Amount: <span className="font-bold">R$ {Number(data.value || data.payload.value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {percentage}% of total budget
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom label renderer
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return percent > 0.05 ? (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={isMobile ? "10" : "12"}
        fontWeight="600"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };

  return (
    <div className="w-full h-full">
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={isMobile ? 280 : 350}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={isMobile ? 40 : 60}
              outerRadius={isMobile ? 80 : 120}
              fill="#8884d8"
              dataKey="value"
              stroke="#1e293b"
              strokeWidth={2}
              label={renderCustomLabel}
              labelLine={false}
            >
              {chartData.map((entry, index) => {
                const colorKey = entry.name.toLowerCase();
                const color = COLORS[colorKey] || Object.values(COLORS)[index % Object.values(COLORS).length];
                return (
                  <Cell key={`cell-${index}`} fill={color} />
                );
              })}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ 
                color: '#e2e8f0',
                fontSize: isMobile ? '10px' : '12px',
                fontWeight: '500'
              }}
              formatter={(value) => (
                <span style={{ color: '#e2e8f0' }}>{value}</span>
              )}
              iconType="circle"
              layout={isMobile ? "horizontal" : "vertical"}
              verticalAlign={isMobile ? "bottom" : "middle"}
              align={isMobile ? "center" : "right"}
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-64 text-gray-400">
          <div className="text-center">
            <div className="text-4xl mb-2">💰</div>
            <p className="text-sm">No budget data available</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Budget
