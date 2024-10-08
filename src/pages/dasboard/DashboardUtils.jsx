import React from 'react';
import GraphController from '../visualisations/GraphController';
import './dashboardStyle.css'

const DashboardUtils = () => {
  return (
    <div className="dashboard">
      <div className="block">
        <GraphController />
      </div>
      <div className="block">
        <GraphController />
      </div>
      <div className="block">
        <GraphController />
      </div>
    </div>
  );
};

export default DashboardUtils;


