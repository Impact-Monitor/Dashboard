import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import { Topheader } from "../../components/Topheader";
import { ColorModeContext, useMode } from "../../theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import graph1 from '../../assets/images/misc/plot1.png'
import graph2 from '../../assets/images/misc/plot2.png'
import graph3 from '../../assets/images/misc/Graph11.PNG'
import DashboardUtils from './DashboardUtils'

const Dashboard1 = () => {
    const [theme, colorMode ] = useMode();
    // const handleLogin = () => {
    //   // Add your login logic here
    //   // If login is successful, redirect to the dashboard
    // //   navigate('/dashboard');
    // };
  
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
              {/* <img src={graph1} alt="header" className="plot1"/>
              <img src={graph2} alt="header" className="plot2"/>
              <img src={graph3} alt="header" className="plot3"/> */}
              <DashboardUtils />
            </div>
          </main>
        </div>
        </CssBaseline>
      </ThemeProvider>
    </ColorModeContext.Provider>
    );
  };
  
  export default Dashboard1;