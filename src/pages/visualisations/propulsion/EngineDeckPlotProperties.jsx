import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { ComboBox } from '@progress/kendo-react-dropdowns';
import { Button } from '@progress/kendo-react-buttons';

const EngineDeckPlotProperties = forwardRef((props, ref) => {


  useImperativeHandle(ref, () => ({
    setData
  }));

  const setData = (names) => {
    console.log('setting data' + names[0]);
  };

  // console.log("=======SctterProperties=========");
  // console.log(props);
  // console.log("================");
  const [selectedOption1, setSelectedOption1] = useState(null);
  const [selectedOption2, setSelectedOption2] = useState(null);
  const [selectedOption3, setSelectedOption3] = useState(null);
  const [selectedOption4, setSelectedOption4] = useState(null);

  const handleOptionChange1 = (event) => {
    setSelectedOption1(event.target.value);
  };

  const handleOptionChange2 = (event) => {
    setSelectedOption2(event.target.value);
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
    // console.log("props.widgetRef");
    // console.log(props.widgetRef);
    props.widgetRef.current.UnselectPoints();
  };

  


  return (
    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      <div>
        <h2>Column 1</h2>
        <label htmlFor="combo-box-1">Label 1:</label>
        <ComboBox
          id="combo-box-1"
          data={['Option 1', 'Option 2', 'Option 3']}
          value={selectedOption1}
          onChange={handleOptionChange1}
        />
        <br />
        <label htmlFor="combo-box-2">Label 2:</label>
        <ComboBox
          id="combo-box-2"
          data={['Option A', 'Option B', 'Option C']}
          value={selectedOption2}
          onChange={handleOptionChange2}
        />
      </div>
      <div>
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
      </div>
    </div>
  );
});

export default EngineDeckPlotProperties;