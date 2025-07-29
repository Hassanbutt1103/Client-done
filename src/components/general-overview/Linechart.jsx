import React, { useState, useEffect } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, ReferenceLine, Area, AreaChart } from "recharts";

const COLORS = {
  primary: '#3b82f6',
  secondary: '#10b981', 
  accent: '#f59e0b',
  danger: '#ef4444',
  purple: '#8b5cf6',
  cyan: '#06b6d4',
  pink: '#ec4899',
  indigo: '#6366f1'
};

const Linechart = ({ data, totalUsers }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Only use real data from MongoDB
  const chartData = Array.isArray(data) && data.length > 0 ? data : [];
  const currentTotal = typeof totalUsers === 'number' ? totalUsers : (chartData.length > 0 ? chartData[chartData.length - 1].users : 0);

  // Enhanced tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1e293b] border border-gray-600 rounded-lg p-3 shadow-lg">
          <p className="text-white font-semibold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color || COLORS.primary }}>
              {entry.name}: <span className="font-bold">{entry.value}</span> users
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full min-h-[280px] max-h-[500px]">
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart 
            data={chartData} 
            margin={{ 
              top: 20, 
              right: isMobile ? 10 : 30, 
              left: isMobile ? 10 : 20, 
              bottom: 20 
            }}
          >
            <defs>
              <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#334155" 
              opacity={0.3}
            />
            
            <XAxis 
              dataKey="name" 
              stroke="#94a3b8"
              fontSize={isMobile ? 10 : 12}
              tickLine={false}
              axisLine={false}
              interval={isMobile ? 'preserveStartEnd' : 0}
            />
            
            <YAxis 
              stroke="#94a3b8"
              fontSize={isMobile ? 10 : 12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
              width={isMobile ? 40 : 60}
            />
            
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ 
                stroke: COLORS.primary, 
                strokeWidth: 2,
                strokeDasharray: "5 5"
              }}
            />
            
            <Legend 
              wrapperStyle={{ 
                color: '#e2e8f0',
                fontSize: isMobile ? '10px' : '12px',
                fontWeight: '500'
              }}
              formatter={(value) => (
                <span style={{ color: '#e2e8f0' }}>{value}</span>
              )}
            />
            
            {/* Area Chart for better visual appeal */}
            <Area
              type="monotone"
              dataKey="users"
              stroke={COLORS.primary}
              strokeWidth={isMobile ? 2 : 3}
              fill="url(#colorUsers)"
              name="Cumulative Users"
              dot={{
                r: isMobile ? 4 : 6,
                fill: COLORS.primary,
                stroke: '#ffffff',
                strokeWidth: 2
              }}
              activeDot={{
                r: isMobile ? 6 : 8,
                fill: COLORS.accent,
                stroke: '#ffffff',
                strokeWidth: 3
              }}
            />
            
            {/* Reference line for current total */}
            {currentTotal > 0 && (
              <ReferenceLine 
                y={currentTotal} 
                stroke={COLORS.danger} 
                strokeDasharray="6 3"
                strokeWidth={2}
                label={{ 
                  value: `Current Total: ${currentTotal}`, 
                  position: 'left', 
                  fill: COLORS.danger, 
                  fontWeight: 600, 
                  fontSize: isMobile ? 10 : 12
                }} 
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-64 md:h-80 text-gray-400">
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <p className="text-sm">No data available for the selected period</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Linechart;
