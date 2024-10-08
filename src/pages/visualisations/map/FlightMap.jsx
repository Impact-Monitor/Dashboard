import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from "react";
import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import Feature from 'ol/Feature';
import LineString from 'ol/geom/LineString';
import { Stroke, Style } from 'ol/style';
import { fromLonLat } from 'ol/proj';


// Sample flight trajectories with latitude, longitude, and altitude
let trajectories = [
    {
        flightId: "Flight A",
        points: [
            { lon: -74.005974, lat: 40.712776, alt: 1000 }, // NYC
            { lon: -50.005974, lat: 45.712776, alt: 15000 },
            { lon: -20.005974, lat: 50.712776, alt: 35000 }, // Mid-flight
            { lon: 2.352222, lat: 48.856613, alt: 5000 }     // Paris
        ]
    },
    {
        flightId: "Flight B",
        points: [
            { lon: -0.127758, lat: 51.507351, alt: 1000 },   // London
            { lon: 20.127758, lat: 60.507351, alt: 20000 },
            { lon: 40.127758, lat: 65.507351, alt: 35000 },  // Mid-flight
            { lon: 139.691711, lat: 35.689487, alt: 10000 }  // Tokyo
        ]
    }
];

export const FlightMap = forwardRef((props, ref) => {

  useImperativeHandle(ref, () => ({
    GetId,
    // SelectPoints,
    // UnselectPoints,
    // SetXAxisVariableName,
    // GetXAxisVariableName,
    // SetYAxisVariableName,
    // GetYAxisVariableName,
    // UpdateProperties,
  }));
  
  
  
  const [id, setId] = React.useState(props.id);

  const GetId = () => {
    return id;
  };

    const GetElement = (parentElement, path) => {
        let returnElement;
        let tags = path.split('/');
        for (let i = 0; i < tags.length; i++) {
          const elements = parentElement.getElementsByTagName(tags[i]);
          if (elements.length > 0) {
            returnElement = elements[0];  // Move to the next nested element
          }
          else {
            return null;  // If any part of the path is not found, return null
          }
        }
        return returnElement;
    }
    
    const InitialiseData = () => {
        const cpacsFiles = props.parentRef.getCpacsData();
    
        for (let k = 0; k < cpacsFiles.length; k++)
        {
            const xmlString = cpacsFiles[k];

            const doc = new DOMParser().parseFromString(xmlString, 'text/xml');

            const path = "cpacs/flights/flight/analyses/trajectories/trajectory/flightPoints"
            const tags = path.split('/');  // Split the path into an array of tags
            let flightPointsElement = doc;
            for (let i = 0; i < tags.length; i++) {
                const elements = flightPointsElement.getElementsByTagName(tags[i]);
                if (elements.length > 0) {
                    flightPointsElement = elements[0];  // Move to the next nested element
                }
                else {
                    return null;  // If any part of the path is not found, return null
                }
            }
    
            let latitudeElement = GetElement(flightPointsElement, "latitude");
            let latitudeArray = latitudeElement.textContent.split(';');
            let longitudeElement = GetElement(flightPointsElement, "longitude");
            let longitudeArray = longitudeElement.textContent.split(';');
            let altitudeElement = GetElement(flightPointsElement, "altitude");
            let altitudeArray = altitudeElement.textContent.split(';');

            let trajectory = {};
            trajectory.flightId = "Flight " + k;
            trajectory.points = [];
            for (let i = 0; i < altitudeArray.length; i++)
            {
                trajectory.points.push({lat: latitudeArray[i], lon: longitudeArray[i], alt: altitudeArray[i]});
            }
            trajectories.push(trajectory);
        }
    }


  useEffect(() => {
    trajectories = [];
    InitialiseData();

    // Initialize the map only after the component is mounted
    const map = new Map({
      target: `map-${id}`,  // The ID of the div where the map will be rendered
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([0, 0]),
        zoom: 2,
      }),
    });

    // Function to map altitude to a color (lower altitude = red, higher altitude = blue)
    const altitudeToColor = (altitude) => {
      const minAlt = 0;
      const maxAlt = 35000;
      const ratio = (altitude - minAlt) / (maxAlt - minAlt);
      const red = Math.min(255, Math.floor(255 * (1 - ratio)));
      const blue = Math.min(255, Math.floor(255 * ratio));
      return `rgb(${red}, 0, ${blue})`;  // Gradient from red to blue
    };

    // Create a vector layer to hold the flight lines
    const vectorSource = new VectorSource();

    trajectories.forEach(flight => {
      const coordinates = flight.points.map(point =>
        fromLonLat([point.lon, point.lat])
      );
      
      // Create a line geometry for the flight
      const line = new LineString(coordinates);
      const feature = new Feature({
        geometry: line,
        flightId: flight.flightId,
      });

      // Create a gradient color for the stroke based on altitude
      const lineStyle = new Style({
        stroke: new Stroke({
          color: altitudeToColor(flight.points[flight.points.length - 1].alt),
          width: 1,
        }),
      });

      feature.setStyle(lineStyle);
      vectorSource.addFeature(feature);
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    map.addLayer(vectorLayer);

    // Cleanup function to remove the map on unmount
    return () => {
      map.setTarget(null);
    };
  }, [trajectories]); // Re-run if trajectories data changes

  return <div id={'map-' + id} style={{ height: '100vh', width: '100%' }}></div>;
}
);
