import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
// import csvData from './../../assets/images/misc/Dataset.csv'; // Sample CSV data
import csvData from './../../assets/images/misc/Dataset2.csv';
// import csvData from './../../assets/images/misc/iris.csv';

const GraphComponent = () => {
  const [data, setData] = useState([]);
  const [xAxis, setXAxis] = useState('');
  const [yAxis, setYAxis] = useState('');
  const [groupVariable, setGroupVariable] = useState('');
  const [graphType, setGraphType] = useState('line'); // Default graph type is line plot
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const [lineStrokeColor, setLineStrokeColor] = useState('steelblue');
  const [lineStrokeWidth, setLineStrokeWidth] = useState(2);
  const [circleFillColor, setCircleFillColor] = useState('steelblue');
  const [circleStrokeColor, setCircleStrokeColor] = useState('black');
  const [circleStrokeWidth, setCircleStrokeWidth] = useState(1);

  // Event handler for changing line stroke color
  const handleLineStrokeColorChange = (color) => {
    setLineStrokeColor(color);
  };

  // Event handler for changing line stroke width
  const handleLineStrokeWidthChange = (width) => {
    setLineStrokeWidth(width);
  };

  // Event handler for changing circle fill color
  const handleCircleFillColorChange = (color) => {
    setCircleFillColor(color);
  };

  // Event handler for changing circle stroke color
  const handleCircleStrokeColorChange = (color) => {
    setCircleStrokeColor(color);
  };

  // Event handler for changing circle stroke width
  const handleCircleStrokeWidthChange = (width) => {
    setCircleStrokeWidth(width);
  };

  useEffect(() => {
    d3.csv(csvData).then(csvData => {
      setData(csvData);
      setButtonDisabled(false); // Enable button when data is loaded
    });
  }, []);

  const plotGraph = () => {
    // Check if xAxis, yAxis, and groupVariable are defined
    const isXAxisDefined = Boolean(xAxis);
    const isYAxisDefined = Boolean(yAxis);
    const isGroupVariableDefined = Boolean(groupVariable);
    if (!isXAxisDefined || !isYAxisDefined || !isGroupVariableDefined) return;


    // Clear previous graph
    d3.select('#chart-svg').selectAll('*').remove();
  
    // Select SVG element
    const svg = d3.select('#chart-svg');
  
    // Define width and height of the SVG element
    const width = 800;
    const height = 400;
    
    // Define margin
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
  
    // Create scales for X and Y axes
    const xScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => parseFloat(d[xAxis]))])
      .range([margin.left, width - margin.right]);
  
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => parseFloat(d[yAxis]))])
      .range([height - margin.bottom, margin.top]);
  
    // Create X and Y axes
    const xAxisScale = d3.axisBottom(xScale);
    const yAxisScale = d3.axisLeft(yScale);
  
    // Append X axis
    svg.append('g')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(xAxisScale);
  
    // Append Y axis
    svg.append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(yAxisScale);
  
    // Plot graph based on selected graph type
    // (Remaining code remains unchanged)
    if (graphType === 'line') {
      const line = d3.line()
        .x(d => xScale(parseFloat(d[xAxis])))
        .y(d => yScale(parseFloat(d[yAxis])));
    
    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', lineStrokeColor) // Use line stroke color set by user
      .attr('stroke-width', lineStrokeWidth) // Use line stroke width set by user
      .attr('d', line);
    }
    else if (graphType === 'scatter') {
      svg.selectAll('circle')
        .data(data)
        .enter().append('circle')
        .attr('cx', d => xScale(parseFloat(d[xAxis])))
        .attr('cy', d => yScale(parseFloat(d[yAxis])))
        .attr('r', 4)
        .attr('fill', circleFillColor) // Use circle fill color set by user
        .attr('stroke', circleStrokeColor) // Use circle stroke color set by user
        .attr('stroke-width', circleStrokeWidth); // Use circle stroke width set by user
    }
    else if (graphType === 'performance-map') {
      // Plot performance map
      // Group the data by a third parameter (e.g., Mach number)
      const groupedData = d3.group(data, d => d[groupVariable]);
  
      // Define color scale for different groups
      const colorScale = d3.scaleOrdinal()
        .domain(groupedData.keys())
        .range(d3.schemeCategory10);
  
      // Define line generator
      const line = d3.line()
        .x(d => xScale(parseFloat(d[xAxis])))
        .y(d => yScale(parseFloat(d[yAxis])))
        .curve(d3.curveMonotoneX); // Optional: specify curve type
  
      // Plot lines for each group
      groupedData.forEach((groupData, groupKey) => {
        svg.append('path')
          .datum(groupData)
          .attr('fill', 'none')
          .attr('stroke', colorScale(groupKey))
          .attr('stroke-width', 2)
          .attr('d', line);
      });
  
      // Optional: Add legend for different groups
      const legend = svg.append('g')
        .attr('transform', `translate(${width - 100}, 20)`);
      
      legend.selectAll('rect')
        .data(groupedData.keys())
        .enter().append('rect')
        .attr('x', 0)
        .attr('y', (d, i) => i * 20)
        .attr('width', 10)
        .attr('height', 10)
        .attr('fill', colorScale);
      
      legend.selectAll('text')
        .data(groupedData.keys())
        .enter().append('text')
        .attr('x', 15)
        .attr('y', (d, i) => i * 20 + 10)
        .text(d => d)
        .attr('alignment-baseline', 'middle');
    }
    
    
  };
  
  return (
    <div>
      <div>
        <label>X-axis:</label>
        <select value={xAxis} onChange={e => setXAxis(e.target.value)}>
          {data.length > 0 && Object.keys(data[0]).map(key => <option key={key}>{key}</option>)}
        </select>
      </div>
      <div>
        <label>Y-axis:</label>
        <select value={yAxis} onChange={e => setYAxis(e.target.value)}>
          {data.length > 0 && Object.keys(data[0]).map(key => <option key={key}>{key}</option>)}
        </select>
      </div>
      <div>
        <label>Group by:</label>
        <select value={groupVariable} onChange={e => setGroupVariable(e.target.value)}>
          {data.length > 0 && Object.keys(data[0]).map(key => <option key={key}>{key}</option>)}
        </select>
      </div>
      <div>
        <label>Graph Type:</label>
        <select value={graphType} onChange={e => setGraphType(e.target.value)}>
          <option value="line">Line Plot</option>
          <option value="scatter">Scatter Plot</option>
          <option value="performance-map">Performance Map</option>
          <option value="pie">Pie Chart</option>
          <option value="aggregation">Aggregation Plot</option>
        </select>
      </div>

      <div>
        <label>Line Stroke Color:</label>
        <select value={lineStrokeColor} onChange={e => handleLineStrokeColorChange(e.target.value)}>
          <option value="steelblue">Steel Blue</option>
          <option value="red">Red</option>
          {/* Add more color options as needed */}
        </select>
      </div>
      <div>
        <label>Line Stroke Width:</label>
        <select value={lineStrokeWidth} onChange={e => handleLineStrokeWidthChange(parseInt(e.target.value))}>
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          {/* Add more width options as needed */}
        </select>
      </div>
      <div>
        <label>Circle Fill Color:</label>
        <select value={circleFillColor} onChange={e => handleCircleFillColorChange(e.target.value)}>
          <option value="steelblue">Steel Blue</option>
          <option value="red">Red</option>
          {/* Add more color options as needed */}
        </select>
      </div>
      <div>
        <label>Circle Stroke Color:</label>
        <select value={circleStrokeColor} onChange={e => handleCircleStrokeColorChange(e.target.value)}>
          <option value="black">Black</option>
          <option value="gray">Gray</option>
          {/* Add more color options as needed */}
        </select>
      </div>
      <div>
        <label>Circle Stroke Width:</label>
        <select value={circleStrokeWidth} onChange={e => handleCircleStrokeWidthChange(parseInt(e.target.value))}>
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          {/* Add more width options as needed */}
        </select>
      </div>

      {!buttonDisabled && <button onClick={plotGraph}>Plot Graph</button>}
  
      {/* SVG element where the chart will be rendered */}
      <svg id="chart-svg" width="800" height="400"></svg>
    </div>
  );
  
};

export default GraphComponent;
