import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const System = ({ value }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const gaugeData = [
    { name: 'Uptime', value },
    { name: 'Down', value: 100 - value },
  ];

  const COLORS = ['#10b981', '#f43f5e']; // Green uptime, Red down

  return (
    <div className="flex flex-col items-center justify-center relative w-full" style={{ height: isMobile ? '160px' : '200px' }}>
      {/* Chart */}
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={gaugeData}
            startAngle={180}
            endAngle={0}
            innerRadius={isMobile ? 50 : 70}
            outerRadius={isMobile ? 70 : 100}
            dataKey="value"
            stroke="none"
          >
            {gaugeData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Center Value */}
      <div 
        className="absolute font-extrabold text-green-400"
        style={{ 
          top: isMobile ? '50px' : '70px',
          fontSize: isMobile ? '20px' : '30px'
        }}
      >
        {value}%
      </div>
    </div>
  );
};

export default System;
