
import { ResponsiveContainer, LineChart, Line, Tooltip } from "recharts";

interface SparklineChartProps {
  data: number[];
  color?: string;
  height?: number;
  showTooltip?: boolean;
  label?: string;
}

const SparklineChart = ({
  data,
  color = "#3b82f6",
  height = 40,
  showTooltip = true,
  label = "CPU Last"
}: SparklineChartProps) => {
  
  // Format data for chart
  const chartData = data.map((value, index) => ({
    time: index,
    value,
  }));
  
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          {showTooltip && (
            <Tooltip
              formatter={(value) => [`${value}%`, label]}
              labelFormatter={(label) => `${24 - parseInt(label)}h`}
            />
          )}
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SparklineChart;
