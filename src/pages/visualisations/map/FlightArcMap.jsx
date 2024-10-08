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
import Papa from 'papaparse'; // For parsing CSV

import airportCSV from './airports.csv'; // Assuming you have the CSV stored locally

let flights = [
    { flightId: 'Flight 1', fromICAO: 'EGBB', toICAO: 'GCTS' },  // Example flights
    { flightId: 'Flight 2', fromICAO: 'EGBB', toICAO: 'EHAM' }
  ];

// Utility function to calculate points along a great circle path between two points
const calculateGreatCircle = (start, end, numPoints = 100) => {
  const toRadians = (deg) => (deg * Math.PI) / 180;
  const toDegrees = (rad) => (rad * 180) / Math.PI;

  const lat1 = toRadians(start.lat);
  const lon1 = toRadians(start.lon);
  const lat2 = toRadians(end.lat);
  const lon2 = toRadians(end.lon);

  const d = 2 * Math.asin(
    Math.sqrt(
      Math.pow(Math.sin((lat2 - lat1) / 2), 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin((lon2 - lon1) / 2), 2)
    )
  );

  const result = [];
  for (let i = 0; i <= numPoints; i++) {
    const f = i / numPoints; // Fraction between start and end
    const A = Math.sin((1 - f) * d) / Math.sin(d);
    const B = Math.sin(f * d) / Math.sin(d);
    const x = A * Math.cos(lat1) * Math.cos(lon1) + B * Math.cos(lat2) * Math.cos(lon2);
    const y = A * Math.cos(lat1) * Math.sin(lon1) + B * Math.cos(lat2) * Math.sin(lon2);
    const z = A * Math.sin(lat1) + B * Math.sin(lat2);

    const lat = toDegrees(Math.atan2(z, Math.sqrt(x * x + y * y)));
    const lon = toDegrees(Math.atan2(y, x));

    result.push([lon, lat]);
  }

  return result;
};

export const FlightArcMap = forwardRef((props, ref) => {
  
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
  const [airportCoordinates, setAirportCoordinates] = useState({});
  const [csvData, setCsvData] = useState('');

  const GetId = () => {
    return id;
  };

  // Function to parse the CSV file and extract airport coordinates by ICAO code
  const parseAirportCSV = (data) => {
    const parsedData = Papa.parse(data, {
      header: true,
      dynamicTyping: true,
    });

    const airportMap = {};
    parsedData.data.forEach((airport) => {
      if (airport.ICAO && airport.longitude && airport.latitude) {
        airportMap[airport.ICAO] = {
          lon: airport.longitude,
          lat: airport.latitude,
        };
      }
    });
    setAirportCoordinates(airportMap);
  };

  useEffect(() => {
    // Fetch or read the CSV data (you could read it locally or from a server)
    fetch(airportCSV)
      .then((response) => response.text())
      .then((data) => setCsvData(data));
  }, []);

  useEffect(() => {
    // Parse CSV data when it is passed
    if (csvData) {
      parseAirportCSV(csvData);
    }
  }, [csvData]);

  useEffect(() => {

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
        flights = [];
        const cpacsFiles = props.parentRef.getCpacsData();
    
        for (let k = 0; k < cpacsFiles.length; k++)
        {
            const xmlString = cpacsFiles[k];

            const doc = new DOMParser().parseFromString(xmlString, 'text/xml');

            let cpacsElement = doc.getElementsByTagName("cpacs")[0];
            let flightsElement = cpacsElement.getElementsByTagName("flights")[0];
            let flightElements = flightsElement.getElementsByTagName("flight");

            for (let i = 0; i < flightElements.length; i++)
            {
                let vehicleElement = flightElements[i].getElementsByTagName("vehicle")[0];
                if (flightElements[i].getElementsByTagName("vehicle").length == 0)
                    continue;
                let vehicleUidElement = vehicleElement.getElementsByTagName("vehicleUID")[0];
                let departureElement = flightElements[i].getElementsByTagName("departure")[0];
                let departureAirportIcaoElement = departureElement.getElementsByTagName("airportICAO")[0];
                let arrivalElement = flightElements[i].getElementsByTagName("arrival")[0];
                let arrivalAirportIcaoElement = arrivalElement.getElementsByTagName("airportICAO")[0];
                let flight = { flightId: vehicleUidElement.textContent, fromICAO: departureAirportIcaoElement.textContent, toICAO: arrivalAirportIcaoElement.textContent };
                flights.push(flight);
            }
        }
    }

    if (Object.keys(airportCoordinates).length === 0 || flights.length === 0) return;

    InitialiseData();


    const map = new Map({
      target: `map-${id}`,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([0, 0]), // Centered at [Longitude, Latitude]
        zoom: 2,
      }),
    });

    const vectorSource = new VectorSource();

    flights.forEach((flight) => {
      const startAirport = airportCoordinates[flight.fromICAO];
      const endAirport = airportCoordinates[flight.toICAO];

      if (startAirport && endAirport) {
        const arcPoints = calculateGreatCircle(startAirport, endAirport).map((point) =>
          fromLonLat(point)
        );

        const line = new LineString(arcPoints);

        const feature = new Feature({
          geometry: line,
          flightId: flight.flightId,
        });

        const lineStyle = new Style({
          stroke: new Stroke({
            color: 'blue',
            width: 0.1,
          }),
        });

        feature.setStyle(lineStyle);
        vectorSource.addFeature(feature);
      }
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    map.addLayer(vectorLayer);

    return () => {
      map.setTarget(null); // Cleanup the map on unmount
    };
  }, [airportCoordinates, flights]);

  // return <div id="map" style={{ height: '100vh', width: '100%' }}></div>;
  // const { counter } = this.state;
  return <div id={'map-' + id} style={{ height: '100vh', width: '100%' }}></div>;
}
);

// export default FlightArcMap;
