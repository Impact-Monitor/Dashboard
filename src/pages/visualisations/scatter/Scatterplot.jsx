import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from "react";
import * as d3 from 'd3';

// import { data } from './data';
import useDimensions from "../useDimensions";


const DIMENSIONS = { marginTop: 30, marginRight: 30, marginBottom: 30, marginLeft: 30, innerPadding: 20 };
  

export const Scatterplot = forwardRef((props, ref) => {

  // const [data, setData] = useState([]);
  // const [xAxis, setXAxis] = useState('');
  // const [yAxis, setYAxis] = useState('');

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
  const [csvData, setCSVData] = React.useState(props.csvData);
  const [xAxisVariableName, setXAxisVariableName] = React.useState(props.csvData.columns[1]);
  const [yAxisVariableName, setYAxisVariableName] = React.useState(props.csvData.columns[2]);


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
    // console.log("scatterSelection");
    // console.log(pointIds);
    for (let i = 0; i < pointIds.length; i++)
    {
      d3.select(svgRef.current).select('[id="circle' + pointIds[i] + '"]').style("fill", "#0000ff");
    }

    
  };
  const UnselectPoints = () => {
      for (let i = 0; i < data.length; i++)
      {
          d3.select(svgRef.current).select('[id="circle' + i + '"]').style("fill", "#cb1dd1");
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




  let data = [];


    


  const InitialiseData = () => {
    // let csvData = props.parentRef.getData();

    let row = csvData[0];
    data = [];
    for (let i = 0; i < csvData.length; i++) {
      row = csvData[i];
      // let xAxisValue = Number(row["diameter"]);
      // let yAxisValue = Number(row["velocity"]);

      let xAxisValue = Number(row[xAxisVariableName]);
      let yAxisValue = Number(row[yAxisVariableName]);
      data.push([xAxisValue, yAxisValue]);
    }



    if (props.propertiesRef.current !== undefined && props.propertiesRef.current !== null)
    {
      let names = [];
      names.push("Atif");
      names.push("Riaz");
      // console.log(props.propertiesRef);
      console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      props.propertiesRef.current.setData(names);
      // props.propertiesRef.current.Refresh();
    }
  }

  const drawChart = () => {


    const svg = d3.select(svgRef.current);
    const gXAxis = d3.select(gXAxisRef.current);
    const gYAxis = d3.select(gYAxisRef.current);
    const rect = d3.select(rectRef.current);


    const xScale = d3.scaleLinear().domain(d3.extent(data, function (d) { return d[0]; })).range([innerPadding, boundedWidth - innerPadding]);
    const xAxis = d3.axisBottom(xScale).ticks(10);

    const yScale = d3.scaleLinear().domain(d3.extent(data, function (d) { return d[1]; })).range([boundedHeight - innerPadding, innerPadding]);
    const yAxis = d3.axisLeft(yScale).ticks(5);


    gXAxis
      .attr('transform', `translate(${DIMENSIONS.marginLeft},${boundedHeight + DIMENSIONS.marginTop - DIMENSIONS.innerPadding})`)
      .call(xAxis);

    gYAxis
      .attr('transform', `translate(${DIMENSIONS.marginLeft + DIMENSIONS.innerPadding},${DIMENSIONS.marginTop})`)
      .call(yAxis);

    d3.select(svgRef.current).selectAll('circle').remove();
    rect
      .attr("transform", "translate(" + DIMENSIONS.marginLeft + "," + DIMENSIONS.marginTop + ")");
    rect.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr("id", (d, i) => {
        return "circle" + i;
      })
      .attr('cx', d => xScale(parseFloat(d[0])))
      .attr('cy', d => yScale(parseFloat(d[1])))
      .attr('r', 5)
      .attr('fill', 'steelblue')
      .style("opacity", 0.5)
      .on('mouseover', function (d, i) {  // Add interactivity
          d3.select(this)
              .transition()
              .duration(200)
              .attr('r', 10)
              .attr('stroke-width', 3);
      })
      .on('mouseout', function (d, i) {
          d3.select(this)
              .transition()
              .duration(200)
              .attr('r', 5)
              .attr('stroke-width', 1)

      })
      .on('click', function (e, i) {
        
        props.parentRef.unSelectDesigns();

        let selectedDesignId = e.target.id;
        let id = selectedDesignId.replace("circle", "");
        let designIds = [];
        designIds.push(Number(id));
        props.parentRef.selectDesigns(designIds);
          // vision.DeselectPoint();
          // vision.SelectPoints([i]);

      })
  };

  const UpdateProperties = () => {
    console.log(props.propertiesRef);
    console.log(props.propertiesRef.current);
    if (props.propertiesRef.current != null)
    {
      console.log("I m in");
      props.propertiesRef.current.updateState(ref, props.csvData);
    }
  }
  useEffect(() => {
    UpdateProperties();
    // this.scatterPropertiesRef.current.updateState(widgetRef, this.state.csvData1);
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
}
);

//export default Scatterplot;
