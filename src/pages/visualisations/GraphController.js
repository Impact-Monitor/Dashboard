import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
import ParameterSelection from './ParameterSelection';
import GraphTypeSelector from './GraphTypeSelector';
import ColorSelector from './ColorSelector';
import LineGraph from './LineGraph';
import ScatterPlot from './ScatterPlot';
import PerformanceMap from './PerformanceMap';
import './plots.css'
// import csvData from './../../assets/images/misc/Dataset21.csv';
// import csvData from './../../assets/images/misc/iris.csv';
import csvData from './../../assets/images/misc/dragpolar_1.csv';

const GraphController = () => {
  const [data, setData] = useState([]);
  const [xAxis, setXAxis] = useState('');
  const [yAxis, setYAxis] = useState('');
  const [groupVariable, setGroupVariable] = useState('');
  const [graphType, setGraphType] = useState('line');

  const [lineStrokeColor, setLineStrokeColor] = useState('steelblue');
  const [lineStrokeWidth, setLineStrokeWidth] = useState(2);

  const [circleFillColor, setCircleFillColor] = useState('steelblue');
  const [circleStrokeColor, setCircleStrokeColor] = useState('black');
  const [circleStrokeWidth, setCircleStrokeWidth] = useState(1);

  const [buttonDisabled, setButtonDisabled] = useState(true);

  // Add state variables for filtering
  // const [filterColumn, setFilterColumn] = useState('');
  // const [filterMinValue, setFilterMinValue] = useState('');
  // const [filterMaxValue, setFilterMaxValue] = useState('');
  // const [filteredData, setFilteredData] = useState([]);

  const [filters, setFilters] = useState([{ column: '', minValue: '', maxValue: '' }]);


  useEffect(() => {
    d3.csv(csvData).then(csvData => {
      setData(csvData);
      setButtonDisabled(false);
    });
  }, []);

  const getColumnValues = (columnName) => {
    return [...new Set(data.map(entry => entry[columnName]))].sort((a, b) => a - b);
  };

  const addFilter = () => {
    setFilters([...filters, { column: '', minValue: '', maxValue: '' }]);
  };

  const removeFilter = (index) => {
    const updatedFilters = [...filters];
    updatedFilters.splice(index, 1);
    setFilters(updatedFilters);
  };

  // // Function to filter data based on selected column and value
  // const filterData = () => {
  //   if (filterColumn && filterValue) {
  //     const filtered = data.filter(entry => entry[filterColumn] === filterValue);
  //     setFilteredData(filtered);
  //   } else {
  //     setFilteredData(data); // Reset to original data if no filter applied
  //   }
  // };
  // const filterData = () => {
  //   if (filterColumn && filterMinValue && filterMaxValue) {
  //     const filtered = data.filter(entry => entry[filterColumn] >= filterMinValue && entry[filterColumn] <= filterMaxValue);
  //     setFilteredData(filtered);
  //   } else {
  //     setFilteredData(data);
  //   }
  // };

  // // Call filterData whenever filterColumn or filterValue changes
  // useEffect(() => {
  //   filterData();
  // }, [filterColumn, filterValue]);
  // useEffect(() => {
  //   filterData();
  // }, [filterColumn, filterMinValue, filterMaxValue]);

  const plotGraph = () => {
    // Check if xAxis, yAxis, and groupVariable are defined
    const isXAxisDefined = Boolean(xAxis);
    const isYAxisDefined = Boolean(yAxis);
    const isGroupVariableDefined = Boolean(groupVariable);
    if (!isXAxisDefined || !isYAxisDefined) return;

    // // Filter data based on start and end indices
    // let filteredData = data.slice(+startIdx, +endIdx + 1);
    let filteredData = [...data];
    filters.forEach(filter => {
      if (filter.column && filter.minValue !== '' && filter.maxValue !== '') {
        filteredData = filteredData.filter(entry =>
          parseFloat(entry[filter.column]) >= parseFloat(filter.minValue) &&
          parseFloat(entry[filter.column]) <= parseFloat(filter.maxValue)
        );
      }
    });
    

    // Plot graph based on selected graph type
    if (graphType === 'line') {
        // Plot line chart
        return (
          <LineGraph
            data={data}
            xAxis={xAxis}
            yAxis={yAxis}
            strokeColor={lineStrokeColor}
            strokeWidth={lineStrokeWidth}
          />
        );
      } else if (graphType === 'scatter') {
        // Plot scatter plot
        return (
          <ScatterPlot
            data={data}
            xAxis={xAxis}
            yAxis={yAxis}
            fillColor={circleFillColor}
            strokeColor={circleStrokeColor}
            strokeWidth={circleStrokeWidth}
          />
        );
      } else if (graphType === 'performance-map') {
        // Plot performance map
        return (
          <PerformanceMap 
            data={filteredData}
            xAxis={xAxis}
            yAxis={yAxis}
            groupVariable = {groupVariable}
            strokeColor={lineStrokeColor}
            strokeWidth={lineStrokeWidth} 
          />
        );
      }
  };

  return (
    <div className='main-container'>
      <div className='graph-controller-container'>
        {/* <GraphTypeSelector
          value={graphType}
          onChange={e => setGraphType(e.target.value)}
        /> */}
        <div className = 'graph-selector'>
          <label className='plot-label'>Graph Type:</label>
          <GraphTypeSelector 
            options={['line', 'scatter', 'performance-map']}
            value={graphType}
            onChange={e => setGraphType(e.target.value)}
          />
        </div>

        {graphType === 'line' && (
          <div>
            <div className = 'graph-selector'>
              <label className='plot-label'>X-axis:</label>
              <select value={xAxis} onChange={e => setXAxis(e.target.value)}>
                {data.length > 0 && Object.keys(data[0]).map(key => <option key={key}>{key}</option>)}
              </select>
            </div>
            <div className = 'graph-selector'>
              <label className='plot-label'>Y-axis:</label>
              <select value={yAxis} onChange={e => setYAxis(e.target.value)}>
                {data.length > 0 && Object.keys(data[0]).map(key => <option key={key}>{key}</option>)}
              </select>
            </div>
            
            <div className = 'graph-selector'>
              <label className='plot-label'>Line Stroke Color:</label>
              <ColorSelector
                options={['steelblue', 'red', 'green', 'blue']}
                value={lineStrokeColor}
                onChange={e => setLineStrokeColor(e.target.value)}
              />
            </div>
            <div className = 'graph-selector'>
              <label className='plot-label'>Line Stroke Width:</label>
              <input className='plot-input-field'
                type="number"
                value={lineStrokeWidth}
                onChange={e => setLineStrokeWidth(parseInt(e.target.value))}
              />
            </div>
          </div>
        )}

        {graphType === 'scatter' && (
          <div>
            <div className = 'graph-selector'>
              <label className='plot-label'>X-axis:</label>
              <select value={xAxis} onChange={e => setXAxis(e.target.value)}>
                {data.length > 0 && Object.keys(data[0]).map(key => <option key={key}>{key}</option>)}
              </select>
            </div>
            <div className = 'graph-selector'>
              <label className='plot-label'>Y-axis:</label>
              <select value={yAxis} onChange={e => setYAxis(e.target.value)}>
                {data.length > 0 && Object.keys(data[0]).map(key => <option key={key}>{key}</option>)}
              </select>
            </div>
            <div className = 'graph-selector'>
              <label className='plot-label'>Circle Fill Color:</label>
              <ColorSelector
                options={['steelblue', 'red', 'green', 'blue']}
                value={circleFillColor}
                onChange={e => setCircleFillColor(e.target.value)}
              />
            </div>
            <div className = 'graph-selector'>
              <label className='plot-label'>Circle Stroke Color:</label>
              <ColorSelector
                options={['black', 'gray', 'white']}
                value={circleStrokeColor}
                onChange={e => setCircleStrokeColor(e.target.value)}
              />
            </div>
            <div className = 'graph-selector'>
              <label className='plot-label'>Circle Stroke Width:</label>
              <input className='plot-input-field'
                type="number"
                value={circleStrokeWidth}
                onChange={e => setCircleStrokeWidth(parseInt(e.target.value))}
              />
            </div>
          </div>
        )}

        {graphType === 'performance-map' && (
          <div>
            <div className = 'graph-selector'>
              <label className='plot-label'>X-axis:</label>
              <select value={xAxis} onChange={e => setXAxis(e.target.value)}>
                {data.length > 0 && Object.keys(data[0]).map(key => <option key={key}>{key}</option>)}
              </select>
            </div>
            <div className = 'graph-selector'>
              <label className='plot-label'>Y-axis:</label>
              <select value={yAxis} onChange={e => setYAxis(e.target.value)}>
                {data.length > 0 && Object.keys(data[0]).map(key => <option key={key}>{key}</option>)}
              </select>
            </div>
            <div className = 'graph-selector'>
              <label className='plot-label'>Group by:</label>
              <select value={groupVariable} onChange={e => setGroupVariable(e.target.value)}>
                {data.length > 0 && Object.keys(data[0]).map(key => <option key={key}>{key}</option>)}
              </select>
            </div>
            
            <div className = 'filter-container'>
              {/* Add dropdown menus for filtering */}
              {/* <ParameterSelection
                label="Filter Column:"
                options={Object.keys(data[0])}
                value={filterColumn}
                onChange={e => setFilterColumn(e.target.value)}
              /> */}

              {/* <div className = 'graph-selector'>
                <label className='plot-label'>Filter Column:</label>
                <select value={filterColumn} onChange={e => setFilterColumn(e.target.value)}>
                  {data.length > 0 && Object.keys(data[0]).map(key => <option key={key}>{key}</option>)}
                </select>

                {filterColumn && (
                  <div>
                    <label>Min Value:</label>
                    <select value={filterMinValue} onChange={e => setFilterMinValue(e.target.value)}>
                      <option value="">--Select Min Value--</option>
                      {getColumnValues(filterColumn).map(value => (
                        <option key={value} value={value}>{value}</option>
                      ))}
                    </select>
                    <label>Max Value:</label>
                    <select value={filterMaxValue} onChange={e => setFilterMaxValue(e.target.value)}>
                      <option value="">--Select Max Value--</option>
                      {getColumnValues(filterColumn).map(value => (
                        <option key={value} value={value}>{value}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div> */}

              {filters.map((filter, index) => (
                <div key={index}>
                  <label className='plot-label'>{`Filter Column ${index + 1}:`}</label>
                  <ParameterSelection
                    label={`Filter Column ${index + 1}:`}
                    options={Object.keys(data[0])}
                    value={filter.column}
                    onChange={e => {
                      const updatedFilters = [...filters];
                      updatedFilters[index].column = e.target.value;
                      setFilters(updatedFilters);
                    }}
                  />

                  {filter.column && (
                    <div>
                      <label className='plot-label'>Min Value:</label>
                      <select
                        value={filter.minValue}
                        onChange={e => {
                          const newValue = e.target.value;
                          const updatedFilters = [...filters];
                          updatedFilters[index].minValue = newValue === 'custom' ? '' : newValue;
                          setFilters(updatedFilters);
                        }}
                      >
                        <option value="">--Select Min Value--</option>
                        <option value="custom">Custom</option>
                        {getColumnValues(filter.column).map(value => (
                          <option key={value} value={value}>{value}</option>
                        ))}
                      </select>
                      {filter.minValue === 'custom' && (
                        <input
                          type="number"
                          value={filter.customMinValue}
                          onChange={e => {
                            const newValue = e.target.value;
                            const updatedFilters = [...filters];
                            updatedFilters[index].customMinValue = newValue;
                            setFilters(updatedFilters);
                          }}
                        />
                      )}

                      <label className='plot-label'>Max Value:</label>
                      <select
                        value={filter.maxValue}
                        onChange={e => {
                          const updatedFilters = [...filters];
                          updatedFilters[index].maxValue = e.target.value;
                          setFilters(updatedFilters);
                        }}
                      >
                        <option value="">--Select Max Value--</option>
                        {getColumnValues(filter.column).map(value => (
                          <option key={value} value={value}>{value}</option>
                        ))}
                      </select>
                      <button className='button-container remove' onClick={() => removeFilter(index)}>Remove Filter</button>
                    </div>
                  )}
                </div>
              ))}

              <button className='button-container add' onClick={addFilter}>Add Filter</button>
            </div>
            
            <div className = 'graph-selector'>
              <label className='plot-label'>Line Stroke Color:</label>
              <ColorSelector
                options={['steelblue', 'red', 'green', 'blue']}
                value={lineStrokeColor}
                onChange={e => setLineStrokeColor(e.target.value)}
              />
            </div>
            <div className = 'graph-selector'>
              <label className='plot-label'>Line Stroke Width:</label>
              <input className='plot-input-field'
                type="number"
                value={lineStrokeWidth}
                onChange={e => setLineStrokeWidth(parseInt(e.target.value))}
              />
            </div>
          </div>
        )}

        <button className='button-container' onClick={plotGraph} disabled={buttonDisabled}>Plot Graph</button>
      </div>
      {/* <div className='plot-div'>
          {plotGraph()}   
      </div> */}
        {plotGraph() && ( 
          <div className='plot-div'>
            {plotGraph()}
          </div>
        )}
    </div>
    





    // <div>
    //   <div>
    //     <label>X-axis:</label>
    //     <select value={xAxis} onChange={e => setXAxis(e.target.value)}>
    //       {data.length > 0 && Object.keys(data[0]).map(key => <option key={key}>{key}</option>)}
    //     </select>
    //   </div>
    //   {/* <div>
    //     <label>X-axis:</label>
    //     <ParameterSelection
    //       options={Object.keys(data[0])}
    //       value={xAxis}
    //       onChange={e => setXAxis(e.target.value)}
    //     />
    //   </div> */}
    //   <div>
    //     <label>Y-axis:</label>
    //     <select value={yAxis} onChange={e => setYAxis(e.target.value)}>
    //       {data.length > 0 && Object.keys(data[0]).map(key => <option key={key}>{key}</option>)}
    //     </select>
    //   </div>
    //   <div>
    //     <label>Group by:</label>
    //     <select value={groupVariable} onChange={e => setGroupVariable(e.target.value)}>
    //       {data.length > 0 && Object.keys(data[0]).map(key => <option key={key}>{key}</option>)}
    //     </select>
    //   </div>
    //   {/* <div>
    //     <label>X-axis:</label>
    //     <ParameterSelection
    //       options={Object.keys(data[0])}
    //       value={xAxis}
    //       onChange={e => setXAxis(e.target.value)}
    //     />
    //   </div>
    //   <div>
    //     <label>Y-axis:</label>
    //     <ParameterSelection
    //       options={Object.keys(data[0])}
    //       value={yAxis}
    //       onChange={e => setYAxis(e.target.value)}
    //     />
    //   </div>
    //   <div>
    //     <label>Group by:</label>
    //     <ParameterSelection
    //       options={Object.keys(data[0])}
    //       value={groupVariable}
    //       onChange={e => setGroupVariable(e.target.value)}
    //     />
    //   </div> */}
    //   <div>
    //     <label>Graph Type:</label>
    //     <GraphTypeSelector
    //       options={['line', 'scatter', 'performance-map']}
    //       value={graphType}
    //       onChange={e => setGraphType(e.target.value)}
    //     />
    //   </div>
    //   <div>
    //     <label>Line Stroke Color:</label>
    //     <ColorSelector
    //       options={['steelblue', 'red', 'green', 'blue']}
    //       value={lineStrokeColor}
    //       onChange={e => setLineStrokeColor(e.target.value)}
    //     />
    //   </div>
    //   <div>
    //     <label>Line Stroke Width:</label>
    //     <input
    //       type="number"
    //       value={lineStrokeWidth}
    //       onChange={e => setLineStrokeWidth(parseInt(e.target.value))}
    //     />
    //   </div>
    //   <div>
    //     <label>Circle Fill Color:</label>
    //     <ColorSelector
    //       options={['steelblue', 'red', 'green', 'blue']}
    //       value={circleFillColor}
    //       onChange={e => setCircleFillColor(e.target.value)}
    //     />
    //   </div>
    //   <div>
    //     <label>Circle Stroke Color:</label>
    //     <ColorSelector
    //       options={['black', 'gray', 'white']}
    //       value={circleStrokeColor}
    //       onChange={e => setCircleStrokeColor(e.target.value)}
    //     />
    //   </div>
    //   <div>
    //     <label>Circle Stroke Width:</label>
    //     <input
    //       type="number"
    //       value={circleStrokeWidth}
    //       onChange={e => setCircleStrokeWidth(parseInt(e.target.value))}
    //     />
    //   </div>
    //   <button onClick={plotGraph} disabled={buttonDisabled}>Plot Graph</button>

    //   {plotGraph()}
    // </div>
  );
};

export default GraphController;
