import React, {createRef, memo, Fragment} from 'react';
import * as ReactDOM from 'react-dom';
// import {htmlTab, jsxTab} from "./prism-tabs";
// import {DockLayout} from '../lib';

import "rc-dock/dist/rc-dock.css";
import {DockLayout, DockContextType} from 'rc-dock';

import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { Button } from "@progress/kendo-react-buttons";
import { TreeView, processTreeViewItems, handleTreeViewCheckChange } from "@progress/kendo-react-treeview";
import { Splitter, SplitterPane } from '@progress/kendo-react-layout';
import { ListBox } from '@progress/kendo-react-listbox';


import { Scatterplot } from '../visualisations/scatter/Scatterplot';
import ScatterProperties from '../visualisations/scatter/ScatterProperties';
import { ParallelCoordinates } from '../visualisations/parallel/ParallelCoordinates';
import ParallelProperties from '../visualisations/parallel/ParallelProperties';
import { LinePlot } from '../visualisations/line/LinePlot';
import LineProperties from '../visualisations/line/LineProperties';

import { DragPolarPlot } from '../visualisations/aerodynamics/DragPolarPlot';
import DragPolarPlotProperties from '../visualisations/aerodynamics/DragPolarPlotProperties';
import { EngineDeckPlot } from '../visualisations/propulsion/EngineDeckPlot';
import EngineDeckPlotProperties from '../visualisations/propulsion/EngineDeckPlotProperties';

import { TrajectoryPlot } from '../visualisations/trajectory/TrajectoryPlot';
import TrajectoryProperties from '../visualisations/trajectory/TrajectoryProperties';
import { BarChart } from '../visualisations/bar/BarChart';
import { CesiumMap } from '../visualisations/map/CesiumMap';
import ConnectionMapDemo from '../visualisations/map/ConnectionMapDemo';
import { NoiseContourMap } from '../visualisations/map/NoiseContourMap';
import { FlightMap } from '../visualisations/map/FlightMap';
import { FlightArcMap } from '../visualisations/map/FlightArcMap';

// import Properties from "../../";
import Properties from "../../components/Properties";



import { DOMParser } from 'xmldom';

import * as d3 from 'd3';
import csvData from '../../data/WindTurbine.csv'

import axios from 'axios'


// import React, {memo,Fragment} from 'react'
import "../../stylesheet.css";
// import topHeader from "../assets/images/components/topHeader/top-header.png"
import { Row,Col,Container} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import FileManager from '../file/FileManager';


// let groups = {
//   'locked': {
//     floatable: true,
//     tabLocked: false
//   }
// };








function getConnectionMapPlotTab(id, value) {
  return {
    id,
    content: (
      <div id="root">
      {
          <ConnectionMapDemo />
      }
      </div>
    ),
    title: id
  }
}
// function getTab(id, value) {
//   return {
//     id,
//     content: (
//       <div>
//         <p>It's easier to use React Context to update tab,<br/>
//           but in some use cases you might need to directly update the tab.</p>
//         {
//           id !== `tab${value}` ?
//             <p>Only current active tab will be changed</p>
//             : null
//         }
//         value is {value}
//       </div>
//     ),
//     title: id,
//     // group: 'locked',
//   }
// }

const tree = [
  {
    text: 'Vehicle',
    items: [
      {text: 'Scatter'},
      {text: 'Parallel'},
      {
        text: 'Aircraft',
        items: [
          {text: 'Drag Polar'},
          {text: 'Noise Contour'},
        ]
      },
      {
        text: 'Engine',
        items: [
          {text: 'Engine Deck'},
        ]
      }
    ]
  },
  {
    text: 'Airport',
    items: [
    ]
  },
  {
    text: 'Flights',
    items: [
      {text: 'Trajectory'},
      {text: 'Trajectory Map'},
      {text: 'Noise Contour'},
    ]
  },
  {
    text: 'Airlines',
    items: [
    ]
  },
  {
    text: 'Studies',
    items: [
      {text: 'Red Reporting'},
      {text: 'Environmental Impact'},
      {text: 'Model Results'}
    ]
  }
];

const items = [
  { id: 1, text: "Scatter" },
  { id: 2, text: "Parallel" },
  { id: 3, text: "Sofas" },
  { id: 4, text: "Line" },
  { id: 5, text: "Trajectory" },
  { id: 6, text: "Noise Contour" },
  { id: 7, text: "Red Reporting" },
  { id: 8, text: "Environmental Impact" },
  { id: 9, text: "Model Results" },
  { id: 10, text: "Cesium Map" },
];

export class AtifDashboard extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      csvData1: [],
      cpacsData1: [],
      nonStateVariable: 'Hello, non-state variable!',
      selectedComponent: null,
      PropertiesContent: null,
      activeChild: "",

      visible: false,
      selectedFiles: [], // State to store selected files




      check: [],
      expand: {
        ids: ['Item2'],
        idField: 'text'
      },
      select: ['']
    };
    
    this.widgetsRefs = [];
    this.propertiesRefs = [];
    this.widgetsProperties = [];
    //this.childRef;
    // this.childRefs = [];
    // this.numChildren = 3; // Number of child components
    // for (let i = 0; i < this.numChildren; i++) {
    //   this.childRefs.push(React.createRef());
    // }
    this.counter = 0; // Counter variable to access child components by index

    this.file = "";
    this.cpacsFilesData = [];
    this.fileReader = new FileReader();

    this.scatterPropertiesRef = createRef();
    this.propertiesRefs.push({ key: "scatter", value: this.scatterPropertiesRef });

    this.parallelPropertiesRef = createRef();
    this.propertiesRefs.push({ key: "parallel", value: this.parallelPropertiesRef });

    this.trajectoryPropertiesRef = createRef();
    this.propertiesRefs.push({ key: "trajectory", value: this.trajectoryPropertiesRef });



    this.timer = null;
  }

  onExpandChange = (event) => {
    // Get the current expand state
    const ids = this.state.expand.ids ? this.state.expand.ids.slice() : [];
    
    // Find the index of the item in the ids array
    const index = ids.indexOf(event.item.text);
    
    // If not found, add it, else remove it
    if (index === -1) {
      ids.push(event.item.text);
    } else {
      ids.splice(index, 1);
    }
  
    // Update the expand state
    this.setState({
      expand: {
        ids: ids,
        idField: "text",
      },
    });
  };

  onItemClick = (event) => {
    console.log(event);
  };

  // Handler for double click event
  handleDoubleClick = (item) => {
    alert(`Double-clicked on: ${item.text}`);
    // Perform your custom logic here
  };

  // Custom render function for TreeView items
  renderItem = (props) => {
    return (
      <div onDoubleClick={() => this.handleDoubleClick(props.item)}>
        {props.item.text}
      </div>
    );
  };

  getTab = (id, value) => {
    return {
      id,
      content: (
        <div>
          <p>It's easier to use React Context to update tab,<br/>
            but in some use cases you might need to directly update the tab.</p>
          {
            id !== `tab${value}` ?
              <p>Only current active tab will be changed</p>
              : null
          }
          value is {value}
        </div>
      ),
      title: id,
      // group: 'locked',
    }
  }
  getTab2 = (id, value) => {
    return {
      id,
      content: (
        <div>
          <ScatterProperties />
        </div>
      ),
      title: id,
      // group: 'locked',
    }
  }
  getTab3 = (id, value) => {
    return {
      id,
      content: this.state.PropertiesContent,
      title: id,
      // group: 'locked',
    }
  }

  toggleDialog = () => {
    this.setState(prevState => ({
        visible: !prevState.visible
    }));
  };
  handleFilesSelected = (files) => {
    this.setState({ selectedFiles: files });
    console.log(this.state.selectedFiles);
    const requestData = {
      fileName: this.state.selectedFiles // Replace with the actual file name
    };
    axios.post('http://127.0.0.1:3005/GetFileWithName', requestData)
    .then(response => {

        this.setState({ cpacsData1: response.data }, () => {
            console.log("Cpacs data was parsed successfully.");
        });
    })
    .catch(error => {
        console.error(error);
    });
  };

  selectDesignsss = () => {
    let designIds = [1, 3, 4];
    let vvv = this.state.selectedFiles;
    for (let i = 0; i < this.widgetsRefs.length; i++)
    {
      this.widgetsRefs[i].current.SelectPoints(designIds);
    }
  };
  selectDesigns = (designId) => {
    for (let i = 0; i < this.widgetsRefs.length; i++)
    {
      this.widgetsRefs[i].current.SelectPoints(designId);
    }
    // this.propertiesRefs[0].value.current.Refresh();
  };
  unSelectDesigns = () => {
    console.log(this.widgetsRefs);
    for (let i = 0; i < this.widgetsRefs.length; i++)
    {
      console.log(this.widgetsRefs[i]);
      this.widgetsRefs[i].current.UnselectPoints();
    }
  };
  UpdateProperties = (widgetId) => {
    // let widgetProperties = this.widgetsProperties.find(w => w.key == widgetId).value;
    // console.log(widgetProperties);
    // this.setState({ 
    //   PropertiesContent: widgetProperties
    // });

    // let _propertiesRef = this.propertiesRefs.find(w => w.key == "scatter");

    
    if (widgetId.startsWith("scatter"))
    {
      // this.setState({ 
      //   PropertiesContent: <div id={`scatter${this.count}`}>
      //   {
      //     <ScatterProperties ref={this.scatterPropertiesRef} parentRef={this} />
      //   }
      //   </div>
      //   },
      //   () => {
      //     let panelData = this.dockLayout.find('PropertiesPanel');
      //     let tabId = panelData.activeId;
      //     // docklayout will find the same tab id and replace the previous tab
      //     this.dockLayout.updateTab(tabId, this.getTab3(tabId, ++this.count));
      //   }
      // );

      //this.setState({ activeChild: 'scatter' });
      this.setState({ activeChild: 'scatter' }, () => {
        for (let i = 0; i < this.widgetsRefs.length; i++)
        {
          if (this.widgetsRefs[i].current.GetId() == widgetId)
          {
            this.widgetsRefs[i].current.UpdateProperties();
          }
        }
        // let widgetRef = this.widgetsRefs.find(w => w.current.key == widgetId).value;
        // console.log(widgetRef);
        // widgetRef.current.UpdateProperties();
        }
      );
    }
    else if (widgetId.startsWith("parallel"))
    {
      this.setState({ activeChild: 'parallel' }, () => {
        // let widget = this.widgetsRefs[0]; //.find(w => w.key == widgetId).value;
        // widget.current.UpdateProperties();
        for (let i = 0; i < this.widgetsRefs.length; i++)
        {
          if (this.widgetsRefs[i].current.GetId() == widgetId)
          {
            this.widgetsRefs[i].current.UpdateProperties();
          }
        }
        }
      );
    }
    else if (widgetId.startsWith("trajectory"))
    {
      // this.setState({ 
      //   PropertiesContent: <div id={`trajectory${this.count}`}>
      //   {
      //     <TrajectoryProperties ref={this.trajectoryPropertiesRef} parentRef={this} />
      //   }
      //   </div>
      //   },
      //   () => {
      //     let panelData = this.dockLayout.find('PropertiesPanel');
      //     let tabId = panelData.activeId;
      //     this.dockLayout.updateTab(tabId, this.getTab3(tabId, ++this.count));
      //   }
      // );

      this.setState({ activeChild: 'trajectory' }, () => {
        for (let i = 0; i < this.widgetsRefs.length; i++)
        {
          if (this.widgetsRefs[i].current.GetId() == widgetId)
          {
            this.widgetsRefs[i].current.UpdateProperties();
          }
        }
      });

    }
    else if (widgetId.startsWith("DragPolar"))
    {
      this.setState({ 
        PropertiesContent: <div id={`DragPolar${this.count}`}>
        {
          <DragPolarPlotProperties ref={this.dragPolarPlotPropertiesRef} parentRef={this} />
        }
        </div>
        },
        () => {
          let panelData = this.dockLayout.find('PropertiesPanel');
          let tabId = panelData.activeId;
          this.dockLayout.updateTab(tabId, this.getTab3(tabId, ++this.count));
        }
      );

      this.setState({ activeChild: 'DragPolar' }, () => {
        for (let i = 0; i < this.widgetsRefs.length; i++)
        {
          if (this.widgetsRefs[i].current.GetId() == widgetId)
          {
            this.widgetsRefs[i].current.UpdateProperties();
          }
        }
      });
    }
    else if (widgetId.startsWith("EngineDeck"))
    {
      this.setState({ 
        PropertiesContent: <div id={`EngineDeck${this.count}`}>
        {
          <EngineDeckPlotProperties ref={this.engineDeckPlotPropertiesRef} parentRef={this} />
        }
        </div>
        },
        () => {
          let panelData = this.dockLayout.find('PropertiesPanel');
          let tabId = panelData.activeId;
          this.dockLayout.updateTab(tabId, this.getTab3(tabId, ++this.count));
        }
      );

      this.setState({ activeChild: 'EngineDeck' }, () => {
        for (let i = 0; i < this.widgetsRefs.length; i++)
        {
          if (this.widgetsRefs[i].current.GetId() == widgetId)
          {
            this.widgetsRefs[i].current.UpdateProperties();
          }
        }
      });
    }

    // console.log(this.propertiesRefs[0]);
    // console.log(_propertiesRef);
    // console.log(_propertiesRef.value);
    // this.propertiesRefs[0].value.current.Refresh();
  };
  getData() {
    // for (let i = 0; i < this.widgetsRefs.length; i++)
    // {
    //   this.widgetsRefs[i].current.SelectPoints();
    // }

    return this.state.csvData1;
  };
  getCpacsData() {
    return this.state.cpacsData1;
  };

  Plot1 = () => {
    console.log("Show Plot 1 Properties");
    this.setState({ selectedComponent: <ScatterProperties /> });
    console.log(this.state.selectedComponent);
  };
  Plot2 = () => {
    // console.log("Show Plot 2 Properties");
    // this.setState({ selectedComponent: <ScatterProperties /> });
    // console.log(this.state.selectedComponent);

    // let panelData = this.dockLayout.find('PropertiesPanel');
    // console.log(panelData.content);
    // panelData.content = "<p>Atif Riaz</p>";
    // console.log(panelData.content);


    this.setState({ 
      PropertiesContent: <div id={`scatter${this.count}`}>
      {
        <ScatterProperties />
      }
      </div>
      },
      () => {
        let panelData = this.dockLayout.find('PropertiesPanel');
        let tabId = panelData.activeId;
        // docklayout will find the same tab id and replace the previous tab
        this.dockLayout.updateTab(tabId, this.getTab3(tabId, ++this.count));
      }
    );

  };



  getRef = (r) => {
    this.dockLayout = r;
    
  };

  plotType = "Scatter";
  count = 0;
  addValue = () => {
    let panelData = this.dockLayout.find('my_panel');
    let tabId = panelData.activeId;
    // docklayout will find the same tab id and replace the previous tab
    this.dockLayout.updateTab(tabId, this.getTab(tabId, ++this.count));
  };


  addScatterPlotTab = () => {
    let widgetRef = createRef();
    this.widgetsRefs.push(widgetRef);

    this.counter++;
    ++this.count;
    let widgetId = "scatter" + this.count;
    
    let newTab = {
      id: widgetId,
      title: widgetId,
      cached: true,
      content: (
        <div id="root">
        {
          <Scatterplot ref={widgetRef} id={widgetId} parentRef={this} propertiesRef={this.scatterPropertiesRef} csvData={this.state.csvData1} />
        }
        </div>
      ),
    }
    this.dockLayout.dockMove(newTab, 'my_panel', 'middle');

    this.setState({ activeChild: 'scatter' });
    
  };
  addLinePlotTab = () => {
    let widgetRef = createRef();
    this.widgetsRefs.push(widgetRef);
    let propertiesRef = createRef();
    this.widgetsRefs.push(propertiesRef);
    
    this.counter++;
    ++this.count;
    let widgetId = "line" + this.count;

    let newTab = {
      id: widgetId,
      title: widgetId,
      cached: true,
      content: (
        <div id="root">
        {
          <LinePlot ref={widgetRef} id={widgetId} parentRef={this} csvData={this.state.cpacsData1} />
        }
        </div>
      ),
      title: `line${this.count}`
    }
    this.dockLayout.dockMove(newTab, 'my_panel', 'middle');


    this.setState({ 
      PropertiesContent: <div id={`scatter${this.count}`}>
    {
      <LineProperties ref={propertiesRef} parentRef={this} widgetRef={widgetRef} />
    }
    </div>
    });
  };
  addTrajectoryPlotTab = () => {
    let widgetRef = createRef();
    this.widgetsRefs.push(widgetRef);
    
    this.counter++;
    ++this.count;
    let widgetId = "trajectory" + this.count;

    let newTab = {
      id: widgetId,
      title: widgetId,
      cached: true,
      content: (
        <div id="root">
        {
          <TrajectoryPlot ref={widgetRef} id={widgetId} parentRef={this} propertiesRef={this.trajectoryPropertiesRef} csvData={this.state.cpacsData1} />
        }
        </div>
      ),
    }
    this.dockLayout.dockMove(newTab, 'my_panel', 'middle');

    this.setState({ activeChild: 'trajectory' });
  };
  addDragPolarPlotTab = () => {
    let widgetRef = createRef();
    this.widgetsRefs.push(widgetRef);
    
    this.counter++;
    ++this.count;
    let widgetId = "DragPolar" + this.count;

    let newTab = {
      id: widgetId,
      title: widgetId,
      cached: true,
      content: (
        <div id="root">
        {
          <DragPolarPlot ref={widgetRef} id={widgetId} parentRef={this} propertiesRef={this.dragPolarPropertiesRef} csvData={this.state.cpacsData1} />
        }
        </div>
      ),
    }
    this.dockLayout.dockMove(newTab, 'my_panel', 'middle');

    this.setState({ activeChild: 'DragPolar' });
  };
  addEngineDeckPlotTab = () => {
    let widgetRef = createRef();
    this.widgetsRefs.push(widgetRef);
    
    this.counter++;
    ++this.count;
    let widgetId = "EngineDeck" + this.count;

    let newTab = {
      id: widgetId,
      title: widgetId,
      cached: true,
      content: (
        <div id="root">
        {
          <EngineDeckPlot ref={widgetRef} id={widgetId} parentRef={this} propertiesRef={this.engineDeckPropertiesRef} csvData={this.state.cpacsData1} />
        }
        </div>
      ),
    }
    this.dockLayout.dockMove(newTab, 'my_panel', 'middle');

    this.setState({ activeChild: 'EngineDeck' });
  };
  addParallelPlotTab = () => {
    let widgetRef = createRef();
    this.widgetsRefs.push(widgetRef);

    
    this.counter++;
    ++this.count;
    let widgetId = "parallel" + this.count;

    let newTab = {
      id: `parallel${this.count}`,
      content: (
        <div id="root">
        {
          <ParallelCoordinates ref={widgetRef} id={widgetId} parentRef={this} propertiesRef={this.parallelPropertiesRef} csvData={this.state.csvData1} />
        }
        </div>
      ),
      title: `parallel${this.count}`
    }
    this.dockLayout.dockMove(newTab, 'my_panel', 'middle');

    this.setState({ activeChild: 'parallel' });
  };
  addBarChartTab = () => {
    let widgetRef = createRef();
    this.widgetsRefs.push(widgetRef);

    this.counter++;
    ++this.count;
    let widgetId = "bar" + this.count;
    
    let newTab = {
      id: widgetId,
      title: widgetId,
      cached: true,
      content: (
        <div id="root">
        {
          <BarChart ref={widgetRef} id={widgetId} parentRef={this} propertiesRef={this.scatterPropertiesRef} csvData={this.state.csvData1} />
        }
        </div>
      ),
    }
    this.dockLayout.dockMove(newTab, 'my_panel', 'middle');


    this.setState({ activeChild: 'bar' });
    
  };
  addConnectionMapPlotTab = () => {
    ++this.count;
    let newTab = getConnectionMapPlotTab(`connectionmap${this.count}`, this.count)
    this.dockLayout.dockMove(newTab, 'my_panel', 'middle');
  };
  addTrajectoryMapTab = () => {
    let widgetRef = createRef();
    this.widgetsRefs.push(widgetRef);

    this.counter++;
    ++this.count;
    let widgetId = "trajectoryMap" + this.count;
    
    let newTab = {
      id: widgetId,
      title: widgetId,
      cached: true,
      content: (
        <div id="root">
        {
          //<FlightArcMap ref={widgetRef} id={widgetId} parentRef={this} propertiesRef={this.scatterPropertiesRef} csvData={this.state.csvData1} />
          <FlightMap ref={widgetRef} id={widgetId} parentRef={this} propertiesRef={this.scatterPropertiesRef} csvData={this.state.csvData1} />
        }
        </div>
      ),
    }
    this.dockLayout.dockMove(newTab, 'my_panel', 'middle');

    this.setState({ activeChild: 'scatter' });
    
  };
  addNoiseContourMapTab = () => {
    let widgetRef = createRef();
    this.widgetsRefs.push(widgetRef);

    this.counter++;
    ++this.count;
    let widgetId = "noise" + this.count;
    
    let newTab = {
      id: widgetId,
      title: widgetId,
      cached: true,
      content: (
        <div id="root">
        {
          <NoiseContourMap ref={widgetRef} id={widgetId} parentRef={this} propertiesRef={this.scatterPropertiesRef} csvData={this.state.csvData1} />
        }
        </div>
      ),
    }
    this.dockLayout.dockMove(newTab, 'my_panel', 'middle');

    this.setState({ activeChild: 'scatter' });
    
  };
  addCesiumMapTab = () => {
    let widgetRef = createRef();
    this.widgetsRefs.push(widgetRef);
    
    this.counter++;
    ++this.count;
    let newTab = {
      id: `line${this.count}`,
      content: (
        <div id="root">
        {
          <CesiumMap ref={widgetRef} parentRef={this} />
        }
        </div>
      ),
      title: `line${this.count}`
    }
    this.dockLayout.dockMove(newTab, 'my_panel', 'middle');
  };
  callChildFunction = () => {
    console.log("Calling child components functions");
    //this.childRefs[index].current.childFunction();
    this.childRefs.forEach((ref) => {
      console.log(ref);
      ref.current.childFunction();
    });
  };




  handleOnSubmit = (e) => {
  };

  handleFileChange = (e) => {
    console.log("1. Data was parsed successfully.");
    this.file = e.target.files[0];
    const fileName = this.file.name;
    const fileExtension = fileName.split('.').pop().toLowerCase(); // Get the file extension
    
    console.log(e);
    console.log(e.target.files[0]);
    if (this.file.name == "WindTurbine.csv") {
      this.fileReader.onload = this.parseCsvFile;
      this.fileReader.readAsText(this.file);
    }
    else if (fileExtension == "xml") {
      this.fileReader.onload = this.parseCpacsFile;
      this.fileReader.readAsText(this.file);
    }
  }

  parseCsvFile = (e) => {
    
    let parsedData = d3.csvParse(e.target.result);
    console.log(parsedData);
    this.setState({ csvData1: parsedData }, () => {
      console.log("Data was parsed successfully.");
    });
    // this.setState({ csvData1: parsedData });
    // console.log(this.state.csvData1);
  }

  parseCpacsFile = (e) => {
    axios.get('http://127.0.0.1:3005/GetFile')
    .then(response => {
        this.setState({ cpacsData1: response.data }, () => {
          console.log("Cpacs data was parsed successfully.");
        });
    })
    .catch(error => {
        console.error(error);
    });

  }


  
  
  defaultLayout = {
    dockbox: {
      mode: 'horizontal',
      children: [
        // {
        //   tabs: [
        //     {
              
        //       id: 'id2', title: 'Widgets', content: (
        //         <div>
        //           <p>Click here to change the other panel.</p>
        //           <button onClick={this.handleOnSubmit} >
        //             IMPORT CSV DATA
        //           </button>
        //           <input type={"file"} id={"csvFileInput"} accept={".csv"} onChange={this.handleFileChange} />
        //           <button className='btn' onClick={this.addValue}>Update Value</button>
        //           <button className='btn' onClick={this.addScatterPlotTab}>Add Scatter</button>
        //           <button className='btn' onClick={this.addLinePlotTab}>Add Line</button>
        //           <button className='btn' onClick={this.addTrajectoryPlotTab}>Add Trajectory</button>
        //           <button className='btn' onClick={this.addParallelPlotTab}>Add Parallel</button>
        //           <button className='btn' onClick={this.addBarChartTab}>Add Bar</button>
        //           <button className='btn' onClick={this.addConnectionMapPlotTab}>Add ConnectionMap</button>
        //           <button className='btn' onClick={this.addNoiseContourMapTab}>Add NoiseContour</button>
        //           <button className='btn' onClick={this.addCesiumMapTab}>Add CesiumMap</button>
        //           <button className='btn' onClick={this.selectDesignsss}>Select</button>
        //           <button className='btn' onClick={this.unSelectDesigns}>Unselect</button>

        //           <button className='btn' onClick={this.Plot1}>Plot1Prop</button>
        //           <button className='btn' onClick={this.Plot2}>Plot2Prop</button>

        //         </div>
        //       )
        //     }
        //   ],
        // },

        {
          id: 'my_panel',
          tabs: [this.getTab('Welcome', 1)],
        },

        // {
        //   id: 'PropertiesPanel',
        //   tabs: [this.getTab('Properties', 2)],
        // }
      ]
    }
  };

  state = {saved: null};







  



  
  handleActiveTabChange = (newTab) => {
    //this.setState({ activeTab: newTab });
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    console.log("Active tab changed to:", newTab);
  };




  onItemClick = (event) => {
    this.setState({ select: [event.itemHierarchicalIndex] });

    this.handleClickedWidgetType(event.item.text)
  };

  onExpandChange = (event) => {
    const ids = this.state.expand.ids ? this.state.expand.ids.slice() : [];
    const index = ids.indexOf(event.item.text);
    if (index === -1) {
      ids.push(event.item.text);
    } else {
      ids.splice(index, 1);
    }
    this.setState({
      expand: {
        ids: ids,
        idField: 'text'
      }
    });
  };

  onCheckChange = (event) => {
    const settings = {
      singleMode: false,
      checkChildren: false,
      checkParents: false
    };
    this.setState({
      check: handleTreeViewCheckChange(event, this.state.check, tree, settings)
    });
  };


  handleItemClick = (event) => {
    if (this.timer)
    {
      clearTimeout(this.timer);
      this.timer = null;
      // Handle double-click action here
      //alert(`Double-clicked on: ${event.dataItem.text}`);


      //const clickedItem = event.target.innerText; // Using innerText
      const clickedItem = event.dataItem; // Using dataItem if available
      this.handleClickedWidgetType(clickedItem.text)


    }
    else
    {
      // Handle single click action
      this.setState({ selectedItems: [event.dataItem] });
      // Set a timer to detect double-click
      this.timer = setTimeout(() => {
        this.timer = null; // Reset the timer
      }, 300); // Time threshold for double-click
    }
  };
  handleItemDoubleClick = (event) => {
    // Get the data item that was double-clicked
    const item = event.target.innerText; // Or use event.dataItem if you prefer

    // Handle the double-click event
    alert(`Double-clicked on: ${item}`);
  };

  handleClickedWidgetType = (clickedWidgetType) => {
    if (clickedWidgetType == "Scatter")
      this.addScatterPlotTab();
    else if (clickedWidgetType == "Parallel")
      this.addParallelPlotTab();
    else if (clickedWidgetType == "Line")
      this.addLinePlotTab();
    else if (clickedWidgetType == "Trajectory")
      this.addTrajectoryPlotTab();
      else if (clickedWidgetType == "Trajectory Map")
      this.addTrajectoryMapTab();
    else if (clickedWidgetType == "Noise Contour")
      this.addNoiseContourMapTab();
    else if (clickedWidgetType == "Cesium Map")
      this.addCesiumMapTab();
    else if (clickedWidgetType == "Drag Polar")
      this.addDragPolarPlotTab();
    else if (clickedWidgetType == "Engine Deck")
      this.addEngineDeckPlotTab();
  }

  render() {
    return (
      <Fragment>
        <div>
          <Container fluid className="iq-container" style={{ height: '100vh' }}>
            {/* KendoReact Splitter for resizable TreeView and DockLayout */}
            <Splitter style={{ height: '100%' }} orientation="horizontal">
              {/* Left Pane: TreeView */}
              <SplitterPane min="200px" size="300px" collapsible={false}>
                <div style={{ overflowY: 'auto', height: '100%' }}>
                <input type={"file"} id={"csvFileInput"} accept={".csv"} onChange={this.handleFileChange} />
                {/* <ListBox
                  data={items}
                  textField="text"
                  onItemClick={this.handleItemClick}
                  onDoubleClick={this.handleItemDoubleClick}
                  selectedItems={this.selectedItems}
                  style={{ height: '100%', width: '100%' }}
                /> */}
                <TreeView
                  data={processTreeViewItems(tree, {
                    select: this.state.select,
                    check: this.state.check,
                    expand: this.state.expand,
                  })}
                  expandIcons={true}
                  onExpandChange={this.onExpandChange}
                  aria-multiselectable={true}
                  onItemClick={this.onItemClick}
                  checkboxes={true}
                  onCheckChange={this.onCheckChange}
                />
                </div>
              </SplitterPane>

              {/* Right Pane: DockLayout */}
              <SplitterPane collapsible={false}>
                <div style={{ position: 'relative', height: '100%' }}>
                  <DockLayout
                    ref={this.getRef}
                    defaultLayout={this.defaultLayout}
                    style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 }}
                    onLayoutChange={this.handleActiveTabChange}
                  />
                </div>
              </SplitterPane>

              <SplitterPane min="200px" size="300px" collapsible={true}>
              <div style={{ flex: 1,  height: '100vh' }}>
                    
                    {this.state.PropertiesContent}
                    {this.state.activeChild === 'scatter' && <ScatterProperties ref={this.scatterPropertiesRef} parentRef={this} />}
                    {this.state.activeChild === 'parallel' && <ParallelProperties />}
                    {this.state.activeChild === 'trajectory' && <TrajectoryProperties ref={this.trajectoryPropertiesRef} parentRef={this} />}
                  </div>
              </SplitterPane>
            </Splitter>

            {/* Dialog and Button */}
            <div style={{ marginTop: '10px' }}>
              <Button onClick={this.toggleDialog}>Show Dialog</Button>
              {this.state.visible && (
                <Dialog onClose={this.toggleDialog} title={"My Dialog"}>
                  <FileManager onFilesSelected={this.handleFilesSelected} />
                  <DialogActionsBar>
                    <Button onClick={this.toggleDialog}>Close</Button>
                  </DialogActionsBar>
                </Dialog>
              )}
            </div>
          </Container>
        </div>
      </Fragment>
      
    );
  }
}

export default AtifDashboard;