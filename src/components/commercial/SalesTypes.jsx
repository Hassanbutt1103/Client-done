import React, { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Default data for fallback
const defaultProductData = [
  { name: 'Product A', Sales: 1200 },
  { name: 'Product B', Sales: 900 },
  { name: 'Product C', Sales: 1500 },
  { name: 'Product D', Sales: 700 },
  { name: 'Product E', Sales: 1100 },
];

const SalesTypes = ({ data }) => {
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
  const productData = data && data.length > 0 ? data : defaultProductData;

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
        <BarChart 
          data={productData} 
          margin={{ 
            top: 20, 
            right: isMobile ? 10 : 30, 
            left: isMobile ? 0 : 0, 
            bottom: isMobile ? 0 : 0 
          }}
        >
          <defs>
            <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D6A647" stopOpacity={1} />
              <stop offset="100%" stopColor="#b45309" stopOpacity={0.8} />
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
          <Bar 
            dataKey="Sales" 
            fill="url(#salesGradient)"
            radius={[6, 6, 0, 0]} 
            maxBarSize={isMobile ? 30 : 50}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default SalesTypes
