import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
// import csvData from './../../assets/images/misc/Dataset.csv'; // Sample CSV data
// import csvData from './assets/images/misc/dragpolar_1.csv';
// import csvData from './../../assets/images/misc/dragpolar_1.csv';
import csvData from '../../../assets/images/misc/dragpolar_1.csv';

import axios from 'axios'


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
      //setData(csvData);
      setButtonDisabled(false); // Enable button when data is loaded
    });
  }, []);


  async function Calee()
  {
    let r;
    await axios.get('http://127.0.0.1:3005/GetFile')
    .then(response => {
        console.error(response.data);
        r = response.data;
    })
    .catch(error => {
        console.error(error);
    });

    console.log("XXXXXXXXXXXXXXX");

    return r;
  }

  let cpacsFilesData = "";
  const plotGraph = () => {

    let rrr = Calee();
    console.log("AAAAAAAAAAAAAA");
    console.log(rrr);
    console.log("RRRRRRRRRRRRRR");

    // axios.get('http://127.0.0.1:3005/GetFile')
    // .then(response => {
    //     console.error(response.data);
    // })
    // .catch(error => {
    //     console.error(error);
    // });

    cpacsFilesData = rrr;
    console.log("YYYYYYY");
    console.log(cpacsFilesData);
    console.log("ZZZZZZZ");
    let parser, xmlDoc;
    parser = new DOMParser();
    xmlDoc = parser.parseFromString(cpacsFilesData, "text/xml");

    let cpacsVersion = xmlDoc.getElementsByTagName("cpacsVersion")[0].childNodes[0].nodeValue;

    let vehiclesElement = xmlDoc.getElementsByTagName("vehicles")[0]; // there can be only one vehicles element in the CPACS file
    let aircraftElement = vehiclesElement.getElementsByTagName("aircraft")[0];  // there can be only one aircraft element in the CPACS file
    let aircraftModelElements = aircraftElement.getElementsByTagName("model");

    let analysesElement = aircraftModelElements[0].getElementsByTagName("analyses")[0]; // there can be only one analyses element in the CPACS file

    let aeroPerformanceElement = analysesElement.getElementsByTagName("aeroPerformance")[0];

    let aeroMapElements = aeroPerformanceElement.getElementsByTagName("aeroMap");

    let aeroPerformanceMapElement = aeroMapElements[0].getElementsByTagName("aeroPerformanceMap")[0];  // there can be only one aeroPerformanceMap element per aeroMap element



    let highSpeedDragPolar = [];
    let altitude_List = aeroPerformanceMapElement.getElementsByTagName("altitude")[0].childNodes[0].nodeValue.split(',');
    let machNumber_List = aeroPerformanceMapElement.getElementsByTagName("machNumber")[0].childNodes[0].nodeValue.split(',');
    let cl_List = aeroPerformanceMapElement.getElementsByTagName("cl")[0].childNodes[0].nodeValue.split(',');
    let cd_List = aeroPerformanceMapElement.getElementsByTagName("cd")[0].childNodes[0].nodeValue.split(',');
    if (altitude_List.length == machNumber_List.length) {
        for (let i = 0; i < altitude_List.length; i++) {
            highSpeedDragPolar.push([altitude_List[i], machNumber_List[i], cl_List[i], cd_List[i]])
        }
    }


    // A321
    let Altitude_Values = [ 0, 10000, 20000, 25000, 30000, 35000, 39800 ];
    let Mach_Values = [ 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.75, 0.775, 0.8, 0.825 ];
    let CL_Values = [ 0, 0.101569024, 0.203138048, 0.304707071, 0.406276095, 0.507845119, 0.609414143, 0.710983166, 0.81255219, 0.914121214, 1.218828285, 1.439390485 ];

    let plotAltitude = 35000.0;

    let dataset = [];
    let mode = "LD vs CL";
    if (mode == "LD vs CL") {
        for (let i = 0; i < Mach_Values.length; i++) {
            //let curve = [];
            for (let j = 0; j < highSpeedDragPolar.length; j++) {
                if (highSpeedDragPolar[j][0] == plotAltitude && highSpeedDragPolar[j][1] == Mach_Values[i]) {
                    //curve.push({ ser1: highSpeedDragPolar[j][2], ser2: highSpeedDragPolar[j][2] / highSpeedDragPolar[j][3] }); // CL, L/D
                    dataset.push({ ser1: highSpeedDragPolar[j][2], ser2: highSpeedDragPolar[j][2] / highSpeedDragPolar[j][3], name: "Mach = " + Mach_Values[i] }); // CL, L/D
                    //this.xAxis.Title = "CL";
                    //this.yAxis.Title = "L/D";
                }
            }
            let kkk = "Mach = " + Mach_Values[i];
            //dataset.push({ kkk: curve });
        }
    }
    else if (mode == "CD vs CL") {
        for (let i = 0; i < Mach_Values.length; i++) {
            //let curve = [];
            for (let j = 0; j < highSpeedDragPolar.length; j++) {
                if (highSpeedDragPolar[j][0] == plotAltitude && highSpeedDragPolar[j][1] == Mach_Values[i]) {
                    //curve.push({ ser1: highSpeedDragPolar[j][2], ser2: highSpeedDragPolar[j][2] / highSpeedDragPolar[j][3] }); // CL, L/D
                    dataset.push({ ser1: highSpeedDragPolar[j][2], ser2: highSpeedDragPolar[j][3], name: "Mach = " + Mach_Values[i] }); // CL, L/D
                    //this.xAxis.Title = "CL";
                    //this.yAxis.Title = "L/D";
                }
            }
            let kkk = "Mach = " + Mach_Values[i];
            //dataset.push({ kkk: curve });
        }
    }

    setData(dataset);

    console.log("AtifRiaz1");
    console.log(data);
    console.log("AtifRiaz2");

    // // Check if xAxis, yAxis, and groupVariable are defined
    // const isXAxisDefined = Boolean(xAxis);
    // const isYAxisDefined = Boolean(yAxis);
    // const isGroupVariableDefined = Boolean(groupVariable);
    // if (!isXAxisDefined || !isYAxisDefined || !isGroupVariableDefined) return;

    
    // Clear previous graph
    d3.select('#chart-svg').selectAll('*').remove();
  
    // Select SVG element
    const svg = d3.select('#chart-svg');
  
    // Define width and height of the SVG element
    const width = 800;
    const height = 400;
    
    // Define margin
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };

    console.log("000000000000000000000");
    setXAxis("ser1");
    setYAxis("ser2");

    console.log("1111111111111111111111");
  
    // Create scales for X and Y axes
    const xScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => parseFloat(d[xAxis]))])
      .range([margin.left, width - margin.right]);
  
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => parseFloat(d[yAxis]))])
      .range([height - margin.bottom, margin.top]);

    console.log("22222222222222222222222222");
  
    // Create X and Y axes
    const xAxisScale = d3.axisBottom(xScale);
    const yAxisScale = d3.axisLeft(yScale);
    const groupedData = d3.group(data, d => d[groupVariable]);
  
    // Append X axis
    svg.append('g')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(xAxisScale);
  
    // Append Y axis
    svg.append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(yAxisScale);
  
    // Plot performance map

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

    
  };
  

  const [file, setFile] = useState();
  const [array, setArray] = useState([]);
  const fileReader = new FileReader();
  const csvFileToArray = string => {
    const csvHeader = string.slice(0, string.indexOf("\n")).split(",");
    const csvRows = string.slice(string.indexOf("\n") + 1).split("\n");

    const array = csvRows.map(i => {
      const values = i.split(",");
      const obj = csvHeader.reduce((object, header, index) => {
        object[header] = values[index];
        return object;
      }, {});
      return obj;
    });

    setArray(array);

    
  };


  const handleOnChange = (e) => {
    console.log(e.target.files[0]);
    setFile(e.target.files[0]);
  };

  const handleOnSubmit = (e) => {
    console.log("======================================================================");
    //e.preventDefault();
    console.log(file);
    if (file) {
      // fileReader.onload = function (event) {
      //   const text = event.target.result;
      //   csvFileToArray(text);
      // };
      fileReader.onload = function (event) {
        const text = fileReader.result;
        console.log(fileReader.result);
        cpacsFilesData = fileReader.result;
      };

      fileReader.readAsText(file);
      
    }
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
  };
  return (
    <div>
      <div>
        <button>Atif Button</button>

        <input
          className="uploadInput"
          type={"file"}
          id={"csvFileInput"}
          accept={".csv"}
          onChange={handleOnChange}
        />

        <button onClick={(e) => {handleOnSubmit(e);}} className="uploadBtn">
          IMPORT CSV DATA
        </button>

        {/* <label>X-axis:</label>
        <select value={xAxis} onChange={e => setXAxis(e.target.value)}>
          {data.length > 0 && Object.keys(data[0]).map(key => 
            <option key={key}>{key}</option>)}
        </select> */}
        <label>X-axis:</label>
        <select value="Mach" onChange={e => setXAxis(e.target.value)}>
            {data.length > 0 &&
                Object.keys(data[0]).map(key => (
                <option key={key} value={key}>
                    {key}
                </option>
                ))}
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

      <button onClick={plotGraph}>Plot Graph</button>
  
      {/* SVG element where the chart will be rendered */}
      <svg id="chart-svg" width="800" height="400"></svg>

      {/* {plotGraph()} */}
    </div>
  );
  
};

export default GraphComponent;
