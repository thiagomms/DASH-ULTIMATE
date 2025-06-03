import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { ChartData } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { useTheme } from '../../context/ThemeContext';
import GaugeChart from 'react-gauge-chart';

interface ChartCardProps {
  title: string;
  description?: string;
  chartData: ChartData;
  type?: 'line' | 'bar' | 'pie' | 'doughnut' | 'stacked-bar' | 'gauge';
}

// Componente customizado para o tick do eixo Y
const CustomTick = (props: any) => {
  const { x, y, payload } = props;
  const { theme } = useTheme();
  return (
    <text
      x={x}
      y={y}
      fill={theme === 'dark' ? '#fff' : '#222'}
      fontWeight={700}
      textAnchor="end"
      dy={4}
      fontSize={14}
      style={{ fill: theme === 'dark' ? '#fff' : '#222', color: theme === 'dark' ? '#fff' : '#222', fontWeight: 700 }}
    >
      {payload.value}
    </text>
  );
};

const CustomAxisTick = (props: any) => {
  const { x, y, payload } = props;
  // Forçar verde para os ticks
  return (
    <text
      x={x}
      y={y}
      fill="#10B981"
      fontWeight={700}
      fontSize={14}
      textAnchor="middle"
      dy={16}
      style={{ fill: '#10B981', color: '#10B981', fontWeight: 700 }}
    >
      {payload.value}
    </text>
  );
};

const CustomGreenTick = (props: any) => {
  const { x, y, payload } = props;
  return (
    <text
      x={x}
      y={y}
      fill="#10B981"
      fontWeight={700}
      fontSize={14}
      textAnchor="middle"
      dy={16}
      style={{ fill: '#10B981', color: '#10B981', fontWeight: 700 }}
    >
      {payload.value}
    </text>
  );
};

export const ChartCard: React.FC<ChartCardProps> = ({ 
  title, 
  description, 
  chartData, 
  type = 'line' 
}) => {
  // Detecta se está no dark mode
  const { theme } = useTheme();

  // Para o Recharts, precisamos transformar os dados
  const barData = chartData.labels.map((label, i) => {
    const obj: any = { label };
    chartData.datasets.forEach((ds, idx) => {
      obj[ds.label || `data${idx}`] = ds.data[i];
      obj[`fill${idx}`] = Array.isArray(ds.backgroundColor) ? ds.backgroundColor[i] : ds.backgroundColor;
    });
    return obj;
  });

  // In a real application, we would use a charting library like Chart.js
  // For this demo, we'll just create a simple visual representation

  const maxValue = Math.max(...chartData.datasets.flatMap(dataset => dataset.data));
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>}
      </CardHeader>
      <CardContent>
        {type === 'stacked-bar' ? (
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical" margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" stroke={theme === 'dark' ? '#fff' : '#222'} tick={{ fill: theme === 'dark' ? '#fff' : '#222', fontWeight: 700 }} />
                <YAxis
                  dataKey="label"
                  type="category"
                  stroke={theme === 'dark' ? '#fff' : '#222'}
                  tick={<CustomTick />}
                />
                <Tooltip
                  contentStyle={{ background: theme === 'dark' ? '#222' : '#fff', color: theme === 'dark' ? '#fff' : '#222', border: 'none' }}
                  labelStyle={{ color: theme === 'dark' ? '#fff' : '#222' }}
                  itemStyle={{ color: theme === 'dark' ? '#fff' : '#222' }}
                  cursor={{ fill: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}
                />
                {chartData.datasets[0] && (
                  <Bar
                    dataKey={chartData.datasets[0].label || 'vendasA'}
                    stackId="a"
                    fill="#10B981"
                  />
                )}
                {chartData.datasets[1] && (
                  <Bar
                    dataKey={chartData.datasets[1].label || 'vendasB'}
                    stackId="a"
                    fill="#10B981"
                  />
                )}
              </BarChart>
            </ResponsiveContainer>
                </div>
        ) : type === 'bar' ? (
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="horizontal" margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={<CustomGreenTick />} stroke={theme === 'dark' ? '#fff' : '#222'} />
                <YAxis tick={<CustomGreenTick />} stroke={theme === 'dark' ? '#fff' : '#222'} />
                <Tooltip
                  contentStyle={{ background: theme === 'dark' ? '#222' : '#fff', color: theme === 'dark' ? '#fff' : '#222', border: 'none' }}
                  labelStyle={{ color: theme === 'dark' ? '#fff' : '#222' }}
                  itemStyle={{ color: theme === 'dark' ? '#fff' : '#222' }}
                  cursor={{ fill: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}
                />
                {chartData.datasets.map((ds, idx) => (
                  <Bar
                    key={ds.label || idx}
                    dataKey={ds.label || `data${idx}`}
                    fill="#10B981"
                    radius={[8, 8, 0, 0]}
                  >
                    <LabelList
                      dataKey={ds.label || `data${idx}`}
                      position="top"
                      fill="#10B981"
                      fontWeight={700}
                    />
                  </Bar>
                ))}
              </BarChart>
            </ResponsiveContainer>
            </div>
        ) : type === 'line' ? (
          <div style={{ width: '100%', height: 300 }}>
            {barData.length > 0 && chartData.datasets.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={barData} margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" tick={<CustomGreenTick />} stroke={theme === 'dark' ? '#fff' : '#222'} />
                  <YAxis tick={<CustomGreenTick />} stroke={theme === 'dark' ? '#fff' : '#222'} />
                  <Tooltip
                    contentStyle={{ background: theme === 'dark' ? '#222' : '#fff', color: theme === 'dark' ? '#fff' : '#222', border: 'none' }}
                    labelStyle={{ color: theme === 'dark' ? '#fff' : '#222' }}
                    itemStyle={{ color: theme === 'dark' ? '#fff' : '#222' }}
                    cursor={{ fill: theme === 'dark' ? 'rgba(248, 14, 14, 0.1)' : 'rgba(0,0,0,0.05)' }}
                  />
                  {chartData.datasets.map((ds, idx) => (
                    <Line
                      key={ds.label || idx}
                      type="monotone"
                      dataKey={ds.label || `data${idx}`}
                      stroke={ds.borderColor || (Array.isArray(ds.backgroundColor) ? ds.backgroundColor[0] : ds.backgroundColor) || '#8B5CF6'}
                      strokeWidth={3}
                      dot={{ r: 4, fill: ds.borderColor || (Array.isArray(ds.backgroundColor) ? ds.backgroundColor[0] : ds.backgroundColor) || '#8B5CF6' }}
                      activeDot={{ r: 6 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-gray-400 dark:text-gray-500 py-12">Sem dados para exibir</div>
            )}
          </div>
        ) : (
          <>
        {(type === 'pie' || type === 'doughnut') && (
          <div className="flex items-center">
            <div className="relative w-32 h-32 mx-auto">
              {chartData.datasets[0].data.map((value, index) => {
                const total = chartData.datasets[0].data.reduce((a, b) => a + b, 0);
                const percentage = (value / total) * 100;
                
                // Calculate a simple visual for the pie slices (this is a simplified representation)
                const startPercentage = chartData.datasets[0].data
                  .slice(0, index)
                  .reduce((acc, curr) => acc + (curr / total) * 100, 0);
                
                return (
                  <div 
                    key={index}
                    className="absolute inset-0 w-full h-full"
                    style={{
                      background: `conic-gradient(transparent ${startPercentage}%, ${chartData.datasets[0].backgroundColor?.[index] || '#8B5CF6'} ${startPercentage}%, ${chartData.datasets[0].backgroundColor?.[index] || '#8B5CF6'} ${startPercentage + percentage}%, transparent ${startPercentage + percentage}%)`,
                      borderRadius: '50%',
                    }}
                  />
                );
              })}
              {type === 'doughnut' && (
                    <div
                      className="absolute inset-0 w-full h-full m-auto rounded-full"
                      style={{
                        width: '60%',
                        height: '60%',
                        background: 'transparent'
                      }}
                    />
              )}
            </div>
            
            <div className="ml-6 space-y-2">
              {chartData.labels.map((label, index) => (
                <div key={index} className="flex items-center">
                  <span 
                    className="h-3 w-3 rounded-full mr-2" 
                    style={{ backgroundColor: chartData.datasets[0].backgroundColor?.[index] || '#8B5CF6' }} 
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label} - {chartData.datasets[0].data[index]}
                  </span>
                </div>
              ))}
            </div>
          </div>
            )}
            {type === 'gauge' && (
              <div className="flex items-center justify-center">
                <GaugeChart
                  id="nps-gauge"
                  nrOfLevels={3}
                  colors={['#EF4444', '#F59E0B', '#10B981']}
                  arcWidth={0.3}
                  percent={chartData.datasets[0].data[0] / 100}
                  textColor="#111"
                  formatTextValue={value => `${value}`}
                />
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};