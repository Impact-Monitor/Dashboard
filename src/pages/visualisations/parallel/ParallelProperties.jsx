import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { ComboBox } from '@progress/kendo-react-dropdowns';
import { Button } from '@progress/kendo-react-buttons';

const ParallelProperties = forwardRef((props, ref) => {

  const comboBoxXAxisRef = useRef(null);

  useImperativeHandle(ref, () => ({
    setData,
    updateState,
  }));


  const [widgetRef, setWidgetRef] = React.useState(null);
  const [csvData, setCsvData] = React.useState(null);

  const [variablesName, setVariablesName] = React.useState([]);
  const [xAxisVariableName, setXAxisVariableName] = React.useState("");
  const [yAxisVariableName, setYAxisVariableName] = React.useState("");


  const updateState = (widgetRef, csvData) => {
    console.log("updateState function");
    console.log(widgetRef);
    console.log(csvData);
    if (widgetRef.current != null)
    {
      setWidgetRef(widgetRef);
      setCsvData(csvData);

      setVariablesName(csvData.columns);
      setXAxisVariableName(widgetRef.current.GetXAxisVariableName());
      setYAxisVariableName(widgetRef.current.GetYAxisVariableName());
    }
  };

  const setData = (names) => {
    console.log('setting data' + names[0]);
  };





  const [selectedOption1, setSelectedOption1] = useState(null);
  const [selectedOption2, setSelectedOption2] = useState(null);
  const [selectedOption3, setSelectedOption3] = useState(null);
  const [selectedOption4, setSelectedOption4] = useState(null);

  const handleOptionChange1 = (event) => {
    setSelectedOption1(event.target.value);
  };

  const handleButtonClick = () => {
    // Handle button click event
    // console.log("Button clicked!");
    // console.log("props.widgetRef");
    // console.log(props.widgetRef);
    props.widgetRef.current.UnselectPoints();
  };

  
  useEffect(() => {
    
    if (widgetRef !== null && widgetRef !== undefined)
    {
      if (widgetRef.current !== null && widgetRef.current !== undefined)
      {
        setXAxisVariableName(widgetRef.current.GetXAxisVariableName());
        setYAxisVariableName(widgetRef.current.GetYAxisVariableName());
      }
    }
  }, []);


  return (
    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      <div>
        <h2>Column 1</h2>
        <label htmlFor="combo-box-1">Label 1:</label>
        <ComboBox
          ref={comboBoxXAxisRef}
          id="combo-box-1"
          data={ variablesName }
          value={ xAxisVariableName }
          onChange={handleOptionChange1}
        />
        <br />

      </div>

      <div style={{ marginTop: '50px' }}>
        <Button onClick={handleButtonClick}>Submit</Button>
      </div>
    </div>
  );
});

export default ParallelProperties;