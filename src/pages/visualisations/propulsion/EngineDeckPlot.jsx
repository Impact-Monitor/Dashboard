import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from "react";
import * as d3 from 'd3';
import { group } from 'd3-array';

import { DOMParser } from 'xmldom';

import useDimensions from "../useDimensions";
import EngineDeckPlotProperties from "./EngineDeckPlotProperties";


const DIMENSIONS = { marginTop: 60, marginRight: 60, marginBottom: 60, marginLeft: 60, innerPadding: 0 };


export const EngineDeckPlot = forwardRef((props, ref) => {

  useImperativeHandle(ref, () => ({
    SelectPoints,
    UnselectPoints
  }));


  const svgRef = useRef();
  const gXAxisRef = useRef();
  const gYAxisRef = useRef();
  const rectRef = useRef();


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
  let altitudeArray = [];
  let machArray = [];
  let throttleArray = [];
  let thrustArray = [];
  let fuelFlowRateArray = [];
  let csvData = [];
  let datas = [];


  const InitialiseData = () => {
    const cpacsFiles = props.parentRef.getCpacsData();

    dragPolars = [];

    for (let k = 0; k < cpacsFiles.length; k++)
    {
      const xmlString = cpacsFiles[k];
      const doc = new DOMParser().parseFromString(xmlString, 'text/xml');
      const path = "cpacs/vehicles/engines/engine/analysis/performanceMaps/performanceMap"
      const tags = path.split('/');  // Split the path into an array of tags
      let performanceMapElement = doc;
      for (let i = 0; i < tags.length; i++) {
        const elements = performanceMapElement.getElementsByTagName(tags[i]);
        if (elements.length > 0) {
          performanceMapElement = elements[0];  // Move to the next nested element
        }
        else {
          return null;  // If any part of the path is not found, return null
        }
      }

      let altitude = performanceMapElement.getElementsByTagName('flightLevel')[0].textContent;
      altitudeArray.push(altitude.split(';').map(Number));
      let mach = performanceMapElement.getElementsByTagName('machNumber')[0].textContent;
      machArray.push(mach.split(';').map(Number));
      let throttle = performanceMapElement.getElementsByTagName('n1')[0].textContent;
      throttleArray.push(throttle.split(';').map(Number));
      let thrust = performanceMapElement.getElementsByTagName('thrust')[0].textContent;
      thrustArray.push(thrust.split(';').map(Number));
      let fuelFlowRate = performanceMapElement.getElementsByTagName('mDotFuel')[0].textContent;
      fuelFlowRateArray.push(fuelFlowRate.split(';').map(Number));

      // dragpolar
      let dragPolar = [];
      for (let i = 0; i < altitudeArray[k].length; i++)
      {
          dragPolar.push([0, Number(altitudeArray[k][i]), Number(machArray[k][i]), Number(throttleArray[k][i]), Number(thrustArray[k][i]), Number(fuelFlowRateArray[k][i]), Number(fuelFlowRateArray[k][i]) / Number(thrustArray[k][i])]);
      }
      dragPolars.push(dragPolar);
    }

    UpdateChart();
  }


  const UpdateChart = () => {
    let mode = "Thrust vs Altitude";

    let plotAltitude = 10500.0;

    datas = [];

    for (let k = 0; k < dragPolars.length; k++)
    {
      let dragPolar = dragPolars[k];
      // isaDelta, altitude, mach, throttle, thrust, fuelflow

      let Altitude_Values = [...new Set(altitudeArray[k])];
      let Mach_Values = [...new Set(machArray[k])];

      let data;
      if (mode == "Thrust vs Altitude") {
        data = xx(dragPolar, k, Mach_Values, 1, 4, 2, 0, 40);
      }
      else if (mode == "Fuel Flow vs Altitude") {
        data = xx(dragPolar, k, Mach_Values, 1, 6, 2, 0, 40);
      }
      datas.push(data);
    }
  }

  const xx = (dragPolar, dragPolarIndex, cAxisArray, xAxisIndex, yAxisIndex, cAxisIndex, isaDeltaValue, throttleValue) => {
    let data = [];
    for (let i = 0; i < cAxisArray.length; i++) {
      let curve = [];
      for (let j = 0; j < dragPolar.length; j++) {
        if (dragPolar[j][0] == isaDeltaValue && dragPolar[j][cAxisIndex] == cAxisArray[i] && dragPolar[j][3] == throttleValue) {
          curve.push({ designId: "D" + dragPolarIndex + "Mach = " + cAxisArray[i], ser1: dragPolar[j][xAxisIndex], ser2: dragPolar[j][yAxisIndex] });
        }
      }
      if (curve.length > 0)
      {
        for (let j = 0; j < curve.length; j++)
          data.push(curve[j]);
      }
    }
    return data;
  }

  const drawChart = () => {
    const svg = d3.select(svgRef.current);
    const gXAxis = d3.select(gXAxisRef.current);
    const gYAxis = d3.select(gYAxisRef.current);
    const rect = d3.select(rectRef.current);

    let data = [];
    for (let i = 0; i < datas.length; i++)
    {
      for (let j = 0; j < datas[i].length; j++)
      {
        data.push(datas[i][j]);
      }
    }

    

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


    // Draw the line
    d3.select(svgRef.current).selectAll('.line').remove();
    for (let i = 0; i < datas.length; i++)
    {
      let groupedData = group(datas[i], d => d.designId);

      const colorScale = d3.scaleSequential(d3.interpolateRainbow)
        .domain([0, groupedData.size - 1]); // Map group index to color range

        
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
    // })

  }


  useEffect(() => {
    // TrafumaDataProcessing();
    InitialiseData();
    drawChart();
  }, [boundedWidth, boundedHeight]);



  return (
    <div id="root" ref={wrapperRef} style={{ marginBottom: "2rem" }}>
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
