import { Box } from "@mui/material";
// import Header from "../../components/Header";
import FileUpload from './FileUpload';
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import { Topheader } from "../../components/Topheader";
import { ColorModeContext, useMode } from "./../../theme";
import { CssBaseline, ThemeProvider } from "@mui/material";



const DataMgmt = () => {
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
              <FileUpload/>
            </div>
          </main>
        </div>
        </CssBaseline>
      </ThemeProvider>
    </ColorModeContext.Provider>
    )
}

export default DataMgmt;

