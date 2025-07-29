import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const RavinueExxpense = ({ data }) => {
  const chartData = Array.isArray(data) && data.length > 0 ? data : [];
  const COLORS = {
    revenue: '#22c55e',
    expenses: '#ef4444',
    profit: '#3b82f6'
  };

  // Enhanced tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm border-0 rounded-xl p-4 shadow-xl">
          <p className="text-gray-800 font-semibold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm flex justify-between gap-4">
              <span style={{ color: entry.color }}>{entry.name || entry.dataKey}:</span>
              <span className="font-bold">R$ {Number(entry.value || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
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
        <ResponsiveContainer width="100%" height={380}>
          <BarChart 
            data={chartData} 
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            barGap={3}
            barCategoryGap={35}
            maxBarSize={150}
          >
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity={1} />
                <stop offset="100%" stopColor="#16a34a" stopOpacity={0.8} />
              </linearGradient>
              <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={1} />
                <stop offset="100%" stopColor="#dc2626" stopOpacity={0.8} />
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="rgba(148, 163, 184, 0.3)" 
              vertical={false}
            />
            <XAxis 
              dataKey="name" 
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ 
                color: '#374151',
                fontSize: '12px',
                fontWeight: '500'
              }}
            />
            <Bar 
              dataKey="Revenue" 
              fill="url(#revenueGrad)"
              radius={[8, 8, 0, 0]}
              barSize={75}
              name="Revenue"
            />
            <Bar 
              dataKey="Expenses" 
              fill="url(#expenseGrad)"
              radius={[8, 8, 0, 0]}
              barSize={75}
              name="Expenses"
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-64 text-gray-400">
          <div className="text-center">
            <div className="text-4xl mb-2">💰</div>
            <p className="text-sm">No revenue/expense data available</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default RavinueExxpense
