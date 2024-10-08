// import * as React from "react";
// import * as ReactDOM from "react-dom";
import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from "react";
import {
  TreeList,
  mapTree,
  extendDataItem,
  TreeListSelectionCell,
  TreeListHeaderSelectionCell,
  getSelectedState,
} from "@progress/kendo-react-treelist";
import { getter } from "@progress/kendo-react-common";
import employees from "./data";
const DATA_ITEM_KEY = "id";
const SUB_ITEMS_FIELD = "employees";
const EXPAND_FIELD = "expanded";
const SELECTED_FIELD = "selected";
const idGetter = getter(DATA_ITEM_KEY);
const extendData = (dataState, selectedState, expandedState) => {
  return mapTree(dataState, SUB_ITEMS_FIELD, (item) =>
    extendDataItem(item, SUB_ITEMS_FIELD, {
      selected: selectedState[idGetter(item)],
      expanded: expandedState[idGetter(item)],
    })
  );
};
const headerSelectionValue = (dataState, selectedState) => {
  let allSelected = true;
  mapTree(dataState, SUB_ITEMS_FIELD, (item) => {
    allSelected = allSelected && selectedState[idGetter(item)];
    return item;
  });
  return allSelected;
};



const CpacsVisualisation = () => {
    const [data, setData] = useState(null);
    useEffect(() => {
        console.log("koko1");
        const fetchData = async () => {
          try
          {
            console.log("koko2");
            // const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
            const response = await fetch('http://127.0.0.1:3005/GetFile');
            console.log("koko3");
            console.log(response);
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            // const jsonData = await response.json();
            const jsonData = await response.text();
            console.log(jsonData);
            setData(jsonData);



            employees = [];
            
          }
          catch (error)
          {
            console.error('There was a problem fetching the data:', error);
          }
        };
    
        fetchData();
      }, []); // Empty dependency array ensures effect runs only once after initial render
    





    const dataState = employees.slice();
  const [selectedState, setSelectedState] = React.useState({});
  const [expandedState, setExpandedState] = React.useState({
    1: true,
    2: true,
    32: true,
  });
  const onExpandChange = React.useCallback(
    (e) => {
      setExpandedState({
        ...expandedState,
        [idGetter(e.dataItem)]: !e.value,
      });
    },
    [expandedState]
  );
  const onSelectionChange = React.useCallback(
    (event) => {
      const newSelectedState = getSelectedState({
        event,
        selectedState: selectedState,
        dataItemKey: DATA_ITEM_KEY,
      });
      setSelectedState(newSelectedState);
    },
    [selectedState]
  );
  const onHeaderSelectionChange = React.useCallback((event) => {
    const checkboxElement = event.syntheticEvent.target;
    const checked = checkboxElement.checked;
    const newSelectedState = {};
    event.dataItems.forEach((item) => {
      newSelectedState[idGetter(item)] = checked;
    });
    setSelectedState(newSelectedState);
  }, []);
  return (
    <TreeList
      style={{
        maxHeight: "510px",
        overflow: "auto",
      }}
      data={extendData(dataState, selectedState, expandedState)}
      selectedField={SELECTED_FIELD}
      expandField={EXPAND_FIELD}
      subItemsField={SUB_ITEMS_FIELD}
      dataItemKey={DATA_ITEM_KEY}
      onSelectionChange={onSelectionChange}
      onHeaderSelectionChange={onHeaderSelectionChange}
      onExpandChange={onExpandChange}
      columns={[
        {
          field: "selected",
          width: "7%",
          headerSelectionValue: headerSelectionValue(dataState, selectedState),
          cell: TreeListSelectionCell,
          headerCell: TreeListHeaderSelectionCell,
        },
        {
          field: "name",
          title: "Name",
          expandable: true,
          width: "31%",
        },
        {
          field: "position",
          title: "Position",
          width: "31%",
        },
        {
          field: "hireDate",
          title: "Hire Date",
          format: "{0:d}",
          width: "31%",
        },
      ]}
    />
  );
};

export default CpacsVisualisation;