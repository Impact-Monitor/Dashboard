//import { data } from "./data";
import React, { useState } from "react";
//import { Scatterplot } from "./Scatterplot";
import { LineChart } from "./LineChart";



const LineChartDemo = () => {

    const [data, setData] = useState(
        Array.from({ length: 100 }, () => Math.round(Math.random() * 100))
      );
    
    return (
        <div id="root">
            <LineChart data={data} />
        </div>
    );
}
export default LineChartDemo;