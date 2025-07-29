import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Assets = ({ data }) => {
  const chartData = Array.isArray(data) && data.length > 0 ? data : [];
  const COLORS = {
    assets: '#22c55e',
    liabilities: '#ef4444'
  };

  // Enhanced tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      // Debug logging to help identify tooltip issues
      console.log('🔍 Assets Tooltip Debug:', {
        active,
        label,
        payload: payload.map(p => ({
          name: p.name,
          dataKey: p.dataKey,
          value: p.value,
          payloadData: p.payload
        }))
      });

      return (
        <div className="bg-white/95 backdrop-blur-sm border-0 rounded-xl p-4 shadow-xl">
          <p className="text-gray-800 font-semibold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm flex justify-between gap-4">
              <span style={{ color: entry.color }}>{entry.dataKey || entry.name}:</span>
              <span className="font-bold">R$ {Number(entry.value || entry.payload?.[entry.dataKey] || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
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
          <BarChart 
            data={chartData} 
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            barGap={8}
            barCategoryGap="20%"
          >
            <defs>
              <linearGradient id="assetsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity={1} />
                <stop offset="100%" stopColor="#16a34a" stopOpacity={0.8} />
              </linearGradient>
              <linearGradient id="liabilitiesGrad" x1="0" y1="0" x2="0" y2="1">
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
              dataKey="Assets" 
              stackId="a" 
              fill="url(#assetsGrad)"
              radius={[8, 8, 0, 0]}
              barSize={50}
            />
            <Bar 
              dataKey="Liabilities" 
              stackId="a" 
              fill="url(#liabilitiesGrad)"
              radius={[8, 8, 0, 0]}
              barSize={50}
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-64 text-gray-400">
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <p className="text-sm">No assets/liabilities data available</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Assets
