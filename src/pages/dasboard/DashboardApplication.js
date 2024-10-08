import Sidebar from "../../components/Sidebar";
import Properties from "../../components/Properties";
import Topbar from "../../components/Topbar";
import { Topheader } from "../../components/Topheader";
import { ColorModeContext, useMode } from "../../theme";
import { CssBaseline, ThemeProvider } from "@mui/material";

import AtifDashboard from "./AtifDashboard";

const DashboardApplication = () => {
    const [theme, colorMode ] = useMode();


    // Assuming you have a layout object
  const layout = {
    dockbox: {
      mode: 'horizontal',
      children: [
        {
          mode: 'vertical',
          children: [
            { tabs: [{ id: 'tab1' }] }
          ]
        },
        {
          mode: 'vertical',
          children: [
            { tabs: [{ id: 'tab2' }] }
          ]
        }
      ]
    }
  };
  
    return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline>
        <div className="content">
          <Topbar />
          <div className="app">
            <Sidebar />
            <main className='content'>
              {/* <Topbar /> */}
              {/* <Topheader/> */}
              <div className="main-content-dashboard">
                <AtifDashboard />
              </div>
            </main>
            {/* <Properties /> */}
          </div>
        </div>
        </CssBaseline>
      </ThemeProvider>
    </ColorModeContext.Provider>
    );
  };
  
  export default DashboardApplication;