import React from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MonthlyTrend = ({ data }) => {
  const chartData = Array.isArray(data) && data.length > 0 ? data : [];
  const COLORS = {
    profit: '#D6A647',
    revenue: '#10b981',
    expenses: '#ef4444'
  };

  // Enhanced tooltip component with better positioning
  const CustomTooltip = ({ active, payload, label, coordinate }) => {
    if (active && payload && payload.length && coordinate) {
      return (
        <div 
          className="bg-[#1e293b] border border-[#D6A647] rounded-lg p-3 shadow-xl z-50"
          style={{
            position: 'absolute',
            transform: 'translate(-50%, -100%)',
            marginTop: '-10px'
          }}
        >
          <p className="text-white font-semibold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              <span>{entry.name || entry.dataKey}:</span>
              <span className="font-bold ml-2">R$ {Number(entry.value || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
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
              <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.profit} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={COLORS.profit} stopOpacity={0.1}/>
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
            <Tooltip 
              content={<CustomTooltip />}
              cursor={false}
              animationDuration={100}
              allowEscapeViewBox={{ x: false, y: true }}
              isAnimationActive={false}
            />
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
              dataKey="Profit"
              stroke={COLORS.profit}
              strokeWidth={3}
              fill="url(#colorProfit)"
              dot={{
                r: 8,
                fill: COLORS.profit,
                stroke: '#ffffff',
                strokeWidth: 2,
                cursor: 'pointer',
                style: { pointerEvents: 'all' }
              }}
              activeDot={{
                r: 10,
                fill: COLORS.profit,
                stroke: '#ffffff',
                strokeWidth: 3,
                cursor: 'pointer',
                style: {
                  filter: 'drop-shadow(0 4px 12px rgba(214, 166, 71, 0.6))',
                  transition: 'all 0.2s ease',
                  pointerEvents: 'all'
                }
              }}
              connectNulls={false}
              name="Profit"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-64 text-gray-400">
          <div className="text-center">
            <div className="text-4xl mb-2">📈</div>
            <p className="text-sm">No financial trend data available</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default MonthlyTrend
