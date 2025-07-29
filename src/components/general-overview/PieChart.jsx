import React, { useState, useEffect } from 'react';
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const COLORS = {
  primary: '#3b82f6',
  secondary: '#10b981', 
  accent: '#f59e0b',
  danger: '#ef4444',
  purple: '#8b5cf6',
  cyan: '#06b6d4',
  pink: '#ec4899',
  indigo: '#6366f1',
  orange: '#f97316',
  emerald: '#059669'
};

const PieChart = ({ data }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Only use real data
  const chartData = Array.isArray(data) && data.length > 0 ? data : [];

  // Enhanced tooltip component
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-[#1e293b] border border-gray-600 rounded-lg p-3 shadow-lg">
          <p className="text-white font-semibold mb-2">{data.name}</p>
          <p className="text-sm" style={{ color: data.color }}>
            Count: <span className="font-bold">{data.value}</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {((data.value / chartData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}% of total
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
    <div className="w-full h-full min-h-[280px] max-h-[500px]">
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <RePieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={isMobile ? 80 : 120}
              innerRadius={isMobile ? 40 : 60}
              fill={COLORS.primary}
              stroke="#1e293b"
              strokeWidth={2}
              label={renderCustomLabel}
              labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={Object.values(COLORS)[index % Object.values(COLORS).length]}
                />
              ))}
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
          </RePieChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-64 md:h-80 text-gray-400">
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <p className="text-sm">No department data available</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PieChart;