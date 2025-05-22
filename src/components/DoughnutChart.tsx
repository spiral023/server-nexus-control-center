
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface DoughnutChartProps {
  data: { name: string; value: number }[];
  colors?: string[];
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({ 
  data,
  colors = ['#3b82f6', '#ef4444'] 
}) => {
  return (
    <div style={{ width: '100%', height: 150 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={60}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value}`, 'Anzahl']} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DoughnutChart;
