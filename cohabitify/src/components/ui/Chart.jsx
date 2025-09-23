import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Chart = ({
  data,
  type = 'line',
  xKey,
  yKey,
  title,
  height = 300,
  colors = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--success))']
}) => {
  const renderChart = () => {
    if (type === 'bar') {
      return (
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          {Array.isArray(yKey) ? (
            yKey.map((key, index) => (
              <Bar 
                key={key} 
                dataKey={key} 
                fill={colors[index % colors.length]} 
              />
            ))
          ) : (
            <Bar dataKey={yKey} fill={colors[0]} />
          )}
        </BarChart>
      );
    }

    return (
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} />
        <YAxis />
        <Tooltip />
        {Array.isArray(yKey) ? (
          yKey.map((key, index) => (
            <Line 
              key={key} 
              type="monotone" 
              dataKey={key} 
              stroke={colors[index % colors.length]} 
              strokeWidth={2}
            />
          ))
        ) : (
          <Line 
            type="monotone" 
            dataKey={yKey} 
            stroke={colors[0]} 
            strokeWidth={2}
          />
        )}
      </LineChart>
    );
  };

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
