import * as d3 from 'd3';
//import { FeatureCollection } from 'geojson';

import useDimensions from "../useDimensions";

// type MapProps = {
//   width: number;
//   height: number;
//   data: FeatureCollection;
//   connectionData: {
//     long1: number;
//     long2: number;
//     lat1: number;
//     lat2: number;
//   }[];
// };


const DIMENSIONS = {
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    innerPadding: 0
  };

const CONNECTION_DATA = {
  start: [2.3522, 48.8566], // Paris
  end: [-74.006, 40.7128], // New York
};

export const Map = ({ width, height, data, connectionData }) => {
  
    const [wrapperRef, dimensions] = useDimensions();
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
  
    const projection = d3
    // .geoOrthographic()
    .geoMercator()
    // .geoNaturalEarth()
    //.geoConicConformal()
    .scale(Math.min(boundedWidth) / 2 / Math.PI - 0)
    .center([100, 10]);
    console.log(boundedWidth + ">>>" + boundedHeight);

  const geoPathGenerator = d3.geoPath().projection(projection);

  const backgroundMapSvgElements = data.features
    .filter((shape) => shape.id !== 'ATA')
    .map((shape) => {
      return (
        <path
          key={shape.id}
          d={geoPathGenerator(shape) ?? undefined}
          stroke="lightGrey"
          strokeWidth={0.5}
          fill="grey"
          fillOpacity={0.7}
        />
      );
    });

  const connectionSvgElements = connectionData.map((connection, i) => {
    const path = geoPathGenerator({
      type: 'LineString',
      coordinates: [
        [connection.long1, connection.lat1],
        [connection.long2, connection.lat2],
      ],
    });

    return (
      <path
        key={i}
        d={path ?? undefined}
        stroke="#cb1dd1"
        strokeWidth={2}
        fill="none"
      />
    );
  });

  return (
    <div id="root" ref={wrapperRef} style={{ marginBottom: "2rem" }}>
      <svg width={dimensions.width} height={dimensions.height}>
        {backgroundMapSvgElements}
        {connectionSvgElements}
      </svg>
    </div>
  );
};
