// src/App.js
import React from 'react';
import '@progress/kendo-theme-default/dist/all.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './pages/login/loginform';
import Dashboard from './pages/dashboardPresets/Dashboard';
import DataMgmt from './pages/dataManagement/DataMgmt';
import GraphComponent from './pages/test_page/test';
import Plots from './pages/visualisations/Plot'
import Dashboard1 from './pages/dasboard/Dashboard';
import GraphPage from './pages/visualisations/GraphPage';



import DashboardApplication from './pages/dasboard/DashboardApplication';


import NextCloud from './pages/dasboard/NextCloud';

import Listview from './pages/dasboard/Listview';

import LineChartDemo from './pages/visualisations/line/LineChartDemo';
import ConnectionMapDemo from './pages/visualisations/map/ConnectionMapDemo';

import FileManager from './pages/file/FileManager';
import CpacsVisualisation from './pages/fileRead/CpacsVisualisation';

// import {CesiumMap} from './pages/visualisations/map/CesiumMap';



import Parent from './test/Parent';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dataMgmt" element={<DataMgmt />} />
        <Route path='/test' element={<GraphComponent /> } />
        <Route path='/plots' element={<Plots /> } />
        <Route path="/dashboard1" element={<Dashboard1 />} />
        <Route path='/graph' element={<GraphPage />}/>



        <Route path="/atif" element={<DashboardApplication />} />


        {/* <Route path="/main" element={<Main />} /> */}
        <Route path="/NextCloud" element={<NextCloud />} />
        
        <Route path="/listview" element={<Listview />} />

        <Route path="/line" element={<LineChartDemo />} />
        <Route path="/connectionmap" element={<ConnectionMapDemo />} />
        {/* <Route path="/cesium" element={<CesiumMap />} /> */}



        <Route path="/testing" element={<Parent />} />

        <Route path="/filemanager" element={<FileManager />} />
        <Route path="/cpacsvisualisation" element={<CpacsVisualisation />} />

      </Routes>
    </Router>
  );
}

export default App;
