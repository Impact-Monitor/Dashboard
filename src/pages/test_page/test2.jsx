import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
import { Button, Modal, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import csvData from './../../assets/images/misc/dragpolar_1.csv';

function Graph() {
  const [open, setOpen] = useState(false);
  const [xColumn, setXColumn] = useState('CL');
  const [yColumn, setYColumn] = useState('LOD');
  const [groupColumn, setGroupColumn] = useState('');
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    // Fetch CSV data from local server
    d3.csv(csvData).then((csvData) => {
      setData(csvData);
      setColumns(Object.keys(csvData[0])); // Get column names from data
    }).catch(error => {
      console.error('Error loading CSV file:', error);
    });
  }, []);

  const handleModalOpen = () => {
    setOpen(true);
  };

  const handleModalClose = () => {
    setOpen(false);
  };

  const drawGraph = () => {
    // Clear previous graph
    d3.select('#graph-container').select('svg').remove();

    // Set up SVG container
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select('#graph-container')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Group data by groupColumn
    const groupedData = d3.group(data, d => d[groupColumn]);

    // Define color scale for lines
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Define scales
    const xScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => +d[xColumn])])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => +d[yColumn])])
      .range([height, 0]);

    // Define line generator
    const line = d3.line()
      .x(d => xScale(+d[xColumn]))
      .y(d => yScale(+d[yColumn]));

    // Draw lines for each group
    groupedData.forEach((groupData, groupName) => {
      svg.append('path')
        .datum(groupData)
        .attr('fill', 'none')
        .attr('stroke', color(groupName))
        .attr('stroke-width', 2)
        .attr('d', line);
    });

    // Draw axes
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale));

    svg.append('g')
      .call(d3.axisLeft(yScale));
  };

  const handleGraphUpdate = () => {
    setOpen(false);
    drawGraph();
  };

  useEffect(() => {
    if (data.length > 0) {
      setXColumn(columns[0]); // Set default x column
      setYColumn(columns[1]); // Set default y column
      setGroupColumn(columns[2]); // Set default group column
      drawGraph(); // Draw graph when data is loaded
    }
  }, [data]); // Redraw graph when data changes

  return (
    <div>
      <div id="graph-container" />
      <Button variant="contained" onClick={handleModalOpen}>Edit</Button>
      <Modal
        open={open}
        onClose={handleModalClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px' }}>
          <h2 id="modal-title">Edit Graph</h2>
          <FormControl fullWidth>
            <InputLabel id="x-column-label">X Column</InputLabel>
            <Select
              labelId="x-column-label"
              value={xColumn}
              onChange={e => setXColumn(e.target.value)}
            >
              {columns.map(column => (
                <MenuItem key={column} value={column}>{column}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="y-column-label">Y Column</InputLabel>
            <Select
              labelId="y-column-label"
              value={yColumn}
              onChange={e => setYColumn(e.target.value)}
            >
              {columns.map(column => (
                <MenuItem key={column} value={column}>{column}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="group-column-label">Group Column</InputLabel>
            <Select
              labelId="group-column-label"
              value={groupColumn}
              onChange={e => setGroupColumn(e.target.value)}
            >
              {columns.map(column => (
                <MenuItem key={column} value={column}>{column}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" onClick={handleGraphUpdate}>Update</Button>
        </div>
      </Modal>
    </div>
  );
}

export default Graph;
