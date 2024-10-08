import { Box } from "@mui/material";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import { Topheader } from "../../components/Topheader";
import { ColorModeContext, useMode } from "./../../theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import GraphController from './GraphController'
import './plots.css'
import DragPolarGraph from "./aerodynamics/dargPolarPlot";
import GraphPage from "./GraphPage";
import App from "../test_page/test2";



const Plots = () => {
    const [theme, colorMode ] = useMode();
    
    return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline>
        <div className="app">
          <Sidebar />
          <main className='content'>
            <Topbar />
            <Topheader/>
            <div className="main-content-datamgmt">
              {/* <GraphController/> */}
              <DragPolarGraph />
              {/* <GraphPage /> */}
              {/* <App /> */}
            </div>
          </main>
        </div>
        </CssBaseline>
      </ThemeProvider>
    </ColorModeContext.Provider>
    )
}

export default Plots;

