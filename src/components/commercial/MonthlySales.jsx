import React, { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Default data for fallback
const defaultSalesTrendData = [
  { name: 'Jan', Sales: 3000 },
  { name: 'Feb', Sales: 3500 },
  { name: 'Mar', Sales: 4000 },
  { name: 'Apr', Sales: 3700 },
  { name: 'May', Sales: 4200 },
  { name: 'Jun', Sales: 4500 },
  { name: 'Jul', Sales: 4800 },
];

const MonthlySales = ({ data }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const COLORS = ['#2563eb', '#10b981', '#f59e42', '#f43f5e', '#a78bfa', '#fbbf24'];

  // Use provided data or fallback to default
  const salesTrendData = data && data.length > 0 ? data : defaultSalesTrendData;

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1e293b] border border-gray-600 rounded-lg p-3 shadow-lg">
          <p className="text-white font-semibold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: <span className="font-bold">{entry.value.toLocaleString()}K</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart 
          data={salesTrendData} 
          margin={{ 
            top: 20, 
            right: isMobile ? 10 : 30, 
            left: isMobile ? 0 : 0, 
            bottom: isMobile ? 0 : 0 
          }}
        >
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={COLORS[1]} stopOpacity={1} />
              <stop offset="100%" stopColor={COLORS[1]} stopOpacity={0.8} />
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#334155" 
            opacity={0.3}
          />
          <XAxis 
            dataKey="name" 
            stroke="#cbd5e1" 
            fontSize={isMobile ? 10 : 12}
            tickLine={false}
            axisLine={false}
            interval={isMobile ? 'preserveStartEnd' : 0}
          />
          <YAxis 
            stroke="#cbd5e1" 
            fontSize={isMobile ? 10 : 12}
            tickLine={false}
            axisLine={false}
            width={isMobile ? 30 : 40}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ 
              color: '#fff',
              fontSize: isMobile ? '10px' : '12px'
            }} 
          />
          <Line 
            type="monotone" 
            dataKey="Sales" 
            stroke={COLORS[1]} 
            strokeWidth={isMobile ? 2 : 3} 
            dot={{ 
              r: isMobile ? 3 : 5, 
              fill: COLORS[0] 
            }} 
            activeDot={{ 
              r: isMobile ? 5 : 8, 
              fill: COLORS[2] 
            }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default MonthlySales
