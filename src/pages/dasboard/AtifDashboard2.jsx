import React, { useState } from 'react';
import DockLayout from 'rc-dock';

const AtifDashboard2 = () => {
  const [activeTab, setActiveTab] = useState(null);

  const handleActiveTabChange = (newTab) => {
    setActiveTab(newTab);
    console.log("Active tab changed to:", newTab);
  };

  const layout = {
    dockbox: {
      mode: 'horizontal',
      children: [
        {
          mode: 'vertical',
          children: [
            { tabs: [{ title: 'Tab 1', content: 'Content 1' }] },
            { tabs: [{ title: 'Tab 2', content: 'Content 2' }] },
          ],
        },
      ],
    },
  };

  return (
    <DockLayout
      style={{ width: '100%', height: '100%' }}
      defaultLayout={layout}
      onActiveTabChange={handleActiveTabChange}
    />
  );
};

export default AtifDashboard2;