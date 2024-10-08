import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from "react";
import * as d3 from 'd3';
import { group } from 'd3-array';

import { DOMParser } from 'xmldom';

import useDimensions from "../useDimensions";


const DIMENSIONS = { marginTop: 60, marginRight: 60, marginBottom: 60, marginLeft: 60, innerPadding: 0 };


export const TrajectoryPlot = forwardRef((props, ref) => {

  useImperativeHandle(ref, () => ({
    GetId,
    SelectPoints,
    UnselectPoints,
    SetXAxisVariableName,
    GetXAxisVariableName,
    SetYAxisVariableName,
    GetYAxisVariableName,
    UpdateProperties,
  }));


  const [id, setId] = React.useState(props.id);
  //const [csvData, setCSVData] = React.useState(props.csvData);
  const [xAxisVariableName, setXAxisVariableName] = React.useState("posix");
  const [yAxisVariableName, setYAxisVariableName] = React.useState("noxFlow");


  const svgRef = useRef();
  const gXAxisRef = useRef();
  const gYAxisRef = useRef();
  const rectRef = useRef();

  const GetId = () => {
    return id;
  };

  const SetXAxisVariableName = (variableName) => {
    setXAxisVariableName(variableName);
  };
  const GetXAxisVariableName = () => {
    return xAxisVariableName;
  };
  const SetYAxisVariableName = (variableName) => {
    setYAxisVariableName(variableName);
  };
  const GetYAxisVariableName = () => {
    return yAxisVariableName;
  };


  const SelectPoints = (pointIds) => {
    console.log("lineSelection");
    console.log(pointIds);
    for (let i = 0; i < pointIds.length; i++) {
      d3.select(svgRef.current).select('[id="line' + pointIds[i] + '"]').style("stroke", "#0000ff");
    }
  };
  const UnselectPoints = () => {
    for (let i = 0; i < csvData.length; i++) {
      d3.select(svgRef.current).select('[id="line' + i + '"]').style("stroke", "#cb1dd1");
    }
  };





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



  let dragPolars = []
  let csvData = [];
  let data = [];
  let childNames = [];

  const getElementByPath = (doc, path) => {
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
    return currentElement;  // Return the final element found
  }

  const GetElement = (parentElement, path) => {
    let returnElement;
    let tags = path.split('/');
    for (let i = 0; i < tags.length; i++) {
      const elements = parentElement.getElementsByTagName(tags[i]);
      if (elements.length > 0) {
        returnElement = elements[0];  // Move to the next nested element
      }
      else {
        return null;  // If any part of the path is not found, return null
      }
    }
    return returnElement;
  }

  const DefineParametersNames = () => {
    const cpacsFiles = props.parentRef.getCpacsData();

    const xmlString = cpacsFiles[0];

    const doc = new DOMParser().parseFromString(xmlString, 'text/xml');

    const path = "cpacs/flights/flight/analyses/trajectories/trajectory/flightPoints"
    const tags = path.split('/');  // Split the path into an array of tags
    let flightPointsElement = doc;
    for (let i = 0; i < tags.length; i++) {
      const elements = flightPointsElement.getElementsByTagName(tags[i]);
      if (elements.length > 0) {
        flightPointsElement = elements[0];  // Move to the next nested element
      }
      else {
        return null;  // If any part of the path is not found, return null
      }
    }

    //const childElements = flightPointsElement.children;
    const childElements = Array.from(flightPointsElement.childNodes).filter(node => node.nodeType === 1);

    childNames = [];
    for (let i = 0; i < childElements.length; i++)
    {
      if (childElements[i].tagName == "weather")
      {
        let weatherChildElements = Array.from(childElements[i].childNodes).filter(node => node.nodeType === 1);
        for (let j = 0; j < weatherChildElements.length; j++)
        {
          childNames.push(weatherChildElements[j].tagName)
        }
      }
      else
      {
        childNames.push(childElements[i].tagName)
      }
    }
  }

  const InitialiseData = () => {
    DefineParametersNames();


    const cpacsFiles = props.parentRef.getCpacsData();

    for (let k = 0; k < cpacsFiles.length; k++)
    {
      const xmlString = cpacsFiles[k];

      const doc = new DOMParser().parseFromString(xmlString, 'text/xml');

      const path = "cpacs/flights/flight/analyses/trajectories/trajectory/flightPoints"
      const tags = path.split('/');  // Split the path into an array of tags
      let flightPointsElement = doc;
      for (let i = 0; i < tags.length; i++) {
        const elements = flightPointsElement.getElementsByTagName(tags[i]);
        if (elements.length > 0) {
          flightPointsElement = elements[0];  // Move to the next nested element
        }
        else {
          return null;  // If any part of the path is not found, return null
        }
      }

      let columns = [];
      for (let i = 0; i < childNames.length; i++) {
        let columnElement = GetElement(flightPointsElement, childNames[i]);
        let columnText = columnElement.textContent;
        let columnArray = columnText.split(';')
        if (columnArray.length > 0)
          columns.push(columnArray);
      }

      let dragPolar = [];
      let totalEntries = columns[0].length;
      for (let i = 0; i < totalEntries; i++)
      {
        let row = [];
        for (let j = 0; j < columns.length; j++)
        {
          row.push(columns[j][i]);
        }
        dragPolar.push(row);
      }
      dragPolars.push(dragPolar)
    }

    UpdateChart();
  }


  const UpdateChart = () => {
    AddNewLineSeries();
  }

  const AddNewLineSeries = () => {
    for (let k = 0; k < dragPolars.length; k++)
    {
      let dragPolar = dragPolars[k];
      for (let i = 0; i < dragPolar.length; i++) {
        let indexXAxis = childNames.indexOf(xAxisVariableName);
        let indexYAxis = childNames.indexOf(yAxisVariableName);
        data.push({ designId: "Design " + k, ser1: dragPolar[i][indexXAxis], ser2: dragPolar[i][indexYAxis] });
      }
    }
  }




  const drawChart = () => {
    const svg = d3.select(svgRef.current);
    const gXAxis = d3.select(gXAxisRef.current);
    const gYAxis = d3.select(gYAxisRef.current);
    const rect = d3.select(rectRef.current);

    let groupedData = group(data, d => d.designId);

    // Add X axis --> it is a date format
    var x = d3.scaleLinear()
      .domain(d3.extent(data, function (d) { return +d.ser1; }))
      .range([0, boundedWidth]);
    gXAxis
      .attr('transform', `translate(${DIMENSIONS.marginLeft},${boundedHeight + DIMENSIONS.marginTop - DIMENSIONS.innerPadding})`)
      .call(d3.axisBottom(x).ticks(5));

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, d3.max(data, function (d) { return +d.ser2; })])
      .range([boundedHeight, 0]);
    gYAxis
      .attr('transform', `translate(${DIMENSIONS.marginLeft + DIMENSIONS.innerPadding},${DIMENSIONS.marginTop})`)
      .call(d3.axisLeft(y));


    // Axis titles
  // X-axis title
  svg.select('.x-axis-title').remove(); // Remove any existing title to avoid duplicates
  svg.append("text")
    .attr("class", "x-axis-title")
    .attr("text-anchor", "middle")
    .attr("x", boundedWidth / 2 + DIMENSIONS.marginLeft)
    .attr("y", dimensions.height - 10) // Adjust this value based on the marginBottom
    .text(xAxisVariableName);

  // Y-axis title
  svg.select('.y-axis-title').remove(); // Remove any existing title to avoid duplicates
  svg.append("text")
    .attr("class", "y-axis-title")
    .attr("text-anchor", "middle")
    .attr("x", -(boundedHeight / 2) - DIMENSIONS.marginTop)
    .attr("y", 15) // Adjust this value based on the marginLeft
    .attr("transform", "rotate(-90)")
    .text(yAxisVariableName);


    const colorScale = d3.scaleSequential(d3.interpolateRainbow)
      .domain([0, groupedData.size - 1]); // Map group index to color range

    // Draw the line
    d3.select(svgRef.current).selectAll('.line').remove();
    rect
      .attr("transform", "translate(" + DIMENSIONS.marginLeft + "," + DIMENSIONS.marginTop + ")");
    rect.selectAll(".line")
      .data(groupedData)
      .enter()
      .append("path")
      .attr("id", (d, i) => {
        return "line" + i;
      })
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", (d, i) => colorScale(i))
      .attr("stroke-width", 1.5)
      .attr("d", function (d) {
        return d3.line()
          .x(function (dd) { return x(+dd.ser1); })
          .y(function (dd) { return y(+dd.ser2); })
          (d[1])
      })
  }

  const UpdateProperties = () => {
    if (props.propertiesRef.current != null)
    {
      props.propertiesRef.current.updateState(ref, childNames);
    }
  }


  useEffect(() => {
    InitialiseData();
    drawChart();
  }, [boundedWidth, boundedHeight]);

  InitialiseData();
  drawChart();

  const callParentFunction = () => {
    // Call the function from the parent component
    let ddd = props.parentRef.getData();
    console.log(ddd);
  };

  const childFunction = () => {
    console.log('Function called from child');
  };

  const handleClick = () => {
    props.parentRef.UpdateProperties(props.id);
  };

  return (
    <div id="root" ref={wrapperRef} style={{ marginBottom: "2rem" }} onClick={handleClick}>
      {/* <button className='btn' onClick={() => SelectPoints()}>Select</button>
        <button className='btn' onClick={() => UnselectPoints()}>Unselect</button>
        <button onClick={callParentFunction}>Get Data</button> */}
      <svg ref={svgRef} width={dimensions.width} height={dimensions.height}  >
        <g ref={gXAxisRef} className="x-axis" />
        <g ref={gYAxisRef} className="y-axis" />
        <g ref={rectRef} />
      </svg>
    </div>
  );

}
);

//export default Lineplot;
