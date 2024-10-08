import React from 'react';
import * as d3 from 'd3';

const ScatterPlot = ({ data, xAxis, yAxis, fillColor, strokeColor, strokeWidth }) => {
  React.useEffect(() => {
    if (data.length === 0 || !xAxis || !yAxis) return;

    const svg = d3.select('#scatter-plot');

    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };

    const xScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => parseFloat(d[xAxis]))])
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => parseFloat(d[yAxis]))])
      .range([height - margin.bottom, margin.top]);

    svg.selectAll('*').remove();

    svg.selectAll('circle')
      .data(data)
      .enter().append('circle')
      .attr('cx', d => xScale(parseFloat(d[xAxis])))
      .attr('cy', d => yScale(parseFloat(d[yAxis])))
      .attr('r', 4)
      .attr('fill', fillColor)
      .attr('stroke', strokeColor)
      .attr('stroke-width', strokeWidth);
  }, [data, xAxis, yAxis, fillColor, strokeColor, strokeWidth]);

  return <svg id="scatter-plot" width="800" height="400"></svg>;
};

export default ScatterPlot;
