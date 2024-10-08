import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const PerformanceMap = ({ data, xAxis, yAxis, groupVariable, strokeColor, strokeWidth }) => {
  // const svgRef = useRef(null);

  React.useEffect(() => {
    if (!data || data.length === 0 || !xAxis || !yAxis) return;
    console.log(data)

    // const svg = d3.select(svgRef.current);
    const svg = d3.select('#performance-plot');
    svg.selectAll('*').remove();

    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };

    // Get the unique values for the x and y axes from the filtered data
    const xValues = data.map(d => parseFloat(d[xAxis]));
    const yValues = data.map(d => parseFloat(d[yAxis]));

    const xMin = d3.min(xValues);
    const xMax = d3.max(xValues);
    const yMin = d3.min(yValues);
    const yMax = d3.max(yValues);

    const xScale = d3.scaleLinear()
      .domain([xMin, xMax])
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([yMin, yMax])
      .range([height - margin.bottom, margin.top]);

    // const xScale = d3.scaleLinear()
    //   .domain([0, d3.max(data, d => parseFloat(d[xAxis]))])
    //   .range([margin.left, width - margin.right]);

    // const yScale = d3.scaleLinear()
    //   .domain([0, d3.max(data, d => parseFloat(d[yAxis]))])
    //   .range([height - margin.bottom, margin.top]);

    
    // const groupedData = d3.group(data, d => d.group);
    // Group the data by a third parameter (e.g., Mach number)
    const groupedData = d3.group(data, d => d[groupVariable]);

    // svg.selectAll('*').remove();

    svg.append('g')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(xScale));

    svg.append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(yScale));

    // Define color scale for different groups
    const colorScale = d3.scaleOrdinal()
    .domain(groupedData.keys())
    .range(d3.schemeCategory10);

    const line = d3.line()
      .x(d => xScale(parseFloat(d[xAxis])))
      .y(d => yScale(parseFloat(d[yAxis])))
      .curve(d3.curveMonotoneX);


    groupedData.forEach((groupData, groupKey) => {
      svg.append('path')
        .datum(groupData)
        .attr('fill', 'none')
        .attr('stroke', colorScale(groupKey))
        .attr('stroke-width', 2)
        .attr('d', line);
    });

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

    // Add labels for the axes
    svg.append('text')
      // .attr('transform', `translate(${width / 2}, ${height - margin.bottom / 2})`)
      .attr('transform', `translate(${width / 2}, ${height})`)
      .style('text-anchor', 'middle')
      .text(xAxis);

    svg.append('text')
      // .attr('transform', `translate(${margin.left / 2}, ${height / 2}) rotate(-90)`)
      .attr('transform', `translate(${margin.left / 5}, ${height / 2}) rotate(-90)`)
      .style('text-anchor', 'middle')
      .text(yAxis);

  });

  return (
    <svg id="performance-plot" width="800" height="400"></svg>
  );
};

export default PerformanceMap;
