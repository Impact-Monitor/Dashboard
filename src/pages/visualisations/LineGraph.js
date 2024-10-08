import React from 'react';
import * as d3 from 'd3';

const LineGraph = ({ data, xAxis, yAxis, strokeColor, strokeWidth }) => {
  React.useEffect(() => {
    if (data.length === 0 || !xAxis || !yAxis) return;

    const svg = d3.select('#line-chart');

    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };

    const xScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => parseFloat(d[xAxis]))])
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => parseFloat(d[yAxis]))])
      .range([height - margin.bottom, margin.top]);

    const line = d3.line()
      .x(d => xScale(parseFloat(d[xAxis])))
      .y(d => yScale(parseFloat(d[yAxis])));

    svg.selectAll('*').remove();

    svg.append('g')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(xScale));

    svg.append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(yScale));

    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', strokeColor)
      .attr('stroke-width', strokeWidth)
      .attr('d', line);
  }, [data, xAxis, yAxis, strokeColor, strokeWidth]);

  return <svg id="line-chart" width="800" height="400"></svg>;
};

export default LineGraph;
