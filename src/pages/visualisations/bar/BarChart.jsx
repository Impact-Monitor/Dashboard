import React, { useRef, useEffect, forwardRef } from "react";
import * as d3 from "d3";

import useDimensions from "../useDimensions";

// Example hardcoded data
const csvData = [
  { group: "group 1", category: "A", variable: "V1", value: 61.0158803 },
  { group: "group 1", category: "A", variable: "V2", value: 25.903359 },
  { group: "group 1", category: "A", variable: "V3", value: 13.08076071 },
  { group: "group 1", category: "B", variable: "V1", value: 71.27703826 },
  { group: "group 1", category: "B", variable: "V2", value: 21.0180133 },
  { group: "group 1", category: "B", variable: "V3", value: 7.70494844 },
  { group: "group 2", category: "A", variable: "V1", value: 61.0158803 },
  { group: "group 2", category: "A", variable: "V2", value: 25.903359 },
  { group: "group 2", category: "A", variable: "V3", value: 13.08076071 },
  { group: "group 2", category: "B", variable: "V1", value: 71.27703826 },
  { group: "group 2", category: "B", variable: "V2", value: 21.0180133 },
  { group: "group 2", category: "B", variable: "V3", value: 7.70494844 }
];

const DIMENSIONS = {
  marginTop: 30,
  marginRight: 30,
  marginBottom: 100,
  marginLeft: 60,
  innerPadding: 10
};

export const BarChart = forwardRef((props, ref) => {
  const svgRef = useRef();
  const gXAxisRef = useRef();
  const gYAxisRef = useRef();
  const rectRef = useRef();
  const { data = csvData } = props; // Use hardcoded data if no data is passed


  const [wrapperRef, dimensions] = useDimensions();
  const updatedDimensions = {
    ...DIMENSIONS,
    ...dimensions,
    boundedHeight: Math.max(
      dimensions.height - DIMENSIONS.marginTop - DIMENSIONS.marginBottom,
      0
    ),
    boundedWidth: Math.max(
      dimensions.width - DIMENSIONS.marginLeft - DIMENSIONS.marginRight,
      0
    )
  };
  const { boundedHeight, boundedWidth, innerPadding } = updatedDimensions;


  const TrafumaDataProcessing = () => {
    const xmlString = props.parentRef.getCpacsData();
    const doc = new DOMParser().parseFromString(xmlString, 'text/xml');


    const path = "cpacs/studies/airTransportSystem/aviationFuelPolicies/environmentalImpacts"
    const tags = path.split('/');  // Split the path into an array of tags
    let currentElement = doc;
    for (let i = 0; i < tags.length; i++) {
      const elements = currentElement.getElementsByTagName(tags[i]);
      if (elements.length > 0) {
        currentElement = elements[0];  // Move to the next nested element
      }
      else {
        return null;  // If any part of the path is not found, return null
      }
    }

    const elementResults = currentElement.getElementsByTagName('results')
    const elementResultsChildElements = elementResults[0].childNodes;
    let childNames = [];
    for (let i = 0; i < elementResultsChildElements.length; i++) {
      childNames.push(elementResultsChildElements[i].tagName)
    }

    // Loop through the child elements and log their tag names and text content
    for (let i = 0; i < elementResultsChildElements.length; i++) {
      console.log(`Tag: ${elementResultsChildElements[i].tagName}, Content: ${elementResultsChildElements[i].textContent}`);
    }

    let allResultsData = []
    for (let i = 0; i < elementResults.length; i++) {
      let columns = [];
      let maxEntries = 0;
      for (let j = 0; j < childNames.length; j++) {
        let bbb = elementResults[i].getElementsByTagName(childNames[j])[0].textContent.split(';')
        columns.push(bbb);
        if (maxEntries < bbb.length)
          maxEntries = bbb.length;
      }
      // fill the missing elements
      columns.forEach(function (column, index) {
        if (column.length == 1)
          for (let k = 1; k < maxEntries; k++)
            column.push(column[0]);
      });

      let currentResultsData = [];
      for (let j = 0; j < maxEntries; j++) {
        let currentResultsRow = [];
        for (let k = 0; k < columns.length; k++) {
          currentResultsRow.push(columns[k][k]);
        }
        currentResultsData.push(currentResultsRow);
      }
      allResultsData.push(currentResultsData);
    }

    // create "combined results data"
    let combinedResultsData = [];
    for (let i = 0; i < allResultsData.length; i++) {
      for (let j = 0; j < allResultsData[i].length; j++) {
        combinedResultsData.push(allResultsData[i][j]);
      }
    }
  }

  const drawChart = () => {
    const svg = d3.select(svgRef.current);



    // Clear previous elements
    svg.selectAll("*").remove();

    // Define scales
    const x0 = d3
      .scaleBand()
      .domain([...new Set(data.map(d => d.group))])
      .range([DIMENSIONS.marginLeft, boundedWidth])
      .padding(0.1);

    const x1 = d3
      .scaleBand()
      .domain([...new Set(data.map(d => d.category))])
      .range([0, x0.bandwidth()])
      .padding(0.05);

    const x2 = d3
      .scaleBand()
      .domain([...new Set(data.map(d => d.variable))])
      .range([0, x1.bandwidth()])
      .padding(0.05);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.value)])
      .nice()
      .range([boundedHeight, DIMENSIONS.marginTop]);

    const color = d3.scaleOrdinal()
      .domain([...new Set(data.map(d => d.variable))])
      .range(d3.schemeCategory10);

    // Process data using d3.rollup
    const groupedData = d3.rollup(
      data,
      v => d3.rollup(
        v,
        v => v.map(d => ({ key: d.variable, value: d.value })),
        d => d.category
      ),
      d => d.group
    );

    // Extract groups, categories, and variables from the grouped data
    const groups = Array.from(groupedData.keys());
    const categories = Array.from(new Set(data.map(d => d.category)));
    const variables = Array.from(new Set(data.map(d => d.variable)));

    // Update scales domains
    x0.domain(groups);
    x1.domain(categories).range([0, x0.bandwidth()]);
    x2.domain(variables).range([0, x1.bandwidth()]);
    y.domain([0, d3.max(data, d => d.value)]);

    // Draw bars
    svg.append("g")
      .selectAll("g")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", d => x0(d.group) + x1(d.category) + x2(d.variable))
      .attr("y", d => y(d.value))
      .attr("width", x2.bandwidth())
      .attr("height", d => boundedHeight - y(d.value))
      .attr("fill", d => color(d.variable));

    // svg.append("g")
    //   .selectAll("g")
    //   .data(groups)
    //   .enter()
    //   .append("g")
    //   .attr("transform", d => `translate(${x0(d.group)},0)`)
    //   .selectAll("g")
    //   .data(d => Array.from(groupedData.get(d).values()))
    //   .enter()
    //   .append("g")
    //   .attr("transform", d => `translate(${x1(d.category)},0)`)
    //   .selectAll("rect")
    //   .data(d => d[1])
    //   .enter()
    //   .append("rect")
    //   .attr("x", d => x2(d.key))
    //   .attr("y", d => y(d.value))
    //   .attr("width", x2.bandwidth())
    //   .attr("height", d => boundedHeight - y(d.value))
    //   .attr("fill", d => color(d.variable));

    // Add X axis for variables
    svg.append("g")
      .attr("transform", `translate(0,${boundedHeight + 30})`)
      .selectAll(".variable-label")
      .data([...new Set(data.map(d => d.variable))])
      .enter()
      .append("text")
      .attr("class", "variable-label")
      .attr("x", d => x2(d) + x2.bandwidth() / 2)
      .attr("y", 0)
      .attr("text-anchor", "middle")
      .text(d => d)
      .attr("transform", `translate(${DIMENSIONS.marginLeft},0)`);

    // Add X axis for categories
    svg.append("g")
      .attr("transform", `translate(0,${boundedHeight + 60})`)
      .selectAll(".category-label")
      .data([...new Set(data.map(d => d.category))])
      .enter()
      .append("text")
      .attr("class", "category-label")
      .attr("x", d => x1(d) + x1.bandwidth() / 2)
      .attr("y", 0)
      .attr("text-anchor", "middle")
      .text(d => d)
      .attr("transform", `translate(${DIMENSIONS.marginLeft},0)`);

    // Add X axis for groups
    svg.append("g")
      .attr("transform", `translate(0,${boundedHeight + 90})`)
      .selectAll(".group-label")
      .data([...new Set(data.map(d => d.group))])
      .enter()
      .append("text")
      .attr("class", "group-label")
      .attr("x", d => x0(d) + x0.bandwidth() / 2)
      .attr("y", 0)
      .attr("text-anchor", "middle")
      .text(d => d)
      .attr("transform", `translate(${DIMENSIONS.marginLeft},0)`);
  };


  const drawChart2 = () => {
    var data = [
      { key: '2020', values: [
        { key: 'USA', values: [
          { key: 'Mechanical', values: [ { key: 'Gear', value: 11 }, { key: 'Bearing', value: 8 }, { key: 'Motor', value: 3 }] },
          { key: 'Electrical', values: [ { key: 'Switch', value: 19 }, { key: 'Plug', value: 12 }, { key: 'Cord', value: 11 }] }
        ]},
        { key: 'Europe', values: [
          { key: 'Mechanical', values: [ { key: 'Gear', value: 15 }, { key: 'Bearing', value: 6 }, { key: 'Motor', value: 2 }] }
        ]}
      ]},
      { key: '2030', values: [
        { key: 'USA', values: [
          { key: 'Mechanical', values: [ { key: 'Gear', value: 13 }, { key: 'Bearing', value: 7 }] }
        ]}
      ]}
    ];



    var margin = { top: 20, right: 20, bottom: 60, left: 40 },
    width = 560 - margin.left - margin.right,
    height = 360 - margin.top - margin.bottom;

var color = d3.scaleOrdinal(d3.schemeCategory10);  // Generic color scheme

var barPadding = 10;
var rangeBands = [];
var cummulative = 0;

// Flattening function to handle arbitrary nesting
function flattenData(data, depth = 0, parentKeys = []) {
  var flatData = [];
  data.forEach(function(d) {
    var currentParentKeys = [...parentKeys, d.key];
    if (d.values) {
      flatData = flatData.concat(flattenData(d.values, depth + 1, currentParentKeys));
    } else {
      flatData.push({ ...d, depth: depth, parentKeys: currentParentKeys });
    }
  });
  return flatData;
}

// Example nested data with an additional hierarchy
var data = [
  { key: '2020', values: [
    { key: 'USA', values: [
      { key: 'Mechanical', values: [ { key: 'Gear', value: 11 }, { key: 'Bearing', value: 8 }, { key: 'Motor', value: 3 }] },
      { key: 'Electrical', values: [ { key: 'Switch', value: 19 }, { key: 'Plug', value: 12 }, { key: 'Cord', value: 11 }] }
    ]},
    { key: 'Europe', values: [
      { key: 'Mechanical', values: [ { key: 'Gear', value: 15 }, { key: 'Bearing', value: 6 }, { key: 'Motor', value: 2 }] }
    ]}
  ]},
  { key: '2030', values: [
    { key: 'USA', values: [
      { key: 'Mechanical', values: [ { key: 'Gear', value: 13 }, { key: 'Bearing', value: 7 }] }
    ]}
  ]}
];

// Flatten the data to easily manage hierarchical rendering
var flatData = flattenData(data);

var x_defect = d3.scaleBand()
  .domain(d3.range(flatData.length))
  .range([0, width])
  .padding(0.1);

var x_category = d3.scaleLinear().range([0, width]);

var y = d3.scaleLinear()
  .range([height, 0]);

y.domain([0, d3.max(flatData, function(d) { return d.value; })]);

var xAxis = d3.axisBottom(x_category);
var yAxis = d3.axisLeft(y).tickFormat(d3.format(".2s"));

var svg = d3.select("body").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .style('background-color', 'EFEFEF')
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.append("g")
  .attr("class", "y axis")
  .call(yAxis)
  .append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", ".71em")
  .style("text-anchor", "end")
  .text("Value");

// Recursive grouping based on depth
function createGroups(selection, depth) {
  var group = selection
    .selectAll('.group-level-' + depth)
    .data(function(d) { return d.values || [d]; })
    .enter().append('g')
    .attr('class', 'group-level-' + depth)
    .attr('transform', function(d, i) {
      return "translate(" + (i * x_defect.bandwidth()) + ",0)";
    });

  if (depth === 2) {
    // Draw rects at the deepest level
    group.append("rect")
      .attr("class", "rect")
      .attr("width", x_defect.bandwidth() - barPadding)
      .attr("x", barPadding)
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); })
      .attr("fill", function(d) { return color(d.parentKeys[2]); });
  }

  // Recursively create groups for next depth level
  if (depth < 2) {
    createGroups(group, depth + 1);
  }
}

// Initialize group for year level
var year_g = svg.selectAll(".year")
  .data(data)
  .enter().append("g")
  .attr("class", function(d) { return 'year year-' + d.key; })
  .attr("transform", function(d, i) {
    return "translate(" + (i * x_defect.bandwidth() * d.values.length) + ",0)";
  });

createGroups(year_g, 0);

// Add labels dynamically
year_g.selectAll(".year-label")
  .data(function(d) { return [d]; })
  .enter().append("text")
  .attr("transform", function(d) {
    var x_label = (d.values.length * x_defect.bandwidth()) / 2;
    return "translate(" + x_label + "," + (height + 50) + ")";
  })
  .text(function(d) { return d.key; })
  .attr('text-anchor', 'middle');







    
  };





  useEffect(() => {
    TrafumaDataProcessing();
    drawChart2();
  }, [data, boundedWidth, boundedHeight]); // Redraw chart when data changes



  const handleClick = () => {
    console.log('SVG clicked!');
    console.log(props.id);
    // Your click event handling logic goes here
    props.parentRef.UpdateProperties(props.id);
  };

  return (
    <div id="root" ref={wrapperRef} style={{ marginBottom: "2rem" }} onClick={handleClick} >
      {/* <button className='btn' onClick={() => SelectPoints()}>Select</button>
        <button className='btn' onClick={() => UnselectPoints()}>Unselect</button>
        <button onClick={callParentFunction}>Get Data</button> */}
      <svg ref={svgRef} width={dimensions.width} height={dimensions.height} >
        <g ref={gXAxisRef} className="x-axis" />
        <g ref={gYAxisRef} className="y-axis" />
        <g ref={rectRef} />
      </svg>
    </div>
  );
});

export default BarChart;
