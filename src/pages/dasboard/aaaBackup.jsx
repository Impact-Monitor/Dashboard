import React, {createRef, memo, Fragment} from 'react';
import * as ReactDOM from 'react-dom';
// import {htmlTab, jsxTab} from "./prism-tabs";
// import {DockLayout} from '../lib';

import "rc-dock/dist/rc-dock.css";
import {DockLayout, DockContextType} from 'rc-dock';

import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { Button } from "@progress/kendo-react-buttons";
import { TreeView } from "@progress/kendo-react-treeview";


import { Scatterplot } from '../visualisations/scatter/Scatterplot';
import ScatterProperties from '../visualisations/scatter/ScatterProperties';
import { ParallelCoordinates } from '../visualisations/parallel/ParallelCoordinates';
import ParallelProperties from '../visualisations/parallel/ParallelProperties';
import { LinePlot } from '../visualisations/line/LinePlot';
import LineProperties from '../visualisations/line/LineProperties';
import { TrajectoryPlot } from '../visualisations/trajectory/TrajectoryPlot';
import TrajectoryProperties from '../visualisations/trajectory/TrajectoryProperties';
import { BarChart } from '../visualisations/bar/BarChart';
import { CesiumMap } from '../visualisations/map/CesiumMap';
import ConnectionMapDemo from '../visualisations/map/ConnectionMapDemo';
import { NoiseContourMap } from '../visualisations/map/NoiseContourMap';

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

export class AtifDashboard extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      csvData1: [],
      cpacsData1: [],
      nonStateVariable: 'Hello, non-state variable!',
      selectedComponent: null,
      PropertiesContent: <h1>atif</h1>,
      activeChild: "",

      visible: false,
      selectedFiles: [], // State to store selected files


      treeData: [
        {
          text: "Item1",
          items: [{ text: "SubItem1" }, { text: "SubItem2" }],
        },
        {
          text: "Item2",
          items: [{ text: "SubItem3" }, { text: "SubItem4" }],
        },
      ],
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
      this.setState({ 
        PropertiesContent: <div id={`scatter${this.count}`}>
        {
          <ScatterProperties ref={this.scatterPropertiesRef} parentRef={this} />
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
        let widget = this.widgetsRefs[1]; //.find(w => w.key == widgetId).value;
        widget.current.UpdateProperties();
        }
      );
    }
    else if (widgetId.startsWith("trajectory"))
    {
      this.setState({ 
        PropertiesContent: <div id={`trajectory${this.count}`}>
        {
          <TrajectoryProperties ref={this.trajectoryPropertiesRef} parentRef={this} />
        }
        </div>
        },
        () => {
          let panelData = this.dockLayout.find('PropertiesPanel');
          let tabId = panelData.activeId;
          this.dockLayout.updateTab(tabId, this.getTab3(tabId, ++this.count));
        }
      );

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
        {
          tabs: [
            {
              
              id: 'id2', title: 'Widgets', content: (
                <div>
                  <p>Click here to change the other panel.</p>
                  <button onClick={this.handleOnSubmit} >
                    IMPORT CSV DATA
                  </button>
                  <input type={"file"} id={"csvFileInput"} accept={".csv"} onChange={this.handleFileChange} />
                  <button className='btn' onClick={this.addValue}>Update Value</button>
                  <button className='btn' onClick={this.addScatterPlotTab}>Add Scatter</button>
                  <button className='btn' onClick={this.addLinePlotTab}>Add Line</button>
                  <button className='btn' onClick={this.addTrajectoryPlotTab}>Add Trajectory</button>
                  <button className='btn' onClick={this.addParallelPlotTab}>Add Parallel</button>
                  <button className='btn' onClick={this.addBarChartTab}>Add Bar</button>
                  <button className='btn' onClick={this.addConnectionMapPlotTab}>Add ConnectionMap</button>
                  <button className='btn' onClick={this.addNoiseContourMapTab}>Add NoiseContour</button>
                  <button className='btn' onClick={this.addCesiumMapTab}>Add CesiumMap</button>
                  <button className='btn' onClick={this.selectDesignsss}>Select</button>
                  <button className='btn' onClick={this.unSelectDesigns}>Unselect</button>

                  <button className='btn' onClick={this.Plot1}>Plot1Prop</button>
                  <button className='btn' onClick={this.Plot2}>Plot2Prop</button>

                  <TreeView data={this.treeData} expandIcons={true} 
                    item={this.renderItem}
                    onExpandChange={this.onExpandChange}
                    onItemDoubleClick={this.onItemClick}/>

                  
                </div>

                
              )
            }
          ],
        },
        {
          id: 'my_panel',
          tabs: [this.getTab('Welcome', 1)],
        },
        {
          id: 'PropertiesPanel',
          tabs: [this.getTab('Properties', 2)],
        }
      ]
    }
  };

  state = {saved: null};







  



  
  handleActiveTabChange = (newTab) => {
    //this.setState({ activeTab: newTab });
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    console.log("Active tab changed to:", newTab);
  };

  render() {
    return (
      <Fragment>
            <div >
                
                <Container fluid className=" iq-container" style={{ height: '100vh' }}>

                <div style={{ display: 'flex' }}>
                  <div style={{ flex: 3 }}>
                    <DockLayout ref={this.getRef} defaultLayout={this.defaultLayout} style={{position: 'absolute', left: 0, top: 0, right: 0, bottom: 0}} onLayoutChange={this.handleActiveTabChange}/>   
                    
                  </div>

                  {/* <div style={{ flex: 1,  height: '100vh', backgroundColor: 'lightblue' }}>
                    
                    {this.state.PropertiesContent}
                    {this.state.activeChild === 'scatter' && <ScatterProperties ref={this.scatterPropertiesRef} parentRef={this} />}
                    {this.state.activeChild === 'parallel' && <ParallelProperties />}
                  </div> */}

                  <div>
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

                </div>

                </Container>

            </div>
        </Fragment>
      
    );
  }
}

export default AtifDashboard;