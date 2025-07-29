import React, { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts';

// Default data for fallback
const defaultProgressData = [
  { name: 'Week 1', Progress: 10 },
  { name: 'Week 2', Progress: 25 },
  { name: 'Week 3', Progress: 40 },
  { name: 'Week 4', Progress: 55 },
  { name: 'Week 5', Progress: 70 },
  { name: 'Week 6', Progress: 85 },
  { name: 'Week 7', Progress: 100 },
];

const Progress = ({ data }) => {      
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
  const GAUGE_COLORS = [COLORS[1], COLORS[3]];
  const BAR_COLORS = [COLORS[0], COLORS[2]];

  // Use provided data or fallback to default
  const progressData = data && data.length > 0 ? data : defaultProgressData;

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1e293b] border border-gray-600 rounded-lg p-3 shadow-lg">
          <p className="text-white font-semibold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: <span className="font-bold">{entry.value}%</span>
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
          data={progressData} 
          margin={{ 
            top: 20, 
            right: isMobile ? 10 : 30, 
            left: isMobile ? 0 : 0, 
            bottom: isMobile ? 0 : 0 
          }}
        >
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
            domain={[0, 100]} 
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
            dataKey="Progress" 
            stroke={COLORS[0]} 
            strokeWidth={isMobile ? 2 : 3} 
            dot={{ 
              r: isMobile ? 3 : 5, 
              fill: COLORS[1] 
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

export default Progress
