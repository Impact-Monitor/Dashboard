import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from "react";
import * as d3 from 'd3';
import { group } from 'd3-array';

import { DOMParser } from 'xmldom';

import useDimensions from "../useDimensions";


const DIMENSIONS = { marginTop: 60, marginRight: 60, marginBottom: 60, marginLeft: 60, innerPadding: 0 };


export const LinePlot = forwardRef((props, ref) => {

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



  let dragPolar = []
  let altitudeArray = [];
  let machArray = [];
  let clArray = [];
  let cdArray = [];
  let csvData = [];
  let data = [];

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

  const InitialiseData = () => {
    csvData = props.parentRef.getData();

    const xmlString = props.parentRef.getCpacsData()[0];
    const doc = new DOMParser().parseFromString(xmlString, 'text/xml');
    const element = doc.getElementsByTagName('aeroMap')[0];
    const element2 = element.getElementsByTagName('aeroPerformanceMap')[0]

    let altitude = element2.getElementsByTagName('altitude')[0].textContent;
    altitudeArray = altitude.split(';').map(Number);
    let mach = element2.getElementsByTagName('machNumber')[0].textContent;
    machArray = mach.split(';').map(Number);
    let cl = element2.getElementsByTagName('cl')[0].textContent;
    clArray = cl.split(';').map(Number);
    let cd = element2.getElementsByTagName('cd')[0].textContent;
    cdArray = cd.split(';').map(Number);

    // dragpolar
    for (let i = 0; i < altitude.length; i++) {
      dragPolar.push([Number(altitudeArray[i]), Number(machArray[i]), Number(clArray[i]), Number(cdArray[i])]);
    }


    console.log(element.textContent); // Output: Value

    // data = [];
    // let xAxisValues = clArray;
    // let yAxisValues = cdArray;
    // if (xAxisValues.length == yAxisValues.length) {
    //   for (let j = 0; j < xAxisValues.length; j++) {
    //       data.push({ designId: ""+0, ser1: Number(xAxisValues[j]), ser2: Number(yAxisValues[j]) });
    //   }
    // }

    UpdateChart();
  }


  const UpdateChart = () => {
    let mode = "LD vs CL";

    let plotAltitude = 10500.0;

    // A321
    let Altitude_Values = [...new Set(altitudeArray)];
    let Mach_Values = [...new Set(machArray)];
    let CL_Values = [...new Set(clArray)];


    if (mode == "LD vs CL") {
      //this.legend.LegendTitle = "Mach";
      for (let i = 0; i < Mach_Values.length; i++) {
        AddNewLineSeries_AltitudeMach(plotAltitude, Mach_Values[i], mode);
      }
    }
    else if (mode == "CD vs CL") {
      //this.legend.LegendTitle = "Mach";
      for (let i = 0; i < Mach_Values.length; i++) {
        AddNewLineSeries_AltitudeMach(plotAltitude, Mach_Values[i], mode);
      }
    }
    else if (mode == "CL vs CD") {
      //this.legend.LegendTitle = "Mach";
      for (let i = 0; i < Mach_Values.length; i++) {
        AddNewLineSeries_AltitudeMach(plotAltitude, Mach_Values[i], mode);
      }
    }
    else if (mode == "CD vs Mach") {
      //this.legend.LegendTitle = "CL";
      for (let i = 0; i < CL_Values.length; i++) {
        AddNewLineSeries_Drag_vs_Mach(plotAltitude, CL_Values[i], mode);
      }
    }
  }

  const AddNewLineSeries_AltitudeMach = (altitude, machNumber, mode) => {
    // LineSeries ls = new LineSeries();
    // ls.Title = "" + machNumber;
    // ls.StrokeThickness = SeriesDefaultThickness;
    // ls.MarkerType = MarkerType.Circle;
    // Color col = (Color)(converter.ConvertFromString(colorString));
    // ls.Color = OxyColor.FromArgb(col.A, col.R, col.G, col.B);
    // ls.InterpolationAlgorithm = InterpolationAlgorithms.CanonicalSpline;
    // lineSeriesList.Add(ls);




    if (mode == "LD vs CL") {
      for (let i = 0; i < dragPolar.length; i++) {
        if (dragPolar[i][0] == altitude && dragPolar[i][1] == machNumber) {
          data.push({ designId: "Mach = " + machNumber, ser1: dragPolar[i][2], ser2: dragPolar[i][2] / dragPolar[i][3] });
          // xxx.push(dragPolar[i][2]);
          // yyy.push(dragPolar[i][2] / dragPolar[i][3]);
          // this.xAxis.Title = "CL";
          // this.yAxis.Title = "L/D";
        }
      }
    }
    else if (mode == "CD vs CL") {
      for (let i = 0; i < dragPolar.length; i++) {
        if (dragPolar[i][0] == altitude && dragPolar[i][1] == machNumber) {
          data.push({ designId: "Mach = " + machNumber, ser1: dragPolar[i][2], ser2: dragPolar[i][3] });
          // xxx.push(dragPolar[i][2]);
          // yyy.push(dragPolar[i][3]);
          // this.xAxis.Title = "CL";
          // this.yAxis.Title = "CD";
        }
      }
    }
    else if (mode == "CL vs CD") {
      for (let i = 0; i < dragPolar.length; i++) {
        if (dragPolar[i][0] == altitude && dragPolar[i][1] == machNumber) {
          data.push({ designId: "Mach = " + machNumber, ser1: dragPolar[i][3], ser2: dragPolar[i][2] });
          // xxx.push(dragPolar[i][3]);
          // yyy.push(dragPolar[i][2]);
          // this.xAxis.Title = "CD";
          // this.yAxis.Title = "CL";
        }
      }
    }

    // for (let k = 0; k < xxx.length; k++)
    // {
    //   data.push({ designId: ""+0, ser1: xxx[k], ser2: yyy[k] });
    // }
  }

  const AddNewLineSeries_Drag_vs_Mach = (altitude, CL, mode) => {

    let xxx = [];
    let yyy = [];
    if (mode == "CD vs Mach") {
      for (let i = 0; i < dragPolar.length; i++) {
        if (dragPolar[i][0] == altitude && dragPolar[i][2] == CL) {
          xxx.push(dragPolar[i][1]);
          yyy.push(dragPolar[i][3]);
          // this.xAxis.Title = "Mach";
          // this.yAxis.Title = "CD";
        }
      }
    }

    for (let k = 0; k < xxx.length; k++) {
      data.push({ designId: "" + 0, ser1: xxx[k], ser2: yyy[k] });
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
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", function (d) {
        return d3.line()
          .x(function (dd) { return x(+dd.ser1); })
          .y(function (dd) { return y(+dd.ser2); })
          (d[1])
      })
    // })
  }


  useEffect(() => {
    // TrafumaDataProcessing();
    InitialiseData();
    drawChart();
  }, [boundedWidth, boundedHeight]);


  const callParentFunction = () => {
    // Call the function from the parent component
    let ddd = props.parentRef.getData();
    console.log(ddd);
  };

  const childFunction = () => {
    console.log('Function called from child');
  };



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

//export default Lineplot;
