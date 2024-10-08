import React, {createRef, memo, Fragment} from 'react';

import "rc-dock/dist/rc-dock.css";
import {DockLayout, DockContextType} from 'rc-dock';

import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { Button } from "@progress/kendo-react-buttons";
import { TreeView } from "@progress/kendo-react-treeview";

import "../../stylesheet.css";
import { Row,Col,Container} from 'react-bootstrap'
import FileManager from '../file/FileManager';

export class AtifDashboard extends React.Component {

  constructor(props) {
    super(props);

    this.state = {

    };
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
                  <button onClick={this.handleOnSubmit} >
                    IMPORT CSV DATA
                  </button>

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


  render() {
    return (
      <Fragment>
            <div >
                
                <Container fluid className=" iq-container" style={{ height: '100vh' }}>

                <div style={{ display: 'flex' }}>
                  <div style={{ flex: 3 }}>
                    <DockLayout ref={this.getRef} defaultLayout={this.defaultLayout} style={{position: 'absolute', left: 0, top: 0, right: 0, bottom: 0}} onLayoutChange={this.handleActiveTabChange}/>   
                    
                  </div>

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