import React from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const CashFlow = ({ data }) => {
  const chartData = Array.isArray(data) && data.length > 0 ? data : [];
  const COLORS = {
    cashFlow: '#06b6d4',
    positive: '#10b981',
    negative: '#ef4444'
  };

  // Enhanced tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1e293b] border border-gray-600 rounded-lg p-3 shadow-lg">
          <p className="text-white font-semibold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              Cash Flow: <span className="font-bold">R$ {Number(entry.value).toLocaleString()}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full">
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart 
            data={chartData} 
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <defs>
              <linearGradient id="colorCashFlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.cashFlow} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={COLORS.cashFlow} stopOpacity={0.1}/>
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
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ 
                color: '#e2e8f0',
                fontSize: '12px',
                fontWeight: '500'
              }}
              formatter={(value) => (
                <span style={{ color: '#e2e8f0' }}>{value}</span>
              )}
            />
            <Area 
              type="monotone" 
              dataKey="CashFlow" 
              stroke={COLORS.cashFlow}
              strokeWidth={3}
              fill="url(#colorCashFlow)"
              dot={{
                r: 6,
                fill: COLORS.cashFlow,
                stroke: '#ffffff',
                strokeWidth: 2
              }}
              activeDot={{
                r: 8,
                fill: COLORS.cashFlow,
                stroke: '#ffffff',
                strokeWidth: 3
              }}
              name="Cash Flow"
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-64 text-gray-400">
          <div className="text-center">
            <div className="text-4xl mb-2">💸</div>
            <p className="text-sm">No cash flow data available</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default CashFlow
