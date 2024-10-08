import React, { useRef, useEffect, useState } from "react";
import {
  select,
  pointers,
  mean,
  scaleLinear,
  zoomIdentity,
  max,
  zoom
} from "d3";
//import get from "lodash.get";

import Chart from "./Chart.jsx";
import XAxis from "./xAxis";
import YAxis from "./yAxis";
import Line from "./Line";
import useDimensions from "../useDimensions";

const DIMENSIONS = {
  marginTop: 15,
  marginRight: 15,
  marginBottom: 40,
  marginLeft: 60,
  innerPadding: 10
};

// export const LineChart = () => {
//   return (
//     <div>
//       AAlloo
//     </div>
//   );
// }

export const LineChart = ({ data }) => {
  const svgRef = useRef();

  const [wrapperRef, dimensions] = useDimensions();
  const [currentYZoomState, setCurrentYZoomState] = useState();
  const [currentXZoomState, setCurrentXZoomState] = useState();

  const updatedDimensions = {
    ...DIMENSIONS,
    ...dimensions,
    boundedHeight: Math.max(
      dimensions.height - DIMENSIONS.marginTop - DIMENSIONS.marginBottom,
      0
    ),
    boundedWidth: Math.max(
      dimensions.width - DIMENSIONS.marginLeft - DIMENSIONS.marginRight,
      0
    )
  };

  const { boundedHeight, boundedWidth, innerPadding } = updatedDimensions;

  const xScale = scaleLinear()
    .domain([0, data.length - 1])
    .range([innerPadding, boundedWidth - innerPadding]);

  const yScale = scaleLinear()
    .domain([0, max(data)])
    .range([boundedHeight - innerPadding, innerPadding]);

  if (currentXZoomState) {
    const newXScale = currentXZoomState.rescaleX(xScale);
    xScale.domain(newXScale.domain());
  }

  if (currentYZoomState) {
    const newYScale = currentYZoomState.rescaleY(yScale);
    yScale.domain(newYScale.domain());
  }

  // center the action (handles multitouch)
  const center = (event, target) => {
    if (event.sourceEvent) {
      const p = pointers(event, target);
      return [mean(p, (d) => d[0]), mean(p, (d) => d[1])];
    }
    return [boundedWidth / 2, boundedHeight / 2];
  };

  useEffect(() => {
    const svg = select(svgRef.current);
    const xAxisListener = select(".x-axis-listening-rect");
    const yAxisListener = select(".y-axis-listening-rect");
    const resetListener = select(".reset-listening-rect");

    const zoomX = zoom()
      .scaleExtent([0.1, 500])
      .on("zoom", (event) => {
        const zoomState = event.transform;
        setCurrentXZoomState(zoomState);
      });

    const zoomY = zoom()
      .scaleExtent([0.1, 500])
      .on("zoom", (event) => {
        const zoomState = event.transform;
        console.log(zoomState);
        setCurrentYZoomState(zoomState);
      });

    const zoomBoth = zoom()
      .scaleExtent([0.1, 500])
      .on("zoom", function (event) {
        const zoomState = event.transform;
        setCurrentXZoomState(zoomState);
        setCurrentYZoomState(zoomState);
      });

    svg.call(zoomBoth);
    xAxisListener.call(zoomX);
    yAxisListener.call(zoomY);

    resetListener.on("contextmenu ", (e) => {
      e.preventDefault();
      xAxisListener.call(zoomX.transform, zoomIdentity);
      yAxisListener.call(zoomY.transform, zoomIdentity);
    });

    return () => {
      resetListener.on("contextmenu ", null);
    };
  }, [
    boundedWidth,
    boundedHeight,
    currentXZoomState,
    currentYZoomState,
    xScale,
    yScale
  ]);

  return (
    <React.Fragment>
      <div id="root" ref={wrapperRef} style={{ marginBottom: "2rem" }}>
        <Chart dimensions={updatedDimensions} svgRef={svgRef}>
          <XAxis scale={xScale} />
          <YAxis scale={yScale} />
          <g clipPath="url(#clip)">
            <Line xScale={xScale} yScale={yScale} data={data} />
          </g>
          <rect
            className="reset-listening-rect"
            width={dimensions.width}
            height={dimensions.height}
            x={-DIMENSIONS.marginLeft}
            y={-DIMENSIONS.marginTop}
            fill="transparent"
          />
          <rect
            className="x-axis-listening-rect"
            width={boundedWidth}
            height={dimensions.height - boundedHeight}
            y={boundedHeight}
            fill="transparent"
          />
          <rect
            className="y-axis-listening-rect"
            width={dimensions.width - boundedWidth}
            height={boundedHeight}
            x={-DIMENSIONS.marginLeft}
            fill="transparent"
          />
        </Chart>
      </div>
    </React.Fragment>
  );
};

export default LineChart;
