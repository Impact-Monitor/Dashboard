import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import { Topheader } from "../../components/Topheader";
import { ColorModeContext, useMode } from "../../theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import DashboardUtils from './DashboardUtils'

//var axios = require("axios");
import axios from 'axios'



const NextCloud = () => {
    const [theme, colorMode ] = useMode();




    axios.get('http://127.0.0.1:3005/GetFile')
    .then(response => {
        console.error(response.data);
    })
    .catch(error => {
        console.error(error);
    });
    

    
    // // Set username and password
    // const username = 'atif.riaz@outlook.com';
    // const password = 'Potatocar452$';

    // // Encode username and password in base64
    // //const encoded = Buffer.from(username + ':' + password).toString('base64');
    // let base64 = require('base-64');
    // const encoded = base64.encode(username + ":" + password);
    // console.error(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    // axios.get('https://use08.thegood.cloud/remote.php/dav/files/atif.riaz%40outlook.com/aaa/cpacs.xml', {
    //     headers: {
    //     'Authorization': 'Basic ' + encoded,
    //     //'Access-Control-Allow-Origin': 'localhost:3000',
    //     }
    // })
    // .then(response => {
    //     console.error(response.data);
    // })
    // .catch(error => {
    //     console.error(error);
    // });





  
    return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline>
        <div className="app">
          <Sidebar />
          <main className='content'>
            <Topbar />
            <Topheader/>
            <div className="main-content-dashboard">
              <h2>Dashboard</h2>
              <DashboardUtils />
            </div>
          </main>
        </div>
        </CssBaseline>
      </ThemeProvider>
    </ColorModeContext.Provider>
    );
  };
  
  export default NextCloud;