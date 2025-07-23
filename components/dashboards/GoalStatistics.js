import React, { useState } from 'react';

const MetricChart = ({ 
  data = [], 
  title = "Metric Chart",
  metricLabel = "Value",
  unit = "",
  maxValue = null,
  width = 800,
  height = 400 
}) => {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div style={{ 
        width: '100%', 
        height: `${height + 50}px`, 
        backgroundColor: '#7c3aed', 
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <p style={{ color: 'white', fontSize: '16px' }}>No data to display</p>
      </div>
    );
  }

  // Chart dimensions
  const margin = { top: 40, right: 60, bottom: 60, left: 60 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  // Extract values for scaling
  const dates = data.map(d => new Date(d.date));
  const values = data.map(d => d.value).filter(v => v !== null && v !== undefined);
  
  const minDate = Math.min(...dates.map(d => d.getTime()));
  const maxDate = Math.max(...dates.map(d => d.getTime()));
  const minValue = Math.min(...values);
  const maxValueCalc = maxValue || Math.max(...values) * 1.1;

  // Scales
  const xScale = (date) => ((new Date(date).getTime() - minDate) / (maxDate - minDate)) * chartWidth;
  const yScale = (value) => chartHeight - ((value - minValue) / (maxValueCalc - minValue)) * chartHeight;

  // Generate path for line (only for points with values)
  const validPoints = data.filter(d => d.value !== null && d.value !== undefined);
  const pathData = validPoints.map((point, index) => {
    const x = xScale(point.date);
    const y = yScale(point.value);
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  // Generate tick marks
  const valueRange = maxValueCalc - minValue;
  const tickCount = 5;
  const tickStep = valueRange / (tickCount - 1);
  const yTicks = Array.from({ length: tickCount }, (_, i) => 
    Math.round((minValue + i * tickStep) * 100) / 100
  );

  // X-axis ticks - show start, end, and a few points in between
  const xTicks = [
    new Date(minDate),
    ...data.slice(1, -1).map(d => new Date(d.date)),
    new Date(maxDate)
  ];

  return (
    <div style={{ 
      width: '100%', 
      height: `${height + 50}px`, 
      backgroundColor: '#7c3aed', 
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <h2 style={{ 
        color: 'white', 
        fontSize: '24px', 
        fontWeight: 'bold', 
        margin: '0 0 20px 0' 
      }}>
        {title}
      </h2>
      
      <svg width={width} height={height} style={{ overflow: 'visible' }}>
        {/* Grid lines */}
        {yTicks.map(tick => (
          <line
            key={`y-grid-${tick}`}
            x1={margin.left}
            y1={margin.top + yScale(tick)}
            x2={margin.left + chartWidth}
            y2={margin.top + yScale(tick)}
            stroke="#a855f7"
            strokeWidth="1"
            strokeDasharray="3,3"
          />
        ))}
        
        {xTicks.map(tick => (
          <line
            key={`x-grid-${tick.getTime()}`}
            x1={margin.left + xScale(tick)}
            y1={margin.top}
            x2={margin.left + xScale(tick)}
            y2={margin.top + chartHeight}
            stroke="#a855f7"
            strokeWidth="1"
            strokeDasharray="3,3"
          />
        ))}
        
        {/* Max value reference line (if provided) */}
        {maxValue && (
          <>
            <line
              x1={margin.left}
              y1={margin.top + yScale(maxValue)}
              x2={margin.left + chartWidth}
              y2={margin.top + yScale(maxValue)}
              stroke="#ff4444"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
            <text
              x={margin.left + chartWidth - 5}
              y={margin.top + yScale(maxValue) - 5}
              fill="#ff4444"
              fontSize="12"
              textAnchor="end"
            >
              Max ({maxValue}{unit})
            </text>
          </>
        )}
        
        {/* Main line */}
        {validPoints.length > 1 && (
          <path
            d={pathData}
            fill="none"
            stroke="#60a5fa"
            strokeWidth="3"
            transform={`translate(${margin.left}, ${margin.top})`}
          />
        )}
        
        {/* Data points (squares) */}
        {data.map((point, index) => {
          if (point.value === null || point.value === undefined) return null;
          return (
            <rect
              key={index}
              x={margin.left + xScale(point.date) - 4}
              y={margin.top + yScale(point.value) - 4}
              width="8"
              height="8"
              fill="#2563eb"
              stroke="#60a5fa"
              strokeWidth="2"
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHoveredPoint(index)}
              onMouseLeave={() => setHoveredPoint(null)}
            />
          );
        })}
        
        {/* Y-axis */}
        <line
          x1={margin.left}
          y1={margin.top}
          x2={margin.left}
          y2={margin.top + chartHeight}
          stroke="white"
          strokeWidth="2"
        />
        
        {/* X-axis */}
        <line
          x1={margin.left}
          y1={margin.top + chartHeight}
          x2={margin.left + chartWidth}
          y2={margin.top + chartHeight}
          stroke="white"
          strokeWidth="2"
        />
        
        {/* Y-axis labels */}
        {yTicks.map(tick => (
          <text
            key={`y-label-${tick}`}
            x={margin.left - 10}
            y={margin.top + yScale(tick) + 4}
            fill="white"
            fontSize="12"
            textAnchor="end"
          >
            {tick}
          </text>
        ))}
        
        {/* X-axis labels */}
        {xTicks.map(tick => (
          <text
            key={`x-label-${tick.getTime()}`}
            x={margin.left + xScale(tick)}
            y={margin.top + chartHeight + 20}
            fill="white"
            fontSize="12"
            textAnchor="middle"
          >
            {tick.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </text>
        ))}
        
        {/* Y-axis title */}
        <text
          x={20}
          y={margin.top + chartHeight / 2}
          fill="white"
          fontSize="14"
          textAnchor="middle"
          transform={`rotate(-90, 20, ${margin.top + chartHeight / 2})`}
        >
          {metricLabel} {unit && `(${unit})`}
        </text>
        
        {/* Tooltip */}
        {hoveredPoint !== null && data[hoveredPoint].value !== null && (
          <g>
            <rect
              x={margin.left + xScale(data[hoveredPoint].date) + 10}
              y={margin.top + yScale(data[hoveredPoint].value) - 25}
              width="80"
              height="20"
              fill="rgba(0,0,0,0.8)"
              rx="4"
            />
            <text
              x={margin.left + xScale(data[hoveredPoint].date) + 15}
              y={margin.top + yScale(data[hoveredPoint].value) - 10}
              fill="white"
              fontSize="12"
            >
              {data[hoveredPoint].value}{unit}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};

// Example usage with weight data
const WeightChart = () => {
  const today = new Date();
  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(today.getMonth() - 2);
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(today.getDate() - 14);
  const oneDayAgo = new Date();
  oneDayAgo.setDate(today.getDate() - 1);

  const weightData = [
    { date: twoMonthsAgo, value: 64 },
    { date: twoWeeksAgo, value: 67 },
    { date: oneDayAgo, value: 67.5 },
    { date: today, value: null } // Extends x-axis to today
  ];

  return (
    <MetricChart 
      data={weightData}
      title="Weight Progress"
      metricLabel="Weight"
      unit="kg"
      maxValue={68}
      width={800}
      height={400}
    />
  );
};

export default WeightChart;