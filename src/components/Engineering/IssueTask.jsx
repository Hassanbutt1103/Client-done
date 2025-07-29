import React, { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts';

// Default data for fallback
const defaultEngineerData = [
  { name: 'Alice', Issues: 5, Tasks: 12 },
  { name: 'Bob', Issues: 2, Tasks: 9 },
  { name: 'Charlie', Issues: 7, Tasks: 15 },
  { name: 'Diana', Issues: 3, Tasks: 10 },
];

const IssueTask = ({ data }) => {
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
  const engineerData = data && data.length > 0 ? data : defaultEngineerData;

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1e293b] border border-gray-600 rounded-lg p-3 shadow-lg">
          <p className="text-white font-semibold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: <span className="font-bold">{entry.value}</span>
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
          data={engineerData} 
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
            dataKey="Issues" 
            fill={BAR_COLORS[0]} 
            radius={[6, 6, 0, 0]} 
            maxBarSize={isMobile ? 30 : 50}
          />
          <Bar 
            dataKey="Tasks" 
            fill={BAR_COLORS[1]} 
            radius={[6, 6, 0, 0]} 
            maxBarSize={isMobile ? 30 : 50}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default IssueTask
