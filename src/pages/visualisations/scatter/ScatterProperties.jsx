import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { ComboBox } from '@progress/kendo-react-dropdowns';
import { Button } from '@progress/kendo-react-buttons';

const ScatterProperties = forwardRef((props, ref) => {

  const comboBoxXAxisRef = useRef(null);
  const comboBoxYAxisRef = useRef(null);

  useImperativeHandle(ref, () => ({
    setData,
    updateState,
  }));

  
  const [widgetRef, setWidgetRef] = React.useState(null);
  const [csvData, setCsvData] = React.useState(null);

  const [variablesName, setVariablesName] = React.useState([]);
  const [xAxisVariableName, setXAxisVariableName] = React.useState("");
  const [yAxisVariableName, setYAxisVariableName] = React.useState("");

  // const [selectedOption1, setSelectedOption1] = useState(null);
  const [selectedOption2, setSelectedOption2] = useState(null);
  const [selectedOption3, setSelectedOption3] = useState(null);
  const [selectedOption4, setSelectedOption4] = useState(null);

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
    //console.log('setting data' + names[0]);
  };
  

  const handleOptionChange1 = (event) => {
    setXAxisVariableName(event.target.value);
    console.log(event.target.value);
    widgetRef.current.SetXAxisVariableName(event.target.value);
  };

  const handleOptionChange2 = (event) => {
    setYAxisVariableName(event.target.value);
    widgetRef.current.SetYAxisVariableName(event.target.value);
  };

  const handleOptionChange3 = (event) => {
    setSelectedOption3(event.target.value);
  };

  const handleOptionChange4 = (event) => {
    setSelectedOption4(event.target.value);
  };

  const handleButtonClick = () => {
    // Handle button click event
    // console.log("Button clicked!");
    // console.log("widgetRef");
    // console.log(widgetRef);
    widgetRef.current.UnselectPoints();
  };

  useEffect(() => {
    
    if (widgetRef !== null && widgetRef !== undefined)
    {
      if (widgetRef.current !== null && widgetRef.current !== undefined)
      {
        setWidgetRef(widgetRef);
        setCsvData(csvData);

        setVariablesName(csvData.columns);
        setXAxisVariableName(widgetRef.current.GetXAxisVariableName());
        setYAxisVariableName(widgetRef.current.GetYAxisVariableName());

        // setXAxisVariableName(widgetRef.current.GetXAxisVariableName());
        // setYAxisVariableName(widgetRef.current.GetYAxisVariableName());
      }
    }
  }, []);


  return (
    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      <div>
        {/* <h2>Column 1</h2> */}
        <label htmlFor="ComboBox-X-Axis">X-Axis</label>
        <ComboBox
          ref={comboBoxXAxisRef}
          id="ComboBox-X-Axis"
          data={ variablesName }
          value={xAxisVariableName}
          onChange={handleOptionChange1}
        />
        <br />
        <label htmlFor="ComboBox-Y-Axis">Y-Axis</label>
        <ComboBox
          ref={comboBoxYAxisRef}
          id="ComboBox-Y-Axis"
          data={ variablesName }
          value={yAxisVariableName}
          onChange={handleOptionChange2}
        />
        <Button onClick={handleButtonClick}>Submit</Button>
      </div>
      {/* <div>
        <h2>Column 2</h2>
        <label>Label 3:</label>
        <ComboBox
          data={['Option X', 'Option Y', 'Option Z']}
          value={selectedOption3}
          onChange={handleOptionChange3}
        />
        <br />
        <label>Label 4:</label>
        <ComboBox
          data={['Option Alpha', 'Option Beta', 'Option Gamma']}
          value={selectedOption4}
          onChange={handleOptionChange4}
        />
      </div>
      <div style={{ marginTop: '50px' }}>
        <Button onClick={handleButtonClick}>Submit</Button>
      </div> */}
    </div>
  );
});

export default ScatterProperties;